import { test, expect } from '@playwright/test';

test.describe('Visitor Flow', () => {
    test('browse the directory and open a profile', async ({ page }) => {
        await page.goto('/busqueda');

        // Directory shell renders with a result count.
        await expect(
            page.getByRole('heading', { name: 'Especialistas' }),
        ).toBeVisible();
        await expect(page.getByText(/resultados encontrados/)).toBeVisible();

        // Open the first listed provider (data comes from Supabase, so we don't
        // assert a specific name — just that listings link to real profiles).
        const firstProfileLink = page.locator('a[href^="/perfil/"]').first();
        await expect(firstProfileLink).toBeVisible();
        await firstProfileLink.click();

        // Landed on a profile page.
        await expect(page).toHaveURL(/\/perfil\/.+/);
        await expect(page.getByRole('link', { name: /Volver al Directorio/ })).toBeVisible();
        await expect(page.locator('h1')).not.toBeEmpty();

        // The booking sidebar always renders a consultation-price row.
        await expect(page.getByText('Precio de consulta')).toBeVisible();
    });

    test('directory location filter is present', async ({ page }) => {
        await page.goto('/busqueda');
        // First select is the location filter with an "all locations" default.
        await expect(
            page.getByRole('option', { name: 'Todas las ubicaciones' }),
        ).toBeAttached();
    });
});
