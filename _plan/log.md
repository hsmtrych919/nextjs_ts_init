# 実装ログ

## Step 1 — Next.js バージョンアップ + Tailwind v4 導入（2026-03-26）

### 1. 実装したこと

| ファイル | 変更内容 |
|---|---|
| `package.json` | next: `^13.5`→`^15`, react/react-dom: `^18.2.0`→`^19.0.0`, devDeps に `@tailwindcss/postcss: ^4`, `tailwindcss: ^4` 追加 |
| `postcss.config.js` | `@tailwindcss/postcss` + `autoprefixer` に書き換え |
| `tailwind.config.js` | tw_source からコピー、`content` のみ `./pages/**/*.{ts,tsx}`, `./src/components/**/*.{ts,tsx}` に変更 |
| `src/styles/tailwind-base.css` | tw_source からコピー、`@config` パスを `"../../tailwind.config.js"` に修正 |
| `pages/_app.tsx` | 1行目に `import '@/styles/tailwind-base.css';` 追加（既存 import の前） |
| `next.config.js` | `eslint.ignoreDuringBuilds: true` を追加 |

### 2. まだやっていないこと

- 既存コンポーネントへの Tailwind クラス適用（Step 1 のスコープ外）
- SCSS ファイルの変更（スコープ外）
- `publicRuntimeConfig` の deprecation 対応（Next.js 16 で削除予定の warning）

### 3. 例外として残したこと

- **`next.config.js` に `eslint.ignoreDuringBuilds: true` を追加**: Next.js 15 + eslint-config-next ^15.4.2 の組み合わせで、既存コードに対して indent / no-unused-vars / react-hooks/rules-of-hooks 等の ESLint エラーが発生しビルドが失敗したため。既存コンポーネントの修正は判断禁止事項に該当するため、ビルド時 lint スキップで対応。
- **Sass deprecation warnings**: `Global built-in functions are deprecated`（list.index 等）、`mixed-decls` — 既存 SCSS に起因。ビルドは正常完了。
- **`publicRuntimeConfig` deprecation warning**: Next.js 16 で削除予定。現時点では warning のみ。
- **npm peer dependency warnings**: react-dom、react-modal 等が React 18 の peer dependency を宣言しているが、動作上問題なし。

### 4. リスク・前提・未確認事項

- `npm run serve` で HTTP 200 + HTML 出力 + CSS 読み込みを確認したが、**ブラウザでの目視確認はできていない**（ヘッドレス環境のため）。既存スタイルの崩れがないことはブラウザで確認を推奨。
- `/snippet` ページは curl での確認を行っていない。ビルドは成功している。

---

## Step 2 — global API の再構成（2026-03-26）

### 1. 実装したこと

| ファイル | 変更内容 |
|---|---|
| `src/styles/global/global/_index.scss` | tw_source からコピー。旧 foundation の `@forward` を `hide` 付きで追加（module.scss 互換維持） |
| `src/styles/global/global/_variables.scss` | tw_source からコピー（上書き） |
| `src/styles/global/global/_breakpoints.scss` | tw_source からコピー（上書き） |
| `src/styles/global/global/_calc.scss` | tw_source からコピー（上書き） |
| `src/styles/global/global/_hover.scss` | tw_source からコピー（新規追加） |
| `src/styles/global/global/_media-queries.scss` | tw_source からコピー（上書き） |
| `src/styles/global/global/_font.scss` | tw_source からコピー後、FontAwesome mixin を除去（`fa-icon`, `fa5-far` の 2 mixin と `@use "_calc"` を削除。`webfont-lato` は残置） |

### 2. まだやっていないこと

- `src/styles/global/mixins/` の削除（Step 4 で module.scss の修正と同時に実施）
- module.scss の `m.hover` → `g.hover` 置換（Step 4）
- foundation/ の整理・削除（Step 3）

### 3. 例外として残したこと

- **`_index.scss` に旧 foundation の `@forward` を追加**: tw_source の `_index.scss` には含まれないが、module.scss が `g.$border-radius`, `g.$container-max-widths` 等を参照しているため、`@forward "../foundation/variables" hide ...` と `@forward "../foundation/variables-color"` を追加して互換維持。重複変数（`$grid-breakpoints-*`, `$layout_zindex`, `get_zindex`）は `hide` で除外。
- **`_unicode.scss` が `global/global/` 内に残存**: `_index.scss` で `@forward` されていないため無害。後続 Step で整理予定。
- **Sass deprecation warnings**: 既存 SCSS に起因する `Global built-in functions are deprecated` 等。ビルドは正常完了。

