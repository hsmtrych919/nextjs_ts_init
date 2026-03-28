# ドキュメント更新計画書

作成日: 2026-03-28
目的: GridDemo.tsx コメントドキュメント、footer.tsx コメント、docs/ 内ドキュメントを移行後の現状に合わせて一括更新

---

## 前提: 移行による変更サマリ

### 削除されたもの
- `grid.module.scss` / `gutter.module.scss`（CSS Modules → Tailwind ユーティリティに置換）
- `foundation/` ディレクトリ（Tailwind reset に置換）
- `mixins/` ディレクトリ（`_hover.scss` は `global/global/` に統合、他は削除）
- `utility/` ディレクトリ（Tailwind ユーティリティに置換）
- `layout/` ディレクトリ（`_grid-variables.scss` → Tailwind config に統合）
- `component/` ディレクトリ → `features/` にリネーム（サードパーティは `vendor/` に分離）
- `project/` ディレクトリ → `features/` に統合
- `_unicode.scss`、`_variables-color.scss`
- FLOCSS `c-` prefix（`c-toggle` → `toggle`、`c-tab` → `tab`、`c-table` → `table`）
- `gridStyles[...]` / `gutterStyles[...]` 参照パターン
- `jc-start` / `ai-center` 等のカスタムユーティリティクラス

### 新しいシステム
- Tailwind CSS v4（`@tailwindcss/postcss` 経由）
- コンテナ: `container-width mx-auto flex flex-wrap px-gutter-row xl:px-0`
- カラム幅: `w-full`, `w-6/12`, `md:w-10/12` 等（Tailwind 標準幅クラス）
- ブロックグリッド: `grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter`
- Auto columns: `grow basis-0`
- ガター: `px-gutter-row`, `sm:pl-gutter-2`, `md:pl-gutter-3` 等（tailwind.config.js extend.padding）
- SCSS 層構造: `global/global/` + `features/` + `vendor/` の 3 層（旧 7 層から簡素化）
- `@use "../global" as g;`（features/）、`@use "../global/global" as g;`（modules/）

### 現在のディレクトリ構造（実ファイル確認済み）

```
src/styles/
├── modules/                    # CSS Modules（7ファイル）
│   ├── button.module.scss
│   ├── type.module.scss
│   ├── index.module.scss
│   ├── header.module.scss
│   ├── footer.module.scss
│   ├── modal-photo.module.scss
│   └── modal-footer.module.scss
└── global/
    ├── style.scss              # Sass エントリーポイント
    ├── _tailwind-base-layer.scss   # @layer base（CSS 変数、Tailwind 連携）
    ├── global/                 # 共通 API
    │   ├── _index.scss
    │   ├── _variables.scss
    │   ├── _breakpoints.scss
    │   ├── _calc.scss
    │   ├── _font.scss
    │   ├── _hover.scss
    │   └── _media-queries.scss
    ├── features/               # プロジェクト固有グローバルスタイル
    │   ├── _layout.scss        # container-width 等
    │   ├── _tab.scss
    │   ├── _toggle.scss
    │   ├── _table.scss
    │   └── _style.scss         # WP コンテンツ用
    └── vendor/                 # サードパーティ CSS
        ├── react-modal/
        │   ├── _react-modal.scss
        │   ├── _modal-photo.scss
        │   └── _modal-footer.scss
        ├── scroll-hint/
        │   └── _index.scss
        └── swiper/
            └── _swiper-bundle.scss
```

---

## 更新対象一覧

### A. GridDemo.tsx（L3-70 JSDoc コメント）
### B. footer.tsx（L41-43 コメントアウトコード）
### C. docs/scss-styling-guide.md（全面改訂）
### D. docs/file-naming-standards-scss.md（全面改訂）
### E. docs/jsdoc-component-guide.md（部分更新）
### F. README.md（技術構成・ファイル一覧更新）
### G. クリーンアップ（tw_source/ と _plan/ ディレクトリ削除）

---

## A. GridDemo.tsx — JSDoc コメント更新

**対象**: L3-70（68 行の JSDoc ブロック）
**実コード（L71-186）は変更しない**

### 現状の問題点

JSDoc が旧グリッドシステム（CSS Modules の `gridStyles` / `gutterStyles`）を説明しているが、実コード（L79 以降）は既に Tailwind ユーティリティに書き換え済み。ドキュメントと実装が完全に乖離している。

