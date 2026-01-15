'use server';

import { z } from 'zod';
import { analyzeUserQuery } from '@/ai/flows/analyze-user-query';
import { ai } from '@/ai/genkit';
import type { Message } from '@/lib/types';

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
  
  // In a real application, you would send an email or create a support ticket here.
  // For this demo, we'll just simulate a success response.
  console.log('Human support request:', parsed.data);

  return { success: true, message: "Thank you for reaching out! A support agent will be in touch with you via email shortly." };
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
