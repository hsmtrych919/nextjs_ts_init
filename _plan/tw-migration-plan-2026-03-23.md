# SCSS + Tailwind v4 ハイブリッド移行計画

作成日: 2026-03-23
対象: nextjs_ts_init プロジェクト
ソース: tw_source/（WP テーマで完了済みの SCSS+Tailwind v4 ハイブリッド構成）

---

## 1. 目的

現在の Next.js スターターキットの SCSS 構成（Bootstrap v4 ベース + FLOCSS 7層構造）を、tw_source で確立した SCSS + Tailwind v4 ハイブリッド構成に置き換える。

tw_source は WP（PHP テンプレート）用に構築されたため CSS Modules は使えなかった。Next.js では CSS Modules が使えるので、既にモジュール化済みのファイルはそのまま活かす。

---

## 2. バージョン構成

| パッケージ | 現在 | 移行後 | 根拠 |
|---|---|---|---|
| Next.js | ^13.5 | ^15（最新） | Tailwind v4 の `@tailwindcss/postcss` と互換。Node 20.9+ 要求、現環境 20.19.0 で適合 |
| React / ReactDOM | ^18.2.0 | ^19.0.0 | Next.js 15 が React 19 を要求 |
| Tailwind CSS | なし | ^4（`@tailwindcss/postcss` 経由） | tw_source が v4 ベース。変更不可 |
| sass | ^1.89.2 | 据え置き | |
| postcss | ^8.5.6 | 据え置き | |
| autoprefixer | ^10.4.21 | 据え置き | |
| Node.js | 20.19.0 | 据え置き | Next.js 15 最低要件 20.9 を満たす |

### 追加パッケージ

- `@tailwindcss/postcss`（devDependencies）
- `tailwindcss`（devDependencies）

### eslint-config-next

現在 `^15.4.2` が入っている。Next.js 15 に上げれば整合する。

---

## 3. ビルドパイプライン

### 処理順序

```
SCSS → Sass コンパイル（Next.js 内蔵） → PostCSS（@tailwindcss/postcss + autoprefixer） → CSS
```

Sass が PostCSS より先に処理されるため、`@layer` 内での `@extend`、`@media #{g.$md}`、`@include g.hover` はそのまま動作する。tw_source の WP 用ビルド（concat + 外部 postcss）とは仕組みが違うが、処理順序は同じ。

### postcss.config.js

```js
// 移行後
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### Tailwind エントリーポイント

tw_source では `tailwind-base.css` と `style.scss` を concat して 1 ファイルにしている。Next.js ではこの concat は不要。

`_app.tsx` で順序を指定して import する:

```tsx
import '@styles/tailwind-base.css';   // Tailwind v4 エントリー
import '@styles/global/style.scss';   // SCSS エントリー
```

### tailwind-base.css

tw_source のものを `src/styles/tailwind-base.css` に配置。`@config` パスはルートの `tailwind.config.js` を指す:

```css
@import "tailwindcss" important;
@config "../../tailwind.config.js";
```

### tailwind.config.js

tw_source のものをプロジェクトルートに配置。変更は `content` のみ:

```js
content: [
  './pages/**/*.{ts,tsx}',
  './src/components/**/*.{ts,tsx}',
],
```

### theme() 関数

`#{"theme(fontFamily.sans)"}` — Sass が素通しし、PostCSS の `@tailwindcss/postcss` が解決する。Next.js でも処理順序は同じなのでそのまま動作する。

---

## 4. ディレクトリ構造

### 現在の構造（7層 FLOCSS）

```
src/styles/
├── modules/           ← CSS Modules
│   ├── grid.module.scss       ← 削除対象
│   ├── gutter.module.scss     ← 削除対象
│   ├── button.module.scss     ← 維持
│   ├── header.module.scss     ← 維持
│   ├── footer.module.scss     ← 維持
│   ├── type.module.scss       ← 維持（内容更新）
│   ├── index.module.scss      ← 維持
│   ├── modal-photo.module.scss  ← 維持
│   └── modal-footer.module.scss ← 維持
└── global/
    ├── foundation/    ← 全削除
    ├── global/        ← tw_source の global/ で置換
    ├── mixins/        ← 全削除
    ├── layout/        ← 全削除
    ├── component/     ← features/ にリネーム
    ├── project/       ← features/ に統合
    ├── utility/       ← 全削除
    └── style.scss     ← 再構成
```

### 移行後の構造