### 具体的な乖離箇所

| 行 | 現状（旧システム記述） | 実コードの現状 |
|---|---|---|
| L6 | 「CSS Modulesに移行されたグリッドクラスを使用した」 | Tailwind ユーティリティクラスを使用 |
| L13 | `gridStyles['row--container']` `gutterStyles.container` | `container-width mx-auto flex flex-wrap px-gutter-row xl:px-0` |
| L14 | `gridStyles['col--12']` `gridStyles['col--lg-8']` | `w-full lg:w-8/12` |
| L22 | `gridStyles['grid']` `gridStyles['grid--2']` `gridStyles['grid--md-4']` | `grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter` |
| L30 | `.row--container`, `.grid` | `container-width`, `grid grid-cols-*` |
| L31 | `.col--*`, `.col--*-*` | `w-*/12`, `md:w-*/12` |
| L41-45 | `.row--container`, `.col--{n}`, `.grid .grid--{n}`, `.container` | Tailwind クラス群 |
| L47-56 | `@example` で旧クラス名使用 | Tailwind クラス使用 |
| L58-64 | `@example` で `grid--1 grid--sm-2 grid--lg-3` | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| L69 | 「フレックスボックスベースの実装」 | CSS Grid + Flexbox ハイブリッド |

### 更新内容

JSDoc 全体を現在の Tailwind ベースのグリッドシステムに書き換え:

1. **冒頭説明**: 「Tailwind CSS ユーティリティクラスを使用したレスポンシブレイアウトシステムのデモ」に変更
2. **パターン1（標準カラムレイアウト）**: `container-width mx-auto flex flex-wrap px-gutter-row xl:px-0` + `w-full lg:w-8/12` の例に変更
3. **パターン2（ブロックグリッド）**: `grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter` の例に変更
4. **設計思想**: 3 層構造の説明は維持、クラス名を Tailwind に更新
5. **主要クラス一覧**: Tailwind クラスに全面差し替え
6. **@example**: 実コードに合わせた Tailwind クラスの例に変更
7. **@remarks**: 「CSS 変数 + Tailwind ユーティリティベースの実装」に変更

### 実コード内コメントの更新

| 行 | 現状 | 更新後 |
|---|---|---|
| L81 | `.row--container - レスポンシブコンテナ（CSS Modules版）` | `container-width - レスポンシブコンテナ（Tailwind版）` |
| L93 | `.col--12 .col--sm-6 .col--lg-4（CSS Modules版）` | `w-full sm:w-6/12 lg:w-4/12（Tailwind版）` |
| L100 | 同上 | 同上 |
| L107 | `.col--12 .col--sm-12 .col--lg-4（CSS Modules版）` | `w-full lg:w-4/12（Tailwind版）` |
| L121 | `Main Content Area（CSS Modules版）` | `Main Content Area（Tailwind版）` |
| L127 | `Sidebar（CSS Modules版）` | `Sidebar（Tailwind版）` |
| L139 | `.col 自動幅（CSS Modules版）` | `grow basis-0 自動幅（Tailwind版）` |
| L145 | `.col 自動幅 Lorem ipsum...（CSS Modules版）` | `grow basis-0 自動幅 Lorem ipsum...（Tailwind版）` |
| L176 | `.grid--2 .grid--md-4 - Mobile: 2列, Desktop: 4列` | `grid-cols-2 md:grid-cols-4 - Mobile: 2列, Desktop: 4列` |

---

## B. footer.tsx — コメントアウトコード更新

**対象**: L41-43

### 現状

```tsx
{/* <ul className={`${gridStyles['row--container']} ${gutterStyles.container} ${styles.navi_list}`}>
  <li><a className={styles.navi_button} href="#">ダミーテキストです。</a></li>
</ul> */}
```

### 問題

コメントアウトされたコードが削除済みの `gridStyles` / `gutterStyles` を参照。コメント内だが、将来復活させる場合の参考として現行システムに合わせておく。

### 更新後

```tsx
{/* <ul className={`container-width mx-auto flex flex-wrap px-gutter-row xl:px-0 ${styles.navi_list}`}>
  <li><a className={styles.navi_button} href="#">ダミーテキストです。</a></li>
</ul> */}
```

---

## C. docs/scss-styling-guide.md — 全面改訂

