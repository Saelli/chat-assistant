'use server';
/**
 * @fileOverview Summarizes API service documentation from a given URL.
 *
 * - summarizeApiServiceDocs - A function that summarizes API documentation.
 * - SummarizeApiServiceDocsInput - The input type for the summarizeApiServiceDocs function.
 * - SummarizeApiServiceDocsOutput - The return type for the summarizeApiServiceDocs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeApiServiceDocsInputSchema = z.object({
  documentationUrl: z
    .string()
    .url()
    .describe('URL of the API service documentation.'),
});

export type SummarizeApiServiceDocsInput = z.infer<
  typeof SummarizeApiServiceDocsInputSchema
>;

const SummarizeApiServiceDocsOutputSchema = z.object({
  summary:
    z.string().describe('A concise summary of the API service, explaining its core functionality and how it can be used to create a website.'),
});

export type SummarizeApiServiceDocsOutput = z.infer<
  typeof SummarizeApiServiceDocsOutputSchema
>;

async function fetchDocumentation(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch documentation:', error);
    throw error;
  }
}

export async function summarizeApiServiceDocs(
  input: SummarizeApiServiceDocsInput
): Promise<SummarizeApiServiceDocsOutput> {
  return summarizeApiServiceDocsFlow(input);
}

const summarizeApiServiceDocsPrompt = ai.definePrompt({
  name: 'summarizeApiServiceDocsPrompt',
  input: {schema: SummarizeApiServiceDocsInputSchema},
  output: {schema: SummarizeApiServiceDocsOutputSchema},
  prompt: `You are an expert at summarizing API service documentation, explaining its core functionality and how it can be used to create a website.

  Summarize the API documentation provided below, focusing on the key functionalities, endpoints, and use cases, and how these can be applied in website development.
  Provide a concise summary that helps developers quickly understand the API's purpose, capabilities, and potential for website integration.

  API Documentation:
  {{documentation}}`,
});

const summarizeApiServiceDocsFlow = ai.defineFlow(
  {
    name: 'summarizeApiServiceDocsFlow',
    inputSchema: SummarizeApiServiceDocsInputSchema,
    outputSchema: SummarizeApiServiceDocsOutputSchema,
  },
  async input => {
    try {
      const documentation = await fetchDocumentation(input.documentationUrl);
      const {output} = await summarizeApiServiceDocsPrompt({
        ...input,
        documentation,
      });
      return output!;
    } catch (error) {
      console.error('Error in summarizeApiServiceDocsFlow:', error);
      throw error;
    }
  }
);
