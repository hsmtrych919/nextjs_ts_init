# 実装プロンプト: Step 2 — global API の再構成

---

## Source of Truth

- 計画書: `_plan/tw-migration-plan-2026-03-23.md` §8（global API の統合）、§14 Step 2
- 事前チェック: `_plan/precheck-05-hover-mixin-comparison.md`
- tw_source 参照: `tw_source/src/scss/global/` 配下の全ファイル

---

## 前提条件

Step 1 が完了していること（Next.js 15 + Tailwind v4 導入済み、`npm run build` 成功済み）。

---

## 目的

現在の `src/styles/global/global/` を tw_source の `global/` で置換し、hover mixin を global に統合する。`mixins/` ディレクトリはまだ削除しない（Step 4 で module.scss の修正と同時に除去する）。

---

## 作業後の最終到達状態

1. `src/styles/global/global/` が tw_source の構成に置き換わっている
2. `_index.scss` が以下を `@forward` している: `variables`, `breakpoints`, `calc`, `hover`, `media-queries`
3. `_font.scss` から FontAwesome 関連の mixin が除去されている
4. `src/styles/global/mixins/` はまだ存在する（削除しない）
5. `npm run build` がエラーなく完了する
6. 既存スタイルが崩れていない

---

## スコープ（変更してよいファイル）

- `src/styles/global/global/` 配下の全ファイル（tw_source で上書き）

## 非スコープ（変更してはならないファイル）

- `src/styles/global/mixins/` — Step 4 まで残す。削除・編集禁止
- `src/styles/modules/` 配下の全ファイル
- `src/styles/global/foundation/` — Step 3 の対象。触らない
- `src/styles/global/component/` — Step 4 の対象。触らない
- `src/styles/global/project/` — Step 3, 4 の対象。触らない
- `src/styles/global/utility/` — Step 7 の対象。触らない
- `src/styles/global/layout/` — Step 7 の対象。触らない
- `src/styles/global/style.scss` — Step 4 の対象。触らない
- TSX ファイル全て
- `tw_source/` 配下（参照のみ）

## 判断禁止事項

- `mixins/` を先に削除してはならない（module.scss がまだ `@use "../global/mixins" as m;` で参照している）
- `_font.scss` から FontAwesome mixin 以外の内容を変更してはならない
- `@forward` のリストを計画書 §8 の記載と異なる構成にしてはならない
- 「モダン化」を理由に関数やmixinの実装を書き換えてはならない

---

## 作業手順

### 2-1. tw_source の global/ を確認

`tw_source/src/scss/global/` の内容を確認し、各ファイルの役割を把握する。

### 2-2. global/ の上書き

`tw_source/src/scss/global/` の以下のファイルを `src/styles/global/global/` にコピーする:
- `_index.scss`
- `_variables.scss`
- `_breakpoints.scss`
- `_calc.scss`
- `_hover.scss`
- `_media-queries.scss`
- `_font.scss`（コピー後に FontAwesome mixin を除去）

既存の `src/styles/global/global/` 内のファイルは上書きする。tw_source に存在しないファイル（`_variables-color.scss`, `_unicode.scss` 等）が残る場合、`_index.scss` が `@forward` していなければ問題ないが、ファイル自体は Step 3 以降で `foundation/` 削除と合わせて整理する。

### 2-3. _font.scss から FontAwesome mixin 除去

コピーした `_font.scss` を開き、FontAwesome 関連の mixin（`@mixin fa-icon` 等）を削除する。FontAwesome 以外の内容（フォントサイズ関連等）は残す。

削除対象は FontAwesome に言及している mixin のみ。判断に迷うものがあれば報告して停止する。

### 2-4. _index.scss の確認

`_index.scss` が以下の `@forward` のみを含むことを確認する:
```scss
@forward "variables";
@forward "breakpoints";
@forward "calc";
@forward "hover";
@forward "media-queries";
```

tw_source の `_index.scss` に `_font.scss` の `@forward` が含まれている場合はそのまま残す（font 関連のユーティリティは使用される可能性がある）。

### 2-5. ビルド確認

```bash
npm run build
npm run serve
```

---

## 完了チェック（全て満たすこと）

- [ ] `src/styles/global/global/_index.scss` が `variables`, `breakpoints`, `calc`, `hover`, `media-queries` を `@forward` している
- [ ] `_hover.scss` が tw_source の内容になっている（`precheck-05` で確認済み: 機能差なし）
- [ ] `_font.scss` から FontAwesome mixin が除去されている
- [ ] `src/styles/global/mixins/` がまだ存在する（削除していない）
- [ ] `npm run build` がエラーなく完了する
- [ ] 既存スタイルが崩れていない

---

## 残置を許すもの

- `src/styles/global/global/` 内に tw_source にないファイル（`_variables-color.scss` 等）が残ること → `_index.scss` で `@forward` されていなければ無害。後続 Step で整理する

---

## 最終報告で列挙すること

1. 実装したこと（コピー・上書きしたファイル一覧、_font.scss から除去した mixin の一覧）
2. まだやっていないこと（mixins/ の削除、module.scss の修正）
3. 例外として残したこと（global/ 内に残った旧ファイル等）
4. リスク・前提・未確認事項
