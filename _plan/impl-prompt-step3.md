# 実装プロンプト: Step 3 — Foundation / リセットの入れ替え

---

## Source of Truth

- 計画書: `_plan/tw-migration-plan-2026-03-23.md` §9（SCSS変数→CSS変数の変換）、§14 Step 3
- 事前チェック: `_plan/precheck-01-css-variables.md`（CSS変数値の比較表）
- tw_source 参照: `tw_source/src/scss/_tailwind-base-layer.scss`

---

## 前提条件

Step 2 が完了していること（global API 再構成済み、`npm run build` 成功済み）。

---

## 目的

tw_source の `_tailwind-base-layer.scss`（`:root` CSS 変数 + リセット補足）を導入し、現在 `project/_style.scss` にある `:root` CSS 変数定義と `foundation/` のリセット CSS を置き換える。

---

## 作業後の最終到達状態

1. `src/styles/global/_tailwind-base-layer.scss` が配置されている
2. そのファイル内の `:root` に全 CSS 変数が定義されている（`--clr1` 〜 `--clrg900`, gutter 系, header-height 含む）
3. `project/_style.scss` 内の `:root` ブロック（L15-39）が削除されている
4. `project/_style.scss` 内の `h1, h2 { font-weight: normal; }`（L42-44）が削除されている
5. `project/_style.scss` 内の `@use "sass:color";`（L2）が削除されている
6. `project/_style.scss` 内の `@use "../../modules/grid.module.scss" as grid;`（L4）が削除されている
7. `foundation/` ディレクトリが全削除されている
8. `style.scss` から `foundation/` 関連の `@use` が削除されている
9. `style.scss` から `layout/_grid-variables` の `@use` が削除されている
10. `npm run build` がエラーなく完了する
11. 既存スタイルが崩れていない

---

## スコープ（変更してよいファイル）

- `src/styles/global/_tailwind-base-layer.scss`（新規作成）
- `src/styles/global/project/_style.scss`（`:root` 削除、import 削除のみ）
- `src/styles/global/style.scss`（`@use` の削除のみ）
- `src/styles/global/foundation/`（全削除）

## 非スコープ（変更してはならないファイル）

- `src/styles/modules/` 配下の全ファイル
- `src/styles/global/component/` — Step 4 の対象
- `src/styles/global/layout/`（`_grid-variables.scss` の @use 削除は style.scss 側で行う。layout/ 自体の削除は Step 7）
- TSX ファイル全て
- `tw_source/` 配下（参照のみ）

## 判断禁止事項

- `_tailwind-base-layer.scss` の内容を「Next.js に合わせて」独自に書き換えてはならない。下記の 3 点の指定変更のみ行い、それ以外は tw_source のまま使う
- `project/_style.scss` の `:root` 以外の内容（`inview__fadein` / `is-inview`、コメントアウト済みコード等）を変更してはならない
- `style.scss` で `foundation/` と `layout/_grid-variables` 以外の `@use` を削除してはならない

---

## 作業手順

### 3-1. _tailwind-base-layer.scss の配置

`tw_source/src/scss/_tailwind-base-layer.scss` を `src/styles/global/_tailwind-base-layer.scss` にコピーする。

コピー後、以下の **3 点のみ** 変更する:

**変更 1**: `:root` C-1 セクション内の `--bdrs` の値を変更
```scss
// 変更前（tw_source の値）
--bdrs: #{g.rem(50)};
// 変更後（現行 Next.js の値を維持）
--bdrs: #{g.rem(6)};
```

**変更 2**: `:root` C-1 セクション内に `--modal-height-photo` を追加（`--bdrs-lg` の後ろ）
```scss
--modal-height-photo: 75vh;
```

**変更 3**: `@layer components` の `.form` CSS 変数ブロックを削除する（`.form { ... }` のブロック全体）。`.youtube` のブロックはそのまま残す。

上記 3 点以外は一切変更しない。gutter 系変数、header-height、リセット補足、strong ルール等は全て tw_source のまま。

