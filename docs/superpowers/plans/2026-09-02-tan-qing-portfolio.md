# Tan Qing Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, runnable React + Vite portfolio site for UI / visual designer 谭清 using the approved dark editorial portrait direction.

**Architecture:** A data-driven single-page React application renders six focused page sections. Plain CSS variables provide the visual system and responsive behavior; local media and small native browser APIs provide atmosphere and motion without a UI framework or runtime animation dependency.

**Tech Stack:** React, Vite, JavaScript, CSS, Vitest, Testing Library, local MP4 media generated with `ffmpeg-static`

**Spec:** `docs/superpowers/specs/2026-09-02-tan-qing-portfolio-design.md`

## Global Constraints

- Use React + Vite and produce a runnable development server plus a successful production build.
- Desktop is the primary presentation target; the content width is approximately `1700px`.
- Use the approved “编辑部肖像” direction with a dark, restrained, premium visual tone.
- Use exact palette tokens: `#090A0C`, `#15171B`, `#E7E4DC`, `#8D9197`, `#B48666`, `#725440`.
- Use real résumé content for identity, work history, projects, phone number `17784453173`, and email `641103902@qq.com`.
- Use a local background video and a static fallback; no runtime dependency on remote media.
- First-version project artwork must be clearly abstract and must not imitate real product screenshots.
- Respect `prefers-reduced-motion`, preserve visible keyboard focus, and avoid horizontal overflow.
- The working directory is not a Git repository, so commit steps are intentionally omitted. If Git is initialized later, checkpoint after each task with messages `chore: scaffold portfolio`, `feat: add portfolio content`, `feat: build portfolio sections`, `style: apply editorial direction`, and `test: verify portfolio experience`.

## File Structure

```text
.
├── index.html                         # Vite document shell and site metadata
├── package.json                       # scripts and dependencies
├── vite.config.js                     # React and Vitest configuration
├── public/
│   └── media/
│       └── hero-atmosphere.mp4        # local generated background video
├── scripts/
│   └── generate-hero-video.mjs        # reproducible local video generator
├── src/
│   ├── App.jsx                        # section composition only
│   ├── main.jsx                       # React entry point
│   ├── assets/
│   │   └── portrait.png               # portrait extracted from the résumé PDF
│   ├── components/
│   │   ├── Contact.jsx                # full-height contact closing section
│   │   ├── Experience.jsx             # biography, history, stats, contact facts
│   │   ├── Header.jsx                 # navigation and contact action
│   │   ├── Hero.jsx                   # video, headline, portrait, primary actions
│   │   ├── ProjectArtwork.jsx         # abstract project-specific compositions
│   │   ├── SelectedProjects.jsx       # asymmetric project card grid
│   │   └── Strengths.jsx              # four capability cards
│   ├── data/
│   │   └── portfolio.js               # résumé-derived structured content
│   ├── hooks/
│   │   └── useReveal.js               # Intersection Observer enhancement
│   ├── styles/
│   │   ├── global.css                 # reset, tokens, typography, shared layout
│   │   └── portfolio.css              # section-specific visual system
│   └── test/
│       └── setup.js                   # jest-dom setup
└── tests/
    ├── app.test.jsx                   # content and interaction contract
    ├── portfolio-data.test.js         # résumé content contract
    └── styles.test.js                 # responsive and reduced-motion contract
```

---

### Task 1: Scaffold the React application and test harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.js`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/test/setup.js`
- Create: `tests/app.test.jsx`

**Interfaces:**
- Consumes: no earlier task interfaces.
- Produces: default `App()` React component and npm scripts `dev`, `build`, `preview`, `test`, `test:run`, `generate:video`.

- [ ] **Step 1: Create the Vite dependency manifest**

Run:

```powershell
npm create vite@latest . -- --template react
npm install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom ffmpeg-static
```

Update the generated scripts in `package.json` to:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "generate:video": "node scripts/generate-hero-video.mjs"
  }
}
```

- [ ] **Step 2: Configure React and Vitest**

Create `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
```

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Write the failing application-shell test**

Create `tests/app.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'

