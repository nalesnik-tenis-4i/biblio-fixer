
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Save } from 'lucide-react';
import { Example } from '@/store/types';

export function ExampleManager() {
    const { examples, addExample, removeExample, updateExample } = useAppStore();
    const [newOriginal, setNewOriginal] = useState('');
    const [newExpected, setNewExpected] = useState('');

    const handleAdd = () => {
        if (!newOriginal.trim() || !newExpected.trim()) return;
        addExample({ original: newOriginal, expected: newExpected });
        setNewOriginal('');
        setNewExpected('');
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dodaj Nowy Przykład</CardTitle>
                    <CardDescription>
                        Dodaj pary (Oryginał do Oczekiwany), aby nauczyć model twojego stylu.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Oryginalny Tekst</Label>
                            <Textarea
                                placeholder="Wklej przykładowy wpis..."
                                value={newOriginal}
                                onChange={(e) => setNewOriginal(e.target.value)}
                                className="h-24"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Oczekiwany Format</Label>
                            <Textarea
                                placeholder="Wpisz poprawnie sformatowaną wersję..."
                                value={newExpected}
                                onChange={(e) => setNewExpected(e.target.value)}
                                className="h-24"
                            />
                        </div>
                    </div>
                    <Button onClick={handleAdd} disabled={!newOriginal || !newExpected}>
                        <Plus className="w-4 h-4 mr-2" /> Dodaj Przykład
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {examples.map((example) => (
                    <ExampleItem key={example.id} example={example} onRemove={() => removeExample(example.id)} onUpdate={(updates) => updateExample(example.id, updates)} />
                ))}
            </div>
        </div>
    );
}

function ExampleItem({ example, onRemove, onUpdate }: { example: Example; onRemove: () => void; onUpdate: (u: Partial<Example>) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [original, setOriginal] = useState(example.original);
    const [expected, setExpected] = useState(example.expected);

    const handleSave = () => {
        onUpdate({ original, expected });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Textarea value={original} onChange={(e) => setOriginal(e.target.value)} />
                        <Textarea value={expected} onChange={(e) => setExpected(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Anuluj</Button>
                        <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Zapisz</Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="relative group">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-muted p-2 rounded break-all whitespace-pre-wrap">{example.original}</div>
                <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded break-all whitespace-pre-wrap">{example.expected}</div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edytuj</Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={onRemove}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
