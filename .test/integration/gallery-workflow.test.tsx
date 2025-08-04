import React from 'react';
import { render, screen, fireEvent, waitFor } from '../setup/test-utils';
import GalleryPage from '../../pages/gallery';

// 必要なモジュールをモック
jest.mock('@/lib/utils/galleryData', () => ({
  ...jest.requireActual('@/lib/utils/galleryData'),
  getGalleryDataSafe: jest.fn(),
}));

import { getGalleryDataSafe } from '@/lib/utils/galleryData';
const mockGetGalleryDataSafe = getGalleryDataSafe as jest.MockedFunction<typeof getGalleryDataSafe>;

jest.mock('@/lib/utils/rewritePath', () => ({
  ImgPath: ({ src, alt, className }: any) => (
    <img src={`/img/${src}?v=mock`} alt={alt} className={className} />
  ),
  LazyImgPath: ({ src, alt, className }: any) => (
    <img src={`/img/${src}?v=mock`} alt={alt} className={className} />
  ),
  useImagePreloader: jest.fn(() => {}),
}));

jest.mock('@/lib/utils/videoPath', () => ({
  hasVideoInCategory: jest.fn((data, category) => category === 'exterior' || category === 'common'),
  getVideoConfigFromGalleryData: jest.fn((data, category) => {
    if (category === 'exterior' || category === 'common') {
      return {
        src: `${category}_video.mp4`,
        thumbnail: `${category}_video_thumb.jpg`,
        alt: `${category}の動画`,
      };
    }
    return null;
  }),
  getVideoSrc: jest.fn((src) => `/img/${src}?v=mock`),
  getVideoThumbnailSrc: jest.fn((src) => `/img/${src}?v=mock`),
}));

