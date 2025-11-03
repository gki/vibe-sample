import { describe, it, expect } from 'vitest';
import { validateTodoTitle } from './todo';

describe('validateTodoTitle', () => {
  it('タイトルが空文字の場合、エラーを返す', () => {
    const result = validateTodoTitle('');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('タイトルを入力してください。');
  });

  it('タイトルが100文字を超える場合、エラーを返す', () => {
    const longTitle = 'a'.repeat(101);
    const result = validateTodoTitle(longTitle);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('タイトルは100文字以内で入力してください。');
  });

  it('タイトルに改行文字が含まれる場合、エラーを返す', () => {
    const result = validateTodoTitle('Test\nTodo');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('タイトルに改行を含めることはできません。');
  });

  it('タイトルにタブ文字が含まれる場合、エラーを返す', () => {
    const result = validateTodoTitle('Test\tTodo');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('タイトルにタブを含めることはできません。');
  });

  it('有効なタイトルの場合、バリデーション成功を返す', () => {
    const result = validateTodoTitle('Valid Todo Title');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('タイトルがちょうど100文字の場合、バリデーション成功を返す', () => {
    const title100 = 'a'.repeat(100);
    const result = validateTodoTitle(title100);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('タイトルの前後に空白がある場合、バリデーション成功を返す', () => {
    const result = validateTodoTitle('  Valid Todo Title  ');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });
});

