// Los nombres deben coincidir con los temas definidos en app/globals.css
export const THEMES = ['icesi', 'icesi-dark', 'icesi-contraste'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'icesi';

export function isTheme(value: string | undefined): value is Theme {
    return value !== undefined && (THEMES as readonly string[]).includes(value);
}
