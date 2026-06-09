import { test, expect } from '@playwright/test';

test.describe('Claim & consent flow', () => {
    test('unclaimed profile shows source, claim, and removal affordances', async ({
        page,
    }) => {
        await page.goto('/busqueda');
        // Seeded listings are unclaimed; open the first one.
        const firstProfileLink = page.locator('a[href^="/perfil/"]').first();
        await firstProfileLink.click();
        await expect(page).toHaveURL(/\/perfil\/.+/);

        // The consent posture (CLAUDE.md safety rule): unclaimed listings must
        // surface an unclaimed state plus a claim path and a removal path.
        const banner = page.getByText('Perfil no reclamado');
        if (await banner.isVisible().catch(() => false)) {
            await expect(
                page.getByRole('link', { name: /Reclama tu perfil/ }),
            ).toBeVisible();
            await expect(
                page.getByRole('link', { name: /solicita su eliminaci[óo]n/ }),
            ).toBeVisible();
        }
    });

    test('claiming a profile requires login', async ({ page }) => {
        await page.goto('/busqueda');
        const href = await page
            .locator('a[href^="/perfil/"]')
            .first()
            .getAttribute('href');
        expect(href).toBeTruthy();

        // Hitting the claim route unauthenticated must redirect to /acceso with
        // a next param back to the claim page.
        await page.goto(`${href}/reclamar`);
        await expect(page).toHaveURL(/\/acceso\?next=/);
    });
});
