import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import GalleryLayout from '@/components/ui/GalleryLayout';

const GalleryPage: NextPage = () => {
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
        </div>
      </GalleryLayout>
    </>
  );
};

export default GalleryPage;