# 事前チェック 02: button.module.scss カラー変数変換棚卸し

`src/styles/modules/button.module.scss` 内の全 SCSS カラー参照を洗い出し、CSS 変数への変換マッピングを定義する。

---

## 現行の依存関係

```scss
@use "sass:color";           // ← 削除対象
@use "../global/global" as g; // ← 維持
@use "../global/mixins" as m; // ← 削除対象（m.hover → g.hover）
```

---

## SCSS カラー参照の全一覧

### g.$clr1 の直接参照

| 行 | コード | 変換後 |
|----|--------|--------|
| L14 | `border-radius: g.$border-radius;` | `border-radius: var(--bdrs);` |
| L22 | `$bgc: g.$clr1,` (button__color デフォルト引数) | `$bgc: var(--clr1),` |
| L24 | `$bgc-hover: color.scale(g.$clr1, $lightness: 5%)` | `$bgc-hover: var(--clr1-hover),` ※値の差に注意 |
| L41 | `$clr: g.$clr1,` (button__color--border デフォルト引数) | `$clr: var(--clr1),` |
| L43 | `$bdc: g.$clr1,` | `$bdc: var(--clr1),` |
| L45 | `$bgc-hover: g.$clr1,` | `$bgc-hover: var(--clr1),` |
| L46 | `$bdc-hover: g.$clr1` | `$bdc-hover: var(--clr1)` |
| L79 | `border-radius: g.$border-radius;` | `border-radius: var(--bdrs);` |

### color.scale() の呼び出し

| 行 | コード | 変換後 |
|----|--------|--------|
| L24 | `color.scale(g.$clr1, $lightness: 5%)` (mixin デフォルト) | 要検討: hover 用の CSS 変数が必要 |
| L146 | `$bgc: g.$clr1,` | `$bgc: var(--clr1),` |
| L148 | `$bgc-hover: color.scale(g.$clr1, $lightness: 10%)` | 要検討 |
| L171 | `$bgc: color.scale(g.$clr1, $lightness: -5%)` | 要検討 |
| L173 | `$bgc-hover: color.scale(g.$clr1, $lightness: 0%)` | = `g.$clr1` → `var(--clr1)` |

### コメント内の color.scale()（変更不要だが記録）

| 行 | コード |
|----|--------|
| L162 | `$bgc: color.scale(g.$clr1, $lightness: -5%)` (コメントアウト済み) |
| L164 | `$bgc-hover: color.scale(g.$clr1, $lightness: 0%)` (コメントアウト済み) |

### m.hover の呼び出し（→ g.hover に変更）

| 行 | コード |
|----|--------|
| L29 | `@include m.hover {` |
| L54 | `@include m.hover {` |
| L86 | `@include m.hover {` |
| L151 | `@include m.hover {` |
| L176 | `@include m.hover {` |
| L195 | `@include m.hover {` |

計 6 箇所

---

## color.scale() 問題の詳細

`color.scale()` は CSS 変数を引数に取れない。現行で使われている計算パターン:

| パターン | 用途 | 出力色（要確認） |
|---------|------|----------------|
| `color.scale(g.$clr1, $lightness: 5%)` | button__color デフォルト hover | 要コンパイル確認 |
| `color.scale(g.$clr1, $lightness: 10%)` | .gradient hover | 要コンパイル確認 |
| `color.scale(g.$clr1, $lightness: -5%)` | .telephone bgc | 要コンパイル確認 |
| `color.scale(g.$clr1, $lightness: 0%)` | .telephone hover | = #4FBA43（変化なし） |

**対応方針**:
- `$lightness: 0%` → そのまま `var(--clr1)`
- それ以外 → コンパイル後の hex 値を確認し、必要なら新しい CSS 変数を `:root` に追加するか、直値で書くか判断

### 事前に確認すべき計算結果

以下の Sass 計算結果を `npm run build` 後の CSS から抽出する:

1. `color.scale(#4FBA43, $lightness: 5%)` = ?
2. `color.scale(#4FBA43, $lightness: 10%)` = ?
3. `color.scale(#4FBA43, $lightness: -5%)` = ?
4. `color.scale(#4FBA43, $lightness: -20%)` = ? （_style.scss --clr1-hover 用、precheck-01 と重複）

---

## g.$border-radius の参照

- 現行 SCSS 変数: `$border-radius: 6px` （`_variables.scss` L87）
- CSS 変数: `--bdrs: #{g.rem(6)}` = `0.375rem`
- 変換: `g.$border-radius` → `var(--bdrs)`
- L14, L79 の 2 箇所

---

## 変更サマリ

1. `@use "sass:color";` → 削除
2. `@use "../global/mixins" as m;` → 削除
3. `m.hover` → `g.hover` （6 箇所）
4. `g.$clr1` → `var(--clr1)` （直接参照箇所）
5. `g.$border-radius` → `var(--bdrs)` （2 箇所）
6. `color.scale(g.$clr1, ...)` → CSS 変数または直値（4 パターン、事前に hex 確認要）