describe('portfolio application shell', () => {
  it('renders the owner identity and main landmark', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('谭清')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run the test and confirm the intended failure**

Run: `npm run test:run -- tests/app.test.jsx`

Expected: FAIL because the generated `App` does not yet contain a `main` landmark and the owner name.

- [ ] **Step 5: Add the smallest passing application shell**

Replace `src/App.jsx` with:

```jsx
export default function App() {
  return (
    <main>
      <h1>谭清</h1>
    </main>
  )
}
```

Ensure `src/main.jsx` renders `<App />` into `#root` and `index.html` includes:

```html
<meta name="description" content="谭清，UI 设计师与视觉设计师个人作品集" />
<title>谭清 · UI / Visual Designer</title>
```

- [ ] **Step 6: Run the focused test**

Run: `npm run test:run -- tests/app.test.jsx`

Expected: PASS with one passing test.

---

### Task 2: Add résumé content and reproducible local media

**Files:**
- Create: `src/data/portfolio.js`
- Create: `tests/portfolio-data.test.js`
- Create: `scripts/generate-hero-video.mjs`
- Create: `public/media/hero-atmosphere.mp4`
- Create: `src/assets/portrait.png`

**Interfaces:**
- Consumes: npm script `generate:video` from Task 1.
- Produces: named exports `profile`, `experience`, `projects`, `strengths`; local asset paths `/media/hero-atmosphere.mp4` and `src/assets/portrait.png`.

- [ ] **Step 1: Write the failing content contract**

Create `tests/portfolio-data.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { experience, profile, projects, strengths } from '../src/data/portfolio'

describe('résumé-derived portfolio data', () => {
  it('preserves public contact details', () => {
    expect(profile.phone).toBe('17784453173')
    expect(profile.email).toBe('641103902@qq.com')
    expect(profile.years).toBe(8)
  })

  it('contains the complete selected content set', () => {
    expect(experience).toHaveLength(3)
    expect(projects.map((project) => project.title)).toEqual([
      '安星融 / 车友花',
      '桃乐',
      '喜拆拆',
    ])
    expect(strengths).toHaveLength(4)
  })
})
```

- [ ] **Step 2: Confirm the data test fails**

Run: `npm run test:run -- tests/portfolio-data.test.js`

Expected: FAIL because `src/data/portfolio.js` does not exist.

- [ ] **Step 3: Implement the résumé-derived data module**

Create `src/data/portfolio.js` with these exact exported shapes:

```js
export const profile = {
  name: '谭清',
  role: 'UI / Visual Designer',
  location: '重庆',
  years: 8,
  phone: '17784453173',
  email: '641103902@qq.com',
  intro: '专注复杂业务产品的体验梳理与视觉表达，覆盖 App、H5、小程序、PC 后台与网站，从需求拆解到高保真交付完整推进。',
}

export const experience = [
  { company: '重庆惠融数字科技有限公司', role: 'UI设计师', period: '2023.03—2026.08', summary: '主导金融助贷及商业化产品的多端 UI/UX 设计，搭建设计系统并持续优化核心转化路径。' },
  { company: '重庆绿邦智联科技有限公司', role: 'UI设计师', period: '2021.11—2023.02', summary: '负责项目视觉定位、界面结构与操作流程，并与研发协作推动高质量落地。' },
  { company: '重庆宇物科技有限公司', role: 'UI设计师', period: '2021.04—2021.10', summary: '建立 App 视觉基调与基础设计规范，以用户反馈和竞品拆解推动体验优化。' },
]

export const projects = [
  { id: 'finance', title: '安星融 / 车友花', type: '金融助贷服务产品', period: '2023.11—2026.08', description: '覆盖 App、微信小程序及 H5 的多端产品生态，从 0 到 1 建立金融级 UI 设计系统与组件库。', tags: ['Design System', 'App', 'H5'] },
  { id: 'social', title: '桃乐', type: 'LBS 概念社交 App', period: '2023.03—2023.09', description: '围绕同城匹配与即时沟通，完成从功能梳理、产品原型到全流程视觉与交互设计。', tags: ['Social', 'LBS', 'UI/UE'] },
  { id: 'commerce', title: '喜拆拆', type: '潮物盲盒商城 App', period: '2021.11—2023.02', description: '建立潮流电商视觉风格，以拆盒与抽奖等高光时刻增强趣味交互和用户沉浸感。', tags: ['E-commerce', 'Visual', 'Interaction'] },
]

export const strengths = [
  { title: '全链路多端设计', copy: '覆盖需求分析、信息架构、交互设计、高保真视觉与开发走查。' },
  { title: '设计系统与规范', copy: '使用 Figma 搭建组件库和设计系统，让多端体验保持一致。' },
  { title: '业务转化与体验', copy: '在用户体验与业务目标之间建立清晰、可验证的设计路径。' },
  { title: 'AI 增强工作流', copy: '将 Codex、Claude 与 WorkBuddy 融入分析、验证和运营支持。' },
]
```

- [ ] **Step 4: Generate the local atmospheric MP4**

Create `scripts/generate-hero-video.mjs`:

```js
import { spawnSync } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import ffmpegPath from 'ffmpeg-static'

const output = resolve('public/media/hero-atmosphere.mp4')
mkdirSync(dirname(output), { recursive: true })

const source = [
  'nullsrc=s=1920x1080:r=24',
  "geq=r='14+10*sin(X/170+N/55)+8*sin(Y/230-N/80)'",
  "g='13+8*sin(X/210-N/70)+7*sin((X+Y)/270+N/90)'",
  "b='15+9*sin(Y/190+N/65)+6*sin((X-Y)/250-N/85)'",
].join(':')

const result = spawnSync(ffmpegPath, [
  '-y', '-f', 'lavfi', '-i', source,
  '-t', '8', '-vf', 'gblur=sigma=22,vignette=PI/5',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output,
], { stdio: 'inherit' })

if (result.status !== 0 || statSync(output).size < 50_000) {
  throw new Error('Hero video generation failed')
}
```

Run: `npm run generate:video`

Expected: command exits successfully and creates an MP4 larger than 50 KB.

- [ ] **Step 5: Extract the résumé portrait at usable resolution**

Use the bundled Poppler renderer to render only the portrait region from page one:

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe' -f 1 -l 1 -singlefile -png -r 300 -x 2080 -y 95 -W 430 -H 430 'C:\Users\Administrator\Desktop\谭清-UI设计师.pdf' 'src\assets\portrait'
```

Open `src/assets/portrait.png` and confirm the face is centered, the crop contains no résumé text, and the image is not stretched.

- [ ] **Step 6: Run the content contract**

Run: `npm run test:run -- tests/portfolio-data.test.js`

Expected: PASS with both data tests.

---

### Task 3: Build the semantic page sections

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/Hero.jsx`
- Create: `src/components/Experience.jsx`
- Create: `src/components/ProjectArtwork.jsx`
- Create: `src/components/SelectedProjects.jsx`
- Create: `src/components/Strengths.jsx`
- Create: `src/components/Contact.jsx`
- Modify: `src/App.jsx`
- Modify: `tests/app.test.jsx`

**Interfaces:**
- Consumes: `profile`, `experience`, `projects`, `strengths` from `src/data/portfolio.js`; `/media/hero-atmosphere.mp4`; imported `portrait.png`.
- Produces: anchor targets `top`, `about`, `projects`, `strengths`, `contact`; default React components with no required props except `ProjectArtwork({ variant })`.

- [ ] **Step 1: Expand the page contract test**

Replace `tests/app.test.jsx` with:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'

describe('portfolio page', () => {
  it('renders every required section', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /复杂产品/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '个人经历' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '精选项目' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '个人优势' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /一起创造/ })).toBeInTheDocument()
  })

  it('renders three projects and public contact actions', () => {
    render(<App />)
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getAllByRole('link', { name: /17784453173/ })[0]).toHaveAttribute('href', 'tel:17784453173')
    expect(screen.getAllByRole('link', { name: /641103902@qq.com/ })[0]).toHaveAttribute('href', 'mailto:641103902@qq.com')
  })
})
```

- [ ] **Step 2: Run the expanded contract and confirm failure**

Run: `npm run test:run -- tests/app.test.jsx`

Expected: FAIL because the required sections do not exist.

- [ ] **Step 3: Implement the navigation and Hero**

`Header.jsx` must render a `header` containing the `TAN QING®` link, four anchor links, and a contact action. `Hero.jsx` must render this content structure:

```jsx
import portrait from '../assets/portrait.png'
import { profile } from '../data/portfolio'

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <video className="hero__video" autoPlay muted loop playsInline preload="metadata" poster={portrait} aria-hidden="true">
        <source src="/media/hero-atmosphere.mp4" type="video/mp4" />
      </video>
      <div className="hero__shade" aria-hidden="true" />
      <div className="shell hero__content">
        <p className="eyebrow">{profile.role} · {profile.location}</p>
        <h1 id="hero-title">为复杂产品，<br />建立清晰而有温度的体验。</h1>
        <p className="hero__summary">八年设计经验，连接业务目标、产品体验与视觉表达。</p>
        <div className="hero__actions">
          <a className="button button--solid" href="#projects">查看精选项目</a>
          <a className="button button--quiet" href="#contact">联系我</a>
        </div>
        <figure className="hero__portrait"><img src={portrait} alt="UI 设计师谭清" /></figure>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Implement Experience, project artwork, projects, strengths, and contact**

