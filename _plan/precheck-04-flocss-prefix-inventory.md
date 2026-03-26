# 事前チェック 04: FLOCSS プレフィックス（c-）使用箇所の全量棚卸し

`c-tab`, `c-toggle`, `c-table` の 3 コンポーネントについて、SCSS・TS・TSX 全ファイルの `c-` プレフィックス使用箇所を記録する。
移行時に `c-` を除去し、SCSS / TS / TSX を同時に更新する。

---

## c-tab

### SCSS: `src/styles/global/component/_tab.scss`

| 行 | セレクタ / クラス名 | 変更後 |
|----|-------------------|--------|
| L8 | `.c-tab` | `.tab` |
| 内部 `&__outer` | → `.tab__outer` | (& で自動) |
| 内部 `&__list` | → `.tab__list` | (& で自動) |
| 内部 `&__list--item` | → `.tab__list--item` | (& で自動) |
| 内部 `&__content` | → `.tab__content` | (& で自動) |
| 内部 `&__item` | → `.tab__item` | (& で自動) |

**SCSS 内の変更は L8 の `.c-tab` → `.tab` のみ。** `&` ネストで他は自動追従。

### TS: `src/lib/hooks/useTabSwitch.ts`

| 行 | コード | 変更後 |
|----|--------|--------|
| L54 | `'c-tab__list--item js-active'` | `'tab__list--item js-active'` |
| L55 | `'c-tab__list--item'` | `'tab__list--item'` |
| L65 | `'c-tab__item js-active'` | `'tab__item js-active'` |
| L66 | `'c-tab__item'` | `'tab__item'` |

計 4 箇所（文字列リテラル内）

### TSX: `src/components/ui/TabDemo.tsx`

| 行 | コード | 変更後 |
|----|--------|--------|
| L38 | `className="c-tab__outer"` | `className="tab__outer"` |
| L39 | `className="c-tab__list"` | `className="tab__list"` |
| L60 | `className="c-tab__content"` | `className="tab__content"` |

計 3 箇所

**注意**: L38-39 の `c-tab__list--item` と `c-tab__item` は useTabSwitch が動的に className を設定するため、TSX テンプレート内には直書きされていない。

---

## c-toggle

### SCSS: `src/styles/global/component/_toggle.scss`

| 行 | セレクタ / クラス名 | 変更後 |
|----|-------------------|--------|
| L10 | `.c-toggle__wrap` | `.toggle__wrap` |
| L30 | `.c-toggle__title` | `.toggle__title` |
| L71 | `.c-toggle__content` | `.toggle__content` |
| L77 | `.c-toggle__button` | `.toggle__button` |
| L106 | `.c-toggle__wrap.js-active` | `.toggle__wrap.js-active` |
| L107 | `// .c-toggle__title::before` (コメント) | コメント内も変更 |
| L110 | `// .c-toggle__title::after` (コメント) | コメント内も変更 |
| L119 | `// .c-toggle__title` (コメント) | コメント内も変更 |

**変更箇所**: L10, L30, L71, L77, L106 の 5 箇所（コメント含めると 8 箇所）

**注意**: `@use "../mixins" as m;` (L3) の `m.hover` → `g.hover` 変更も同時に行う。

### TS: `src/lib/hooks/useToggleContent.ts`

| 行 | コード | 備考 |
|----|--------|------|
| — | セレクタは引数として受け取る（L37: `elemWrap`, `elemTitle`, `elemContent`） | TS 内にハードコードなし |

**useToggleContent.ts 内に `c-toggle` のハードコードはない。** セレクタは呼び出し側（TSX）から渡される。

### TSX: `src/components/ui/ToggleDemo.tsx`

| 行 | コード | 変更後 |
|----|--------|--------|
| L39 | `useToggleContent('.c-toggle__wrap', '.c-toggle__title', '.c-toggle__content');` | `useToggleContent('.toggle__wrap', '.toggle__title', '.toggle__content');` |
| L42 | `className="c-toggle__wrap"` | `className="toggle__wrap"` |
| L43 | `className="c-toggle__title"` | `className="toggle__title"` |
| L44 | `className="c-toggle__button js-toggle-message"` | `className="toggle__button js-toggle-message"` |
| L46 | `className="c-toggle__content"` | `className="toggle__content"` |

計 5 箇所（うち L39 はセレクタ文字列 3 つ）

---

## c-table

### SCSS: `src/styles/global/component/_table.scss`

| 行 | セレクタ / クラス名 | 変更後 |
|----|-------------------|--------|
| L35 | `.c-table-spec` | `.table-spec` |
| L43 | `.c-table-spec--half` | `.table-spec--half` |
| L54 | `.c-table__responsive` | `.table__responsive` |
| L72 | `.c-table__responsive--outer` | `.table__responsive--outer` |

計 4 箇所

**注意**: `%table-spec` プレースホルダは `%` なので `c-` プレフィックスなし。変更不要。
**注意**: `%table__shadow` も同様。変更不要。

### TS: `src/lib/hooks/useTableScroll.ts`

| 行 | コード | 備考 |
|----|--------|------|
| — | セレクタは引数として受け取る（L24: `tableOuterSelector`） | TS 内にハードコードなし |

**useTableScroll.ts 内に `c-table` のハードコードはない。** セレクタは呼び出し側（TSX）から渡される。

### TSX: `src/components/ui/TableDemo.tsx`

| 行 | コード | 変更後 |
|----|--------|--------|
| L25 | `useTableScroll('.c-table__responsive');` | `useTableScroll('.table__responsive');` |
| L28 | `className="c-table__responsive--outer"` | `className="table__responsive--outer"` |
| L29 | `className="c-table__responsive scroll-hint"` | `className="table__responsive scroll-hint"` |
| L30 | `className="c-table-spec"` | `className="table-spec"` |
| L33 | `className="c-table-spec__unit"` | `className="table-spec__unit"` |
| L34 | `className="c-table-spec__unit"` | `className="table-spec__unit"` |
| L35 | `className="c-table-spec__unit"` | `className="table-spec__unit"` |

計 7 箇所

---

## 変更合計

| コンポーネント | SCSS | TS | TSX | 合計 |
|--------------|------|-----|-----|------|
| c-tab | 1 | 4 | 3 | 8 |
| c-toggle | 5（+コメント3） | 0 | 5 | 10（+3） |
| c-table | 4 | 0 | 7 | 11 |
| **合計** | **10** | **4** | **15** | **29** |

---

## 実装時の確認ポイント

1. **SCSS・TS・TSX を同一コミットで変更すること。** 片方だけ変えるとセレクタ不一致でスタイルが当たらなくなる。
2. useTabSwitch.ts は文字列リテラルでクラス名をハードコードしている。正規表現置換ではなく目視確認を推奨。
3. useToggleContent.ts / useTableScroll.ts はセレクタを引数で受け取るため、TS 内の変更は不要。TSX 側のセレクタ文字列のみ変更。
4. コメント内の `c-` プレフィックスも変更すること（CLAUDE.md の「既存コメントアウトは削除しない」ルールに従い、コメントは残すがプレフィックスは更新）。
