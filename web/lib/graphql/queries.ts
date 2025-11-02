import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

export const GET_TODO = gql`
  query GetTodo($id: Int!) {
    todo(id: $id) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