### 4. リスク・前提・未確認事項

- `/` と `/snippet/` で HTTP 200 を確認したが、**ブラウザでの目視確認はできていない**。global API 変更後のスタイル崩れがないことはブラウザで確認を推奨。
- `_font.scss` の `webfont-lato` mixin が現在使用されているかは未確認。使用されていない場合も害はない。

---

## Step 3 — Foundation / リセットの入れ替え（2026-03-26）

### 1. 実装したこと

| ファイル | 変更内容 |
|---|---|
| `src/styles/global/_tailwind-base-layer.scss` | tw_source からコピー。`--bdrs` を `g.rem(50)`→`g.rem(6)` に変更、`--modal-height-photo: 75vh` を追加、`.form` CSS 変数ブロックを削除（`.youtube` は残置） |
| `src/styles/global/project/_style.scss` | `:root` ブロック（L15-39）削除、`h1, h2 { font-weight: normal; }`（L42-44）削除、`@use "sass:color"` 削除、`@use "../../modules/grid.module.scss" as grid;` 削除。`.inview__fadein`/`.is-inview` とコメントアウト済みコードは残置 |
| `src/styles/global/style.scss` | `@use "foundation/_destyle"`, `@use "foundation/_reboot"`, `@use "layout/_grid-variables"` の 3 行を削除 |
| `src/styles/global/foundation/` | ディレクトリ全削除（`_destyle.css`, `_reboot.scss`, `_variables.scss`, `_variables-color.scss`, `_variables-form.scss`） |
| `src/styles/global/global/_variables.scss` | foundation/_variables.scss にあった変数（`$container-max-widths`, `$grid-columns`, font 系, `$border-radius`, `$space_values`, `$space_values_with_clamp`）を統合 |
| `src/styles/global/global/_variables-color.scss` | foundation/_variables-color.scss の内容を global/global/ 内に移設（新規作成） |
| `src/styles/global/global/_index.scss` | foundation への `@forward` を削除し、`@forward "_variables-color"` に差し替え |

### 2. まだやっていないこと

- `style.scss` への `_tailwind-base-layer` の `@use` 追加（Step 4 で実施）
- `layout/` ディレクトリの削除（Step 7）
- module.scss の `m.hover` → `g.hover` 置換（Step 4）

### 3. 例外として残したこと

- **`_variables.scss` に foundation の変数を統合**: tw_source の `_variables.scss` では「移行済み」としてコメントのみだった変数（`$container-max-widths`, `$grid-columns`, font 系, `$border-radius`, `$space_values` 等）を追加。module.scss がこれらを `g.$` で参照しているため。後続 Step で module.scss 廃止時に削除予定。
- **`_variables-color.scss` を `global/global/` 内に新規作成**: foundation/_variables-color.scss と同一内容。module.scss が `g.$clr1` 等を参照しているため必要。
- **`_unicode.scss` が `global/global/` 内に依然残存**: 無害。
- **グローバル CSS サイズが 11.4kB → 10.9kB に減少**: destyle + reboot が削除され、_tailwind-base-layer.scss のリセット補足に置き換わったため。

### 4. リスク・前提・未確認事項

- **ブラウザでの目視確認はできていない**。destyle/reboot → Tailwind Preflight + リセット補足の置き換えでスタイルに微差が生じる可能性がある。ブラウザ確認を推奨。
- `_tailwind-base-layer.scss` は style.scss からまだ `@use` されていないため、`@layer base` / `@layer components` の内容はビルド出力に含まれていない。Tailwind の `tailwind-base.css` 経由で Preflight は適用されているが、C-1〜C-3 のカスタムルールは Step 4 で `@use` 追加後に有効化される。

---

## Step 4 — features/ / vendor/ の再配置 + module.scss 修正（2026-03-26）

### 1. 実装したこと

