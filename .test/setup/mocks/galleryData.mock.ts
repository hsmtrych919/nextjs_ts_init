import { GalleryData, GalleryCategory, GalleryImage, GalleryVideo } from '@/lib/utils/galleryData';

// モック画像データ
export const mockGalleryImage: GalleryImage = {
  thumbnail: 'exterior_thumb_01.jpg',
  full: 'exterior_full_01.jpg',
  alt: 'モック外観画像',
};

// モック動画データ
export const mockGalleryVideo: GalleryVideo = {
  src: 'video.mp4',
  thumbnail: 'video-thumbnail.jpg',
  alt: 'モック動画',
};

// 動画ありカテゴリ
export const mockCategoryWithVideo: GalleryCategory = {
  title: '外観',
  description: '外観の説明文です。',
  video: mockGalleryVideo,
  images: [
    mockGalleryImage,
    {
      thumbnail: 'exterior_thumb_02.jpg',
      full: 'exterior_full_02.jpg',
      alt: 'モック外観画像2',
    },
  ],
};

// 動画なしカテゴリ
export const mockCategoryWithoutVideo: GalleryCategory = {
  title: '居室',
  description: '居室の説明文です。',
  images: [
    {
      thumbnail: 'interior_thumb_01.jpg',
      full: 'interior_full_01.jpg',
      alt: 'モック居室画像1',
    },
    {
      thumbnail: 'interior_thumb_02.jpg',
      full: 'interior_full_02.jpg',
      alt: 'モック居室画像2',
    },
  ],
};

// 完全なモックギャラリーデータ
export const mockGalleryData: GalleryData = {
  exterior: mockCategoryWithVideo,
  interior: mockCategoryWithoutVideo,
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

// 空のギャラリーデータ
export const mockEmptyGalleryData: GalleryData = {
  exterior: {
    title: '外観',
    description: '',
    images: [],
  },
  interior: {
    title: '居室',
    description: '',
    images: [],
  },
  common: {
    title: '共用部',
    description: '',
    images: [],
  },
};

// 不正なギャラリーデータ
export const mockInvalidGalleryData = {
  exterior: {
    title: '',
    // descriptionが欠損
    images: 'invalid', // 配列でない
  },
  // interiorが欠損
  common: null,
};

// galleryData.tsのgetGalleryDataSafe関数をモック
export const mockGetGalleryDataSafe = jest.fn().mockReturnValue(mockGalleryData);

// エラー発生時のモック
export const mockGetGalleryDataSafeError = jest.fn().mockReturnValue(null);