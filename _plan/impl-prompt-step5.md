# 実装プロンプト: Step 5 — FLOCSS prefix 除去

---

## Source of Truth

- 計画書: `_plan/tw-migration-plan-2026-03-23.md` §5（prefix 除去手順）、§14 Step 5
- 事前チェック: `_plan/precheck-04-flocss-prefix-inventory.md`（SCSS・TS・TSX 全 29 箇所の変更対象リスト）

---

## 前提条件

Step 4 が完了していること（features/ 再配置済み、module.scss 修正済み、`npm run build` 成功済み）。

---

## 目的

`features/_tab.scss`、`features/_toggle.scss`、`features/_table.scss` の FLOCSS プレフィックス（`c-`）を除去し、SCSS・TS・TSX の全参照箇所を同時に更新する。1 ファイルずつ処理し、各ファイル完了時にビルド確認する。

---

## 作業後の最終到達状態

1. `c-tab` → `tab`、`c-toggle` → `toggle`、`c-table` → `table` への全置換が完了している
2. プロジェクト全体で `c-tab`、`c-toggle`、`c-table` を含むコードが 0 件（コメント内も含む）
3. `npm run build` がエラーなく完了する
4. 各コンポーネント（TabDemo、ToggleDemo、TableDemo）の表示・動作が正常

---

## スコープ（変更してよいファイル）

**_tab 関連**:
- `src/styles/global/features/_tab.scss`
- `src/lib/hooks/useTabSwitch.ts`
- `src/components/ui/TabDemo.tsx`

**_toggle 関連**:
- `src/styles/global/features/_toggle.scss`
- `src/components/ui/ToggleDemo.tsx`

**_table 関連**:
- `src/styles/global/features/_table.scss`
- `src/components/ui/TableDemo.tsx`

## 非スコープ（変更してはならないファイル）

- 上記以外の全ファイル
- `src/lib/hooks/useToggleContent.ts` — セレクタは引数で受け取るためハードコードなし。変更不要
- `src/lib/hooks/useTableScroll.ts` — 同上。変更不要

## 判断禁止事項

- 「ついでに」クラス名以外のリファクタリングをしてはならない
- JS のロジック変更をしてはならない
- コメント内の `c-` prefix も変更すること（削除ではなく prefix 部分の更新）
- 3 ファイルを一気にやってはならない。必ず 1 ファイルずつ処理→ビルド→次に進む

---

## 作業手順

**着手前に `_plan/precheck-04-flocss-prefix-inventory.md` を読み、全変更箇所を把握すること。**

### 5-1. _tab.scss の prefix 除去

#### 5-1a. 事前チェック
プロジェクト全体で `c-tab` を検索し、変更箇所を確認する。precheck-04 の一覧と一致することを確認する。

#### 5-1b. SCSS 変更
`features/_tab.scss`:
- L8: `.c-tab` → `.tab`（`&` ネストで子セレクタは自動追従）

変更箇所: 1 箇所

#### 5-1c. TS 変更
`src/lib/hooks/useTabSwitch.ts`:
- L54: `'c-tab__list--item js-active'` → `'tab__list--item js-active'`
- L55: `'c-tab__list--item'` → `'tab__list--item'`
- L65: `'c-tab__item js-active'` → `'tab__item js-active'`
- L66: `'c-tab__item'` → `'tab__item'`

変更箇所: 4 箇所

#### 5-1d. TSX 変更
`src/components/ui/TabDemo.tsx`:
- L38: `className="c-tab__outer"` → `className="tab__outer"`
- L39: `className="c-tab__list"` → `className="tab__list"`
- L60: `className="c-tab__content"` → `className="tab__content"`

変更箇所: 3 箇所

#### 5-1e. ダブルチェック
プロジェクト全体で `c-tab` を再検索し、0 件であることを確認する。

#### 5-1f. ビルド確認
```bash
npm run build
```
ビルドが通らなければ停止して報告する。通ったら次に進む。

---

### 5-2. _toggle.scss の prefix 除去

#### 5-2a. 事前チェック
プロジェクト全体で `c-toggle` を検索し、変更箇所を確認する。

