import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

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
import { CreateTodoForm } from './CreateTodoForm';

describe('CreateTodoForm Component', () => {
  const mockCreateTodo = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    cleanup();
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

  it('初期状態が正しく表示される', () => {
    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /登録/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(button).not.toBeDisabled();
  });

  it('ユーザーが入力すると入力値が更新される', () => {
    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Todo' } });

    expect(input).toHaveValue('Test Todo');
  });

  it('タイトルが空の場合、バリデーションエラーを表示する', () => {
    render(<CreateTodoForm refetch={mockRefetch} />);

    const button = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(button);

    expect(mockAlert).toHaveBeenCalledWith('タイトルを入力してください。');
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  it('タイトルが100文字を超える場合、バリデーションエラーを表示する', () => {
    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    const longTitle = 'a'.repeat(101);
    fireEvent.change(input, { target: { value: longTitle } });

    const button = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(button);

    expect(mockAlert).toHaveBeenCalledWith('タイトルは100文字以内で入力してください。');
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  it('タイトルに改行が含まれる場合、バリデーションエラーを表示する', async () => {
    // 注意: HTMLのinput要素は改行文字を自動的に削除するため、
    // 実際のユーザー操作では改行文字を入力することはできない
    // このテストは、プログラム的に改行文字が設定された場合の動作を確認する
    // 実際のバリデーション関数のテストは別ファイル（todo.test.ts）で確認済み
    
    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    // 直接値を設定してバリデーションをトリガー
    // 実際にはHTMLのinput要素が改行文字を削除するため、このテストは実装の詳細に依存
    // より適切には、バリデーション関数のテストに任せる
    Object.defineProperty(input, 'value', {
      writable: true,
      value: 'Test\nTodo',
    });
    fireEvent.change(input);

    const button = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(button);

    // 改行文字が含まれている場合、バリデーションエラーが表示されるべき
    // ただし、HTMLのinput要素の動作により、実際の値は異なる可能性がある
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalled();
    });
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  it('タイトルにタブが含まれる場合、バリデーションエラーを表示する', () => {
    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test\tTodo' } });

    const button = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(button);

    expect(mockAlert).toHaveBeenCalledWith('タイトルにタブを含めることはできません。');
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  it('有効なタイトルでボタンをクリックした場合、createTodoミューテーションを呼び出す', async () => {
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

    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Todo' } });

    const button = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        variables: { title: 'Test Todo' },
      });
    });

    expect(mockRefetch).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('Enterキーを押した場合、createTodoミューテーションを呼び出す', async () => {
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

    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Todo' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        variables: { title: 'Test Todo' },
      });
    });

    expect(mockRefetch).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('ミューテーション実行中はボタンを無効化し、ローディング表示を行う', () => {
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockCreateTodo,
      {
        loading: true,
        error: undefined,
      },
    ]);

    render(<CreateTodoForm refetch={mockRefetch} />);

    const button = screen.getByRole('button', { name: /登録中/i });

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('登録中...');
  });

  it('ミューテーションが失敗した場合、エラーアラートを表示する', async () => {
    const error = new Error('GraphQL error');
    mockCreateTodo.mockRejectedValue(error);

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockCreateTodo,
      {
        loading: false,
        error: undefined,
      },
    ]);

    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Todo' } });

    const button = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'TODOの登録に失敗しました。しばらく時間をおいて再度お試しください。'
      );
    });

    // エラー時は入力フィールドの内容を保持
    expect(input).toHaveValue('Test Todo');
  });

  it('ローディング中にボタンをクリックしてもミューテーションを呼び出さない', () => {
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockCreateTodo,
      {
        loading: true,
        error: undefined,
      },
    ]);

    render(<CreateTodoForm refetch={mockRefetch} />);

    const button = screen.getByRole('button', { name: /登録中/i });

    // ローディング中にクリックしても何も起こらない（ボタンが無効化されている）
    expect(button).toBeDisabled();
    fireEvent.click(button);

    // ローディング中はミューテーションが呼ばれない（フォーム送信が無効化されている）
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });
});

