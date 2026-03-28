# SCSS スタイリングガイド

このドキュメントは、プロジェクトのSCSS体系と新クラス作成時の判断指針を提供します。

## 1. SCSS体系概要

本プロジェクトは、**CSS Modules層**・**グローバル層**（global/ + features/ + vendor/ の3副層）・**Tailwind CSS v4 層**の構成を採用しています。Tailwind は `@tailwindcss/postcss` 経由で統合され、SCSS → PostCSS → Tailwind の処理順で適用されます。

### 1.1 全体構造

```
src/styles/
├── modules/                    # CSS Modules層（ハッシュ化適用、7ファイル）
│   ├── button.module.scss
│   ├── type.module.scss
│   ├── index.module.scss
│   ├── header.module.scss
│   ├── footer.module.scss
│   ├── modal-photo.module.scss
│   └── modal-footer.module.scss
└── global/
    ├── style.scss              # Sass エントリーポイント
    ├── _tailwind-base-layer.scss   # @layer base（CSS 変数、Tailwind 連携）
    ├── global/                 # 共通API
    │   ├── _index.scss
    │   ├── _variables.scss
    │   ├── _breakpoints.scss
    │   ├── _calc.scss
    │   ├── _font.scss
    │   ├── _hover.scss
    │   └── _media-queries.scss
    ├── features/               # プロジェクト固有グローバルスタイル
    │   ├── _layout.scss        # container-width 等
    │   ├── _tab.scss
    │   ├── _toggle.scss
    │   ├── _table.scss
    │   └── _style.scss         # WP コンテンツ用
    └── vendor/                 # サードパーティ CSS
        ├── react-modal/
        ├── scroll-hint/
        └── swiper/
```

### 1.2 CSS Modules層（src/styles/modules）

**ハッシュ化されるコンポーネント固有スタイル** - 以下7ファイル

- `button.module.scss`: ボタンバリエーション（`base--thin`, `icon--arrow`）
- `type.module.scss`: タイポグラフィ（`title--xsmall`, `text--marker`）
- `index.module.scss`: ページ用スタイル（pages/index.tsx専用）
- `header.module.scss`: ヘッダーコンポーネント用（.outer, .logo）
- `footer.module.scss`: フッターコンポーネント用（.outer）
- `modal-photo.module.scss`: 写真モーダル用
- `modal-footer.module.scss`: フッターモーダル用

**特徴**: 全ファイルがBEM準拠の`element--modifier`形式（Block役割はファイル名）

### 1.3 グローバル層（src/styles/global）

