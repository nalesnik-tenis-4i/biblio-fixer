
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createMistral } from '@ai-sdk/mistral';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const resultSchema = z.object({
    isValid: z.boolean(),
    score: z.number().min(0).max(10),
    comment: z.string().describe("Short explanation of the score and any issues found."),
});

export async function POST(req: Request) {
    try {
        const { original, converted, style, mode, config } = await req.json(); // mode: 'style' | 'integrity'
        const { provider, model, apiKey, baseUrl } = config;

        if (!apiKey && provider !== 'custom') {
            return NextResponse.json({ error: 'API Key is missing' }, { status: 401 });
        }

        let modelInstance;
        switch (provider) {
            case 'openai':
                modelInstance = createOpenAI({ apiKey })(model);
                break;
            case 'custom':
                modelInstance = createOpenAI({ apiKey: apiKey || 'dummy', baseURL: baseUrl })(model);
                break;
            case 'google':
                modelInstance = createGoogleGenerativeAI({ apiKey })(model);
                break;
            case 'anthropic':
                modelInstance = createAnthropic({ apiKey })(model);
                break;
            case 'mistral':
                modelInstance = createMistral({ apiKey })(model);
                break;
            default:
                return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
        }

        let prompt = "";
        if (mode === 'style') {
            prompt = `
        You are a strict editorial proofreader.
        Target Style: ${style}
        Original Text: ${original}
        Candidate Text: ${converted}

        Task: Check if the Candidate Text strictly follows the Target Style rules (punctuation, order, italics).
        Ignore missing data if it wasn't present in the Original Text. Focus on formatting.
        `;
        } else {
            prompt = `
        You are a data integrity checker.
        Original Text: ${original}
        Candidate Text: ${converted}

        Task: Check if the Candidate Text preserves all critical information (Year, Volume, Pages, Authors) from the Original Text.
        Check for hallucinations (invented data) or data loss.
        `;
        }

        const result = await generateObject({
            model: modelInstance,
            schema: resultSchema,
            prompt: prompt,
        });

        return NextResponse.json(result.object);

    } catch (error: any) {
        console.error('Validation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
