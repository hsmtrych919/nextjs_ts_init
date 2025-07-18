# Phase3: コンポーネント参照システム構築

## 目標
AIと人間が効率的にコンポーネントを参照・理解できるシステムを構築

## システム仕様
各コンポーネントファイルにJSDoc形式で使用例を記載

## 作業内容

### 1. pages/snippet.tsx 作成
- コンポーネント一覧を表示する開発用ページを作成
- 環境変数による本番除外機能を実装

### 2. 既存コンポーネントの更新
- 全てのコンポーネントにJSDoc形式の @example を追加
- 最低2-3パターンの使用例を記載
- Props の説明も併せて記載

### 3. snippet.tsx の機能実装
- コンポーネント一覧の表示
- 各コンポーネントの基本的な表示
- シンプルなナビゲーション機能

## JSDoc記載例
```typescript
/**
 * @component Button
 * @description 汎用ボタンコンポーネント
 *
 * @example
 * // 基本使用
 * <Button variant="primary">Click me</Button>
 *
 * @example
 * // サイズ指定
 * <Button variant="secondary" size="large">Large Button</Button>
 */