グローバル層は **global/**（共通API）+ **features/**（プロジェクト固有）+ **vendor/**（サードパーティ）の3副層で構成されます。

- features/ 内では `@use "../global" as g;` で共通APIを参照
- modules/ 内では `@use "../global/global" as g;` で共通APIを参照

#### global/ 層（共通API）
- `_index.scss`: global層統合ファイル
- `_variables.scss`: 基本変数定義
- `_breakpoints.scss`: ブレークポイント定義
- `_calc.scss`: 計算関数
- `_font.scss`: フォント設定
- `_hover.scss`: ホバー効果
- `_media-queries.scss`: メディアクエリ関数群

#### features/ 層（プロジェクト固有グローバルスタイル）

**以下理由によりモジュール化せずにグローバルスタイルとして維持：**
- JavaScript連携、動的クラス操作等でハッシュ化されると.ts/.tsxの動作に影響する
- プロジェクト全体で共通使用するスタイル

- `_layout.scss`: container-width 等レイアウト定義
- `_tab.scss`: タブ機能
- `_toggle.scss`: トグル機能（`toggle__wrap`系・JavaScript連携）
- `_table.scss`: テーブル機能
- `_style.scss`: プロジェクト全体スタイル・CSS変数・アニメーション定義ほか

#### vendor/ 層（サードパーティCSS）
- `react-modal/_react-modal.scss`: React Modal用
- `react-modal/_modal-photo.scss`: 写真モーダル用
- `react-modal/_modal-footer.scss`: フッターモーダル用
- `scroll-hint/_index.scss`: Scroll Hint用
- `swiper/_swiper-bundle.scss`: Swiper用

### 1.4 Tailwind CSS v4 層

余白・幅・Flexbox・Grid 等の汎用スタイリングは Tailwind CSS v4 ユーティリティクラスに移行済みです。`@tailwindcss/postcss` 経由で統合されています。

- **コンテナ**: `container-width mx-auto flex flex-wrap px-gutter-row xl:px-0`
- **カラム幅**: `w-full`, `w-6/12`, `md:w-10/12` 等（Tailwind 標準幅クラス）
- **ブロックグリッド**: `grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter`
- **Auto columns**: `grow basis-0`
- **ガター**: `px-gutter-row`, `sm:pl-gutter-2`, `md:pl-gutter-3` 等（tailwind.config.js extend.padding）

## 2. 優先順位とファイル選択ルール

### 2.1 基本優先順位（3段階）

#### 優先順位1: プロジェクト層 + ページ用モジュール
**原則として以下に新規クラスを作成**：
- `src/styles/global/features/_style.scss`
- `src/styles/modules/`内のページ用モジュール
- ページ用モジュールがない場合は作成を許可

#### 優先順位2: コンポーネント専用モジュール作成
**機能をコンポーネント化する旨の指示があれば**：
- `src/styles/modules/`内にコンポーネント専用のモジュールを作成
- **ただし例外**: クラス名のハッシュ化が.ts/.tsxの動作に影響する場合は`src/styles/global/features/`内にファイル作成してグローバルクラスとして記載

#### 優先順位3: Tailwind ユーティリティクラスの活用
**Tailwind ユーティリティの使用について**：
- `.hghg {margin-top: 12px;}`のような汎用的かつ簡素で単純なクラスを作らせないため
- 煩雑なクラスの乱立を避けるために Tailwind ユーティリティクラスを活用（余白、幅、Flexbox、Grid は Tailwind 優先）
- 複数の要素が絡むスタイリングの場合は、基本的に優先順位1を優先させる

### 2.2 特別な考慮事項

#### モジュール化の慎重な判断
- 特定機能に特化したクラス群やコンポーネントに付属するクラス群は、モジュール化して`src/styles/modules/`に配置したい
- あらゆるケースを事前想定することは不可能なため、**勝手には進めず必ず確認と許可を得ること**

#### グローバルクラスとして追加する場合
**以下の場合はハッシュ化を避けグローバルクラスを維持**：
- クラス名のハッシュ化がJavaScript連携、動的クラス操作等で.ts/.tsxの動作に影響する場合

#### Tailwind ユーティリティの位置づけ
- **Tailwind 標準クラス優先**: 余白・幅・Flexbox・Grid は Tailwind ユーティリティクラスを使用
- **カスタムクラス**: tailwind.config.js で拡張されたカスタムガター（`px-gutter-row` 等）も活用

## 3. BEM記法とクラス命名規則

### 3.1 基本BEM記法

本プロジェクトは**基本的にBEM記法に準拠**し、以下の命名規則を適用します。

#### CSS Modules内での命名
```scss
// [機能名].module.scss形式
// 内部クラス: element--modifier形式（Block役割はファイル名）

// button.module.scss
.base {           // Block（ファイル名がBlock役割）
  // スタイル

  &--thin {       // Modifier
    // バリエーション
  }
}

.icon--arrow {    // Element--Modifier
  // アイコン用スタイル
}
```

#### グローバルSCSS内での命名
```scss
// _[機能名].scss形式
// BEM記法: Block__Element--modifier形式

// _toggle.scss
.toggle__wrap {        // Block__Element
  // ラップ要素
}

.toggle__button {      // Block__Element
  // ボタン要素
}

.toggle__wrap--active { // Block__Element--Modifier
  // アクティブ状態（必要に応じて）
}
```

### 3.2 ブレークポイント接頭辞の適切な使い分け

**関数選択指針（確定版）**：
```scss
// ブレークポイント接頭辞の適切な使い分け
breakpoint-infix-element($bp)   // __sm
breakpoint-infix-modifier($bp)  // --sm
breakpoint-infix($bp)           // -sm
```

### 3.3 例外規定

**以下の場合はBEM記法の対象外とする**：

#### 外部ライブラリのクラス
```scss
// 対象外: react-modalやswiperなど
.ReactModal__Overlay {
  // 外部ライブラリのクラス上書き
}
```

### 3.4 禁止事項

#### :global() 使用の完全禁止
CSS Modulesにおいて `:global()` の使用は **完全に禁止** します。

```scss
// ❌ 絶対に禁止
:global(.some-class) {
  // スタイル定義
}

// ❌ 絶対に禁止
.local-class :global(.global-class) {
  // スタイル定義
}
```

**理由**:
- CSS Modulesのスコープ分離機能を破綻させる
- グローバル汚染によるスタイル競合のリスク
- 本プロジェクトの層構造設計に反する
- デバッグ・保守性の著しい低下

**代替手段**:
- グローバルスタイルが必要な場合は `src/styles/global/` 内の適切なファイルに配置
- コンポーネント固有スタイルは通常のCSS Modulesクラスを使用

### 3.5 文章スタイリング統一ガイドライン

#### 基本方針
コンテンツとしての文章（タイトル除く）には、`type.module.scss` の統一されたタイポグラフィクラスを使用する。

#### 適用対象
- 本文・説明文・詳細テキスト・コンテンツ文章
- **除外**: h1-h6などのタイトル要素

#### 使用クラス
```tsx
import typeStyles from '@/styles/modules/type.module.scss';

// 基本的な文章（最も使用頻度が高い）
<p className={typeStyles.text}>基本の文章テキスト</p>

// サイズバリエーション（必要な場合のみ使用）
<p className={typeStyles['text--xs']}>小さなテキスト</p>
<p className={typeStyles['text--small']}>やや小さなテキスト</p>
<p className={typeStyles['text--medium']}>やや大きなテキスト</p>
<p className={typeStyles['text--large']}>大きなテキスト</p>

// 特殊効果（指示があった場合のみ使用）
<span className={typeStyles['text--marker']}>マーカー付きテキスト</span>
```

#### 設定場所の判断
```tsx
// ✅ 推奨：セマンティックな要素に直接設定
<p className={typeStyles.text}>
  文章内容
</p>

// ✅ 許可：効率性を重視した親要素への設定
<div className={typeStyles.text}>
  <p>複数の段落がある場合</p>
  <p>親要素に設定して効率化</p>
</div>

// ❌ 避ける：不必要な階層化
<div>
  <div className={typeStyles.text}>
    <p>不要なネストは避ける</p>
  </div>
</div>
```

#### 技術的背景
- レスポンシブ対応済み（576px、1025px、1366pxブレークポイント）
- 適切な行間設定（`typ__line-height` mixin適用）
- CSS Modulesによるスコープ分離
- fluid typography による滑らかなサイズ変化

#### 状態クラス
```scss
// 対象外: JavaScriptで動的に付与される状態クラス
.is-active {
  // 動的状態クラス
}

.is-inview {
  // インビューアニメーション用
}
```

#### JavaScript連携が必要な機能
```scss
// 対象外: 固有クラス名に依存する機能はグローバルスタイル維持
.js-toggle-wrap {
  // JavaScript側で要素選択に使用
}
```

## 4. 実装例とベストプラクティス### 4.1 新規ページスタイル作成例

```scss
// src/styles/modules/about.module.scss（新規作成）
.hero {
  // ページ固有のヒーローセクション

  &--large {
    // 大型バリエーション
  }
}

.content {
  // メインコンテンツ
}
```

### 4.2 プロジェクト共通スタイル追加例

```scss
// src/styles/global/features/_style.scss（既存ファイルに追加）
.inview__fadein {
  transform: translateY(30px);
  opacity: 0;
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.is-inview {
  transform: translateY(0);
  opacity: 1;
}
```

### 4.3 新規コンポーネント用モジュール作成例

```scss
// src/styles/modules/card.module.scss（新規作成）
.base {
  border: 1px solid var(--clrg300);
  border-radius: var(--bdrs);

  &--shadow {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.header {
  padding: 1rem;
  border-bottom: 1px solid var(--clrg200);
}

.body {
  padding: 1rem;
}
```

### 4.4 JavaScript連携コンポーネント例

```scss
// src/styles/global/features/_carousel.scss（新規作成）
.carousel__wrap {
  position: relative;
  overflow: hidden;
}

.carousel__slide {
  transition: transform 0.3s ease;
}

.carousel__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  &--prev {
    left: 1rem;
  }

  &--next {
    right: 1rem;
  }
}
```

### 4.5 Tailwind ユーティリティクラス活用例

```tsx
// Tailwind ユーティリ��ィクラスの活用
<div className="justify-center items-center">
  <p className="mt-0 mb-1">
    Tailwind ユーティリティクラス使用例
  </p>
</div>
```

### 4.6 文章スタイリング実装例

```tsx
import typeStyles from '@/styles/modules/type.module.scss';

// 基本的な文章スタイリング
<article>
  <h2 className={typeStyles['title--medium']}>記事タイトル</h2>
  <p className={typeStyles.text}>
    基本的な本文テキストです。レスポンシブ対応済みで、
    適切な行間と文字サイズが自動で適用されます。
  </p>
</article>

// 複数段落の効率的なスタイリング
<section className={typeStyles.text}>
  <h3 className={typeStyles['title--small']}>セクションタイトル</h3>
  <p>第一段落の内容</p>
  <p>第二段落の内容</p>
  <p>第三段落の内容</p>
</section>

// ギャラリー説明文（既存実装例）
<div className={galleryStyles.categoryDescription}>
  <p className={typeStyles.text}>{currentCategory.description}</p>
</div>

// カード型コンポーネントでの活用
<article className={cardStyles.base}>
  <h3 className={typeStyles['title--medium']}>カードタイトル</h3>
  <div className={typeStyles.text}>
    <p>カードの説明文</p>
    <p>追加の詳細情報</p>
  </div>
</article>
```

## 5. 判断フローチャート

### 5.1 新規スタイル作成時の判断手順

```
1. 文章・テキストのスタイリングか？
   Yes → type.module.scss の .text クラス使用
   No ↓

2. Tailwind ユーティリティクラスで対応可能か？
   Yes → Tailwind クラス使用
   No ↓

3. ページ固有のスタイルか？
   Yes → modules/[page].module.scss に作成
   No ↓

4. 複数ページで使用する共通スタイルか？
   Yes → global/features/_style.scss に作成
   No ↓

5. 特定コンポーネント専用か？
   Yes → JavaScript連携が必要？
         Yes → global/features/ に作成
         No → modules/[component].module.scss に作成
   No ↓

6. システム全体に影響する基盤的変更か？
   Yes → 該当するglobal層ファイルに追加
```

### 5.2 CSS Modules vs グローバルクラスの判断

#### CSS Modules使用ケース
- コンポーネント固有のスタイル
- ハッシュ化によるスコープ分離が有効
- JavaScript連携が不要

#### グローバルクラス使用ケース
- JavaScript側でクラス名を参照する必要がある
- 外部ライブラリとの連携が必要
- 動的なクラス操作が必要
- プロジェクト全体で共通使用

## 6. メンテナンス指針

### 6.1 既存クラスの調査

新規作成前に以下を確認：
```bash
# 類似クラスの存在確認
grep -r "similar-class" src/styles/

# Tailwind ユーティリティクラスの活用を検討
# 余白・幅・Flexbox・Grid は Tailwind 標準クラスを優先
```

### 6.2 命名の一貫性確保

- **状態**: 状態クラスは `is-` または `js-`
- **BEM記法**: `Block__Element--Modifier`の徹底

### 6.3 ドキュメント更新

新規パターン作成時は本ガイドの更新も検討してください。

### 6.4 リセットCSS考慮事項

新規スタイル作成時は、既存のリセットCSS設定を確認し、重複したリセットを避けること。

#### 適用済みリセット
- **destyle.css**: box-sizing、margin、paddingの基本リセット
- **_reboot.scss**: Bootstrap風の基本スタイルリセット

#### 注意点
```scss
// ❌ 避ける：既にリセット済みのプロパティ
.custom-class {
  margin: 0;        // destyle.css で既にリセット済み
  padding: 0;       // destyle.css で既にリセット済み
  box-sizing: border-box;  // destyle.css で既にリセット済み
}

// ✅ 推奨：リセット状況を理解した上でのスタイリング
.custom-class {
  margin-top: 1rem;     // 必要な箇所のみ指定
  padding: 0.5rem 1rem; // 必要な箇所のみ指定
}
```

**参考**: リセットCSS は Tailwind CSS v4 のベースレイヤーに統合済みです。`_tailwind-base-layer.scss` を参照。

## 7. 余白設定ガイドライン

### 7.1 基本原則（Core Rules）

#### 80/20ルールの適用
このガイドラインは**80/20ルール**（パレートの法則）に基づいて設計されています。

- **80%のケース**: 基本原則で効率的に対応
- **20%のケース**: 例外条件で柔軟に対応
- **実用性重視**: ルール厳守よりも開発効率を優先

#### 下位置要素優先ルール
余白は**下位置要素**の上方向（`margin-top` / `padding-top`）に設定することを原則とする。

```scss
// ✅ 推奨：下位置要素にtop余白
.content-section {
  margin-top: 2rem;
}
// ❌ 避ける：上位置要素にbottom余白
.content-section {
  margin-bottom: 2rem;  // 予測困難
}
```

#### 一方向フロー設計
上から下への一方向余白で予測可能性を確保し、margin collapseによる意図しない余白を回避する。

#### 親要素補完ルール
下位置要素が存在しない場合の末尾余白は、親要素・ラッパー要素で `padding-bottom` を使用する。

```scss
// ✅ 推奨：親要素でpadding-bottom
.section-wrapper {
  padding-bottom: 2rem;  // margin相殺を避けるためpadding使用
}
```
```tsx
<section className="content-wrapper pb-8">
  <h2>セクションタイトル</h2>
  <p className="mt-2">段落1</p>
  <p className="mt-4">段落2（最下部要素）</p>
</section>
```

### 7.2 margin vs padding 判断基準

基本的には状況次第でのベストプラクティスを採用。

```scss
// margin: 要素間の関係性を示す場合
.section {
  margin-top: 2rem;  // 前のセクションとの間隔
}

// padding: 要素内部の余白、margin相殺回避が必要な場合
.wrapper {
  padding-bottom: 1rem;  // 内部要素の末尾余白
}
```

### 7.3 例外許可条件（Exception Guidelines）

#### 80/20ルールに基づく例外適用
**80%のケース**で基本原則を適用し、**20%のケース**で例外を許可することで、実用性と一貫性のバランスを確保します。

以下の場合は `margin-bottom` / `padding-bottom` の使用を許可する：

#### 許可条件
1. **スタイリング煩雑化**：原則適用により複雑なセレクタやクラスが必要になる場合
2. **無駄なクラス作成**：原則のためだけに新規クラス作成が必要になる場合
3. **開発効率悪化**：原則適用により著しく開発効率が悪化する場合

**重要**: ガイドライン厳守のために余計なコードを書くことは本末転倒です。実用性を最優先に判断してください。

#### 具体的例外ケース
```scss
// Flexbox gap使用時
.card-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;  // gap使用で余白ルール適用外
}

// 外部ライブラリ制約時
.swiper-slide {
  margin-bottom: 1rem;  // ライブラリ仕様による制約
}
```

### 7.4 判断フローと実装指針

#### ステップ判断
```
1. 基本ルール適用（下位置要素にtop余白）
   ↓
2. 煩雑化・非効率化するか？
   No → 基本ルール継続
   Yes → 例外適用検討
   ↓
3. 既存ユーティリティクラス活用
   ↓
4. 必要に応じて例外適用
```

#### 実装前チェックリスト
- [ ] 既存のmargin/paddingユーティリティクラスで対応可能か？
- [ ] 基本ルール適用でコードが複雑化しないか？
- [ ] 不要なクラス作成を避けられるか？
- [ ] 開発効率とルール遵守のバランスは適切か？

#### Tailwind ユーティリティクラス活用
```tsx
// Tailwind ユーティリティクラスの活用
<div className="mt-4 pb-6">  // top: margin, bottom: padding
  <h2>コンテンツタイトル</h2>
  <p className="mt-2">本文内容</p>
</div>
```

### 7.5 技術的根拠

- **80/20ルール適用**: 多数のケースを効率的にカバーしつつ例外に柔軟対応
- **margin collapse回避**: 予測可能な余白計算
- **一方向フロー**: レイアウトの一貫性確保
- **保守性向上**: 余白の起点が明確でデバッグしやすい
- **開発効率**: ルール化による判断時間短縮
- **実用性重視**: ガイドライン自体が開発の妨げにならない設計

## 8. レスポンシブ対応ガイドライン

### 8.1 基本原則

#### モバイルファースト設計
レスポンシブ対応は**モバイルファースト**を基本とし、小さい画面から大きい画面への段階的なスタイル拡張を行う。

#### 既存ブレークポイント仕様の必須使用
独自のメディアクエリを作成せず、**必ず既存の定義済みブレークポイント**を使用する。

```scss
// ✅ 推奨：既存のブレークポイント使用
@use "../global/global" as g;

.sample {
  padding-top: 8px;        // モバイル（ベース）

  @media #{g.$sm} {        // 576px以上
    padding-top: 16px;
  }

  @media #{g.$md} {        // 811px以上
    padding-top: 24px;
  }

  @media #{g.$lg} {        // 1025px以上
    padding-top: 32px;
  }
}

// ❌ 禁止：独自のメディアクエリ作成
.sample {
  @media (min-width: 768px) and (max-width: 1024px) {
    padding-top: 20px;  // 細かすぎる独自ブレークポイント
  }
}
```

### 8.2 既存ブレークポイント仕様

#### 定義済みブレークポイント
```scss
// tailwind.config.js の screens および global/global/_breakpoints.scss で定義済み
$grid-breakpoints-sm: 576px
$grid-breakpoints-md: 811px
$grid-breakpoints-lg: 1025px
$grid-breakpoints-xl: 1280px
$grid-breakpoints-xxl: 1366px
```

#### 使用可能なメディアクエリ変数
```scss
// src/styles/global/global/_media-queries.scss で定義済み
g.$sm   // "(min-width: 576px)"
g.$md   // "(min-width: 811px)"
g.$lg   // "(min-width: 1025px)"
g.$xl   // "(min-width: 1280px)"
g.$xxl  // "(min-width: 1366px)"
```

TSX テンプレート内では Tailwind のレスポンシブ prefix（`sm:`, `md:`, `lg:`, `xl:`, `2xl:`）も使用可能です。

### 8.3 実装パターン

#### 基本的なモバイルファースト実装
```scss
@use "../global/global" as g;

.hero-section {
  // モバイル（ベース）: ~575px
  padding: 1rem;
  font-size: 1.5rem;

  // タブレット: 576px以上
  @media #{g.$sm} {
    padding: 1.5rem;
    font-size: 1.75rem;
  }

  // デスクトップ: 811px以上
  @media #{g.$md} {
    padding: 2rem;
    font-size: 2rem;
  }

  // 大画面: 1025px以上
  @media #{g.$lg} {
    padding: 3rem;
    font-size: 2.5rem;
  }
}
```

#### Flexboxレイアウトとの連携
```scss
@use "../global/global" as g;

.content-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media #{g.$sm} {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  @media #{g.$md} {
    gap: 2rem;
  }
}
```

#### Tailwind レスポンシブクラスとの併用
```tsx
// Tailwind レスポンシブユーティリティクラス活用
<div className="mt-2 sm:mt-4 md:mt-6">
  <h2>レスポンシブ余白の例</h2>
</div>
```

### 8.4 禁止事項

#### 独自ブレークポイントの作成禁止
```scss
// ❌ 絶対に禁止：独自のピクセル値
@media (min-width: 768px) { }
@media (max-width: 1024px) { }
@media (min-width: 900px) and (max-width: 1200px) { }

// ❌ 絶対に禁止：range構文の使用
@media (width >= 768px) and (width <= 1024px) { }
```

#### 細かすぎるブレークポイント分割の禁止
```scss
// ❌ 避ける：過度に細分化されたレスポンシブ
.component {
  font-size: 14px;
  @media #{g.$sm} { font-size: 15px; }  // 1px差は不要
  @media #{g.$md} { font-size: 16px; }  // 1px差は不要
  @media #{g.$lg} { font-size: 17px; }  // 1px差は不要
}

// ✅ 推奨：意味のある段階的変更
.component {
  font-size: 14px;
  @media #{g.$md} { font-size: 16px; }  // 意味のある変更
  @media #{g.$lg} { font-size: 18px; }  // 意味のある変更
}
```

### 8.5 実装指針

#### ブレークポイント選択の判断
```
1. モバイル（ベース）: 必須
2. 必要に応じてsm（576px）を追加
3. 多くの場合でmd（811px）は必要
4. 大画面対応でlg（1025px）以上を検討
5. xl、xxlは特別な場合のみ使用
```

#### 実装前チェックリスト
- [ ] モバイルファーストで設計しているか？
- [ ] 既存のg.$sm, g.$md等を使用しているか？
- [ ] 独自のピクセル値を使用していないか？
- [ ] 段階的な変更で意味のある差があるか？
- [ ] 過度に細分化していないか？

#### 技術的根拠
- **既存システムとの整合性**: プロジェクト全体でのブレークポイント統一
- **保守性向上**: 一箇所での変更がプロジェクト全体に反映
- **パフォーマンス**: 不要なメディアクエリ削減
- **デザインシステム整合**: 既存グリッドシステムとの連携

## 9. コンテンツ幅使用ガイドライン

### 9.1 基本方針

本プロジェクトでは **Tailwind ユーティリティ + `container-width` クラス** によるレイアウトシステムが定義済みです。デバイスごとのコンテナ幅とガターは既に最適化されているため、独自のコンテンツ幅指定は **原則として禁止** します。

### 9.2 既存システムの必須使用

#### 標準的な3層構造
`GridDemo.tsx` で定義された3層構造に必ず準拠すること：

```tsx
// ✅ 推奨：Tailwind レイアウトシステムの正しい使用
<div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">  {/* 1層目: コンテナ・余白 */}
  <div className="w-full lg:w-8/12">                                            {/* 2層目: カラム幅 */}
    <div className="content-styling">コンテンツ</div>                             {/* 3層目: コンテンツのみ */}
  </div>
