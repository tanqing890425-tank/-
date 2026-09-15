# 谭清个人作品集

基于 React + Vite 构建的暗色个人作品集基础版本，内容来自谭清的 UI 设计师简历。

## 本地预览

```bash
npm install
npm run dev
```

浏览器访问终端中显示的本地地址，通常为 `http://localhost:5173/`。

## 常用命令

```bash
npm run test:run   # 运行自动化测试
npm run build      # 生成生产版本
npm run preview    # 预览生产版本
```

## GitHub Pages 部署

1. 将项目根目录创建为 Git 仓库并发布到 GitHub。
2. 在 GitHub 仓库的 `Settings > Pages` 中将 `Source` 选为 `GitHub Actions`。
3. 推送到 `main` 分支后，`.github/workflows/deploy-pages.yml` 会自动构建和发布。

部署脚本会根据仓库名自动设置 GitHub Pages 子路径，项目的 Work 和详情页链接也会同步适配。

## 内容入口

- 个人信息、经历、项目与优势：`src/data/portfolio.js`
- 页面视觉样式：`src/styles/portfolio.css`
- 首屏动态背景：`src/components/SideRays.jsx`
- 项目卡片结构：`src/components/SelectedProjects.jsx`

当前项目使用统一黑色矩形作为作品占位。后续补充真实项目截图时，可在项目卡片中替换占位区域，并在 `src/data/portfolio.js` 中完善项目说明。
