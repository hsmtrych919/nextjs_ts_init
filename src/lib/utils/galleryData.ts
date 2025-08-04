/**
 * Gallery data types and utilities
 * @fileoverview ギャラリーデータの型定義と取得ユーティリティ
 */

import galleryData from '@/lib/constants/gallery.json';

/**
 * 画像データの型定義
 */
export interface GalleryImage {
  thumbnail: string;
  full: string;
  alt: string;
}

/**
 * 動画データの型定義
 */
export interface GalleryVideo {
  src: string;
  thumbnail: string;
  alt: string;
}

/**
 * カテゴリデータの型定義
 */
export interface GalleryCategory {
  title: string;
  description: string;
  video?: GalleryVideo;
  images: GalleryImage[];
}

/**
 * ギャラリーデータ全体の型定義
 */
export interface GalleryData {
  exterior: GalleryCategory;
  interior: GalleryCategory;
  common: GalleryCategory;
}

/**
 * カテゴリキーの型定義
 */
export type CategoryKey = keyof GalleryData;

/**
 * ギャラリーデータを取得する関数（静的インポート版）
 * @returns {GalleryData} ギャラリーデータ
 */
export const getGalleryData = (): GalleryData => {
  return galleryData as GalleryData;
};

/**
 * 安全なギャラリーデータ取得関数（エラーハンドリング付き）
 * @returns {GalleryData | null} ギャラリーデータまたはnull
 */
export const getGalleryDataSafe = (): GalleryData | null => {
  try {
    const data = galleryData as unknown;
    
    if (!data || typeof data !== 'object') {
      return null;
    }

    const requiredCategories: (keyof GalleryData)[] = ['exterior', 'interior', 'common'];
    for (const category of requiredCategories) {
      if (!(category in data)) {
        return null;
      }
    }

    const typedData = data as GalleryData;
    
    for (const categoryData of Object.values(typedData)) {
      if (!categoryData.title || !categoryData.description || !Array.isArray(categoryData.images)) {
        return null;
      }
      
      // video は任意項目なので存在チェックのみ
      if (categoryData.video && (!categoryData.video.src || !categoryData.video.thumbnail || !categoryData.video.alt)) {
        return null;
      }
    }

    return typedData;
  } catch (error) {
    return null;
  }
};

/**
 * 特定のカテゴリのデータを取得する関数
 * @param {GalleryData} data - ギャラリーデータ全体
 * @param {CategoryKey} category - カテゴリキー
 * @returns {GalleryCategory} カテゴリデータ
 */
export const getCategoryData = (data: GalleryData, category: CategoryKey): GalleryCategory => {
  return data[category];
};

/**
 * 特定のカテゴリの画像配列を取得する関数
 * @param {GalleryData} data - ギャラリーデータ全体
 * @param {CategoryKey} category - カテゴリキー
 * @returns {GalleryImage[]} 画像配列
 */
export const getCategoryImages = (data: GalleryData, category: CategoryKey): GalleryImage[] => {
  return data[category].images;
};

/**
 * 特定のカテゴリの動画データを取得する関数
 * @param {GalleryData} data - ギャラリーデータ全体
 * @param {CategoryKey} category - カテゴリキー
 * @returns {GalleryVideo | null} 動画データまたはnull
 */
export const getCategoryVideo = (data: GalleryData, category: CategoryKey): GalleryVideo | null => {
  return data[category].video || null;
};

/**
 * 利用可能なカテゴリキーの配列を取得する関数
 * @returns {CategoryKey[]} カテゴリキーの配列
 */
export const getAvailableCategories = (): CategoryKey[] => {
  return ['exterior', 'interior', 'common'];
};