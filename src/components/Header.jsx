import tanqingLogo from '../assets/tanqing-logo.png'
import { navigationItems } from '../data/navigation'
import { withBasePath } from '../utils/siteUrl'

export default function Header({ activePage = 'about' }) {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <a className="site-header__brand" href={withBasePath('/#top')} aria-label="TANQING DESIGN Home">
          <img src={tanqingLogo} alt="TANQING DESIGN" />
        </a>

        <nav className="site-nav" aria-label="主导航">
          {navigationItems.map((item) => (
            <a
              href={item.href}
              aria-current={item.pageId === activePage ? 'page' : undefined}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
