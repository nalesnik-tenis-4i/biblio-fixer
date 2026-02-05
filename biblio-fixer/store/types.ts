
export type ValidationResult = {
  isValid: boolean;
  score: number; // 0-10
  comment: string;
};

export type BibliographyEntry = {
  id: string;
  original: string;
  converted: string;
  validatorStyle?: ValidationResult;
  validatorIntegrity?: ValidationResult;
  validationComment?: string;
  status: 'idle' | 'generating' | 'validating' | 'done' | 'error';
};

export type Provider = 'openai' | 'google' | 'anthropic' | 'mistral' | 'custom';

export type AppSettings = {
  targetStyle: string; // np. "Nature", "APA 7th"
  concurrencyLimit: number; // For batch processing
  apiKeys: {
    openai: string;
    google: string;
    anthropic: string;
    mistral: string;
  };
  models: {
    generatorProvider: Provider;
    generatorModel: string;
    generatorBaseUrl?: string; // For custom/local providers
    validatorProvider: Provider;
    validatorModel: string;
    validatorBaseUrl?: string; // For custom/local providers
  };
};

export type Example = {
  id: string;
  original: string;
  expected: string;
};
