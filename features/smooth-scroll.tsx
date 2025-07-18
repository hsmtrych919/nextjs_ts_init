import smoothScroll from 'smooth-scroll/dist/smooth-scroll.min';

export function smooth_scroll() {
  // if (typeof window !== 'undefined') {
  let options = {
    speed: 150,
    easing: 'easeOutCubic',
    offset: 0
    // offset: 50
    // offset: function () { return (window.innerWidth > 896) ? 0 : 50; },
  };
  new smoothScroll('a[href*="#"]', options);
// }
}
