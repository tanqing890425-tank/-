import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import WorkApp from '../src/WorkApp'
import { workProjectGallery } from '../src/data/projectGallery'
import portfolioStyles from '../src/styles/portfolio.css?raw'
import workStyles from '../src/styles/work.css?raw'

function injectWorkStyles() {
  const style = document.createElement('style')
  style.textContent = `${portfolioStyles}\n${workStyles}`
  document.head.append(style)
  return style
}

describe('Work page', () => {
  it('renders the approved Work heading and all five shared projects', () => {
    render(<WorkApp />)

    expect(screen.getByRole('heading', { level: 1, name: 'WORK' })).toBeInTheDocument()
    expect(screen.getByText('从业务结构到视觉系统，让每一次触点保持一致')).toBeInTheDocument()

    const list = screen.getByRole('list', { name: '项目作品列表' })
    const cards = [...list.children]
    expect(cards).toHaveLength(5)
    expect(cards.map((card) => within(card).getByRole('heading', { level: 2 }).textContent))
      .toEqual(workProjectGallery.map((project) => project.title))
  })

  it('prioritises only the first Work cover and lazily loads the remaining covers', () => {
    render(<WorkApp />)
    const images = within(screen.getByRole('list', { name: '项目作品列表' })).getAllByRole('img')

    expect(images[0]).toHaveAttribute('loading', 'eager')
    expect(images[0]).toHaveAttribute('fetchpriority', 'high')
    images.slice(1).forEach((image) => expect(image).toHaveAttribute('loading', 'lazy'))
    images.forEach((image) => {
      expect(image).toHaveAttribute('decoding', 'async')
      expect(image.getAttribute('src')).toMatch(/\.webp$/)
    })
  })

  it('marks Work current and lets About return to the homepage', () => {
    render(<WorkApp />)
    const banner = document.querySelector('.site-header')

    expect(within(banner).getByRole('link', { name: 'Work' }))
      .toHaveAttribute('aria-current', 'page')
    expect(within(banner).getByRole('link', { name: 'About' }))
      .toHaveAttribute('href', '/#top')
  })

  it('keeps project metadata visible outside the image', () => {
    render(<WorkApp />)
    const firstCard = screen.getByRole('list', { name: '项目作品列表' }).firstElementChild

    expect(firstCard.querySelector('.work-card__details')).toBeInTheDocument()
    expect(firstCard.querySelector('.project-card__overlay')).not.toBeInTheDocument()
    expect(within(firstCard).getByRole('list', { name: '项目标签' })).toBeInTheDocument()
  })

  it('removes project descriptions from every Work card', () => {
    render(<WorkApp />)

    const list = screen.getByRole('list', { name: '项目作品列表' })
    expect(list.querySelectorAll('.work-card__copy p')).toHaveLength(0)
    workProjectGallery.forEach((project) => {
      expect(screen.queryByText(project.description)).not.toBeInTheDocument()
    })
  })

  it('reuses the homepage project title and tag presentation', () => {
    const style = injectWorkStyles()

    try {
      render(<WorkApp />)

      const firstCard = screen.getByRole('list', { name: '项目作品列表' }).firstElementChild
      const title = firstCard.querySelector('.work-card__copy h2')
      const tags = firstCard.querySelector('.work-card__tags')
      const firstTag = tags.firstElementChild

      expect(firstCard.querySelector('.work-card__copy.project-card__copy')).toBeInTheDocument()
      expect(tags).toHaveClass('project-card__tags')
      expect(getComputedStyle(title).fontSize).toBe('22px')
      expect(getComputedStyle(title).fontWeight).toBe('500')
      expect(getComputedStyle(tags).textTransform).toBe('none')
      expect(getComputedStyle(firstTag).backgroundColor).toBe('rgba(7, 7, 8, 0.24)')
      expect(getComputedStyle(firstTag).boxShadow).toContain('inset')
    } finally {
      style.remove()
    }
  })

  it('places an 800px masked LightRays layer behind the Work content', () => {
    const style = injectWorkStyles()

    try {
      render(<WorkApp />)

      const section = screen.getByRole('region', { name: 'WORK' })
      const rays = section.querySelector('.work-page__rays')
      const inner = section.querySelector('.work-page__inner')

      expect(rays).toBeInTheDocument()
      expect(rays).toHaveAttribute('aria-hidden', 'true')
      expect(getComputedStyle(rays).position).toBe('absolute')
      expect(getComputedStyle(rays).height).toBe('800px')
      expect(getComputedStyle(rays).pointerEvents).toBe('none')
      expect(getComputedStyle(rays).maskImage).toContain('linear-gradient')
      expect(getComputedStyle(inner).zIndex).toBe('1')
    } finally {
      style.remove()
    }
  })

  it('uses the approved desktop Work page layout', () => {
    const style = injectWorkStyles()

    try {
      render(<WorkApp />)

      expect(getComputedStyle(screen.getByRole('region', { name: 'WORK' })).paddingTop).toBe('200px')
      expect(getComputedStyle(document.querySelector('.work-grid')).gridTemplateColumns)
        .toBe('repeat(2, minmax(0, 1fr))')
      expect(getComputedStyle(document.querySelector('.work-card__media')).aspectRatio).toBe('16 / 9')
      expect(getComputedStyle(document.querySelector('.work-card__copy h2')).fontSize).toBe('22px')
    } finally {
      style.remove()
    }
  })

  it('uses one-column Work cards at the approved mobile breakpoints', () => {
    const style = injectWorkStyles()
    const rules = Array.from(style.sheet.cssRules)
    const mobile760 = rules.find((rule) => (
      rule.conditionText?.includes('max-width: 760px')
      && Array.from(rule.cssRules ?? []).some((nestedRule) => nestedRule.selectorText === '.work-grid')
    ))
    const mobile720 = rules.find((rule) => (
      rule.conditionText?.includes('max-width: 720px')
      && Array.from(rule.cssRules ?? []).some((nestedRule) => nestedRule.selectorText?.includes('.work-card__copy h2'))
    ))
    const gridRule = Array.from(mobile760?.cssRules ?? [])
      .find((rule) => rule.selectorText === '.work-grid')
    const titleRule = Array.from(mobile720?.cssRules ?? [])
      .find((rule) => rule.selectorText?.includes('.work-card__copy h2'))

    try {
      expect(gridRule?.style.getPropertyValue('grid-template-columns')).toBe('1fr')
      expect(titleRule?.style.getPropertyValue('font-size')).toBe('clamp(18px, 5vw, 20px)')
    } finally {
      style.remove()
    }
  })

  it('defines reduced-motion behavior that keeps reveals visible', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)

    try {
      render(<WorkApp />)

      const reducedMotion = Array.from(style.sheet.cssRules)
        .find((rule) => rule.type === CSSRule.MEDIA_RULE && rule.conditionText.includes('prefers-reduced-motion'))
      const revealRule = Array.from(reducedMotion?.cssRules ?? [])
        .find((rule) => rule.selectorText === '.reveal')
      const globalRule = Array.from(reducedMotion?.cssRules ?? [])
        .find((rule) => rule.style?.getPropertyValue('transition-duration') === '0.01ms')

      expect(revealRule?.style.opacity).toBe('1')
      expect(revealRule?.style.transform).toBe('none')
      expect(globalRule?.style.getPropertyValue('transition-duration')).toBe('0.01ms')
      expect(globalRule?.style.getPropertyPriority('transition-duration')).toBe('important')
    } finally {
      style.remove()
    }
  })
})