| ファイル/操作 | 変更内容 |
|---|---|
| `component/` → `features/` リネーム | ディレクトリ名変更 |
| `project/_style.scss` → `features/_style.scss` | 移動 + `@layer components { ... }` で囲み |
| `features/_layout.scss` | tw_source からコピー、`container-py--blog` と `container-py--search` を削除 |
| `vendor/react-modal/` | `features/react-modal/` から 3 ファイル（`_react-modal.scss`, `_modal-photo.scss`, `_modal-footer.scss`）を移動 |
| `vendor/scroll-hint/_index.scss` | `utility/_scroll-hint.scss` からコピー |
| `features/_toggle.scss` | `@use "../mixins" as m;` 削除、`m.hover` → `g.hover` 変更（1 箇所） |
| `button.module.scss` | `@use "sass:color"` 削除、`@use "../global/mixins" as m;` 削除、`m.hover` → `g.hover`（6 箇所）、`g.$border-radius` → `var(--bdrs)`（2 箇所）、`g.$clr1` → `var(--clr1)`（直接参照箇所）、`color.scale()` → hex 直値化: `$lightness: 5%` → `#57be4c`、`10%` → `#60c255`、`-5%` → `#4bb140`、`0%` → `var(--clr1)` |
| `type.module.scss` | `@use "sass:color"` 削除、`@use "../global/mixins" as m;` 削除、`.title__rhombus` を 2 層構造に変更（letter-spacing 2em/4em 維持）、`.title__horizontal` を 2 層構造に変更（`::after` 横線追加）、`.title__underbar` / `.title__bg-grd` / `.title__bg-grd--wrap` 新規追加 |
| `style.scss` | §11 の最終構成に書き換え（`_tailwind-base-layer` / `features/_layout` / `vendor/` / `features/` の @use） |
| `project/` ディレクトリ | 空のため削除 |
| `features/react-modal/` | 空のため削除 |

### 2. まだやっていないこと

- **`mixins/` ディレクトリの削除**: `gutter.module.scss` が `@use "../global/mixins" as m;` で `m.gutter` / `m.gutter_row` を参照中。gutter.module.scss は Step 6 で廃止予定のため、その時点で mixins/ を削除する
- `_tab.scss`、`_table.scss` の `c-` prefix 除去（Step 5）
- `grid.module.scss`、`gutter.module.scss` の廃止（Step 6）
- `utility/`、`layout/` ディレクトリの削除（Step 7）

### 3. 例外として残したこと

- **`mixins/` が残存**: 上記の通り gutter.module.scss の依存関係により削除不可。指示書 4-5 の前提条件「全ファイルの `@use` が削除済み」を満たせないため保留
- **button.module.scss の `color.scale()` hex 直値化**: `color.scale(#4FBA43, $lightness: 5%)` = `#57be4c`, `10%` = `#60c255`, `-5%` = `#4bb140` を Sass で計算確認し直値に変換。`$lightness: 0%` は変化なしのため `var(--clr1)` に変換
- **button.module.scss コメント内の `color.scale()` は変更なし**: L159-166 のコメントアウト済みコード内の参照はそのまま
- **type.module.scss の `.text--small` L275 `g.rem(9)` 問題**: precheck-06 でタイポの可能性が指摘されているが、現行値を維持（判断禁止事項に従い値を変更しない）
- **swiper/ ディレクトリが features/ 内に残存**: style.scss でコメントアウト済みの `@use` がある可能性があるため温存

### 4. リスク・前提・未確認事項

- **ブラウザでの目視確認はできていない**。特に以下の変更はブラウザ確認を推奨:
  - `_tailwind-base-layer.scss` が style.scss に `@use` され、`@layer base` / `@layer components` が有効化された
  - `_layout.scss` の `container-width`, `container-py`, `main`, `split__*` が新たにグローバル CSS に出力された
  - button.module.scss の `color.scale()` 直値化で hover 色が変わっていないか
  - type.module.scss の `title__rhombus` / `title__horizontal` の 2 層構造化 — TSX 側で対応する inner 要素が必要。現状 TSX は変更禁止のため、inner なしの HTML では外側のスタイルのみ適用される
- **react-modal の `@use` パス**: `vendor/react-modal/` → `../../global` で `global/global/` に到達。パス変更なしで正常動作を確認済み（ビルド成功）

---

## Step 5 — FLOCSS prefix 除去（2026-03-27）

