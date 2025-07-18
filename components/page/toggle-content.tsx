import {useToggleContent} from '@features/toggle-content';

export default function FeaatureToggleContent ({ children }) {

  useToggleContent('.c-toggle__wrap', '.c-toggle__title', '.c-toggle__content');

  return (
    <div className="c-toggle__wrap">
      <div className="c-toggle__title"><span className="c-toggle__button js-toggle-message" >続きを読む</span></div>
      <div className="c-toggle__content">
        {children}
      </div>
    </div>
  );
}