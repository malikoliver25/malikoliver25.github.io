from playwright.sync_api import sync_playwright

VIEWPORTS = {
    "Pixel 7 (mobile-chrome)": {"width": 412, "height": 915, "is_mobile": True, "has_touch": True},
    "iPhone 15 (mobile-safari)": {"width": 393, "height": 852, "is_mobile": True, "has_touch": True},
    "iPad Pro 11": {"width": 834, "height": 1194, "is_mobile": True, "has_touch": True},
    "Desktop": {"width": 1280, "height": 720, "is_mobile": False, "has_touch": False},
}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for name, vp in VIEWPORTS.items():
        print(f"\n=== {name} {vp['width']}x{vp['height']} ===")
        ctx = browser.new_context(viewport=vp, device_scale_factor=2 if vp['is_mobile'] else 1)
        page = ctx.new_page()
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        # Boot dialog
        try:
            boot = page.get_by_role("dialog", name="System boot sequence")
            if boot.is_visible(timeout=3000):
                boot.wait_for(state="hidden", timeout=10000)
        except: pass

        # Visual correctness: hero not clipped, nav usable
        try:
            hero = page.locator("h1").first
            box = hero.bounding_box()
            print(f" hero box: {box}")
            # Nav
            nav = page.get_by_role("button", name="NOVA — ASK ME!").first
            print(f" NOVA pill visible: {nav.is_visible(timeout=3000)} box={nav.bounding_box()}")
            # Check no horizontal overflow at 320-412 width
            body_width = page.evaluate("() => document.body.scrollWidth")
            viewport_w = vp['width']
            overflow = body_width - viewport_w
            print(f" body scrollWidth {body_width} vs viewport {viewport_w} overflow {overflow} {'PASS' if overflow <= 2 else 'FAIL overflow'}")
        except Exception as e:
            print(f" hero/nav check error: {e}")

        # NOVA usability on this viewport
        try:
            # Open NOVA
            pill = page.get_by_role("button", name="NOVA — ASK ME!")
            if not pill.is_visible(timeout=2000):
                pill = page.get_by_role("button", name="NOVA").first
            pill.click()
            page.wait_for_timeout(500)
            dialog = page.get_by_role("dialog", name="NOVA").first
            if not dialog.is_visible(timeout=3000):
                dialog = page.locator('[role="dialog"]').first
            print(f" NOVA dialog visible: {dialog.is_visible(timeout=3000)}")
            # Input visible and not clipped?
            inp = page.get_by_placeholder("Ask NOVA about your next project…")
            print(f" NOVA input visible: {inp.is_visible(timeout=3000)} box={inp.bounding_box()}")
            inp.fill("what does malik do")
            page.keyboard.press("Enter")
            page.wait_for_timeout(1500)
            ans = page.get_by_text("MLOps & AI Infrastructure Engineer").first
            print(f" NOVA answer visible: {ans.is_visible(timeout=5000)}")
            # Screenshot per viewport
            path = f"/tmp/mobile-nova-{name.replace(' ','_').replace('(','').replace(')','')}.png"
            page.screenshot(path=path, full_page=False)
            print(f" screenshot {path}")
            # Close
            try:
                page.get_by_role("button", name="Close chat").click(timeout=2000)
            except:
                page.keyboard.press("Escape")
        except Exception as e:
            print(f" NOVA error {name}: {e}")
            page.screenshot(path=f"/tmp/mobile-nova-{name}-error.png", full_page=True)

        # Transmission form usable at this width
        try:
            page.goto('http://localhost:5173/#transmission')
            page.wait_for_load_state('networkidle')
            try:
                boot = page.get_by_role("dialog", name="System boot sequence")
                if boot.is_visible(timeout=2000):
                    boot.wait_for(state="hidden", timeout=8000)
            except: pass
            form = page.locator("#transmission-form")
            print(f" Transmission form visible: {form.is_visible(timeout=5000)} box={form.bounding_box()}")
            # Check inputs not overlapped
            email = page.get_by_placeholder("ada@systems.co")
            print(f" email input visible: {email.is_visible(timeout=3000)}")
            page.screenshot(path=f"/tmp/mobile-transmission-{name.replace(' ','_')}.png", full_page=False)
        except Exception as e:
            print(f" Transmission check error {name}: {e}")

        ctx.close()
    browser.close()
    print("\n[done] mobile/tablet NOVA visual checks complete")
