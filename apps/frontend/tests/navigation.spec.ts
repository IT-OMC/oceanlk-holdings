import { test, expect } from '@playwright/test';

test.describe('Global Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/Ocean/i);
    });

    test('should navigate to Contact page', async ({ page }) => {
        // Specify the navbar to avoid footer link collisions
        const navbar = page.locator('nav');
        const contactLink = navbar.getByRole('link', { name: 'Contact Us', exact: true });

        // Check if it's visible (might be hidden in mobile menu)
        if (await contactLink.isVisible()) {
            await contactLink.click();
        } else {
            // Fallback for mobile if needed
            await page.getByLabel('Menu').click();
            await page.locator('nav').getByRole('link', { name: 'Contact Us', exact: true }).click();
        }

        // Verify URL
        await expect(page).toHaveURL(/.*contact/);

        // Verify Heading - using specific text from en.json
        // heroTitle1: "Let's Start"
        await expect(page.getByRole('heading', { level: 1, name: /Let's Start/i })).toBeVisible();
    });
});
