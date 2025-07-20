import styles from '@styles/header.module.scss';
import {ImgPath} from '@features/rewrite-path';

export default function Header() {
  return (
    <>
      <header className={styles.outer}>
        <div className="l-row--container c-gutter__row jc__start ai__center">
          <h1 className={styles.logo}>
            <ImgPath src="logo.png" alt=""/>
          </h1>
        </div>
      </header>
    </>
  );
}