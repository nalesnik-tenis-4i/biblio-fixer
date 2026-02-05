import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Cpu, Zap, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl space-y-12">
            <div className="space-y-4">
                <Link href="/">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="w-4 h-4" /> Wróć do aplikacji
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">O Aplikacji BiblioFixer</h1>
                <p className="text-xl text-muted-foreground">
                    Twój inteligentny asystent do formatowania bibliografii, zapewniający prywatność i pełną kontrolę nad procesem.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Cpu className="w-5 h-5 text-primary" /> Jak to działa?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>Proces konwersji odbywa się w kilku krokach:</p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                            <li>Wklejasz surową bibliografię.</li>
                            <li>Aplikacja dzieli ją na poszczególne wpisy.</li>
                            <li><strong>Generator (AI)</strong> przetwarza każdy wpis na zadany styl (np. APA).</li>
                            <li><strong>Walidator (AI)</strong> sprawdza poprawność i zgodność z oryginałem.</li>
                            <li>Jeśli wykryto błędy, system automatycznie poprawia wpis (do 3 prób).</li>
                        </ol>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-600" /> Prywatność</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Twoje dane są bezpieczne. BiblioFixer to aplikacja typu <strong>Local-First / Client-Side</strong>.</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Nie posiadamy bazy danych.</li>
                            <li>Nie przechowujemy Twoich tekstów na naszym serwerze.</li>
                            <li><strong>Klucze API</strong> są zapisywane wyłącznie w pamięci Twojej przeglądarki (LocalStorage).</li>
                            <li>Dane są wysyłane jedynie do wybranych przez Ciebie dostawców AI (OpenAI, Google, etc.).</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Czego potrzebujesz do działania?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-muted/50 p-6 rounded-lg border">
                        <Zap className="w-8 h-8 mb-4 text-yellow-500" />
                        <h3 className="font-semibold mb-2">1. Klucz API</h3>
                        <p className="text-sm text-muted-foreground">Musisz posiadać własny klucz API od dostawcy (OpenAI, Anthropic, Google lub Mistral). To "paliwo" dla aplikacji.</p>
                    </div>
                    <div className="bg-muted/50 p-6 rounded-lg border">
                        <Database className="w-8 h-8 mb-4 text-blue-500" />
                        <h3 className="font-semibold mb-2">2. Modele</h3>
                        <p className="text-sm text-muted-foreground">W ustawieniach wybierasz modele. Polecamy <strong>gpt-4o</strong> lub <strong>claude-3-5-sonnet</strong> dla najlepszych efektów.</p>
                    </div>
                    <div className="bg-muted/50 p-6 rounded-lg border">
                        <Cpu className="w-8 h-8 mb-4 text-purple-500" />
                        <h3 className="font-semibold mb-2">3. Przykłady (Opcjonalne)</h3>
                        <p className="text-sm text-muted-foreground">W przypadku trudnych stylów, warto dodać 1-2 przykłady w ustawieniach (Few-Shot), aby nauczyć model wzorca.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
