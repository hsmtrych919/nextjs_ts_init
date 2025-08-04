// モックデータを先に定義
const mockData = {
  exterior: {
    title: '外観',
    description: '外観の説明文です。',
    video: {
      src: 'video.mp4',
      thumbnail: 'video-thumbnail.jpg',
      alt: 'モック動画',
    },
    images: [
      {
        thumbnail: 'exterior_thumb_01.jpg',
        full: 'exterior_full_01.jpg',
        alt: 'モック外観画像',
      },
    ],
  },
  interior: {
    title: '居室',
    description: '居室の説明文です。',
    images: [
      {
        thumbnail: 'interior_thumb_01.jpg',
        full: 'interior_full_01.jpg',
        alt: 'モック居室画像1',
      },
    ],
  },
  common: {
    title: '共用部',
    description: '共用部の説明文です。',
    video: {
      src: 'common_video.mp4',
      thumbnail: 'common_video_thumb.jpg',
      alt: '共用部の動画',
    },
    images: [
      {
        thumbnail: 'common_thumb_01.jpg',
        full: 'common_full_01.jpg',
        alt: 'モック共用部画像1',
      },
    ],
  },
};

// gallery.jsonのモック
jest.mock('@/lib/constants/gallery.json', () => mockData);

import {
  getGalleryData,
  getGalleryDataSafe,
  getCategoryData,
  getCategoryImages,
  getCategoryVideo,
  getAvailableCategories
} from '@/lib/utils/galleryData';

