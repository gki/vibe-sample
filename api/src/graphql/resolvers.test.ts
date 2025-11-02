import { describe, it, expect } from 'vitest';
import { resolvers } from './schema.js';

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
});

