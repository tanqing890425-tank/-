import LightRays from './LightRays'
import { workProjectGallery } from '../data/projectGallery'

export default function WorkGallery() {
  return (
    <section className="work-page" aria-labelledby="work-page-title">
      <LightRays
        className="work-page__rays"
        raysOrigin="top-center"
        raysColor="#8bcfff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
      />
      <div className="shell work-page__inner">
        <header className="work-page__heading reveal">
          <h1 id="work-page-title">WORK</h1>
          <p>从业务结构到视觉系统，让每一次触点保持一致</p>
        </header>

        <ul className="work-grid" aria-label="项目作品列表">
          {workProjectGallery.map((project, index) => (
            <li className="work-card reveal" key={project.galleryId}>
              <article aria-labelledby={`work-title-${project.galleryId}`}>
                <a className="work-card__link" href={project.detailHref} aria-labelledby={`work-title-${project.galleryId}`}>
                <div className="work-card__media">
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                  />
                </div>
                <div className="work-card__details">
                  <div className="work-card__copy project-card__copy">
                    <h2 id={`work-title-${project.galleryId}`}>{project.title}</h2>
                  </div>
                  <ul className="work-card__tags project-card__tags" aria-label="项目标签">
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
