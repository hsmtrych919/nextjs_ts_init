import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../setup/test-utils';
import VideoSection from '@/components/ui/VideoSection';
import { mockGalleryData, mockCategoryWithVideo, mockCategoryWithoutVideo } from '../../setup/mocks/galleryData.mock';
import { mockVideoLoadSuccess, mockVideoLoadError } from '../../setup/mocks/mediaFiles.mock';

// videoPath.tsxのモック
jest.mock('@/lib/utils/videoPath', () => ({
  hasVideoInCategory: jest.fn(),
  getVideoConfigFromGalleryData: jest.fn(),
  getVideoSrc: jest.fn((src: string) => `/img/${src}?v=1234567890`),
  getVideoThumbnailSrc: jest.fn((src: string) => `/img/${src}?v=1234567890`),
}));

import { hasVideoInCategory, getVideoConfigFromGalleryData } from '@/lib/utils/videoPath';

const mockHasVideoInCategory = hasVideoInCategory as jest.MockedFunction<typeof hasVideoInCategory>;
const mockGetVideoConfigFromGalleryData = getVideoConfigFromGalleryData as jest.MockedFunction<typeof getVideoConfigFromGalleryData>;

describe('VideoSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('動画が存在する場合', () => {
    beforeEach(() => {
      mockHasVideoInCategory.mockReturnValue(true);
      mockGetVideoConfigFromGalleryData.mockReturnValue(mockCategoryWithVideo.video!);
    });

    it('動画要素が正しく表示される', () => {
      render(
        <VideoSection 
          activeTab="exterior" 
          galleryData={mockGalleryData} 
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('controls');
      expect(video.muted).toBe(true);
      expect(video).toHaveAttribute('playsInline');
    });

    it('動画のsrc属性が正しく設定される', () => {
      render(
        <VideoSection 
          activeTab="exterior" 
          galleryData={mockGalleryData} 
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video.src).toContain('video.mp4');
      expect(video.src).toContain('?v=');
    });

    it('ポスター画像が正しく設定される', () => {
      render(
        <VideoSection 
          activeTab="exterior" 
          galleryData={mockGalleryData} 
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video.poster).toContain('video-thumbnail.jpg');
      expect(video.poster).toContain('?v=');
    });

    it('レスポンシブクラスが適用される', () => {
      render(
        <VideoSection 
          activeTab="exterior" 
          galleryData={mockGalleryData} 
        />
      );

      const container = screen.getByTestId('video-player').closest('.embed-responsive');
      expect(container).toHaveClass('embed-responsive');
      expect(container).toHaveClass('embed-responsive-16by9');
    });

    it('動画エラー時にコンソール警告が出力される', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      render(
        <VideoSection 
          activeTab="exterior" 
          galleryData={mockGalleryData} 
        />
      );

      const video = screen.getByTestId('video-player');
      fireEvent.error(video);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('動画の読み込みに失敗しました:', 'video.mp4');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('動画が存在しない場合', () => {
    beforeEach(() => {
      mockHasVideoInCategory.mockReturnValue(false);
      mockGetVideoConfigFromGalleryData.mockReturnValue(null);
    });

    it('何も表示されない（null を返す）', () => {
      const { container } = render(
        <VideoSection 
          activeTab="interior" 
          galleryData={mockGalleryData} 
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('DOM要素が出力されない', () => {
      render(
        <VideoSection 
          activeTab="interior" 
          galleryData={mockGalleryData} 
        />
      );

      expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();
      expect(screen.queryByText('お使いのブラウザは動画の再生に対応していません。')).not.toBeInTheDocument();
    });
  });

  describe('タブ切り替え時の動作', () => {
    it('動画ありタブから動画なしタブに切り替え時、エラーが発生しない', () => {
      // 最初は動画ありタブ
      mockHasVideoInCategory.mockReturnValue(true);
      mockGetVideoConfigFromGalleryData.mockReturnValue(mockCategoryWithVideo.video!);

      const { rerender } = render(
        <VideoSection 
          activeTab="exterior" 
          galleryData={mockGalleryData} 
        />
      );

      expect(screen.getByTestId('video-player')).toBeInTheDocument();

      // 動画なしタブに切り替え
      mockHasVideoInCategory.mockReturnValue(false);
      mockGetVideoConfigFromGalleryData.mockReturnValue(null);

      expect(() => {
        rerender(
          <VideoSection 
            activeTab="interior" 
            galleryData={mockGalleryData} 
          />
        );
      }).not.toThrow();

      expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();
    });
  });

  describe('プリロード設定', () => {
    beforeEach(() => {
      mockHasVideoInCategory.mockReturnValue(true);
      mockGetVideoConfigFromGalleryData.mockReturnValue(mockCategoryWithVideo.video!);
    });

    it('preload="metadata"が設定されている', () => {
      render(
        <VideoSection 
          activeTab="exterior" 
          galleryData={mockGalleryData} 
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toHaveAttribute('preload', 'metadata');
    });

    it('muted属性が設定されている（自動再生対応）', () => {
      render(
        <VideoSection 
          activeTab="exterior" 
          galleryData={mockGalleryData} 
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video.muted).toBe(true);
    });
  });
});