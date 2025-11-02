import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { graphqlServer } from '@hono/graphql-server';
import { serve } from '@hono/node-server';
import { schema } from './graphql/schema.js';

const app = new Hono();

// CORS設定: 開発環境では localhost:3000 からのリクエストを許可
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(
  '/graphql',
  graphqlServer({
    schema,
    graphiql: true, // GraphQL Playgroundを有効化（開発環境用）
  })
);

const port = Number(process.env.PORT) || 3001;

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

console.log(`🚀 Server running at http://localhost:${port}/graphql`);

serve({
  fetch: app.fetch,
  port,
});

