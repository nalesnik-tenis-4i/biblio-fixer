# Plan Wdrożenia: Feature Pack (v1.1)

## Cel
Wdrożenie zestawu funkcji poprawiających UX (Dark Mode, Animacje) oraz logiki biznesowej (Auto-korekta, Export), zgodnie z feedbackiem użytkownika.

## User Review Required
> [!IMPORTANT]
> **Auto-Correction Loop**: Wprowadzenie pętli naprawczej zwiększy zużycie tokenów (koszt API). Limit prób zostanie ustawiony na 3.

## Zmiany w Kodzie

### 1. UX & UI (Dark Mode, Animacje)
#### [MODIFY] `app/layout.tsx`
- Dodanie `ThemeProvider` (z `next-themes`) obsługującego `class="dark"`.
- Dodanie globalnego `Template` lub rappera dla `framer-motion` (Page Transition).

#### [NEW] `components/theme-provider.tsx`
- Wrapper dla `next-themes`.

#### [NEW] `components/theme-toggle.tsx`
- Przycisk przełączania motywu (Słońce/Księżyc).

#### [NEW] `components/page-transition.tsx`
- Komponent z `AnimatePresence` i `motion.div`.

### 2. Logika Biznesowa (Auto-Correction)
#### [MODIFY] `app/api/generate/route.ts`
- Aktualizacja schematu wejściowego o opcjonalne pola: `previousAttempt` (string), `feedback` (string).
- Aktualizacja promptu systemowego: Jeśli podano `feedback`, instrukcja zmienia się na "Correction Mode" ("Popraw błędną konwersję...").

#### [MODIFY] `hooks/use-processor.ts`
- Przebudowa funkcji `processEntry`:
    - Zamiast pojedynczego strzału, pętla `while (attempts < 3 && !isValid)`.
    - Jeśli walidacja (Integrity lub Style) zwróci `isValid: false`, pobierz `comment` i ponów request do `/api/generate` z feedbackiem.
    - Aktualizacja statusu w UI na "Retrying (1/3)...".

### 3. Nowe Funkcje (Workflow, Export)
#### [MODIFY] `app/settings/page.tsx`
- Dodanie zakładki `TabsContent value="workflow"`.
- Treść: Prosta instrukcja "Krok po kroku" (Lista numerowana lub Stepper).

#### [MODIFY] `components/bibliography-table.tsx` lub `app/page.tsx`
- Dodanie przycisku "Export" w nagłówku tabeli lub obok przycisku "Konwertuj".
- Funkcja generująca plik `.txt` lub `.json` (pobieranie po stronie klienta).

## Plan Weryfikacji

### Automated Tests
- Brak testów jednostkowych w projekcie. Weryfikacja ręczna.

### Manual Verification
1.  **Dark Mode**: Przełączenie motywu -> sprawdzenie czy kolory (szczególnie w tabeli i settings) są czytelne.
2.  **Animacje**: Przejście między `Home` a `Settings` -> czy jest płynne (0.2s).
3.  **Auto-Korekta**:
    - Użycie "złośliwego" przykładu (np. błędny format).
    - Obserwacja statusu w tabeli ("Retrying...").
    - Sprawdzenie logów (czy poszły 2-3 zapytania).
4.  **Export**: Kliknięcie "Export" -> sprawdzenie zawartości pobranego pliku.
