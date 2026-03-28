import Layout from '@/components/layout/layout';
import styles from '@/styles/modules/index.module.scss';

// ファイル下に meta情報用の getStaticProps記載

export default function Home() {
  return (
    <Layout>
      <main>

        <article className={`${styles.adv}`}>
          <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">
            <div className="w-full lg:w-10/12 xl:w-7/12">
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
