import { useEffect, useRef, useState } from 'react'
import { getWebGLRenderBudget } from '../utils/webglPerformance'
import './LightRays.css'

const DEFAULT_COLOR = '#ffffff'

const hexToRgb = (hex) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return match
    ? [
        Number.parseInt(match[1], 16) / 255,
        Number.parseInt(match[2], 16) / 255,
        Number.parseInt(match[3], 16) / 255,
      ]
    : [1, 1, 1]
}

const getAnchorAndDirection = (origin, width, height) => {
  const outside = 0.2

  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * height], direction: [0, 1] }
    case 'top-right':
      return { anchor: [width, -outside * height], direction: [0, 1] }
    case 'left':
      return { anchor: [-outside * width, 0.5 * height], direction: [1, 0] }
    case 'right':
      return { anchor: [(1 + outside) * width, 0.5 * height], direction: [-1, 0] }
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * height], direction: [0, -1] }
    case 'bottom-center':
      return { anchor: [0.5 * width, (1 + outside) * height], direction: [0, -1] }
    case 'bottom-right':
      return { anchor: [width, (1 + outside) * height], direction: [0, -1] }
    default:
      return { anchor: [0.5 * width, -outside * height], direction: [0, 1] }
  }
}

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1,
  saturation = 1,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0,
  distortion = 0,
  lightMode = false,
  className = '',
}) {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const uniformsRef = useRef(null)
  const meshRef = useRef(null)
  const animationIdRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 })
  const boundsRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(() => (
    typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, { threshold: 0.1 })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setReduceMotion(media.matches)
    syncPreference()
    media.addEventListener?.('change', syncPreference)

    return () => media.removeEventListener?.('change', syncPreference)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (
      !isVisible
      || reduceMotion
      || !container
      || typeof window.WebGLRenderingContext === 'undefined'
    ) return undefined

    let disposed = false
    let removeResizeListener = () => {}

    const initialize = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 10))
      if (disposed || !containerRef.current) return

      try {
        const { Mesh, Program, Renderer, Triangle } = await import('ogl')
        if (disposed || !containerRef.current) return

        let renderBudget = getWebGLRenderBudget()
        const renderer = new Renderer({
          dpr: renderBudget.dpr,
          alpha: true,
        })
        rendererRef.current = renderer

        const gl = renderer.gl
        gl.canvas.style.width = '100%'
        gl.canvas.style.height = '100%'
        containerRef.current.replaceChildren(gl.canvas)

        const vertex = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

        const fragment = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 rayPos;
uniform vec2 rayDir;
uniform vec3 raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2 mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
uniform float lightMode;

float noise(vec2 point) {
  return fract(sin(dot(point.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float rayStrength(vec2 source, vec2 referenceDirection, vec2 coordinate, float seedA, float seedB, float speed) {
  vec2 sourceToCoordinate = coordinate - source;
  vec2 normalizedDirection = normalize(sourceToCoordinate);
  float cosineAngle = dot(normalizedDirection, referenceDirection);
  float distortedAngle = cosineAngle + distortion * sin(iTime * 2.0 + length(sourceToCoordinate) * 0.01) * 0.2;
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float distance = length(sourceToCoordinate);
  float maximumDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maximumDistance - distance) / maximumDistance, 0.0, 1.0);
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed))
      + (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0,
    1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void main() {
  vec2 coordinate = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
  vec2 finalDirection = rayDir;

  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPosition = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPosition - rayPos);
    finalDirection = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 firstRay = vec4(1.0) * rayStrength(rayPos, finalDirection, coordinate, 36.2214, 21.11349, 1.5 * raysSpeed);
  vec4 secondRay = vec4(1.0) * rayStrength(rayPos, finalDirection, coordinate, 22.3991, 18.0234, 1.1 * raysSpeed);
  vec4 color = firstRay * 0.5 + secondRay * 0.4;

  if (noiseAmount > 0.0) {
    float grain = noise(coordinate * 0.01 + iTime * 0.1);
    color.rgb *= (1.0 - noiseAmount + noiseAmount * grain);
  }

  float brightness = 1.0 - (coordinate.y / iResolution.y);
  color.x *= 0.1 + brightness * 0.8;
  color.y *= 0.3 + brightness * 0.6;
  color.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(vec3(gray), color.rgb, saturation);
  }

  color.rgb *= raysColor;

  if (lightMode > 0.5) {
    vec3 mapped = vec3(1.0) - exp(-max(color.rgb, vec3(0.0)) * 1.35);
    float energy = clamp(max(mapped.r, max(mapped.g, mapped.b)), 0.0, 1.0);
    vec3 hue = mapped / max(energy, 0.0001);
    vec3 ink = mix(hue * 0.25, hue * 0.72, energy);
    color = vec4(mix(vec3(1.0), ink, energy), 1.0);
  }

  gl_FragColor = color;
}`

        const uniforms = {
          iTime: { value: 0 },
          iResolution: { value: [1, 1] },
          rayPos: { value: [0, 0] },
          rayDir: { value: [0, 1] },
          raysColor: { value: hexToRgb(raysColor) },
          raysSpeed: { value: raysSpeed },
          lightSpread: { value: lightSpread },
          rayLength: { value: rayLength },
          pulsating: { value: pulsating ? 1 : 0 },
          fadeDistance: { value: fadeDistance },
          saturation: { value: saturation },
          mousePos: { value: [0.5, 0.5] },
          mouseInfluence: { value: mouseInfluence },
          noiseAmount: { value: noiseAmount },
          distortion: { value: distortion },
          lightMode: { value: lightMode ? 1 : 0 },
        }
        uniformsRef.current = uniforms

        const geometry = new Triangle(gl)
        const program = new Program(gl, { vertex, fragment, uniforms })
        const mesh = new Mesh(gl, { geometry, program })
        meshRef.current = mesh

        const updateSize = () => {
          if (!containerRef.current || !rendererRef.current) return

          renderBudget = getWebGLRenderBudget()
          renderer.dpr = renderBudget.dpr
          const { clientWidth, clientHeight } = containerRef.current
          boundsRef.current = containerRef.current.getBoundingClientRect()
          renderer.setSize(clientWidth, clientHeight)

          const width = clientWidth * renderer.dpr
          const height = clientHeight * renderer.dpr
          uniforms.iResolution.value = [width, height]
          const { anchor, direction } = getAnchorAndDirection(raysOrigin, width, height)
          uniforms.rayPos.value = anchor
          uniforms.rayDir.value = direction
        }

        let lastRenderTime = 0
        const loop = (time) => {
          if (disposed || !rendererRef.current || !uniformsRef.current || !meshRef.current) return
          if (time - lastRenderTime >= renderBudget.frameInterval) {
            lastRenderTime = time
            uniforms.iTime.value = time * 0.001

            if (followMouse && mouseInfluence > 0) {
              const smoothing = 0.92
              smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing)
              smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing)
              uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y]
            }

            renderer.render({ scene: mesh })
          }
          animationIdRef.current = window.requestAnimationFrame(loop)
        }

        window.addEventListener('resize', updateSize)
        removeResizeListener = () => window.removeEventListener('resize', updateSize)
        updateSize()
        animationIdRef.current = window.requestAnimationFrame(loop)
      } catch {
        rendererRef.current = null
        uniformsRef.current = null
        meshRef.current = null
      }
    }

    initialize()

    return () => {
      disposed = true
      if (animationIdRef.current) window.cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
      removeResizeListener()

      try {
        rendererRef.current?.gl.getExtension('WEBGL_lose_context')?.loseContext()
        rendererRef.current?.gl.canvas.remove()
      } catch {
        // The CSS fallback remains if the WebGL context has already gone away.
      }

      rendererRef.current = null
      uniformsRef.current = null
      meshRef.current = null
    }
  }, [
    isVisible,
    reduceMotion,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    lightMode,
  ])

  useEffect(() => {
    if (!followMouse || !isVisible) return undefined

    const handleMouseMove = (event) => {
      const bounds = boundsRef.current
      if (!bounds) return
      if (!bounds.width || !bounds.height) return

      mouseRef.current = {
        x: (event.clientX - bounds.left) / bounds.width,
        y: (event.clientY - bounds.top) / bounds.height,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [followMouse, isVisible])

  return (
    <div
      ref={containerRef}
      className={`light-rays-container ${className}`.trim()}
      style={{ '--light-rays-color': raysColor }}
      aria-hidden="true"
    />
  )
}