Each section must use the data module rather than duplicate résumé strings. `ProjectArtwork.jsx` must map the exact variants `finance`, `social`, and `commerce` to abstract, decorative markup:

```jsx
export default function ProjectArtwork({ variant }) {
  return (
    <div className={`artwork artwork--${variant}`} aria-hidden="true">
      <span className="artwork__plane artwork__plane--one" />
      <span className="artwork__plane artwork__plane--two" />
      <span className="artwork__label">{variant.toUpperCase()}</span>
    </div>
  )
}
```

`SelectedProjects.jsx` must render one semantic `article` per `projects` entry. `Experience.jsx` must include the portrait, introduction, three timeline rows, the four factual stats, and clickable phone/email links. `Strengths.jsx` must render four cards. `Contact.jsx` must include a large “一起创造下一段体验。” heading and both public contact links.

- [ ] **Step 5: Compose the page**

Replace `src/App.jsx` with:

```jsx
import Contact from './components/Contact'
import Experience from './components/Experience'
import Header from './components/Header'
import Hero from './components/Hero'
import SelectedProjects from './components/SelectedProjects'
import Strengths from './components/Strengths'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Experience />
        <SelectedProjects />
        <Strengths />
        <Contact />
      </main>
    </>
  )
}
```

- [ ] **Step 6: Run page and data tests**

