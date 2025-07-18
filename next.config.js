const path = require('path');

// /_next/static/からの呼び出し対策
// hrefやsrcは絶対パスで指定
const isProd = process.env.NODE_ENV === 'production';
const prefixPath = isProd ? 'https://xxx.com' : '';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Strict Mode
  reactStrictMode: true,
  output: 'export',
  basePath: '',
  // css,jsのアセットファイルのパスにプレフィックスをつける
  assetPrefix: prefixPath,
  // 画像やhrefのパスにプレフィックスをつける。利用ファイルにて設定必要
  publicRuntimeConfig: {
    basePath: prefixPath,
  },

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // urlにスラッシュ追記
  trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  distDir: '_dist',

  // Imageタグエラー対策
  images: {
    loader: 'custom',
  },
};

module.exports = nextConfig;