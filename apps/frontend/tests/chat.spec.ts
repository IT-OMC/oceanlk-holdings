import { test, expect } from '@playwright/test';

test.describe('Chat Widget', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the chat message API
        await page.route('**/api/chat/message', async route => {
            const json = { response: 'This is a mocked response from the agent.' };
            await route.fulfill({ json });
        });

        await page.goto('/');
    });

    test('should open chat window and send message', async ({ page }) => {
        // 1. Click the chat toggle button by aria-label
        const chatToggle = page.getByLabel('Toggle chat');
        await chatToggle.click();

        // 2. Verify Chat Window opens
        // Title "Ocean Assistant" should be visible.
        await expect(page.getByText('Ocean Assistant')).toBeVisible();

        // 3. Type a message
        // Placeholder from ChatWidget.tsx: "Type your message... (Enter to send)"
        const input = page.getByPlaceholder(/Type your message/i);
        await input.fill('Hello Playwright');

        // 4. Send message
        // Send button has aria-label="Send message"
        await page.getByLabel('Send message').click();

        // 5. Verify User Message appears
        await expect(page.getByText('Hello Playwright')).toBeVisible();

        // 6. Verify Agent Response appears (from mock)
        await expect(page.getByText('This is a mocked response from the agent.')).toBeVisible();
    });
});
