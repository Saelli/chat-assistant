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

const SendConfirmationEmailInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
  message: z.string().describe('The message from the user.'),
});
export type SendConfirmationEmailInput = z.infer<typeof SendConfirmationEmailInputSchema>;

const SendConfirmationEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
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
    // In a real application, you would use an email service to send the email.
    // For this demo, we'll just simulate sending the email by logging it to the console.
    console.log('--- Sending Confirmation Email ---');
    console.log('To:', input.email);
    console.log('Subject:', 'We received your message');
    console.log('Body:');
    console.log(`Hi ${input.name},`);
    console.log('');
    console.log("Thank you for contacting us. We have received your message and a support agent will get back to you soon.");
    console.log('');
    console.log('Your message:');
    console.log(input.message);
    console.log('--- Email Sent ---');
    
    // Simulate a possible failure. For now, let's always succeed.
    return { success: true };
  }
);