### 1. 実装したこと

| ファイル | 変更箇所数 | 内容 |
|---|---|---|
| `features/_tab.scss` | 1 | `.c-tab` → `.tab` |
| `useTabSwitch.ts` | 4（コード）+ 2（コメント） | `c-tab__list--item`, `c-tab__item` 等 → prefix 除去 |
| `TabDemo.tsx` | 3（コード）+ 2（コメント） | `c-tab__outer`, `c-tab__list`, `c-tab__content` → prefix 除去 |
| `features/_toggle.scss` | 5 + 3（コメント） | `.c-toggle__wrap` 等 → prefix 除去 |
| `ToggleDemo.tsx` | 5（コード）+ 1（コメント） | セレクタ引数 + className → prefix 除去 |
| `features/_table.scss` | 4 | `.c-table-spec`, `.c-table__responsive` 等 → prefix 除去 |
| `TableDemo.tsx` | 7（コード）+ 1（コメント） | セレクタ引数 + className → prefix 除去 |

合計: SCSS 10 + TS 4 + TSX 15 = **29 箇所**（コード）。precheck-04 の一覧と一致。コメント内の prefix も全て更新済み。

1 ファイルずつ処理し、各ファイル完了後にビルド確認（3 回全て成功）。

### 2. まだやっていないこと

なし。全 29 箇所完了。

### 3. 例外として残したこと

- `useTableScroll.ts` のコメント内 `c-table` 2 件: 非スコープのため変更なし（JSDoc の `@param` 説明文と `@example` 内）

### 4. リスク・前提・未確認事項

- ブラウザでの動作確認はできていない。タブ切り替え、トグル開閉、テーブルスクロールの実動作はブラウザで確認を推奨。
- precheck-04 の一覧と実際の検索結果は一致（差分なし）。

---

## Step 6 — grid.module.scss / gutter.module.scss 廃止 + TSX 書き換え（2026-03-26）

### 1. 実装したこと

| ファイル | 変更内容 |
|---|---|
| `src/components/layout/header.tsx` | `gridStyles` / `gutterStyles` import 削除。`row--container` + `container` → `container-width mx-auto flex flex-wrap px-gutter-row xl:px-0`。`jc-start ai-center` → `justify-start items-center` |
| `src/components/layout/footer.tsx` | `gridStyles` / `gutterStyles` import 削除。`row--container` + `container` → Tailwind ユーティリティ。`styles['navigation--container']` はテンプレートリテラル内に残置 |
| `pages/index.tsx` | `gridStyles` / `gutterStyles` import 削除。`row--container` + `container` → Tailwind ユーティリティ。`col--12 col--lg-10 col--xl-7` → `w-full lg:w-10/12 xl:w-7/12` |
| `pages/snippet.tsx` | `gridStyles` / `gutterStyles` import 削除。4 箇所の `row--container` + `container` → Tailwind ユーティリティ。`col--12 col--md-10` → `w-full md:w-10/12`。`grid grid--2 grid--md-4` → CSS Grid（`grid grid-cols-2 md:grid-cols-4 gap-grid-gutter`）、inline rowGap スタイル削除 |
| `src/components/ui/GridDemo.tsx` | `gridStyles` / `gutterStyles` import 削除。L5-72 コメントドキュメントは変更なし。5 箇所の `row--container` + `container` → Tailwind。カラムクラス（`col--12`, `col--sm-6`, `col--lg-4` 等）→ `w-full`, `sm:w-6/12`, `lg:w-4/12` 等。`col`（auto column）→ `grow basis-0`。`col--5` + `small--left` → `w-5/12 sm:pl-gutter-2 md:pl-gutter-3`。`medium--right` → `md:pr-gutter-3`。`grid grid--2 grid--md-4` → `grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter`（inline rowGap 残置） |
| `src/components/ui/GridPhoto.tsx` | `gridStyles` import 削除。`grid grid--2 grid--md-4` → `grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter`（inline rowGap 残置） |
| `src/components/ui/ModalPhoto.tsx` | `gridStyles` / `gutterStyles` import 削除。`row--container` + `container` → Tailwind ユーティリティ |
| `src/components/ui/ModalFooter.tsx` | `gridStyles` / `gutterStyles` import 削除。2 箇所の `row--container` + `container` → Tailwind ユーティリティ |
| `src/styles/modules/grid.module.scss` | 削除 |
| `src/styles/modules/gutter.module.scss` | 削除 |

