
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

export function useProcessor() {
    const { entries, settings, examples, updateEntry } = useAppStore();
    const [isProcessing, setIsProcessing] = useState(false);

    // Helper to get key safely
    const getApiKey = (provider: string) => {
        // For custom provider, we might not need a key, or user might put something dummy
        if (provider === 'custom') return 'dummy-key';
        return settings.apiKeys[provider as keyof typeof settings.apiKeys];
    }

    const processEntry = async (id: string) => {
        const entry = entries.find(e => e.id === id);
        if (!entry) return;

        const apiKey = getApiKey(settings.models.generatorProvider);
        if (!apiKey && settings.models.generatorProvider !== 'custom') {
            alert("Brak klucza API dla generatora!"); // Simple alert for now
            return;
        }

        let attempts = 0;
        const maxAttempts = 3;
        let isFullyValid = false;
        let lastFeedback = "";
        let currentConvertedText = "";

        // Start processing loop
        while (attempts < maxAttempts && !isFullyValid) {
            attempts++;
            updateEntry(id, {
                status: 'generating',
                validationComment: attempts > 1 ? `Korekta ${attempts}/${maxAttempts}...` : undefined
            });

            try {
                // 1. Generate
                const genRes = await fetch('/api/generate', {
                    method: 'POST',
                    body: JSON.stringify({
                        text: entry.original,
                        style: settings.targetStyle,
                        examples: examples,
                        config: {
                            provider: settings.models.generatorProvider,
                            model: settings.models.generatorModel,
                            apiKey: apiKey,
                            baseUrl: settings.models.generatorBaseUrl
                        },
                        feedback: lastFeedback,
                        previousAttempt: currentConvertedText
                    })
                });

                if (!genRes.ok) throw new Error('Generation failed');
                const genData = await genRes.json();

                // Update current text
                currentConvertedText = genData.text;
                updateEntry(id, { converted: currentConvertedText, status: 'validating' });

                // 2. Validate
                const valApiKey = getApiKey(settings.models.validatorProvider);
                if (!valApiKey && settings.models.validatorProvider !== 'custom') {
                    // Skip validation if no key
                    isFullyValid = true;
                    updateEntry(id, { status: 'done' });
                    break;
                }

                const valConfig = {
                    provider: settings.models.validatorProvider,
                    model: settings.models.validatorModel,
                    apiKey: valApiKey,
                    baseUrl: settings.models.validatorBaseUrl
                };

                const [styleRes, integrityRes] = await Promise.all([
                    fetch('/api/validate', {
                        method: 'POST',
                        body: JSON.stringify({ original: entry.original, converted: currentConvertedText, style: settings.targetStyle, mode: 'style', config: valConfig })
                    }),
                    fetch('/api/validate', {
                        method: 'POST',
                        body: JSON.stringify({ original: entry.original, converted: currentConvertedText, style: settings.targetStyle, mode: 'integrity', config: valConfig })
                    })
                ]);

                const styleData = await styleRes.json();
                const integrityData = await integrityRes.json();

                updateEntry(id, {
                    validatorStyle: styleData,
                    validatorIntegrity: integrityData
                });

                if (styleData.isValid && integrityData.isValid) {
                    isFullyValid = true;
                    updateEntry(id, { status: 'done', validationComment: undefined }); // Clear comment on success
                } else {
                    // Prepare feedback for next iteration
                    const styleIssues = styleData.isValid ? "" : `Style: ${styleData.comment}`;
                    const integrityIssues = integrityData.isValid ? "" : `Integrity: ${integrityData.comment}`;
                    lastFeedback = [styleIssues, integrityIssues].filter(Boolean).join(". ");

                    if (attempts === maxAttempts) {
                        // If last attempt failed, mark as error or just done but valid=false
                        // We leave it as is (red validation) but status done
                        updateEntry(id, { status: 'done', validationComment: "Osiągnięto limit prób korekty." });
                    }
                }

            } catch (err: any) {
                console.error(err);
                updateEntry(id, { status: 'error', validationComment: err.message });
                break;
            }
        }
    };

    const validateEntry = async (id: string, convertedText?: string) => {
        // Standalone validation function (if needed manually)
        const entry = entries.find(e => e.id === id);
        if (!entry) return;

        const textToValidate = convertedText || entry.converted;
        if (!textToValidate) return;

        const apiKey = getApiKey(settings.models.validatorProvider);
        if (!apiKey && settings.models.validatorProvider !== 'custom') {
            return;
        }

        updateEntry(id, { status: 'validating' });

        try {
            const config = {
                provider: settings.models.validatorProvider,
                model: settings.models.validatorModel,
                apiKey: apiKey,
                baseUrl: settings.models.validatorBaseUrl
            };

            const [styleRes, integrityRes] = await Promise.all([
                fetch('/api/validate', {
                    method: 'POST',
                    body: JSON.stringify({ original: entry.original, converted: textToValidate, style: settings.targetStyle, mode: 'style', config })
                }),
                fetch('/api/validate', {
                    method: 'POST',
                    body: JSON.stringify({ original: entry.original, converted: textToValidate, style: settings.targetStyle, mode: 'integrity', config })
                })
            ]);

            const styleData = await styleRes.json();
            const integrityData = await integrityRes.json();

            updateEntry(id, {
                status: 'done',
                validatorStyle: styleData,
                validatorIntegrity: integrityData
            });
        } catch (error) {
            console.error(error);
            updateEntry(id, { status: 'error' });
        }
    }

    const processAll = async () => {
        setIsProcessing(true);
        const todo = entries.filter(e => e.status !== 'done');
        const limit = settings.concurrencyLimit || 1;

        // Simple implementation of concurrency limit using batches
        // For a better one we should use a proper queue or p-limit, but chunking is okay for now
        for (let i = 0; i < todo.length; i += limit) {
            const batch = todo.slice(i, i + limit);
            await Promise.all(batch.map(entry => processEntry(entry.id)));
        }

        setIsProcessing(false);
    }

    return { processAll, processEntry, validateEntry, isProcessing };
}
