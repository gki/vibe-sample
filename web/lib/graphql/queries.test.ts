import { describe, it, expect } from 'vitest';
import { GET_TODOS, GET_TODO } from './queries';

describe('GraphQL Queries', () => {
    it('should export GET_TODOS query', () => {
        expect(GET_TODOS).toBeDefined();
        expect(typeof GET_TODOS).toBe('object');
    });

    it('should export GET_TODO query', () => {
        expect(GET_TODO).toBeDefined();
        expect(typeof GET_TODO).toBe('object');
    });
});

