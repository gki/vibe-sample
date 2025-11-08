import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreateTodo } from './useCreateTodo';

// Apollo Clientのモック
vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual('@apollo/client/react');
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

// window.alertのモック
const mockAlert = vi.fn();
window.alert = mockAlert;

import { useMutation } from '@apollo/client/react';

describe('useCreateTodo', () => {
  const mockCreateTodo = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();

    // useMutationのデフォルトモック設定
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockCreateTodo,
      {
        loading: false,
        error: undefined,
      },
    ]);
  });

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() => useCreateTodo());

    expect(result.current.title).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('タイトルを設定できる', () => {
    const { result } = renderHook(() => useCreateTodo());

    act(() => {
      result.current.setTitle('Test Todo');
    });

    expect(result.current.title).toBe('Test Todo');
  });

  it('タイトルが空の場合、バリデーションエラーを表示する', async () => {
    const { result } = renderHook(() => useCreateTodo({ onError: mockOnError }));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockAlert).toHaveBeenCalledWith('タイトルを入力してください。');
    expect(mockCreateTodo).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalled();
  });

  it('タイトルが100文字を超える場合、バリデーションエラーを表示する', async () => {
    const { result } = renderHook(() => useCreateTodo({ onError: mockOnError }));

    act(() => {
      result.current.setTitle('a'.repeat(101));
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockAlert).toHaveBeenCalledWith('タイトルは100文字以内で入力してください。');
    expect(mockCreateTodo).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalled();
  });

  it('タイトルに改行が含まれる場合、バリデーションエラーを表示する', async () => {
    const { result } = renderHook(() => useCreateTodo({ onError: mockOnError }));

    act(() => {
      result.current.setTitle('Test\nTodo');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockAlert).toHaveBeenCalledWith('タイトルに改行を含めることはできません。');
    expect(mockCreateTodo).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalled();
  });

  it('タイトルにタブが含まれる場合、バリデーションエラーを表示する', async () => {
    const { result } = renderHook(() => useCreateTodo({ onError: mockOnError }));

    act(() => {
      result.current.setTitle('Test\tTodo');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockAlert).toHaveBeenCalledWith('タイトルにタブを含めることはできません。');
    expect(mockCreateTodo).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalled();
  });

  it('有効なタイトルでhandleSubmitを呼び出すと、createTodoミューテーションを呼び出す', async () => {
    mockCreateTodo.mockResolvedValue({
      data: {
        createTodo: {
          id: 1,
          title: 'Test Todo',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    });

    const { result } = renderHook(() => useCreateTodo({ onSuccess: mockOnSuccess }));

    act(() => {
      result.current.setTitle('Test Todo');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        variables: { title: 'Test Todo' },
      });
    });

    expect(result.current.title).toBe('');
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('ミューテーションが失敗した場合、エラーアラートを表示する', async () => {
    const error = new Error('GraphQL error');
    mockCreateTodo.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateTodo({ onError: mockOnError }));

    act(() => {
      result.current.setTitle('Test Todo');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'TODOの登録に失敗しました。しばらく時間をおいて再度お試しください。'
      );
    });

    expect(mockOnError).toHaveBeenCalled();
    // エラー時は入力フィールドの内容を保持
    expect(result.current.title).toBe('Test Todo');
  });

  it('ローディング状態が正しく反映される', () => {
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockCreateTodo,
      {
        loading: true,
        error: undefined,
      },
    ]);

    const { result } = renderHook(() => useCreateTodo());

    expect(result.current.loading).toBe(true);
  });

  it('EnterキーでhandleSubmitを呼び出す', async () => {
    mockCreateTodo.mockResolvedValue({
      data: {
        createTodo: {
          id: 1,
          title: 'Test Todo',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    });

    const { result } = renderHook(() => useCreateTodo());

    act(() => {
      result.current.setTitle('Test Todo');
    });

    const mockEvent = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    await act(async () => {
      result.current.handleKeyDown(mockEvent);
    });

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalled();
    });
  });
});

