import {
  getVideoSrc,
  getVideoThumbnailSrc,
  getVideoConfigFromGalleryData,
  hasVideoInCategory
} from '@/lib/utils/videoPath';
import { mockGalleryData, mockCategoryWithVideo, mockCategoryWithoutVideo } from '../../setup/mocks/galleryData.mock';

// next/configのモック
jest.mock('next/config', () => ({
  __esModule: true,
  default: () => ({
    publicRuntimeConfig: {
      basePath: '/test-base',
    },
  }),
}));

// galleryDataのモック
jest.mock('@/lib/utils/galleryData', () => ({
  ...jest.requireActual('@/lib/utils/galleryData'),
  getCategoryVideo: jest.fn(),
}));

import { getCategoryVideo } from '@/lib/utils/galleryData';
const mockGetCategoryVideo = getCategoryVideo as jest.MockedFunction<typeof getCategoryVideo>;

describe('videoPath utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 環境変数をモック
    process.env.NODE_ENV = 'test';
    process.env.NEXT_PUBLIC_BUILD_HASH = 'test-hash-123';
    
    // デフォルトのモック設定をリセット
    mockGetCategoryVideo.mockReset();
  });

  describe('getVideoSrc', () => {
    it('basePath付きの動画URLを生成する', () => {
      const result = getVideoSrc('video.mp4');
      
      expect(result).toContain('/test-base/img/video.mp4');
      expect(result).toContain('?v=test-hash-123');
    });

    it('開発環境では動的なキャッシュパラメータを使用する', () => {
      process.env.NODE_ENV = 'development';
      
      const result = getVideoSrc('video.mp4');
      
      expect(result).toContain('/test-base/img/video.mp4');
      expect(result).toMatch(/\?v=\d+/); // タイムスタンプパターン
    });

    it('異なるファイル名に対応する', () => {
      const result = getVideoSrc('common_video.mp4');
      
      expect(result).toContain('/test-base/img/common_video.mp4');
    });
  });

  describe('getVideoThumbnailSrc', () => {
    it('basePath付きのサムネイルURLを生成する', () => {
      const result = getVideoThumbnailSrc('thumbnail.jpg');
      
      expect(result).toContain('/test-base/img/thumbnail.jpg');
      expect(result).toContain('?v=test-hash-123');
    });

    it('PNGファイルに対応する', () => {
      const result = getVideoThumbnailSrc('thumbnail.png');
      
      expect(result).toContain('/test-base/img/thumbnail.png');
    });
  });

  describe('getVideoConfigFromGalleryData', () => {
    it('動画データが存在する場合、正しい設定を返す', () => {
      mockGetCategoryVideo.mockReturnValue(mockCategoryWithVideo.video!);
      
      const result = getVideoConfigFromGalleryData(mockGalleryData, 'exterior');
      
      expect(result).toEqual({
        src: 'video.mp4',
        thumbnail: 'video-thumbnail.jpg',
        alt: 'モック動画',
      });
    });

    it('動画データが存在しない場合、nullを返す', () => {
      mockGetCategoryVideo.mockReturnValue(null);
      
      const result = getVideoConfigFromGalleryData(mockGalleryData, 'interior');
      
      expect(result).toBeNull();
    });

    it('getCategoryVideoが正しい引数で呼ばれる', () => {
      mockGetCategoryVideo.mockReturnValue(mockCategoryWithVideo.video!);
      
      getVideoConfigFromGalleryData(mockGalleryData, 'exterior');
      
      expect(mockGetCategoryVideo).toHaveBeenCalledWith(mockGalleryData, 'exterior');
    });
  });

  describe('hasVideoInCategory', () => {
    it('動画データが存在する場合、trueを返す', () => {
      mockGetCategoryVideo.mockReturnValue(mockCategoryWithVideo.video!);
      
      const result = hasVideoInCategory(mockGalleryData, 'exterior');
      
      expect(result).toBe(true);
    });

    it('動画データが存在しない場合、falseを返す', () => {
      mockGetCategoryVideo.mockReturnValue(null);
      
      const result = hasVideoInCategory(mockGalleryData, 'interior');
      
      expect(result).toBe(false);
    });

    it('undefinedが返された場合、falseを返す', () => {
      mockGetCategoryVideo.mockReturnValueOnce(undefined as any);
      
      const result = hasVideoInCategory(mockGalleryData, 'interior');
      
      expect(result).toBe(false);
    });

    it('全カテゴリで正しく判定する', () => {
      // exteriorとcommonは動画あり
      mockGetCategoryVideo
        .mockReturnValueOnce(mockCategoryWithVideo.video!) // exterior
        .mockReturnValueOnce(null) // interior
        .mockReturnValueOnce(mockGalleryData.common.video!); // common
      
      expect(hasVideoInCategory(mockGalleryData, 'exterior')).toBe(true);
      expect(hasVideoInCategory(mockGalleryData, 'interior')).toBe(false);
      expect(hasVideoInCategory(mockGalleryData, 'common')).toBe(true);
    });
  });

  describe('キャッシュパラメータ', () => {
    it('本番環境ではビルドハッシュを使用する', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_BUILD_HASH = 'prod-hash-456';
      
      const result = getVideoSrc('video.mp4');
      
      expect(result).toContain('?v=prod-hash-456');
    });

    it('ビルドハッシュが未定義の場合、デフォルト値を使用する', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.NEXT_PUBLIC_BUILD_HASH;
      
      const result = getVideoSrc('video.mp4');
      
      expect(result).toContain('?v=1.0.0');
    });

    it('テスト環境では設定されたハッシュを使用する', () => {
      process.env.NODE_ENV = 'test';
      process.env.NEXT_PUBLIC_BUILD_HASH = 'test-specific-hash';
      
      const result = getVideoSrc('video.mp4');
      
      expect(result).toContain('?v=test-specific-hash');
    });
  });

  describe('basePath設定', () => {
    it('basePath未設定時は空文字を使用する', () => {
      // next/configを再モック
      jest.doMock('next/config', () => ({
        __esModule: true,
        default: () => ({
          publicRuntimeConfig: {},
        }),
      }));
      
      // モジュールを再インポート
      jest.resetModules();
      const { getVideoSrc: newGetVideoSrc } = require('@/lib/utils/videoPath');
      
      const result = newGetVideoSrc('video.mp4');
      
      expect(result).toMatch(/^\/img\/video\.mp4/); // basePathなし
    });
  });
});