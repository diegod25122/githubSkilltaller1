export type Materia = {
  id: string;
  nombre: string;
  notaPrimerBimestre: number;
  notaSegundoBimestre: number | null;
};

export type MateriaForm = {
  nombre: string;
  notaTexto: string;
};

export type MateriaValidationErrors = {
  nombre: string | null;
  nota: string | null;
};

export type MateriaValidationResult = {
  errors: MateriaValidationErrors;
  isValid: boolean;
};
