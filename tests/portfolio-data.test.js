import { describe, expect, it } from 'vitest'
import { experience, profile, projects, strengths } from '../src/data/portfolio'
import { projectGallery, workProjectGallery } from '../src/data/projectGallery'

describe('résumé-derived portfolio data', () => {
  it('preserves public contact details', () => {
    expect(profile.phone).toBe('17784453173')
    expect(profile.email).toBe('641103902@qq.com')
    expect(profile.years).toBe(8)
  })

  it('contains the complete selected content set', () => {
    expect(experience).toHaveLength(3)
    expect(projects.map((project) => project.title)).toEqual([
      '安星融',
      '车友花',
      '魅纹',
      '桃乐',
      '喜拆拆',
    ])
    expect(projects.map((project) => project.tags)).toEqual([
      ['App/小程序', '互联网金融', '融资担保'],
      ['App/小程序', '互联网金融', '汽车金融'],
      ['App', '视频社交'],
      ['App', '婚恋交友'],
      ['App', '潮玩电商', '盲盒'],
    ])
    expect(strengths).toHaveLength(4)
  })

  it('provides one shared five-item gallery and the approved Work ordering', () => {
    expect(projectGallery).toHaveLength(5)
    expect(new Set(projectGallery.map((item) => item.galleryId)).size).toBe(5)
    expect(projectGallery.every((item) => item.image && item.alt && item.description)).toBe(true)
    expect(workProjectGallery.map((item) => item.title)).toEqual([
      '安星融', '车友花', '魅纹', '桃乐', '喜拆拆',
    ])
    expect(projectGallery.map((item) => item.image)).toEqual([
      expect.stringContaining('anxingrong.webp'),
      expect.stringContaining('cheyouhua.webp'),
      expect.stringContaining('meiwen.webp'),
      expect.stringContaining('taole.webp'),
      expect.stringContaining('xichaichai.webp'),
    ])
  })
})
