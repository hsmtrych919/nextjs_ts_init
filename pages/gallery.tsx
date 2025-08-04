import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import GalleryLayout, { TabId } from '@/components/ui/GalleryLayout';
import PhotoGrid from '@/components/ui/PhotoGrid';
import PhotoModal from '@/components/ui/PhotoModal';
import { getGalleryDataSafe, getCategoryImages, GalleryImage, CategoryKey } from '@/lib/utils/galleryData';

const GalleryPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>('exterior');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const galleryData = getGalleryDataSafe();
  const currentImages = galleryData ? getCategoryImages(galleryData, activeTab as CategoryKey) : [];

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    
    // モーダルが開いている場合は適切にクリア
    if (isModalOpen) {
      setIsModalOpen(false);
      setSelectedImage(null);
    }
    
    // インデックスを安全にリセット
    setSelectedIndex(0);
  }, [isModalOpen]);

  const handlePhotoClick = useCallback((image: GalleryImage, index: number) => {
    // 入力値の検証
    if (!image || index < 0 || index >= currentImages.length) {
      console.warn('Invalid photo click parameters:', { image, index, maxIndex: currentImages.length - 1 });
      return;
    }

    setSelectedImage(image);
    setSelectedIndex(index);
    setIsModalOpen(true);
  }, [currentImages.length]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <Head>
        <title>物件写真ギャラリー</title>
        <meta name="description" content="写真ギャラリー" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {!galleryData ? (
        <p>エラーが発生しました。</p>
      ) : (
        <GalleryLayout
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          <PhotoGrid
            images={currentImages}
            category={activeTab as CategoryKey}
            onPhotoClick={handlePhotoClick}
          />

          {selectedImage && (
            <PhotoModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              images={currentImages}
              currentIndex={selectedIndex}
              onNavigate={(index) => setSelectedIndex(index)}
            />
          )}
        </GalleryLayout>
      )}
    </>
  );
};

export default GalleryPage;