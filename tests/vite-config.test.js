// @vitest-environment node

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import viteConfig from '../vite.config'

describe('Work entry middleware', () => {
  it('ships a clean GitHub Pages deployment setup', () => {
    const ignorePath = resolve('.gitignore')
    const workflowPath = resolve('.github/workflows/deploy-pages.yml')

    expect(existsSync(ignorePath)).toBe(true)
    expect(existsSync(workflowPath)).toBe(true)

    const ignore = readFileSync(ignorePath, 'utf8')
    const workflow = readFileSync(workflowPath, 'utf8')

    expect(ignore).toContain('node_modules/')
    expect(ignore).toContain('素材/')
    expect(ignore).toContain('dist/')
    expect(workflow).toContain('npm ci')
    expect(workflow).toContain('npm run build -- --base="$BASE_PATH"')
    expect(workflow).toContain('path: ./dist')
  })

  it.each([
    ['/work', '/work/index.html'],
    ['/work?probe=1', '/work/index.html?probe=1'],
    ['/workspace', '/workspace'],
    ['/work/finance?source=about', '/work/finance/index.html?source=about'],
    ['/work/social', '/work/social/index.html'],
    ['/work/commerce', '/work/commerce/index.html'],
    ['/work/anxingrong', '/work/anxingrong/index.html'],
    ['/work/cheyouhua', '/work/cheyouhua/index.html'],
    ['/work/meiwen', '/work/meiwen/index.html'],
    ['/work/taole', '/work/taole/index.html'],
    ['/work/xichaichai', '/work/xichaichai/index.html'],
    ['/work/finance/', '/work/finance/'],
    ['/work/finance/extra', '/work/finance/extra'],
    ['/work/unknown', '/work/unknown'],
  ])('rewrites only the /work pathname while preserving its query (%s)', (url, expected) => {
    let middleware
    const workEntryPlugin = viteConfig.plugins.find((plugin) => plugin.name === 'work-entry-path')
    workEntryPlugin.configureServer({
      middlewares: {
        use(handler) {
          middleware = handler
        },
      },
    })

    const request = { url }
    middleware(request, {}, () => {})

    expect(request.url).toBe(expected)
  })

  it('rewrites query-bearing /work requests in the preview middleware too', () => {
    let middleware
    const workEntryPlugin = viteConfig.plugins.find((plugin) => plugin.name === 'work-entry-path')
    workEntryPlugin.configurePreviewServer({
      middlewares: {
        use(handler) {
          middleware = handler
        },
      },
    })

    const request = { url: '/work?probe=1' }
    middleware(request, {}, () => {})

    expect(request.url).toBe('/work/index.html?probe=1')
  })
})
