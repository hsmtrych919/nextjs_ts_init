import styles from '@/styles/modules/header.module.scss';
import {ImgPath} from '@/lib/utils/rewritePath';

export default function Header() {
  return (
    <>
      <header className={styles.outer}>
        <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0 justify-start items-center">
          <h1 className={styles.logo}>
            <ImgPath src="logo.png" alt=""/>
          </h1>
        </div>
      </header>
    </>
  );
}