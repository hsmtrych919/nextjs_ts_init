# 事前チェック 07: type.module.scss vs tw_source/_typ.scss 構造比較

§7 で type.module.scss を更新する際の比較用。tw_source/_typ.scss から持ち込む要素の特定。

---

## rhombus（菱形タイトル）構造の差分

### 現行 type.module.scss `.title__rhombus` (L146-196)

**単一構造**: `.title__rhombus` 自体が `display: inline-block`, `position: relative`, `padding`, `font-size`, `letter-spacing` を持ち、`::before` / `::after` でひし形アイコンを配置。

```
<span class={styles.title__rhombus}>テキスト</span>
```

### tw_source `.ttl__rhombus` (L19-81)

**2 層構造**: 外側 `.ttl__rhombus` が `padding`, `background-color`, `text-align: center` を持ち、内側 `&--inner` が `display: inline-block`, `position: relative`, `font-size`, `letter-spacing`, `::before/::after` を持つ。

```
<div class="ttl__rhombus">
  <span class="ttl__rhombus--inner">テキスト</span>
</div>
```

### 主要な値の差分

| プロパティ | 現行 | tw_source --inner | 差 |
|-----------|------|-------------------|-----|
| letter-spacing | `2em` → md: `4em` | `0.1em` → md: `0.15em` | **大きく異なる** |
| font-size (各BP) | 同一 | 同一 | ― |
| padding | `0 rem(36)` → md: `0 rem(46)` | 同一 | ― |
| ::before/::after width | `rem(22)` → md: `rem(30)` | 同一 | ― |
| background-image | コメント（deleted file） | `url(../img/h1_rhombus.svg)` | パス要変更 |

**注意**: letter-spacing の差が非常に大きい（2em vs 0.1em）。これは WP 版で意図的に変更されたのか、Next.js 版のオリジナル値を維持すべきかの判断が必要。

---

## horizontal（横線タイトル）構造の差分

### 現行 type.module.scss `.title__horizontal` (L199-208)

**単一構造**: `.title__horizontal` が `display: inline-block`, `padding`, `background-color`, `color` を持つ。**横線（::after）がない**。

```
<span class={styles.title__horizontal}>テキスト</span>
```

### tw_source `.ttl__horizontal` (L84-112)

**2 層構造**: 外側 `.ttl__horizontal` が `position: relative`, `z-index: 1`, `text-align: center`, `::after`（横線）を持ち、内側 `&--inner` が `display: inline-block`, `padding`, `background-color`, `color` を持つ。

```
<div class="ttl__horizontal">
  <span class="ttl__horizontal--inner">テキスト</span>
</div>
```

### 横線（::after）の定義

```scss
&::after {
  content: "";
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 0;
  width: 100%;
  height: g.rem(3);
  transform: translate3d(0, -50%, 0);
  background-image: var(--grd1);
}
```

**注意**: 現行には横線がない。tw_source の構造を取り込むなら外側に `::after` を追加する。

---

## underbar（下線タイトル）— 新規追加

tw_source `.ttl__underbar` (L114-131)

```scss
.ttl__underbar {
  position: relative;
  z-index: 1;
  padding-bottom: g.rem(16);
  text-align: center;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: g.rem(100);
    height: g.rem(3);
    transform: translate3d(-50%, 0, 0);
    background-color: var(--clr3);
  }
}
```

→ type.module.scss に `title__underbar` として追加。

---

## bg-grd（グラデ背景タイトル）— 新規追加

### `.ttl__bg-grd` (L133-143)

```scss
.ttl__bg-grd {
  color: #fff;
  font-size: g.rem(22);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 600;

  @media #{g.$lg} {
    font-size: g.rem(28);
  }
}
```

### `.ttl__bg-grd--wrap` (L458-468)

