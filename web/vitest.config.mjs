import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    // Issue #3677対応: テスト間の分離を強化
    isolate: true,
  },
  resolve: {
    conditions: ['development', 'browser'],
    // Issue #3677対応: モジュール解決の改善
    dedupe: ['@apollo/client', 'react', 'react-dom'],
  },
});
