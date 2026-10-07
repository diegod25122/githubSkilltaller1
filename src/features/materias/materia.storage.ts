import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Materia } from './materia.types';

const MATERIAS_STORAGE_KEY = '@calculadora-epn/materias-v1';

function esMateria(value: unknown): value is Materia {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const materia = value as Record<string, unknown>;
  return (
    typeof materia.id === 'string' &&
    typeof materia.nombre === 'string' &&
    typeof materia.notaPrimerBimestre === 'number' &&
    (typeof materia.notaSegundoBimestre === 'number' ||
      materia.notaSegundoBimestre === null)
  );
}

export async function cargarMaterias(): Promise<Materia[]> {
  const serialized = await AsyncStorage.getItem(MATERIAS_STORAGE_KEY);
  if (serialized === null) {
    return [];
  }

  const parsed: unknown = JSON.parse(serialized);
  if (!Array.isArray(parsed) || !parsed.every(esMateria)) {
    throw new Error('Los datos guardados de materias no tienen un formato válido.');
  }

  return parsed;
}

export async function guardarMaterias(materias: Materia[]): Promise<void> {
  await AsyncStorage.setItem(MATERIAS_STORAGE_KEY, JSON.stringify(materias));
}
