import { describe, it, expect } from 'vitest';
import { apolloClient } from './client';
import { InMemoryCache } from '@apollo/client';

describe('Apollo Client', () => {
  it('Apollo Clientインスタンスを作成できること', () => {
    expect(apolloClient).toBeInstanceOf(Object);
    expect(apolloClient.link).toBeDefined();
  });

  it('InMemoryCacheが設定されていること', () => {
    expect(apolloClient.cache).toBeInstanceOf(InMemoryCache);
  });
});

