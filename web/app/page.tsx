import { TodoList } from '@/components/todo/TodoList';

export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
        TODO App
      </h1>
      <TodoList />
    </div>
  );
}
