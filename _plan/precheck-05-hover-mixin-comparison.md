# 事前チェック 05: hover mixin の比較

現行の hover mixin と tw_source の hover mixin を比較し、移行時の影響を確認する。

---

## 現行: `src/styles/global/mixins/_hover.scss`

```scss
$enable-hover-media-query:  false !default;

@mixin hover {
  // TODO: re-enable along with mq4-hover-shim
  @if $enable-hover-media-query {
    @media (hover: hover) {
      &:hover { @content }
    }
  }
  @else {
    @media(hover: hover) and (pointer: fine) {
      &:focus,
      &:hover {
        @content;
      }
    }
  }
}
```

**その他**: `hover-focus`, `plain-hover-focus`, `hover-focus-active` の 3 mixin がコメントアウト済み（L22-67）。

---

## tw_source: `tw_source/src/scss/global/_hover.scss`

```scss
$enable-hover-media-query:  false !default;

@mixin hover {
  // TODO: re-enable along with mq4-hover-shim
  @if $enable-hover-media-query {
    @media (hover: hover) {
      &:hover { @content }
    }
  }
  @else {
    @media(hover: hover) and (pointer: fine) {
      &:focus, &:hover {
        @content;
      }
    }
  }
}
```

---

## 差分

| 項目 | 現行 | tw_source | 影響 |
|------|------|-----------|------|
| `$enable-hover-media-query` | `false !default` | `false !default` | 同一 |
| `@if` 分岐（true 時） | `&:hover { @content }` | `&:hover { @content }` | 同一 |
| `@else` 分岐（false 時） | `&:focus,\n      &:hover {` | `&:focus, &:hover {` | **フォーマットのみ**。機能差なし |
| コメントアウト mixin | 3 個残存 | なし | 機能差なし |

**結論: 機能的に完全に同一。** フォーマットの差（改行位置）のみ。

---

## hover mixin の呼び出し方の変更

### 現行パターン

module.scss ファイルでは `@use "../global/mixins" as m;` → `@include m.hover { ... }`
component/ ファイルでは `@use "../mixins" as m;` → `@include m.hover { ... }`

### 移行後パターン

hover mixin が `global/_hover.scss` に移動し `_index.scss` 経由で `g` 名前空間に入る。
→ `@include g.hover { ... }`

### 変更が必要なファイル

| ファイル | 現行 | 変更後 |
|---------|------|--------|
| `button.module.scss` | `@use "../global/mixins" as m;` + `m.hover` | `@use "../global/global" as g;`（既存）+ `g.hover` |
| `type.module.scss` | `@use "../global/mixins" as m;`（hover 未使用だが import あり） | 削除可能か確認 |
| `gutter.module.scss` | `@use "../global/mixins" as m;`（gutter mixin 用） | ファイル自体が廃止 |
| `component/_toggle.scss` | `@use "../mixins" as m;` + `m.hover` | `@use "../global" as g;`（既存）+ `g.hover` |

### type.module.scss の mixins 依存確認

```scss
// L3-4
@use "../global/global" as g;
@use "../global/mixins" as m;
```

`m.` の使用箇所を確認 → **`m.` は一切使用されていない**（grep で確認済み）。
→ `@use "../global/mixins" as m;` は安全に削除可能。

---

## 実装時の確認ポイント

1. hover mixin 自体は機能差なし。tw_source のものをそのまま採用して問題ない。
2. 呼び出し元の `m.hover` → `g.hover` 置換は button.module.scss（6 箇所）と _toggle.scss（1 箇所）の計 7 箇所。
3. type.module.scss の `@use "../global/mixins" as m;` は未使用なので削除。
4. コンパイル後の CSS で hover の出力（`@media(hover: hover) and (pointer: fine)` + `:focus, :hover`）が変わっていないことを確認。
