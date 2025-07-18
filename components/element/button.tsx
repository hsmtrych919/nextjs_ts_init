import React from 'react';
import { ImgPath, LinkPath } from '@features/rewrite-path';
import styles from '@styles/button.module.scss';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface functionProps {
  type: string;
}


export default function ButtonMovetoType({ type }: functionProps) {
  const categoryText = type === 'dog' ? 'ドッグフード' : 'キャットフード';
  const illustImage = type === 'dog' ? 'illust_dgfd.png' : 'illust_ctfd.png';
  const entryImage = type === 'dog' ? 'btn/entry_dog.png' : 'btn/entry_cat.png';
  const linkPath = type === 'dog' ? '/dog' : '/cat';

  // let className = `${styles.to_series}`;
  // if (type === 'dog') {
  //   className += ` ${styles.to_series_dog}`;
  // } else if (type === 'cat') {
  //   className += ` ${styles.to_series_cat}`;
  // }

  return (
    <LinkPath link={linkPath} as={linkPath} className={`${styles.moveto_type} grd__${type}`}>
      <span className={styles.moveto_type_circle}>
        <ImgPath src={illustImage} alt={categoryText} />
      </span>

      <div className={styles.moveto_type_frame}>
        <div className={styles.moveto_type_title}>
          <p className={styles.moveto_type_category}>{categoryText}</p>

          <div className={styles.moveto_type_frame_arrow}>
            <p>こちらへ</p><ChevronRightIcon className={styles.moveto_type_icon} />
          </div>
        </div>
        <div className={styles.moveto_type_item}>
          <ImgPath src={entryImage} alt={categoryText} />
        </div>
      </div>
    </LinkPath>
  );
}
