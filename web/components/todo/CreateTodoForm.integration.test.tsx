import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Apollo Clientのモック
vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual('@apollo/client/react');
  return {
    ...actual,
    useMutation: vi.fn(),
    useQuery: vi.fn(),
  };
});

// window.alertのモック
const mockAlert = vi.fn();
window.alert = mockAlert;

import { useMutation, useQuery } from '@apollo/client/react';
import { CreateTodoForm } from './CreateTodoForm';
import { TodoList } from './TodoList';

describe('CreateTodoForm Integration Tests', () => {
  const mockCreateTodo = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();

    // useMutationのモック設定
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockCreateTodo,
      {
        loading: false,
        error: undefined,
      },
    ]);

    // useQueryのモック設定（TodoList用）
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        todos: [],
      },
      refetch: mockRefetch,
    });
  });

  it('CreateTodoFormとTodoListが連携して動作する', async () => {
    // 初期状態ではTODOが空
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        todos: [],
      },
      refetch: mockRefetch,
    });

    const { rerender } = render(
      <div>
        <CreateTodoForm refetch={mockRefetch} />
        <TodoList />
      </div>
    );

    // 初期状態を確認
    expect(screen.getByText('No todos')).toBeInTheDocument();

    // TODOを作成
    mockCreateTodo.mockResolvedValue({
      data: {
        createTodo: {
          id: 1,
          title: 'Integration Test Todo',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    });

    const input = screen.getByPlaceholderText('TODOのタイトルを入力');
    fireEvent.change(input, { target: { value: 'Integration Test Todo' } });

    const button = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(button);

    // createTodoが呼ばれることを確認
    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        variables: { title: 'Integration Test Todo' },
      });
    });

    // refetchが呼ばれることを確認
    expect(mockRefetch).toHaveBeenCalled();

    // TODOが作成された後の状態をモック
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        todos: [
          {
            id: 1,
            title: 'Integration Test Todo',
            completed: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      },
      refetch: mockRefetch,
    });

    // コンポーネントを再レンダリング
    rerender(
      <div>
        <CreateTodoForm refetch={mockRefetch} />
        <TodoList />
      </div>
    );

    // TODOが一覧に表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('Integration Test Todo')).toBeInTheDocument();
    });
  });

  it('複数のTODOを作成できる', async () => {
    const todos: Array<{
      id: number;
      title: string;
      completed: boolean;
      createdAt: string;
      updatedAt: string;
    }> = [];

    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        todos,
      },
      refetch: mockRefetch,
    });

    const { rerender } = render(
      <div>
        <CreateTodoForm refetch={mockRefetch} />
        <TodoList />
      </div>
    );

    // 最初のTODOを作成
    mockCreateTodo.mockResolvedValueOnce({
      data: {
        createTodo: {
          id: 1,
          title: 'Todo 1',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    });

    const input = screen.getByPlaceholderText('TODOのタイトルを入力');
    fireEvent.change(input, { target: { value: 'Todo 1' } });
    fireEvent.click(screen.getByRole('button', { name: /登録/i }));

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        variables: { title: 'Todo 1' },
      });
    });

    todos.push({
      id: 1,
      title: 'Todo 1',
      completed: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });

    // 2つ目のTODOを作成
    mockCreateTodo.mockResolvedValueOnce({
      data: {
        createTodo: {
          id: 2,
          title: 'Todo 2',
          completed: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    });

    fireEvent.change(input, { target: { value: 'Todo 2' } });
    fireEvent.click(screen.getByRole('button', { name: /登録/i }));

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        variables: { title: 'Todo 2' },
      });
    });

    todos.push({
      id: 2,
      title: 'Todo 2',
      completed: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });

    // 更新された状態をモック
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        todos,
      },
      refetch: mockRefetch,
    });

    rerender(
      <div>
        <CreateTodoForm refetch={mockRefetch} />
        <TodoList />
      </div>
    );

    // 両方のTODOが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Todo 2')).toBeInTheDocument();
    });
  });
});

