ssg（静的html）サイト用プリセット

# コマンド
開発中 npm run dev
ビルド npm run build
* バージョンアップにより " next export" は不要
ローカルサーバー npm run serve

liveserverディレクトリにあるが、vscodeのliveserverは不使用


# lintあり。ドットファイルにして利用
.eslintrc.js
.prettierrc.js
.stylelintrc.js

# 公開フォルダ : dist


# ページファイル作成
ファイルはpage/内に"ディレクトリ名.js"で作成。
ビルド時に"ディレクトリ/"でアクセスできる
設定は "next.config.js"の
trailingSlash: true,


# es5 トランスパイル
念のため"browserslist"に "supports es5"


# ファイルのパス src / href
静的エクスポートで コンポーネント化したパーツ内の'./'もしくは'../'を出し分けるのはできなそう。
絶対パス指定で対応。

アップ先のurlを next.config.js で指定
楽天goldキャッシュによる反映の遅延あるようなので 画像srcに ?${Date.now()} つけて対策
css,jsはビルド時にファイル名が変わるのでいったんパス


# 背景画像のパス
background-image: url(../../../public/img/bgi_cloth01.png);
../はローカルの階層に合わせる
これでビルド時にbgiが _next/static/media/内に生成されてurlも修正してくれる
* 利用していないクラスの場合はビルド時エラーとなるので注意




# 制作時ブラウザリスト
  "browserslist": [
    "last 2 versions",
  ],

# 本番用ブラウザリスト
  "browserslist": [
    "supports es5",
    "> 2% in JP",
    "ios >= 15",
    "not dead"
  ],


# typescript

npm i typescript @types/react @typescript-eslint/eslint-plugin @typescript-eslint/parser 追加


npm install --save-dev @types/node @types/node

tsconfig.json 作成してから npm run dev ファイルに設定が記述される

各ファイルを.ts, .tsxに拡張子変更




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



