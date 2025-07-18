import {ImgPath, LinkPath} from '@features/rewrite-path';
import styles from '@styles/footer.module.scss';


export default function Footer({pageType}) {

  const currentTime = new Date();
  const year = currentTime.getFullYear();

  return (
    <>
      <footer className={`${styles.outer}`}>
        <ul className={`l-row--container c-gutter__row ${styles.navi_list}`}>
          <li><a className={styles.navi_button} href="https://www.rakuten.co.jp/">楽天市場トップへ</a></li>
        </ul>
        <p className={styles.copy}>&copy; {year} 株式会社ダイナ</p>
      </footer>

      {/* fixed */}
      { !pageType && (
        <div className={styles.fixed}>
          <ul className={styles.fixed_list}>
            <li>
              <LinkPath link="/dog" as="/dog" className={styles.fixed_entry_dog}>
              </LinkPath>
            </li>
            <li>
              <LinkPath link="/cat" as="/cat" className={styles.fixed_entry_cat}>
              </LinkPath>
            </li>
          </ul>
        </div>
      )}
      {pageType === 'dog' && (
        <div className={styles.fixed}>

        </div>
      )}
      {pageType === 'cat' && (
        <div className={styles.fixed}>

        </div>
      )}

    </>
  );
}