**現状**: 996 行。旧 7 層 FLOCSS 構造を前提としたスタイリングガイド。
**方針**: 移行後の SCSS + Tailwind ハイブリッド構造に合わせて全面改訂。

### セクション別の更新方針

#### §1 SCSS 体系概要（L1-83）— **全面書き換え**

- 「7 層構造」→「CSS Modules 層 + グローバル層（global/ + features/ + vendor/）+ Tailwind 層」
- §1.1 全体構造: 現在のディレクトリツリーに差し替え
- §1.2 CSS Modules 層: 旧ガイドの `grid.module.scss` / `gutter.module.scss` 記載を削除し、`modal-photo.module.scss` / `modal-footer.module.scss` を追加。現状 7 ファイルに合わせて更新
- §1.3 グローバル層: Foundation/Global/Mixins/Layout/Component/Project/Utility の 6 副層 → global/ + features/ + vendor/ の 3 副層に書き換え
- Tailwind CSS v4 の位置づけ（`@tailwindcss/postcss` 経由、SCSS → PostCSS → Tailwind の処理順）を追記

#### §2 優先順位とファイル選択ルール（L84-118）— **大幅修正**

- 優先順位 3「ユーティリティクラスの活用」→「Tailwind ユーティリティクラスの活用」に変更
- `utility/` の記述を全て削除
- `component/` → `features/` に変更
- Tailwind ユーティリティの位置づけを明記（余白、幅、Flexbox、Grid は Tailwind 優先）

#### §3 BEM 記法とクラス命名規則（L119-283）— **部分修正**

- L147-161: grid.module.scss / gutter.module.scss の例を削除
- L149-159: `.c-toggle__wrap` → `.toggle__wrap` に更新（FLOCSS `c-` prefix 廃止）
- L192-220: ユーティリティクラス命名の例（`jc-center`, `ai-center`, `mt-0`）→ Tailwind 標準クラス（`justify-center`, `items-center`, `mt-0`）に変更
- L234-244: grid.module.scss 内の breakpoint-infix 例 → 削除（該当ファイルが存在しない）

#### §4 実装例とベストプラクティス（L285-415）— **部分修正**

- L304-316: `global/project/_style.scss` → `global/features/_style.scss` に変更
- L344-367: `global/component/_carousel.scss` → `global/features/_carousel.scss` に変更、`c-carousel__*` → `carousel__*` に変更
- L369-378: ユーティリティクラス活用例 → Tailwind クラスの例に変更

#### §5 判断フローチャート（L417-460）— **修正**

- L435: `global/project/_style.scss` → `global/features/_style.scss`
- L440: `global/component/` → `global/features/`
- Tailwind ユーティリティで対応可能かの判断ステップを追加（§5.1 の手順 2 を Tailwind に変更）

#### §6 メンテナンス指針（L461-510）— **修正**

- L471: `grep -r "..." src/styles/global/utility/` → utility/ 削除のため例を更新
- L476: 接頭辞 `c-` の記述を削除
- L509-510: `foundation/_destyle.css` / `foundation/_reboot.scss` → これらは Tailwind reset に置換されたため削除

#### §7 余白設定ガイドライン（L512-639）— **部分修正**

- L626: `mt-4 pb-6` → これは Tailwind 標準クラスとして有効。説明文で「Tailwind ユーティリティクラス」と明記

#### §8 レスポンシブ対応ガイドライン（L641-814）— **部分修正**

- L683: `src/styles/global/foundation/_variables.scss で定義済み` → `tailwind.config.js の screens で定義済み` に変更
- L693: メディアクエリ変数は `global/global/_media-queries.scss` で引き続き有効。Tailwind のレスポンシブ prefix（`sm:`, `md:` 等）も追記
- L756: `mt-2 mt-4-sm mt-6-md` → 旧 utility クラスのため `mt-2 sm:mt-4 md:mt-6` に変更

#### §9 コンテンツ幅使用ガイドライン（L816-928）— **全面書き換え**

- `grid.module.scss` + `gutter.module.scss` → `container-width` + Tailwind 幅クラス + カスタムガターに全面差し替え
- L820: 「既存のグリッドシステム (`grid.module.scss` + `gutter.module.scss`)」→ 「Tailwind ユーティリティ + `container-width` クラス」
- L825-833: `gridStyles` / `gutterStyles` の 3 層構造例 → Tailwind クラスの例に差し替え
- L837-838: 利用可能クラス → Tailwind クラス + カスタムガタークラスに更新
- L896-902: 例外使用の例も Tailwind ベースに更新

