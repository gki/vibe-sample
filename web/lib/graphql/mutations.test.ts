import { describe, it, expect } from 'vitest';
import { CREATE_TODO, UPDATE_TODO, DELETE_TODO } from './mutations';

describe('GraphQL Mutations', () => {
  it('CREATE_TODOミューテーションがエクスポートされていること', () => {
    expect(typeof CREATE_TODO).toBe('object');
    expect(CREATE_TODO.kind).toBe('Document');
    expect(CREATE_TODO.definitions).toBeDefined();
  });

  it('UPDATE_TODOミューテーションがエクスポートされていること', () => {
    expect(typeof UPDATE_TODO).toBe('object');
    expect(UPDATE_TODO.kind).toBe('Document');
    expect(UPDATE_TODO.definitions).toBeDefined();
  });

  it('DELETE_TODOミューテーションがエクスポートされていること', () => {
    expect(typeof DELETE_TODO).toBe('object');
    expect(DELETE_TODO.kind).toBe('Document');
    expect(DELETE_TODO.definitions).toBeDefined();
  });
});

