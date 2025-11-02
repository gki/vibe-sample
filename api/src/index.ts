import { Hono } from 'hono';
import { graphqlServer } from '@hono/graphql-server';
import { schema, resolvers } from './graphql/schema.js';

const app = new Hono();

app.use(
  '/graphql',
  graphqlServer({
    schema,
    rootResolver: resolvers,
  })
);

const port = Number(process.env.PORT) || 3001;

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

console.log(`🚀 Server running at http://localhost:${port}/graphql`);

export default {
  port,
  fetch: app.fetch,
};

