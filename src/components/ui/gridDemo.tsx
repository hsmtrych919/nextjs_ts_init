import React from 'react';

/**
 * GridDemo: グリッドシステムデモコンポーネント
 *
 * Tailwind CSS ユーティリティクラスを使用したレスポンシブレイアウトシステムのデモです。
 * フレーミング・余白・コンテンツの3層構造によるクリーンなレイアウト設計を実演します。
 *
 * ## 基本構造パターン
 *
 * ### パターン1: 標準カラムレイアウト
 * ```jsx
 * <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">
 *   <div className="w-full lg:w-8/12">
 *     <div style={{...}}>コンテンツ</div>  // 3層目: コンテンツ
 *   </div>                                 // 2層目: カラム幅定義
 * </div>                                   // 1層目: コンテナ・余白
 * ```
 *
 * ### パターン2: ブロックグリッドレイアウト
 * ```jsx
 * <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter">
 *   <li>
 *     <div style={{...}}>コンテンツ</div>  // 3層目: コンテンツ
 *   </li>                                // 2層目: グリッドアイテム
 * </ul>                                  // 1層目: グリッドコンテナ
 * ```
 *
 * ## 設計思想
 * - **1層目**: フレーミング（container-width, grid）と余白システム（px-gutter-row等）
 * - **2層目**: カラム幅定義（w-{n}/12, md:w-{n}/12）またはグリッドアイテム（li, grow basis-0）
 * - **3層目**: 実際のコンテンツ（背景色、パディング、テキストなど）
 *
 * ## 重要なポイント
 * - グリッド構造とコンテンツを分離することで保守性向上
 * - 余白システムは1層目で制御、2層目では幅のみ定義
 * - 背景色・装飾は必ず3層目で実装（構造の混在を防ぐ）
 * - レスポンシブ対応は2層目のクラスで制御
 *
 * ## 主要クラス
 * - `container-width mx-auto flex flex-wrap px-gutter-row xl:px-0`: レスポンシブコンテナ
 * - `w-{n}/12`, `md:w-{n}/12`: ブレークポイント別幅指定
 * - `grid grid-cols-*`, `md:grid-cols-*`: ブロックグリッド
 * - `px-gutter-row`, `sm:pl-gutter-2`, `md:pl-gutter-3`: ガター（余白制御）
 *
 * @example
 * // 基本的な2カラムレイアウト
 * <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">
 *   <div className="w-full lg:w-8/12">
 *     <article>メインコンテンツ</article>
 *   </div>
 *   <div className="w-full lg:w-4/12">
 *     <aside>サイドバー</aside>
 *   </div>
 * </div>
 *
 * @example
 * // カードグリッドレイアウト
 * <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-grid-gutter">
 *   <li><div className="card">カード1</div></li>
 *   <li><div className="card">カード2</div></li>
 *   <li><div className="card">カード3</div></li>
 * </ul>
 *
 * @remarks
 * - CSS変数（--gutter, --gutter-row）+ Tailwind ユーティリティベースの余白制御
 * - モバイルファースト設計
 * - CSS Grid + Flexbox ハイブリッドの実装
 */
const GridDemo: React.FC = () => {
  return (
    <div>
      <h2>Grid System Demo</h2>

      {/* Container デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Container System</h3>
        <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0" >
          <div className="w-full" style={{ background: '#ddd', padding: '0.5rem' }}>
            container-width - レスポンシブコンテナ（Tailwind版）
          </div>
        </div>
      </section>


      {/* Responsive Columns デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Responsive Columns</h3>
        <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">
          <div className="w-full sm:w-6/12 lg:w-4/12" >
            <div style={{ background: '#ffe6f3', padding: '0.5rem' }}>
              w-full sm:w-6/12 lg:w-4/12（Tailwind版）
              <br />
              <small>Mobile: 12/12, Tablet: 6/12, Desktop: 4/12</small>
            </div>
          </div>
          <div className="w-full sm:w-6/12 lg:w-4/12" >
            <div style={{ background: '#f3e6ff', padding: '0.5rem' }}>
              w-full sm:w-6/12 lg:w-4/12（Tailwind版）
              <br />
              <small>Mobile: 12/12, Tablet: 6/12, Desktop: 4/12</small>
            </div>
          </div>
          <div className="w-full lg:w-4/12" >
            <div style={{ background: '#e6f3ff', padding: '0.5rem' }}>
              w-full lg:w-4/12（Tailwind版）
              <br />
              <small>Mobile: 12/12, Tablet: 12/12, Desktop: 4/12</small>
            </div>
          </div>
        </div>
      </section>

      {/* Mixed Layout デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Mixed Layout Example</h3>
        <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">
          <div className="w-full lg:w-8/12 md:pr-gutter-3" >
            <div style={{ background: '#e8f5e8', height: '100%' }}>
              <h4>Main Content Area（Tailwind版）</h4>
              <p>メインコンテンツエリア。デスクトップでは8/12の幅、モバイルでは全幅で表示されます。</p>
            </div>
          </div>
          <div className="w-full lg:w-4/12" >
            <div style={{ background: '#e3f2fd' }}>
              <h4>Sidebar（Tailwind版）</h4>
              <p>サイドバーエリア。デスクトップでは4/12の幅、モバイルでは全幅で表示されます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auto Columns デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Auto Columns</h3>
        <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">
          <div className="grow basis-0" >
            <div style={{ background: '#ffe6e6', height: '100%' }}>grow basis-0 自動幅（Tailwind版）</div>
          </div>
          <div className="w-5/12 sm:pl-gutter-2 md:pl-gutter-3" >
            <div style={{ background: '#e6ffe6', height: '100%' }}>.col--5 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum excepturi corporis nostrum assumenda suscipit accusamus velit cumque atque facilis nesciunt quis aspernatur, quam id quos. Eos eaque saepe dolor repellendus.</div>
          </div>
          <div className="grow basis-0" >
            <div style={{ background: '#e6e6ff', height: '100%' }}>grow basis-0 自動幅 Lorem ipsum dolor sit amet（Tailwind版）</div>
          </div>
        </div>
      </section>


      {/* Responsive Block Grid デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Responsive Block Grid</h3>
        <div className="container-width mx-auto flex flex-wrap px-gutter-row xl:px-0">
  <div className="w-full" >
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-grid-gutter" style={{ rowGap: 'var(--gutter)' }}>
          <li >
            <p style={{ background: '#fff3e0', padding: '0.5rem' }}>Item A</p>
          </li>
          <li >
            <p style={{ background: '#f3e5f5', padding: '0.5rem' }}>Item B</p>
          </li>
          <li >
            <p style={{ background: '#e0f2f1', padding: '0.5rem' }}>Item C</p>
          </li>
          <li >
            <p style={{ background: '#fce4ec', padding: '0.5rem' }}>Item D</p>
          </li>
          <li >
            <p style={{ background: '#e8f5e8', padding: '0.5rem' }}>Item E</p>
          </li>
          <li >
            <p style={{ background: '#e3f2fd', padding: '0.5rem' }}>Item F</p>
          </li>
        </ul>
        <p><small>grid-cols-2 md:grid-cols-4 - Mobile: 2列, Desktop: 4列</small></p>
        </div>
        </div>
      </section>


    </div>
  );
};

export default GridDemo;
