import { withBasePath } from '../utils/siteUrl'

export const navigationItems = [
  { label: 'About', href: withBasePath('/#top'), pageId: 'about' },
  { label: 'Work', href: withBasePath('/work'), pageId: 'work' },
]
