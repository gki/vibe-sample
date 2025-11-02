import type { KnipConfig } from 'knip';

const config: KnipConfig = {
    workspaces: {
        'api': {
            entry: 'src/index.ts',
            project: 'src/**/*.{ts,js}',
            ignore: [
                'dist/**',
                'prisma/dev.db',
                'prisma/migrations/**',
                'src/**/*.test.ts',
                'src/**/*.spec.ts',
            ],
        },
        'web': {
            entry: [
                'app/**/*.{ts,tsx}',
                'next.config.ts',
                'vitest.config.mjs',
                'eslint.config.mjs',
                'postcss.config.mjs',
            ],
            project: '**/*.{ts,tsx,js,jsx,mjs}',
            ignore: [
                '.next/**',
                'dist/**',
                'node_modules/**',
                'coverage/**',
                'public/**',
                '**/*.test.{ts,tsx,js,jsx}',
                '**/*.spec.{ts,tsx,js,jsx}',
                'next-env.d.ts',
                // 将来使用予定のファイル
                'lib/graphql/mutations.ts',
                'styles/theme.ts',
            ],
        },
    },
    ignore: [
        'docs/**',
        '.git/**',
        'node_modules/**',
        'dist/**',
        '.next/**',
        'coverage/**',
        '**/*.d.ts',
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
    ],
    ignoreDependencies: [
        // 設定ファイルで使用される
        '@vanilla-extract/next-plugin',
        '@vanilla-extract/css', // スタイル定義で使用（動的インポート）
        'eslint-config-prettier', // ESLint設定で使用
        'postcss', // PostCSS設定で使用
        // Prisma 関連（CLI使用）
        'prisma',
        // ビルドツール（スクリプトで使用）
        'tsc',
        'tsx',
        // 型定義（型チェックで使用）
        '@types/node',
        '@types/react',
        '@types/react-dom',
    ],
    ignoreExportsUsedInFile: true,
};

export default config;

