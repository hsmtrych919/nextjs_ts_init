import React, { ReactNode } from 'react';
import getConfig from 'next/config';
import Link from 'next/link';


const { publicRuntimeConfig } = getConfig();
const basePath = (publicRuntimeConfig && publicRuntimeConfig.basePath) || '';

type ImgPathProps = {
  src?: string ;
  alt?: string ;
};
export function ImgPath({ src= '', alt= '' }: ImgPathProps) {
  return <img src={`${basePath}/img/${src}?${Date.now()}`} alt={alt} />;
}

type LinkPathProps = {
  link?: string;
  as?: string;
  className?: string;
  children?: ReactNode;
};
export function LinkPath({ link = '', as, className, children }: LinkPathProps) {
  return (
    <Link href={link} as={`${basePath}${as}`} className={className}>
      {children}
    </Link>
  );
}

