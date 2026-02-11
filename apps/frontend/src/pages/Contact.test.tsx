import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Contact from './Contact';
import toast from 'react-hot-toast';

// Mock fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Mock ScrollTo (though setupTests handles it, being explicit doesn't hurt)
window.scrollTo = vi.fn();

describe('Contact Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders contact form and info', () => {
        render(<Contact />);

        // check for title (using translation keys as per mock)
        expect(screen.getByText('contact.heroTitle1')).toBeInTheDocument();

        // check for inputs
        expect(screen.getByPlaceholderText('contact.form.namePlaceholder')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('contact.form.emailPlaceholder')).toBeInTheDocument();
        // Phone input might just have placeholder or label
        expect(screen.getByPlaceholderText('contact.form.phonePlaceholder')).toBeInTheDocument();

        // Check for submit button
        expect(screen.getByText('contact.form.submitButton')).toBeInTheDocument();
    });

    it('updates form state on input change', () => {
        render(<Contact />);

        const nameInput = screen.getByPlaceholderText('contact.form.namePlaceholder') as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        expect(nameInput.value).toBe('John Doe');

        const emailInput = screen.getByPlaceholderText('contact.form.emailPlaceholder') as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        expect(emailInput.value).toBe('john@example.com');
    });

    it('submits form successfully', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Message sent' }),
        });

        render(<Contact />);

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('contact.form.namePlaceholder'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('contact.form.emailPlaceholder'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('contact.form.phonePlaceholder'), { target: { value: '1234567890' } });

        // Select subject
        // The select has default option value "" and other options.
        // We need to find the select element.
        // It has name="subject". 
        // We can find by display value or verify structure.
        // Let's find by role combobox or direct query.
        // Since we don't have a label linked via 'for' attribute clearly accessible via text matcher (labels rely on translation keys),
        // we can try getByLabelText('contact.form.subjectLabel contact.form.required')?
        // Actually, logic: label contains text.
        // Let's assume layout: label text is "contact.form.subjectLabel contact.form.required".
        // Use container query or getByDisplayValue?
        // Simpler: get by name attribute if possible, but testing-library discourages implementation details.
        // Let's try finding the select by the default option text? "contact.form.subjectPlaceholder"
        // Or getByLabelText implies strict match.
        // The label text is `{t('contact.form.subjectLabel')} {t('contact.form.required')}`.
        // So "contact.form.subjectLabel contact.form.required".

        const subjectSelect = screen.getByLabelText('contact.form.subjectLabel contact.form.required');
        fireEvent.change(subjectSelect, { target: { value: 'general' } });

        fireEvent.change(screen.getByPlaceholderText('contact.form.messagePlaceholder'), { target: { value: 'Hello World' } });

        // Submit
        const submitButton = screen.getByRole('button', { name: /contact.form.submitButton/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining('/api/contact'), // exact url depends on API_ENDPOINTS
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('John Doe'),
                })
            );
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                expect.stringContaining('Thank you'),
                expect.any(Object)
            );
        });
    });

    it('handles submission error', async () => {
        fetchMock.mockRejectedValueOnce(new Error('Network Error'));

        render(<Contact />);

        // Fill minimal required
        fireEvent.change(screen.getByPlaceholderText('contact.form.namePlaceholder'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('contact.form.emailPlaceholder'), { target: { value: 'john@a.com' } });
        fireEvent.change(screen.getByLabelText('contact.form.subjectLabel contact.form.required'), { target: { value: 'general' } });
        fireEvent.change(screen.getByPlaceholderText('contact.form.messagePlaceholder'), { target: { value: 'Hi' } });

        fireEvent.click(screen.getByRole('button', { name: /contact.form.submitButton/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                expect.stringContaining('Oops'),
                expect.any(Object)
            );
        });
    });
});
