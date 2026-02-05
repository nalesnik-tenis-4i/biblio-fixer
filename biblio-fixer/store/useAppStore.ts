
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, BibliographyEntry, Example } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
    entries: BibliographyEntry[];
    settings: AppSettings;
    examples: Example[];

    // Actions
    addEntries: (originals: string[]) => void;
    updateEntry: (id: string, updates: Partial<BibliographyEntry>) => void;
    removeEntry: (id: string) => void;
    clearEntries: () => void;

    updateSettings: (updates: Partial<AppSettings>) => void;
    setApiKey: (provider: keyof AppSettings['apiKeys'], key: string) => void;

    addExample: (example: Omit<Example, 'id'>) => void;
    removeExample: (id: string) => void;
    updateExample: (id: string, updates: Partial<Example>) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            entries: [],
            settings: {
                targetStyle: 'Nature',
                concurrencyLimit: 1,
                apiKeys: {
                    openai: '',
                    google: '',
                    anthropic: '',
                    mistral: '',
                },
                models: {
                    generatorProvider: 'openai',
                    generatorModel: 'gpt-4o',
                    validatorProvider: 'anthropic',
                    validatorModel: 'claude-3-5-sonnet-20240620',
                },
            },
            examples: [],

            addEntries: (originals) => set((state) => ({
                entries: [
                    ...state.entries,
                    ...originals.map((text) => ({
                        id: uuidv4(),
                        original: text,
                        converted: '',
                        status: 'idle' as const,
                    })),
                ],
            })),

            updateEntry: (id, updates) => set((state) => ({
                entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
            })),

            removeEntry: (id) => set((state) => ({
                entries: state.entries.filter((e) => e.id !== id),
            })),

            clearEntries: () => set({ entries: [] }),

            updateSettings: (updates) => set((state) => ({
                settings: { ...state.settings, ...updates },
            })),

            setApiKey: (provider, key) => set((state) => ({
                settings: {
                    ...state.settings,
                    apiKeys: { ...state.settings.apiKeys, [provider]: key },
                },
            })),

            addExample: (example) => set((state) => ({
                examples: [...state.examples, { ...example, id: uuidv4() }],
            })),

            removeExample: (id) => set((state) => ({
                examples: state.examples.filter((e) => e.id !== id),
            })),

            updateExample: (id, updates) => set((state) => ({
                examples: state.examples.map((e) => (e.id === id ? { ...e, ...updates } : e)),
            })),
        }),
        {
            name: 'biblio-fixer-storage',
            partialize: (state) => ({ settings: state.settings, examples: state.examples }), // Don't persist big entries list by default? Or yes? Maybe yes. Let's persist all for now.
        }
    )
);
