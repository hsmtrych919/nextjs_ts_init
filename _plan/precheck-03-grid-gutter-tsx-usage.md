# 事前チェック 03: grid/gutter の TSX 使用箇所マップ

grid.module.scss と gutter.module.scss の import・クラス使用箇所を全量記録する。
移行時、gutter.module.scss は Tailwind ユーティリティに置き換える（計画書 §10）。

---

## import しているファイル一覧

### gridStyles + gutterStyles 両方

| ファイル | gridStyles import | gutterStyles import |
|---------|-------------------|---------------------|
| `src/components/layout/header.tsx` | L2 | L3 |
| `src/components/layout/footer.tsx` | L3 | L4 |
| `pages/index.tsx` | L3 | L4 |
| `pages/snippet.tsx` | L13 | L14 |
| `src/components/ui/GridDemo.tsx` | L2 | L3 |
| `src/components/ui/ModalPhoto.tsx` | L4 | L5 |
| `src/components/ui/ModalFooter.tsx` | L4 | L5 |

### gridStyles のみ

| ファイル | gridStyles import |
|---------|-------------------|
| `src/components/ui/GridPhoto.tsx` | L3 |

---

## gutterStyles のクラス使用箇所（置換対象）

### `gutterStyles.container`

| ファイル | 行 |
|---------|-----|
| header.tsx | L10 |
| footer.tsx | L26 |
| index.tsx | L14 |
| snippet.tsx | L62, L86, L113, L148 |
| GridDemo.tsx | L81, L92, L120, L139, L156 |
| ModalPhoto.tsx | L132 |
| ModalFooter.tsx | L65, L81 |

計 14 箇所

### `gutterStyles['container--initial']`

使用箇所なし（定義はあるが TSX で使われていない）

### `gutterStyles['small--left']`

| ファイル | 行 |
|---------|-----|
| GridDemo.tsx | L143 |

計 1 箇所

### `gutterStyles['small--right']`

使用箇所なし（grep 結果に出現せず）

### `gutterStyles['medium--right']`

| ファイル | 行 |
|---------|-----|
| GridDemo.tsx | L121 |

計 1 箇所

### その他の gutterStyles クラス

`small--left-half`, `small--right-half`, `medium--left`, `medium--left-half`, `medium--right-half` は TSX での使用なし。

---

## gutter.module.scss → Tailwind ユーティリティ 変換表（計画書 §10 より）

tailwind.config.js の `extend.padding` に `gutter-1`, `gutter-1.5`, `gutter-2`, `gutter-3`, `gutter-row` が定義済み。arbitrary value ではなく config 定義のカスタムユーティリティを使う。

| gutter.module.scss クラス | 定義内容 | Tailwind 置換 |
|--------------------------|---------|--------------|
| `.container--initial` | `@include m.gutter;` = px: gutter-row, md以上: 0 | `px-gutter-row md:px-0` |
| `.container` | `@include m.gutter_row;` = px: gutter-row, xl以上: 0 | `px-gutter-row xl:px-0` |
| `.small--left` | sm: pl gutter*2, md: gutter*3 | `sm:pl-gutter-2 md:pl-gutter-3` |
| `.small--left-half` | sm: pl gutter*1, md: gutter*1.5 | `sm:pl-gutter-1 md:pl-gutter-1.5` |
| `.medium--left` | md: pl gutter*3 | `md:pl-gutter-3` |
| `.medium--left-half` | md: pl gutter*1.5 | `md:pl-gutter-1.5` |
| `.small--right` | sm: pr gutter*2, md: gutter*3 | `sm:pr-gutter-2 md:pr-gutter-3` |
| `.small--right-half` | sm: pr gutter*1, md: gutter*1.5 | `sm:pr-gutter-1 md:pr-gutter-1.5` |
| `.medium--right` | md: pr gutter*3 | `md:pr-gutter-3` |
| `.medium--right-half` | md: pr gutter*1.5 | `md:pr-gutter-1.5` |

---

## gridStyles.col（auto columns）の置換

`gridStyles.col` は数字なしの auto column（`flex: 1 0 0%`）。`col--*` とは別のクラス。

| ファイル | 行 | Tailwind 置換 |
|---------|-----|--------------|
| GridDemo.tsx | L140 | `grow basis-0` |
| GridDemo.tsx | L146 | `grow basis-0` |

計 2 箇所（GridDemo のデモ内のみ）

---

## 旧 utility クラスの置換（grid/gutter 廃止に付随）

grid/gutter 以外に、TSX で直接使われている旧 utility クラスが Step 7（utility/ 全削除）までに置換が必要。

| ファイル | 行 | 旧クラス | 定義元 | Tailwind 置換 |
|---------|-----|---------|--------|--------------|
| header.tsx | L10 | `jc-start ai-center` | `utility/_flex.scss` L33, L55 | `justify-start items-center` |

計 1 箇所。Step 6 の TSX 書き換えで一緒に処理する。

---

## 実装時の確認ポイント

1. `gutterStyles.container` が 14 箇所で使われている — 最も影響が大きい置換
2. `gutterStyles['container--initial']` は TSX 未使用だが、gutter.module.scss に定義が存在する
3. `small--left`, `medium--right` は GridDemo.tsx のデモ内のみ
4. `gridStyles.col`（数字なし auto column）が GridDemo.tsx で 2 箇所使用 — 置換漏れ注意
5. header.tsx の `jc-start ai-center` は旧 utility クラス — Step 7 で utility/ 削除する前に Tailwind に置換必須
6. gutter.module.scss の `@use "../global/mixins" as m;` が削除されるため、`m.gutter` / `m.gutter_row` mixin が使えなくなる。Tailwind ユーティリティへの置換が完了してから gutter.module.scss を削除する
