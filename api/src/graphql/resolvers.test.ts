import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createResolvers } from './schema.js';
import { GraphQLError } from 'graphql';
import type { PrismaClient } from '@prisma/client';

describe('GraphQL Resolvers - Unit Tests', () => {
  let mockPrisma: {
    todo: {
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
  };
  let resolvers: ReturnType<typeof createResolvers>;

  beforeEach(() => {
    // Prismaクライアントをモック化
    mockPrisma = {
      todo: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    // モックされたPrismaクライアントを使用してリゾルバーを作成
    resolvers = createResolvers(mockPrisma as unknown as PrismaClient);
  });

  describe('Query', () => {
    it('should have todos resolver', () => {
      expect(typeof resolvers.Query.todos).toBe('function');
    });

    it('should have todo resolver', () => {
      expect(typeof resolvers.Query.todo).toBe('function');
    });
  });

  describe('Mutation', () => {
    it('should have createTodo resolver', () => {
      expect(typeof resolvers.Mutation.createTodo).toBe('function');
    });

    it('should have updateTodo resolver', () => {
      expect(typeof resolvers.Mutation.updateTodo).toBe('function');
    });

    it('should have deleteTodo resolver', () => {
      expect(typeof resolvers.Mutation.deleteTodo).toBe('function');
    });
  });

  describe('createTodo validation', () => {
    it('タイトルが空文字の場合、エラーを投げる', async () => {
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: '' })
      ).rejects.toThrow(GraphQLError);

      await expect(
        resolvers.Mutation.createTodo(undefined, { title: '' })
      ).rejects.toThrow('タイトルを入力してください。');

      // Prismaのcreateは呼ばれない
      expect(mockPrisma.todo.create).not.toHaveBeenCalled();
    });

    it('タイトルが100文字を超える場合、エラーを投げる', async () => {
      const longTitle = 'a'.repeat(101);
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: longTitle })
      ).rejects.toThrow(GraphQLError);

      await expect(
        resolvers.Mutation.createTodo(undefined, { title: longTitle })
      ).rejects.toThrow('タイトルは100文字以内で入力してください。');

      // Prismaのcreateは呼ばれない
      expect(mockPrisma.todo.create).not.toHaveBeenCalled();
    });

    it('タイトルがちょうど100文字の場合、バリデーションを通過する', async () => {
      const title100 = 'a'.repeat(100);
      const mockTodo = {
        id: 1,
        title: title100,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.todo.create.mockResolvedValue(mockTodo);

      const result = await resolvers.Mutation.createTodo(undefined, {
        title: title100,
      });

      expect(result).toEqual(mockTodo);
      expect(mockPrisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: title100,
          completed: false,
        },
      });
    });

    it('タイトルに改行文字が含まれる場合、エラーを投げる', async () => {
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\nTodo' })
      ).rejects.toThrow(GraphQLError);

      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\nTodo' })
      ).rejects.toThrow('タイトルに改行を含めることはできません。');

      // Prismaのcreateは呼ばれない
      expect(mockPrisma.todo.create).not.toHaveBeenCalled();
    });

    it('タイトルにタブ文字が含まれる場合、エラーを投げる', async () => {
      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\tTodo' })
      ).rejects.toThrow(GraphQLError);

      await expect(
        resolvers.Mutation.createTodo(undefined, { title: 'Test\tTodo' })
      ).rejects.toThrow('タイトルにタブを含めることはできません。');

      // Prismaのcreateは呼ばれない
      expect(mockPrisma.todo.create).not.toHaveBeenCalled();
    });

    it('有効なタイトルを受け入れる', async () => {
      const mockTodo = {
        id: 1,
        title: 'Valid Todo Title',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.todo.create.mockResolvedValue(mockTodo);

      const result = await resolvers.Mutation.createTodo(undefined, {
        title: 'Valid Todo Title',
      });

      expect(result).toEqual(mockTodo);
      expect(result.title).toBe('Valid Todo Title');
      expect(result.completed).toBe(false);
      expect(mockPrisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: 'Valid Todo Title',
          completed: false,
        },
      });
    });

    it('タイトルが1文字の場合、バリデーションを通過する', async () => {
      const mockTodo = {
        id: 1,
        title: 'a',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.todo.create.mockResolvedValue(mockTodo);

      const result = await resolvers.Mutation.createTodo(undefined, {
        title: 'a',
      });

      expect(result).toEqual(mockTodo);
      expect(mockPrisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: 'a',
          completed: false,
        },
      });
    });

    it('タイトルに空白文字が含まれる場合、バリデーションを通過する', async () => {
      const mockTodo = {
        id: 1,
        title: '  Valid Todo Title  ',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.todo.create.mockResolvedValue(mockTodo);

      const result = await resolvers.Mutation.createTodo(undefined, {
        title: '  Valid Todo Title  ',
      });

      expect(result).toEqual(mockTodo);
      expect(mockPrisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: '  Valid Todo Title  ',
          completed: false,
        },
      });
    });
  });
});

