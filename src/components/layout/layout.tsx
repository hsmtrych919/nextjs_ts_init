import { useEffect, ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { smooth_scroll } from '@/lib/utils/smoothScroll';
import { link_ignore } from '@/lib/utils/linkIgnore';

interface LayoutProps {
  children: ReactNode;
}

/**
 * LayoutBasic: 基本レイアウトコンポーネント
 *
 * ヘッダー、メインコンテンツ、フッターの標準的な3段構成レイアウトを提供します。
 * smooth_scrollとlink_ignoreユーティリティを自動初期化してユーザビリティを向上させます。
 *
 * - Header/Main/Footer構成
 * - smooth_scroll自動初期化
 * - link_ignore自動初期化
 *
 * @param children メインコンテンツ領域に表示する内容
 *
 * @example
 * // 基本的な使用例
 * <LayoutBasic>
 *   <h1>ページタイトル</h1>
 *   <p>ページコンテンツ</p>
 * </LayoutBasic>
 *
 * @remarks
 * - Header、Footerコンポーネントが必要です
 * - smooth-scroll、link_ignoreユーティリティが必要です
 * - useEffectで各ユーティリティを初期化します
 */
export default function LayoutBasic({ children }: LayoutProps) {

  useEffect(() => {
    smooth_scroll();
    link_ignore();
  });

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}