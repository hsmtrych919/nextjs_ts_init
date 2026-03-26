# 実装プロンプト: Step 1 — Next.js バージョンアップ + Tailwind v4 導入

---

## Source of Truth

- 計画書: `_plan/tw-migration-plan-2026-03-23.md` §2（バージョン構成）、§3（ビルドパイプライン）、§14 Step 1
- tw_source 参照ファイル: `tw_source/tailwind.config.js`、`tw_source/src/scss/tailwind-base.css`

---

## 目的

現在の Next.js 13 + React 18 環境を Next.js 15 + React 19 に上げ、Tailwind CSS v4 を `@tailwindcss/postcss` 経由で導入する。この Step 完了後、Tailwind ユーティリティクラスが TSX で使用可能な状態にする。既存の SCSS スタイルは一切壊さない。

---

## 作業後の最終到達状態

1. `npm run build` がエラーなく完了する
2. `npm run serve` で全ページが正常表示される（既存スタイルが崩れていない）
3. TSX に Tailwind ユーティリティクラス（例: `mt-4`）を書けば反映される状態
4. 以下のファイルが正しく配置・設定されている:
   - `package.json`: next ^15、react/react-dom ^19、@tailwindcss/postcss と tailwindcss が devDependencies に存在
   - `postcss.config.js`: `@tailwindcss/postcss` と `autoprefixer` が設定されている
   - `tailwind.config.js`（プロジェクトルート）: tw_source からコピーし `content` のみ変更済み
   - `src/styles/tailwind-base.css`: tw_source からコピーし `@config` パス修正済み
   - `pages/_app.tsx`: `tailwind-base.css` の import が追加されている

---

## スコープ（変更してよいファイル）

- `package.json`（バージョン変更 + パッケージ追加のみ）
- `postcss.config.js`
- `tailwind.config.js`（新規作成。tw_source からコピー）
- `src/styles/tailwind-base.css`（新規作成。tw_source からコピー）
- `pages/_app.tsx`（import 追加のみ）
- `package-lock.json`（npm install による自動更新）
- `next.config.js`（Next.js 15 対応で必要な場合のみ。変更した場合は報告で明記）

## 非スコープ（変更してはならないファイル）

- `src/styles/` 配下の既存 SCSS ファイル全て
- `src/components/` 配下の TSX ファイル全て（_app.tsx を除く）
- `src/lib/` 配下の全ファイル
- `tw_source/` 配下の全ファイル（参照のみ、変更禁止）

## 判断禁止事項

- 既存の SCSS ファイルを「Tailwind に合わせて」修正してはならない
- 既存のコンポーネントに Tailwind クラスを追加してはならない（動作確認用の一時的なテストも禁止）
- Next.js 15 の breaking changes に対応するためと称して、コンポーネントのロジックを変更してはならない（ビルドエラーが出た場合はエラー内容を報告して停止）
- `eslint-config-next` のバージョンを変更してはならない（既に ^15.4.2 が入っている）

---

## 作業手順

### 1-1. package.json のバージョン変更

```
next: 現在の値 → "^15"
react: 現在の値 → "^19.0.0"
react-dom: 現在の値 → "^19.0.0"
```

devDependencies に追加:
```
"@tailwindcss/postcss": "^4"
"tailwindcss": "^4"
```

### 1-2. postcss.config.js の更新

以下の内容に書き換える:
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### 1-3. tailwind.config.js の配置

`tw_source/tailwind.config.js` をプロジェクトルートにコピーする。

コピー後、`content` プロパティのみ以下に変更する:
```js
content: [
  './pages/**/*.{ts,tsx}',
  './src/components/**/*.{ts,tsx}',
],
```

それ以外（theme, spacing, colors, extend 等）は一切変更しない。

### 1-4. tailwind-base.css の配置

`tw_source/src/scss/tailwind-base.css` を `src/styles/tailwind-base.css` にコピーする。

コピー後、`@config` のパスを以下に変更する:
```css
@config "../../tailwind.config.js";
```

それ以外（`@import "tailwindcss" important;`）は変更しない。

### 1-5. _app.tsx に import 追加

`pages/_app.tsx` の既存 import の**先頭**（他のスタイル import より前）に以下を追加する:
```tsx
import '@/styles/tailwind-base.css';
```

既存の SCSS import の順序・内容は変更しない。

### 1-6. インストールとビルド確認

```bash
npm install
npm run build
npm run serve
```

---

## 完了チェック（全て満たすこと）

- [ ] `npm run build` がエラーなく完了する
- [ ] `npm run serve` で表示されるページの既存スタイルが崩れていない
- [ ] `tailwind.config.js` の `content` が `./pages/**/*.{ts,tsx}` と `./src/components/**/*.{ts,tsx}` になっている
- [ ] `tailwind.config.js` の `theme.spacing` で `mt-4` = `2rem`（32px）が定義されている（Tailwind デフォルトの 16px ではない）
- [ ] `src/styles/tailwind-base.css` の `@config` が `"../../tailwind.config.js"` を指している
- [ ] `postcss.config.js` に `@tailwindcss/postcss` が設定されている
- [ ] `pages/_app.tsx` で `tailwind-base.css` が他のスタイルより先に import されている

---

## 残置を許すもの

- Next.js 15 の deprecation warnings（ビルドは通るが warning が出る場合）→ 報告に記載すること
- `next.config.js` の設定で Next.js 15 対応が必要になった場合の最小変更 → 何を変えたか報告に記載すること

---

## 最終報告で列挙すること

1. 実装したこと（変更したファイルと変更内容の一覧）
2. まだやっていないこと（このStepで意図的に行わなかったこと）
3. 例外として残したこと（warnings、next.config.js の変更等）
4. リスク・前提・未確認事項（ビルドは通ったが動作確認できていないページがあれば明記）
