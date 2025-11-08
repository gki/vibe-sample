import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createResolvers } from './schema.js';
import prisma from '../prisma/client.js';

describe('GraphQL Resolvers Integration Tests', () => {
  beforeAll(async () => {
    // テスト前にデータベースをクリーンアップ
    await prisma.todo.deleteMany({});
  });

  afterAll(async () => {
    // テスト後にデータをクリーンアップ
    await prisma.todo.deleteMany({});
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // 各テスト前にデータベースをクリーンアップ
    await prisma.todo.deleteMany({});
  });

  describe('createTodo mutation', () => {
    it('新しいTODOを作成できること', async () => {
      const resolvers = createResolvers(prisma);
      const result = await resolvers.Mutation.createTodo(undefined, {
        title: 'Test Todo',
      });

      expect(result.id).toBeGreaterThan(0);
      expect(result.title).toBe('Test Todo');
      expect(result.completed).toBe(false);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('空のタイトルを拒否すること', async () => {
      const resolvers = createResolvers(prisma);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: '' })
      ).rejects.toThrow('タイトルを入力してください。');
    });

    it('100文字を超えるタイトルを拒否すること', async () => {
      const resolvers = createResolvers(prisma);
      const longTitle = 'a'.repeat(101);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: longTitle })
      ).rejects.toThrow('タイトルは100文字以内で入力してください。');
    });

    it('改行を含むタイトルを拒否すること', async () => {
      const resolvers = createResolvers(prisma);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\nTodo' })
      ).rejects.toThrow('タイトルに改行を含めることはできません。');
    });

    it('タブを含むタイトルを拒否すること', async () => {
      const resolvers = createResolvers(prisma);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\tTodo' })
      ).rejects.toThrow('タイトルにタブを含めることはできません。');
    });
  });

  describe('todos query', () => {
    it('全てのTODOを取得できること', async () => {
      // テストデータを作成
      await prisma.todo.createMany({
        data: [
          { title: 'Todo 1', completed: false },
          { title: 'Todo 2', completed: true },
        ],
      });

      const resolvers = createResolvers(prisma);
      const result = await resolvers.Query.todos();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);

      const todo1 = result.find((t) => t.title === 'Todo 1');
      const todo2 = result.find((t) => t.title === 'Todo 2');
      expect(todo1).not.toBeUndefined();
      expect(todo2).not.toBeUndefined();
      expect(todo1?.completed).toBe(false);
      expect(todo2?.completed).toBe(true);
    });
  });
});