</div>
```

#### 利用可能なクラス
- **コンテナ**: `container-width mx-auto flex flex-wrap px-gutter-row xl:px-0`
- **カラム幅**: `w-full`, `w-6/12`, `md:w-10/12`, `lg:w-8/12` 等（Tailwind 標準幅クラス）
- **ブロックグリッド**: `grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter`
- **Auto columns**: `grow basis-0`
- **ガター**: `px-gutter-row`, `sm:pl-gutter-2`, `md:pl-gutter-3` 等

### 9.3 禁止事項

#### 独自の幅・余白指定の禁止
```scss
// ❌ 絶対に禁止：既存システムを無視した独自スタイリング
.custom-layout {
  width: 800px;           // 独自の固定幅
  max-width: 1200px;      // 独自の最大幅
  padding: 0 20px;        // 独自の余白指定
  margin: 0 auto;         // 独自のセンタリング
}

// ❌ 絶対に禁止：コンテナレベルでの幅指定
.page-wrapper {
  width: 90%;             // パーセンテージ幅
  padding-left: 15px;     // 独自ガター
  padding-right: 15px;    // 独自ガター
}
```

#### AIコーディングでよくある問題パターン
```scss
// ❌ よくある誤ったパターン：全て禁止
.content-area {
  max-width: 960px;       // 独自の最大幅
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;        // 既存ガターを無視
}

