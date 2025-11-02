import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $title: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id)
  }
`;

