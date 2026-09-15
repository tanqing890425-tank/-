import { projectGallery } from '../data/projectGallery'
import { withBasePath } from '../utils/siteUrl'

export default function SelectedProjects() {
  return (
    <section className="projects section" id="projects" aria-labelledby="projects-title">
      <div className="shell">
        <div className="section-heading reveal">
          <h2 id="projects-title">WORK PROJECTS</h2>
          <p>从业务结构到视觉系统，让每一次触点保持一致</p>
        </div>

        <div className="projects__grid">
          {projectGallery.map((project) => (
            <a
              href={project.detailHref}
              aria-labelledby={`project-title-${project.galleryId}`}
              className="project-card reveal"
              key={project.galleryId}
            >
              <div className="project-card__media">
                <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
              </div>
              <div className="project-card__overlay">
                <div className="project-card__copy">
                  <h3 id={`project-title-${project.galleryId}`}>{project.title}</h3>
                </div>
                <ul className="project-card__tags" aria-label="项目标签">
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
            </a>
          ))}
          <a className="projects__more reveal" href={withBasePath('/work')} aria-label="MORE">
            <span>MORE</span><b aria-hidden="true">→</b>
          </a>
        </div>
      </div>
    </section>
  )
}
