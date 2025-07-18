
export function link_ignore() {
  const ignoreLinks = document.querySelectorAll('a.ignore');

  ignoreLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // デフォルトのアクションを無効にする
    });
  });
}
