# 実装プロンプト: Step 4 — features/ / vendor/ の再配置 + module.scss 修正

---

## Source of Truth

- 計画書: `_plan/tw-migration-plan-2026-03-23.md` §4（ディレクトリ構造）、§6（ファイル移行マッピング）、§7（type.module.scss）、§8（global API）、§9（SCSS変数→CSS変数）、§11（style.scss）、§14 Step 4
- 事前チェック:
  - `_plan/precheck-02-button-color-inventory.md`（button.module.scss のカラー変換全量）
  - `_plan/precheck-05-hover-mixin-comparison.md`（m.hover → g.hover 変更箇所）
  - `_plan/precheck-06-type-module-current-state.md`（type.module.scss の現状）
  - `_plan/precheck-07-typ-structure-comparison.md`（type vs tw_source の差分）
- tw_source 参照: `tw_source/src/scss/features/_layout.scss`、`tw_source/src/scss/features/_typ.scss`

---

## 前提条件

Step 3 が完了していること（Foundation/リセット入れ替え済み、`_tailwind-base-layer.scss` 配置済み、`foundation/` 削除済み、`npm run build` 成功済み）。

---

## 目的

ディレクトリ構造を計画書 §4 の移行後構造に再配置し、module.scss の SCSS 変数→CSS 変数変換と `@use` パス修正を完了する。style.scss を最終構成に書き換える。

---

## 作業後の最終到達状態

1. ディレクトリ構造が以下になっている:
   ```
   src/styles/global/
   ├── style.scss
   ├── _tailwind-base-layer.scss
   ├── global/
   ├── features/
   │   ├── _layout.scss
   │   ├── _tab.scss
   │   ├── _toggle.scss
   │   ├── _table.scss
   │   └── _style.scss
   └── vendor/
       ├── react-modal/
       │   ├── _react-modal.scss
       │   ├── _modal-photo.scss
       │   └── _modal-footer.scss
       └── scroll-hint/
           └── _index.scss
   ```
2. `component/` ディレクトリが `features/` にリネームされている
3. `project/_style.scss` が `features/_style.scss` に移動し `@layer components` で囲まれている
4. `_toggle.scss` の `m.hover` → `g.hover` 変更済み、`@use "../mixins" as m;` 削除済み
5. `button.module.scss` の SCSS カラー変数→CSS 変数変換が完了している
6. `type.module.scss` の未使用 import 削除 + §7 の更新が完了している
7. `style.scss` が §11 の最終構成になっている
8. `src/styles/global/mixins/` が削除されている
9. `npm run build` がエラーなく完了する
10. 既存スタイルが崩れていない

---

## スコープ（変更してよいファイル）

- `src/styles/global/component/` → `src/styles/global/features/` にリネーム
- `src/styles/global/project/_style.scss` → `src/styles/global/features/_style.scss` に移動
- `src/styles/global/features/_toggle.scss`（`@use` 変更 + hover 変更）
- `src/styles/global/features/_layout.scss`（新規。tw_source からコピー）
- `src/styles/global/vendor/`（新規ディレクトリ作成 + ファイル移動）
- `src/styles/global/style.scss`（最終構成に書き換え）
- `src/styles/modules/button.module.scss`（カラー変換 + import 修正）
- `src/styles/modules/type.module.scss`（未使用 import 削除 + §7 更新）
- `src/styles/global/mixins/`（全削除）

## 非スコープ（変更してはならないファイル）

- `src/styles/modules/header.module.scss` — 変更なし
- `src/styles/modules/footer.module.scss` — 変更なし
- `src/styles/modules/index.module.scss` — 変更なし
- `src/styles/modules/modal-photo.module.scss` — 変更なし
- `src/styles/modules/modal-footer.module.scss` — 変更なし
- `src/styles/modules/grid.module.scss` — Step 6 の対象
- `src/styles/modules/gutter.module.scss` — Step 6 の対象
- `src/styles/global/features/_tab.scss` — Step 5 の対象（prefix 除去）。この Step では触らない
- `src/styles/global/features/_table.scss` — 同上
- `src/styles/global/utility/` — Step 7 の対象
- `src/styles/global/layout/` — Step 7 の対象
- TSX ファイル全て
- `tw_source/` 配下（参照のみ）

## 判断禁止事項

- type.module.scss の既存クラスの値（`%ttl__*` のフォントサイズ値、`.text--*` の値等）を tw_source の値に合わせてはならない。§7「重複するクラス: module.scss 側の値を採用」に従う
- SCSS の `@extend`、`@media #{g.$md}` 等を Tailwind バリアントに書き換えてはならない
- `@layer components` 内の SCSS 構文（`@extend`, `@include`, `@media`）を「Tailwind 互換」のために変更してはならない
- button.module.scss の `color.scale()` を独自に解決してはならない。`precheck-02` の変換表に従う。変換表にないパターンが出たら停止して報告する
- _tab.scss、_table.scss のクラス名（`c-` prefix）をこの Step で変更してはならない（Step 5 の対象）