```scss
.ttl__bg-grd--wrap {
  padding: g.rem(32) var(--gutter-row);
  background-image: var(--grd1);
  line-height: 1.2;
  @media #{g.$sm} {
    text-align: center;
  }
  @media #{g.$md} {
    padding: g.rem(48) 0;
  }
}
```

→ type.module.scss に `title__bg-grd` と `title__bg-grd--wrap` として追加。

---

## プレースホルダ（%ttl__*）の値の差分

### %ttl__xsmall

| BP | 現行 type.module.scss | tw_source |
|----|----------------------|-----------|
| default | `rem(21)` | `rem(18)` |
| sm | `min(unit*21, rem(22))` | ― |
| md | ― | `max(unit*21, rem(20))` |
| lg | `min(unit*22, rem(23))` | `rem(21)` |
| xl | `min(unit*24, rem(25))` | `rem(24)` |

**差あり**: デフォルト値、関数（min vs max）、BP 対応が異なる。

### %ttl__small

| BP | 現行 type.module.scss | tw_source |
|----|----------------------|-----------|
| default | `rem(21)` | `rem(21)` |
| sm | `min(unit*22, rem(23))` | `max(unit*22, rem(23))` |
| md | ― | ― |
| lg | `min(unit*24, rem(25))` | `rem(25)` |
| xl | `min(unit*25, rem(26))` | `rem(26)` |

**差あり**: sm で `min` vs `max`、lg/xl で直値 vs min+calc。

### %ttl__medium

| BP | 現行 type.module.scss | tw_source |
|----|----------------------|-----------|
| default | `rem(22)` | `rem(22)` |
| sm | `min(unit*24, rem(25))` | `max(unit*24, rem(24))` |
| md | `min(unit*26, rem(27))` | `max(unit*26, rem(26))` |
| lg | `min(unit*30, rem(31))` | `rem(32)` |
| xl | `min(unit*32, rem(33))` | `rem(36)` |

**差あり**: min vs max、lg/xl で値が異なる。

### %ttl__large

| BP | 現行 type.module.scss | tw_source |
|----|----------------------|-----------|
| default | `rem(24)` | `rem(24)` |
| sm | `min(unit*28, rem(29))` | `max(unit*25, rem(26))` |
| md | `min(unit*31, rem(32))` | `max(unit*30, rem(32))` |
| lg | `min(unit*36, rem(37))` | `rem(36)` |
| xl | `min(unit*40, rem(41))` | `rem(40)` |

**差あり**: min vs max、unit 係数が異なる箇所あり。

---

## WP 専用クラス（持ち込まない）

以下は WP テーマ固有のクラスなので Next.js に持ち込まない:

- `.ttl__post--archives` (L158-176)
- `.ttl__post--widget` (L178-186)
- `.ttl__post--widget-related` (L188-196)
- `.ttl__post--widget-grid` (L198-200)
- `.ttl__post--single` (L202-221)
- `.ttl__post--single-h2` (L318-333)
- `.ttl__post--single-h3` (L335-345)
- `.ttl__widget` (L223-270)
- `.ttl__search` (L272-315)
- `.form__ttl` (L475-484)
- `.form__ttl-detail` (L576-587)
- `.typ`, `.typ__xs`, `.typ__s`, `.typ__m`, `.typ__l` (L498-569) — 現行 type.module.scss に `.text` / `.text--*` として既存

---

## 実装前の判断事項

1. **%ttl__* プレースホルダの値差分をどうするか**: 現行の Next.js 値を維持するのか、tw_source に合わせるのか。特に `min()` vs `max()` の違いは表示に影響する。
2. **rhombus / horizontal の構造変更（1層→2層）を取り込むか**: HTML 構造の変更が必要になるため、TSX の変更も伴う。
3. **letter-spacing (rhombus) の差**: 2em vs 0.1em — 現行維持が妥当と思われるが確認要。
4. **`.text--small` L275 の `g.rem(9)` 問題**: タイポの可能性がある（`g.rem(19)` が正しい？）。現行の意図を確認。
