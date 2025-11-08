import { describe, it, expect } from 'vitest';
import { GET_TODOS, GET_TODO } from './queries';

describe('GraphQL Queries', () => {
    it('should export GET_TODOS query', () => {
        expect(typeof GET_TODOS).toBe('object');
        expect(GET_TODOS.kind).toBe('Document');
        expect(GET_TODOS.definitions).toBeDefined();
    });

    it('should export GET_TODO query', () => {
        expect(typeof GET_TODO).toBe('object');
        expect(GET_TODO.kind).toBe('Document');
        expect(GET_TODO.definitions).toBeDefined();
    });
});

