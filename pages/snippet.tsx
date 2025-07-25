import Layout from '@/components/layout/layout';
import SimpleModalDemo from '@/components/ui/modalDemo';
import SimpleToggleDemo from '@/components/ui/toggleDemo';
import SimpleTabDemo from '@/components/ui/tabDemo';
import { ButtonType01, ButtonType02 } from '@/components/ui/buttonDemo';
import { useInView } from '@/lib/hooks/useInView';

// ファイル下に meta情報用の getStaticProps記載

export default function PageDemo() {
  // useInViewを実行（`.inview__fadein`クラスを持つ要素を監視）
  useInView();

  return (
    <Layout>
      <article className="mt__12">

        {/* ボタンデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>ボタンデモ</h2>
          <p>グローバルSCSSクラス（c-button, c-button__grd, c-button__clr1--border）を使用したボタンサンプル</p>
          <div style={{ width: '360px', margin: '20px auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <ButtonType01 type="primary" />
            <ButtonType02 type="primary" />
          </div>
        </section>

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

        {/* タブデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>タブデモ</h2>
          <SimpleTabDemo />
        </section>

        {/* InViewデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>InViewデモ</h2>
          <p>スクロールして下の要素が表示されるときにフェードイン効果が適用されます</p>

          <div style={{ height: '100vh', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>スクロールして下を見てください ↓</p>
          </div>

          <div className="inview__fadein">
            <h3>InView要素1</h3>
            <p>この要素は画面に入るとフェードインします</p>
          </div>

          <div style={{ height: '50vh' }}></div>

          <div className="inview__fadein">
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
