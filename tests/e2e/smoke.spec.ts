import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('section[aria-label="Hero"]')).toBeVisible();
});

test('can navigate to all pages', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('/about');
  await expect(page.locator('section[aria-label="About me"]')).toBeVisible();

  await page.goto('/projects');
  await expect(page.locator('section[aria-label="Research interests and skills"]')).toBeVisible();

  await page.goto('/contact');
  await expect(page.locator('section[aria-label="Contact"]')).toBeVisible();

  await page.goto('/blog');
  await expect(page.locator('section[aria-label="Blog"]')).toBeVisible();
});

test('blog article page loads', async ({ page }) => {
  await page.goto('/blog/hello-world');
  await expect(page.locator('h1')).toBeVisible();
});

test('language switcher works', async ({ page }) => {
  await page.goto('/');

  const trigger = page.locator('.lang__trigger');
  await expect(trigger).toBeVisible();
  await trigger.click();

  const menu = page.locator('.lang__menu');
  await expect(menu).toBeVisible();
  await expect(menu.locator('.lang__option')).toHaveCount(4);

  // Switch to Chinese (2nd option)
  await menu.locator('.lang__option').nth(1).click();
  await expect(menu).not.toBeVisible();
  await expect(trigger.locator('.lang__label')).toContainText('语言');
});
