import { describe, it, expect } from 'vitest';
import { apolloClient } from './client';
import { InMemoryCache } from '@apollo/client';

describe('Apollo Client', () => {
  it('should create Apollo Client instance', () => {
    expect(apolloClient).toBeInstanceOf(Object);
    expect(apolloClient.link).toBeDefined();
  });

  it('should have InMemoryCache configured', () => {
    expect(apolloClient.cache).toBeInstanceOf(InMemoryCache);
  });
});

