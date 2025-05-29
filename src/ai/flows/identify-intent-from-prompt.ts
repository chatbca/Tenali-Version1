'use server';

/**
 * @fileOverview Identifies the key intent and technologies from a user prompt.
 *
 * - identifyIntent - A function that processes the user prompt and returns identified intents and technologies.
 * - IdentifyIntentInput - The input type for the identifyIntent function.
 * - IdentifyIntentOutput - The return type for the identifyIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyIntentInputSchema = z.object({
  prompt: z.string().describe('The user prompt describing the desired website.'),
});
export type IdentifyIntentInput = z.infer<typeof IdentifyIntentInputSchema>;

const IdentifyIntentOutputSchema = z.object({
  intent: z.string().describe('The primary intent of the website (e.g., portfolio, restaurant, landing page).'),
  technologies: z.array(z.string()).describe('The technologies requested or implied by the prompt (e.g., dark mode, contact form, leaflet).'),
});
export type IdentifyIntentOutput = z.infer<typeof IdentifyIntentOutputSchema>;

export async function identifyIntent(input: IdentifyIntentInput): Promise<IdentifyIntentOutput> {
  return identifyIntentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyIntentPrompt',
  input: {schema: IdentifyIntentInputSchema},
  output: {schema: IdentifyIntentOutputSchema},
  prompt: `You are an AI assistant that analyzes user prompts to identify the key intent and technologies required for building a website.

  Given the following user prompt, extract the primary intent of the website and the technologies that should be used to build it.  The technologies should be returned as a list of strings.

  Prompt: {{{prompt}}}

  Intent:
  Technologies:`, // Ensure the AI returns the output in the correct format
});

const identifyIntentFlow = ai.defineFlow(
  {
    name: 'identifyIntentFlow',
    inputSchema: IdentifyIntentInputSchema,
    outputSchema: IdentifyIntentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
