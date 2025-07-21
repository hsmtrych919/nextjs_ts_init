import styles from '@/styles/modules/footer.module.scss';


export default function Footer() {

  const currentTime = new Date();
  const year = currentTime.getFullYear();

  return (
    <>
      <footer className={`${styles.outer}`}>
        <ul className={`l-row--container c-gutter__row ${styles.navi_list}`}>
          <li><a className={styles.navi_button} href="#">ダミーテキストです。</a></li>
        </ul>
        <p className={styles.copy}>&copy; {year} ダミーテキストです。</p>
      </footer>
    </>
  );
}