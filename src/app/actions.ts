'use server';

import { z } from 'zod';
import { analyzeUserQuery } from '@/ai/flows/analyze-user-query';
import { ai } from '@/ai/genkit';
import type { Message } from '@/lib/types';
import { sendConfirmationEmail } from '@/ai/flows/send-confirmation-email';
import { sendCustomerServiceEmail } from '@/ai/flows/send-customer-service-email';

const contactHumanSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function contactHumanSupport(values: z.infer<typeof contactHumanSchema>) {
  const parsed = contactHumanSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data. Please check your inputs.' };
  }
  
  try {
    const [serviceEmailResult, emailResult] = await Promise.all([
      sendCustomerServiceEmail(parsed.data),
      sendConfirmationEmail(parsed.data)
    ]);
    
    if (!serviceEmailResult.success) {
      // Log this failure but don't block user feedback if user email was ok
      console.error("Failed to send customer service email:", serviceEmailResult.error);
    }

    if (!emailResult.success) {
      return { success: false, message: `Your message was received, but we failed to send a confirmation email. Error: ${emailResult.error}` };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error has occurred.';
    console.error("Failed to send emails:", error);
    return { success: false, message: `Your message was received, but there was an unexpected error sending emails: ${errorMessage}` };
  }


  return { success: true, message: "Your message has been sent! A confirmation email is on its way." };
}

export async function submitUserMessage(history: Message[], userMessage: string): Promise<Message> {
  const analysis = await analyzeUserQuery({ query: userMessage });

  if (analysis.intent === 'human_escalation') {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "It looks like you need to speak with a human. Please fill out the form below and we'll get back to you as soon as possible.",
      component: 'human-form',
    };
  }
  
  const response = await ai.generate({
    model: ai.model,
    prompt: `You are a helpful assistant for a company that helps users build websites and use APIs.
    The user is asking a question. Your response should be helpful, concise, and friendly.
    Analyze the user's intent and urgency to tailor your response.
    
    User Intent: ${analysis.intent}
    User Urgency: ${analysis.urgency}
    Reasoning: ${analysis.reason}
    
    Conversation History:
    ${history.map(m => `${m.role}: ${m.content}`).join('\n')}
    
    New User Message:
    user: ${userMessage}
    
    Your Response:`,
  });

  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: response.text,
  };
}
