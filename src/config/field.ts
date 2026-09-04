export const FIELD_CONFIG = {
  gridSize: 20,
  gridDivisions: 20,
  nodeCount: 14,
  connectionDistance: 4.2,
  fogNear: 14,
  fogFar: 28,
  camera: { fov: 38, pos: [0, 3.8, 9.5] as const },
  dprCap: 1.6,
} as const;

export const BOOT_TIMING = {
  scanDuration: 2.8,
  lineStaggerMs: 12,
  bootLineInMs: 280,
} as const;
