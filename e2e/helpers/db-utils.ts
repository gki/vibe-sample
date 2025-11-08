import { PrismaClient } from '@prisma/client';

// シングルトンパターンでPrismaクライアントを管理
let prisma: PrismaClient | null = null;

/**
 * Prismaクライアントを取得する（シングルトン）
 */
function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./api/prisma/dev.db',
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

