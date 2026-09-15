import tanqingLogo from '../assets/tanqing-logo.png'
import { navigationItems } from '../data/navigation'
import { withBasePath } from '../utils/siteUrl'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__main">
          <a className="site-footer__brand" href={withBasePath('/#top')} aria-label="TANQING DESIGN Home">
            <img src={tanqingLogo} alt="TANQING DESIGN" />
          </a>

          <nav className="site-footer__nav" aria-label="页脚导航">
            {navigationItems.map((item) => (
              <a href={item.href} key={item.href}>{item.label}</a>
            ))}
          </nav>
        </div>
        <p className="site-footer__copyright">© 2026 TANQING DESIGN .</p>
      </div>
    </footer>
  )
}
