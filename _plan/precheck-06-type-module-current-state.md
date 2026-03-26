# 事前チェック 06: type.module.scss の現状と §7 更新内容

計画書 §7 で type.module.scss に追加・変更する内容の事前確認。

---

## 現行クラス一覧: `src/styles/modules/type.module.scss`

### プレースホルダ（%）

| 名前 | 行 | 内容 |
|------|-----|------|
| `%font-min` | L11-26 | 明朝体フォントファミリー |
| `%ttl__xsmall` | L29-45 | font-size: rem(21) 〜 min(unit*24, rem(25)) |
| `%ttl__small` | L47-65 | font-size: rem(21) 〜 min(unit*25, rem(26)) |
| `%ttl__medium` | L67-84 | font-size: rem(22) 〜 min(unit*32, rem(33)) |
| `%ttl__large` | L87-104 | font-size: rem(24) 〜 min(unit*40, rem(41)) |

### タイトルクラス

| クラス | 行 | 内容 |
|--------|-----|------|
| `.title--xsmall` | L118-120 | `@extend %ttl__xsmall` |
| `.title--small` | L122-124 | `@extend %ttl__small` |
| `.title--medium` | L127-129 | `@extend %ttl__medium` |
| `.title--large` | L132-134 | `@extend %ttl__large` |
| `.title__underline--aligned` | L136-139 | pb + border-bottom clr1 |
| `.title__rhombus` | L146-196 | 単一構造（::before, ::after 含む） |
| `.title__horizontal` | L199-208 | 単一構造（--yellow-bg 含む） |
| `.title__pattern--diagonal` | L210-217 | 斜線パターン背景 |

### mixin

| 名前 | 行 | 内容 |
|------|-----|------|
| `typ__line-height` | L224-230 | 1.8 → md: 2 |
| `typ__line-height--thin` | L232-238 | 1.5 → md: 1.7 |

### テキストクラス

| クラス | 行 | 内容 |
|--------|-----|------|
| `.text` | L240-252 | get_vw(16) → min(unit*17, rem(18)) |
| `.text--xs` | L254-266 | get_vw(13) → min(unit*15, rem(16)) |
| `.text--small` | L269-281 | get_vw(17) → min(unit*18, rem(20)) |
| `.text--medium` | L283-295 | get_vw(20) → min(unit*20, rem(23)) |
| `.text--large` | L297-309 | get_vw(22) → min(unit*23, rem(24)) |
| `.text--marker` | L312-315 | マーカー（ピンク系グラデ） |

### コメントアウト済み

| クラス | 行 | 内容 |
|--------|-----|------|
| `%inter300` / `%inter600` | L318-329 | Inter フォント |
| `.webfont__inter--300` / `--600` | L331-337 | Inter フォント |

---

## 計画書 §7 で追加予定の内容

tw_source の `_typ.scss` から持ち込む要素（_typ.scss 自体は持ち込まない）:

### 1. `.title__rhombus` の inner 構造追加

現行は単一構造。tw_source では inner span が追加されているか確認が必要。

### 2. `.title__horizontal` の inner 構造追加

同上。

### 3. `.title__underbar` の追加

tw_source にある下線タイトル。現行に無い。

### 4. `.title__bg-grd` / `.title__bg-grd--wrap` の追加

tw_source にあるグラデーション背景タイトル。現行に無い。

---

## 依存関係の確認

### 現行 @use

```scss
@use "sass:color";           // ← 未使用。削除可能
@use "../global/global" as g; // ← 維持
@use "../global/mixins" as m; // ← 未使用（m. の呼び出しなし）。削除可能
```

### g. の使用パターン

- `g.rem()` — 多数
- `g.get_vw()` — L243, L257, L272, L286, L300
- `g.$sm`, `g.$md`, `g.$lg`, `g.$xl`, `g.$xxl` — ブレークポイント
- `--unit` — CSS 変数として直接使用（L35 等 `calc(var(--unit) * 21)`）

### 未使用 import の確認

`sass:color` → grep で `color.` の呼び出しなし → **削除可能**
`../global/mixins as m` → grep で `m.` の呼び出しなし → **削除可能**

---

## 実装時の確認ポイント

1. `@use "sass:color";` と `@use "../global/mixins" as m;` が未使用なので削除する
2. tw_source から追加するクラスの具体的な SCSS コードは `tw_source/src/scss/features/_typ.scss` から抽出
3. `.title__rhombus` / `.title__horizontal` の現行構造と tw_source 構造の差分を詳細比較してから更新
4. `.text--small` L275 に `g.rem(9)` という不自然な値がある（`g.rem(19)` のタイポ？）— 事前確認要
