import { test, expect } from '@playwright/test';

test.describe('Q&A Flow', () => {
    test('index renders and links to the ask form', async ({ page }) => {
        await page.goto('/preguntas');

        await expect(page.locator('h1')).toContainText('Comunidad de Bienestar');

        // The "ask a question" CTA is always present regardless of how many
        // questions are published.
        const askCta = page.getByRole('link', { name: 'Hacer una pregunta' }).first();
        await expect(askCta).toBeVisible();
        await askCta.click();

        await expect(page).toHaveURL(/\/preguntas\/nueva/);
    });

    test('ask form exposes the required fields', async ({ page }) => {
        await page.goto('/preguntas/nueva');

        await expect(page.locator('input#title')).toBeVisible();
        await expect(page.locator('textarea#body')).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Enviar pregunta' }),
        ).toBeVisible();
    });
});
