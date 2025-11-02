import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Issue #3677対応: useQueryをモックしてApollo Clientへの依存を回避
// @apollo/client/reactからインポートしているため、こちらをモック
vi.mock('@apollo/client/react', async () => {
    const actual = await vi.importActual('@apollo/client/react');
    return {
        ...actual,
        useQuery: vi.fn(),
    };
});

import { useQuery } from '@apollo/client/react';
import { TodoList } from './TodoList';

describe('TodoList Component', () => {
    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

      it('should render loading state initially', () => {
        // useQueryをモック
        (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
          loading: true,
          error: undefined,
          data: undefined,
        });

        render(<TodoList />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      it('should render todos when data is loaded', () => {
        (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            loading: false,
            error: undefined,
            data: {
                todos: [
                    {
                        id: 1,
                        title: 'Test Todo 1',
                        completed: false,
                        createdAt: '2024-01-01T00:00:00Z',
                        updatedAt: '2024-01-01T00:00:00Z',
                    },
                ],
            },
        });

        render(<TodoList />);
        expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

      it('should render empty state when no todos', () => {
        (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
          loading: false,
          error: undefined,
          data: {
            todos: [],
          },
        });

        render(<TodoList />);
        expect(screen.getByText('No todos')).toBeInTheDocument();
      });

      it('should render error state', () => {
        (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            loading: false,
            error: { message: 'GraphQL error' },
            data: undefined,
        });

        render(<TodoList />);
        expect(screen.getByText('Error: GraphQL error')).toBeInTheDocument();
    });
});
