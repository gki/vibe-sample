/**
 * TODOタイトルのバリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * TODOタイトルをバリデーションする
 * @param title バリデーション対象のタイトル
 * @returns バリデーション結果
 */
export function validateTodoTitle(title: string): ValidationResult {
  // 空文字チェック
  if (title === '') {
    return {
      isValid: false,
      errorMessage: 'タイトルを入力してください。',
    };
  }

  // 100文字制限チェック
  if (title.length > 100) {
    return {
      isValid: false,
      errorMessage: 'タイトルは100文字以内で入力してください。',
    };
  }

  // 改行文字チェック
  if (title.includes('\n')) {
    return {
      isValid: false,
      errorMessage: 'タイトルに改行を含めることはできません。',
    };
  }

  // タブ文字チェック
  if (title.includes('\t')) {
    return {
      isValid: false,
      errorMessage: 'タイトルにタブを含めることはできません。',
    };
  }

  return {
    isValid: true,
  };
}

