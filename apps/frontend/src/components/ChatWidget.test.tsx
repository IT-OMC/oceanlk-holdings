import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ChatWidget from './ChatWidget';
import * as WhatsAppHook from '../hooks/useWhatsApp';

// Mock the custom hook
vi.mock('../hooks/useWhatsApp', () => ({
    useWhatsApp: vi.fn(),
}));

// Mock fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe('ChatWidget', () => {
    const mockConfig = {
        active: true,
        welcomeMessage: 'Hello! How can I help you?',
        agentName: 'Ocean Assistant',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (WhatsAppHook.useWhatsApp as any).mockReturnValue({
            config: mockConfig,
            loading: false,
            error: null,
        });
    });

    it('renders nothing when closed (initially)', () => {
        render(<ChatWidget />);
        // It renders a toggle button, but the chat window is closed.
        // The toggle button should be visible.
        expect(screen.getByRole('button')).toBeInTheDocument();
        // The chat window text should not be visible
        expect(screen.queryByText('Ocean Assistant')).not.toBeInTheDocument();
    });

    it('opens chat window when toggle button is clicked', () => {
        render(<ChatWidget />);
        const toggleButton = screen.getByRole('button'); // This might be ambiguous if there are other buttons?
        // Actually, the component renders a button with MessageCircle or X.
        // Let's use getByRole('button') and ensure it's the right one.
        // It is the only button initially visible (except maybe in bubble if bubble is shown).
        // Bubble only shows after 3s.

        fireEvent.click(toggleButton);

        expect(screen.getByText('Ocean Assistant')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
    });

    it('displays welcome message when opened', () => {
        render(<ChatWidget />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument();
    });

    it('sends a user message and displays it', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ response: 'I can help with that.' }),
        });

        render(<ChatWidget />);
        fireEvent.click(screen.getByRole('button'));

        const input = screen.getByPlaceholderText(/Type your message/i);
        fireEvent.change(input, { target: { value: 'Shipping rates' } });

        const sendButton = screen.getByLabelText('Send message');
        await waitFor(() => expect(sendButton).not.toBeDisabled());
        fireEvent.click(sendButton);

        // Check if user message appears
        expect(screen.getByText('Shipping rates')).toBeInTheDocument();

        // Check if fetch was called
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:8080/api/chat/message',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ message: 'Shipping rates' }),
                })
            );
        });

        // Check if agent response appears
        await waitFor(() => {
            expect(screen.getByText('I can help with that.')).toBeInTheDocument();
        });
    });

    it('handles API error gracefully', async () => {
        fetchMock.mockRejectedValueOnce(new Error('Network error'));

        render(<ChatWidget />);
        fireEvent.click(screen.getByRole('button'));

        const input = screen.getByPlaceholderText(/Type your message/i);
        fireEvent.change(input, { target: { value: 'Hello' } });

        const sendButton = screen.getByLabelText('Send message');
        await waitFor(() => expect(sendButton).not.toBeDisabled());
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(/I apologize, but I'm having trouble connecting/i)).toBeInTheDocument();
        });
    });
});
