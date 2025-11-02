'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from '@/lib/graphql/queries';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export function TodoList() {
    const { loading, error, data } = useQuery<{ todos: Todo[] }>(GET_TODOS);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data || data.todos.length === 0) return <div>No todos</div>;

    return (
        <ul>
            {data.todos.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
            ))}
        </ul>
    );
}

