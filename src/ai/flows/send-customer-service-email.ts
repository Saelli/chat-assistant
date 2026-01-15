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

const SendCustomerServiceEmailInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
  message: z.string().describe('The message from the user.'),
});
export type SendCustomerServiceEmailInput = z.infer<typeof SendCustomerServiceEmailInputSchema>;

const SendCustomerServiceEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
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
    // In a real application, you would use an email service to send the email.
    // For this demo, we'll just simulate sending the email by logging it to the console.
    const customerServiceEmail = 'service@webassist.com';
    console.log('--- Sending Customer Service Email ---');
    console.log('To:', customerServiceEmail);
    console.log('From:', input.email);
    console.log('Subject:', `New support request from ${input.name}`);
    console.log('Body:');
    console.log(`You have a new support request from ${input.name} (${input.email}).`);
    console.log('');
    console.log('Message:');
    console.log(input.message);
    console.log('--- Email Sent ---');
    
    // Simulate a possible failure. For now, let's always succeed.
    return { success: true };
  }
);
