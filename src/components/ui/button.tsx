import React from 'react';
import { LinkPath } from '@/lib/utils/rewrite-path';
import styles from '@/styles/modules/button.module.scss';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface ButtonProps {
  type: string;
}


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