```
src/styles/
├── tailwind-base.css              ← Tailwind v4 エントリー（tw_source から）
├── modules/                       ← CSS Modules（維持）
│   ├── button.module.scss
│   ├── header.module.scss
│   ├── footer.module.scss
│   ├── type.module.scss           ← 内容更新
│   ├── index.module.scss
│   ├── modal-photo.module.scss
│   └── modal-footer.module.scss
└── global/
    ├── style.scss                 ← Sass エントリーポイント（再構成）
    ├── _tailwind-base-layer.scss  ← @layer base（tw_source から）
    ├── global/                    ← 共通 API（tw_source の global/ で置換）
    │   ├── _index.scss
    │   ├── _variables.scss
    │   ├── _breakpoints.scss
    │   ├── _calc.scss
    │   ├── _hover.scss
    │   └── _media-queries.scss
    ├── features/                  ← 旧 component/ + project/ を統合リネーム
    │   ├── _layout.scss           ← tw_source から（container-width, container-py, split 等）
    │   ├── _tab.scss              ← 現 Next.js から移動（グローバル維持）
    │   ├── _toggle.scss           ← 現 Next.js から移動（グローバル維持）
    │   ├── _table.scss            ← 現 Next.js から移動（グローバル維持）
    │   └── _style.scss            ← 現 Next.js からそのまま（グローバル維持）
    └── vendor/
        ├── react-modal/           ← 現 Next.js から移動
        │   ├── _react-modal.scss
        │   ├── _modal-photo.scss
        │   └── _modal-footer.scss
        └── scroll-hint/
            └── _index.scss        ← utility/_scroll-hint.scss から移動
```

注: 今回は運用フェーズではなく根本的な構成立て直しであるため、docs/file-naming-standards-ts.md のディレクトリ承認ルールは適用外とする。`features/`、`vendor/` のディレクトリ作成・リネームは計画の一部として実施する。

### @use パスの確認

移行後のディレクトリ構造で、各ファイルの `@use` パスを確認:

- `features/_tab.scss`: 現在 `@use "../global" as g;` → 移行後 `src/styles/global/features/_tab.scss` から `../global` = `src/styles/global/global/`（_index.scss あり） → **変更不要**
- `features/_table.scss`: 同上 → **変更不要**
- `features/_toggle.scss`: 現在 `@use "../global" as g;` と `@use "../mixins" as m;` → **Step 4 で `@use "../mixins" as m;` を削除、`m.hover` → `g.hover` に変更**。`@use "../global" as g;` は変更不要。

---

## 5. _tab, _toggle, _table はグローバルパーシャルとして維持

JS 連携で固定クラス名をセレクタとして使用しており、CSS Modules のハッシュ化が入ると動作が壊れるため、グローバルパーシャルとして `features/` に配置する。

現在の TS hooks のハードコード（パス: `src/lib/hooks/`）:
- `useTabSwitch.ts`: `'c-tab__list--item'`, `'c-tab__item'`, `'js-active'`
- `useToggleContent.ts`: `'.c-toggle__wrap'`, `'js-active'`
- `useTableScroll.ts`: `'.c-table__responsive'`, `'js-shadow__before'`/`'js-shadow__after'`

現在の TSX コンポーネント（パス: `src/components/ui/`）:
- `TabDemo.tsx`: `className="c-tab__outer"`, `c-tab__list` 等
- `ToggleDemo.tsx`: `className="c-toggle__wrap"`, `c-toggle__title` 等
- `TableDemo.tsx`: `className="c-table__responsive--outer"` 等

### FLOCSS prefix の除去

tw_source に合わせて FLOCSS prefix（c-）を除去し、純粋な BEM にする。SCSS / TS / TSX の全てで同時に変更が必要。

**安全に処理するため、1 ファイルずつ以下の手順を踏む:**

#### 5-1. _tab.scss の prefix 除去

1. **事前チェック**: `c-tab` を含む全ファイルを検索し、影響箇所を一覧化
2. **SCSS 変更**: `features/_tab.scss` 内の `.c-tab` → `.tab` に置換
3. **TS 変更**: `src/lib/hooks/useTabSwitch.ts` 内のクラス名文字列を `c-tab__*` → `tab__*` に置換
4. **TSX 変更**: `src/components/ui/TabDemo.tsx` 内の className を `c-tab__*` → `tab__*` に置換
5. **ダブルチェック**: 再度 `c-tab` で全文検索し、変更漏れがないことを確認
6. **ビルド確認**: `npm run build` で確認

