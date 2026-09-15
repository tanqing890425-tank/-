import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export function resolveWorkEntryRequestUrl(requestUrl) {
  if (!requestUrl) return requestUrl

  const url = new URL(requestUrl, 'http://vite.local')
  const pages = [
    '/work',
    '/work/anxingrong',
    '/work/cheyouhua',
    '/work/meiwen',
    '/work/taole',
    '/work/xichaichai',
    '/work/finance',
    '/work/social',
    '/work/commerce',
  ]
  if (!pages.includes(url.pathname)) return requestUrl

  return `${url.pathname}/index.html${url.search}`
}

const rewriteWorkEntry = (req, _res, next) => {
  req.url = resolveWorkEntryRequestUrl(req.url)
  next()
}

export default defineConfig({
  base: './',
  server: {
    port: 3015,
    strictPort: true,
    host: '0.0.0.0',
  },
  plugins: [
    {
      name: 'work-entry-path',
      configureServer(server) {
        server.middlewares.use(rewriteWorkEntry)
      },
      configurePreviewServer(server) {
        server.middlewares.use(rewriteWorkEntry)
      },
    },
    react(),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 1024 * 1024,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work/index.html'),
        anxingrong: resolve(__dirname, 'work/anxingrong/index.html'),
        cheyouhua: resolve(__dirname, 'work/cheyouhua/index.html'),
        meiwen: resolve(__dirname, 'work/meiwen/index.html'),
        taole: resolve(__dirname, 'work/taole/index.html'),
        xichaichai: resolve(__dirname, 'work/xichaichai/index.html'),
        finance: resolve(__dirname, 'work/finance/index.html'),
        social: resolve(__dirname, 'work/social/index.html'),
        commerce: resolve(__dirname, 'work/commerce/index.html'),
      },
    },
  },
  test: {
    include: ['tests/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
