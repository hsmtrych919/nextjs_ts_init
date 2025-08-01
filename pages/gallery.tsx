import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import GalleryLayout from '@/components/ui/GalleryLayout';
import PhotoModal from '@/components/ui/PhotoModal';

const GalleryPage: NextPage = () => {
  // === デモ用: PhotoModal動作確認 ===
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDemoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>物件写真ギャラリー</title>
        <meta name="description" content="新築マンションの写真ギャラリー" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <GalleryLayout>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <p>写真グリッドがここに表示されます（Stage 3で実装予定）</p>
          
          {/* === デモ用: PhotoModal動作確認 === */}
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            border: '2px dashed #ccc', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>【デモ用】PhotoModal動作確認</h3>
            <p style={{ marginBottom: '20px', fontSize: '14px' }}>
              下のサムネイルをクリックするとPhotoModalが開きます
            </p>
            
            <button
              onClick={handleDemoClick}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '0',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <img
                src="/img/demo01.jpg"
                alt="デモ用サムネイル"
                style={{
                  width: '200px',
                  height: '150px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </button>
            
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              クリックで拡大表示（PhotoModal）
            </p>
          </div>
        </div>

        {/* === デモ用: PhotoModal === */}
        <PhotoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          imageSrc="/img/demo01-modal.jpg"
          imageAlt="デモ用拡大画像"
        />
      </GalleryLayout>
    </>
  );
};

export default GalleryPage;