import { test, expect } from '@playwright/test';

test('has title and key elements', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Bienestar RD/);

    // Check for the Hero Header
    await expect(page.locator('h1')).toContainText('Encuentra tu paz mental');

    // Check for Crisis Interceptor
    // It renders differently on Mobile vs Desktop
    const isMobile = page.viewportSize()?.width && page.viewportSize()!.width < 768;

    if (isMobile) {
        // Mobile button says "Llama Ahora"
        const mobileBtn = page.locator('a[href="tel:8092001202"]').filter({ hasText: 'Llama Ahora' });
        await expect(mobileBtn).toBeVisible();
    } else {
        // Desktop button says "Línea de Vida"
        const desktopBtn = page.locator('a[href="tel:8092001202"]').filter({ hasText: 'Línea de Vida' }).first();
        await expect(desktopBtn).toBeVisible();
    }
});
