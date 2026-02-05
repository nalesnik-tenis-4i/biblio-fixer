# BiblioFixer - Instrukcja Obsługi i Dokumentacja

## Przegląd
Aplikacja **BiblioFixer** została stworzona, aby pomagać naukowcom w szybkiej konwersji i walidacji wpisów bibliograficznych. Wykorzystuje zaawansowane modele LLM (OpenAI, Google, Anthropic) do formatowania tekstu oraz weryfikacji poprawności.

## Zaimplementowane Funkcjonalności
1.  **Inteligentna Tabela**:
    - Wklejanie całej bibliografii jednym rzutem ("Smart Paste").
    - Podział na wiersze i edycja inline.
    - Statusy przetwarzania (Generowanie, Walidacja, Gotowe).
2.  **Generator (AI Worker)**:
    - Przekształca surowe wpisy na wybrany styl (np. APA, Nature).
    - Obsługuje "Few-Shot Examples" - możesz dodać własne przykłady, aby nauczyć model specyficznych reguł.
3.  **Podwójna Walidacja**:
    - **Styl**: Sprawdza zgodność z formatowaniem (kropki, kursywa).
    - **Integralność**: Sprawdza, czy nie zaginęły kluczowe dane (rok, strony) i czy model nie zmyślił informacji.
4.  **Konfiguracja**:
    - Możliwość wyboru różnych modeli dla Generatora i Walidatora.
    - Bezpieczne wprowadzanie kluczy API (przechowywane lokalnie w przeglądarce).

## Jak uruchomić projekt?

### Wymagania
- Node.js 18+
- npm / yarn / pnpm

### Instalacja i Uruchomienie
1.  Przejdź do katalogu projektu:
    ```bash
    cd biblio-fixer
    ```
2.  Zainstaluj zależności (jeśli jeszcze nie zainstalowane):
    ```bash
    npm install
    ```
3.  Uruchom serwer developerski:
    ```bash
    npm run dev
    ```
4.  Otwórz przeglądarkę pod adresem `http://localhost:3000`.

## Struktura Katalogów
- `app/page.tsx`: Główny widok aplikacji.
- `app/api/`: Endpointy backendowe (`generate`, `validate`).
- `components/`: Komponenty UI (Tabela, SettingsDialog, ExampleManager).
- `store/`: Stan aplikacji (Zustand) i typy danych.
- `hooks/`: Logika biznesowa (`useProcessor`).

## Znane Problemy i Rozwiązania

### Błąd: `sh: next: command not found`
Jeśli podczas uruchamiania `npm run dev` widzisz ten błąd, oznacza to, że system nie widzi poprawnie zainstalowanych binariów Next.js.
**Rozwiązanie:** Skrypty w `package.json` zostały zmodyfikowane, aby używać pełnej ścieżki `./node_modules/.bin/next`. Jeśli dodajesz nowe komendy, pamiętaj o użyciu tej konwencji lub upewnij się, że `node_modules/.bin` jest w Twoim PATH.

### Błąd instalacji `napi-postinstall`
Jeśli instalacja zatrzymuje się na błędzie `unrs-resolver`, użyj komendy:
```bash
npm install --ignore-scripts
```
A następnie upewnij się, że zależności zostały poprawnie pobrane.

