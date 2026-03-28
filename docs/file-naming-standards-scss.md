# SCSS ファイル命名規則ガイド（file-naming-standards-scss.md）

このドキュメントは、本プロジェクトにおける SCSS ファイルの命名規則とクラス命名規則を定めたものです。

## 基本方針

1. **BEM記法準拠**: 基本的にBEM記法（Block__Element--Modifier）に準拠した命名を採用します。
2. **スタイリング判断の前提**: 新クラス作成の判断・方針は `scss-styling-guide.md` を確認し、ガイドを前提に作業すること。
3. **既存構造の尊重**: 現在のディレクトリ構造とファイル配置ルールに従います。
4. **ts.mdとの補完関係**: TypeScript/TSX命名規則は `docs/file-naming-standards-ts.md` で完成済み。本ドキュメントはSCSSに特化してファイル命名体系を完成させます。

## SCSS ファイル命名規則

### 1. CSS Modules ファイル（src/styles/modules/）

#### 命名パターン
```
[機能名].module.scss
```

#### 現状の実装例
- `button.module.scss` - ボタンバリエーション
- `type.module.scss` - タイポグラフィ
- `index.module.scss` - pages/index.tsx用スタイル
- `header.module.scss` - ヘッダーコンポーネント用
- `footer.module.scss` - フッターコンポーネント用
- `modal-photo.module.scss` - 写真モーダル用
- `modal-footer.module.scss` - フッターモーダル用

#### 内部クラス命名規則
CSS Modules環境では、ファイル名がBlock役割を担うため、内部クラスは `element--modifier` 形式を採用：

```scss
// button.module.scss 内
.base--thin {          // Block: button(ファイル名) + Element: base + Modifier: thin
  // スタイル定義
}

.icon--arrow {         // Block: button(ファイル名) + Element: icon + Modifier: arrow
  // スタイル定義
}

.border--clr1 {        // Block: button(ファイル名) + Element: border + Modifier: clr1
  // スタイル定義
}
```

#### CSS出力例
```css
/* ハッシュ化された出力 */
.button_base--thin__a1b2c3 { /* スタイル定義 */ }
.button_icon--arrow__d4e5f6 { /* スタイル定義 */ }
.button_border--clr1__g7h8i9 { /* スタイル定義 */ }
```

### 2. グローバル SCSS ファイル（src/styles/global/）

#### 命名パターン
```
_[機能名].scss
```

**重要**: グローバルSCSSファイルは **必ずアンダースコア（_）で始まる** パーシャルファイルとして作成すること。

#### パーシャルファイルの必要性
- SassコンパイラがCSS出力対象から除外
- importやuseでのみ読み込まれる設計
- ビルド時の不要ファイル生成を防止
- プロジェクトの層構造との整合性確保

#### ディレクトリ別分類

