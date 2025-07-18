import Layout from '@components/layout/layout';
import FoodSelect from '@components/page/use-modal';

// ファイル下に meta情報用の getStaticProps記載

export default function PageDogfood() {
  return (
    <Layout pageType='dog'>


      <div id="select"></div>
      <article className="bgcf mt__12">
        <FoodSelect type="dog" />
      </article>

    </Layout>
  );
}

export async function getStaticProps() {
  const pageMeta = {
    title: 'snippet page',
    ogUrl: 'demo/',
    description: 'lorem ipsum',
  };
  return {
    props: {
      pageMeta,
    },
  };
}
