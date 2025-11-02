import { describe, it, expect, beforeAll, afterAll } from 'vitest';
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

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const todo = await prisma.todo.create({
        data: {
          title: 'Test Todo',
          completed: false,
        },
      });

      expect(todo).toBeDefined();
      expect(todo.id).toBeGreaterThan(0);
      expect(todo.title).toBe('Test Todo');
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.updatedAt).toBeInstanceOf(Date);
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

      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: 'desc' },
      });

      expect(todos.length).toBeGreaterThanOrEqual(2);
      expect(todos[0].title).toBe('Todo 1');
      expect(todos[1].title).toBe('Todo 2');
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const todo = await prisma.todo.create({
        data: {
          title: 'Original Title',
          completed: false,
        },
      });

      const updated = await prisma.todo.update({
        where: { id: todo.id },
        data: {
          title: 'Updated Title',
          completed: true,
        },
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.completed).toBe(true);
      expect(updated.id).toBe(todo.id);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const todo = await prisma.todo.create({
        data: {
          title: 'To Delete',
          completed: false,
        },
      });

      await prisma.todo.delete({
        where: { id: todo.id },
      });

      const deleted = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(deleted).toBeNull();
    });
  });
});

