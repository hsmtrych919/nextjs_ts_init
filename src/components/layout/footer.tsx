import styles from '@/styles/modules/footer.module.scss';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';


export default function Footer() {

  const currentTime = new Date();
  const year = currentTime.getFullYear();

  return (
    <>
        {/* ナビゲーション機能 */}
        <div className={`${gridStyles['row--container']} ${gutterStyles.container} ${styles['navigation--container']}`}>
          <div className={styles['navigation--columns']} >
            <a href="#" className={`${styles['navigation--button']}`}>お問い合わせ<br/>フォーム へ</a>

          </div>
          <div className={styles['navigation--columns']} >
            <a href="#" className={`${styles['navigation--button-even']}`}>施設選択</a>
          </div>
          <div className={styles['navigation--columns']} >
            <a href="#" className={`${styles['navigation--button']}`}>電話する</a>
          </div>
        </div>

      <footer className={`${styles.outer}`}>
        {/* <ul className={`${gridStyles['row--container']} ${gutterStyles.container} ${styles.navi_list}`}>
          <li><a className={styles.navi_button} href="#">ダミーテキストです。</a></li>
        </ul> */}
        <p className={`${styles.copy} fz-14 tac` }>&copy; {year} ダミーテキストです。</p>
      </footer>
    </>
  );
}