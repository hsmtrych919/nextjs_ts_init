import { useEffect } from 'react';
import Header from '@components/layout/header';
import Footer from '@components/layout/footer';
import { smooth_scroll } from '@features/smooth-scroll';
import { link_ignore } from '@features/link_ignore';

export default function LayoutBasic({ children, hasPbForCloth, pageType }) {

  useEffect(() => {
    smooth_scroll();
    link_ignore();
  });

  return (
    <>
      <Header />
      <main className={`bgi__cloth ${hasPbForCloth ? 'pb__12' : ''}`}>{children}</main>
      {pageType === 'dog' ? (
        <Footer pageType="dog" />
      ) : pageType === 'cat' ? (
        <Footer pageType="cat" />
      ) : (
        <Footer />
      )}
    </>
  );
}