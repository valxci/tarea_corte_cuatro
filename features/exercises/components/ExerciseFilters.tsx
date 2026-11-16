'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '../types';

export function ExerciseFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const category = searchParams.get('category') ?? '';
    const maxDuration = searchParams.get('maxDuration') ?? '';
    const urlText = searchParams.get('q') ?? '';
    const [text, setText] = useState(urlText);

    // Cambia un parámetro de la URL y conserva los demás.
    // Usamos replace para no agregar una entrada al historial por cada búsqueda.
    // Reto 3: si lo cambias por router.push, el botón "atrás" retrocede búsqueda por búsqueda.
    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    };

    // Espera 300 ms desde la última tecla antes de buscar (debounce)
    useEffect(() => {
        if (text === urlText) return;
        const timer = setTimeout(() => updateParam('q', text), 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-xs">
                    <span className="sr-only">Buscar ejercicio</span>
                    <input
                        type="search"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Buscar ejercicio o músculo"
                        className="grow"
                    />
                    {isPending && <span className="loading loading-spinner loading-xs" />}
                </label>

                <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
                    <button
                        type="button"
                        onClick={() => updateParam('category', '')}
                        className={`btn btn-sm ${category === '' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Todos
                    </button>
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => updateParam('category', c.value)}
                            className={`btn btn-sm ${category === c.value ? 'btn-primary' : 'btn-outline'}`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por duración">
                <span className="text-sm opacity-70">Duración:</span>
                <button
                    type="button"
                    onClick={() => updateParam('maxDuration', '')}
                    className={`btn btn-sm ${maxDuration === '' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Cualquiera
                </button>
                {[5, 10].map((min) => (
                    <button
                        key={min}
                        type="button"
                        onClick={() => updateParam('maxDuration', String(min))}
                        className={`btn btn-sm ${maxDuration === String(min) ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Hasta {min} min
                    </button>
                ))}
            </div>
        </div>
    );
}
