'use client';

import { TodoList } from '@/components/todo/TodoList';
import { CreateTodoForm } from '@/components/todo/CreateTodoForm';
import { useQuery } from '@apollo/client/react';
import { GET_TODOS } from '@/lib/graphql/queries';

export default function Home() {
  const { refetch } = useQuery(GET_TODOS);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
        TODO App
      </h1>
      <CreateTodoForm refetch={() => refetch()} />
      <TodoList />
    </div>
  );
}
