# 事前チェック 01: CSS 変数の値比較

移行前（`src/styles/global/project/_style.scss` :root）と移行後（`_tailwind-base-layer.scss` :root）の CSS 変数値を比較する。

---

## 比較対象

### 現行: `src/styles/global/project/_style.scss` L15-39

SCSS 変数を介して `:root` に出力している。`color.scale()` で計算された値はコンパイル後の CSS で確認する必要がある。

```scss
:root {
  --clr1: #{g.$clr1};                          // → #4FBA43
  --clr1-hover: #{color.scale(g.$clr1, $lightness: -20%)}; // → 要コンパイル確認
  --clr2: #{g.$clr2};                          // → #9BD22D
  --clr3: #{g.$clr3};                          // → #725907
  --clr4: #{g.$clr4};                          // → #B69941
  --clr5: #{g.$clr5};                          // → #f6f0dd
  --grd1: #{g.$grd1};                          // → linear-gradient(120deg, #9BD22D, #4FBA43)
  --grd2: #{g.$grd2};                          // → linear-gradient(90deg, #FDD88A, #9E8004)
  --clrg50 〜 --clrg900: #{color.scale(g.$black, $lightness: XX%)}  // 要コンパイル確認
  --black: #{g.$black};                        // → #222
  --gray: #{g.$gray};                          // → $clrg700 の値
  --bdrs: #{g.rem(6)};                         // → 0.375rem
  --img-hover-opacity: 0.9;
  --modal-height-photo: 75vh;
}
```

### 移行先: `tw_source/src/scss/_tailwind-base-layer.scss` L13-40

直値で定義済み。

```scss
:root {
  --clr1: #4FBA43;
  --clr2: #9BD22D;
  --clr3: #725907;
  --clr4: #B69941;
  --clr5: #f6f0dd;
  --clr-prim-green: #41c45d;     // ← 現行に無い。追加
  --grd1: linear-gradient(120deg, #9BD22D, #4FBA43);
  --grd2: linear-gradient(90deg, #FDD88A, #9E8004);
  --black: #222;
  --clrg50: #fbfbfb;
  --clrg100: #f5f5f5;
  --clrg200: #e8e8e8;
  --clrg300: #d5d5d5;
  --clrg400: #b0b0b0;
  --clrg500: #959595;
  --clrg600: #858585;
  --clrg700: #767676;
  --clrg800: #5b5b5b;
  --clrg900: #3f3f3f;
  --gray: var(--clrg700);
  --link-color: var(--clrg800);        // ← 現行 :root に無い（_variables-color に SCSS変数あり）
  --link-hover-color: #747474;         // ← 同上
  --clr1-hover: #3f9536;              // ← 現行は color.scale で計算
  --img-hover-opacity: 0.9;
  --bdrs: #{g.rem(50)};               // ← 50 → 6 に要変更（計画書記載済み）
  --bdrs-lg: #{g.rem(100)};           // ← 現行に無い。Next.js 不要なら除去
}
```

---

## 確認事項

### 1. グレースケール値の一致確認（最重要）

現行は `color.scale($black, $lightness: XX%)` で計算される。tw_source は直値。
**実装前に現行のコンパイル済み CSS から実際の hex 値を取得し、tw_source の直値と一致するか確認する。**

| 変数 | 現行計算式 | tw_source 値 | 一致？ |
|------|-----------|-------------|--------|
| --clrg50 | `color.scale(#222, $lightness: 98%)` | #fbfbfb | 要確認 |
| --clrg100 | `color.scale(#222, $lightness: 96%)` | #f5f5f5 | 要確認 |
| --clrg200 | `color.scale(#222, $lightness: 93%)` | #e8e8e8 | 要確認 |
| --clrg300 | `color.scale(#222, $lightness: 88%)` | #d5d5d5 | 要確認 |
| --clrg400 | `color.scale(#222, $lightness: 74%)` | #b0b0b0 | 要確認 |
| --clrg500 | `color.scale(#222, $lightness: 62%)` | #959595 | 要確認 |
| --clrg600 | `color.scale(#222, $lightness: 46%)` | #858585 | 要確認 |
| --clrg700 | `color.scale(#222, $lightness: 38%)` | #767676 | 要確認 |
| --clrg800 | `color.scale(#222, $lightness: 26%)` | #5b5b5b | 要確認 |
| --clrg900 | `color.scale(#222, $lightness: 13%)` | #3f3f3f | 要確認 |

**確認方法**: `npm run build` → `_dist` 内の CSS から `:root` ブロックを抽出して比較。

### 2. --clr1-hover の値確認

- 現行: `color.scale(#4FBA43, $lightness: -20%)` → コンパイル後の hex を確認
- tw_source: `#3f9536`
- **一致するか要確認**

### 3. --link-hover-color の値確認

- 現行 SCSS 変数: `color.scale($link-color, $lightness: 15%)` = `color.scale(#5b5b5b, $lightness: 15%)`
- tw_source: `#747474`
- **一致するか要確認**

### 4. 現行にあって tw_source に無い変数

| 変数 | 対応 |
|------|------|
| --modal-height-photo: 75vh | _tailwind-base-layer.scss に追加する（計画書記載済み） |

### 5. tw_source にあって現行に無い変数

| 変数 | 対応 |
|------|------|
| --clr-prim-green: #41c45d | 追加する（計画書記載済み） |
| --link-color: var(--clrg800) | 追加する |
| --link-hover-color: #747474 | 追加する（値一致を事前確認後） |
| --bdrs-lg: #{g.rem(100)} | WP 用。Next.js で使わないなら除去 |

### 6. 値を変更する変数

| 変数 | tw_source | Next.js 正値 | 理由 |
|------|-----------|-------------|------|
| --bdrs | g.rem(50) | g.rem(6) | 現行が 6px。tw_source は WP 用の値（計画書記載済み） |

---

## gutter 系変数

`_tailwind-base-layer.scss` L46-86 の gutter 系 CSS 変数（--unit, --space, --gutter, --gutter-row）は現行では `src/styles/global/layout/_grid.scss` 内で定義されている。

**確認方法**: コンパイル済み CSS 内の `:root` ブロックで各ブレークポイントの `vw` 計算値が一致するか比較。

## header-height

`_tailwind-base-layer.scss` L92-100 の --header-height は現行 header.module.scss 内にあるか、_style.scss には無い。
**tw_source からの持ち込み時に重複しないか確認が必要。**