#### 5-2. _toggle.scss の prefix 除去

1. **事前チェック**: `c-toggle` を含む全ファイルを検索し、影響箇所を一覧化
2. **SCSS 変更**: `features/_toggle.scss` 内の `.c-toggle` → `.toggle` に置換
3. **TS 変更**: `src/lib/hooks/useToggleContent.ts` 内のクラス名文字列を `c-toggle__*` → `toggle__*` に置換
4. **TSX 変更**: `src/components/ui/ToggleDemo.tsx` 内の className を `c-toggle__*` → `toggle__*` に置換
5. **ダブルチェック**: 再度 `c-toggle` で全文検索し、変更漏れがないことを確認
6. **ビルド確認**: `npm run build` で確認

#### 5-3. _table.scss の prefix 除去

1. **事前チェック**: `c-table` を含む全ファイルを検索し、影響箇所を一覧化
2. **SCSS 変更**: `features/_table.scss` 内の `.c-table-spec` → `.table-spec`, `.c-table__responsive` → `.table__responsive` に置換
3. **TS 変更**: `src/lib/hooks/useTableScroll.ts` 内のクラス名文字列を置換
4. **TSX 変更**: `src/components/ui/TableDemo.tsx` 内の className を置換
5. **ダブルチェック**: 再度 `c-table` で全文検索し、変更漏れがないことを確認
6. **ビルド確認**: `npm run build` で確認

---

## 6. ファイル移行マッピング

### tw_source から持ち込むファイル

| tw_source | Next.js 配置先 | 変更点 |
|---|---|---|
| `tailwind-base.css` | `src/styles/tailwind-base.css` | `@config "../../tailwind.config.js"` に修正 |
| `tailwind.config.js` | プロジェクトルート | `content` を tsx に変更 |
| `_tailwind-base-layer.scss` | `src/styles/global/_tailwind-base-layer.scss` | `.form` CSS 変数ブロック除去、`.youtube` 維持、`:root` に `--modal-height-photo: 75vh` 追加、`--bdrs: #{g.rem(6)}` に変更（現行 Next.js の値を維持。tw_source の `g.rem(50)` は WP 案件固有） |
| `global/*` | `src/styles/global/global/*` | `_font.scss` から FontAwesome mixin 除去 |
| `features/_layout.scss` | `src/styles/global/features/_layout.scss` | `container-py--blog`, `container-py--search` 除去 |

### tw_source から持ち込まないファイル

- `features/_typ.scss` — 全クラスが type.module.scss で対応済み（§7 参照）
- `features/_form.scss`, `_post.scss`, `_post-single.scss`, `_search.scss`, `_pagenation.scss`, `_google-map.scss`, `_login.scss` — WP 専用
- `features/_header.scss`, `_footer.scss` — Next.js では module.scss で対応済み
- `features/_button.scss` — Next.js では button.module.scss で対応済み
- `vendor/fontawesome-free-5.14.0/`, `vendor/micromodal/`, `vendor/scroll-hint/`

### 現 Next.js から維持するファイル

| 現在のファイル | 移行後 | 変更内容 |
|---|---|---|
| `component/_tab.scss` | `features/_tab.scss` | prefix 除去（§5-1） |
| `component/_toggle.scss` | `features/_toggle.scss` | prefix 除去（§5-2）、`@use "../mixins" as m;` 削除 + `m.hover` → `g.hover`（Step 4） |
| `component/_table.scss` | `features/_table.scss` | prefix 除去（§5-3） |
| `component/react-modal/*` | `vendor/react-modal/*` | 変更なし（`@use "../../global" as g;` のパスは移行後も同じ階層を指す） |
| `project/_style.scss` | `features/_style.scss` | `:root` CSS 変数定義を除去（_tailwind-base-layer.scss に移行）、`@use "../../modules/grid.module.scss"` 除去、`@use "sass:color"` 除去（不要になるため）、`@layer components` で囲む。`inview__fadein` / `is-inview` はそのまま維持（useInView.ts が IntersectionObserver + CSS transition で使用） |
| `modules/button.module.scss` | 据え置き | SCSS 色変数→CSS 変数変換、`@use "../global/mixins" as m;` 除去 + `m.hover` → `g.hover` |
| `modules/type.module.scss` | 据え置き | 内容更新（§7 参照）、`@use "../global/mixins" as m;` 除去 |
| `modules/header.module.scss` | 据え置き | 変更なし |
| `modules/footer.module.scss` | 据え置き | 変更なし |
| `modules/index.module.scss` | 据え置き | 変更なし |
| `modules/modal-photo.module.scss` | 据え置き | 変更なし |
| `modules/modal-footer.module.scss` | 据え置き | 変更なし |

