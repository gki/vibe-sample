'use client';

import React from 'react';
import { useCreateTodo } from '@/hooks/useCreateTodo';

interface CreateTodoFormProps {
  refetch: () => void;
}

export function CreateTodoForm({ refetch }: CreateTodoFormProps) {
  const { title, setTitle, loading, handleSubmit, handleKeyDown } = useCreateTodo({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="TODOのタイトルを入力"
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '登録中...' : '登録'}
        </button>
      </div>
    </form>
  );
}

