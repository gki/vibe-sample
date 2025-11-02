import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
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

export const resolvers = {
  Query: {
    todos: async () => {
      return await prisma.todo.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },
    todo: async (_: unknown, args: { id: number }) => {
      return await prisma.todo.findUnique({
        where: { id: args.id },
      });
    },
  },
  Mutation: {
    createTodo: async (_: unknown, args: { title: string }) => {
      return await prisma.todo.create({
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

      return await prisma.todo.update({
        where: { id: args.id },
        data: updateData,
      });
    },
    deleteTodo: async (_: unknown, args: { id: number }) => {
      await prisma.todo.delete({
        where: { id: args.id },
      });
      return true;
    },
  },
};

// makeExecutableSchemaでスキーマとリゾルバーを統合
export const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

