import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import LayoutGallery, { TabId } from '@/components/ui/LayoutGallery';
import GridPhoto from '@/components/ui/GridPhoto';
import ModalPhoto from '@/components/ui/ModalPhoto';
import { getGalleryDataSafe, getCategoryImages, GalleryImage, CategoryKey } from '@/lib/utils/galleryData';
import Layout from '@/components/layout/layout';

const GalleryPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>('exterior');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hasOpenedModal, setHasOpenedModal] = useState(false);

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
    setHasOpenedModal(true);
  }, [currentImages.length]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <Layout>

      {!galleryData ? (
        <p>エラーが発生しました。</p>
      ) : (
        <LayoutGallery
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          <GridPhoto
            images={currentImages}
            category={activeTab as CategoryKey}
            onPhotoClick={handlePhotoClick}
            hasOpenedModal={hasOpenedModal}
          />

          {selectedImage && (
            <ModalPhoto
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              images={currentImages}
              currentIndex={selectedIndex}
              onNavigate={(index) => setSelectedIndex(index)}
            />
          )}
        </LayoutGallery>
      )}
    </Layout>
  );
};

export default GalleryPage;

export async function getStaticProps() {
  const pageMeta = {
    title: '物件写真ギャラリー',
    ogUrl: 'demo/',
    description: '物件写真ギャラリー',
  };
  return {
    props: {
      pageMeta,
    },
  };
}