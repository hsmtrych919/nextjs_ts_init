import '@testing-library/jest-dom';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Next.js環境のモック
jest.mock('next/config', () => ({
  __esModule: true,
  default: () => ({
    publicRuntimeConfig: {
      basePath: '',
    },
  }),
}));

// next/routerのモック
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// IntersectionObserverのモック
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// ResizeObserverのモック
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// HTMLVideoElementのモック
Object.defineProperty(HTMLVideoElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn(() => Promise.resolve()),
});

Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// カスタムレンダー関数
function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, {
    ...options,
  });
}

// re-export everything
export * from '@testing-library/react';
export { render };

// カスタムマッチャー
expect.extend({
  toHaveValidVideoSrc(received: HTMLVideoElement) {
    const pass = received.src.includes('/img/') && received.src.includes('?v=');
    if (pass) {
      return {
        message: () => `expected ${received.src} not to have valid video src format`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received.src} to have valid video src format (/img/ and ?v=)`,
        pass: false,
      };
    }
  },
});