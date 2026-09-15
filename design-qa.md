# Hero Layout Design QA

## Comparison target

- Source visual truth: `C:/Users/ADMINI~1/AppData/Local/Temp/codex-clipboard-dd79860f-7178-481f-ab53-16a0e5fedf11.png`
- Implementation screenshot: `E:/chatgpt/作品集/implementation-hero-1200x853.jpg`
- Implementation URL: `http://127.0.0.1:5173/#top`
- Viewport and state: desktop, dark theme, hero at rest, `1200 x 853` CSS px.
- Source pixels: `1200 x 853`.
- Implementation pixels: `1200 x 853`.
- Density normalization: both compared at 1x; browser `devicePixelRatio` was `1`.

## Full-view comparison evidence

The reference and implementation were opened together at matching dimensions. Both use a light, transparent top navigation and a centered hero stack composed of a compact capsule, dominant title, supporting sentence, and paired actions. The implementation intentionally keeps the portfolio's existing video rather than recreating the reference's SaaS globe and dashboard.

## Required fidelity surfaces

- Fonts and typography: The reference's restrained sans-serif hierarchy is retained for navigation, labels, and the primary title. The existing Songti-style italic second line is preserved as the portfolio's own visual signature; optical weight, line height, wrapping, and contrast are balanced at desktop and mobile widths.
- Spacing and layout rhythm: Capsule and title begin at approximately the same vertical positions as the reference (`158px` and `230px`). The two-line Chinese title makes the action row lower than the one-line English reference, which is an intentional content-driven difference. Navigation, copy, actions, and scroll cue share one center axis.
- Colors and visual tokens: The site keeps its established ink, bone, fog, and copper tokens. The video is warmed and desaturated so ambient light supports the copper action rather than competing with it.
- Image quality and asset fidelity: The original locally supplied video remains full-bleed and sharp with no placeholder or synthetic replacement. The reference's product dashboard and globe were not copied because the requested scope was layout inspiration for a UI designer portfolio.
- Copy and content: Existing portfolio identity, positioning statement, project action, and contact action are retained. No SaaS copy leaks into the page.

## Focused-region comparison

A separate crop was not needed because the navigation, capsule, title, summary, and buttons are all clearly readable in the matched full-view captures. Mobile was additionally checked at `390 x 844` for wrapping and control spacing.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

1. Initial pass — blocked by a P2 vertical-rhythm mismatch: the hero stack began too low compared with the reference. Fix: desktop layout changed from vertical centering to a measured top offset while mobile retained centering. Post-fix evidence placed the capsule at `158px` and title at `230px` in the `1200 x 853` viewport.
2. Second pass — blocked by a P2 palette mismatch: a green video light competed with the warm copper reference. Fix: the existing video received a grayscale/sepia color treatment with reduced brightness. Post-fix evidence shows a consistent warm-black atmosphere without a competing cold accent.
3. Final pass — passed. Matching full-view evidence shows no remaining P0/P1/P2 issues.

## Interaction and runtime checks

- `SCROLL TO EXPLORE` navigates to `#about`; the section lands `80px` below the fixed header.
- Desktop viewport `1161 x 792` has zero horizontal overflow and a full-height hero.
- Mobile viewport `390 x 844` has zero horizontal overflow, readable three-line title wrapping, and both actions visible.
- Browser runtime errors checked: `0`.

## Follow-up polish

- P3: Once finished project imagery is supplied, the lower hero transition could be tuned to preview the first case study instead of relying only on the ambient video.

## Final result

final result: passed