グローバル層は **global/**（共通API）+ **features/**（プロジェクト固有）+ **vendor/**（サードパーティ）の3副層で構成されます。余白・幅・Flexbox・Grid 等の汎用スタイリングは Tailwind CSS v4 ユーティリティクラスに移行済みです。

**global/ 層（共通API）**
- `_index.scss` - global層統合ファイル
- `_variables.scss` - 基本変数定義
- `_breakpoints.scss` - ブレークポイント定義
- `_calc.scss` - 計算関数
- `_font.scss` - フォント設定
- `_hover.scss` - ホバー効果
- `_media-queries.scss` - メディアクエリ関数群

**features/ 層（プロジェクト固有グローバルスタイル）**

以下理由によりモジュール化せずにグローバルスタイルとして維持：
- JavaScript連携、動的クラス操作等でハッシュ化されると.ts/.tsxの動作に影響する
- プロジェクト全体で共通使用するスタイル

- `_layout.scss` - container-width 等レイアウト定義
- `_tab.scss` - タブ機能
- `_toggle.scss` - トグル機能
- `_table.scss` - テーブル機能
- `_style.scss` - プロジェクト全体スタイル・CSS変数・アニメーション定義ほか

**vendor/ 層（サードパーティCSS）**
- `react-modal/_react-modal.scss` - React Modal用
- `react-modal/_modal-photo.scss` - 写真モーダル用
- `react-modal/_modal-footer.scss` - フッターモーダル用
- `scroll-hint/_index.scss` - Scroll Hint用
- `swiper/_swiper-bundle.scss` - Swiper用

#### グローバルクラス命名規則
BEM記法の完全形式 `Block__Element--Modifier` を採用：

```scss
// _toggle.scss 内
.toggle__wrap {              // Block: toggle + Element: wrap
  // スタイル定義
}

.toggle__title {             // Block: toggle + Element: title
  // スタイル定義
}

.toggle__button {            // Block: toggle + Element: button
  // スタイル定義
}

.toggle__wrap.js-active {    // Block: toggle + Element: wrap + State: js-active
  // アクティブ状態のスタイル
}
```

## クラス命名のガイドライン

### 1. CSS Modules内のクラス命名

#### 基本ルール
- ファイル名がBlock役割を担う
- クラス名は `element--modifier` 形式
- 冗長性を排除した効率的な命名

#### 実装例

**type.module.scss**
```scss
.title--xsmall {        // XSサイズタイトル
  // スタイル定義
}

.title--large {         // Lサイズタイトル
  // スタイル定義
}

.text--marker {         // マーカー付きテキスト
  // スタイル定義
}
```

### 2. ユーティリティクラス

余白・幅・Flexbox・Grid 等の汎用ユーティリティクラスは **Tailwind CSS v4 標準クラス** に移行済みです。

```tsx
// Tailwind ユーティリティクラスの使用例
<div className="justify-center items-center">
  <p className="mt-0 mb-1">
    Tailwind ユーティリティクラス使用例
  </p>
</div>
```

### 3. ブレークポイント接頭辞の使い分け

プロジェクト内で定義された関数を適切に使い分け：

```scss
// ブレークポイント接頭辞関数の使い分け
breakpoint-infix-element($bp)   // __sm（Element用）
breakpoint-infix-modifier($bp)  // --sm（Modifier用）
breakpoint-infix($bp)           // -sm（一般用）
```

#### 実装例
```scss
// features/_toggle.scss内での使用例
@each $breakpoint in map.keys($breakpoints) {
  $infix: g.breakpoint-infix-modifier($breakpoint, $breakpoints);

  @if $infix != "" {
    .toggle#{$infix} {    // .toggle--sm のような出力
      // スタイル定義
    }
  }
}
```

## ディレクトリ配置ルール

### 1. CSS Modules配置（src/styles/modules/）
- コンポーネント固有スタイル
- ハッシュ化による名前空間分離
- ページ用・コンポーネント用両方に対応

### 2. グローバルSCSS配置（src/styles/global/）

#### features/ サブディレクトリ
以下の条件でグローバルクラスとして配置：
- JavaScript連携でハッシュ化が影響する機能
- 動的クラス操作が必要な機能
- プロジェクト全体で共通使用するスタイル

#### vendor/ サブディレクトリ
- 外部ライブラリ（react-modal、swiper、scroll-hint等）のクラス上書き

## 例外規定

以下の場合はBEM記法の対象外とする：

### 1. 外部ライブラリのクラス
```scss
// react-modal関連
.ReactModal__Overlay {
  // 外部ライブラリのクラス名をそのまま使用
}

// swiper関連
.swiper-container {
  // 外部ライブラリのクラス名をそのまま使用
}
```

### 2. 状態クラス
JavaScriptで動的に付与される状態クラス：
```scss
.is-active {           // アクティブ状態
  // スタイル定義
}

.is-inview {           // ビューポート内状態
  // スタイル定義
}

.js-active {           // JavaScript制御アクティブ状態
  // スタイル定義
}
```

### 3. JavaScript連携が必要な機能
固有クラス名に依存する機能は、ハッシュ化を避けてグローバルスタイルとして維持：
```scss
.js-toggle-message {   // JavaScript連携用
  // スタイル定義
}

.toggle__wrap.js-active {  // 状態クラスとの組み合わせ
  // スタイル定義
}
```

## 新規ファイル作成時の判断フロー

### 1. CSS Modules作成判断
- コンポーネント固有のスタイルか？
- ハッシュ化が問題ないか？
- JavaScript連携が不要か？

→ **Yes**: `[機能名].module.scss` を `src/styles/modules/` に作成

### 2. グローバルSCSS作成判断
- 外部ライブラリの上書きが必要か？
- JavaScript連携でハッシュ化が影響するか？
- 複数コンポーネント間で共通利用するか？

→ **Yes**: `_[機能名].scss` を `src/styles/global/features/` に作成

### 3. 既存ファイル活用判断
- 単純な汎用スタイルか？
- プロジェクト全体に関わるスタイルか？

→ **Yes**: 既存の `_style.scss` または Tailwind ユーティリティを活用

## まとめ

本命名規則により、以下が実現されます：

1. **一貫性**: BEM記法に基づく統一された命名体系
2. **保守性**: ファイル名から機能が推測可能
3. **拡張性**: 新規ファイル作成時の明確な判断基準
4. **効率性**: CSS Modules・グローバルクラスの適切な使い分け
5. **既存との整合性**: docs/file-naming-standards-ts.mdとの補完関係

スタイリング作業時は、まず `scss-styling-guide.md` でスタイリング方針を確認し、本ドキュメントで命名規則を参照してください。



---

**最終更新**: 2026-03-28
**対象環境**: Next.js 15, SCSS, Tailwind CSS v4