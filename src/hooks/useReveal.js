import { useEffect } from 'react'

export default function useReveal() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll('.reveal')]

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    let lastScrollY = window.scrollY
    let scrollDirection = 'down'
    let scrollFrame = 0

    const updateScrollDirection = () => {
      if (scrollFrame) return

      scrollFrame = window.requestAnimationFrame(() => {
        const nextScrollY = window.scrollY
        if (nextScrollY !== lastScrollY) {
          scrollDirection = nextScrollY < lastScrollY ? 'up' : 'down'
          lastScrollY = nextScrollY
        }
        scrollFrame = 0
      })
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const revealOnce = entry.target.hasAttribute('data-reveal-once')

        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          if (revealOnce) observer.unobserve(entry.target)
        } else if (!revealOnce && scrollDirection === 'up' && entry.boundingClientRect.top >= window.innerHeight) {
          entry.target.classList.remove('is-visible')
        }
      })
    }, { threshold: [0, 0.14] })

    window.addEventListener('scroll', updateScrollDirection, { passive: true })
    nodes.forEach((node) => observer.observe(node))
    return () => {
      window.removeEventListener('scroll', updateScrollDirection)
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
      observer.disconnect()
    }
  }, [])
}
