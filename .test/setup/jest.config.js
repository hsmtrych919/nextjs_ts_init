module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  // ルートディレクトリ設定
  rootDir: '../../',
  testMatch: [
    '<rootDir>/.test/**/*.test.{ts,tsx}',
  ],
  
  // TypeScript path mapping対応
  moduleNameMapper: {
    // CSS Modules対応（具体的なパターンを先に配置）
    '\\.module\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // 画像・動画ファイル対応
    '\\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|ogg)$': '<rootDir>/.test/setup/mocks/fileMock.js',
    // プロジェクトのエイリアス
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    // 互換性のため既存パスも保持
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@features/(.*)$': '<rootDir>/src/lib/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
  },
  
  // セットアップファイル
  setupFilesAfterEnv: [
    '<rootDir>/.test/setup/test-utils.tsx'
  ],
  
  // カバレッジ設定
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/lib/constants/**',
    '!**/*.stories.{ts,tsx}',
  ],
  
  // テスト環境設定
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  
  // モック設定
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // トランスフォーム設定
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
};