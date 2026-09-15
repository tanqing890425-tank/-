function normalizeBase(baseUrl) {
  if (baseUrl === '.' || baseUrl === './') return '/'
  const prefixed = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`
  return prefixed.endsWith('/') ? prefixed : `${prefixed}/`
}

export function withBasePath(path, baseUrl = import.meta.env.BASE_URL) {
  return `${normalizeBase(baseUrl)}${path.replace(/^\/+/, '')}`
}

export function stripBasePath(pathname, baseUrl = import.meta.env.BASE_URL) {
  const basePath = normalizeBase(baseUrl).replace(/\/$/, '')
  if (!basePath) return pathname
  if (pathname === basePath) return '/'
  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname
}
