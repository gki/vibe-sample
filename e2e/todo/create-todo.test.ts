import { test, expect } from '@playwright/test';
import { cleanupDatabase, disconnectDatabase } from '../helpers/db-utils.js';

test.describe('TODO作成機能のE2Eテスト', () => {
  test.beforeEach(async () => {
    // 各テスト前にデータベースをクリーンアップ
    await cleanupDatabase();
  });

  test.afterEach(async () => {
    // 各テスト後にデータベースをクリーンアップ（念のため）
    await cleanupDatabase();
  });

  test.afterAll(async () => {
    // 全テスト後にデータベース接続を閉じる
    await disconnectDatabase();
  });

  test('TODOを作成できる', async ({ page }) => {
    // トップページにアクセス
    await page.goto('/');

    // ページタイトルを確認
    await expect(page.getByRole('heading', { name: 'TODO App' })).toBeVisible();

    // TODO入力フィールドを確認
    const input = page.getByPlaceholder('TODOのタイトルを入力');
    await expect(input).toBeVisible();

    // TODOを入力
    await input.fill('E2Eテスト用のTODO');

    // 登録ボタンをクリック
    const submitButton = page.getByRole('button', { name: '登録' });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // TODOが一覧に表示されるまで待機（ミューテーション完了を待つ）
    await expect(page.getByText('E2Eテスト用のTODO').first()).toBeVisible({ timeout: 10000 });

    // 入力フィールドがクリアされることを確認
    await expect(input).toHaveValue('');
  });

  test('空のタイトルでTODOを作成しようとするとエラーが表示される', async ({
    page,
  }) => {
    // トップページにアクセス
    await page.goto('/');

    // アラートのハンドラーを事前に設定
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('タイトルを入力してください。');
      await dialog.accept();
    });

    // 登録ボタンをクリック（タイトルを入力せずに）
    const submitButton = page.getByRole('button', { name: '登録' });
    await submitButton.click();
  });

  test('100文字を超えるタイトルでTODOを作成しようとするとエラーが表示される', async ({
    page,
  }) => {
    // トップページにアクセス
    await page.goto('/');

    // アラートのハンドラーを事前に設定
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('タイトルは100文字以内で入力してください。');
      await dialog.accept();
    });

    // 101文字のタイトルを入力
    const longTitle = 'a'.repeat(101);
    const input = page.getByPlaceholder('TODOのタイトルを入力');
    await input.fill(longTitle);

    // 登録ボタンをクリック
    const submitButton = page.getByRole('button', { name: '登録' });
    await submitButton.click();
  });

  test('改行を含むタイトルでTODOを作成しようとするとエラーが表示される', async ({
    page,
  }) => {
    // トップページにアクセス
    await page.goto('/');

    // アラートのハンドラーを事前に設定
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('タイトルに改行を含めることはできません。');
      await dialog.accept();
    });

    // 改行を含むタイトルを入力（実際のHTML inputでは改行は入力できないが、プログラム的に設定）
    const input = page.getByPlaceholder('TODOのタイトルを入力');
    await input.fill('Test\nTodo');

    // 登録ボタンをクリック
    const submitButton = page.getByRole('button', { name: '登録' });
    await submitButton.click();
  });

  test('タブを含むタイトルでTODOを作成しようとするとエラーが表示される', async ({
    page,
  }) => {
    // トップページにアクセス
    await page.goto('/');

    // アラートのハンドラーを事前に設定
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('タイトルにタブを含めることはできません。');
      await dialog.accept();
    });

    // タブを含むタイトルを入力
    const input = page.getByPlaceholder('TODOのタイトルを入力');
    await input.fill('Test\tTodo');

    // 登録ボタンをクリック
    const submitButton = page.getByRole('button', { name: '登録' });
    await submitButton.click();
  });

  test('EnterキーでTODOを作成できる', async ({ page }) => {
    // トップページにアクセス
    await page.goto('/');

    // TODO入力フィールドにフォーカス
    const input = page.getByPlaceholder('TODOのタイトルを入力');
    await input.fill('Enterキーで作成');

    // Enterキーを押す
    await input.press('Enter');

    // TODOが一覧に表示されるまで待機（ミューテーション完了を待つ）
    await expect(page.getByText('Enterキーで作成').first()).toBeVisible({ timeout: 10000 });

    // 入力フィールドがクリアされることを確認
    await expect(input).toHaveValue('');
  });
});

