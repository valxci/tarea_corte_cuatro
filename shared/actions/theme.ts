'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { DEFAULT_THEME, THEMES, isTheme } from '@/shared/lib/theme';

// Recorre los temas en orden: icesi -> icesi-dark -> icesi-contraste -> icesi
export async function toggleThemeAction(): Promise<void> {
    const store = await cookies();
    const current = store.get('theme')?.value;
    const currentIndex = isTheme(current)
        ? THEMES.indexOf(current)
        : THEMES.indexOf(DEFAULT_THEME);
    const next = THEMES[(currentIndex + 1) % THEMES.length];

    store.set('theme', next, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    revalidatePath('/', 'layout'); // vuelve a pintar toda la app con el tema nuevo
}
