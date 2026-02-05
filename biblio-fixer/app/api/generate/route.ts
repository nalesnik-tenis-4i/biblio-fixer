
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createMistral } from '@ai-sdk/mistral';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text, style, examples, config, feedback, previousAttempt } = await req.json();
        const { provider, model, apiKey, baseUrl } = config;

        if (!apiKey && provider !== 'custom') {
            return NextResponse.json({ error: 'API Key is missing' }, { status: 401 });
        }

        let modelInstance;

        switch (provider) {
            case 'openai':
                const openai = createOpenAI({ apiKey });
                modelInstance = openai(model);
                break;
            case 'custom':
                // Custom provider usually follows OpenAI standard (like LM Studio, Ollama)
                const customOpenAI = createOpenAI({ apiKey: apiKey || 'dummy', baseURL: baseUrl });
                modelInstance = customOpenAI(model);
                break;
            case 'google':
                const google = createGoogleGenerativeAI({ apiKey });
                modelInstance = google(model);
                break;
            case 'anthropic':
                const anthropic = createAnthropic({ apiKey });
                modelInstance = anthropic(model);
                break;
            case 'mistral':
                const mistral = createMistral({ apiKey });
                modelInstance = mistral(model);
                break;
            default:
                return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
        }

        const examplesText = examples.map((ex: any) => `Original: ${ex.original}\nExpected: ${ex.expected}`).join('\n\n');

        let systemPrompt = `You are a bibliography formatting expert. 
    Target Style: ${style}
    
    Rules:
    1. Output ONLY the formatted bibliography entry. No comments, no markdown.
    2. Preserve all available information (year, volume, pages).
    3. If information is missing, do NOT invent it.
    
    Few-Shot Examples:
    ${examplesText ? examplesText : "No examples provided."}
    `;

        if (feedback && previousAttempt) {
            systemPrompt += `
    
    CRITICAL CORRECTION INSTRUCTION:
    Your previous output was: "${previousAttempt}"
    The validator found the following issues: "${feedback}"
    
    Please fix these issues and output the corrected version. Ensure you strictly follow the ${style} style guidelines.`;
        }

        const result = await generateText({
            model: modelInstance,
            system: systemPrompt,
            prompt: `Format this entry:\n${text}`,
        });

        return NextResponse.json({ text: result.text });

    } catch (error: any) {
        console.error('Generation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