#### §10 display: grid; 使用に関する位置づけ（L930-991）— **大幅修正**

- L934: 「Flexbox ベースのグリッドシステム」→ 「Tailwind CSS Grid ユーティリティ」に変更
- 「`display: grid;` の使用は推奨しない」→ Tailwind の `grid grid-cols-*` を標準として採用しているため、この制約は撤廃
- `global/component/` → `global/features/`

#### フッター（L995-996）— **更新**

- `Next.js 13.5, TypeScript, SCSS` → `Next.js 15, TypeScript, SCSS, Tailwind CSS v4`

---

## D. docs/file-naming-standards-scss.md — 全面改訂

**現状**: 350 行。旧 7 層構造とグリッドシステムを前提とした命名規則。
**方針**: 現在のディレクトリ構造・ファイル構成に合わせて全面改訂。

### セクション別の更新方針

#### §1 CSS Modules ファイル（L14-55）— **修正**

- L22-28: 現状の実装例から `grid.module.scss` / `gutter.module.scss` を削除、`modal-photo.module.scss` / `modal-footer.module.scss` を追加

#### §2 グローバル SCSS ファイル（L56-113）— **全面書き換え**

- Foundation 層、Mixins 層、Layout 層、Component 層、Utility 層の記述を全て削除
- 現在の 3 副層（global/ + features/ + vendor/）に書き換え:
  - **global/ 層（共通 API）**: `_index.scss`, `_variables.scss`, `_breakpoints.scss`, `_calc.scss`, `_font.scss`, `_hover.scss`, `_media-queries.scss`
  - **features/ 層（プロジェクト固有グローバル）**: `_layout.scss`, `_tab.scss`, `_toggle.scss`, `_table.scss`, `_style.scss`
  - **vendor/ 層（サードパーティ）**: `react-modal/`, `scroll-hint/`, `swiper/`
- `_variables-color.scss`, `_unicode.scss` は削除済みのため記載しない

#### グローバルクラス命名規則（L114-134）— **修正**

- `c-toggle__wrap` → `toggle__wrap` に更新（FLOCSS `c-` prefix 廃止）
- `c-toggle__title` → `toggle__title`
- `c-toggle__button` → `toggle__button`

#### クラス命名ガイドライン（L136-245）— **大幅修正**

- L147-175: grid.module.scss / gutter.module.scss の実装例 → 削除
- L192-220: ユーティリティクラス命名（`jc-center`, `ai-center`, `mt-0`, `mx-auto`）→ 「Tailwind ユーティリティクラスに移行済み」と記載
- L234-244: grid.module.scss の breakpoint-infix 例 → 削除

#### ディレクトリ配置ルール（L247-265）— **修正**

- `component/` → `features/`
- `utility/` → 削除済みのため除去

#### 新規ファイル作成判断（L311-331）— **修正**

- L325: `適切な src/styles/global/ サブディレクトリ` → `src/styles/global/features/` に具体化
- L331: `_style.scss または utility/ クラスを活用` → `_style.scss または Tailwind ユーティリティを活用`

#### フッター（L349-350）— **更新**

- `Next.js 13.5, SCSS` → `Next.js 15, SCSS, Tailwind CSS v4`

---

## E. docs/jsdoc-component-guide.md — 部分更新

**現状**: 343 行。JSDoc テンプレートとコンポーネント実装パターン。
**方針**: 旧クラス名参照のみ更新。ガイド自体の構造は維持。

### 更新箇所

| 行（概算） | 現状 | 更新後 |
|---|---|---|
| L275 | `button.module.scss` | 変更なし（存在する） |
| L276 | `toggle.module.scss` | 存在しない。`global/features/_toggle.scss` に修正 |
| L308 | `c-toggle__wrap` | `toggle__wrap` |
| L309 | `.js-toggle-message` | 変更なし（現存するクラス名か要確認） |

---

## F. README.md — 更新

**現状**: 42 行。技術構成・主要機能・メモ。
**方針**: 移行後の技術構成に合わせて更新。

### 更新箇所

#### 技術構成（L4-8）

