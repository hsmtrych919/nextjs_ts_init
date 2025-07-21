import { useEffect } from 'react';

const thresholds = {
  pc: 0.3, // PC用の閾値
  sp: 0.4 // SP用の閾値（必要に応じて変更可能）
};

export function useInView() {
  useEffect(() => {
    // SSR対策
    if (typeof window === 'undefined') return;

    // デバイスタイプの判定
    const isMobile = window.innerWidth <= 768; // ブレイクポイントは適宜調整
    const threshold = isMobile ? thresholds.sp : thresholds.pc;

    // 監視対象の要素を取得
    const targets = document.querySelectorAll('.inview__fadein');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 要素が表示範囲に入った時
          entry.target.classList.add('is-inview');
          // 一度表示されたら監視を解除
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: threshold,
      rootMargin: '10px' // 少し余裕を持たせる
    });

    // 各要素の監視を開始
    targets.forEach(target => {
      observer.observe(target);
    });

    // クリーンアップ
    return () => {
      targets.forEach(target => {
        observer.unobserve(target);
      });
    };
  }, []); // 依存配列は空（マウント時のみ実行）
}
