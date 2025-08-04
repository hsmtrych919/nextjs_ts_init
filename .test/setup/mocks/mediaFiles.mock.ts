// メディアファイルのモック設定

// 動画ファイルの存在状態をモック
export const mockVideoExists = jest.fn().mockReturnValue(true);
export const mockVideoNotExists = jest.fn().mockReturnValue(false);

// HTMLVideoElementのイベントモック
export const mockVideoLoadSuccess = () => {
  const video = document.createElement('video');
  Object.defineProperty(video, 'load', {
    value: jest.fn(() => {
      // loadイベントを発火
      const event = new Event('loadedmetadata');
      video.dispatchEvent(event);
    }),
  });
  return video;
};

export const mockVideoLoadError = () => {
  const video = document.createElement('video');
  Object.defineProperty(video, 'load', {
    value: jest.fn(() => {
      // errorイベントを発火
      const event = new Event('error');
      video.dispatchEvent(event);
    }),
  });
  return video;
};

// 画像ファイルの読み込みモック
export const mockImageLoad = (shouldSucceed = true) => {
  const originalImage = window.Image;
  
  window.Image = class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    
    constructor() {
      setTimeout(() => {
        if (shouldSucceed && this.onload) {
          this.onload();
        } else if (!shouldSucceed && this.onerror) {
          this.onerror();
        }
      }, 100);
    }
  } as any;
  
  return () => {
    window.Image = originalImage;
  };
};

// WebP サポート状態のモック
export const mockWebPSupported = jest.fn().mockReturnValue(true);
export const mockWebPNotSupported = jest.fn().mockReturnValue(false);

// ファイルパスのモック
export const mockFilePaths = {
  // 動画ファイル
  video: {
    src: '/img/video.mp4?v=1234567890',
    thumbnail: '/img/video-thumbnail.jpg?v=1234567890',
  },
  
  // 画像ファイル（WebP対応）
  image: {
    webp: '/img/exterior_thumb_01.webp?v=1234567890',
    fallback: '/img/exterior_thumb_01.jpg?v=1234567890',
  },
  
  // 存在しないファイル
  notFound: {
    video: '/img/notfound.mp4?v=1234567890',
    image: '/img/notfound.jpg?v=1234567890',
  },
};

// メディアクエリのモック
export const mockMediaQuery = (matches: boolean) => ({
  matches,
  media: '(max-width: 768px)',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// レスポンシブ表示のモック
export const mockMobileView = () => mockMediaQuery(true);
export const mockDesktopView = () => mockMediaQuery(false);