| 行 | 現状 | 更新後 |
|---|---|---|
| L5 | `Next.js 13.5` (App Router非使用) | `Next.js 15` (Pages Router) |
| L7 | `SCSS` (GSAP, React Modal対応) | `SCSS + Tailwind CSS v4`（`@tailwindcss/postcss` 経由）(GSAP, React Modal対応) |

#### 主要機能（L10-29）

- L10: 更新日 `2025年7月23日` → `2026-03-28`
- L18: `src/components/ui/modal.tsx` → 現状のファイル名・構成に合わせて確認・更新
- L21: `src/components/ui/modal/component.tsx` → 現存するか確認して更新
- L24: `src/lib/hooks/toggle-content.tsx` → 現在のパスに合わせて確認・更新
- L26: `src/lib/utils/smooth-scroll.tsx` → 同上
- L27: `src/lib/utils/rewrite-path.tsx` → 同上
- L28: `src/lib/utils/link_ignore.tsx` → 同上

※ 各ファイルパスは実装時に現物確認して正確に記載すること。存在しないファイルは削除、新規ファイル（ModalPhoto.tsx, ModalFooter.tsx, GridPhoto.tsx, GridDemo.tsx, TabDemo.tsx, ToggleDemo.tsx, TableDemo.tsx）は追加。

#### メモ（L32-42）

- 背景画像パスの説明は引き続き有効。変更なし。

---

## G. クリーンアップ — tw_source/ と _plan/ ディレクトリ削除

**タイミング**: A〜F の全ドキュメント更新が完了し、ビルド確認が通った後

### 削除対象

1. `tw_source/` ディレクトリ（丸ごと削除）
   - 移行の参照元として使用済み。移行完了・ドキュメント整理完了後は不要
   - ビルド・ランタイムへの参照: 0 件（確認済み）

2. `_plan/` ディレクトリ（丸ごと削除）
   - 移行計画書、impl-prompt、precheck、ログ、post-migration-issues、本計画書を含む
   - 移行作業の全記録。作業完了後は不要

### 事前確認

- `tw_source` への参照が `src/` 内のビルド対象ファイル（js, ts, scss, json, config）に 0 件であること（確認済み）
- `_plan` への参照が同様に 0 件であること

---

## 更新対象外（変更しないファイル）

| ファイル | 理由 |
|---|---|
| `docs/ai-critical-rules.md` | 行動規範。コード構造への参照なし |
| `docs/ai-playwright-rules.md` | テスト手順。コード構造への参照なし |
| `docs/development-workflow.md` | 開発コマンド。`@features/rewrite-path.tsx` 等の参照は現存するため変更不要 |
| `docs/file-naming-standards-ts.md` | TS命名規則。`features/` ディレクトリ（TS側）は現存するため変更不要。ただし L94-99 の features/ 廃止言及は要確認 |

---

## 実装順序

| # | 対象 | 作業量 | 依存 |
|---|---|---|---|
| 1 | B. footer.tsx コメント更新 | 極小（3 行） | なし |
| 2 | A. GridDemo.tsx JSDoc + インラインコメント更新 | 中（68 行書き換え + インラインコメント 9 箇所） | なし |
| 3 | D. file-naming-standards-scss.md 改訂 | 大（全面改訂） | なし |
| 4 | C. scss-styling-guide.md 改訂 | 大（全面改訂、996 行中大部分に修正あり） | なし |
| 5 | E. jsdoc-component-guide.md 部分更新 | 小（2-3 箇所） | なし |
| 6 | F. README.md 更新 | 小（技術構成 + ファイル一覧） | なし |
| 7 | ビルド確認 | `npm run build` | 1-6 完了後 |
| 8 | G. tw_source/ と _plan/ ディレクトリ削除 | 極小 | 7 完了後 |

---

## 注意事項

- **実コードは変更しない**（GridDemo.tsx の L71-186、footer.tsx の L1-40/L44-54 は変更対象外）
- docs/ の改訂は「現状のコードに合わせる」が原則。将来の移行予定（tw_source の残りフェーズ）の内容は含めない
- `scss-styling-guide.md` は最大規模の改訂。§9（コンテンツ幅）と §10（display: grid）は移行で根本的に前提が変わったため全面書き換え
- `file-naming-standards-ts.md` の L94-99 に features/ ディレクトリ（TS 側）の廃止言及があるが、これは SCSS の features/ とは別ディレクトリ（`src/features/` = TS 側）。SCSS 側 `src/styles/global/features/` とは無関係。確認の上、変更不要と判断
