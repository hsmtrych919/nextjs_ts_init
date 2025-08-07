import Layout from '@/components/layout/layout';
import ModalDemo from '@/components/ui/ModalDemo';
import ToggleDemo from '@/components/ui/ToggleDemo';
import TabDemo from '@/components/ui/TabDemo';
import TableDemo from '@/components/ui/TableDemo';
import { ButtonType01, ButtonType02 } from '@/components/ui/ButtonDemo';
import GridDemo from '@/components/ui/GridDemo';
import { useInView } from '@/lib/hooks/useInView';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';

// ファイル下に meta情報用の getStaticProps記載

export default function PageDemo() {
  // useInViewを実行（`.inview__fadein`クラスを持つ要素を監視）
  useInView();

  return (
    <Layout>
      <article className="mt-12">

        {/* グリッドデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>グリッドデモ</h2>
          <p>_grid.scss のグローバルクラスを使用したレイアウトシステムのデモ</p>
          <GridDemo />
        </section>

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
          <ModalDemo />
        </section>

        {/* トグルデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>トグルデモ</h2>
          <ToggleDemo />
        </section>

        {/* タブデモ */}
        <section style={{ marginBottom: '40px' }}>
          <h2>タブデモ</h2>
          <TabDemo />
        </section>

        {/* テーブルデモ */}
        <section style={{ marginBottom: '40px' }}>
          <div className={`${gridStyles['row--container']} ${gutterStyles.container}`}>
            <div className={`${gridStyles['col--12']} ${gridStyles['col--md-10']} ${gridStyles['col--xl-10']}`}>

          <h2>テーブルデモ</h2>
          <p>横スクロール対応テーブル（scroll-hint + シャドウ機能付き）</p>
          <TableDemo />
          </div>
          </div>
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
