"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export function OnboardingDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const hasSeen = localStorage.getItem("bibliofixer-onboarding-seen");
        if (!hasSeen) {
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem("bibliofixer-onboarding-seen", "true");
    };

    const handleLearnMore = () => {
        handleClose();
        router.push("/about");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl">Witaj w BiblioFixer!</DialogTitle>
                    </div>
                    <DialogDescription>
                        Twoje narzędzie do inteligentnej konwersji i naprawy bibliografii.
                        Zanim zaczniesz, warto dowiedzieć się jak to wszystko działa i jak zapewniamy bezpieczeństwo Twoich danych.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3 text-sm">
                    <p>🚀 <strong>Szybki Start:</strong> Potrzebujesz własnego klucza API (OpenAI, Google, Anthropic lub Mistral).</p>
                    <p>🔒 <strong>Prywatność:</strong> Działamy lokalnie w Twojej przeglądarce. Nie wysyłamy danych na nasze serwery.</p>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={handleLearnMore}>
                        Dowiedz się jak to działa
                    </Button>
                    <Button onClick={handleClose}>
                        Rozpocznij pracę
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
