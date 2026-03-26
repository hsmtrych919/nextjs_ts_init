# 実装プロンプト: Step 6 — grid.module.scss / gutter.module.scss 廃止 + TSX 書き換え

---

## Source of Truth

- 計画書: `_plan/tw-migration-plan-2026-03-23.md` §10（grid/gutter 廃止と変換表）、§14 Step 6
- 事前チェック: `_plan/precheck-03-grid-gutter-tsx-usage.md`（全使用箇所マップ + Tailwind 変換表）
- tailwind.config.js（`extend.padding` の gutter 系ユーティリティ定義）

---

## 前提条件

Step 5 が完了していること（FLOCSS prefix 除去済み、`npm run build` 成功済み）。

---

## 目的

`grid.module.scss` と `gutter.module.scss` を廃止し、全 TSX から CSS Modules の import を削除して Tailwind ユーティリティ + `container-width` クラス（`features/_layout.scss` で定義済み）に書き換える。旧 utility クラスも同時に置換する。

---

## 作業後の最終到達状態

1. `grid.module.scss` と `gutter.module.scss` が削除されている
2. 全 TSX から `gridStyles` と `gutterStyles` の import が削除されている
3. 全 TSX で Tailwind ユーティリティクラスに書き換えられている
4. header.tsx の `jc-start ai-center` が `justify-start items-center` に置換されている
5. `npm run build` がエラーなく完了する
6. 全ページのレイアウトが崩れていない

---

## スコープ（変更してよい TSX ファイル）

- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `pages/index.tsx`
- `pages/snippet.tsx`
- `src/components/ui/GridDemo.tsx`（実コードのみ。L5-72 のコメントドキュメントは変更しない）
- `src/components/ui/GridPhoto.tsx`
- `src/components/ui/ModalPhoto.tsx`
- `src/components/ui/ModalFooter.tsx`

削除対象:
- `src/styles/modules/grid.module.scss`
- `src/styles/modules/gutter.module.scss`

## 非スコープ（変更してはならないファイル）

- 上記以外の全ファイル
- GridDemo.tsx のコメントドキュメント（L5-72）— 本計画のスコープ外
- SCSS ファイル全て（grid.module.scss と gutter.module.scss の削除を除く）
- `src/styles/global/utility/` — Step 7 の対象

## 判断禁止事項

- GridDemo.tsx のコメントドキュメント（L5-72）を更新してはならない。旧内容のまま残す
- arbitrary value（`[var(--gutter-row)]` 等の `[]` 記法）を使ってはならない。`tailwind.config.js` の `extend.padding` に定義済みのカスタムユーティリティ（`px-gutter-row`, `pl-gutter-2` 等）を使う
- 直値（`px-4`, `w-[300px]` 等）でレイアウトを再現してはならない。config 定義済みのユーティリティか Tailwind ビルトインユーティリティを使う
- レイアウト構造（HTML の入れ子、div の追加/削除）を変更してはならない。className の書き換えのみ行う
- コンポーネントの props やロジックを変更してはならない

---

## 変換ルール

**着手前に `_plan/precheck-03-grid-gutter-tsx-usage.md` と `tailwind.config.js` を読むこと。**

### gridStyles の変換

| CSS Modules | 定義 | Tailwind 置換 |
|---|---|---|
| `gridStyles['row--container']` | container + flex + max-width | `container-width mx-auto flex flex-wrap` |
| `gridStyles['col--12']` | `width: 100%` | `w-full` |
| `gridStyles['col--{n}']` | `width: n/12 * 100%` | `w-{n}/12` |
| `gridStyles['col--sm-{n}']` | `@media sm { width: n/12 }` | `sm:w-{n}/12` |
| `gridStyles['col--md-{n}']` | `@media md { width: n/12 }` | `md:w-{n}/12` |
| `gridStyles['col--lg-{n}']` | `@media lg { width: n/12 }` | `lg:w-{n}/12` |
| `gridStyles['col--xl-{n}']` | `@media xl { width: n/12 }` | `xl:w-{n}/12` |
| `gridStyles.col` | `flex: 1 0 0%` (auto column) | `grow basis-0` |
| `gridStyles.grid` | flex + wrap + gutter margin | `flex flex-wrap -mx-[var(--gutter)]` ※grid コンテナのネガティブマージンのため arbitrary value 許可 |
| `gridStyles['grid--{n}']` | n列グリッド | 子要素の幅で制御 |