### 削除するファイル

| ファイル | 代替 |
|---|---|
| `modules/grid.module.scss` | Tailwind ユーティリティ + container-width |
| `modules/gutter.module.scss` | Tailwind カスタムユーティリティ（§10 参照） |
| `foundation/_destyle.scss` | Tailwind Preflight + _tailwind-base-layer.scss |
| `foundation/_reboot.scss` | 同上 |
| `foundation/_variables.scss` | tailwind.config.js + CSS 変数 + _variables.scss |
| `foundation/_variables-color.scss` | _tailwind-base-layer.scss :root |
| `foundation/_variables-form.scss` | form 除外につき不要 |
| `layout/_grid-variables.scss` | _tailwind-base-layer.scss C-2 セクション |
| `utility/` 全ファイル（`_scroll-hint.scss` 除く） | Tailwind ユーティリティ |
| `utility/_scroll-hint.scss` | `vendor/scroll-hint/_index.scss` に移動 |
| `mixins/` 全ファイル | tw_source の global/ に統合、または Tailwind ユーティリティで代替 |

---

## 7. type.module.scss の更新方針

### 基本方針

- **命名規則**: module.scss の命名（`.title--*`, `.text--*`）を維持
- **重複するクラス**: module.scss 側の値を採用（tw_source の値は使わない）
- **tw_source にしかないクラス**: module.scss の命名規則に合わせて追加

### 維持（値はそのまま）

- `%font-min`, `%ttl__xsmall/small/medium/large` — 現在の値を維持
- `.title--xsmall/small/medium/large` — 現在の値を維持
- `.title__underline--aligned` — 維持
- `.title__pattern--diagonal` — 維持
- `@mixin typ__line-height` — 維持
- `@mixin typ__line-height--thin` — 維持
- `.text`, `.text--xs/small/medium/large` — 維持
- `.text--marker` — 維持

### 更新（tw_source からインナー付き構造を取り込み、命名を module 形式に合わせる）

| tw_source | module.scss での命名 | 内容 |
|---|---|---|
| `.ttl__rhombus` + `--inner` | `.title__rhombus` + `--inner` | 現在の単体構造を、tw_source のインナー付き構造に更新 |
| `.ttl__horizontal` + `--inner` + `--inner-bgc-y` | `.title__horizontal` + `--inner` + `--inner-bgc-y` | 現在の単体構造を、tw_source のインナー付き構造に更新 |

### 新規追加（tw_source にあり Next.js にないもの）

| tw_source | module.scss での命名 |
|---|---|
| `.ttl__underbar` | `.title__underbar` |
| `.ttl__bg-grd` | `.title__bg-grd` |
| `.ttl__bg-grd--wrap` | `.title__bg-grd--wrap` |

### 除外（WP 専用 / form 専用）

- `.ttl__post--archives`, `.ttl__post--widget`, `.ttl__post--widget-related`, `.ttl__post--widget-grid`, `.ttl__post--single`
- `.ttl__widget`, `--bar`, `--caption`
- `.ttl__search`, `--caption`
- `.ttl__post--single-h2`, `--single-h3`
- `.form__ttl`, `.form__ttl-detail`

### tailwind.config.js の extend.fontSize（fz12〜fz36）

元の Next.js にはなかった。tw_source の移行で `utility/_font.scss` のユーティリティクラスを Tailwind 化したもの。Next.js 側の `utility/_font.scss`（削除対象）の代替として機能するため、tailwind.config.js にそのまま含める。

---

## 8. global API の統合

### 現在

```
global/global/   → @forward: variables, variables-color, breakpoints, calc, font, media-queries, unicode
global/mixins/   → @forward: zindex, table-row, clearfix, dl, hover, transition, gutter
```

利用側:
```scss
@use "../global/global" as g;
@use "../global/mixins" as m;
```

### 移行後

tw_source と同じ統合構造にする:

```
global/global/   → @forward: variables, breakpoints, calc, hover, media-queries
```

利用側（ファイルの配置場所でパスが異なる）:
```scss
// modules/ 配下（src/styles/modules/*.module.scss）
@use "../global/global" as g;

// features/ 配下（src/styles/global/features/_*.scss）
@use "../global" as g;

// vendor/ 配下（src/styles/global/vendor/**/_*.scss）
@use "../../global" as g;  // react-modal は深さ2
```

