
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';
import { useAppStore } from '@/store/useAppStore';
import { BibliographyEntry } from '@/store/types';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Play, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BibliographyTable() {
    const { entries, updateEntry } = useAppStore();

    const columns: ColumnDef<BibliographyEntry>[] = [
        {
            accessorKey: 'original',
            header: 'Oryginał',
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground whitespace-pre-wrap min-w-[300px] max-w-[400px]">
                    {row.original.original}
                </div>
            ),
        },
        {
            accessorKey: 'converted',
            header: 'Wersja Skonwertowana',
            cell: ({ row }) => {
                return (
                    <Textarea
                        value={row.original.converted}
                        onChange={(e) => updateEntry(row.original.id, { converted: e.target.value })}
                        className={cn(
                            "min-w-[400px] min-h-[100px] font-mono text-sm",
                            row.original.status === 'validating' && "opacity-50"
                        )}
                    />
                );
            },
        },
        {
            id: 'validation',
            header: 'Walidacja',
            cell: ({ row }) => {
                const style = row.original.validatorStyle;
                const integrity = row.original.validatorIntegrity;
                const comment = row.original.validationComment;

                return (
                    <div className="flex flex-col gap-2">
                        {comment && (
                            <div className="text-xs text-amber-600 font-medium bg-amber-50 p-1 rounded border border-amber-200">
                                {comment}
                            </div>
                        )}
                        <ValidatorStatus label="Styl" result={style} />
                        <ValidatorStatus label="Treść" result={integrity} />
                    </div>
                )
            }
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <div className="flex items-center gap-2">
                        {status === 'generating' && <Badge variant="secondary"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Przetwarzanie</Badge>}
                        {status === 'validating' && <Badge variant="secondary"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Walidacja</Badge>}
                        {status === 'done' && <Badge variant="outline">Gotowe</Badge>}
                        {status === 'error' && <Badge variant="destructive">Błąd</Badge>}
                        {status === 'idle' && <Badge variant="outline">Oczekuje</Badge>}
                    </div>
                )
            }
        }
    ];

    const table = useReactTable({
        data: entries,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const downloadAll = () => {
        const text = table.getRowModel().rows
            .map(row => row.original.converted || "")
            .filter(Boolean)
            .join('\n');

        if (!text) return;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bibliografia-output.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (entries.length === 0) {
        return (
            <div className="text-center p-12 text-muted-foreground border-2 border-dashed rounded-lg">
                Wklej bibliografię, aby rozpocząć.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border">
                <span className="text-sm font-medium ml-2">Wyniki: {entries.length}</span>
                <Button variant="outline" size="sm" onClick={downloadAll}>
                    <Download className="w-4 h-4 mr-2" />
                    Pobierz wszystko (.txt)
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-4 align-top [&:has([role=checkbox])]:pr-0">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ValidatorStatus({ label, result }: { label: string, result: BibliographyEntry['validatorStyle'] }) {
    if (!result) return <div className="flex items-center gap-2 text-muted-foreground"><div className="w-4 h-4 bg-muted rounded-full" /> <span className="text-xs">{label}: --</span></div>;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded transition-colors">
                    {result.isValid ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={cn("text-xs font-medium", result.isValid ? "text-green-700" : "text-red-700")}>
                        {label} ({result.score}/10)
                    </span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm">
                <div className="font-semibold mb-1">{result.isValid ? "Jest dobrze!" : "Wykryto problemy"}</div>
                <p>{result.comment}</p>
            </PopoverContent>
        </Popover>
    )
}
