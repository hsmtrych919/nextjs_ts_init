import React from 'react';
import FeaatureToggleContent from '@components/page/toggle-content';
import styles from '@styles/feature.module.scss';
import {ImgPath} from '@features/rewrite-path';

export default function DogFeatureSupremo() {


  return (
    <>
      <article className="mt__9">
        <div className="l-row--container c-gutter__row">
          <div className="c-col--12">
            <div className={`${styles.series_outer} ${styles.series_outer_dog}`}>


              {/* adv */}
              <section className="l-row mt__8">

                <FeaatureToggleContent>
                  <section className={`${styles.adv_content_frame} ${styles.adv_content_frame_mt}`}>
                  </section>

                </FeaatureToggleContent>

              </section>
              {/* /adv */}

            </div>
            {/* /outer */}
          </div>
        </div>
      </article>


    </>
  );
}
