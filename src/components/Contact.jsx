import arrowRight from '../assets/contact-arrow-up-right.svg'
import { profile } from '../data/portfolio'
import MoltenMetal from './MoltenMetal'

export default function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <MoltenMetal
        className="contact__molten"
        color1="#0047ff"
        color2="#6868ff"
        color3="#ffffff"
        speed={0.3}
        scale={4}
        detail={3}
        glow={1.6}
        coreSize={0.1}
        swirl={1}
        fold={-0.2}
        blackPoint={0.05}
        brightness={1.3}
        colorMode="molten"
        grain
        grainIntensity={0.05}
        mouseInteraction
        mouseStrength={0.3}
        opacity={0.3}
      />
      <div className="shell contact__inner">
        <p className="eyebrow reveal">LET’S WORK TOGETHER</p>
        <h2 className="reveal" id="contact-title">一起创造<br />下一段体验</h2>

        <div className="contact__links reveal">
          <a href={`mailto:${profile.email}`}>
            <span>EMAIL</span>
            <strong>{profile.email}</strong>
            <b aria-hidden="true"><img src={arrowRight} alt="" /></b>
          </a>
          <a href={`tel:${profile.phone}`}>
            <span>PHONE</span>
            <strong>{profile.phone}</strong>
            <b aria-hidden="true"><img src={arrowRight} alt="" /></b>
          </a>
        </div>

      </div>
    </section>
  )
}
