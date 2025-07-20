import { useEffect, ReactNode } from 'react';
import Header from '@components/layout/header';
import Footer from '@components/layout/footer';
import { smooth_scroll } from '@features/smooth-scroll';
import { link_ignore } from '@features/link_ignore';

interface LayoutProps {
  children: ReactNode;
}

export default function LayoutBasic({ children }: LayoutProps) {

  useEffect(() => {
    smooth_scroll();
    link_ignore();
  });

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}