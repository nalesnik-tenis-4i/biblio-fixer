
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/store/useAppStore"
import { Settings, Key, Brain, List, Zap, Server } from "lucide-react"
import { ExampleManager } from "./example-manager"
import { Provider } from "@/store/types"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"

// Model lists
const OPENAI_MODELS = ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"];
const GOOGLE_MODELS = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"];
const ANTHROPIC_MODELS = ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-haiku-20240307"];

export function SettingsDialog() {
    const { settings, updateSettings, setApiKey } = useAppStore();

    // Local state for valid/invalid inputs validation could be added here

    const getModelsForProvider = (provider: Provider) => {
        switch (provider) {
            case 'openai': return OPENAI_MODELS;
            case 'google': return GOOGLE_MODELS;
            case 'anthropic': return ANTHROPIC_MODELS;
            default: return [];
        }
    }

    const getDocLink = (provider: Provider) => {
        switch (provider) {
            case 'openai': return "https://platform.openai.com/docs/models";
            case 'google': return "https://ai.google.dev/gemini-api/docs/models?hl=pl";
            case 'anthropic': return "https://platform.claude.com/docs/en/about-claude/pricing";
            default: return null;
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Ustawienia</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Ustawienia BiblioFixer</DialogTitle>
                    <DialogDescription>
                        Skonfiguruj modele AI, klucze API oraz parametry przetwarzania.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="models" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="models">Modele AI</TabsTrigger>
                        <TabsTrigger value="keys">Klucze API</TabsTrigger>
                        <TabsTrigger value="general">Ogólne & Batch</TabsTrigger>
                        <TabsTrigger value="examples">Przykłady</TabsTrigger>
                    </TabsList>

                    <TabsContent value="models" className="mt-4 space-y-6 overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Generator Configuration */}
                            <div className="space-y-4 border p-4 rounded-lg bg-card">
                                <h3 className="font-semibold flex items-center gap-2 text-primary"><Brain className="w-4 h-4" /> Generator (Bibliograf)</h3>
                                <div className="space-y-2">
                                    <Label>Dostawca</Label>
                                    <Select
                                        value={settings.models.generatorProvider}
                                        onValueChange={(val) => updateSettings({ models: { ...settings.models, generatorProvider: val as Provider } })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                            <SelectItem value="google">Google Gemini</SelectItem>
                                            <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                                            <SelectItem value="custom">Custom / Local (OpenAI Compatible)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {getDocLink(settings.models.generatorProvider) && (
                                        <a href={getDocLink(settings.models.generatorProvider)!} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                            Zobacz cennik i modele producenta
                                        </a>
                                    )}
                                </div>

                                {settings.models.generatorProvider === 'custom' ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Base URL</Label>
                                            <Input
                                                value={settings.models.generatorBaseUrl || ''}
                                                onChange={(e) => updateSettings({ models: { ...settings.models, generatorBaseUrl: e.target.value } })}
                                                placeholder="np. http://localhost:1234/v1"
                                            />
                                            <p className="text-xs text-muted-foreground">Adres API zgodny ze standardem OpenAI (np. LM Studio, Ollama)</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nazwa Modelu</Label>
                                            <Input
                                                value={settings.models.generatorModel}
                                                onChange={(e) => updateSettings({ models: { ...settings.models, generatorModel: e.target.value } })}
                                                placeholder="np. llama-3-8b-instruct"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Label>Model</Label>
                                        <div className="flex gap-2">
                                            <Select
                                                value={getModelsForProvider(settings.models.generatorProvider).includes(settings.models.generatorModel) ? settings.models.generatorModel : "custom"}
                                                onValueChange={(val) => {
                                                    if (val !== 'custom') updateSettings({ models: { ...settings.models, generatorModel: val } })
                                                }}
                                            >
                                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Wybierz..." /></SelectTrigger>
                                                <SelectContent>
                                                    {getModelsForProvider(settings.models.generatorProvider).map(m => (
                                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                                    ))}
                                                    <SelectItem value="custom">Inny (Wpisz ręcznie)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                value={settings.models.generatorModel}
                                                onChange={(e) => updateSettings({ models: { ...settings.models, generatorModel: e.target.value } })}
                                                placeholder="Nazwa modelu"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Validator Configuration */}
                            <div className="space-y-4 border p-4 rounded-lg bg-card">
                                <h3 className="font-semibold flex items-center gap-2 text-primary"><Key className="w-4 h-4" /> Walidator (Korektor)</h3>
                                <div className="space-y-2">
                                    <Label>Dostawca</Label>
                                    <Select
                                        value={settings.models.validatorProvider}
                                        onValueChange={(val) => updateSettings({ models: { ...settings.models, validatorProvider: val as Provider } })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                            <SelectItem value="google">Google Gemini</SelectItem>
                                            <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                                            <SelectItem value="custom">Custom / Local (OpenAI Compatible)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {getDocLink(settings.models.validatorProvider) && (
                                        <a href={getDocLink(settings.models.validatorProvider)!} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                            Zobacz cennik i modele producenta
                                        </a>
                                    )}
                                </div>

                                {settings.models.validatorProvider === 'custom' ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Base URL</Label>
                                            <Input
                                                value={settings.models.validatorBaseUrl || ''}
                                                onChange={(e) => updateSettings({ models: { ...settings.models, validatorBaseUrl: e.target.value } })}
                                                placeholder="np. http://localhost:1234/v1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nazwa Modelu</Label>
                                            <Input
                                                value={settings.models.validatorModel}
                                                onChange={(e) => updateSettings({ models: { ...settings.models, validatorModel: e.target.value } })}
                                                placeholder="np. mistral-7b"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Label>Model</Label>
                                        <div className="flex gap-2">
                                            <Select
                                                value={getModelsForProvider(settings.models.validatorProvider).includes(settings.models.validatorModel) ? settings.models.validatorModel : "custom"}
                                                onValueChange={(val) => {
                                                    if (val !== 'custom') updateSettings({ models: { ...settings.models, validatorModel: val } })
                                                }}
                                            >
                                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Wybierz..." /></SelectTrigger>
                                                <SelectContent>
                                                    {getModelsForProvider(settings.models.validatorProvider).map(m => (
                                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                                    ))}
                                                    <SelectItem value="custom">Inny (Wpisz ręcznie)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                value={settings.models.validatorModel}
                                                onChange={(e) => updateSettings({ models: { ...settings.models, validatorModel: e.target.value } })}
                                                placeholder="Nazwa modelu"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="keys" className="mt-4 space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                            <strong>Bezpieczeństwo:</strong> Twoje klucze API są przechowywane tylko w pamięci przeglądarki (LocalStorage).
                            Są wysyłane bezpośrednio do serwera Proxy tej aplikacji, a stamtąd do dostawcy modelu. Nie są nigdzie trwale zapisywane na serwerze.
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>OpenAI API Key</Label>
                                <Input
                                    type="password"
                                    value={settings.apiKeys.openai}
                                    onChange={(e) => setApiKey('openai', e.target.value)}
                                    placeholder="sk-..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Google Vertex/AI Studio Key</Label>
                                <Input
                                    type="password"
                                    value={settings.apiKeys.google}
                                    onChange={(e) => setApiKey('google', e.target.value)}
                                    placeholder="AIza..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Anthropic API Key</Label>
                                <Input
                                    type="password"
                                    value={settings.apiKeys.anthropic}
                                    onChange={(e) => setApiKey('anthropic', e.target.value)}
                                    placeholder="sk-ant-..."
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="general" className="mt-4 space-y-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Docelowy Styl Bibliograficzny</Label>
                                <Input
                                    value={settings.targetStyle}
                                    onChange={(e) => updateSettings({ targetStyle: e.target.value })}
                                    placeholder="np. APA 7th, Nature, IEEE"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Wpisz nazwę czasopisma lub standardu (np. "Chicago Author-Date").
                                </p>
                            </div>

                            <div className="space-y-4 border p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500" /> Szybkość Przetwarzania (Concurrent Requests)</h3>
                                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{settings.concurrencyLimit} batch</span>
                                </div>
                                <Slider
                                    defaultValue={[settings.concurrencyLimit]}
                                    max={10}
                                    min={1}
                                    step={1}
                                    onValueChange={(vals) => updateSettings({ concurrencyLimit: vals[0] })}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Określa, ile wpisów bibliograficznych system przetwarza jednocześnie.
                                    Większa liczba przyspiesza pracę, ale może szybciej zużyć limity API (Rate Limits).
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="examples" className="mt-4 flex-1 overflow-auto">
                        <ExampleManager />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