変更点:
- `variables-color` 廃止（CSS 変数に移行済み）
- `unicode` 廃止（FontAwesome 除外）
- `_font.scss` は FA mixin 除去した版を持ち込む
- `hover` は mixins/ から global/ に移動
- `gutter`, `clearfix`, `transition`, `zindex`, `table-row`, `dl` は廃止

### 影響範囲

**module.scss（`src/styles/modules/` 配下）**:
- `@use "../global/global" as g;` → **そのまま維持**。`src/styles/modules/` から `../global/global` = `src/styles/global/global/`（`_index.scss` あり）なのでパスは正しい。`src/styles/global/_index.scss` は存在しないため `@use "../global" as g;` には変更できない。
- `@use "../global/mixins" as m;` → 廃止。`m.hover` は `g.hover` に、`m.gutter` / `m.gutter_row` は CSS 変数直書きまたは Tailwind ユーティリティに

**グローバルパーシャル（`src/styles/global/features/` 配下）**:
- `@use "../global" as g;` → **そのまま維持**。`src/styles/global/features/` から `../global` = `src/styles/global/global/`（`_index.scss` あり）なのでパスは正しい。

### _toggle.scss の個別対応

`_toggle.scss` は `@use "../mixins" as m;` を使い、100行目で `@include m.hover { ... }` を呼んでいる。Step 4（global API 再構成）で以下を変更:
- `@use "../mixins" as m;` を削除
- `@include m.hover { ... }` → `@include g.hover { ... }`

この変更は Step 5（prefix 除去）より前に行うため、ビルドが壊れることはない。

---

## 9. SCSS 変数→CSS 変数の変換

### button.module.scss（最も修正量が多い）

| 現在 | 変更後 |
|---|---|
| `g.$clr1` | `var(--clr1)` |
| `g.$border-radius` | 直値 `6px` または `var(--bdrs)` |
| `color.scale(g.$clr1, $lightness: 5%)` | `var(--clr1-hover)` |

`color.scale()` は SCSS コンパイル時に解決されるため、CSS 変数を引数に取れない。ホバー色は `:root` の CSS 変数として事前定義する（tw_source の _tailwind-base-layer.scss に `--clr1-hover: #3f9536` が既にある）。

### project/_style.scss

現在 `:root` で SCSS 変数→CSS 変数の変換を行っている:
```scss
:root {
  --clr1: #{g.$clr1};
  --clr1-hover: #{color.scale(g.$clr1, $lightness: -20%)};
  --modal-height-photo: 75vh;
  ...
}
```

これは _tailwind-base-layer.scss の `:root` ブロックで置き換わるため、_style.scss 側の `:root` 定義は削除する。`--modal-height-photo: 75vh` は _tailwind-base-layer.scss の `:root`（C-1 セクション）に追加する。

_style.scss 内の `@use "../../modules/grid.module.scss" as grid;` も grid.module.scss 削除に伴い除去する。

### footer.module.scss

`g.get_zindex(footer)` — tw_source の `_variables.scss` にこの関数は残っているので問題なし。

### その他の module.scss（header, footer, index, modal-photo, modal-footer）

`g.rem()`, `g.$sm`, `g.$md` 等 — tw_source の global/ にすべて残っている。`@use "../global/global" as g;` はパス変更不要。mixins import もない。**変更なし**。

---

## 10. grid.module.scss と gutter.module.scss の廃止と TSX 書き換え

### grid.module.scss

現在 TSX で広く使用されている:
- `gridStyles['row--container']` — container-width + flex wrapper
- `gridStyles['col--12']`, `gridStyles['col--md-10']` 等 — 12分割カラム
- `gridStyles.col` — auto columns（残り幅を均等分配、`flex: 1 0 0%`）。GridDemo.tsx L140, L146 で使用
- `gridStyles.grid`, `gridStyles['grid--2']`, `gridStyles['grid--md-4']` — CSS Grid

これらは以下で代替する:
- `row--container` → `container-width` クラス（_layout.scss） + Tailwind ユーティリティ（`mx-auto flex flex-wrap px-gutter-row xl:px-0`）
- `col--*` → Tailwind 幅ユーティリティ（`w-full md:w-10/12`）
- `col`（数字なし）→ Tailwind `grow basis-0`（`flex: 1 0 0%` 相当）
- `grid--*` → Tailwind Grid ユーティリティ（`grid grid-cols-2 md:grid-cols-4 gap-grid-gutter`）

