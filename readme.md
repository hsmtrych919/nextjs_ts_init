# NextJS TypeScript スターターテンプレート
ssg（静的html）サイト用プリセット

## 技術構成
- **Next.js 15** (Pages Router)
- **TypeScript 5.8** 各ファイルを.ts, .tsxに拡張子変更
- **SCSS + Tailwind CSS v4**（`@tailwindcss/postcss` 経由）(GSAP, React Modal対応)
- **eslint, prettier, stylelint** 設定済み

## 主要機能 - 更新:2026-03-28

### レイアウトシステム
- `src/components/layout/layout.tsx` - メインレイアウト（機能初期化を含む）
- `src/components/layout/header.tsx` - ヘッダー（ロゴ部分は「logo.png」を参照）
- `src/components/layout/footer.tsx` - フッター（「ダミーテキストです。」を含む）

### UI要素コンポーネント
- `src/components/ui/ButtonDemo.tsx` - ボタンデモ
- `src/components/ui/ModalDemo.tsx` - モーダルデモ（React Modal統合）
- `src/components/ui/ModalPhoto.tsx` - 写真モーダル
- `src/components/ui/ModalFooter.tsx` - フッターモーダル
- `src/components/ui/GridDemo.tsx` - グリッドシステムデモ（Tailwind レイアウト）
- `src/components/ui/GridPhoto.tsx` - 写真グリッド
- `src/components/ui/TabDemo.tsx` - タブデモ
- `src/components/ui/TableDemo.tsx` - テーブルデモ
- `src/components/ui/ToggleDemo.tsx` - トグルデモ（GSAP連携）
- `src/components/ui/VideoPlayer.tsx` - 動画プレイヤー

### 機能モジュール
- `src/lib/hooks/useToggleContent.ts` - GSAPを使用したトグルアニメーション（カスタムフック）
- `src/lib/hooks/useInView.ts` - IntersectionObserver hook
- `src/lib/hooks/useTabSwitch.ts` - タブ切り替えフック
- `src/lib/hooks/useTableScroll.ts` - テーブルスクロールフック
- `src/lib/utils/smoothScroll.ts` - スムーズスクロール機能
- `src/lib/utils/rewritePath.tsx` - 環境間でのパス管理ユーティリティ
- `src/lib/utils/linkIgnore.ts` - リンク無効化機能



# メモ

## 背景画像のパス
background-image: url(../../../public/img/bgi_cloth01.png);
../はローカルの階層に合わせる
これでビルド時にbgiが _next/static/media/内に生成されてurlも修正してくれる
* 利用していないクラスの場合はビルド時エラーとなるので注意



