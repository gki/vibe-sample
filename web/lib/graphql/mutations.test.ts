import { describe, it, expect } from 'vitest';
import { CREATE_TODO, UPDATE_TODO, DELETE_TODO } from './mutations';

describe('GraphQL Mutations', () => {
  it('should export CREATE_TODO mutation', () => {
    expect(typeof CREATE_TODO).toBe('object');
    expect(CREATE_TODO.kind).toBe('Document');
    expect(CREATE_TODO.definitions).toBeDefined();
  });

  it('should export UPDATE_TODO mutation', () => {
    expect(typeof UPDATE_TODO).toBe('object');
    expect(UPDATE_TODO.kind).toBe('Document');
    expect(UPDATE_TODO.definitions).toBeDefined();
  });

  it('should export DELETE_TODO mutation', () => {
    expect(typeof DELETE_TODO).toBe('object');
    expect(DELETE_TODO.kind).toBe('Document');
    expect(DELETE_TODO.definitions).toBeDefined();
  });
});

