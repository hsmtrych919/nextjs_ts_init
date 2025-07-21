# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI作業ルール
- 必ず日本語で回答してください。
- セッション中に作成する中間ファイルは`.claude/tmp/`に配置してください
- 最終的なアウトプットは好き勝手な場所に作成しないでください。まず`.claude/tmp/`に作成した後、現状のディレクトリ構成に合わせて適切なディレクトリ内に配置すること。

## Development Commands

### Core Development
- `npm run dev` - Start development server
- `npm run build` - Development build (no prefixPath, for local testing)
- `npm run build:deploy` - Production build with prefixPath for deployment
- `npm run start` - Start production server
- `npm run serve` - Serve built files from _dist directory

### Code Quality
- `npm run eslint` - Run ESLint with auto-fix for .jsx files
- TypeScript compilation is handled by Next.js build process

### Asset Optimization
- `npm run imgmin` - Optimize images using imagemin configuration

## Architecture Overview

### Dual Environment Build System
This project uses a sophisticated dual-environment build system:
- **Development/Testing**: `npm run build` creates builds without prefixPath for local testing
- **Production**: `npm run build:deploy` sets `REAL_DEPLOY=true` to apply prefixPath for deployment

The build behavior is controlled in `next.config.js:9` where `prefixPath` is conditionally set based on `REAL_DEPLOY` environment variable.

### Path Management System
All images and links use custom components from `@features/rewrite-path.tsx`:
- `ImgPath` component: Handles image paths with basePath prefix and cache-busting
- `LinkPath` component: Manages internal links with proper path prefixes

This system allows the same codebase to work both locally and on deployment servers with different base paths.

### Component Architecture
```
components/
├── element/     # Reusable UI components (button, modal, toggle)
├── layout/      # Layout components (header, footer, layout)
└── page/        # Page-specific components
```

### Features System
The `features/` directory contains reusable functionality:
- `modal-component.tsx` - React Modal integration
- `smooth-scroll.tsx` - Smooth scrolling behavior
- `toggle-content.tsx` - GSAP-powered toggle animations
- `useInView.tsx` - IntersectionObserver hook
- `rewrite-path.tsx` - Path management utilities

### TypeScript Configuration
Path aliases are configured in `tsconfig.json:17-21`:
- `@components/*` → `components/*`
- `@features/*` → `features/*`
- `@styles/*` → `styles/*`

## Styling System
- SCSS-based styling with modular architecture
- Global styles in `styles/global/`
- Component-specific styles use CSS modules
- Comprehensive SCSS utility classes and mixins

## Key Technical Considerations

### Static Export Configuration
- Output: `'export'` for static site generation
- Custom distDir: `'_dist'`
- TrailingSlash: `true` for directory-based URLs
- Custom image loader to handle static export limitations

### Browser Compatibility
- Targets last 2 versions during development
- Can be configured for broader support in production (see README.md:109-121)

### Development Workflow
1. Always run `npm run build` + `npm run serve` to verify changes work in static export
2. Use `npm run build:deploy` only for final production builds
3. Image paths automatically include cache-busting timestamps
4. Background images in SCSS are processed and rewritten during build

## Important Files
- `next.config.js` - Contains environment-specific build configuration
- `features/rewrite-path.tsx` - Critical for path management across environments
- `pages/_app.tsx` - Handles global meta tags and basePath configuration
- `components/layout/layout.tsx` - Main layout component with feature initialization