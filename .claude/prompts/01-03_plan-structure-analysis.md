# Phase2 ディレクトリ構造最適化 - 計画立案

## 目標
Phase2実行前にディレクトリ構造変更計画を詳細に立案し、影響範囲を明確にする

## 作業内容

### 1. 現状分析（読み取り専用）
- 既存のディレクトリ構造とファイル配置を詳細に分析
- `tree -I 'node_modules|.git|.next'` で現在の構造確認
- 各ファイルの役割と依存関係を把握（import文解析）
- 重複コンポーネントや不要なディレクトリを特定

### 2. 最適構造の設計
- 現在のファイル群に基づいて最適なディレクトリ構成を設計
- Next.js 13+ App Router対応の構造を提案
- 複数開発者が作業しやすい分離可能な構造を重視
- 各ディレクトリの役割と配置ルールを明確化

### 3. 詳細移行計画立案
- **ファイル移動計画**
  - 移動元→移動先の詳細リスト（具体的なパス）
  - 移動順序と依存関係を考慮した実行順
- **import文更新計画**
  - パス変更が必要なファイル一覧
  - 相対パス・絶対パスの統一方針
  - 一括置換用の正規表現パターン
- **設定ファイル変更計画**
  - tsconfig.json のパス設定更新内容
  - next.config.js の調整項目（必要に応じて）
  - package.json のスクリプト最適化内容
- **動作確認計画**
  - TypeScriptエラーチェック手順
  - 開発サーバー起動確認手順
  - ビルド成功確認手順
  - 各段階でのチェックポイント

### 4. リスク評価とエラー対策
- 既存機能への影響度評価
- TypeScriptエラー発生リスクと対策
- import文更新漏れの検出方法
- ロールバック方法の明確化

## アウトプット
- `.claude/tmp/01-03_phase2_plan.md` に詳細な実行計画を記録

## 制約
- **ファイルの移動・変更は一切行わない**
- **読み取り専用の分析・計画立案のみ**
- **設定ファイルの変更も行わない**
- **作業途中で問題が発生した場合は即座に報告**
- **既存ファイルのコメントアウトは残す**