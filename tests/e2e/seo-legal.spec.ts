import { test, expect } from '@playwright/test';

test.describe('SEO & legal surfaces', () => {
    test('robots.txt exposes sitemap and disallows private areas', async ({ request }) => {
        const res = await request.get('/robots.txt');
        expect(res.ok()).toBeTruthy();
        const body = await res.text();
        expect(body).toContain('Sitemap:');
        expect(body).toContain('/admin');
        expect(body).toContain('/provider/');
    });

    test('sitemap.xml is a valid urlset', async ({ request }) => {
        const res = await request.get('/sitemap.xml');
        expect(res.ok()).toBeTruthy();
        const body = await res.text();
        expect(body).toContain('<urlset');
        expect(body).toContain('/busqueda');
    });

    test('app icon is served', async ({ request }) => {
        const res = await request.get('/icon.svg');
        expect(res.ok()).toBeTruthy();
    });

    test('privacy policy states removal path and crisis line', async ({ page }) => {
        await page.goto('/legal/privacidad');
        await expect(
            page.getByRole('heading', { name: 'Política de Privacidad' }),
        ).toBeVisible();
        // Removal/correction path and the mandatory crisis hotline must be present.
        await expect(page.getByText(/eliminaci[óo]n/i).first()).toBeVisible();
        await expect(page.getByText('809-200-1202').first()).toBeVisible();
    });
});
