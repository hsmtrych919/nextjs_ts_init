import React, { ReactNode } from 'react';
import { useToggleContent } from '@features/toggle-content';

interface ToggleProps {
  children?: ReactNode;
}

export default function SimpleToggleDemo({ children }: ToggleProps) {
  useToggleContent('.c-toggle__wrap', '.c-toggle__title', '.c-toggle__content');

  return (
    <div className="c-toggle__wrap">
      <div className="c-toggle__title">
        <span className="c-toggle__button js-toggle-message">続きを読む</span>
      </div>
      <div className="c-toggle__content">
        {children || (
          <section>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br/>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<br/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati vel nemo earum eligendi tempore, quis nam harum laudantium consectetur dolores quae quisquam voluptatum rem enim ipsum pariatur rerum explicabo distinctio!</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br/>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<br/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati vel nemo earum eligendi tempore, quis nam harum laudantium consectetur dolores quae quisquam voluptatum rem enim ipsum pariatur rerum explicabo distinctio!</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br/>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<br/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati vel nemo earum eligendi tempore, quis nam harum laudantium consectetur dolores quae quisquam voluptatum rem enim ipsum pariatur rerum explicabo distinctio!</p>
          </section>
        )}
      </div>
    </div>
  );
}
