
"use client";

import { useAppStore } from "@/store/useAppStore";
import { ExampleManager } from "@/components/example-manager";
import { Provider } from "@/store/types";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Key, Brain, List, Zap, ArrowLeft, Monitor, Shield } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

// Model lists
const OPENAI_MODELS = ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"];
const GOOGLE_MODELS = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"];
const ANTHROPIC_MODELS = ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-haiku-20240307"];
const MISTRAL_MODELS = ["mistral-large-latest", "pixtral-large-latest", "ministral-8b-latest", "open-mistral-nemo"];

export default function SettingsPage() {
    const { settings, updateSettings, setApiKey } = useAppStore();

    const getModelsForProvider = (provider: Provider) => {
        switch (provider) {
            case 'openai': return OPENAI_MODELS;
            case 'google': return GOOGLE_MODELS;
            case 'anthropic': return ANTHROPIC_MODELS;
            case 'mistral': return MISTRAL_MODELS;
            default: return [];
        }
    }

    const getDocLink = (provider: Provider) => {
        switch (provider) {
            case 'openai': return "https://platform.openai.com/docs/models";
            case 'google': return "https://ai.google.dev/gemini-api/docs/models?hl=pl";
            case 'anthropic': return "https://platform.claude.com/docs/en/about-claude/pricing";
            case 'mistral': return "https://docs.mistral.ai/getting-started/models/";
            default: return null;
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl min-h-screen flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ustawienia</h1>
                    <p className="text-muted-foreground">Skonfiguruj modele AI, klucze API i preferencje przetwarzania.</p>
                </div>
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                <Tabs defaultValue="models" orientation="vertical" className="flex flex-col md:flex-row gap-8 w-full col-span-2 md:col-span-2">
                    <TabsList className="bg-muted/20 p-2 h-auto flex-col justify-start items-stretch gap-2 w-full md:w-[250px] shrink-0">
                        <TabsTrigger value="models" className="justify-start px-4 py-3 h-auto text-base">
                            <Brain className="w-4 h-4 mr-2" /> Modele AI
                        </TabsTrigger>
                        <TabsTrigger value="keys" className="justify-start px-4 py-3 h-auto text-base">
                            <Key className="w-4 h-4 mr-2" /> Klucze API
                        </TabsTrigger>
                        <TabsTrigger value="general" className="justify-start px-4 py-3 h-auto text-base">
                            <Monitor className="w-4 h-4 mr-2" /> Ogólne & Batch
                        </TabsTrigger>
                        <TabsTrigger value="examples" className="justify-start px-4 py-3 h-auto text-base">
                            <List className="w-4 h-4 mr-2" /> Przykłady (Few-Shot)
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 w-full space-y-6">
                        <TabsContent value="models" className="space-y-6 m-0">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Generator Configuration */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2 text-primary"><Brain className="w-5 h-5" /> Generator (Bibliograf)</CardTitle>
                                        <CardDescription>Model odpowiedzialny za formatowanie tekstu.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
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
                                                    <SelectItem value="mistral">Mistral AI</SelectItem>
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
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={settings.models.generatorModel}
                                                            onChange={(e) => updateSettings({ models: { ...settings.models, generatorModel: e.target.value } })}
                                                            placeholder="Wpisz nazwę modelu lub wybierz z listy"
                                                            className="flex-1"
                                                        />
                                                        <Select
                                                            onValueChange={(val) => {
                                                                updateSettings({ models: { ...settings.models, generatorModel: val } })
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-[40px] px-2">
                                                                <span className="sr-only">Wybierz z listy</span>
                                                                <List className="h-4 w-4" />
                                                            </SelectTrigger>
                                                            <SelectContent align="end">
                                                                {getModelsForProvider(settings.models.generatorProvider).map(m => (
                                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Możesz ręcznie edytować nazwę modelu (np. dodać wersję beta).
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Validator Configuration */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2 text-primary"><Key className="w-5 h-5" /> Walidator (Korektor)</CardTitle>
                                        <CardDescription>Model sprawdzający poprawność i styl.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
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
                                                    <SelectItem value="mistral">Mistral AI</SelectItem>
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
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={settings.models.validatorModel}
                                                            onChange={(e) => updateSettings({ models: { ...settings.models, validatorModel: e.target.value } })}
                                                            placeholder="Wpisz nazwę modelu lub wybierz z listy"
                                                            className="flex-1"
                                                        />
                                                        <Select
                                                            onValueChange={(val) => {
                                                                updateSettings({ models: { ...settings.models, validatorModel: val } })
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-[40px] px-2">
                                                                <span className="sr-only">Wybierz z listy</span>
                                                                <List className="h-4 w-4" />
                                                            </SelectTrigger>
                                                            <SelectContent align="end">
                                                                {getModelsForProvider(settings.models.validatorProvider).map(m => (
                                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Możesz ręcznie edytować nazwę modelu (np. dodać wersję beta).
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="keys" className="space-y-4 m-0">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg flex items-start gap-3">
                                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>Bezpieczeństwo danych:</strong>
                                    <p className="mt-1">
                                        Twoje klucze API są przechowywane <strong>wyłącznie w pamięci Twojej przeglądarki</strong> (LocalStorage).
                                        Są one wykorzystywane tylko do bezpośredniej komunikacji z API dostawców (OpenAI, Google, Anthropic).
                                        Nie są wysyłane na żaden zewnętrzny serwer poza niezbędnym proxy tej aplikacji.
                                    </p>
                                </div>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Dostawcy Chmurowi</CardTitle>
                                    <CardDescription>Wprowadź klucze API dla wybranych dostawców.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                                    <div className="space-y-2">
                                        <Label>Mistral AI API Key</Label>
                                        <Input
                                            type="password"
                                            value={settings.apiKeys.mistral}
                                            onChange={(e) => setApiKey('mistral', e.target.value)}
                                            placeholder="..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="general" className="space-y-6 m-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preferencje Stylu</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label>Docelowy Styl Bibliograficzny</Label>
                                        <Input
                                            value={settings.targetStyle}
                                            onChange={(e) => updateSettings({ targetStyle: e.target.value })}
                                            placeholder="np. APA 7th, Nature, IEEE"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Wpisz nazwę czasopisma lub standardu (np. "Chicago Author-Date"). Model postara się dopasować formatowanie.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500" /> Wydajność (Batch Processing)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Limit Zapytań Równoległych</Label>
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
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="workflow" className="space-y-6 m-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Jak pracować z BiblioFixer?</CardTitle>
                                    <CardDescription>Zalecany proces pracy dla uzyskania najlepszych efektów.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                                            <div>
                                                <h3 className="font-semibold text-lg">Konfiguracja Modeli</h3>
                                                <p className="text-muted-foreground">Wybierz dostawców dla Generatora i Walidatora. Dodaj klucze API. Jeśli masz wątpliwości, użyj <code>gpt-4o</code> dla generatora i <code>claude-3-5-sonnet</code> dla walidatora.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                                            <div>
                                                <h3 className="font-semibold text-lg">Określ Styl Docelowy i Przykłady</h3>
                                                <p className="text-muted-foreground">Wpisz nazwę stylu (np. "Nature"). Jeśli styl jest nietypowy, przejdź do zakładki <strong>Przykłady (Few-Shot)</strong> i dodaj 1-2 poprawne pary (oryginał -&gt; cel). To drastycznie zwiększa jakość!</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                                            <div>
                                                <h3 className="font-semibold text-lg">Import i Konwersja</h3>
                                                <p className="text-muted-foreground">Wróć na stronę główną, wklej bibliografię i kliknij "Konwertuj Wszystkie". System automatycznie spróbuje poprawić błędy (do 3 prób).</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                                            <div>
                                                <h3 className="font-semibold text-lg">Eksport</h3>
                                                <p className="text-muted-foreground">Po zakończeniu, sprawdź wyniki w tabeli (możesz edytować ręcznie). Następnie pobierz gotowy plik przyciskiem "Pobierz Wyniki" na dole.</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="examples" className="m-0 h-full">
                            <ExampleManager />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
