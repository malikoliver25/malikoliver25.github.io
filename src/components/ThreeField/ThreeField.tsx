import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FIELD_CONFIG } from "@/config/field";

export default function ThreeField({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let disposed = false;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x06080b, FIELD_CONFIG.fogNear, FIELD_CONFIG.fogFar);
    const camera = new THREE.PerspectiveCamera(FIELD_CONFIG.camera.fov, 1, 0.1, 100);
    camera.position.set(...FIELD_CONFIG.camera.pos);
    camera.lookAt(0, 0, 0);
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, FIELD_CONFIG.dprCap));
    renderer.setClearColor(0x06080b, 1);
    const grid = new THREE.GridHelper(FIELD_CONFIG.gridSize, FIELD_CONFIG.gridDivisions, 0x1c232e, 0x141a23);
    (grid.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.55;
    (grid.material as THREE.Material & { transparent: boolean }).transparent = true;
    scene.add(grid);
    const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.9, roughness: 0.4 });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xffe81a, emissive: 0xffe81a, emissiveIntensity: 0.8, roughness: 0.4 });
    const nodes: THREE.Mesh[] = [];
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < FIELD_CONFIG.nodeCount; i++) {
      const mat = i % 4 === 0 ? amberMat : nodeMat;
      const m = new THREE.Mesh(nodeGeo, mat);
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      const y = Math.random() * 0.6 + 0.25;
      m.position.set(x, y, z);
      const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, y, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0x253041, transparent: true, opacity: 0.9 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(x, y / 2, z);
      scene.add(stem);
      scene.add(m);
      nodes.push(m);
      positions.push(new THREE.Vector3(x, y, z));
    }
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1c232e, transparent: true, opacity: 0.9 });
    const lineGroup = new THREE.Group();
    for (let i = 0; i < positions.length; i++)
      for (let j = i + 1; j < positions.length; j++)
        if (positions[i].distanceTo(positions[j]) < FIELD_CONFIG.connectionDistance) {
          const g = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
          lineGroup.add(new THREE.Line(g, lineMat));
        }
    scene.add(lineGroup);
    scene.add(new THREE.AmbientLight(0x8899b1, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(6, 8, 4);
    scene.add(dir);
    const point = new THREE.PointLight(0x00e5ff, 4, 12);
    point.position.set(0, 3, 0);
    scene.add(point);
    const planeGeo = new THREE.PlaneGeometry(22, 22);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x0e131a, roughness: 0.95, metalness: 0.05 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    const ro = new ResizeObserver(() => {
      if (!wrap || !renderer || disposed) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(wrap);
    {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    let pointerX = 0,
      pointerY = 0,
      targetX = 0,
      targetY = 0;
    const onPointer = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.6;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    wrap.addEventListener("pointermove", onPointer, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    let hidden = document.hidden;
    let visible = !hidden;
    const visHandler = () => {
      hidden = document.hidden;
      updateActive();
    };
    document.addEventListener("visibilitychange", visHandler);
    let t = 0;
    let lastTs = 0;
    const setActive = (isActive: boolean) => {
      visible = isActive && !hidden;
      wrap.dataset.animationActive = visible ? "true" : "false";
      canvas.dataset.animationActive = visible ? "true" : "false";
      wrap.classList.toggle("is-offscreen", !visible);
    };
    const updateActive = () =>
      setActive(document.visibilityState === "visible" && wrap.getBoundingClientRect().bottom > 0 && wrap.getBoundingClientRect().top < window.innerHeight);
    const tick = (now: number = performance.now()) => {
      if (disposed) return;
      if (!visible || hidden) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
      const dt = lastTs ? Math.min((now - lastTs) / 1000, 0.05) : 0.016;
      lastTs = now;
      t += dt * 0.9;
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;
      camera.position.x = pointerX * 1.2;
      camera.position.y = 3.8 + pointerY * 0.6;
      camera.lookAt(pointerX * 0.4, 0.2, 0);
      nodes.forEach((n, i) => {
        n.position.y = positions[i].y + Math.sin(t * 0.9 + i) * 0.07;
      });
      grid.position.z = Math.sin(t * 0.3) * 0.2;
      if (renderer) renderer.render(scene, camera);
    };
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const isIn = e.isIntersecting;
        setActive(isIn);
        if (isIn && !hidden && raf === 0 && !disposed) {
          lastTs = 0;
          tick();
        } else if (!isIn && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.01 }
    );
    io.observe(wrap);
    setActive(wrap.getBoundingClientRect().bottom > 0 && wrap.getBoundingClientRect().top < window.innerHeight && !hidden);
    if (visible) tick();
    const onContextLost = (e: Event) => {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    canvas.addEventListener("webglcontextlost", onContextLost as EventListener);
    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onPointer);
      wrap.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", visHandler);
      canvas.removeEventListener("webglcontextlost", onContextLost as EventListener);
      lineGroup.children.forEach((c) => {
        (c as THREE.Line).geometry.dispose();
      });
      nodes.forEach((m) => m.geometry.dispose());
      planeGeo.dispose();
      planeMat.dispose();
      nodeGeo.dispose();
      renderer?.dispose();
    };
  }, [reduced]);
  if (reduced) {
    return (
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-ink">
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/fa51902b-c2a4-4c33-a96e-a8f1ef67edc6_1600w.jpg"
          alt="Abstract neon light wave on black — Aura asset, used as reduced-motion fallback"
          className="h-full w-full object-cover opacity-60 outline outline-1 outline-[oklch(1_0_0/0.1)] -outline-offset-1"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#1C232E 1px, transparent 1px), linear-gradient(90deg, #1C232E 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>
    );
  }
  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-[#06080B]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-90" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#1C232E 1px, transparent 1px), linear-gradient(90deg, #1C232E 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
    </div>
  );
}
