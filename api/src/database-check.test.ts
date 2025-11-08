import { describe, it, expect } from 'vitest';
import prisma from './prisma/client.js';

describe('Database Connection Check', () => {
  it('should be able to connect to the database', async () => {
    // データベースに接続できるかテスト
    const result = await prisma.$queryRaw<Array<{ value: bigint }>>`SELECT 1 as value`;
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].value).toBe(1n);
  });

  it('should have todos table', async () => {
    // todosテーブルが存在するか確認
    const tables = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master WHERE type='table' AND name='todos'
    `;
    expect(tables.length).toBeGreaterThan(0);
    expect(tables[0].name).toBe('todos');
  });

  it('should be able to query todos table structure', async () => {
    // テーブル構造を確認
    const columns = await prisma.$queryRaw<Array<{ name: string; type: string }>>`
      PRAGMA table_info(todos)
    `;
    expect(columns.length).toBeGreaterThan(0);

    const columnNames = columns.map((c) => c.name);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('title');
    expect(columnNames).toContain('completed');
    expect(columnNames).toContain('createdAt');
    expect(columnNames).toContain('updatedAt');
  });
});

