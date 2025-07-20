import Layout from '@components/layout/layout';
import styles from '@styles/top.module.scss';

// ファイル下に meta情報用の getStaticProps記載

export default function Home() {
  return (
    <Layout>
      <main>

        <article className={`${styles.adv}`}>
          <div className="l-row--container c-gutter__row">
            <div className="c-col--12 c-col__lg--10 c-col__xl--7">
              <p>lorem</p>
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
