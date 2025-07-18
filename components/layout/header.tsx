import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import Link from 'next/link';
import styles from '@styles/header.module.scss';
import { useRouter } from 'next/router';
import {ImgPath} from '@features/rewrite-path';

export default function Header() {
  const router = useRouter();
  const { pathname } = router;
  const breadcrumbItems = [];
  const basePath = (publicRuntimeConfig && publicRuntimeConfig.basePath) || '';
  const rootUrl = 'https://';

  if (pathname === '/dog') {
    breadcrumbItems.push({ name: 'TOP', href: rootUrl, as: rootUrl });
    breadcrumbItems.push({ name: 'hghg', href: '/', as: `${basePath}/` });
    breadcrumbItems.push({ name: 'hghghg', href: '', as: '' });
  } else if (pathname === '/cat') {
    breadcrumbItems.push({ name: 'TOP', href: rootUrl, as: rootUrl });
    breadcrumbItems.push({ name: 'hghg', href: '/', as: `${basePath}/` });
    breadcrumbItems.push({ name: 'hghghg', href: '', as: '' });
  } else {
    breadcrumbItems.push({ name: 'TOP', href: rootUrl, as: rootUrl });
    breadcrumbItems.push({ name: 'hghg', href: '', as: '' });
  }

  return (
    <>
      <header className={styles.outer}>
        <div className="l-row--container c-gutter__row jc__start ai__center">
          <h1 className={styles.logo}>
            <ImgPath src="logo_dyna.png" alt=""/>
          </h1>
        </div>
      </header>
      <div className={`l-row--container c-gutter__row jc__start ai__center ${styles.crumbs_outer} `}>

        <ul className={styles.crumbs_list}>
          {breadcrumbItems.map((item, index) => (
          // パンくずリストアイテムの表示
            <li key={index}>
              {index === breadcrumbItems.length - 1 ? (
              // 現在のページに対応するパンくずリストアイテム
                <span className={styles.crumbs_item}>{item.name}</span>
              ) : (
              // 通常のパンくずリストアイテム
                <Link href={item.href} as={item.as} className={styles.crumbs_link}>
                  <span className={styles.crumbs_item}>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

      </div>
    </>
  );
}