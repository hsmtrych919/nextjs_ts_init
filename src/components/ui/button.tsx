import React from 'react';
import { LinkPath } from '@/lib/utils/rewrite-path';
import styles from '@/styles/modules/button.module.scss';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface ButtonProps {
  type: string;
}

/**
 * ButtonMovetoType: タイプ別リンクボタンコンポーネント
 *
 * primary/secondaryタイプに応じて表示内容とリンク先を自動切り替えするボタンコンポーネントです。
 * LinkPathとImgPathを組み合わせて、画像付きのナビゲーションボタンを提供します。
 *
 * - タイプ別の自動切り替え（テキスト、画像、リンク先）
 * - LinkPathによる適切なルーティング
 * - ChevronRightIconによる視覚的誘導
 *
 * @param type ボタンのタイプ（'primary' または 'secondary'）
 *
 * @example
 * <ButtonMovetoType type="primary" />
 *
 * @remarks
 * - @heroicons/react/24/outlineが必要です
 * - button.module.scssスタイルを使用
 * - LinkPath、ImgPathコンポーネントと連携
 * - 画像ファイル（entry_primary.png, entry_secondary.png）が必要
 */
export default function ButtonMovetoType({ type }: ButtonProps) {
  // const categoryText = type === 'primary' ? 'プライマリカテゴリ' : 'セカンダリカテゴリ';
  const linkPath = type === 'primary' ? '/primary' : '/secondary';


  return (
    <LinkPath link={linkPath} as={linkPath} className="">
      <div className={styles.moveto_type_frame}>
        <p>こちらへ</p><ChevronRightIcon className={styles.moveto_type_icon} />
      </div>
    </LinkPath>
  );
}
