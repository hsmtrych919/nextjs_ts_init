import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import GalleryLayout, { TabId } from '@/components/ui/GalleryLayout';
import PhotoGrid from '@/components/ui/PhotoGrid';
import PhotoModal from '@/components/ui/PhotoModal';
import { getGalleryData, getCategoryImages, GalleryImage, CategoryKey } from '@/lib/utils/galleryData';

const GalleryPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>('exterior');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const galleryData = getGalleryData();
  const currentImages = getCategoryImages(galleryData, activeTab as CategoryKey);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  const handlePhotoClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

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
            imageSrc={selectedImage.full}
            imageAlt={selectedImage.alt}
          />
        )}
      </GalleryLayout>
    </>
  );
};

export default GalleryPage;