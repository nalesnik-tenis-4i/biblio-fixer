# Plan Aplikacji "BiblioFixer": Inteligentna Konwersja i Walidacja Bibliografii

## 1. Cel Projektu
Stworzenie aplikacji webowej umożliwiającej naukowcom szybką konwersję bibliografii do formatu wymaganego przez konkretne czasopismo, z unikalnym mechanizmem **wielopoziomowej walidacji** przez LLM. Aplikacja ma minimalizować ryzyko "halucynacji" formatowania poprzez weryfikację krzyżową.

## 2. Kluczowe Funkcjonalności

### 2.1. Interfejs Użytkownika (Frontend)
- **Widok Główny**: Interfejs typu "Arkusz Kalkulacyjny" (Data Grid).
- **Import Danych**:
    - Inteligentne wklejanie (Smart Paste): Użytkownik wkleja blok tekstu bibliografii, a system automatycznie dzieli go na wiersze (rekordy).
- **Kolumny Tabeli**:
    1.  *ID*
    2.  *Oryginał* (Tekst źródłowy)
    3.  *Skonwertowana Wersja* (Edytowalna, wynik działania Generatora)
    4.  *Walidator 1: Zgodność Stylu* (Ocena/Komentarz)
    5.  *Walidator 2: Poprawność Danych* (Ocena/Komentarz - opcjonalne sprawdzanie np. czy rok się zgadza)
    6.  *Status Końcowy* (🚦 Zielony/Żółty/Czerwony)
- **Akcje**:
    - "Konwertuj zaznaczone"
    - "Waliduj zaznaczone"
    - "Eksportuj do schowka/pliku"
- **Zakładka Ustawienia (Settings)**:
    - **Wybór Dostawców**: Sekcje dla OpenAI, Google Gemini, Anthropic Claude, Local (Ollama/LM Studio).
    - **Zarządzanie Kluczami**: Pola na API Keys (przechowywane w localStorage/sessionStorage dla bezpieczeństwa).
    - **Przypisanie Rol**: Dropdowny "Model Generatora" i "Model Walidatora" (np. Generator: GPT-4o, Walidator: Claude 3.5 Sonnet).

### 2.2. Logika LLM (Backend/Edge)
System będzie oparty na dwóch rolach modeli, z możliwością dynamicznego wyboru backendu:

#### Kontekst Stylu (Few-Shot Prompting)
Użytkownik może zdefiniować **"Zestaw Przykładów"** w UI:
- Pole tekstowe lub tabela na pary: *Oryginał* -> *Oczekiwany Wynik*.
- Przykłady te będą dynamicznie doklejane do promptu systemowego ("Here are some examples of correct formatting:..."), co drastycznie zwiększy precyzję.

#### Rola 1: Generator (The Worker)
- **Zadanie**: Przekształcić surowy ciąg znaków na format docelowy (np. APA, IEEE, Nature style).
- **Input**: Oryginalny wpis + Instrukcja stylu (np. "Nature style: Author(s). Title. Journal Year;Volume:Page.").
- **Model**: Szybki i precyzyjny (np. GPT-4o, Claude 3.5 Sonnet).

#### Rola 2: Walidatorzy (The Critics)
Dla każdego wiersza uruchamiane są niezależne procesy sprawdzające:
- **Walidator Stylu**:
    - *Prompt*: "Masz oryginał i wersję skonwertowaną. Czy wersja skonwertowana jest idealnie zgodna ze stylem X? Zwróć JSON: { 'valid': boolean, 'reason': string }."
- **Walidator Integralności (Cross-Check)**:
    - *Prompt*: "Czy w wersji skonwertowanej nie zaginęły kluczowe informacje (rok, numer strony) względem oryginału? Czy LLM nie zhalucynował nazwiska?"

### 3. Stack Technologiczny

- **Framework**: **Next.js** (React) - łatwość wdrożenia, API Routes do obsługi requestów do LLM.
- **UI Library**: **Tailwind CSS** + **Shadcn/UI** (nowoczesny, czysty wygląd).
- **Tabela**: **TanStack Table** (headless, pełna kontrola) lub **Ag-Grid Community** (jeśli potrzebne zaawansowane funkcje jak w Excelu).
- **AI Integration**: **Vercel AI SDK** - ułatwia strumieniowanie odpowiedzi do komórek tabeli w czasie rzeczywistym.
- **State Management**: **Zustand** - do przechowywania stanu dużej tabeli.

## 4. Przepływ Danych (Workflow Implementation)

1.  **Wklejenie**: Użytkownik wkleja tekst -> `split('\n')` lub inteligentny split przez mały model -> Tabela się zaludnia.
2.  **Iteracja (Batch Processing)**:
    - Aplikacja iteruje po wierszach (możliwość ustawienia *concurrency*, np. 5 wpisów naraz, aby nie przekroczyć Rate Limits).
    - Dla każdego wiersza leci request do API `/api/generate`.
3.  **Odbiór Wyniku**:
    - Wynik wpisywany jest do kolumny *Skonwertowana Wersja*.
4.  **Trigger Walidacji**:
    - Po otrzymaniu wyniku, automatycznie (lub na żądanie) leci request do `/api/validate`.
    - Wyniki walidatorów aktualizują odpowiednie kolumny i zmieniają kolor wiersza.
5.  **Korekta**:
    - Jeśli walidator zgłosi błąd (Czerwony), użytkownik ręcznie poprawia komórkę *Skonwertowana Wersja*. Walidacja może uruchomić się ponownie.

## 5. Przykładowy Prompt Systemowy (Generator)

```text
Jesteś ekspertem edytorskim. Masz za zadanie sformatować podaną pozycję bibliograficzną zgodnie ze stylem [NAZWA_STYLU].

Przykłady poprawnego formatowania (Few-Shot):
{user_provided_examples}

Zasady:
1. Nie dodawaj żadnych komentarzy.
2. Zachowaj wszystkie dane (rok, tom, strony).
3. Jeśli brakuje danych, zostaw miejsce w formacie [MISSING_DATA].
Wejście: {original_text}
```

## 6. Przykładowy Prompt Systemowy (Walidator)

```text
Jesteś surowym korektorem.
Oryginał: {original_text}
Wersja kandydata: {candidate_text}
Wymagany styl: [NAZWA_STYLU]

Sprawdź:
1. Czy formatowanie (kropki, kursywa) jest poprawne?
2. Czy nazwiska autorów są poprawnie przeniesione?

Odpowiedz JSONem: {"score": 1-10, "errors": ["lista błędów"], "is_perfect": true/false}
```

## 7. Kroki Realizacji (Roadmap)
1.  **Inicjalizacja**: Setup Next.js, Tailwind, Shadcn.
2.  **Prototyp Tabeli**: Wdrożenie TanStack Table, obsługa wklejania tekstu.
3.  **Integracja AI**: Podpięcie OpenAI API / Anthropic API.
4.  **Logika Walidacji**: Implementacja kolumn sprawdzających.
5.  **UI Polish**: Dodanie statusów, kolorów, ładnych przycisków.