TSX 側の変更が必要なファイル:
- `header.tsx`, `footer.tsx`, `index.tsx`, `snippet.tsx`
- `ModalPhoto.tsx`, `ModalFooter.tsx`, `GridPhoto.tsx`, `GridDemo.tsx`

### gutter.module.scss

gutter mixin は tw_source で廃止済み、Tailwind カスタムユーティリティに置き換え。

全クラスの対応表:

| gutter.module.scss クラス | mixin / 内容 | Tailwind 代替 |
|---|---|---|
| `.container` | `px-gutter-row`, `xl:px-0` | `px-gutter-row xl:px-0` |
| `.container--initial` | `px-gutter-row`, `md:px-0` | `px-gutter-row md:px-0` |
| `.small--left` | `sm:pl-gutter-2`, `md:pl-gutter-3` | `sm:pl-gutter-2 md:pl-gutter-3` |
| `.small--left-half` | `sm:pl-gutter-1`, `md:pl-gutter-1.5` | `sm:pl-gutter-1 md:pl-gutter-1.5` |
| `.medium--left` | `md:pl-gutter-3` | `md:pl-gutter-3` |
| `.medium--left-half` | `md:pl-gutter-1.5` | `md:pl-gutter-1.5` |
| `.small--right` | `sm:pr-gutter-2`, `md:pr-gutter-3` | `sm:pr-gutter-2 md:pr-gutter-3` |
| `.small--right-half` | `sm:pr-gutter-1`, `md:pr-gutter-1.5` | `sm:pr-gutter-1 md:pr-gutter-1.5` |
| `.medium--right` | `md:pr-gutter-3` | `md:pr-gutter-3` |
| `.medium--right-half` | `md:pr-gutter-1.5` | `md:pr-gutter-1.5` |

TSX 側で import を削除し、Tailwind クラスに書き換える。

---

## 11. style.scss（Sass エントリーポイント）

### 移行後

```scss
@charset "utf-8";

// Foundation（@layer base: CSS 変数 + リセット補足）
@use "_tailwind-base-layer";

// Layout
@use "features/_layout";

// Vendor
@use "vendor/react-modal/react-modal";
@use "vendor/react-modal/modal-photo";
@use "vendor/react-modal/modal-footer";
@use "vendor/scroll-hint";

// Features（グローバルスタイル）
@use "features/_tab" as tab;
@use "features/_toggle" as toggle;
@use "features/_table" as table;
@use "features/_style" as content;
```

---

## 12. ドキュメント更新

移行により以下のドキュメントが現状と合わなくなるため、実装完了後に更新が必要:

### docs/scss-styling-guide.md

- §1 SCSS体系概要: 7層構造 → Tailwind ハイブリッド構造に書き換え
- §1.2 CSS Modules層: grid.module.scss, gutter.module.scss の記載削除
- §1.3 Component層: `component/` → `features/` に変更、FLOCSS prefix `c-` → prefix なしに変更
- §2 優先順位: Tailwind ユーティリティの位置づけを追加、utility/ 層の記載削除
- §3.1 BEM記法: グローバルの `c-` prefix 除去を反映
- §5 判断フロー: Tailwind ユーティリティの判断ステップを追加
- §6.2 接頭辞: `c-` prefix の記載を削除
- §6.4 リセットCSS: destyle + reboot → Preflight + _tailwind-base-layer.scss に変更
- §7 余白設定: Tailwind spacing の説明を追加
- §8 レスポンシブ: Tailwind の `sm:`, `md:` prefix の使い方を追加

### docs/file-naming-standards-scss.md

- §2 グローバルSCSS: Foundation/Global/Mixins/Layout/Component/Project/Utility の層構造 → global/ + features/ + vendor/ に書き換え
- FLOCSS prefix `c-` の記載を削除
- 最終更新の Next.js バージョンを 15 に

### docs/file-naming-standards-ts.md

- 最終更新の Next.js バージョンを 15 に

### CLAUDE.md

- 対象環境の Next.js バージョンを 15 に

### tw_source/src/scss/readme.md ベースの新ガイド

tw_source の readme.md を Next.js 版に書き換えて `docs/` に配置する（§2 ディレクトリ構造、§4 判断フロー、§10 ビルドパイプライン、§12 content スキャンを Next.js 仕様に。CSS Modules の使い分けセクションを追加）。

