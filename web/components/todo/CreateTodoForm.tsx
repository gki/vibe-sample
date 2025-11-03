'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_TODO } from '@/lib/graphql/mutations';
import { GET_TODOS } from '@/lib/graphql/queries';
import { validateTodoTitle } from '@/lib/validation/todo';

interface CreateTodoFormProps {
  refetch: () => void;
}

export function CreateTodoForm({ refetch }: CreateTodoFormProps) {
  const [title, setTitle] = useState('');
  const [createTodo, { loading }] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const validation = validateTodoTitle(title);
    if (!validation.isValid) {
      window.alert(validation.errorMessage);
      return;
    }

    try {
      await createTodo({
        variables: { title },
      });

      // 成功後、入力フィールドをクリア
      setTitle('');
      // 一覧を更新（refetchQueriesで自動的に更新されるが、念のため）
      refetch();
    } catch (error) {
      // エラー時はalertで表示
      window.alert(
        'TODOの登録に失敗しました。しばらく時間をおいて再度お試しください。'
      );
      // エラー時も入力フィールドの内容を保持
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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

