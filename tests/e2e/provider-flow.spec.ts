import { test, expect } from '@playwright/test';

test.describe('Provider portal access control', () => {
    test('unauthenticated visitor is redirected to login', async ({ page }) => {
        await page.goto('/provider/dashboard');

        // The portal is auth-gated; anonymous users are sent to the login
        // page with a `next` param pointing back to the dashboard.
        await expect(page).toHaveURL(/\/acceso/);
        await expect(page).toHaveURL(/next=\/provider\/dashboard/);

        await expect(page.locator('input#email')).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Enviar enlace de acceso' }),
        ).toBeVisible();
    });
});
