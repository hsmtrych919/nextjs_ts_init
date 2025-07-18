import React, { useState } from 'react';
import {ImgPath} from '@features/rewrite-path';
import styles from '@styles/select.module.scss';
import ModalComponent from '@features/modal-component';

type Item ={
  imgSrc?: string;
  name?: string;
  label?: string;
  size?: string;
  age?: string;
  care?: string;
  category?: string;
  subcategory?: string;
  kind?: string;
  material?: string;
  link?: { size?: string; url?: string }[];
};

type functionProps ={
  items: Item[];
  type: string;
};


export default function ItemLineup ({ items, type }:functionProps){
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const openModal = (itemId: string | null) => {
    setSelectedItemId(itemId);
  };

  const closeModal = () => {
    setSelectedItemId(null);
  };

  if (!items || items.length === 0) {
    return null; // nullを返してコンポーネントを描画しないようにする
  }

  const isDog = type === 'dog';
  const buttonClass = isDog ? `${styles.modal_button_dog}` : `${styles.modal_button_cat}`;

  return (
    <ul className={`${styles.list_item} l-grid c-grid--2 c-grid__sm--3 c-grid__md--4 c-grid__xl--5`}>
      {items.map((item) => (
        <li key={item.imgSrc} className="js-filter__item" data-size={item.size} data-age={item.age} data-care={item.care} data-material={item.material} data-category={item.category} data-subcategory={item.subcategory} data-kind={item.kind}>

          <button
            className={`${styles.item_frame}`}
            onClick={() => {
              if (item.link && item.link.length) {
                if (item.imgSrc) {
                  openModal(item.imgSrc);
                }
              }
            }}
            style={{
              cursor: item.link ? ((item.link && item.link.length) ? 'pointer' : 'default') : 'default',
            }}
          >

            <p className={styles.item_pic}>
              <ImgPath src={`item/${item.imgSrc}`} alt={item.name} />
            </p>
            <p className={styles.item_name} dangerouslySetInnerHTML={{ __html: item.name.replace(/\n\n/g, '<br class="hide__sm--up" />').replace(/\n/g, '<br />') }} />
            <p className={styles.item_label}>{item.label}</p>
            <div className={styles.item_button_outer}>
              <span className={`${styles.item_button} ${(item.link?.length ?? 0) > 0 ? styles.item_button_hover : styles.item_button}`} style={{ cursor: item.link ? ((item.link.length ?? 0) > 0 ? 'pointer' : 'default') : 'default' }}>
                {(item.link?.length ?? 0) > 0 ? '容量を選んで購入' : '在庫なし'}
              </span>
            </div>
          </button>
          {(item.link?.length ?? 0) > 0 && (
            <ModalComponent
              isOpen={selectedItemId === item.imgSrc}
              closeModal={closeModal}
            >
              <>
                <div className={`${styles.modal_title}`}>商品ページへ</div>
                <ul className={`${styles.modal_list_button}`}>
                  {item.link.map(linkItem => (
                    <li key={linkItem.size}>
                      <a href={`https://item.rakuten.co.jp/petdyna/${linkItem.url}/`} className={buttonClass} target="_blank" rel="noopener noreferrer">
                        {linkItem.size}の商品を購入する
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            </ModalComponent>
          )}
        </li>
      ))}
    </ul>
  );
}

