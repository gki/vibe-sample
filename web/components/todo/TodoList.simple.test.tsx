import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';

test('TodoList component exists', () => {
  expect(TodoList).toBeDefined();
  expect(typeof TodoList).toBe('function');
});

