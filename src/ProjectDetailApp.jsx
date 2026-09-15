import { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { findProjectDetail } from './data/projectDetails'
import useReveal from './hooks/useReveal'
import { withBasePath } from './utils/siteUrl'

export default function ProjectDetailApp({ pathname = window.location.pathname, onNavigateToWork }) {
  const project = findProjectDetail(pathname)
  const [isLeaving, setIsLeaving] = useState(false)
  const navigationTimer = useRef()

  useReveal()

  useEffect(() => {
    document.title = `${project?.title ?? '项目未找到'} | 谭清 · UI / Visual Designer`
  }, [project])

  useEffect(() => () => window.clearTimeout(navigationTimer.current), [])

  const handleBackToWork = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    if (isLeaving) return

    const navigate = () => {
      if (onNavigateToWork) onNavigateToWork()
      else window.location.assign(withBasePath('/work'))
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      navigate()
      return
    }

    setIsLeaving(true)
    navigationTimer.current = window.setTimeout(navigate, 280)
  }

  return (
    <>
      <Header activePage="work" />
      <main className={`project-detail${isLeaving ? ' is-leaving' : ''}`}>
        <div className="shell">
          <div className="project-detail__navigation reveal reveal--once" data-reveal-once style={{ '--reveal-delay': '300ms' }}>
            <a className="project-detail__back" href={withBasePath('/work')} onClick={handleBackToWork}>
              <span aria-hidden="true">←</span>Back to Work
            </a>
          </div>
          {project ? (
            <article aria-labelledby="project-detail-title">
              <div className="project-detail__intro reveal reveal--once" data-reveal-once style={{ '--reveal-delay': '420ms' }}>
                <div className="project-detail__title-row">
                  <h1 id="project-detail-title">{project.title}</h1>
                  <ul className="project-card__tags project-detail__tags" aria-label="项目标签">
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                <p className="project-detail__summary">{project.description}</p>
              </div>
              <figure className="project-detail__cover reveal reveal--once" data-reveal-once style={{ '--reveal-delay': '540ms' }}>
                <img
                  src={project.cover.image}
                  alt={project.cover.alt}
                  width="1400"
                  height="788"
                  fetchPriority="high"
                  decoding="async"
                />
              </figure>
              {project.images.length > 0 && (
                <section className="project-detail__story" aria-label="项目展示">
                  <div className="project-detail__images">
                    {project.images.map((item) => (
                      <img key={item.image} src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
                    ))}
                  </div>
                </section>
              )}
            </article>
          ) : (
            <section className="project-detail__intro reveal reveal--once" data-reveal-once>
              <h1>项目未找到</h1>
              <p className="project-detail__summary">请返回 Work 页面查看项目。</p>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
