"use client";

import { useState } from 'react';
import { BibliographyTable } from '@/components/bibliography-table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { useProcessor } from '@/hooks/use-processor';
import { Sparkles, ClipboardPaste, BookOpen, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { OnboardingDialog } from '@/components/onboarding-dialog';

export default function Home() {
  const { addEntries, entries } = useAppStore();
  const { processAll, isProcessing } = useProcessor();
  const [pasteContent, setPasteContent] = useState('');

  const handleImport = () => {
    if (!pasteContent.trim()) return;
    // Simple split by newline for now, can be improved to regex lookbehind
    const lines = pasteContent.split('\n').map(l => l.trim()).filter(Boolean);
    addEntries(lines);
    setPasteContent('');
  };

  return (
    <main className="min-h-screen bg-background text-foreground container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">BiblioFixer</h1>
            <p className="text-muted-foreground text-sm">Inteligentna konwersja bibliografii</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Ustawienia</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Import Section */}
      <Card className="border-dashed border-2 shadow-none bg-muted/30">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="Wklej tutaj swoją bibliografię (każda pozycja w nowej linii)..."
              className="min-h-[100px] border-none bg-background focus-visible:ring-1 resize-none"
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Wklejony tekst zostanie automatycznie podzielony na wiersze.
              </p>
              <Button onClick={handleImport} disabled={!pasteContent.trim()}>
                <ClipboardPaste className="w-4 h-4 mr-2" />
                Zaimportuj {pasteContent.split('\n').filter(l => l.trim()).length > 0 && `(${pasteContent.split('\n').filter(l => l.trim()).length})`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Bar */}
      {entries.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button size="lg" className="shadow-lg shadow-primary/20" onClick={processAll} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {isProcessing ? "Przetwarzanie..." : "Konwertuj Wszystkie"}
          </Button>
        </div>
      )}

      {/* Main Table */}
      <BibliographyTable />

      <OnboardingDialog />
    </main>
  );
}