.section-wrapper {
  width: calc(100% - 40px);  // 独自の計算式
  margin: 0 20px;            // 独自マージン
}
```

### 9.4 例外的使用の条件

#### 限定的な許可範囲
以下の条件を **全て満たす場合のみ** 独自幅使用を許可：

1. **3層目（コンテンツ層）での使用のみ**
2. **特殊なデザイン要件** で既存システムでは対応不可能
3. **ページ固有** の限定的な使用

```scss
// ✅ 例外的に許可：3層目での特殊コンテンツ
.special-content {
  // Tailwind レイアウトシステム内の3層目でのみ許可
  max-width: 600px;  // 特殊な読みやすさ要件など
  margin: 0 auto;
}
```

```tsx
// 使用例：正しい3層構造内での例外使用
<div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">
  <div className="w-full">
    <div className="special-content">  {/* 3層目でのみ例外使用可能 */}
      特殊なレイアウト要件のコンテンツ
    </div>
  </div>
</div>
```

### 9.5 判断フローチャート

```
1. レイアウト・コンテナ・余白の実装が必要？
   Yes ↓

2. Tailwind レイアウトシステム（container-width + 幅クラス + ガター）で対応可能？
   Yes → Tailwind レイアウトシステム必須使用
   No ↓

3. 3層目（コンテンツ層）での限定的使用？
   Yes → 特殊要件の場合のみ許可
   No → 禁止

