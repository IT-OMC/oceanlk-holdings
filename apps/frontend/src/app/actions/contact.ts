'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { sendContactNotification } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactMessage(formData: ContactFormData) {
  try {
    const validated = contactSchema.parse(formData)
    const supabase = await createClient()

    const { data, error } = await (supabase
      .from('contact_messages') as any)
      .insert({
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        subject: validated.subject,
        message: validated.message,
        status: 'NEW',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Contact submit DB error:', error)
      return { success: false, error: 'Failed to record message. Please try again.' }
    }

    // Trigger asynchronous notification email
    sendContactNotification({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      subject: validated.subject,
      message: validated.message,
    }).catch((emailErr) => console.error('Email dispatch error:', emailErr))

    return { success: true, messageId: data.id }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0]?.message || 'Validation error' }
    }
    return { success: false, error: 'An unexpected error occurred. Please try again later.' }
  }
}