### 3-2. project/_style.scss の修正

以下を削除する:

1. **L2**: `@use "sass:color";` — `color.scale()` は `:root` 削除で不要になる
2. **L4**: `@use "../../modules/grid.module.scss" as grid;` — grid.module.scss は Step 6 で廃止
3. **L15-39**: `:root { ... }` ブロック全体 — `_tailwind-base-layer.scss` の `:root` で置換
4. **L42-44**: `h1, h2 { font-weight: normal; }` — `_tailwind-base-layer.scss` のリセット補足で headings の `font-weight: normal` がカバーされている

**削除してはならないもの**:
- L1: `@charset "utf-8";`
- L3: `@use "../global" as g;`
- L47-68: `$fadein-duration`, `$fadein-offset`, `.inview__fadein`, `.is-inview`
- L71 以降: コメントアウト済みの swiper コード

### 3-3. style.scss の @use 削除

`src/styles/global/style.scss` から以下の `@use` 行を削除する:
- `foundation/_destyle` に関する `@use`
- `foundation/_reboot` に関する `@use`
- `layout/_grid-variables` に関する `@use`
- その他 `foundation/` 配下のファイルを参照している `@use`

具体的な行は `style.scss` を読んで確認すること。**上記に該当しない `@use` は削除しない。**

`_tailwind-base-layer` の `@use` はまだ追加しない（Step 4 で style.scss を §11 の構成に書き換える際に追加する）。

### 3-4. foundation/ ディレクトリ削除

`src/styles/global/foundation/` ディレクトリを全て削除する。

### 3-5. ビルド確認

```bash
npm run build
npm run serve
```

---

## 着手前の確認事項

`_plan/precheck-01-css-variables.md` を読み、以下を把握してから着手する:
- 現行 `_style.scss` の `:root` にあって `_tailwind-base-layer.scss` にない変数（`--modal-height-photo`）→ 手順 3-1 変更 2 で追加
- `_tailwind-base-layer.scss` にあって現行にない変数（`--clr-prim-green`, `--link-color`, `--link-hover-color`, `--bdrs-lg`）→ そのまま残す（追加で困ることはない）
- `--bdrs` の値の差（tw_source: `g.rem(50)` vs 現行: `g.rem(6)`）→ 手順 3-1 変更 1 で対応

---

## 完了チェック（全て満たすこと）

- [ ] `_tailwind-base-layer.scss` が `src/styles/global/` に存在する
- [ ] `--bdrs` の値が `#{g.rem(6)}` である（`g.rem(50)` ではない）
- [ ] `--modal-height-photo: 75vh` が `:root` 内に存在する
- [ ] `.form` CSS 変数ブロックが削除されている
- [ ] `.youtube` ブロックが残っている
- [ ] `project/_style.scss` の `:root` ブロックが削除されている
- [ ] `project/_style.scss` の `@use "sass:color"` が削除されている
- [ ] `project/_style.scss` の `@use "../../modules/grid.module.scss"` が削除されている
- [ ] `project/_style.scss` の `.inview__fadein` と `.is-inview` が残っている
- [ ] `project/_style.scss` のコメントアウト済みコードが残っている
- [ ] `foundation/` ディレクトリが存在しない
- [ ] `style.scss` に `foundation/` 関連の `@use` がない
- [ ] `npm run build` がエラーなく完了する
- [ ] 既存スタイルが崩れていない

---

## 残置を許すもの

- `style.scss` に `_tailwind-base-layer` の `@use` がまだないこと → Step 4 で追加する
- `layout/` ディレクトリがまだ存在すること → Step 7 で削除する

---

## 最終報告で列挙すること

1. 実装したこと（配置・変更・削除したファイル一覧と内容）
2. まだやっていないこと（style.scss への _tailwind-base-layer の @use 追加等）
3. 例外として残したこと
4. リスク・前提・未確認事項（CSS 変数値の差異で気になった点があれば明記）
