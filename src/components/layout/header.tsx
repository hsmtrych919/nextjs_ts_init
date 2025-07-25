import styles from '@/styles/modules/header.module.scss';
import {ImgPath} from '@/lib/utils/rewritePath';

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