import { useEffect, useRef, useState } from 'react'
import { getWebGLRenderBudget } from '../utils/webglPerformance'
import './MoltenMetal.css'

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 1, 1]
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
  ]
}

const colorModeToFloat = (mode) => (mode === 'ember' ? 1 : mode === 'frost' ? 2 : 0)

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  if (uEnableMouse) {
    p += (uMouse - 0.5) * uMouseStrength * 2.0;
  }

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;
  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;
  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;
  float g = clamp(intensity, 0.0, 1.0);
  float mid = uColorMode > 1.5 ? 0.65 : (uColorMode > 0.5 ? 0.35 : 0.5);
  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * a, a);
}
`

const ctxMap = new WeakMap()

export default function MoltenMetal({
  color1 = '#5227FF', color2 = '#FF9FFC', color3 = '#FFFFFF', speed = 0.35,
  scale = 4, detail = 3, glow = 1.6, coreSize = 0.1, swirl = 1, fold = -0.2,
  blackPoint = 0.05, brightness = 1.3, colorMode = 'molten', grain = true,
  grainIntensity = 0.05, mouseInteraction = true, mouseStrength = 0.3,
  opacity = 1, className = '',
}) {
  const containerRef = useRef(null)
  const [shouldInitialize, setShouldInitialize] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    if (!window.IntersectionObserver) {
      setShouldInitialize(true)
      return undefined
    }

    const observer = new window.IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShouldInitialize(true)
      observer.disconnect()
    }, { rootMargin: '300px 0px', threshold: 0 })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const ResizeObserverClass = window.ResizeObserver
    if (!shouldInitialize || !container || reducedMotion || !window.WebGL2RenderingContext || !ResizeObserverClass) return undefined

    let disposed = false
    let disposeWebGL = () => {}

    const initializeWebGL = async () => {
      let ogl
      try {
        ogl = await import('ogl')
      } catch {
        return
      }

      const { Mesh, Program, Renderer, Triangle } = ogl
      if (disposed || !containerRef.current) return

      let renderBudget = getWebGLRenderBudget()

    let renderer
    try {
      renderer = new Renderer({
        webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false,
        dpr: renderBudget.dpr,
      })
    } catch {
      return undefined
    }

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    const canvas = gl.canvas
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: speed }, uScale: { value: scale }, uDetail: { value: detail },
        uGlow: { value: glow }, uCoreSize: { value: Math.max(coreSize, 0.001) },
        uSwirl: { value: swirl }, uFold: { value: fold }, uBlackPoint: { value: blackPoint },
        uBrightness: { value: brightness }, uColorMode: { value: colorModeToFloat(colorMode) },
        uGrain: { value: grain ? 1 : 0 }, uGrainIntensity: { value: grainIntensity },
        uOpacity: { value: opacity }, uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: mouseStrength }, uEnableMouse: { value: mouseInteraction },
        uColor1: { value: new Float32Array(hexToRgb(color1)) },
        uColor2: { value: new Float32Array(hexToRgb(color2)) },
        uColor3: { value: new Float32Array(hexToRgb(color3)) },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    ctxMap.set(container, { program })

    const setSize = () => {
      const rect = container.getBoundingClientRect()
      renderBudget = getWebGLRenderBudget()
      renderer.dpr = renderBudget.dpr
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)))
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight
      renderer.render({ scene: mesh })
    }
    const resizeObserver = new ResizeObserverClass(setSize)
    resizeObserver.observe(container)
    setSize()

    const targetMouse = [0.5, 0.5]
    const currentMouse = [0.5, 0.5]
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      targetMouse[0] = (event.clientX - rect.left) / rect.width
      targetMouse[1] = 1 - (event.clientY - rect.top) / rect.height
    }
    const handleMouseLeave = () => {
      targetMouse[0] = 0.5
      targetMouse[1] = 0.5
    }
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    let animationFrame = 0
    let lastRenderTime = 0
    let isVisible = true
    let isPageVisible = !document.hidden
    const startTime = performance.now()
    const loop = (time) => {
      if (time - lastRenderTime >= renderBudget.frameInterval) {
        lastRenderTime = time
        program.uniforms.iTime.value = (time - startTime) * 0.001
        currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0])
        currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1])
        program.uniforms.uMouse.value[0] = currentMouse[0]
        program.uniforms.uMouse.value[1] = currentMouse[1]
        renderer.render({ scene: mesh })
      }
      animationFrame = requestAnimationFrame(loop)
    }
    const tryStart = () => {
      if (isVisible && isPageVisible && animationFrame === 0) animationFrame = requestAnimationFrame(loop)
    }
    const tryStop = () => {
      if (animationFrame !== 0) cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    const intersectionObserver = window.IntersectionObserver
      ? new window.IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) tryStart()
        else tryStop()
      }, { threshold: 0 })
      : null
    intersectionObserver?.observe(container)

    const handleVisibility = () => {
      isPageVisible = !document.hidden
      if (isPageVisible) tryStart()
      else tryStop()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    tryStart()

    disposeWebGL = () => {
      tryStop()
      resizeObserver.disconnect()
      intersectionObserver?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      ctxMap.delete(container)
      if (canvas.parentNode === container) container.removeChild(canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    }

    initializeWebGL()
    return () => {
      disposed = true
      disposeWebGL()
    }
  }, [shouldInitialize])

  useEffect(() => {
    const context = ctxMap.get(containerRef.current)
    if (!context) return
    const uniforms = context.program.uniforms
    uniforms.uSpeed.value = speed
    uniforms.uScale.value = scale
    uniforms.uDetail.value = detail
    uniforms.uGlow.value = glow
    uniforms.uCoreSize.value = Math.max(coreSize, 0.001)
    uniforms.uSwirl.value = swirl
    uniforms.uFold.value = fold
    uniforms.uBlackPoint.value = blackPoint
    uniforms.uBrightness.value = brightness
    uniforms.uColorMode.value = colorModeToFloat(colorMode)
    uniforms.uGrain.value = grain ? 1 : 0
    uniforms.uGrainIntensity.value = grainIntensity
    uniforms.uOpacity.value = opacity
    uniforms.uMouseStrength.value = mouseStrength
    uniforms.uEnableMouse.value = mouseInteraction
    uniforms.uColor1.value.set(hexToRgb(color1))
    uniforms.uColor2.value.set(hexToRgb(color2))
    uniforms.uColor3.value.set(hexToRgb(color3))
  }, [blackPoint, brightness, color1, color2, color3, colorMode, coreSize, detail, fold, glow,
    grain, grainIntensity, mouseInteraction, mouseStrength, opacity, scale, speed, swirl])

  return <div ref={containerRef} className={`molten-metal-container ${className}`.trim()} aria-hidden="true" />
}
