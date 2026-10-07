import {
  buscarDuplicado,
  crearMateriaValida,
  normalizarNombreParaComparar,
  trimNombre,
  validarFormulario,
} from './materia.logic';
import type { Materia } from './materia.types';

describe('materia.logic', () => {
  it('recorta espacios externos del nombre', () => {
    expect(trimNombre('  Cálculo I  ')).toBe('Cálculo I');
  });

  it('normaliza mayúsculas, espacios y tildes para comparar', () => {
    expect(normalizarNombreParaComparar('  Matemáticas  ')).toBe('matematicas');
  });

  it('valida los límites y el formato decimal con punto', () => {
    expect(validarFormulario('Cálculo', '0.00').isValid).toBe(true);
    expect(validarFormulario('Cálculo', '20.00').isValid).toBe(true);
    expect(validarFormulario('Cálculo', '12.5').isValid).toBe(true);
  });

  it.each(['', 'abc', '12,50', '12.345', '-0.01', '20.01'])(
    'rechaza la nota inválida %s',
    (notaTexto) => {
      expect(validarFormulario('Cálculo', notaTexto).errors.nota).not.toBeNull();
    },
  );

  it('devuelve todos los errores aplicables simultáneamente', () => {
    const resultado = validarFormulario('   ', '');

    expect(resultado).toEqual({
      isValid: false,
      errors: {
        nombre: 'El nombre de la materia es obligatorio.',
        nota: 'La nota debe ser un número entre 0.00 y 20.00 con punto y hasta dos decimales.',
      },
    });
  });

  it('detecta duplicados ignorando mayúsculas, espacios y tildes', () => {
    const materias: Materia[] = [
      {
        id: 'materia-1',
        nombre: 'Matemáticas',
        notaPrimerBimestre: 15,
        notaSegundoBimestre: null,
      },
    ];

    expect(buscarDuplicado(' matematicas ', materias)).toEqual(materias[0]);
    expect(buscarDuplicado('Física', materias)).toBeUndefined();
  });

  it('crea un registro válido con nombre recortado y segundo bimestre vacío', () => {
    const materia = crearMateriaValida('  Cálculo I  ', '18.50');

    expect(materia).toMatchObject({
      nombre: 'Cálculo I',
      notaPrimerBimestre: 18.5,
      notaSegundoBimestre: null,
    });
    expect(materia.id).toMatch(/^materia-/);
  });
});
