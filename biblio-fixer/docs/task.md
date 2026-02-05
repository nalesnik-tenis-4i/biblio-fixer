# Lista Zadań - Aplikacja do Konwersji Bibliografii

- [x] Etap 1: Planowanie
    - [x] Stworzenie szczegółowego planu aplikacji (`plan_aplikacji.md`)
    - [x] Weryfikacja planu z użytkownikiem

- [x] Etap 2: Inicjalizacja Projektu <!-- id: init -->
    - [x] Setup Next.js + Tailwind CSS <!-- id: init-next -->
    - [x] Konfiguracja Shadcn UI i theme <!-- id: init-shadcn -->
    - [x] Instalacja bibliotek (TanStack Table, Zustand, Vercel AI SDK) <!-- id: init-libs -->

- [x] Etap 3: Implementacja UI <!-- id: ui -->
    - [x] Layout i nawigacja <!-- id: ui-layout -->
    - [x] Panel Ustawień (Modele, Klucze) <!-- id: ui-settings -->
    - [x] Tabela Danych (Grid) <!-- id: ui-table -->
    - [x] Sekcja Examples <!-- id: ui-examples -->

- [x] Etap 4: Logika LLM <!-- id: logic -->
    - [x] API Routes (Generate, Validate) <!-- id: logic-api -->
    - [x] Integracja z wizualną tabelą <!-- id: logic-integration -->
    - [x] Obsługa wklejania (Smart Paste) <!-- id: logic-paste -->

- [x] Etap 5: Finalizacja <!-- id: final -->
    - [x] Etap 5: Finalizacja <!-- id: final -->
    - [x] Testy i poprawki UX <!-- id: final-ux -->

- [x] Etap 6: Udoskonalenia (Feedback) <!-- id: feedback -->
    - [x] Branding (Favicona, Tytuł) <!-- id: feedback-branding -->
    - [x] Obsługa lokalnych modeli (Custom OpenAI Base URL) <!-- id: feedback-local -->
    - [x] Dropdowny modeli i linki do dokumentacji <!-- id: feedback-models -->
    - [x] Równoległe przetwarzanie (Batching) <!-- id: feedback-batch -->
    - [x] Wyjaśnienie kwestii bezpieczeństwa i UI <!-- id: feedback-info -->

- [x] Etap 7: UI Refactor i Fixes <!-- id: refactor -->
    - [x] Usunięcie favicon.ico z public/ (jeśli istnieje) <!-- id: fix-favicon -->
    - [x] Utworzenie strony /settings (Ustawienia jako osobna zakładka) <!-- id: page-settings -->
    - [x] Aktualizacja nawigacji w app/page.tsx <!-- id: nav-update -->

- [x] Etap 8: UI Fine-tuning (Feedback 2) <!-- id: fine-tuning -->
    - [x] Favicona: czarne tło, biała ikona, zaokrąglone rogi <!-- id: icon-style -->
    - [x] Settings UX: Input modelu zawsze widoczny + Select jako helper <!-- id: settings-ux -->

- [x] Etap 9: Feature Pack (Feedback 3) <!-- id: feature-pack -->
    - [x] UX: Dark Mode (next-themes) <!-- id: dark-mode -->
    - [x] UX: Płynne przejścia stron (framer-motion) <!-- id: transitions -->
    - [x] UI: Zakładka "Workflow" w ustawieniach <!-- id: workflow-tab -->
    - [x] Logic: Auto-Correction Loop (Max 3 retries with feedback) <!-- id: auto-retry -->
    - [x] Feature: Export wyników (TXT/JSON) <!-- id: export -->

- [x] Etap 10: Nowi Dostawcy i Edukacja (Feedback 4) <!-- id: mistral-onboarding -->
    - [x] Backend: Integracja @ai-sdk/mistral <!-- id: mistral-backend -->
    - [x] UI: Strona "O Aplikacji" (/about) - wyjaśnienie działania <!-- id: about-page -->
    - [x] UI: Popup powitalny (First Run) <!-- id: onboarding-popup -->
    - [x] Settings: Konfiguracja Mistral AI (Klucz, Modele) <!-- id: mistral-settings -->
