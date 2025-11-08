import { describe, it, expect } from 'vitest';
import { GET_TODOS, GET_TODO } from './queries';

describe('GraphQL Queries', () => {
    it('GET_TODOSクエリがエクスポートされていること', () => {
        expect(typeof GET_TODOS).toBe('object');
        expect(GET_TODOS.kind).toBe('Document');
        expect(GET_TODOS.definitions).toBeDefined();
    });

    it('GET_TODOクエリがエクスポートされていること', () => {
        expect(typeof GET_TODO).toBe('object');
        expect(GET_TODO.kind).toBe('Document');
        expect(GET_TODO.definitions).toBeDefined();
    });
});