Run: `npm run test:run -- tests/app.test.jsx tests/portfolio-data.test.js`

Expected: PASS with all application and data assertions.

---

### Task 4: Apply the editorial visual system and restrained motion

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/portfolio.css`
- Create: `src/hooks/useReveal.js`
- Modify: `src/main.jsx`
- Modify: section components to attach `.reveal` and layout classes
- Create: `tests/styles.test.js`

**Interfaces:**
- Consumes: section class names and anchors from Task 3.
- Produces: CSS variables `--ink`, `--graphite`, `--bone`, `--fog`, `--copper`, `--copper-deep`, `.shell`, `.reveal`, `.is-visible`; hook `useReveal(): void`.

- [ ] **Step 1: Write the failing stylesheet contract**

Create `tests/styles.test.js`:

```js
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const globalCss = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8')
const portfolioCss = readFileSync(new URL('../src/styles/portfolio.css', import.meta.url), 'utf8')

describe('portfolio visual constraints', () => {
  it('uses the approved palette and 1700px shell', () => {
    expect(globalCss).toContain('--ink: #090A0C')
    expect(globalCss).toContain('--copper: #B48666')
    expect(globalCss).toMatch(/max-width:\s*1700px/)
  })

  it('supports reduced motion and narrow screens', () => {
    expect(portfolioCss).toContain('prefers-reduced-motion: reduce')
    expect(portfolioCss).toMatch(/@media\s*\(max-width:\s*760px\)/)
  })
})
```

- [ ] **Step 2: Run the style contract and confirm failure**

Run: `npm run test:run -- tests/styles.test.js`

Expected: FAIL because the stylesheets do not exist.

- [ ] **Step 3: Create global tokens and base rules**

`src/styles/global.css` must define:

```css
:root {
  color-scheme: dark;
  --ink: #090A0C;
  --graphite: #15171B;
  --bone: #E7E4DC;
  --fog: #8D9197;
  --copper: #B48666;
  --copper-deep: #725440;
  --line: rgba(231, 228, 220, 0.16);
  font-family: "Noto Sans SC", "Microsoft YaHei UI", sans-serif;
  color: var(--bone);
  background: var(--ink);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--ink); }
