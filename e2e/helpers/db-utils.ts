import { PrismaClient } from '@prisma/client';
import { join } from 'path';

// シングルトンパターンでPrismaクライアントを管理
let prisma: PrismaClient | null = null;

/**
 * プロジェクトルートからの絶対パスを取得する
 */
function getTestDatabasePath(): string {
  // DATABASE_URL環境変数が設定されている場合はそれを使用
  if (process.env.DATABASE_URL) {
    // 相対パスの場合は絶対パスに変換
    if (process.env.DATABASE_URL.startsWith('file:./')) {
      const projectRoot = process.cwd();
      const relativePath = process.env.DATABASE_URL.replace('file:', '');
      const dbPath = join(projectRoot, relativePath);
      return `file:${dbPath}`;
    }
    // 既に絶対パスの場合はそのまま返す
    return process.env.DATABASE_URL;
  }
  // プロジェクトルート（process.cwd()）から api/prisma/test.db への絶対パス
  const projectRoot = process.cwd();
  const dbPath = join(projectRoot, 'api', 'prisma', 'test.db');
  return `file:${dbPath}`;
}

/**
 * Prismaクライアントを取得する（シングルトン）
 */
function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const dbUrl = process.env.DATABASE_URL || getTestDatabasePath();
    // デバッグ用: 実際に使用されるDATABASE_URLをログ出力
    if (process.env.DEBUG) {
      console.log('[db-utils] DATABASE_URL:', dbUrl);
      console.log('[db-utils] process.cwd():', process.cwd());
    }
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }
  return prisma;
}

/**
 * テスト用のデータベースをクリーンアップする
 */
export async function cleanupDatabase(): Promise<void> {
  const client = getPrismaClient();
  await client.todo.deleteMany({});
}

/**
 * テスト用のデータベース接続を閉じる
 */
export async function disconnectDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

/**
 * テスト用のPrismaクライアントを取得する（外部から使用する場合）
 */
export function getPrismaClientForTest(): PrismaClient {
  return getPrismaClient();
}

