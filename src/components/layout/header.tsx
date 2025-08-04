import styles from '@/styles/modules/header.module.scss';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';
import {ImgPath} from '@/lib/utils/rewritePath';
import galleryStyles from '@/styles/modules/gallery.module.scss';

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className={`${gridStyles['row--container']} ${gutterStyles.container}`}>
          <h1 className={styles.title}>写真ギャラリー</h1>
        </div>
      </header>
    </>
  );
}