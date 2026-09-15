import { describe, expect, it } from 'vitest'
import { findProjectDetail } from '../src/data/projectDetails'
import { stripBasePath, withBasePath } from '../src/utils/siteUrl'

describe('GitHub Pages base paths', () => {
  it('prefixes root-relative navigation with the deployed repository path', () => {
    expect(withBasePath('/work', '/portfolio/')).toBe('/portfolio/work')
    expect(withBasePath('/#top', '/portfolio/')).toBe('/portfolio/#top')
    expect(withBasePath('/work/anxingrong', '/')).toBe('/work/anxingrong')
  })

  it('strips the repository prefix before resolving a project detail route', () => {
    expect(stripBasePath('/portfolio/work/anxingrong', '/portfolio/')).toBe('/work/anxingrong')
    expect(findProjectDetail('/portfolio/work/anxingrong', '/portfolio/')?.title).toBe('安星融')
  })

  it('keeps navigation root-relative when Vite uses a relative CDN asset base', () => {
    expect(withBasePath('/work', './')).toBe('/work')
    expect(withBasePath('/#top', './')).toBe('/#top')
    expect(stripBasePath('/work/anxingrong', './')).toBe('/work/anxingrong')
  })
})
