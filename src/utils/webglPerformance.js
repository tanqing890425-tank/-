export function getWebGLRenderBudget(
  viewportWidth = window.innerWidth,
  devicePixelRatio = window.devicePixelRatio || 1,
) {
  const isCompactScreen = viewportWidth <= 760

  return {
    dpr: Math.min(devicePixelRatio || 1, isCompactScreen ? 1 : 1.5),
    frameInterval: 1000 / (isCompactScreen ? 30 : 45),
  }
}
