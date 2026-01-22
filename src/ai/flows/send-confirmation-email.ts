'use server';
/**
 * @fileOverview A flow to send a confirmation email.
 *
 * - sendConfirmationEmail - A function that sends a confirmation email.
 * - SendConfirmationEmailInput - The input type for the sendConfirmationEmail function.
 * - SendConfirmationEmailOutput - The return type for the sendConfirmationEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Resend} from 'resend';

const SendConfirmationEmailInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
  message: z.string().describe('The message from the user.'),
});
export type SendConfirmationEmailInput = z.infer<typeof SendConfirmationEmailInputSchema>;

const SendConfirmationEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  error: z.string().optional().describe('The error message if the email failed to send.'),
});
export type SendConfirmationEmailOutput = z.infer<typeof SendConfirmationEmailOutputSchema>;

export async function sendConfirmationEmail(input: SendConfirmationEmailInput): Promise<SendConfirmationEmailOutput> {
  return sendConfirmationEmailFlow(input);
}

const sendConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'sendConfirmationEmailFlow',
    inputSchema: SendConfirmationEmailInputSchema,
    outputSchema: SendConfirmationEmailOutputSchema,
  },
  async (input) => {
    const { RESEND_API_KEY, EMAIL_FROM } = process.env;
    if (!RESEND_API_KEY || !EMAIL_FROM) {
      const errorMessage = 'RESEND_API_KEY or EMAIL_FROM environment variable is not set.';
      console.error(errorMessage);
      return { success: false, error: 'Email service is not configured.' };
    }
    const resend = new Resend(RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: input.email,
        subject: 'We received your message',
        text: `Hi ${input.name},\n\nThank you for contacting us. We have received your message and a support agent will get back to you soon.\n\nYour message:\n${input.message}`,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Failed to send confirmation email:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }
);