**grid の子要素**: `.grid--2` の場合、子要素は `width: 50%` + gutter padding。Tailwind では子要素に `w-1/2 px-[var(--gutter)]` を適用する。ただし、grid 系は CSS Grid への移行も計画書 §10 で言及されている（`grid grid-cols-2 md:grid-cols-4 gap-grid-gutter`）。**grid 系は CSS Grid ユーティリティ（`grid grid-cols-{n}`）を優先して使用する**。

### gutterStyles の変換（config 定義済みユーティリティ使用）

| CSS Modules | Tailwind 置換 |
|---|---|
| `gutterStyles.container` | `px-gutter-row xl:px-0` |
| `gutterStyles['container--initial']` | `px-gutter-row md:px-0`（TSX 未使用） |
| `gutterStyles['small--left']` | `sm:pl-gutter-2 md:pl-gutter-3` |
| `gutterStyles['small--right']` | `sm:pr-gutter-2 md:pr-gutter-3` |
| `gutterStyles['medium--right']` | `md:pr-gutter-3` |

### 旧 utility クラスの変換

| 旧クラス | Tailwind 置換 |
|---|---|
| `jc-start` | `justify-start` |
| `ai-center` | `items-center` |

---

## 作業手順

### 6-1. 各 TSX の書き換え

1 ファイルずつ書き換える。各ファイルで:
1. `gridStyles` と `gutterStyles` の import 行を削除する
2. className 内の `gridStyles[...]` と `gutterStyles[...]` を変換ルールに従い Tailwind クラスに書き換える
3. 旧 utility クラス（`jc-start` 等）があれば Tailwind に置換する
4. テンプレートリテラル（`` `${}` ``）が不要になった箇所は通常の文字列に変更する

**ファイルごとの注意**:

- **header.tsx**: `jc-start ai-center` → `justify-start items-center` も同時に変更
- **GridDemo.tsx**: L5-72 のコメントドキュメントは触らない。L73 以降の実コードのみ変更。`.col`（L140, L146）→ `grow basis-0`
- **GridPhoto.tsx**: `gridStyles` のみ使用（gutterStyles なし）

### 6-2. grid.module.scss / gutter.module.scss の削除

全 TSX の書き換えが完了し、`gridStyles` と `gutterStyles` の import が 0 件であることを確認した後に削除する。

### 6-3. ビルド確認

```bash
npm run build
npm run serve
```

全ページのレイアウトを確認する。

---

## 完了チェック（全て満たすこと）

- [ ] `src/styles/modules/grid.module.scss` が存在しない
- [ ] `src/styles/modules/gutter.module.scss` が存在しない
- [ ] プロジェクト全体で `gridStyles` の検索結果が 0 件（GridDemo.tsx のコメント内を除く）
- [ ] プロジェクト全体で `gutterStyles` の検索結果が 0 件（GridDemo.tsx のコメント内を除く）
- [ ] プロジェクト全体で `jc-start` の検索結果が 0 件
- [ ] プロジェクト全体で `ai-center` の検索結果が 0 件
- [ ] arbitrary value（`[]` 記法）を使っている箇所がある場合、grid コンテナのネガティブマージンのみであること
- [ ] `npm run build` がエラーなく完了する
- [ ] 全ページのレイアウトが崩れていない

---

## 残置を許すもの

- GridDemo.tsx のコメントドキュメント（L5-72）内に旧クラス名が残ること → 本計画のスコープ外
- `utility/`, `layout/` ディレクトリ → Step 7 で削除

---

## 最終報告で列挙すること

1. 実装したこと（各 TSX の変更概要、削除したファイル）
2. まだやっていないこと（utility/ / layout/ 削除、GridDemo コメント更新）
3. 例外として残したこと（arbitrary value を使った箇所があれば具体的に列挙）
4. リスク・前提・未確認事項（レイアウト確認で気になったページがあれば明記）
