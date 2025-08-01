# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI作業ルール
- 必ず日本語で回答してください。
- **重要**: セッション開始時に必ず今日の正確な日付を確認し、ログやレポート作成時には正しい日付（YYYY-MM-DD形式）を使用してください。
- コードや関数自体の消去によりコメントの存在意義が無くなる場合以外はファイル内の既存コメントアウト（検証用のconsole.log なども含む）は削除しない。
- セッション中に作成する中間ファイルは`.claude/tmp/`に配置してください
- 最終的なアウトプットは好き勝手な場所に作成しないでください。まず`.claude/tmp/`に作成した後、現状のディレクトリ構成に合わせて適切なディレクトリ内に配置すること。

## Essential Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Development build (local testing, no prefixPath)
- `npm run build:deploy` - Production build (with prefixPath for deployment)
- `npm run serve` - Serve static files from `_dist` directory for testing builds
- `npm run eslint` - ESLint check and fix for TypeScript files

### Asset Management
- `npm run imgmin` - Optimize images using imagemin configuration

## Architecture Overview

### Static Export Configuration
This is a **static site generation (SSG)** project using Next.js 13.5 with **dual environment build system**:

- **Development/Testing**: `npm run build` creates static files without prefixPath
- **Production**: `npm run build:deploy` applies prefixPath via `REAL_DEPLOY=true` environment variable
- **Output directory**: `_dist` (not the default `out`)
- **URL format**: Trailing slash enabled (`trailingSlash: true`)

### Key Technologies
- **Next.js 13.5** (Pages Router, not App Router)
- **TypeScript 5.8** with strict mode enabled
- **SCSS** with comprehensive styling system
- **GSAP** for animations
- **React Modal** for modal components

### Path Management System
Critical for static export functionality:

- All image paths use `ImgPath` component from `@lib/utils/rewritePath.tsx`
- All internal links use `LinkPath` component for proper basePath handling
- SCSS background images are automatically processed during build
- TypeScript path aliases configured: `@/*`, `@/components/*`, `@/lib/*`, `@/styles/*`

### Directory Structure
```
src/
├── components/
│   ├── layout/ - Header, footer, main layout components
│   └── ui/ - Reusable UI components (buttons, modals, tables, tabs, toggles)
├── lib/
│   ├── hooks/ - Custom React hooks (useInView, useTabSwitch, useToggleContent)
│   └── utils/ - Utility functions (path rewriting, smooth scroll, link handling)
└── styles/
    ├── global/ - Foundation styles, mixins, variables
    ├── modules/ - Component-specific SCSS modules
    └── style.scss - Main stylesheet entry point
```

### Important Files
- `next.config.js` - Dual environment configuration with prefixPath logic
- `imagemin.config.js` - Image optimization settings
- `tsconfig.json` - TypeScript configuration with path aliases
- `.prettierrc.js` - Code formatting rules
- `.stylelintrc.js` - SCSS linting configuration

## Development Workflow

### Testing Changes
Always test static export functionality:
```bash
npm run build
npm run serve
# Test at http://localhost:3000
```

### Code Quality
Run ESLint before committing:
```bash
npm run eslint
```

### Browser Compatibility
- Development: Last 2 versions
- Production: Can be configured for broader support via browserslist

## Important Considerations

- **Static Export Only**: This project generates static HTML files, not a server-side application
- **Path Management**: Never use relative paths for images/links - always use the provided utility components
- **Build Verification**: Always verify changes work in static export environment (`npm run build` + `npm run serve`)
- **No Interactive Git Commands**: Commands like `git rebase -i` are not supported in this environment