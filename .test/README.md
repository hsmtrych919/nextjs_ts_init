# Gallery Application Test Suite

コミット `5da6420` 以降に追加・修正されたギャラリー機能の包括的テストスイートです。

## テスト構成

### 1. Setup（テスト環境設定）

#### `.test/setup/`
- `jest.config.js` - Jest設定ファイル
- `test-utils.tsx` - テストユーティリティとモック設定
- `mocks/` - モックファイル群
  - `galleryData.mock.ts` - ギャラリーデータのモック
  - `mediaFiles.mock.ts` - メディアファイルのモック
  - `fileMock.js` - 静的ファイルのモック

### 2. Unit Tests（単体テスト）

#### `.test/unit/components/`
- `VideoSection.test.tsx` - 動画表示コンポーネント
- `PhotoGrid.test.tsx` - 写真グリッド・案内表示機能

#### `.test/unit/utils/`
- `videoPath.test.ts` - 動画パス処理ユーティリティ
- `galleryData.test.ts` - ギャラリーデータ処理ユーティリティ

### 3. Integration Tests（統合テスト）

#### `.test/integration/`
- `gallery-workflow.test.tsx` - ギャラリーページ全体のワークフロー

## テスト対象機能

### 主要機能
1. **動画表示機能**
   - タブごとの動画表示/非表示
   - レスポンシブ表示（16:9アス比）
   - エラーハンドリング

2. **モーダル案内表示**
   - 全タブ1枚目の「タップして拡大」案内
   - モーダル起動後の案内非表示

3. **galleryData連携**
   - JSONデータからの動画情報取得
   - 型安全性の確保

4. **パス管理**
   - basePath対応
   - キャッシュバスティング
   - WebP対応

## テスト実行方法

### 前提条件
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest ts-jest identity-obj-proxy
```

### 実行コマンド
```bash
# 全テスト実行
npx jest --config .test/setup/jest.config.js

# 特定のテストファイル実行
npx jest --config .test/setup/jest.config.js VideoSection.test.tsx

# カバレッジ付き実行
npx jest --config .test/setup/jest.config.js --coverage

# ウォッチモード
npx jest --config .test/setup/jest.config.js --watch
```

## テストカバレッジ

### 対象ファイル
- `src/components/ui/VideoSection.tsx`
- `src/components/ui/PhotoGrid.tsx`
- `src/lib/utils/videoPath.tsx`
- `src/lib/utils/galleryData.ts`
- `pages/gallery.tsx`

### テスト観点
- **機能テスト**: 各機能が仕様通りに動作する
- **エラーハンドリング**: 異常系の適切な処理
- **統合テスト**: コンポーネント間の連携
- **レスポンシブ**: 画面サイズ対応
- **アクセシビリティ**: キーボード操作・スクリーンリーダー対応

## モック設定

### HTMLVideoElement
- `load()`, `play()`, `pause()` メソッドをモック
- エラーイベントの発火をシミュレーション

### Next.js機能
- `next/config` - publicRuntimeConfig
- `next/router` - ルーティング機能
- `next/image` - 画像最適化

### ブラウザAPI
- `IntersectionObserver`
- `ResizeObserver`
- `matchMedia`

## 既知の制約

1. **実際のメディアファイル**: 動画・画像ファイルの実際の読み込みはモック化
2. **ネットワーク**: APIアクセスはモック化
3. **ブラウザ依存機能**: 実際のブラウザ環境での動作は手動テストが必要

## テスト結果の確認

テスト実行後、以下を確認してください：

1. **全テストがパス**していること
2. **カバレッジが適切**であること（推奨: 80%以上）
3. **エラー・警告がない**こと
4. **テスト実行時間が適切**であること

## トラブルシューティング

### よくある問題

1. **モジュール解決エラー**
   ```bash
   # tsconfig.jsonのpath mappingを確認
   # jest.config.jsのmoduleNameMapperを確認
   ```

2. **CSS Modulesエラー**
   ```bash
   # identity-obj-proxyが正しく設定されているか確認
   ```

3. **Next.js機能エラー**
   ```bash
   # test-utils.tsxのNext.jsモックを確認
   ```

4. **TypeScriptエラー**
   ```bash
   # 型定義ファイルが正しくインストールされているか確認
   npm install --save-dev @types/jest
   ```

## 今後の拡張

1. **E2Eテスト**: Playwright/Cypressでの実ブラウザテスト
2. **パフォーマンステスト**: 動画読み込み・レンダリング性能
3. **アクセシビリティテスト**: axe-coreでの自動チェック
4. **ビジュアルリグレッションテスト**: Storybookとの連携