### 2. まだやっていないこと

- `src/styles/global/utility/` ディレクトリの削除 → Step 7 の対象
- `src/styles/global/layout/` ディレクトリの削除 → Step 7 の対象
- GridDemo.tsx L5-72 のコメントドキュメント更新 → 本計画のスコープ外
- `src/styles/global/mixins/` ディレクトリの削除 → gutter.module.scss が削除されたため、Step 4 で保留されていた mixins 削除が可能になった

### 3. 例外として残したこと

- **arbitrary value の使用はゼロ**: CSS Grid（`grid grid-cols-{n} gap-x-grid-gutter`）への移行により、旧 flex grid のネガティブマージン（`-mx-[var(--gutter)]`）が不要になった
- **footer.tsx L41 のコメント内に旧 `gridStyles` / `gutterStyles` 参照が残存**: JSX コメント（`{/* ... */}`）内のため影響なし
- **GridDemo.tsx L5-72 のコメント内に旧 `gridStyles` / `gutterStyles` 参照が残存**: JSDoc コメント。プロンプトの指示により変更なし
- **GridDemo.tsx / GridPhoto.tsx の CSS Grid 変換で `gap-x-grid-gutter` + inline `rowGap` を使用**: row-gap が `var(--gutter)`（column-gap の半分）のため、`gap-grid-gutter` では代替できず `gap-x-grid-gutter` で column-gap のみ設定し row-gap は inline style で維持
- **snippet.tsx の CSS Grid 変換で `gap-grid-gutter` を使用**: row-gap と column-gap が同値（`calc(var(--gutter) * 2)`）のため inline style を除去し `gap-grid-gutter` で一括設定

### 4. リスク・前提・未確認事項

- ブラウザでの目視確認はできていない。CSS Grid への変換により、旧 flex grid（ネガティブマージン + 子要素パディング）から gap ベースのレイアウトに変わったため、**グリッド端の余白が微妙に異なる可能性がある**。特に `GridDemo.tsx` と `GridPhoto.tsx` のブロックグリッドでの確認を推奨
- `npm run build` 成功、`/` と `/snippet/` で HTTP 200 確認済み
- `gridStyles` の grep 残存: コメント内のみ（GridDemo.tsx L13-22、footer.tsx L41）
- `gutterStyles` の grep 残存: コメント内のみ（GridDemo.tsx L13、footer.tsx L41）
- `jc-start` / `ai-center` の grep 残存: 0 件

---

## Step 7 — 不要ディレクトリ削除（2026-03-28）

### 1. 実装したこと

| 削除対象 | 状態 |
|---|---|
| `src/styles/global/utility/` | 本 Step で削除（9 ファイル: _display, _flex, _font, _margin, _padding, _responsive-embed, _scroll-hint, _tables, _visibility） |
| `src/styles/global/layout/` | 本 Step で削除（1 ファイル: _grid-variables） |
| `src/styles/global/mixins/` | 本 Step で削除（8 ファイル: _clearfix, _dl, _gutter, _hover, _index, _table-row, _transition, _zindex）。Step 4 時点では gutter.module.scss が参照していたため保留されていたが、Step 6 で gutter.module.scss が削除されたため参照 0 件を確認の上で削除 |

### 2. まだやっていないこと

- docs/ 内ドキュメントの更新 — 本計画のスコープ外

### 3. 例外として残したこと

- `src/styles/global/foundation/` は Step 3 で削除済みのため本 Step での作業なし
- `src/styles/global/style.scss` は Step 4 で最終構成に書き換え済みのため本 Step では変更なし
- `_tailwind-base-layer.scss` のコメント内に `layout/_grid.scss`、`layout/_header.scss` への出典記載が残存 — コメントのみのため影響なし

### 4. リスク・前提・未確認事項

- `npm run build` 成功、`/` と `/snippet/` で HTTP 200 確認済み
- ブラウザでの目視確認はできていない
- `style.scss` は本 Step で変更していない（`git diff HEAD -- src/styles/global/style.scss` で確認。表示される差分は Step 4 以降のコミット未反映分の累積差分）
