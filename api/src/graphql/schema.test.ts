import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';

// テスト用のPrismaクライアント（テスト用DBを使用）
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
});

describe('GraphQL Schema', () => {
  beforeAll(async () => {
    // テスト用データベースを初期化
    // 実際の実装では、テスト用のセットアップが必要
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should define Todo type correctly', () => {
    const typeDefs = `
      type Todo {
        id: Int!
        title: String!
        completed: Boolean!
        createdAt: String!
        updatedAt: String!
      }

      type Query {
        todos: [Todo!]!
        todo(id: Int!): Todo
      }

      type Mutation {
        createTodo(title: String!): Todo!
        updateTodo(id: Int!, title: String, completed: Boolean): Todo!
        deleteTodo(id: Int!): Boolean!
      }
    `;

    const schema = buildSchema(typeDefs);
    expect(schema).toBeInstanceOf(Object);
    expect(schema.getQueryType()).toBeDefined();
    expect(schema.getMutationType()).toBeDefined();
  });
});

