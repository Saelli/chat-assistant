'use server';
/**
 * @fileOverview A flow to send an email to customer service.
 *
 * - sendCustomerServiceEmail - A function that sends an email to customer service.
 * - SendCustomerServiceEmailInput - The input type for the sendCustomerServiceEmail function.
 * - SendCustomerServiceEmailOutput - The return type for the sendCustomerServiceEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SendCustomerServiceEmailInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
  message: z.string().describe('The message from the user.'),
});
export type SendCustomerServiceEmailInput = z.infer<typeof SendCustomerServiceEmailInputSchema>;

const SendCustomerServiceEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  error: z.string().optional().describe('The error message if the email failed to send.'),
});
export type SendCustomerServiceEmailOutput = z.infer<typeof SendCustomerServiceEmailOutputSchema>;

export async function sendCustomerServiceEmail(input: SendCustomerServiceEmailInput): Promise<SendCustomerServiceEmailOutput> {
  return sendCustomerServiceEmailFlow(input);
}

const sendCustomerServiceEmailFlow = ai.defineFlow(
  {
    name: 'sendCustomerServiceEmailFlow',
    inputSchema: SendCustomerServiceEmailInputSchema,
    outputSchema: SendCustomerServiceEmailOutputSchema,
  },
  async (input) => {
    const customerServiceEmail = process.env.SUPPORT_INBOX_EMAIL;
    if (!customerServiceEmail) {
      const errorMessage = 'SUPPORT_INBOX_EMAIL environment variable is not set.';
      console.error(errorMessage);
      return { success: false, error: 'Customer service email is not configured.' };
    }

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: customerServiceEmail,
        reply_to: input.email,
        subject: `New support request from ${input.name}`,
        text: `You have a new support request from ${input.name} (${input.email}).\n\nMessage:\n${input.message}`,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Failed to send customer service email:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }
);
