import { describe, it, expect } from 'vitest';
import { apolloClient } from './client';

describe('Apollo Client', () => {
  it('should create Apollo Client instance', () => {
    expect(apolloClient).toBeDefined();
  });

  it('should have InMemoryCache configured', () => {
    expect(apolloClient.cache).toBeDefined();
  });
});

