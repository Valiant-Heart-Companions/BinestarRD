import { test, expect } from '@playwright/test';

test.describe('Admin access control', () => {
    test('unauthenticated visitor is redirected to login', async ({ page }) => {
        await page.goto('/admin');

        // /admin is auth-gated: anonymous users land on the login page,
        // with a `next` param so they return after signing in.
        await expect(page).toHaveURL(/\/acceso/);
        await expect(page).toHaveURL(/next=\/admin/);

        await expect(
            page.getByRole('heading', { name: 'Acceso para especialistas' }),
        ).toBeVisible();
        await expect(page.locator('input#email')).toBeVisible();
    });
});
