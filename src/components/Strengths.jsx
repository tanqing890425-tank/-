import { strengths } from '../data/portfolio'

export default function Strengths() {
  return (
    <section className="strengths section" id="strengths" aria-labelledby="strengths-title">
      <div className="shell">
        <div className="section-heading reveal">
          <h2 id="strengths-title">个人优势</h2>
          <p>持续建立方法，也保持对画面的直觉。</p>
        </div>

        <ul className="strengths__grid" aria-label="个人优势列表">
          {strengths.map((strength) => (
            <li className="strength-card reveal" aria-label={`${strength.title}核心优势`} key={strength.title}>
              <h3>{strength.title}</h3>
              <p>{strength.copy}</p>
              <span className="strength-card__mark" aria-hidden="true">↗</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
