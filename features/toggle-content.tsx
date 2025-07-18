import { useEffect } from 'react';
import anime from 'animejs';

function updateToggleText(index, currentHeight, nodeTitle) {
  const toggleText = nodeTitle[index].parentElement.querySelector('.js-toggle-message');
  if (toggleText) {
    toggleText.textContent = currentHeight === '200px' ? '閉じる' : '続きを読む';
  }
}

export function useToggleContent(elemWrap, elemTitle, elemContent) {
  useEffect(() => {
    const nodeTitle = document.querySelectorAll(elemTitle);
    const nodeContent = document.querySelectorAll(elemContent);
    let contentHeight = [];
    const ms = 300;
    const initialHeight = '200px'; // 開始時の高さ

    const updateContentHeight = () => {
      contentHeight = [];
      nodeContent.forEach((node) => {
        contentHeight.push(node.scrollHeight);
        node.style.overflow = 'hidden';
        node.style.height = initialHeight;
      });
    };

    updateContentHeight();

    const toggleState = Array.from({ length: nodeTitle.length }).fill({
      isOpen: false,
      isAnimating: false,
    });

    const toggleControl = (index) => {
      if (toggleState[index].isAnimating) return;

      const currentToggleState = toggleState[index];
      const toggleWrap = nodeTitle[index].closest(elemWrap);

      // console.log('toggleWrap before toggle:', toggleWrap);

      if (toggleWrap) {
        toggleWrap.classList.toggle('js-active', !currentToggleState.isOpen);
      }

      // console.log('toggleWrap after toggle:', toggleWrap);

      toggleState[index] = {
        ...currentToggleState,
        isOpen: !currentToggleState.isOpen,
        isAnimating: true,
      };

      const currentHeight = nodeContent[index].style.height;
      const targetHeight = currentHeight === initialHeight ? `${contentHeight[index]}px` : initialHeight;

      const tl = anime.timeline({
        complete: function () {
          toggleState[index] = {
            ...toggleState[index],
            isAnimating: false,
          };
          updateToggleText(index, currentHeight, nodeTitle);
        },
      });

      tl.add({
        targets: nodeContent[index],
        height: targetHeight,
        duration: ms,
        easing: 'easeOutCirc',
      });
    };

    const handleToggleControl = (event) => {
      const index = event.currentTarget.index;
      toggleControl(index);
    };

    // イベントリスナーの追加
    for (let i = 0; i < nodeTitle.length; i++) {
      nodeTitle[i].index = i;
      nodeTitle[i].addEventListener('mousedown', handleToggleControl);
    }

    // ウィンドウのリサイズイベントを監視し、リサイズが発生した際にcontentHeightを更新
    window.addEventListener('resize', updateContentHeight);

    // クリーンアップ時のイベントリスナーの削除
    return () => {
      for (let i = 0; i < nodeTitle.length; i++) {
        nodeTitle[i].removeEventListener('mousedown', handleToggleControl);
      }
      // ウィンドウがアンマウントされる際にリサイズイベントのリスナーも削除
      window.removeEventListener('resize', updateContentHeight);
    };
  }, [elemWrap, elemTitle, elemContent]);
}
