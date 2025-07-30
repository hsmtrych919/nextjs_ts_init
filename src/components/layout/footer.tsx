import styles from '@/styles/modules/footer.module.scss';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';


export default function Footer() {

  const currentTime = new Date();
  const year = currentTime.getFullYear();

  return (
    <>
      <footer className={`${styles.outer}`}>
        <ul className={`${gridStyles['row--container']} ${gutterStyles.container} ${styles.navi_list}`}>
          <li><a className={styles.navi_button} href="#">ダミーテキストです。</a></li>
        </ul>
        <p className={styles.copy}>&copy; {year} ダミーテキストです。</p>
      </footer>
    </>
  );
}