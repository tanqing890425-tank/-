import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import * as sideRaysModule from '../src/components/SideRays'
import contactArrow from '../src/assets/contact-arrow-up-right.svg'
import portfolioStyles from '../src/styles/portfolio.css?raw'

describe('portfolio page', () => {
  it('renders every required section', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /复杂产品/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ABOUT ME' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'WORK PROJECTS' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /一起创造/ })).toBeInTheDocument()
  })

  it('renders the five-product work wall and public contact actions', () => {
    render(<App />)
    const projectSection = screen.getByRole('region', { name: 'WORK PROJECTS' })
    const projectLinks = within(projectSection).getAllByRole('link').filter((link) => link.getAttribute('href') !== '/work')
    expect(projectLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/work/anxingrong', '/work/cheyouhua', '/work/meiwen', '/work/taole', '/work/xichaichai',
    ])
    expect(within(projectSection).getAllByRole('img')).toHaveLength(5)
    within(projectSection).getAllByRole('img').forEach((image) => {
      expect(image).toHaveAttribute('loading', 'lazy')
      expect(image).toHaveAttribute('decoding', 'async')
      expect(image.getAttribute('src')).toMatch(/\.webp$/)
    })
    expect(within(projectSection).getByRole('link', { name: 'MORE' })).toHaveAttribute('href', '/work')
    expect(screen.getAllByRole('link', { name: /17784453173/ })[0]).toHaveAttribute('href', 'tel:17784453173')
    expect(screen.getAllByRole('link', { name: /641103902@qq.com/ })[0]).toHaveAttribute('href', 'mailto:641103902@qq.com')
  })

  it('keeps the supplied brand marks alongside the uploaded project covers', () => {
    render(<App />)
    expect(screen.getAllByRole('img', { name: 'TANQING DESIGN' })).toHaveLength(2)
    expect(screen.getAllByRole('img', { name: /项目封面/ })).toHaveLength(5)
  })

  it('combines Figma experience and strengths content inside About', () => {
    render(<App />)
    const aboutSection = screen.getByRole('region', { name: 'ABOUT ME' })

    expect(within(aboutSection).getByRole('heading', { name: '工作经历' })).toBeInTheDocument()
    expect(within(aboutSection).getByRole('heading', { name: '个人能力' })).toBeInTheDocument()
    expect(within(aboutSection).getAllByRole('listitem', { name: /任职经历/ })).toHaveLength(2)
    expect(within(aboutSection).getAllByRole('listitem', { name: /核心优势/ })).toHaveLength(4)
    expect(screen.queryByRole('region', { name: '个人优势' })).not.toBeInTheDocument()
  })

  it('shows the four marked personal-ability descriptions without trailing full stops', () => {
    render(<App />)
    const aboutSection = screen.getByRole('region', { name: 'ABOUT ME' })
    const strengthsList = within(aboutSection).getByRole('list', { name: '个人优势列表' })
    const descriptions = within(strengthsList)
      .getAllByRole('listitem', { name: /核心优势/ })
      .map((card) => card.querySelector('p').textContent)

    expect(descriptions).toEqual([
      '覆盖需求分析、信息架构、交互设计、高保真视觉与开发走查',
      '负责项目视觉定位、界面结构与操作流程，并与研发协作推动高质量落地',
      '在用户体验与业务目标之间建立清晰、可验证的设计路径',
      '将 Codex、Claude、Gemini 与 WorkBuddy 融入分析、验证和运营支持',
    ])
  })

  it('shows the two work-experience card descriptions without trailing full stops', () => {
    render(<App />)
    const aboutSection = screen.getByRole('region', { name: 'ABOUT ME' })
    const experienceList = within(aboutSection).getByRole('list', { name: '工作经历列表' })
    const descriptions = within(experienceList)
      .getAllByRole('listitem', { name: /任职经历/ })
      .map((card) => card.querySelector('p').textContent)

    expect(descriptions).toEqual([
      '主导金融助贷及商业化产品的多端 UI/UX 设计，搭建设计系统并持续优化核心转化路径',
      '负责项目视觉定位、界面结构与操作流程，并与研发协作推动高质量落地',
    ])
  })

  it('keeps direct contact actions only in the closing contact section', () => {
    render(<App />)
    const header = screen.getByRole('banner')
    const experienceSection = screen.getByRole('region', { name: 'ABOUT ME' })
    expect(within(header).queryByRole('link', { name: /联系我/ })).not.toBeInTheDocument()
    expect(within(experienceSection).queryByRole('link', { name: /17784453173/ })).not.toBeInTheDocument()
    expect(within(experienceSection).queryByRole('link', { name: /641103902@qq.com/ })).not.toBeInTheDocument()
  })

  it('uses the supplied brand logo and keeps only About and Work navigation', () => {
    render(<App />)
    const header = screen.getByRole('banner')
    const logo = within(header).getByRole('link', { name: 'TANQING DESIGN Home' })
    const navigation = within(header).getByRole('navigation', { name: '主导航' })
    const links = within(navigation).getAllByRole('link')

    expect(within(logo).getByRole('img', { name: 'TANQING DESIGN' })).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/#top')
    expect(links.map((link) => link.textContent)).toEqual(['About', 'Work'])
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/#top', '/work'])
    expect(links[0]).toHaveAttribute('aria-current', 'page')
    expect(links[1]).not.toHaveAttribute('aria-current')
    expect(logo.compareDocumentPosition(navigation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the header and footer brand marks at the enlarged desktop size', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const headerBrand = within(screen.getByRole('banner')).getByRole('link', { name: 'TANQING DESIGN Home' })
    const footerBrand = within(screen.getByRole('contentinfo')).getByRole('link', { name: 'TANQING DESIGN Home' })

    expect(getComputedStyle(headerBrand).width).toBe('144px')
    expect(getComputedStyle(footerBrand).width).toBe('144px')

    style.remove()
  })

  it('keeps About current while navigating sections of the single-page homepage', async () => {
    window.history.replaceState(null, '', '#contact')
    render(<App />)
    const navigation = screen.getByRole('navigation', { name: '主导航' })

    expect(within(navigation).getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
    expect(within(navigation).getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current')

    window.history.replaceState(null, '', '#projects')
    fireEvent(window, new HashChangeEvent('hashchange'))
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(within(navigation).getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
      expect(within(navigation).getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current')
    })
    window.history.replaceState(null, '', '#top')
  })

  it('repeats the brand and About and Work navigation above the footer copyright line', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    const footerLogo = within(footer).getByRole('link', { name: 'TANQING DESIGN Home' })
    const footerNavigation = within(footer).getByRole('navigation', { name: '页脚导航' })
    const links = within(footerNavigation).getAllByRole('link')

    expect(within(footerLogo).getByRole('img', { name: 'TANQING DESIGN' })).toBeInTheDocument()
    expect(links.map((link) => link.textContent)).toEqual(['About', 'Work'])
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/#top', '/work'])
    expect(within(footer).getByText('© 2026 TANQING DESIGN .')).toBeInTheDocument()
  })

  it('keeps Contact inside main and renders the site footer as its following sibling', () => {
    render(<App />)
    const main = document.querySelector('main')
    const contact = screen.getByRole('region', { name: /一起创造/ })
    const footer = screen.getByRole('contentinfo')

    expect(main).toContainElement(contact)
    expect(main).not.toContainElement(footer)
    expect(main.nextElementSibling).toBe(footer)
    expect(within(footer).queryByRole('heading', { name: /一起创造/ })).not.toBeInTheDocument()
  })

  it('places a masked molten background behind the Contact content', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const contact = screen.getByRole('region', { name: /一起创造/ })
    const background = contact.querySelector('.contact__molten')
    const content = contact.querySelector('.contact__inner')

    expect(background).toHaveAttribute('aria-hidden', 'true')
    expect(background.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(getComputedStyle(background).position).toBe('absolute')
    expect(getComputedStyle(background).maskImage || getComputedStyle(background).webkitMaskImage).toContain('linear-gradient')
    expect(getComputedStyle(content).zIndex).toBe('2')

    style.remove()
  })

  it('uses the uploaded up-right arrow for both contact actions', () => {
    render(<App />)
    const contact = screen.getByRole('region', { name: /一起创造/ })
    const iconSources = Array.from(contact.querySelectorAll('.contact__links b img'), (image) => image.getAttribute('src'))

    expect(iconSources).toHaveLength(2)
    expect(iconSources).toEqual([contactArrow, contactArrow])
  })

  it('presents the Figma work history as a two-card group instead of a timeline', () => {
    render(<App />)
    const experienceList = screen.getByRole('list', { name: '工作经历列表' })

    expect(within(experienceList).getAllByRole('listitem', { name: /任职经历/ })).toHaveLength(2)
    expect(experienceList).toHaveClass('experience-cards')
  })

  it('keeps only project titles and type tags in image overlays and removes project dates', () => {
    render(<App />)
    const projectSection = screen.getByRole('region', { name: 'WORK PROJECTS' })

    expect(projectSection.querySelectorAll('.project-card__media')).toHaveLength(5)
    expect(projectSection.querySelectorAll('.project-card__overlay')).toHaveLength(5)
    expect(projectSection.querySelectorAll('.project-card__overlay h3')).toHaveLength(5)
    expect(projectSection.querySelectorAll('.project-card__tags')).toHaveLength(5)
    expect(projectSection.querySelectorAll('.project-card__type')).toHaveLength(0)
    expect(projectSection.querySelectorAll('.project-card__copy p')).toHaveLength(0)
    expect(projectSection.querySelectorAll('time')).toHaveLength(0)
  })

  it('keeps every project tile at a 16:9 ratio without changing the grid width', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const projectSection = screen.getByRole('region', { name: 'WORK PROJECTS' })
    const tiles = projectSection.querySelectorAll('.project-card, .projects__more')

    expect(tiles).toHaveLength(6)
    expect(Array.from(tiles, (tile) => getComputedStyle(tile).aspectRatio)).toEqual(
      Array(6).fill('16 / 9'),
    )

    style.remove()
  })

  it('renders Work project titles at 22px on desktop', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const projectSection = screen.getByRole('region', { name: 'WORK PROJECTS' })
    const projectTitle = projectSection.querySelector('.project-card__copy h3')

    expect(getComputedStyle(projectTitle).fontSize).toBe('22px')

    style.remove()
  })

  it('scales Work project titles between 18px and 20px below 720px', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)

    const mobileRule = Array.from(style.sheet.cssRules).find(
      (rule) => [rule.conditionText, rule.media?.mediaText]
        .some((condition) => condition?.includes('max-width: 720px')),
    )
    const projectTitleRule = Array.from(mobileRule?.cssRules ?? []).find(
      (rule) => rule.selectorText?.includes('.project-card__copy h3'),
    )

    expect(projectTitleRule?.style.getPropertyValue('font-size')).toBe('clamp(18px, 5vw, 20px)')

    style.remove()
  })

  it('uses the portfolio identity in the hero', () => {
    render(<App />)
    expect(screen.getAllByText('UI PORTFOLIO 2021-2026')).toHaveLength(1)
    expect(screen.queryByText('8 年设计实践')).not.toBeInTheDocument()
  })

  it('places a non-interactive ray background behind the hero content', () => {
    render(<App />)
    const hero = screen.getByRole('region', { name: /复杂产品/ })
    const rays = hero.querySelector('.side-rays-container')
    const content = hero.querySelector('.hero__content')

    expect(rays).toHaveAttribute('aria-hidden', 'true')
    expect(rays.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('uses the uploaded yellow and blue SideRays palette in the Hero background', () => {
    render(<App />)
    const hero = screen.getByRole('region', { name: /复杂产品/ })
    const rays = hero.querySelector('.side-rays-container')

    expect(rays.style.getPropertyValue('--side-ray-color-1')).toBe('#EAB308')
    expect(rays.style.getPropertyValue('--side-ray-color-2')).toBe('#96c8ff')
  })

  it('uses the approved desktop heights for the hero and ray animation', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const hero = screen.getByRole('region', { name: /复杂产品/ })
    const rays = hero.querySelector('.hero__rays')
    const content = hero.querySelector('.hero__content')

    expect(getComputedStyle(hero).minHeight).toBe('1000px')
    expect(getComputedStyle(rays).height).toBe('800px')
    expect(getComputedStyle(content).paddingTop).toBe('260px')

    style.remove()
  })

  it('extends the Hero fade across a smoother 360px transition range', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const hero = screen.getByRole('region', { name: /复杂产品/ })
    const computed = getComputedStyle(hero)

    expect(computed.getPropertyValue('--hero-fade-start').trim()).toBe('440px')
    expect(computed.getPropertyValue('--hero-fade-height').trim()).toBe('360px')

    style.remove()
  })

  it('stages the hero copy within 1.8 seconds', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const hero = screen.getByRole('region', { name: /复杂产品/ })
    const stages = [
      hero.querySelector('.hero__eyebrow'),
      hero.querySelector('h1'),
      hero.querySelector('.hero__actions'),
    ]
    const toMilliseconds = (value) => value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000
    const delays = stages.map((stage) => toMilliseconds(getComputedStyle(stage).animationDelay))
    const finalDuration = toMilliseconds(getComputedStyle(stages.at(-1)).animationDuration)

    expect(stages.every((stage) => stage.classList.contains('hero-intro'))).toBe(true)
    expect(delays).toEqual([150, 550, 1000])
    expect(finalDuration).toBe(800)
    expect(delays[2] + finalDuration).toBe(1800)

    style.remove()
  })

  it('uses reduced WebGL render budgets on desktop and mobile', () => {
    expect(sideRaysModule.getWebGLRenderBudget?.(1440, 2)).toEqual({
      dpr: 1.5,
      frameInterval: 1000 / 45,
    })
    expect(sideRaysModule.getWebGLRenderBudget?.(390, 3)).toEqual({
      dpr: 1,
      frameInterval: 1000 / 30,
    })
  })

  it('defers the Contact WebGL background until it nears the viewport', () => {
    const originalObserver = window.IntersectionObserver
    const observerInstances = []

    class TestIntersectionObserver {
      constructor(callback, options = {}) {
        this.callback = callback
        this.options = options
        this.targets = []
        observerInstances.push(this)
      }

      observe(target) { this.targets.push(target) }
      unobserve() {}
      disconnect() {}
    }

    window.IntersectionObserver = TestIntersectionObserver
    globalThis.IntersectionObserver = TestIntersectionObserver

    try {
      render(<App />)
      const moltenObserver = observerInstances.find((observer) => (
        observer.targets.some((target) => target.classList.contains('contact__molten'))
      ))

      expect(moltenObserver).toBeDefined()
      expect(moltenObserver.options.rootMargin).toBe('300px 0px')
    } finally {
      if (originalObserver === undefined) {
        delete window.IntersectionObserver
        delete globalThis.IntersectionObserver
      } else {
        window.IntersectionObserver = originalObserver
        globalThis.IntersectionObserver = originalObserver
      }
      vi.restoreAllMocks()
    }
  })

  it('delays scroll reveals by 300ms and uses an 1100ms easing window', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const target = screen.getByRole('region', { name: 'ABOUT ME' }).querySelector('.section-heading')
    const toMilliseconds = (value) => value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000

    target.classList.remove('is-visible')
    const hiddenStyle = getComputedStyle(target)
    expect(hiddenStyle.transitionProperty.split(',').map((value) => value.trim())).toEqual(['opacity', 'transform'])
    expect(hiddenStyle.transitionDuration.split(',').map((value) => toMilliseconds(value.trim()))).toEqual([1100])
    expect(hiddenStyle.transitionDelay.split(',').map((value) => toMilliseconds(value.trim()))).toEqual([0])

    target.classList.add('is-visible')
    const visibleStyle = getComputedStyle(target)
    expect(visibleStyle.transitionDelay.split(',').map((value) => toMilliseconds(value.trim()))).toEqual([300])

    style.remove()
  })

  it('keeps the hero free of the removed scroll cue', () => {
    render(<App />)
    expect(screen.queryByRole('link', { name: 'SCROLL TO EXPLORE' })).not.toBeInTheDocument()
  })

  it('keeps reveal content visible when Intersection Observer is unavailable', async () => {
    render(<App />)
    await waitFor(() => {
      expect(document.querySelectorAll('.reveal:not(.is-visible)')).toHaveLength(0)
    })
  })

  it('reveals content on entry and hides lower content after it leaves while scrolling upward', async () => {
    const originalObserver = window.IntersectionObserver
    const observerInstances = []
    const scrollFrames = []
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      scrollFrames.push(callback)
      return scrollFrames.length
    })

    class TestIntersectionObserver {
      constructor(callback, options = {}) {
        this.callback = callback
        this.options = options
        this.targets = []
        observerInstances.push(this)
      }

      observe(target) {
        this.targets.push(target)
      }

      unobserve() {}
      disconnect() {}
    }

    window.IntersectionObserver = TestIntersectionObserver
    globalThis.IntersectionObserver = TestIntersectionObserver

    try {
      render(<App />)
      await waitFor(() => {
        expect(observerInstances.some((observer) => observer.targets.some((target) => target.classList.contains('reveal')))).toBe(true)
      })

      const observer = observerInstances.find((instance) => instance.targets.some((target) => target.classList.contains('reveal')))
      const target = observer.targets.find((node) => node.classList.contains('section-heading'))

      expect(observer.options.threshold).toContain(0)

      Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 })
      fireEvent.scroll(window)
      fireEvent.scroll(window)
      expect(requestFrame).toHaveBeenCalledTimes(1)
      act(() => scrollFrames.shift()(16))
      act(() => observer.callback([{ target, isIntersecting: true, boundingClientRect: { top: 180 } }]))
      expect(target).toHaveClass('is-visible')

      Object.defineProperty(window, 'scrollY', { configurable: true, value: 300 })
      fireEvent.scroll(window)
      act(() => scrollFrames.shift()(32))
      act(() => observer.callback([{ target, isIntersecting: false, boundingClientRect: { top: 900 } }]))
      expect(target).not.toHaveClass('is-visible')
    } finally {
      if (originalObserver === undefined) {
        delete window.IntersectionObserver
        delete globalThis.IntersectionObserver
      } else {
        window.IntersectionObserver = originalObserver
        globalThis.IntersectionObserver = originalObserver
      }
      requestFrame.mockRestore()
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    }
  })

  it('uses the approved desktop section spacing for About, Work, and Contact', () => {
    const style = document.createElement('style')
    style.textContent = portfolioStyles
    document.head.append(style)
    render(<App />)

    const about = screen.getByRole('region', { name: 'ABOUT ME' })
    const projects = screen.getByRole('region', { name: 'WORK PROJECTS' })
    const contact = screen.getByRole('region', { name: /一起创造/ })
    const contactInner = contact.querySelector('.contact__inner')

    expect(getComputedStyle(about).paddingTop).toBe('0px')
    expect(getComputedStyle(about).paddingBottom).toBe('200px')
    expect(getComputedStyle(projects).paddingTop).toBe('0px')
    expect(getComputedStyle(projects).paddingBottom).toBe('200px')
    expect(Number.parseFloat(getComputedStyle(contact).minHeight)).toBe(0)
    expect(Number.parseFloat(getComputedStyle(contactInner).minHeight)).toBe(0)
    expect(getComputedStyle(contactInner).paddingTop).toBe('0px')
    expect(getComputedStyle(contactInner).paddingBottom).toBe('200px')

    style.remove()
  })
})
