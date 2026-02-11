import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the contact submit API
        await page.route('**/api/contact', async route => {
            await route.fulfill({ json: { success: true } });
        });

        await page.goto('/contact');
    });

    test('should submit contact form successfully', async ({ page }) => {
        // 1. Fill out the form
        // Correct placeholders from en.json
        await page.getByPlaceholder('John Doe').fill('Test User');
        await page.getByPlaceholder('john@example.com').fill('test@example.com');

        // Subject is a select
        const subjectSelect = page.getByRole('combobox', { name: /Subject/i });
        await subjectSelect.selectOption({ value: 'general' });

        // Message placeholder
        await page.getByPlaceholder('Tell us more about your inquiry...').fill('This is an E2E test message.');

        // 2. Submit
        // Button text from en.json: "Send Message"
        const submitButton = page.getByRole('button', { name: 'Send Message' });
        await submitButton.click();

        // 3. Verify Success Toast
        // Toast usually contains "Thank you".
        await expect(page.getByText(/Thank you/i)).toBeVisible({ timeout: 10000 });
    });
});
