import Link from 'next/link';
import { deleteRoutineAction } from '@/features/routines/actions';
import { routinesStore } from '@/features/routines/store';
import { LEVELS } from '@/features/routines/types';

export const metadata = { title: 'Rutinas' };

// Esta página no llama a /api/routines: en un Server Component se lee el dato directamente
export default function RoutinesPage() {
    const routines = routinesStore.list();

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Rutinas</h1>
                    <p className="text-sm opacity-70">Combina ejercicios y marca lo que ya hiciste.</p>
                </div>
                <Link href="/routines/new" className="btn btn-primary btn-sm">
                    Nueva rutina
                </Link>
            </header>

            <ul className="grid gap-4 sm:grid-cols-2">
                {routines.map((routine) => (
                    <li key={routine.id} className="relative">
                        <Link
                            href={`/routines/${routine.id}`}
                            className="card bg-base-100 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="card-body gap-2 p-4 pr-24">
                                <h2 className="card-title text-base">{routine.name}</h2>
                                <p className="text-sm opacity-70">{routine.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-secondary badge-sm">
                                        {LEVELS.find((level) => level.value === routine.level)?.label}
                                    </span>
                                    <span className="text-xs opacity-70">
                                        {routine.exerciseIds.length} ejercicios
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <form action={deleteRoutineAction} className="absolute right-2 top-2 z-10">
                            <input type="hidden" name="routineId" value={routine.id} />
                            <button
                                type="submit"
                                className="btn btn-ghost btn-xs text-error"
                                aria-label={`Eliminar ${routine.name}`}
                            >
                                Eliminar
                            </button>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    );
}