4. 1-2層目での独自幅指定？
   → 完全禁止
```

### 9.6 技術的根拠

- **レスポンシブ一貫性**: 既存システムによる統一された画面対応
- **保守性**: 一元管理されたグリッド・ガターシステム
- **設計統一**: GridDemo.tsx で実証済みの3層構造設計
- **パフォーマンス**: 最適化済みのブレークポイント・余白定義

## 10. display: grid; 使用に関する位置づけ

### 10.1 基本スタンス

本プロジェクトは **Tailwind CSS Grid ユーティリティ**（`grid grid-cols-*`）を標準として採用しており、`display: grid;` の使用は推奨される手法です。SCSS 内での直接的な `display: grid;` 記述についても、効率的なスタイリングのために使用を許容します。

### 10.2 使用許可範囲

以下の **影響範囲が限られたファイル** においてのみ使用を許可：

- **ページ用モジュールSCSS** (`src/styles/modules/[page].module.scss`)
- **プロジェクト共通スタイル** (`src/styles/global/features/_style.scss`)

### 10.3 使用判断基準

```scss
// ✅ 許容：ページ固有で効率的な場合
// src/styles/modules/gallery.module.scss
.imageGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

// ✅ 許容：プロジェクト固有で効率的な場合
// src/styles/global/features/_style.scss
.complex-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

// ❌ 避ける：グローバルに影響する箇所
// src/styles/global/features/_card.scss
.card {
  display: grid;  // 他のコンポーネントに影響する可能性
}
```

### 10.4 優先順位

1. **第一選択**: Tailwind ユーティリティ（`grid grid-cols-*`, `flex` 等）
2. **第二選択**: SCSS 内での `display: grid;` 直接記述（複雑なレイアウト時）

```scss
// 判断例：複数カラムレイアウト
// 1. まずFlexboxで検討
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

// 2. 複雑な場合にGrid検討
.complex-layout {
  display: grid;  // 2次元レイアウトでFlexboxより効率的
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
}
```

---

**最終更新**: 2026-03-28
**対象環境**: Next.js 15, TypeScript, SCSS, Tailwind CSS v4