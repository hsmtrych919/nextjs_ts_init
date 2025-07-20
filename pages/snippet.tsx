import Layout from '@components/layout/layout';
import SimpleModalDemo from '@components/element/modal';
import SimpleToggleDemo from '@components/element/toggle';
import { useInView } from '@features/useInView';

// ファイル下に meta情報用の getStaticProps記載

export default function PageDemo() {
  // useInViewを実行（`.inview__fadein`クラスを持つ要素を監視）
  useInView();

  return (
    <Layout>
      <article className="mt__12">

        {/* モーダルデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>モーダルデモ</h2>
          <SimpleModalDemo />
        </section>

        {/* トグルデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>トグルデモ</h2>
          <SimpleToggleDemo />
        </section>

        {/* InViewデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>InViewデモ</h2>
          <p>スクロールして下の要素が表示されるときにフェードイン効果が適用されます</p>

          <div style={{ height: '100vh', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>スクロールして下を見てください ↓</p>
          </div>

          <div className="inview__fadein" style={{ padding: '40px', background: '#e0e0e0', opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s ease' }}>
            <h3>InView要素1</h3>
            <p>この要素は画面に入るとフェードインします</p>
          </div>

          <div style={{ height: '50vh' }}></div>

          <div className="inview__fadein" style={{ padding: '40px', background: '#d0d0d0', opacity: 0, transform: 'translateY(30px)', transition: 'all 0.8s ease' }}>
            <h3>InView要素2</h3>
            <p>この要素も画面に入るとフェードインします</p>
          </div>
        </section>

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
