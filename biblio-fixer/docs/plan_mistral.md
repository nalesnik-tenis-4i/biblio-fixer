# Plan Wdrożenia: Mistral AI i Onboarding (v1.2)

## Cel
Rozszerzenie możliwości aplikacji o modele Mistral AI oraz poprawa doświadczenia nowego użytkownika (wyjaśnienie zasad działania i prywatności).

## Zmiany w Kodzie

### 1. Integracja Mistral AI
#### [NEW] Dependency
- `npm install @ai-sdk/mistral`

#### [MODIFY] `store/types.ts`
- Aktualizacja typu `Provider` o `'mistral'`.
- Dodanie pola `mistral` do `apiKeys` w `AppSettings`.

#### [MODIFY] `app/api/generate/route.ts` oraz `app/api/validate/route.ts`
- Import `createMistral` z `@ai-sdk/mistral`.
- Dodanie `case 'mistral'` w switchu providerów.

#### [MODIFY] `app/settings/page.tsx`
- Dodanie opcji 'Mistral AI' w Selectach providerów.
- Dodanie inputu na klucz API Mistral.
- Zdefiniowanie listy modeli Mistral (np. `mistral-large-latest`, `pixtral-large-latest`, `ministral-8b-latest`).

### 2. Edukacja i Onboarding
#### [NEW] `app/about/page.tsx`
- Strona statyczna wyjaśniająca:
    1. **Prywatność**: Klucze w LocalStorage, dane lecą przez proxy do LLM.
    2. **Proces**: Oryginał -> Prompt -> LLM -> JSON -> Walidacja -> Korekta -> Wynik.
    3. **Wymagania**: Klucz API (OpenAI/Google/Anthropic/Mistral) jest niezbędny.

#### [NEW] `components/onboarding-dialog.tsx`
- Komponent renderowany w `app/page.tsx` (lub layout).
- Używa `useEffect` do sprawdzenia `localStorage.getItem('hasSeenOnboarding')`.
- Jeśli brak flagi -> pokazuje Dialog z krótkim info i przyciskami:
    - "Dowiedz się więcej" (link do `/about` + zamknięcie + ustawienie flagi).
    - "Rozumiem, przejdź do aplikacji" (zamknięcie + ustawienie flagi).

## Plan Weryfikacji

### Manual Verification
1.  **Mistral**: Wybranie Mistral jako generatora -> wpisanie klucza -> próba konwersji.
2.  **Onboarding**: 
    - Usunięcie klucza z localStorage (`localStorage.removeItem('hasSeenOnboarding')`).
    - Odświeżenie strony -> czy popup się pojawia?
    - Kliknięcie "Dowiedz się więcej" -> czy przenosi na `/about`?
    - Kliknięcie "Rozumiem" -> czy zamyka i nie pojawia się po odświeżeniu?
