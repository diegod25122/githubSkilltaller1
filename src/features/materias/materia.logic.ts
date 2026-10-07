import type {
  Materia,
  MateriaValidationErrors,
  MateriaValidationResult,
} from './materia.types';

const DECIMAL_NOTE_PATTERN = /^(?:0|[1-9]\d?)(?:\.\d{1,2})?$/;

export function trimNombre(nombre: string): string {
  return nombre.trim();
}

export function normalizarNombreParaComparar(nombre: string): string {
  return trimNombre(nombre)
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function validarFormulario(
  nombre: string,
  notaTexto: string,
): MateriaValidationResult {
  const errors: MateriaValidationErrors = {
    nombre: trimNombre(nombre)
      ? null
      : 'El nombre de la materia es obligatorio.',
    nota: null,
  };

  if (!DECIMAL_NOTE_PATTERN.test(notaTexto)) {
    errors.nota =
      'La nota debe ser un número entre 0.00 y 20.00 con punto y hasta dos decimales.';
  } else {
    const nota = Number(notaTexto);
    if (nota < 0 || nota > 20) {
      errors.nota =
        'La nota debe ser un número entre 0.00 y 20.00 con punto y hasta dos decimales.';
    }
  }

  return {
    errors,
    isValid: errors.nombre === null && errors.nota === null,
  };
}

export function buscarDuplicado(
  nombre: string,
  materias: Materia[],
): Materia | undefined {
  const nombreNormalizado = normalizarNombreParaComparar(nombre);
  return materias.find(
    (materia) =>
      normalizarNombreParaComparar(materia.nombre) === nombreNormalizado,
  );
}

export function crearMateriaValida(
  nombre: string,
  notaTexto: string,
): Materia {
  const validacion = validarFormulario(nombre, notaTexto);
  if (!validacion.isValid) {
    throw new Error('No se puede crear una materia con datos inválidos.');
  }

  return {
    id: `materia-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nombre: trimNombre(nombre),
    notaPrimerBimestre: Number(notaTexto),
    notaSegundoBimestre: null,
  };
}
