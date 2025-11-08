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
    it('should create a new todo', async () => {
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

    it('should reject empty title', async () => {
      const resolvers = createResolvers(prisma);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: '' })
      ).rejects.toThrow('タイトルを入力してください。');
    });

    it('should reject title longer than 100 characters', async () => {
      const resolvers = createResolvers(prisma);
      const longTitle = 'a'.repeat(101);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: longTitle })
      ).rejects.toThrow('タイトルは100文字以内で入力してください。');
    });

    it('should reject title with newline', async () => {
      const resolvers = createResolvers(prisma);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\nTodo' })
      ).rejects.toThrow('タイトルに改行を含めることはできません。');
    });

    it('should reject title with tab', async () => {
      const resolvers = createResolvers(prisma);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\tTodo' })
      ).rejects.toThrow('タイトルにタブを含めることはできません。');
    });
  });

  describe('todos query', () => {
    it('should fetch all todos', async () => {
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