---

## 作業手順

**着手前に `precheck-02`, `precheck-05`, `precheck-06`, `precheck-07` の 4 ファイルを全て読むこと。**

### 4-1. ディレクトリ再配置

#### 4-1a. component/ → features/ リネーム

`src/styles/global/component/` を `src/styles/global/features/` にリネームする。

#### 4-1b. _style.scss の移動

`src/styles/global/project/_style.scss` を `src/styles/global/features/_style.scss` に移動する。

移動後、ファイル全体を `@layer components { ... }` で囲む。ただし `@charset` と `@use` は `@layer` の外に出す:

```scss
@charset "utf-8";
@use "../global" as g;

@layer components {
  // ファイル内の既存コードをここに入れる
  // $fadein-duration, $fadein-offset, .inview__fadein, .is-inview,
  // コメントアウト済みコード 全てそのまま
}
```

**注意**: `@use` のパスを確認する。移動前は `@use "../global" as g;` で `project/` → `global/global/` を指していた。移動後は `features/` → `global/global/` になるが、同じ深さなのでパスは変わらない。

#### 4-1c. _layout.scss の持ち込み

`tw_source/src/scss/features/_layout.scss` を `src/styles/global/features/_layout.scss` にコピーする。

コピー後、以下を削除する:
- `.container-py--blog` ブロック（L52-64 付近）
- `.container-py--search` ブロック（L66-72 付近）

それ以外（`.container-width`, `.container-py`, `.main`, `.blog__main`, `.blog__sidebar`, `.split__*` 等）はそのまま残す。

#### 4-1d. vendor/ の作成とファイル移動

1. `src/styles/global/vendor/react-modal/` ディレクトリを作成
2. 現在の `src/styles/global/component/` にあった react-modal 関連ファイルを移動（リネーム済みの `features/` 内にある場合はそこから移動）:
   - `_react-modal.scss` → `vendor/react-modal/_react-modal.scss`
   - `_modal-photo.scss` → `vendor/react-modal/_modal-photo.scss`
   - `_modal-footer.scss` → `vendor/react-modal/_modal-footer.scss`
3. `src/styles/global/vendor/scroll-hint/` ディレクトリを作成
4. `src/styles/global/utility/_scroll-hint.scss` → `src/styles/global/vendor/scroll-hint/_index.scss` にコピー（utility/ は Step 7 で削除）

react-modal ファイル内の `@use` パスを確認する。移動前: `component/` → `../global` で `global/global/` を指す。移動後: `vendor/react-modal/` → `../../global` で `global/global/` を指す。**パスが変わる場合は修正する。**

### 4-2. _toggle.scss の修正

`src/styles/global/features/_toggle.scss` を編集する:

1. `@use "../mixins" as m;`（L3）を削除する
2. `@include m.hover {`（L100 付近、1 箇所）を `@include g.hover {` に変更する

`@use "../global" as g;`（L2）はそのまま維持する。

### 4-3. button.module.scss の修正

`_plan/precheck-02-button-color-inventory.md` を参照しながら作業する。

#### 4-3a. import 修正

```scss
// 削除
@use "sass:color";
@use "../global/mixins" as m;

// 維持
@use "../global/global" as g;
```

#### 4-3b. m.hover → g.hover

以下の 6 箇所で `@include m.hover {` → `@include g.hover {` に変更する:
- L29、L54、L86、L151、L176、L195

#### 4-3c. SCSS カラー変数→CSS 変数

`precheck-02` の変換表に従い、以下を変更する:

| 変更前 | 変更後 |
|--------|--------|
| `g.$clr1`（直接参照） | `var(--clr1)` |
| `g.$border-radius`（L14, L79） | `var(--bdrs)` |
| `color.scale(g.$clr1, $lightness: 5%)` | → 事前に `npm run build` 後の CSS から hex 値を確認し、CSS 変数化するか直値にするか決定。**判断できない場合は停止して報告** |
| `color.scale(g.$clr1, $lightness: 10%)` | 同上 |
| `color.scale(g.$clr1, $lightness: -5%)` | 同上 |
| `color.scale(g.$clr1, $lightness: 0%)` | `var(--clr1)`（0% なので色変化なし） |

**重要**: mixin のデフォルト引数に `var()` を使う場合、mixin の呼び出し側で具体的な値を渡しているか確認すること。デフォルト引数のまま使われている箇所と、呼び出し時に上書きしている箇所を区別する。

**コメントアウト済みコード（L159-166）は変更しない。**

### 4-4. type.module.scss の修正

`_plan/precheck-06-type-module-current-state.md` と `_plan/precheck-07-typ-structure-comparison.md` を参照しながら作業する。

#### 4-4a. 未使用 import 削除

