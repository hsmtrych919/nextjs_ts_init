import { useEffect } from 'react';
import ItemLineup from '@components/element/modal';
import {ImgPath} from '@features/rewrite-path';
import styles from '@styles/select.module.scss';
import {listForDog} from '@features/const/nutro_dog';

type functionProps ={
  type: string;
};

export default function FoodSelect({type}:functionProps ) {

  useEffect(() => {

  });

  const isDog = type === 'dog';
  const title = `愛${isDog ? '犬' : '猫'}にぴったりの${isDog ? 'フード' : 'キャットフード'}を選ぶ`;
  const titleImgSp = `ttl_select_${isDog ? 'dog' : 'cat'}_sp.png`;
  const titleImgPc = `ttl_select_${isDog ? 'dog' : 'cat'}_pc.png`;
  const foodlist = listForDog;


  return (
    <>
      <article className={styles.outer}>
        <div className="l-row--container c-gutter__row">
          <div className={styles.title}>
            <h1 className={styles.title_content}>
              <picture>
                <source srcSet={`../img/${titleImgPc}`} media="(min-width:768px)" />
                <ImgPath src={titleImgSp} alt={title}/>
              </picture>
            </h1>
          </div>
        </div>
        <div className="l-row--container c-gutter__row mt__5">
          <div className="c-col--12 c-col__md--10">
            {/* {type === 'dog' ? <SelectformForDog /> : <SelectformForCat />} */}
          </div>
        </div>

        {foodlist && foodlist.length > 0 && (
          <>
            <ItemLineup items={foodlist} type={type}/>
          </>
        )}
      </article>
    </>
  );
}