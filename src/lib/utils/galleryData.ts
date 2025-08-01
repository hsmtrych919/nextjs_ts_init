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
 * カテゴリデータの型定義
 */
export interface GalleryCategory {
  title: string;
  description: string;
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
 * 利用可能なカテゴリキーの配列を取得する関数
 * @returns {CategoryKey[]} カテゴリキーの配列
 */
export const getAvailableCategories = (): CategoryKey[] => {
  return ['exterior', 'interior', 'common'];
};