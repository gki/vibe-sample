import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema, GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';
import prisma from '../prisma/client.js';

export const typeDefs = `
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

export const createResolvers = (prismaClient: PrismaClient = prisma) => ({
  Query: {
    todos: async () => {
      return await prismaClient.todo.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },
    todo: async (_: unknown, args: { id: number }) => {
      return await prismaClient.todo.findUnique({
        where: { id: args.id },
      });
    },
  },
  Mutation: {
    createTodo: async (_: unknown, args: { title: string }) => {
      // バリデーション: 空文字チェック
      if (args.title === '') {
        throw new GraphQLError('タイトルを入力してください。', {
          extensions: { code: 'VALIDATION_ERROR' },
        });
      }

      // バリデーション: 100文字制限
      if (args.title.length > 100) {
        throw new GraphQLError('タイトルは100文字以内で入力してください。', {
          extensions: { code: 'VALIDATION_ERROR' },
        });
      }

      // バリデーション: 改行文字チェック
      if (args.title.includes('\n')) {
        throw new GraphQLError('タイトルに改行を含めることはできません。', {
          extensions: { code: 'VALIDATION_ERROR' },
        });
      }

      // バリデーション: タブ文字チェック
      if (args.title.includes('\t')) {
        throw new GraphQLError('タイトルにタブを含めることはできません。', {
          extensions: { code: 'VALIDATION_ERROR' },
        });
      }

      return await prismaClient.todo.create({
        data: {
          title: args.title,
          completed: false,
        },
      });
    },
    updateTodo: async (
      _: unknown,
      args: { id: number; title?: string; completed?: boolean }
    ) => {
      const updateData: { title?: string; completed?: boolean } = {};
      if (args.title !== undefined) updateData.title = args.title;
      if (args.completed !== undefined) updateData.completed = args.completed;

      return await prismaClient.todo.update({
        where: { id: args.id },
        data: updateData,
      });
    },
    deleteTodo: async (_: unknown, args: { id: number }) => {
      await prismaClient.todo.delete({
        where: { id: args.id },
      });
      return true;
    },
  },
});

// 後方互換性のため、デフォルトのリゾルバーをエクスポート
export const resolvers = createResolvers();

// makeExecutableSchemaでスキーマとリゾルバーを統合
export const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

