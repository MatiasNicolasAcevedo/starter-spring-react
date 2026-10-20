# AGENTS.md · client/

Reglas del frontend; complementan el AGENTS.md raíz. Detalle de diseño en docs/ARCHITECTURE.md.

## Estado y comandos
Base Vite `react-ts` (React 19, Vite 8, TypeScript 6, ESLint 10); versiones en docs/DEPENDENCIES.md.
Gate client: `bash scripts/verify.sh --client` desde la raíz (runner client-tests). Equivale a `npm run verify`:
`typecheck` (`tsc -b`, incluye tests) · `lint` (cero warnings) · `format:check` · `test:ci` (cobertura) · `build`.
Iteración en el host: `npm ci`, `npm test`, `npm run format`. Dependencias nuevas solo con `npm install --save-exact`.
Leer este archivo explícitamente cuando la tarea toque client; no presumir carga automática por Junie.
Desarrollo conectado sin Google: comando persistente de README/SETUP con `--proxy nginx` o `--proxy vite` para HMR; nunca leer .env real. Prueba dirigida y motivo definidos por frontera en la tarea; `npm test -- --run src/ruta.test.tsx` desde client/ es iteración, no FULL. Gate client y smoke aislado: TESTING.
Proxy de `/api/`, `/oauth2/`, `/login/oauth2/code/`, `/logout` y GET exacto `/actuator/health/readiness`: mantener iguales `nginx.conf` y `vite.config.ts`; el resto de Actuator se rechaza sin fallback SPA.

## Estructura
`src/app/` router, providers y tema · `src/features/<feature>/` páginas, componentes, hooks, tipos y tests ·
`src/shared/ui/` componentes reutilizados de verdad · `src/shared/forms/` campo RHF y errores del servidor ·
`src/services/http.ts` único cliente HTTP · `src/test/` setup, MSW, factories, `renderWithProviders`.
Referencias: `features/system/` (api con esquema Zod + hook de Query + componente con estados) y
`shared/forms/ReferenceForm.test.tsx` (formulario RHF + Zod con errores del servidor junto al campo).

## Reglas
Componentes funcionales `.tsx`; lógica y tipos `.ts`; TypeScript `strict` explícito; sin `any`, casts forzados ni `@ts-ignore`.
Un solo cliente `fetch` centralizado: cookies de sesión, header CSRF, ProblemDetail, respuestas vacías y aborto.
`fetch` no rechaza por 4xx/5xx: el cliente los convierte en errores tipados.
TanStack Query para datos del servidor: keys estables, invalidación tras mutaciones, sin reintentos para 401/403/validación,
cancelar y limpiar cache privada al logout o cambio de identidad. No duplicar ese cache en otro store ni persistirlo.
Datos privados en query keys fuera del prefijo `['auth', …]` (el logout/expiración conserva solo ese prefijo).
Mutaciones de negocio invalidan queries en lugar de escribir la cache (`setQueryData`): una mutación en vuelo no se
cancela al cerrar sesión; la feature de referencia agrega una prueba de logout en vuelo (docs/BACKLOG.md).
Formularios de negocio con React Hook Form + Zod + resolvers; errores de campo de cliente y servidor junto al campo.
Material UI con un tema único; labels y roles accesibles, foco tras errores, uso por teclado y layout usable a 375 px.
Estados explícitos: cargando, vacío, error de red/servidor, validación, éxito y sin permiso; nunca éxito si no se guardó.
Formato y cantidades según contexto nuevo; textos de UI en español.
La UI no decide permisos: oculta acciones por UX, pero el servidor autoriza siempre.
No guardar secretos ni tokens en el bundle, localStorage o sessionStorage. Variables `VITE_*` son públicas.
La identidad activa es visible; cambiar de identidad no mezcla datos de vistas anteriores.

## Pruebas
Vitest + Testing Library + user-event + jest-dom; MSW para la API en tests de componentes, sin requests no manejados.
Tests con providers reales (router, tema, QueryClient aislado sin reintentos). Typecheck incluye los tests.
Playwright vive en `e2e/` (base heredada) contra el stack real; no se mockea la API propia allí.
