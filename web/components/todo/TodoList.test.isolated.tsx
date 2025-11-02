import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { GET_TODOS } from '@/lib/graphql/queries';

// Issue #3677対応: テストごとにインポートを分離
describe('TodoList - Isolated Test 1', () => {
    it('should render loading state', async () => {
        // 動的インポートで分離
        const { TodoList } = await import('./TodoList');

        const mockLink = new MockLink([]);
        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: mockLink,
        });

        render(
            <ApolloProvider client={client}>
                <TodoList />
            </ApolloProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});

