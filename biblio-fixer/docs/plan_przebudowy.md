# Plan Przebudowy UI: Ustawienia jako Podstrona

## Cel
Zastąpienie obecnego modala `SettingsDialog` pełnowymiarową stroną `/settings`. Zmiana ta wynika z potrzeby lepszej prezentacji rozbudowanych opcji konfiguracyjnych (modele, klucze, przykłady).

## Zmiany w plikach

### 1. Nowa Strona `/settings/page.tsx`
- Utworzenie katalogu `app/settings`.
- Stworzenie pliku `page.tsx`, który będzie zawierał logikę z obecnego `SettingsDialog`, ale w układzie pełnoekranowym.
- **Layout**:
    - Sidebar po lewej (kategorie: General, Models, API Keys, Examples).
    - Content po prawej.
    - Przycisk "Powrót do edytora" w rogu.

### 2. Modyfikacja `app/page.tsx`
- Usunięcie importu `SettingsDialog`.
- Podmiana przycisku "Settings" (zębatka) na `Link` prowadzący do `/settings`.

### 3. Komponenty
- Ekstrakcja logiki formularzy z `SettingsDialog` do mniejszych komponentów (opcjonalnie, jeśli kod będzie zbyt duży) lub przeniesienie całości do `SettingsPage`.
- `SettingsDialog` zostanie usunięty lub oznaczony jako deprecated.

### 4. Branding (Favicona)
- Ponowna weryfikacja `app/layout.tsx` i metadanych icons.
- Dodanie jawnym `icons` do metadata, aby wymusić odświeżenie.

## Weryfikacja
1.  Uruchomienie `npm run dev`.
2.  Kliknięcie w przycisk ustawień -> przekierowanie na `/settings`.
3.  Zmiana modelu w ustawieniach -> powrót do głównej strony -> sprawdzenie, czy ustawienia są zachowane (Zustand persist).
