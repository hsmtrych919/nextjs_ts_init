
# NextJS TypeScript スターターテンプレート
ssg（静的html）サイト用プリセット

## 技術構成
- **Next.js 13.5** (App Router非使用)
- **TypeScript 5.8** 各ファイルを.ts, .tsxに拡張子変更
- **SCSS** (GSAP, React Modal対応)
- **eslint, prettier, stylelint** 設定済み

## 主要機能 - 更新:2025年7月21日

### レイアウトシステム
- `components/layout/layout.tsx` - メインレイアウト
- `components/layout/header.tsx` - ヘッダー（ロゴ部分は「logo.png」を参照）
- `components/layout/footer.tsx` - フッター（「ダミーテキストです。」を含む）

### UI要素コンポーネント
- `components/element/modal.tsx` - モーダルデモ（React Modal統合）
- `components/element/toggle.tsx` - トグルデモ（GSAP連携）
- `components/element/button.tsx` - ボタンコンポーネント

### 機能モジュール
- `features/modal-component.tsx` - モーダル機能
- `features/toggle-content.tsx` - GSAP アニメーション
- `features/useInView.tsx` - IntersectionObserver hook
- `features/smooth-scroll.tsx` - スムーススクロール
- `features/rewrite-path.tsx` - パス管理（デュアル環境対応）
- `features/link_ignore.tsx` - リンク無効化機能

## コマンド

### 開発・ビルド

- 開発サーバー起動
npm run dev

- 開発用ビルド（prefixPath無し）
npm run build

- ビルド後の確認用サーバー
npm run serve

- 本番用ビルド（prefixPath付き）
npm run build:deploy"

- 画像最適化
npm run imgmin

- ESLint修正
npm run eslint


## 環境別の動作

### 開発時・ビルドチェック時
- `npm run build` + `npm run serve`
- `prefixPath = ''` で動作
- ローカル環境での動作確認が可能

### 本番デプロイ時
- `npm run build:prod`
- サブディレクトリ配置対応 のため `prefixPath = 'https://xxx.com'` で動作

## ディレクトリ構成
```
├── components/          # Reactコンポーネント
│   ├── element/        # 汎用UI要素
│   ├── layout/         # レイアウト
│   └── page/           # ページ固有
├── features/           # 機能別ロジック
├── pages/              # Next.jsページ
├── styles/             # SCSS
└── _dist/              # ビルド出力
```

## 技術デモページ
- `/snippet`: Modal, Toggle, InView機能のデモ





# セットアップ時


## lintあり。ドットファイルにして利用
.eslintrc.js
.prettierrc.js
.stylelintrc.js


## ページファイル作成
ファイルはpage/内に"ディレクトリ名.js"で作成。
ビルド時に"ディレクトリ/"でアクセスできる
設定は "next.config.js"の
trailingSlash: true,


## es5 トランスパイル
念のため"browserslist"に "supports es5"


## ファイルのパス src / href
静的エクスポートで コンポーネント化したパーツ内の'./'もしくは'../'を出し分けるのはできなそう。
絶対パス指定で対応。

アップ先のurlを next.config.js で指定
楽天goldキャッシュによる反映の遅延あるようなので 画像srcに ?${Date.now()} つけて対策
css,jsはビルド時にファイル名が変わるのでいったんパス


## 背景画像のパス
background-image: url(../../../public/img/bgi_cloth01.png);
../はローカルの階層に合わせる
これでビルド時にbgiが _next/static/media/内に生成されてurlも修正してくれる
* 利用していないクラスの場合はビルド時エラーとなるので注意




## ブラウザリスト
*制作時*
  "browserslist": [
    "last 2 versions",
  ],

*本番用*
  "browserslist": [
    "supports es5",
    "> 2% in JP",
    "ios >= 15",
    "not dead"
  ],



# claudecode同時開発のための Next.js スタートファイル準備

## Claude Code プロンプトファイル運用ガイド

**注意事項**
各フェーズ（プロンプト）完了後、生成されたレポートを確認してから次へ進む
重要な変更前に必ずGitコミットを実行
不明な点があれば作業を中断してレポートを確認

### ファイル構成
.claude/
├── prompts/
│   ├── 00_init-project-context.md    # プロジェクト初期化・文脈確認
│   ├── 01_project-structure.md       # 実行したいプロンプトファイル例
│   └── ...
│   └── ...
│   └── ...
└── tmp/
└── (Claude Codeが生成する作業内容報告や分析結果などの一時ファイル)
└── settings.json （claude codeが実行可能なコマンドに関するパーミッションを設定）


### 実行手順

*基本的な実行順序*
Execute instructions in .claude/prompts/プロンプト.md

- プロジェクト初期化（毎回実行）
Execute instructions in .claude/prompts/00_init-project-context.md

### 言語使い分け

実行コマンド: 英語推奨（パフォーマンス最適化）
ファイル内容: 日本語（仕様の正確性重視）



