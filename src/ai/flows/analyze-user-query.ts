// The directive tells the Next.js runtime that the code in this file should be executed on the server-side.
'use server';

/**
 * @fileOverview Analyzes user queries to determine intent and urgency.
 *
 * - analyzeUserQuery - A function that analyzes the user query and returns the analysis.
 * - AnalyzeUserQueryInput - The input type for the analyzeUserQuery function.
 * - AnalyzeUserQueryOutput - The return type for the analyzeUserQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserQueryInputSchema = z.object({
  query: z.string().describe('The user query to analyze.'),
});

export type AnalyzeUserQueryInput = z.infer<typeof AnalyzeUserQueryInputSchema>;

const AnalyzeUserQueryOutputSchema = z.object({
  intent: z
    .string()
    .describe(
      'The intent of the user query.  Possible values: website_help, api_help, general_question, human_escalation.'
    ),
  urgency: z
    .string()
    .describe(
      'The urgency of the user query. Possible values: high, medium, low.'
    ),
  reason: z
    .string()
    .describe('The reasoning behind the intent and urgency determination.'),
});

export type AnalyzeUserQueryOutput = z.infer<typeof AnalyzeUserQueryOutputSchema>;

export async function analyzeUserQuery(
  input: AnalyzeUserQueryInput
): Promise<AnalyzeUserQueryOutput> {
  return analyzeUserQueryFlow(input);
}

const analyzeUserQueryPrompt = ai.definePrompt({
  name: 'analyzeUserQueryPrompt',
  input: {schema: AnalyzeUserQueryInputSchema},
  output: {schema: AnalyzeUserQueryOutputSchema},
  prompt: `You are an AI chatbot analyzing user queries to determine their intent and urgency.

  Analyze the following user query:
  {{query}}

  Determine the intent of the query. The intent can be one of the following values:
  - website_help: The user needs help with website creation.
  - api_help: The user needs help with API services.
  - general_question: The user has a general question about the services.
  - human_escalation: The user needs to be connected to a human operator.

  Determine the urgency of the query. The urgency can be one of the following values:
  - high: The user needs immediate assistance.
  - medium: The user needs assistance within a few hours.
  - low: The user needs assistance within a day.

  Provide a brief reason for your intent and urgency determination.

  Return the intent, urgency, and reason in the following JSON format:
  { 
    "intent": "<intent>",
    "urgency": "<urgency>",
    "reason": "<reason>"
  }

  Make sure that the output is valid JSON, is parsable by Javascript, and does not have any leading or trailing characters outside of the JSON object.
`,
});

const analyzeUserQueryFlow = ai.defineFlow(
  {
    name: 'analyzeUserQueryFlow',
    inputSchema: AnalyzeUserQueryInputSchema,
    outputSchema: AnalyzeUserQueryOutputSchema,
  },
  async input => {
    const {output} = await analyzeUserQueryPrompt(input);
    return output!;
  }
);
