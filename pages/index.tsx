import Layout from '@components/layout/layout';
import styles from '@styles/top.module.scss';
import {ImgPath} from '@features/rewrite-path';

// ファイル下に meta情報用の getStaticProps記載

export default function Home() {
  return (
    <Layout hasPbForCloth={true} >
      <main>

        <article className={`${styles.adv} mt__9`}>
          <div className="l-row--container c-gutter__row">
            <div className="c-col--12 c-col__lg--10 c-col__xl--7">
              <ul className={`l-grid c-grid--1 c-grid__sm--2 ${styles.adv_list}`}>

              </ul>
            </div>
          </div>
        </article>


      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const pageMeta = {
    description: '',
  };
  return {
    props: {
      pageMeta,
    },
  };
}
