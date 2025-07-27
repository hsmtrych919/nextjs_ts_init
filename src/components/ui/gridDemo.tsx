import React from 'react';

/**
 * Grid Demo Component
 * _grid.scss のグローバルクラスを使用したデモ
 */
const GridDemo: React.FC = () => {
  return (
    <div>
      <h2>Grid System Demo</h2>

      {/* Container デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Container System</h3>
        <div className="l-row--container c-gutter__row" >
          <div className="c-col--12" style={{ background: '#ddd', padding: '0.5rem' }}>
            .l-row--container - レスポンシブコンテナ
          </div>
        </div>
      </section>


      {/* Responsive Columns デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Responsive Columns</h3>
        <div className="l-row--container c-gutter__row">
          <div className="c-col--12 c-col__sm--6 c-col__lg--4" style={{ background: '#ffe6f3', padding: '0.5rem', marginBottom: '0.5rem' }}>
            .c-col--12 .c-col__sm--6 .c-col__lg--4
            <br />
            <small>Mobile: 12/12, Tablet: 6/12, Desktop: 4/12</small>
          </div>
          <div className="c-col--12 c-col__sm--6 c-col__lg--4" style={{ background: '#f3e6ff', padding: '0.5rem', marginBottom: '0.5rem' }}>
            .c-col--12 .c-col__sm--6 .c-col__lg--4
            <br />
            <small>Mobile: 12/12, Tablet: 6/12, Desktop: 4/12</small>
          </div>
          <div className="c-col--12 c-col__sm--12 c-col__lg--4" style={{ background: '#e6f3ff', padding: '0.5rem', marginBottom: '0.5rem' }}>
            .c-col--12 .c-col__sm--12 .c-col__lg--4
            <br />
            <small>Mobile: 12/12, Tablet: 12/12, Desktop: 4/12</small>
          </div>
        </div>
      </section>

      {/* Mixed Layout デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Mixed Layout Example</h3>
        <div className="l-row--container c-gutter__row">
          <div className="c-col--12 c-col__lg--8" style={{ background: '#e8f5e8', padding: '1rem', marginBottom: '0.5rem' }}>
            <h4>Main Content Area</h4>
            <p>メインコンテンツエリア。デスクトップでは8/12の幅、モバイルでは全幅で表示されます。</p>
          </div>
          <div className="c-col--12 c-col__lg--4" style={{ background: '#e3f2fd', padding: '1rem', marginBottom: '0.5rem' }}>
            <h4>Sidebar</h4>
            <p>サイドバーエリア。デスクトップでは4/12の幅、モバイルでは全幅で表示されます。</p>
          </div>
        </div>
      </section>

      {/* Auto Columns デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Auto Columns</h3>
        <div className="l-row--container c-gutter__row">
          <div className="c-col" style={{ background: '#ffe6e6', padding: '0.5rem', marginRight: '0.5rem' }}>
            .c-col 自動幅
          </div>
          <div className="c-col--5" style={{ background: '#e6ffe6', padding: '0.5rem', marginRight: '0.5rem' }}>
            .c-col--5 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum excepturi corporis nostrum assumenda suscipit accusamus velit cumque atque facilis nesciunt quis aspernatur, quam id quos. Eos eaque saepe dolor repellendus.
          </div>
          <div className="c-col" style={{ background: '#e6e6ff', padding: '0.5rem' }}>
            .c-col 自動幅 Lorem ipsum dolor sit amet
          </div>
        </div>
      </section>


      {/* Responsive Block Grid デモ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Responsive Block Grid</h3>
        <div className="l-row--container c-gutter__row">
  <div className="c-col--12 ">
        <ul className="l-grid c-grid--2 c-grid__md--4" style={{ rowGap: 'var(--gutter)' }}>
          <li >
            <p style={{ background: '#fff3e0', padding: '0.5rem', marginBottom: '0.5rem' }}>Item A</p>
          </li>
          <li >
            <p style={{ background: '#f3e5f5', padding: '0.5rem', marginBottom: '0.5rem' }}>Item B</p>
          </li>
          <li >
            <p style={{ background: '#e0f2f1', padding: '0.5rem', marginBottom: '0.5rem' }}>Item C</p>
          </li>
          <li >
            <p style={{ background: '#fce4ec', padding: '0.5rem', marginBottom: '0.5rem' }}>Item D</p>
          </li>
          <li >
            <p style={{ background: '#e8f5e8', padding: '0.5rem', marginBottom: '0.5rem' }}>Item E</p>
          </li>
          <li >
            <p style={{ background: '#e3f2fd', padding: '0.5rem', marginBottom: '0.5rem' }}>Item F</p>
          </li>
        </ul>
        <p><small>.c-grid--2 .c-grid__md--4 - Mobile: 2列, Desktop: 4列</small></p>
        </div>
        </div>
      </section>


    </div>
  );
};

export default GridDemo;