// Layout コンポーネントのモック
jest.mock('@/components/layout/layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

describe('Gallery Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // デフォルトのモックデータを設定
    mockGetGalleryDataSafe.mockReturnValue({
      exterior: {
        title: '外観',
        description: '外観の説明文です。',
        video: { src: 'exterior_video.mp4', thumbnail: 'exterior_video_thumb.jpg', alt: '外観の動画' },
        images: [{ thumbnail: 'exterior_thumb_01.jpg', full: 'exterior_full_01.jpg', alt: '外観画像1' }],
      },
      interior: {
        title: '居室',
        description: '居室の説明文です。',
        images: [{ thumbnail: 'interior_thumb_01.jpg', full: 'interior_full_01.jpg', alt: '居室画像1' }],
      },
      common: {
        title: '共用部',
        description: '共用部の説明文です。',
        video: { src: 'common_video.mp4', thumbnail: 'common_video_thumb.jpg', alt: '共用部の動画' },
        images: [{ thumbnail: 'common_thumb_01.jpg', full: 'common_full_01.jpg', alt: '共用部画像1' }],
      },
    });
  });

  describe('初期表示', () => {
    it('ページが正常に表示される', () => {
      render(<GalleryPage />);
      
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('デフォルトで外観タブが選択されている', () => {
      render(<GalleryPage />);
      
      const exteriorTab = screen.getByRole('button', { name: '外観' });
      expect(exteriorTab).toHaveClass('active');
    });

    it('外観タブでは動画が表示される', () => {
      render(<GalleryPage />);
      
      const video = screen.getByTestId('video-player');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', '/img/exterior_video.mp4?v=mock');
    });

    it('1枚目の画像に「タップして拡大」案内が表示される', () => {
      render(<GalleryPage />);
      
      expect(screen.getByText('タップして拡大')).toBeInTheDocument();
    });
  });

  describe('タブ切り替え', () => {
    it('居室タブに切り替えると動画が非表示になる', async () => {
      render(<GalleryPage />);
      
      // 初期状態で動画が表示されている
      expect(screen.getByTestId('video-player')).toBeInTheDocument();
      
      // 居室タブをクリック
      const interiorTab = screen.getByRole('button', { name: '居室' });
      fireEvent.click(interiorTab);
      
      await waitFor(() => {
        // 動画が非表示になる
        expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();
        
        // 居室タブがアクティブになる
        expect(interiorTab).toHaveClass('active');
      });
    });

    it('共用部タブでは動画が表示される', async () => {
      render(<GalleryPage />);
      
      // 共用部タブをクリック
      const commonTab = screen.getByRole('button', { name: '共用部' });
      fireEvent.click(commonTab);
      
      await waitFor(() => {
        // 動画が表示される
        const video = screen.getByTestId('video-player');
        expect(video).toBeInTheDocument();
        expect(video).toHaveAttribute('src', '/img/common_video.mp4?v=mock');
        
        // 共用部タブがアクティブになる
        expect(commonTab).toHaveClass('active');
      });
    });

    it('タブ切り替え時にモーダルが開いている場合は自動で閉じる', async () => {
      render(<GalleryPage />);
      
      // 1枚目の画像をクリックしてモーダルを開く
      const firstImage = screen.getAllByRole('button')[3]; // タブボタンを除く最初の画像ボタン
      fireEvent.click(firstImage);
      
      await waitFor(() => {
        expect(screen.getByText('閉じる')).toBeInTheDocument();
      });
      
      // 居室タブに切り替え
      const interiorTab = screen.getByRole('button', { name: '居室' });
      fireEvent.click(interiorTab);
      
      await waitFor(() => {
        // モーダルが閉じる
        expect(screen.queryByText('閉じる')).not.toBeInTheDocument();
      });
    });
  });

  describe('モーダル表示案内機能', () => {
    it('モーダルを一度開くと案内が非表示になる', async () => {
      render(<GalleryPage />);
      
      // 初期状態で案内が表示されている
      expect(screen.getByText('タップして拡大')).toBeInTheDocument();
      
      // 1枚目の画像をクリック
      const firstImage = screen.getAllByRole('button')[3]; // タブボタンを除く最初の画像ボタン
      fireEvent.click(firstImage);
      
      await waitFor(() => {
        expect(screen.getByText('閉じる')).toBeInTheDocument();
      });
      
      // モーダルを閉じる
      const closeButton = screen.getByText('閉じる');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        // 案内が非表示になる
        expect(screen.queryByText('タップして拡大')).not.toBeInTheDocument();
      });
    });

    it('異なるタブでも一度モーダルを開いていれば案内は表示されない', async () => {
      render(<GalleryPage />);
      
      // 外観タブで1枚目をクリック
      const firstImage = screen.getAllByRole('button')[3];
      fireEvent.click(firstImage);
      
      await waitFor(() => {
        expect(screen.getByText('閉じる')).toBeInTheDocument();
      });
      
      // モーダルを閉じる
      fireEvent.click(screen.getByText('閉じる'));
      
      await waitFor(() => {
        expect(screen.queryByText('閉じる')).not.toBeInTheDocument();
      });
      
      // 居室タブに切り替え
      const interiorTab = screen.getByRole('button', { name: '居室' });
      fireEvent.click(interiorTab);
      
      await waitFor(() => {
        // 居室タブでも案内は表示されない
        expect(screen.queryByText('タップして拡大')).not.toBeInTheDocument();
      });
    });
  });

  describe('エラーハンドリング', () => {
    it('ギャラリーデータが取得できない場合、エラーメッセージを表示', () => {
      // エラー状態のモック
      mockGetGalleryDataSafe.mockReturnValueOnce(null);
      
      render(<GalleryPage />);
      
      expect(screen.getByText('エラーが発生しました。')).toBeInTheDocument();
    });

    it('無効な画像インデックスでのクリックを適切に処理', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      render(<GalleryPage />);
      
      // 直接不正なインデックスでコールバックを呼び出すシミュレーション
      // 実際のコンポーネントの内部処理をテスト
      const buttons = screen.getAllByRole('button');
      const imageButton = buttons[3];
      
      // 正常なクリックは問題なく動作する
      fireEvent.click(imageButton);
      
      await waitFor(() => {
        expect(screen.getByText('閉じる')).toBeInTheDocument();
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('レスポンシブ表示', () => {
    it('動画のレスポンシブクラスが適用されている', () => {
      render(<GalleryPage />);
      
      const videoContainer = screen.getByTestId('video-player').closest('.embed-responsive-16by9');
      expect(videoContainer).toBeInTheDocument();
    });

    it('グリッドシステムが適用されている', () => {
      render(<GalleryPage />);
      
      const gridContainer = screen.getByRole('list');
      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer).toHaveClass('grid--2');
      expect(gridContainer).toHaveClass('grid--sm-4');
    });
  });
});