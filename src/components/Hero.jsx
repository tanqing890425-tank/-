import SideRays from './SideRays'

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <SideRays
        className="hero__rays"
        speed={4}
        rayColor1="#EAB308"
        rayColor2="#96c8ff"
        intensity={2}
        spread={2}
        origin="top-right"
        tilt={0}
        saturation={2}
        blend={1}
        falloff={1.6}
        opacity={1}
      />
      <div className="shell hero__content">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow hero-intro">UI PORTFOLIO 2021-2026</p>
          <h1 className="hero-intro" id="hero-title">
            为复杂产品，
            <br />
            建立清晰而有温度的用户体验
          </h1>
          <div className="hero__actions hero-intro">
            <a className="button button--solid" href="#projects">浏览项目</a>
            <a className="button button--quiet" href="#contact">联系我</a>
          </div>
        </div>
      </div>
    </section>
  )
}
