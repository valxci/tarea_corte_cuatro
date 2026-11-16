import { test, expect } from '@playwright/test';

// Reto 3: probar el Route Handler directamente con el fixture "request",
// sin abrir un navegador. La baseURL de playwright.config.ts se usa sola.
test('POST /api/routines con datos inválidos responde 400', async ({ request }) => {
    const response = await request.post('/api/routines', {
        data: { name: 'A' }, // nombre muy corto, sin nivel y sin ejercicios
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeTruthy();
    expect(body.errors.name).toBe('El nombre debe tener al menos 3 caracteres.');
    expect(body.errors.level).toBe('Elige un nivel.');
    expect(body.errors.exerciseIds).toBe('Elige al menos un ejercicio.');
});
