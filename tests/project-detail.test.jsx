import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProjectDetailApp from '../src/ProjectDetailApp'
import WorkApp from '../src/WorkApp'
import { findProjectDetail } from '../src/data/projectDetails'
import '../src/styles/project-detail.css'

describe('project detail navigation', () => {
  it('links every Work card to its project detail', () => {
    render(<WorkApp />)
    const gallery = screen.getByRole('list', { name: '项目作品列表' })
    expect(within(gallery).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/work/anxingrong', '/work/cheyouhua', '/work/meiwen', '/work/taole', '/work/xichaichai',
    ])
  })

  it.each([
    ['/work/anxingrong', '安星融', ['App/小程序', '互联网金融', '融资担保']],
    ['/work/cheyouhua', '车友花', ['App/小程序', '互联网金融', '汽车金融']],
    ['/work/meiwen', '魅纹', ['App', '视频社交']],
    ['/work/taole/', '桃乐', ['App', '婚恋交友']],
    ['/work/xichaichai/index.html', '喜拆拆', ['App', '潮玩电商', '盲盒']],
  ])('renders the matching project at %s and always returns to Work', (pathname, title, tags) => {
    render(<ProjectDetailApp pathname={pathname} />)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: '项目标签' })).getAllByRole('listitem').map((item) => item.textContent)).toEqual(tags)
    expect(screen.getByRole('link', { name: 'Back to Work' })).toHaveAttribute('href', '/work')
    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')
    expect(within(screen.getByRole('main')).getAllByRole('img').every((img) => img.getAttribute('src') && img.getAttribute('alt'))).toBe(true)
  })

  it.each([
    ['/work/cheyouhua', [
      '/src/assets/projects/details/cheyouhua/1.webp',
      '/src/assets/projects/details/cheyouhua/2.webp',
      '/src/assets/projects/details/cheyouhua/3.webp',
      '/src/assets/projects/details/cheyouhua/4.webp',
      '/src/assets/projects/details/cheyouhua/5.webp',
      '/src/assets/projects/details/cheyouhua/6.webp',
    ]],
    ['/work/meiwen', [
      '/src/assets/projects/details/meiwen/1.webp',
      '/src/assets/projects/details/meiwen/2.webp',
      '/src/assets/projects/details/meiwen/3.webp',
      '/src/assets/projects/details/meiwen/4.webp',
      '/src/assets/projects/details/meiwen/5.webp',
      '/src/assets/projects/details/meiwen/6.webp',
      '/src/assets/projects/details/meiwen/7.webp',
      '/src/assets/projects/details/meiwen/8.webp',
      '/src/assets/projects/details/meiwen/9.webp',
    ]],
    ['/work/taole', [
      '/src/assets/projects/details/taole/1.webp',
      '/src/assets/projects/details/taole/2.webp',
      '/src/assets/projects/details/taole/3.webp',
      '/src/assets/projects/details/taole/4.webp',
      '/src/assets/projects/details/taole/5.webp',
      '/src/assets/projects/details/taole/6.webp',
    ]],
    ['/work/xichaichai', [
      '/src/assets/projects/details/xichaichai/1.webp',
      '/src/assets/projects/details/xichaichai/2.webp',
      '/src/assets/projects/details/xichaichai/3.webp',
    ]],
  ])('renders the project content images in numeric filename order at %s', (pathname, expectedSources) => {
    render(<ProjectDetailApp pathname={pathname} />)

    const contentImages = within(screen.getByRole('main')).getAllByRole('img').slice(1)
    expect(contentImages.map((image) => image.getAttribute('src'))).toEqual(expectedSources)
    contentImages.forEach((image) => {
      expect(window.getComputedStyle(image).width).toBe('100%')
      expect(window.getComputedStyle(image).height).toBe('auto')
      expect(image).not.toHaveClass('reveal')
      expect(image).not.toHaveAttribute('data-reveal-once')
    })
  })

  it('renders the nine Anxingrong content images in numeric filename order', () => {
    render(<ProjectDetailApp pathname="/work/anxingrong" />)

    const detailImages = within(screen.getByRole('main')).getAllByRole('img')
    expect(detailImages).toHaveLength(10)
    expect(detailImages.slice(1).map((image) => image.getAttribute('src'))).toEqual([
      '/src/assets/projects/details/anxingrong/1.webp',
      '/src/assets/projects/details/anxingrong/2.webp',
      '/src/assets/projects/details/anxingrong/3.webp',
      '/src/assets/projects/details/anxingrong/4.webp',
      '/src/assets/projects/details/anxingrong/5.webp',
      '/src/assets/projects/details/anxingrong/6.webp',
      '/src/assets/projects/details/anxingrong/7.webp',
      '/src/assets/projects/details/anxingrong/8.webp',
      '/src/assets/projects/details/anxingrong/9.webp',
    ])

    detailImages.slice(1).forEach((image) => {
      expect(window.getComputedStyle(image).width).toBe('100%')
      expect(window.getComputedStyle(image).height).toBe('auto')
      expect(image).not.toHaveClass('reveal')
      expect(image).not.toHaveClass('reveal--once')
      expect(image).not.toHaveAttribute('data-reveal-once')
      expect(image.style.getPropertyValue('--reveal-delay')).toBe('')
    })
  })

  it.each([
    ['/work/finance', '安星融'],
    ['/work/social', '桃乐'],
    ['/work/commerce', '喜拆拆'],
  ])('keeps the legacy detail address %s available', (pathname, title) => {
    render(<ProjectDetailApp pathname={pathname} />)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })

  it.each([
    ['/work/finance', '您身边的互联网金融综合融资与助贷服务平台'],
    ['/work/social', 'LBS 概念社交 App'],
    ['/work/commerce', '潮物盲盒商城 App'],
  ])('omits the secondary story heading and copy at %s', (pathname, heading) => {
    render(<ProjectDetailApp pathname={pathname} />)
    expect(screen.queryByRole('heading', { level: 2, name: heading })).not.toBeInTheDocument()
    expect(document.querySelector('.project-detail__story-copy')).not.toBeInTheDocument()
  })

  it('does not show the finance project for an unrecognised project address', () => {
    expect(findProjectDetail('/work/unknown')).toBeUndefined()
    expect(findProjectDetail('/work/finance/extra')).toBeUndefined()
    render(<ProjectDetailApp pathname="/work/unknown" />)
    expect(screen.getByRole('heading', { level: 1, name: '项目未找到' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Work' })).toHaveAttribute('href', '/work')
  })

  it('keeps the detail cover visible after its first viewport entry', async () => {
    const originalObserver = window.IntersectionObserver
    const observerInstances = []

    class TestIntersectionObserver {
      constructor(callback) {
        this.callback = callback
        this.targets = []
        this.unobserved = []
        observerInstances.push(this)
      }

      observe(target) { this.targets.push(target) }
      unobserve(target) { this.unobserved.push(target) }
      disconnect() {}
    }

    window.IntersectionObserver = TestIntersectionObserver
    globalThis.IntersectionObserver = TestIntersectionObserver

    try {
      render(<ProjectDetailApp pathname="/work/finance" />)
      await waitFor(() => expect(observerInstances.length).toBeGreaterThan(0))

      const observer = observerInstances[0]
      const cover = document.querySelector('.project-detail__cover')
      expect(cover).toHaveAttribute('data-reveal-once')

      act(() => observer.callback([{ target: cover, isIntersecting: true, boundingClientRect: { top: 500 } }]))
      expect(cover).toHaveClass('is-visible')
      expect(observer.unobserved).toContain(cover)

      act(() => observer.callback([{ target: cover, isIntersecting: false, boundingClientRect: { top: 900 } }]))
      expect(cover).toHaveClass('is-visible')
    } finally {
      if (originalObserver === undefined) {
        delete window.IntersectionObserver
        delete globalThis.IntersectionObserver
      } else {
        window.IntersectionObserver = originalObserver
        globalThis.IntersectionObserver = originalObserver
      }
    }
  })

  it('plays the detail exit transition before Back to Work navigation', () => {
    vi.useFakeTimers()
    const navigateToWork = vi.fn()

    try {
      render(<ProjectDetailApp pathname="/work/finance" onNavigateToWork={navigateToWork} />)
      fireEvent.click(screen.getByRole('link', { name: 'Back to Work' }))

      expect(screen.getByRole('main')).toHaveClass('is-leaving')
      expect(navigateToWork).not.toHaveBeenCalled()

      act(() => vi.runAllTimers())
      expect(navigateToWork).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })
})
