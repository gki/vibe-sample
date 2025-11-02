import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { graphqlServer } from '@hono/graphql-server';
import { schema, resolvers } from './graphql/schema.js';

describe('Hono GraphQL Server Setup', () => {
  it('should create Hono app with GraphQL endpoint', () => {
    const app = new Hono();

    app.use(
      '/graphql',
      graphqlServer({
        schema,
        rootResolver: resolvers,
      })
    );

    expect(app).toBeDefined();
  });

  it('should have health check endpoint', async () => {
    const app = new Hono();

    app.get('/health', (c) => {
      return c.json({ status: 'ok' });
    });

    const res = await app.request('http://localhost/health');
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ status: 'ok' });
  });
});

