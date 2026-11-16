import { test, expect } from '@playwright/test';

test('el formulario avisa de los campos que faltan', async ({ page }) => {
    await page.goto('/routines/new');

    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    await expect(page.getByText('El nombre debe tener al menos 3 caracteres.')).toBeVisible();
    await expect(page.getByText('Elige un nivel.')).toBeVisible();
    await expect(page.getByText('Elige al menos un ejercicio.')).toBeVisible();
});

// Reto 2: si solo falta el nivel y los ejercicios, el nombre no se pierde
test('conserva el nombre cuando solo faltan nivel y ejercicios', async ({ page }) => {
    await page.goto('/routines/new');
    await page.getByLabel('Nombre de la rutina').fill('Rutina sin nivel');
    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    await expect(page.getByLabel('Nombre de la rutina')).toHaveValue('Rutina sin nivel');
    await expect(page.getByText('Elige un nivel.')).toBeVisible();
    await expect(page.getByText('Elige al menos un ejercicio.')).toBeVisible();
    await expect(page.getByText('El nombre debe tener al menos 3 caracteres.')).toHaveCount(0);
});

test('crea una rutina y marca un ejercicio como hecho', async ({ page }) => {
    // Un nombre distinto en cada ejecución: la lista vive en la memoria del servidor
    const name = `Rutina de prueba ${Date.now()}`;

    await page.goto('/routines/new');
    await page.getByLabel('Nombre de la rutina').fill(name);
    await page.getByLabel('Nivel').selectOption('principiante');
    await page.getByLabel('Plancha').check();
    await page.getByLabel('Sentadilla').check();
    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    // Después de guardar, la acción redirige a la lista y la rutina aparece en ella
    await expect(page).toHaveURL('/routines');
    await page.getByRole('link', { name: new RegExp(name) }).click();

    await expect(page.getByText('0 de 2 ejercicios hechos')).toBeVisible();
    await page.getByLabel('Plancha').check();
    await expect(page.getByText('1 de 2 ejercicios hechos')).toBeVisible();
});

test('elimina una rutina desde la lista', async ({ page }) => {
    const name = `Rutina para borrar ${Date.now()}`;

    await page.goto('/routines/new');
    await page.getByLabel('Nombre de la rutina').fill(name);
    await page.getByLabel('Nivel').selectOption('principiante');
    await page.getByLabel('Plancha').check();
    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    await expect(page).toHaveURL('/routines');
    await expect(page.getByRole('link', { name: new RegExp(name) })).toBeVisible();

    await page.getByRole('button', { name: `Eliminar ${name}` }).click();

    // La Server Action vuelve a validar la ruta y la rutina desaparece de la lista
    await expect(page.getByRole('link', { name: new RegExp(name) })).toHaveCount(0);
});

test('cambia el tema y lo recuerda al recargar', async ({ page }) => {
    await page.goto('/dashboard');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'icesi');

    await page.getByRole('button', { name: 'Cambiar tema' }).click();
    await expect(html).toHaveAttribute('data-theme', 'icesi-dark');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'icesi-dark');

    await page.getByRole('button', { name: 'Cambiar tema' }).click();
    await expect(html).toHaveAttribute('data-theme', 'icesi-contraste');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'icesi-contraste');

    // Lo dejamos como estaba para no afectar a otras pruebas
    await page.getByRole('button', { name: 'Cambiar tema' }).click();
    await expect(html).toHaveAttribute('data-theme', 'icesi');
});
