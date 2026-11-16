import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Dónde viven las pruebas
    testDir: './e2e',

    // Las pruebas de archivos distintos corren en paralelo
    fullyParallel: true,

    // La app guarda rutinas en memoria y el dev server compila páginas:
    // correr una prueba a la vez evita carreras entre tests y hace la suite estable
    workers: 1,

    // Si dejas un test.only por error, la ejecución falla en lugar de saltarse el resto
    forbidOnly: !!process.env.CI,

    // Un reporte en HTML que se abre con: npx playwright show-report
    reporter: 'html',

    // La primera compilación de Next en dev puede tardar más de los 30 s por defecto
    timeout: 60_000,

    // Las aserciones esperan hasta 15 s: la primera compilación de una ruta en dev puede tardar
    expect: { timeout: 15_000 },

    use: {
        // Permite escribir page.goto('/login') en lugar de la dirección completa
        baseURL: 'http://localhost:3000',

        // Guarda una traza (película paso a paso) cuando un reintento falla
        trace: 'on-first-retry',
    },

    projects: [
        // 1. Inicia sesión una sola vez y guarda el resultado en un archivo
        { name: 'setup', testMatch: /auth\.setup\.ts/ },

        // 2. Las demás pruebas parten con esa sesión ya iniciada
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup'],
        },
    ],

    // Arranca la aplicación antes de las pruebas (y la reutiliza si ya la tienes corriendo)
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000, // la primera compilación de Next puede tardar
    },
});