body { margin: 0; min-width: 320px; overflow-x: hidden; background: var(--ink); }
button, a { font: inherit; }
a { color: inherit; }
img, video { display: block; max-width: 100%; }
.shell { width: min(calc(100% - 64px), 1700px); margin-inline: auto; }
:focus-visible { outline: 2px solid var(--copper); outline-offset: 4px; }
```

Import both stylesheets from `src/main.jsx` after the React imports.

- [ ] **Step 4: Implement the approved layout and artwork styling**

In `src/styles/portfolio.css`, implement these required visual behaviors:

- Header overlays the Hero, becomes a translucent graphite surface, and preserves legible links.
- Hero fills at least one viewport, with video and shade layers behind content.
- The high-contrast italic display face is restricted to the Hero and final contact heading.
- The Hero portrait is an asymmetric vertical crop with a quiet copper rule, not a circular avatar.
- Experience uses three columns above `1100px` and collapses in reading order below it.
- Project grid uses a `1.55fr / 0.95fr` first row on wide screens, with the finance project receiving the largest card.
- Project artwork uses project-specific geometry and only low-opacity blue, purple, or copper fields over graphite.
- Strength cards share a single hairline grid rather than four floating rounded cards.
- Contact fills at least `90svh` and anchors its metadata to the bottom.
- At `760px`, navigation links condense, columns stack, type scales down, and `.shell` becomes `calc(100% - 32px)`.

- [ ] **Step 5: Add one-shot reveal behavior**

Create `src/hooks/useReveal.js`:

```js
import { useEffect } from 'react'

export default function useReveal() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll('.reveal')]
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14 })

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}
```

Call `useReveal()` once from `App`. Add `.reveal` only to section headings, experience rows, project cards, and strength cards. Do not animate every text node.

- [ ] **Step 6: Add the reduced-motion override**

End `src/styles/portfolio.css` with rules that set all transitions and animations to effectively instant, display reveal elements immediately, and hide `.hero__video` within `@media (prefers-reduced-motion: reduce)`. The portrait remains visible as the Hero fallback.

- [ ] **Step 7: Run the full test suite**

Run: `npm run test:run`

Expected: PASS for application, content, and style tests.

---

### Task 5: Verify production output and visual quality

**Files:**
- Create: `README.md`
- Modify: any source or style file only when verification reveals a defect

**Interfaces:**
- Consumes: complete site from Tasks 1–4.
- Produces: verified `dist/` production build and concise local usage documentation.

- [ ] **Step 1: Document the local workflow**

Create `README.md` containing:

````markdown
# 谭清个人作品集

React + Vite 实现的 UI / 视觉设计师个人作品集基础版本。

## 本地运行

```powershell
npm install
npm run dev
```

## 构建预览

```powershell
npm run build
npm run preview
```

项目内容位于 `src/data/portfolio.js`，后续作品图片可以在项目数据和对应卡片中替换。
````

- [ ] **Step 2: Run automated verification**

Run:

```powershell
npm run test:run
npm run build
```

Expected: every test passes; Vite exits with a successful production build and creates `dist/index.html` plus bundled assets.

- [ ] **Step 3: Start the preview and inspect desktop layouts**

Run: `npm run dev -- --host 127.0.0.1`

Open the local page and capture full-page screenshots at `1920×1080` and `1440×900`. Verify:

- Header, Hero title, portrait, and contact actions fit above the fold.
- The video moves slowly and does not reduce title contrast.
- The content shell never exceeds approximately 1700px.
- Experience columns align without crowded lines.
- The finance project is visually dominant and no artwork resembles a fake product screenshot.
- The final contact section reads as a full-screen conclusion.

- [ ] **Step 4: Inspect narrow layout and interaction states**

At `390×844`, verify there is no horizontal overflow; navigation remains usable; the Hero title does not clip; experience, projects, and strengths stack in logical order; phone and email links remain tappable. Use keyboard navigation at desktop width and confirm every link has visible focus.

- [ ] **Step 5: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and reload. Confirm the Hero video is hidden, the portrait fallback remains visible, all content is immediately visible, and no decorative motion loops.

- [ ] **Step 6: Correct defects and rerun final checks**

For each visual defect, change only the responsible component or CSS rule. Then rerun:

```powershell
npm run test:run
npm run build
```

Expected: all tests pass and the final build succeeds after the last visual correction.