---

## 13. 事前チェックファイル一覧

実装前・実装中のダブルチェック用に `_plan/` に作成した事前調査ファイル。各 Step の実行時に該当ファイルを参照し、変更漏れ・値の不一致がないことを確認する。

| ファイル | 概要 | 参照タイミング |
|---------|------|---------------|
| `precheck-01-css-variables.md` | `:root` CSS 変数の現行値 vs tw_source 値の比較表。グレースケール hex 一致確認、差分変数の追加/除去リスト | Step 3（Foundation 入れ替え） |
| `precheck-02-button-color-inventory.md` | button.module.scss 内の SCSS カラー参照全量棚卸し。`color.scale()` 4 パターンの hex 確認、`m.hover` 6 箇所、`g.$border-radius` 2 箇所 | Step 4（module.scss 修正） |
| `precheck-03-grid-gutter-tsx-usage.md` | gutterStyles の TSX 使用 14 箇所マップ + Tailwind 変換表。gridStyles import 一覧 | Step 6（grid/gutter 廃止 + TSX 書き換え） |
| `precheck-04-flocss-prefix-inventory.md` | `c-tab`/`c-toggle`/`c-table` の SCSS・TS・TSX 全 29 箇所の変更対象リスト | Step 5（FLOCSS prefix 除去） |
| `precheck-05-hover-mixin-comparison.md` | 現行 vs tw_source hover mixin の比較（機能差なし確認済み）。`m.hover` → `g.hover` 変更 7 箇所の一覧 | Step 2（global API 再構成）、Step 4（module.scss 修正） |
| `precheck-06-type-module-current-state.md` | type.module.scss の全クラス棚卸し。未使用 import 2 件、`.text--small` L275 `rem(9)` タイポ疑い | Step 4（type.module.scss 更新） |
| `precheck-07-typ-structure-comparison.md` | type.module.scss vs tw_source `_typ.scss` の詳細構造比較。%ttl__* の min/max 差分、rhombus/horizontal の構造差分、WP 専用クラス除外リスト | Step 4（type.module.scss 更新、§7 の具体的な差分確認用） |

---

## 14. 実行ステップ

> 各 Step で参照すべき precheck ファイルは §13 の一覧表を確認すること。

### Step 1: Next.js バージョンアップ + Tailwind v4 導入

- package.json: `next` → `^15`, `react`/`react-dom` → `^19`
- `@tailwindcss/postcss`, `tailwindcss` を devDependencies に追加
- postcss.config.js に `@tailwindcss/postcss` 追加
- tw_source の `tailwind.config.js` をルートにコピー（`content` を tsx に変更）
- tw_source の `tailwind-base.css` を `src/styles/` にコピー（`@config "../../tailwind.config.js"` に修正）
- `_app.tsx` に `tailwind-base.css` の import 追加
- `npm install` → `npm run build` で確認

### Step 2: global API の再構成

> 参照: `precheck-05-hover-mixin-comparison.md`（hover mixin の差分確認・変更箇所一覧）

- tw_source の `global/` を `src/styles/global/global/` にコピー
- `_font.scss` から FontAwesome mixin 除去
- `_index.scss` を tw_source 版に合わせる
- 既存の `mixins/` ディレクトリは Step 4 完了まで残す（module.scss の修正と同時に除去）

### Step 3: Foundation / リセットの入れ替え

> 参照: `precheck-01-css-variables.md`（CSS 変数値の一致確認、差分変数の追加/除去チェック）

- tw_source の `_tailwind-base-layer.scss` を配置（`.form` CSS 変数ブロック除去、`--bdrs: #{g.rem(6)}` に変更、`--modal-height-photo: 75vh` を `:root` C-1 セクションに追加）
- `_destyle.scss`, `_reboot.scss` の @use を style.scss から削除
- `layout/_grid-variables.scss` の @use を削除
- `foundation/` ディレクトリの全ファイル削除
- `project/_style.scss` 内の `:root` CSS 変数定義を削除（_tailwind-base-layer.scss で置換）
- `project/_style.scss` 内の `h1, h2 { font-weight: normal; }` を削除（_tailwind-base-layer.scss のリセット補足でカバー）
- `project/_style.scss` 内の `@use "../../modules/grid.module.scss"` を削除

### Step 4: features/ / vendor/ の再配置 + module.scss 修正

