import iconAi from '../assets/strength-icon-ai.svg'
import iconBusiness from '../assets/strength-icon-business.svg'
import iconMultiplatform from '../assets/strength-icon-multiplatform.svg'
import iconSystem from '../assets/strength-icon-system.svg'
import { experience, strengths } from '../data/portfolio'

const strengthIcons = [iconMultiplatform, iconSystem, iconBusiness, iconAi]

export default function Experience() {
  return (
    <section className="experience section" id="about" aria-labelledby="about-title">
      <div className="shell">
        <div className="section-heading reveal">
          <h2 id="about-title">ABOUT ME</h2>
          <p>持续建立方法，也保持对画面的直觉，把复杂留给过程，把清晰交给用户</p>
        </div>

        <div className="about-group reveal">
          <div className="about-group__heading">
            <h3>工作经历</h3>
          </div>
          <ol className="experience-cards" aria-label="工作经历列表">
            {experience.slice(0, 2).map((item) => (
              <li className="experience-card" aria-label={`${item.company}任职经历`} key={item.company}>
                <article>
                  <div className="experience-card__meta">
                    <time>{item.period}</time>
                    <span>{item.role}</span>
                  </div>
                  <h4>{item.company}</h4>
                  <p>{item.summary}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>

        <div className="about-group about-group--strengths reveal">
          <div className="about-group__heading">
            <h3>个人能力</h3>
          </div>
          <ul className="strengths__grid" aria-label="个人优势列表">
            {strengths.map((strength, index) => (
              <li className="strength-card" aria-label={`${strength.title}核心优势`} key={strength.title}>
                <div>
                  <h4>{strength.title}</h4>
                  <p>{strength.copy}</p>
                </div>
                <img src={strengthIcons[index]} alt="" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
