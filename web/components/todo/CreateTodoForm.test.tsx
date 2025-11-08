import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

// useCreateTodoフックのモック
vi.mock('@/hooks/useCreateTodo', () => ({
  useCreateTodo: vi.fn(),
}));

// window.alertのモック
const mockAlert = vi.fn();
window.alert = mockAlert;

import { useCreateTodo } from '@/hooks/useCreateTodo';
import { CreateTodoForm } from './CreateTodoForm';

describe('CreateTodoForm Component', () => {
  const mockRefetch = vi.fn();
  const mockSetTitle = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockHandleKeyDown = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockAlert.mockClear();

    // useCreateTodoのデフォルトモック設定
    (useCreateTodo as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      title: '',
      setTitle: mockSetTitle,
      loading: false,
      error: undefined,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
    });
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

  it('ユーザーが入力するとsetTitleが呼ばれる', () => {
    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Todo' } });

    expect(mockSetTitle).toHaveBeenCalledWith('Test Todo');
  });

  it('登録ボタンをクリックするとhandleSubmitが呼ばれる', () => {
    render(<CreateTodoForm refetch={mockRefetch} />);

    const button = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(button);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('Enterキーを押した場合、handleKeyDownが呼ばれる', () => {
    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockHandleKeyDown).toHaveBeenCalled();
  });

  it('ミューテーション実行中はボタンを無効化し、ローディング表示を行う', () => {
    (useCreateTodo as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      title: '',
      setTitle: mockSetTitle,
      loading: true,
      error: undefined,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
    });

    render(<CreateTodoForm refetch={mockRefetch} />);

    const button = screen.getByRole('button', { name: /登録中/i });

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('登録中...');
  });

  it('エラー発生時は入力フィールドの内容が保持される', () => {
    (useCreateTodo as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      title: 'Test Todo',
      setTitle: mockSetTitle,
      loading: false,
      error: new Error('GraphQL error'),
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
    });

    render(<CreateTodoForm refetch={mockRefetch} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Test Todo');
  });

  it('ローディング中はボタンが無効化され、フォーム送信ができない', () => {
    (useCreateTodo as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      title: '',
      setTitle: mockSetTitle,
      loading: true,
      error: undefined,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
    });

    render(<CreateTodoForm refetch={mockRefetch} />);

    const button = screen.getByRole('button', { name: /登録中/i });

    expect(button).toBeDisabled();
    fireEvent.click(button);

    // ローディング中はhandleSubmitが呼ばれない（フォーム送信が無効化されている）
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });
});

