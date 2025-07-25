import React, { ReactNode } from 'react';
import getConfig from 'next/config';
import Link from 'next/link';


const { publicRuntimeConfig } = getConfig();
const basePath = (publicRuntimeConfig && publicRuntimeConfig.basePath) || '';

type ImgPathProps = {
  src?: string ;
  alt?: string ;
};

/**
 * ImgPath: 画像パス書き換えコンポーネント
 *
 * Next.jsのbasePath設定に対応した画像表示コンポーネントです。
 * キャッシュバスティング機能付きで、デプロイ環境での画像更新問題を解決します。
 *
 * - basePath自動適用
 * - キャッシュバスティング（Date.now()）
 * - 標準的なimg要素として動作
 *
 * @param src 画像ファイル名（/img/以下の相対パス）
 * @param alt 画像の代替テキスト
 *
 * @example
 * // 基本的な使用例
 * <ImgPath src="logo.png" alt="ロゴ" />
 *
 * @example
 * // フォルダ階層がある場合
 * <ImgPath src="icons/user.svg" alt="ユーザーアイコン" />
 *
 * @example
 * // 動的な画像切り替え
 * const imageName = isActive ? 'active.png' : 'inactive.png';
 * <ImgPath src={imageName} alt="状態アイコン" />
 *
 * @remarks
 * - next/configのpublicRuntimeConfigが必要です
 * - 画像は/publicディレクトリの/img/以下に配置
 * - キャッシュバスティングによりビルド後も画像更新が反映されます
 */
export function ImgPath({ src= '', alt= '' }: ImgPathProps) {
  return <img src={`${basePath}/img/${src}?${Date.now()}`} alt={alt} />;
}

type LinkPathProps = {
  link?: string;
  as?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * LinkPath: 内部リンクパス書き換えコンポーネント
 *
 * Next.jsのbasePath設定に対応した内部リンクコンポーネントです。
 * Next.js Linkコンポーネントをラップしてパス書き換えを自動化します。
 *
 * - basePath自動適用
 * - Next.js Linkの全機能を継承
 * - className、children対応
 *
 * @param link リンク先のパス（href相当）
 * @param as 表示用のパス（as相当、通常はlinkと同じ値）
 * @param className CSSクラス名
 * @param children リンク内に表示する要素
 *
 * @example
 * // 基本的な使用例
 * <LinkPath link="/about" as="/about">
 *   <span>会社概要</span>
 * </LinkPath>
 *
 * @example
 * // ボタン風リンク
 * <LinkPath link="/contact" as="/contact" className="btn btn-primary">
 *   お問い合わせ
 * </LinkPath>
 *
 * @example
 * // 画像付きリンク
 * <LinkPath link="/products" as="/products" className="product-link">
 *   <ImgPath src="product-thumb.jpg" alt="商品" />
 *   <span>商品一覧</span>
 * </LinkPath>
 *
 * @remarks
 * - next/linkとnext/configが必要です
 * - 外部リンクには使用しないでください（通常のaタグを使用）
 * - basePath設定がない場合は通常のNext.js Linkとして動作
 */
export function LinkPath({ link = '', as, className, children }: LinkPathProps) {
  return (
    <Link href={link} as={`${basePath}${as}`} className={className}>
      {children}
    </Link>
  );
}