```scss
// 削除
@use "sass:color";
@use "../global/mixins" as m;

// 維持
@use "../global/global" as g;
```

#### 4-4b. §7 の更新内容

**維持（値を変更しない）**: `%font-min`, `%ttl__xsmall/small/medium/large`, `.title--xsmall/small/medium/large`, `.title__underline--aligned`, `.title__pattern--diagonal`, mixin `typ__line-height` / `typ__line-height--thin`, `.text`, `.text--xs/small/medium/large`, `.text--marker`

**更新（tw_source のインナー付き構造に変更）**:

1. `.title__rhombus` → 外側（背景・padding・text-align）と `&--inner`（現在の `.title__rhombus` の内容）に分離。tw_source の `.ttl__rhombus` の構造を参照し、命名を `.title__rhombus` + `.title__rhombus--inner` にする。`precheck-07` の値差分に注意: **letter-spacing は現行の値（2em / 4em）を維持**、tw_source の値（0.1em / 0.15em）にしない。background-image のパスは Next.js のパブリックパスに合わせる。

2. `.title__horizontal` → 外側（position: relative, z-index, text-align, `::after` 横線）と `&--inner`（現在の `.title__horizontal` の内容）+ `&--inner-bgc-y` に分離。tw_source の `.ttl__horizontal` の構造を参照。

**新規追加**:

3. `.title__underbar` — tw_source の `.ttl__underbar`（L114-131）を module.scss の命名規則で追加
4. `.title__bg-grd` — tw_source の `.ttl__bg-grd`（L133-143）を追加
5. `.title__bg-grd--wrap` — tw_source の `.ttl__bg-grd--wrap`（L458-468）を追加

**コメントアウト済みコード（L318-337: Inter フォント関連）は変更しない。**

### 4-5. mixins/ ディレクトリ削除

全ファイルの `@use "../global/mixins" as m;` が削除済みであることを確認した後、`src/styles/global/mixins/` を全削除する。

### 4-6. style.scss の最終構成

`src/styles/global/style.scss` を以下の内容に書き換える:

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

### 4-7. project/ ディレクトリ削除

`_style.scss` 移動後、`src/styles/global/project/` が空であれば削除する。

### 4-8. ビルド確認

```bash
npm run build
npm run serve
```

---

## 完了チェック（全て満たすこと）

- [ ] `src/styles/global/features/` に `_tab.scss`, `_toggle.scss`, `_table.scss`, `_style.scss`, `_layout.scss` が存在する
- [ ] `src/styles/global/component/` が存在しない
- [ ] `src/styles/global/vendor/react-modal/` に 3 ファイルが存在する
- [ ] `src/styles/global/vendor/scroll-hint/_index.scss` が存在する
- [ ] `_toggle.scss` に `@use "../mixins" as m;` がない
- [ ] `_toggle.scss` に `m.hover` がない（`g.hover` になっている）
- [ ] `button.module.scss` に `@use "sass:color"` がない
- [ ] `button.module.scss` に `@use "../global/mixins" as m;` がない
- [ ] `button.module.scss` に `m.hover` がない（全て `g.hover` になっている）
- [ ] `button.module.scss` に `g.$clr1` がない（全て `var(--clr1)` 等に変換済み）
- [ ] `button.module.scss` に `g.$border-radius` がない（全て `var(--bdrs)` に変換済み）
- [ ] `type.module.scss` に `@use "sass:color"` がない
- [ ] `type.module.scss` に `@use "../global/mixins" as m;` がない
- [ ] `type.module.scss` に `.title__underbar`, `.title__bg-grd`, `.title__bg-grd--wrap` が追加されている
- [ ] `src/styles/global/mixins/` が存在しない
- [ ] `src/styles/global/project/` が存在しない（空なら削除済み）
- [ ] `style.scss` が §11 の構成になっている
- [ ] `features/_style.scss` が `@layer components { ... }` で囲まれている
- [ ] `features/_layout.scss` に `container-py--blog` と `container-py--search` がない
- [ ] `npm run build` がエラーなく完了する
- [ ] 既存スタイルが崩れていない

---

## 残置を許すもの

- `_tab.scss`、`_table.scss` の `c-` prefix → Step 5 で除去
- `grid.module.scss`、`gutter.module.scss` → Step 6 で廃止
- `utility/`、`layout/` ディレクトリ → Step 7 で削除
- button.module.scss の `color.scale()` で hex 値の確認が必要だった箇所 → 報告に結果を明記

---

## 最終報告で列挙すること

1. 実装したこと（移動・リネーム・変更したファイル一覧と内容）
2. まだやっていないこと（prefix 除去、grid/gutter 廃止、utility/layout 削除）
3. 例外として残したこと（color.scale の変換で判断したもの等）
4. リスク・前提・未確認事項（react-modal の @use パスが想定通りだったか、color.scale の hex 値確認結果）
