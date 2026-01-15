import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-user-query.ts';
import '@/ai/flows/generate-website-ideas-from-prompt.ts';
import '@/ai/flows/summarize-api-service-docs.ts';
import '@/ai/flows/send-confirmation-email.ts';
