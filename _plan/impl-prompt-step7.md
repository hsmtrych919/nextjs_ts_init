# 実装プロンプト: Step 7 — 不要ディレクトリ削除

---

## Source of Truth

- 計画書: `_plan/tw-migration-plan-2026-03-23.md` §14 Step 7

---

## 前提条件

Step 6 が完了していること（grid/gutter 廃止・TSX 書き換え済み、`npm run build` 成功済み）。

---

## 目的

Step 1〜6 で不要になったディレクトリを削除し、移行後のディレクトリ構成をクリーンにする。

---

## 作業後の最終到達状態

1. `src/styles/global/utility/` が存在しない
2. `src/styles/global/layout/` が存在しない
3. `src/styles/global/foundation/` が存在しない（Step 3 で削除済みのはず）
4. `src/styles/global/mixins/` が存在しない（Step 4 で削除済みのはず）
5. `src/styles/global/style.scss` がこれらのディレクトリを参照していない
6. プロジェクト全体でこれらのディレクトリ内のファイルを `@use` している箇所がない
7. `npm run build` がエラーなく完了する
8. 全ページのスタイルが崩れていない

---

## スコープ（変更してよいファイル）

削除対象:
- `src/styles/global/utility/`（ディレクトリごと全削除）
- `src/styles/global/layout/`（ディレクトリごと全削除）

## 非スコープ（変更してはならないファイル）

- `src/styles/global/style.scss` — Step 4 で最終構成に書き換え済み。変更してはならない
- `src/styles/global/` 配下のその他のファイル・ディレクトリ
- `src/styles/modules/` 配下の全ファイル
- TSX ファイル全て
- `tw_source/` 配下

## 判断禁止事項

- `style.scss` を編集してはならない（Step 4 で書き換え済みのため、utility/ や layout/ の `@use` は既に存在しないはず）
- 削除対象以外のファイルを変更してはならない
- 「ついでに」他のファイルの整理やリファクタリングをしてはならない

---

## 作業手順

### 7-1. 事前確認: 参照の有無チェック

削除前に、プロジェクト全体で以下のパターンを検索し、参照が **0 件** であることを確認する:

```bash
# utility/ への参照
grep -r "utility/" src/styles/

# layout/ への参照
grep -r "layout/" src/styles/
```

**参照が残っている場合**: 削除せずに停止して報告する。先行 Step の漏れがある可能性がある。

### 7-2. 事前確認: foundation/ と mixins/ の確認

以下が既に削除されていることを確認する:
- `src/styles/global/foundation/` — Step 3 で削除済みのはず
- `src/styles/global/mixins/` — Step 4 で削除済みのはず

**存在している場合**: プロジェクト全体で `foundation/` または `mixins/` への `@use` 参照を検索する。参照が 0 件であれば削除する。参照が残っていれば停止して報告する。

### 7-3. utility/ ディレクトリ削除

`src/styles/global/utility/` をディレクトリごと削除する。

### 7-4. layout/ ディレクトリ削除

`src/styles/global/layout/` をディレクトリごと削除する。

### 7-5. ビルド確認

```bash
npm run build
npm run serve
```

全ページのスタイルを確認する。

---

## 完了チェック（全て満たすこと）

- [ ] `src/styles/global/utility/` が存在しない
- [ ] `src/styles/global/layout/` が存在しない
- [ ] `src/styles/global/foundation/` が存在しない
- [ ] `src/styles/global/mixins/` が存在しない
- [ ] プロジェクト全体で `utility/` への `@use` 参照が 0 件
- [ ] プロジェクト全体で `layout/` への `@use` 参照が 0 件
- [ ] `style.scss` が変更されていない
- [ ] `npm run build` がエラーなく完了する
- [ ] 全ページのスタイルが崩れていない

---

## 残置を許すもの

- GridDemo.tsx のコメントドキュメント（L5-72）に旧クラス名が残ること → 本計画のスコープ外
- docs/ 内ドキュメントの更新 → 本計画のスコープ外

---

## 最終報告で列挙すること

1. 実装したこと（削除したディレクトリ一覧）
2. まだやっていないこと（ドキュメント更新 — 本計画のスコープ外）
3. 例外として残したこと（foundation/ や mixins/ が先行 Step で既に削除済みだった場合はその旨記載）
4. リスク・前提・未確認事項
