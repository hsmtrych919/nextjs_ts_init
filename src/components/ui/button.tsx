import React from 'react';
import { LinkPath } from '@/lib/utils/rewrite-path';
import styles from '@/styles/modules/button.module.scss';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface ButtonProps {
  type: string;
}

/**
 * ButtonType01: グラデーションボタンコンポーネント
 *
 * c-button__grdクラスを使用したグラデーションボタンです。
 *
 * @param type ボタンのタイプ（'primary' または 'secondary'）
 *
 * @example
 * <ButtonType01 type="primary" />
 */
export function ButtonType01({ type }: ButtonProps) {
  const linkPath = type === 'primary' ? '/primary' : '/secondary';

  return (
    <LinkPath link={linkPath} as={linkPath} className={`${styles.cButton} ${styles.cButtonGrd}`}>
      ボタンテキスト こちらへ
      <ChevronRightIcon className={styles.cButtonIconArrow} />
    </LinkPath>
  );
}

/**
 * ButtonType02: ボーダーボタンコンポーネント
 *
 * c-button__clr1--borderクラスを使用したボーダーボタンです。
 *
 * @param type ボタンのタイプ（'primary' または 'secondary'）
 *
 * @example
 * <ButtonType02 type="primary" />
 */
export function ButtonType02({ type }: ButtonProps) {
  const linkPath = type === 'primary' ? '/primary' : '/secondary';

  return (
    <LinkPath link={linkPath} as={linkPath} className={`${styles.cButton} ${styles.cButtonClr1Border}`}>
      ボタンテキスト こちらへ
      <ChevronRightIcon className={styles.cButtonIconArrow} />
    </LinkPath>
  );
}

// デフォルトエクスポートは ButtonType01 に変更
export default ButtonType01;
