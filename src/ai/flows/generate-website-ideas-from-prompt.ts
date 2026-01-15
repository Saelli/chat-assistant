'use server';
/**
 * @fileOverview A flow to generate website ideas from a prompt.
 *
 * - generateWebsiteIdeas - A function that generates website ideas based on a prompt.
 * - GenerateWebsiteIdeasInput - The input type for the generateWebsiteIdeas function.
 * - GenerateWebsiteIdeasOutput - The return type for the generateWebsiteIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteIdeasInputSchema = z.object({
  prompt: z.string().describe('A prompt to generate website ideas from a business idea description.'),
});
export type GenerateWebsiteIdeasInput = z.infer<typeof GenerateWebsiteIdeasInputSchema>;

const GenerateWebsiteIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of website design and feature ideas.'),
});
export type GenerateWebsiteIdeasOutput = z.infer<typeof GenerateWebsiteIdeasOutputSchema>;

export async function generateWebsiteIdeas(input: GenerateWebsiteIdeasInput): Promise<GenerateWebsiteIdeasOutput> {
  return generateWebsiteIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsiteIdeasPrompt',
  input: {schema: GenerateWebsiteIdeasInputSchema},
  output: {schema: GenerateWebsiteIdeasOutputSchema},
  prompt: `You are a website design and feature suggestion generator. Generate a list of website design and feature ideas based on the following business idea description:\n\nBusiness Idea Description: {{{prompt}}}`,
});

const generateWebsiteIdeasFlow = ai.defineFlow(
  {
    name: 'generateWebsiteIdeasFlow',
    inputSchema: GenerateWebsiteIdeasInputSchema,
    outputSchema: GenerateWebsiteIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