> 参照: `precheck-02-button-color-inventory.md`（button.module.scss のカラー変換全量）
> 参照: `precheck-05-hover-mixin-comparison.md`（m.hover → g.hover 変更 7 箇所の確認）
> 参照: `precheck-06-type-module-current-state.md`（type.module.scss の現状・未使用 import）
> 参照: `precheck-07-typ-structure-comparison.md`（§7 更新時の tw_source との詳細差分）

- `component/` → `features/` にリネーム
- `project/_style.scss` → `features/_style.scss` に移動、`@layer components` で囲む（`inview__fadein` / `is-inview` はそのまま含める）
- tw_source から `features/_layout.scss` を持ち込み（container-py --blog/--search 除去）
- react-modal 関連を `vendor/react-modal/` に移動
- `utility/_scroll-hint.scss` → `vendor/scroll-hint/_index.scss` に移動
- `_toggle.scss` の `@use "../mixins" as m;` 削除、`m.hover` → `g.hover` に変更
- button.module.scss: `@use "../global/mixins" as m;` 除去 + `m.hover` → `g.hover`、SCSS 色変数→CSS 変数
- type.module.scss: `@use "../global/mixins" as m;` 除去、§7 の方針で内容更新
- header, footer, index, modal-photo, modal-footer の module.scss: 変更なし（`@use "../global/global" as g;` のパスは変わらない、mixins import なし）
- style.scss を §11 の構成に書き換え

### Step 5: FLOCSS prefix 除去（1 ファイルずつ安全に処理）

> 参照: `precheck-04-flocss-prefix-inventory.md`（SCSS・TS・TSX 全 29 箇所の変更対象リスト）

§5 の手順に従い、以下の順序で 1 ファイルずつ処理する:
1. _tab.scss（§5-1）: 事前チェック → SCSS 変更 → TS 変更 → TSX 変更 → ダブルチェック → ビルド確認
2. _toggle.scss（§5-2）: 同上
3. _table.scss（§5-3）: 同上

一気にやらない。1 ファイルの prefix 除去が完了しビルドが通ったことを確認してから次のファイルに進む。

### Step 6: grid.module.scss / gutter.module.scss 廃止 + TSX 書き換え + 旧 utility クラス置換

> 参照: `precheck-03-grid-gutter-tsx-usage.md`（gutterStyles 14 箇所 + gridStyles の全使用箇所マップと Tailwind 変換表）

- grid.module.scss の import を全 TSX から削除
- gutter.module.scss の import を全 TSX から削除
- 各 TSX で Tailwind ユーティリティ + container-width に書き換え
- `gridStyles.col`（auto columns）→ `grow basis-0` に置換（GridDemo.tsx L140, L146）
- GridDemo.tsx の実コードのみ Tailwind に書き換える。コメントドキュメント（L5-72）は旧内容のまま残す。ドキュメント更新は本計画のスコープ外（後続の別タスクで対応）
- **旧 utility クラスの置換**: header.tsx L10 の `jc-start ai-center`（`utility/_flex.scss` 定義）→ Tailwind `justify-start items-center` に置換。Step 7 で `utility/` を全削除する前にここを処理しないとスタイルが崩れる
- grid.module.scss, gutter.module.scss ファイル削除

影響 TSX ファイル: header.tsx, footer.tsx, index.tsx, snippet.tsx, ModalPhoto.tsx, ModalFooter.tsx, GridPhoto.tsx, GridDemo.tsx

### Step 7: 不要ファイル削除

- `utility/` 全削除
- `layout/` 全削除
- `mixins/` 全削除
- `foundation/` 全削除（Step 3 で済んでいるはず）

### Step 8: ドキュメント更新

**本計画のスコープ外（後続の別タスクで対応）**:
- §12 に記載した docs/ 内ドキュメントの更新
- GridDemo.tsx のコメントドキュメント（L5-72）の新グリッドシステムへの書き換え

これらは SCSS 移行が完全に完了した後、別タスクとして一括対応する。本計画の実装中にドキュメント更新に着手してはならない。

### 各 Step の確認基準

- 各 Step 完了時に `npm run build` + `npm run serve` で全ページ正常表示を確認
- SCSS コンパイルエラーなし
- TSX の未使用 import なし

---

## 15. 判断保留事項

1. **_style.scss の WP 専用コンテンツ**: tw_source の _style.scss には `dl-menu`, `dl-company`, `replace__*`, `swiper-front__*` 等がある。これらは WP 案件固有だが、`@layer components` 内のグローバルクラスなので使わなければ影響なし。いったん残す。
