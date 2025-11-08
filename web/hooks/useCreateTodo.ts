import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_TODO } from '@/lib/graphql/mutations';
import { GET_TODOS } from '@/lib/graphql/queries';
import { validateTodoTitle } from '@/lib/validation/todo';

interface UseCreateTodoOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCreateTodo(options?: UseCreateTodoOptions) {
  const [title, setTitle] = useState('');
  const [createTodo, { loading, error }] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // バリデーション
    const validation = validateTodoTitle(title);
    if (!validation.isValid) {
      const errorMessage = validation.errorMessage || 'バリデーションエラーが発生しました。';
      window.alert(errorMessage);
      if (options?.onError) {
        options.onError(new Error(errorMessage));
      }
      return;
    }

    try {
      await createTodo({
        variables: { title },
      });

      // 成功後、入力フィールドをクリア
      setTitle('');
      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      const errorMessage =
        'TODOの登録に失敗しました。しばらく時間をおいて再度お試しください。';
      window.alert(errorMessage);
      if (options?.onError) {
        options.onError(err instanceof Error ? err : new Error(errorMessage));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return {
    title,
    setTitle,
    loading,
    error,
    handleSubmit,
    handleKeyDown,
  };
}