#### 5-2b. SCSS 変更
`features/_toggle.scss`:
- L10: `.c-toggle__wrap` → `.toggle__wrap`
- L30: `.c-toggle__title` → `.toggle__title`
- L71: `.c-toggle__content` → `.toggle__content`
- L77: `.c-toggle__button` → `.toggle__button`
- L106: `.c-toggle__wrap.js-active` → `.toggle__wrap.js-active`
- コメント内の `c-toggle` も全て `toggle` に変更（L107, L110, L119 付近）

変更箇所: 5 箇所（+コメント 3 箇所）

#### 5-2c. TSX 変更
`src/components/ui/ToggleDemo.tsx`:
- L39: `useToggleContent('.c-toggle__wrap', '.c-toggle__title', '.c-toggle__content')` → `useToggleContent('.toggle__wrap', '.toggle__title', '.toggle__content')`
- L42: `className="c-toggle__wrap"` → `className="toggle__wrap"`
- L43: `className="c-toggle__title"` → `className="toggle__title"`
- L44: `className="c-toggle__button js-toggle-message"` → `className="toggle__button js-toggle-message"`
- L46: `className="c-toggle__content"` → `className="toggle__content"`

変更箇所: 5 箇所

**注意**: `useToggleContent.ts` 内にはハードコードなし。変更不要。

#### 5-2d. ダブルチェック
プロジェクト全体で `c-toggle` を再検索し、0 件であることを確認する。

#### 5-2e. ビルド確認
```bash
npm run build
```

---

### 5-3. _table.scss の prefix 除去

#### 5-3a. 事前チェック
プロジェクト全体で `c-table` を検索し、変更箇所を確認する。

#### 5-3b. SCSS 変更
`features/_table.scss`:
- L35: `.c-table-spec` → `.table-spec`
- L43: `.c-table-spec--half` → `.table-spec--half`
- L54: `.c-table__responsive` → `.table__responsive`
- L72: `.c-table__responsive--outer` → `.table__responsive--outer`

変更箇所: 4 箇所

`%table-spec` と `%table__shadow` はプレースホルダ（`%`）なので `c-` prefix なし。変更不要。

#### 5-3c. TSX 変更
`src/components/ui/TableDemo.tsx`:
- L25: `useTableScroll('.c-table__responsive')` → `useTableScroll('.table__responsive')`
- L28: `className="c-table__responsive--outer"` → `className="table__responsive--outer"`
- L29: `className="c-table__responsive scroll-hint"` → `className="table__responsive scroll-hint"`
- L30: `className="c-table-spec"` → `className="table-spec"`
- L33: `className="c-table-spec__unit"` → `className="table-spec__unit"`
- L34: `className="c-table-spec__unit"` → `className="table-spec__unit"`
- L35: `className="c-table-spec__unit"` → `className="table-spec__unit"`

変更箇所: 7 箇所

**注意**: `useTableScroll.ts` 内にはハードコードなし。変更不要。

#### 5-3d. ダブルチェック
プロジェクト全体で `c-table` を再検索し、0 件であることを確認する。

#### 5-3e. ビルド確認
```bash
npm run build
npm run serve
```

---

## 完了チェック（全て満たすこと）

- [ ] プロジェクト全体で `c-tab` の検索結果が 0 件
- [ ] プロジェクト全体で `c-toggle` の検索結果が 0 件
- [ ] プロジェクト全体で `c-table` の検索結果が 0 件
- [ ] `useToggleContent.ts` が変更されていない
- [ ] `useTableScroll.ts` が変更されていない
- [ ] `npm run build` がエラーなく完了する
- [ ] 既存スタイルが崩れていない

---

## 残置を許すもの

なし。全 29 箇所を完了すること。

---

## 最終報告で列挙すること

1. 実装したこと（各ファイルの変更箇所数、precheck-04 の一覧と一致したか）
2. まだやっていないこと（なし、のはず）
3. 例外として残したこと（あれば）
4. リスク・前提・未確認事項（precheck-04 の一覧と実際の検索結果に差分があった場合は明記）