describe('galleryData utilities', () => {
  describe('getGalleryData', () => {
    it('ギャラリーデータを正しく取得する', () => {
      const result = getGalleryData();
      
      expect(result).toEqual(mockData);
      expect(result.exterior).toBeDefined();
      expect(result.interior).toBeDefined();
      expect(result.common).toBeDefined();
    });

    it('各カテゴリが必要なプロパティを持つ', () => {
      const result = getGalleryData();
      
      Object.values(result).forEach(category => {
        expect(category).toHaveProperty('title');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('images');
        expect(Array.isArray(category.images)).toBe(true);
      });
    });
  });

  describe('getGalleryDataSafe', () => {
    it('正常なデータの場合、データを返す', () => {
      const result = getGalleryDataSafe();
      
      expect(result).toEqual(mockData);
    });

    it('不正なデータ構造の場合、nullを返す', () => {
      // gallery.jsonを不正なデータでモック
      const mockInvalidGalleryData = { invalid: true };
      jest.doMock('@/lib/constants/gallery.json', () => mockInvalidGalleryData);
      
      // 関数を再インポート
      jest.resetModules();
      const { getGalleryDataSafe: newGetGalleryDataSafe } = require('@/lib/utils/galleryData');
      
      const result = newGetGalleryDataSafe();
      
      expect(result).toBeNull();
    });

    it('undefinedデータの場合、nullを返す', () => {
      jest.doMock('@/lib/constants/gallery.json', () => undefined);
      
      jest.resetModules();
      const { getGalleryDataSafe: newGetGalleryDataSafe } = require('@/lib/utils/galleryData');
      
      const result = newGetGalleryDataSafe();
      
      expect(result).toBeNull();
    });

    it.skip('エラーが発生した場合、nullを返す', () => {
      // エラーを発生させるモックを作成
      const errorMock = jest.fn(() => {
        throw new Error('File not found');
      });
      
      jest.doMock('@/lib/constants/gallery.json', errorMock);
      
      jest.resetModules();
      const { getGalleryDataSafe: newGetGalleryDataSafe } = require('@/lib/utils/galleryData');
      
      const result = newGetGalleryDataSafe();
      
      expect(result).toBeNull();
    });

    it('必須カテゴリが欠損している場合、nullを返す', () => {
      const incompleteData = {
        exterior: mockData.exterior,
        // interior欠損
        common: mockData.common,
      };
      
      jest.doMock('@/lib/constants/gallery.json', () => incompleteData);
      
      jest.resetModules();
      const { getGalleryDataSafe: newGetGalleryDataSafe } = require('@/lib/utils/galleryData');
      
      const result = newGetGalleryDataSafe();
      
      expect(result).toBeNull();
    });

    it('動画データが不正な場合、nullを返す', () => {
      const invalidVideoData = {
        ...mockData,
        exterior: {
          ...mockData.exterior,
          video: {
            src: 'video.mp4',
            // thumbnailとaltが欠損
          },
        },
      };
      
      jest.doMock('@/lib/constants/gallery.json', () => invalidVideoData);
      
      jest.resetModules();
      const { getGalleryDataSafe: newGetGalleryDataSafe } = require('@/lib/utils/galleryData');
      
      const result = newGetGalleryDataSafe();
      
      expect(result).toBeNull();
    });
  });

  describe('getCategoryData', () => {
    it('指定されたカテゴリのデータを取得する', () => {
      const result = getCategoryData(mockData, 'exterior');
      
      expect(result).toEqual(mockData.exterior);
      expect(result.title).toBe('外観');
    });

    it('全カテゴリのデータを正しく取得する', () => {
      const categories: Array<keyof typeof mockData> = ['exterior', 'interior', 'common'];
      
      categories.forEach(category => {
        const result = getCategoryData(mockData, category);
        expect(result).toEqual(mockData[category]);
      });
    });
  });

  describe('getCategoryImages', () => {
    it('指定されたカテゴリの画像配列を取得する', () => {
      const result = getCategoryImages(mockData, 'exterior');
      
      expect(result).toEqual(mockData.exterior.images);
      expect(Array.isArray(result)).toBe(true);
    });

    it('各画像オブジェクトが必要なプロパティを持つ', () => {
      const result = getCategoryImages(mockData, 'exterior');
      
      result.forEach(image => {
        expect(image).toHaveProperty('thumbnail');
        expect(image).toHaveProperty('full');
        expect(image).toHaveProperty('alt');
        expect(typeof image.thumbnail).toBe('string');
        expect(typeof image.full).toBe('string');
        expect(typeof image.alt).toBe('string');
      });
    });

    it('空の画像配列も正しく処理する', () => {
      const emptyData = {
        ...mockData,
        interior: {
          ...mockData.interior,
          images: [],
        },
      };
      
      const result = getCategoryImages(emptyData, 'interior');
      
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getCategoryVideo', () => {
    it('動画データが存在する場合、動画オブジェクトを返す', () => {
      const result = getCategoryVideo(mockData, 'exterior');
      
      expect(result).toEqual(mockData.exterior.video);
      expect(result?.src).toBe('video.mp4');
      expect(result?.thumbnail).toBe('video-thumbnail.jpg');
      expect(result?.alt).toBe('モック動画');
    });

    it('動画データが存在しない場合、nullを返す', () => {
      const result = getCategoryVideo(mockData, 'interior');
      
      expect(result).toBeNull();
    });

    it('共用部の動画データも正しく取得する', () => {
      const result = getCategoryVideo(mockData, 'common');
      
      expect(result).toEqual(mockData.common.video);
      expect(result?.src).toBe('common_video.mp4');
    });

    it('video プロパティが undefined の場合、nullを返す', () => {
      const dataWithoutVideo = {
        ...mockData,
        exterior: {
          ...mockData.exterior,
          video: undefined,
        },
      };
      
      const result = getCategoryVideo(dataWithoutVideo, 'exterior');
      
      expect(result).toBeNull();
    });
  });

  describe('getAvailableCategories', () => {
    it('利用可能なカテゴリキーの配列を返す', () => {
      const result = getAvailableCategories();
      
      expect(result).toEqual(['exterior', 'interior', 'common']);
      expect(Array.isArray(result)).toBe(true);
    });

    it('カテゴリの順序が正しい', () => {
      const result = getAvailableCategories();
      
      expect(result[0]).toBe('exterior');
      expect(result[1]).toBe('interior');
      expect(result[2]).toBe('common');
    });
  });

  describe('型安全性', () => {
    it('GalleryVideo インターフェースに準拠した動画データ', () => {
      const videoData = getCategoryVideo(mockData, 'exterior');
      
      if (videoData) {
        // TypeScript型チェックのテスト
        const src: string = videoData.src;
        const thumbnail: string = videoData.thumbnail;
        const alt: string = videoData.alt;
        
        expect(typeof src).toBe('string');
        expect(typeof thumbnail).toBe('string');
        expect(typeof alt).toBe('string');
      }
    });

    it('GalleryImage インターフェースに準拠した画像データ', () => {
      const images = getCategoryImages(mockData, 'exterior');
      
      images.forEach(image => {
        // TypeScript型チェックのテスト
        const thumbnail: string = image.thumbnail;
        const full: string = image.full;
        const alt: string = image.alt;
        
        expect(typeof thumbnail).toBe('string');
        expect(typeof full).toBe('string');
        expect(typeof alt).toBe('string');
      });
    });
  });
});