import { describe, it, expect, afterEach } from 'vitest';
import { resolvers } from './schema.js';
import prisma from '../prisma/client.js';

describe('GraphQL Resolvers', () => {
  describe('Query', () => {
    it('should have todos resolver', () => {
      expect(resolvers.Query).toBeDefined();
      expect(resolvers.Query.todos).toBeDefined();
      expect(typeof resolvers.Query.todos).toBe('function');
    });

    it('should have todo resolver', () => {
      expect(resolvers.Query.todo).toBeDefined();
      expect(typeof resolvers.Query.todo).toBe('function');
    });
  });

  describe('Mutation', () => {
    it('should have createTodo resolver', () => {
      expect(resolvers.Mutation).toBeDefined();
      expect(resolvers.Mutation.createTodo).toBeDefined();
      expect(typeof resolvers.Mutation.createTodo).toBe('function');
    });

    it('should have updateTodo resolver', () => {
      expect(resolvers.Mutation.updateTodo).toBeDefined();
      expect(typeof resolvers.Mutation.updateTodo).toBe('function');
    });

    it('should have deleteTodo resolver', () => {
      expect(resolvers.Mutation.deleteTodo).toBeDefined();
      expect(typeof resolvers.Mutation.deleteTodo).toBe('function');
    });
  });

  describe('createTodo validation', () => {
    afterEach(async () => {
      // 各テスト後に作成されたTODOをクリーンアップ
      await prisma.todo.deleteMany({
        where: {
          title: {
            in: [
              '',
              'a'.repeat(101),
              'Test\nTodo',
              'Test\tTodo',
              'Valid Todo Title',
            ],
          },
        },
      });
    });

    it('タイトルが空文字の場合、エラーを投げる', async () => {
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: '' })
      ).rejects.toThrow();
    });

    it('タイトルが100文字を超える場合、エラーを投げる', async () => {
      const longTitle = 'a'.repeat(101);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: longTitle })
      ).rejects.toThrow();
    });

    it('タイトルに改行文字が含まれる場合、エラーを投げる', async () => {
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\nTodo' })
      ).rejects.toThrow();
    });

    it('タイトルにタブ文字が含まれる場合、エラーを投げる', async () => {
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\tTodo' })
      ).rejects.toThrow();
    });

    it('有効なタイトルを受け入れる', async () => {
      const result = await resolvers.Mutation.createTodo(undefined, {
        title: 'Valid Todo Title',
      });
      expect(result).toBeDefined();
      expect(result.title).toBe('Valid Todo Title');
    });
  });
});

