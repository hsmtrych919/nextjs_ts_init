import getConfig from 'next/config';
import { CategoryKey, GalleryData, GalleryVideo, getCategoryVideo } from '@/lib/utils/galleryData';

const { publicRuntimeConfig } = getConfig();
const basePath = (publicRuntimeConfig && publicRuntimeConfig.basePath) || '';

/**
 * 環境に応じたキャッシュパラメータを取得
 * @returns キャッシュバスティング用のクエリパラメータ
 */
const getCacheParam = (): string => {
  // 開発環境でのみキャッシュバスティング
  if (process.env.NODE_ENV === 'development') {
    return `?v=${Date.now()}`;
  }
  // 本番環境では静的ビルドハッシュ
  return `?v=${process.env.NEXT_PUBLIC_BUILD_HASH || '1.0.0'}`;
};

/**
 * 動画ファイルの完全なURLを取得
 * @param src 動画ファイル名（/img/以下の相対パス）
 * @returns 完全な動画URL
 */
export const getVideoSrc = (src: string): string => {
  return `${basePath}/img/${src}${getCacheParam()}`;
};

/**
 * サムネイル画像の完全なURLを取得
 * @param src 画像ファイル名（/img/以下の相対パス）
 * @returns 完全な画像URL
 */
export const getVideoThumbnailSrc = (src: string): string => {
  return `${basePath}/img/${src}${getCacheParam()}`;
};

/**
 * galleryDataから動画設定を取得
 * @param galleryData ギャラリーデータ全体
 * @param category 対象のカテゴリキー
 * @returns 動画設定オブジェクト（動画がない場合はnull）
 */
export const getVideoConfigFromGalleryData = (galleryData: GalleryData, category: CategoryKey): GalleryVideo | null => {
  return getCategoryVideo(galleryData, category);
};

/**
 * 指定されたカテゴリで動画が存在するかチェック
 * @param galleryData ギャラリーデータ全体
 * @param category チェックするカテゴリキー
 * @returns 動画が存在する場合true
 */
export const hasVideoInCategory = (galleryData: GalleryData, category: CategoryKey): boolean => {
  const videoConfig = getCategoryVideo(galleryData, category);
  return videoConfig !== null;
};