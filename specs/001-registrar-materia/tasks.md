# Tareas — Spec 001: Registrar materia

- [x] **T1. Definir los tipos de materia y el contrato de errores.** RF-1, RF-2, RF-3
  - Hecho cuando: existen tipos para materia, formulario y errores que expresan nombre, nota numérica y segundo bimestre vacío, sin importar React ni almacenamiento.

- [x] **T2. Implementar y probar la normalización y validación pura.** RF-1, RF-2, RNF-2
  - Hecho cuando: `npx jest src/features/materias/materia.logic.test.ts` queda verde para nombre recortado, punto obligatorio, hasta dos decimales, rango inclusivo y todos los errores simultáneos.

- [x] **T3. Implementar y probar la detección de duplicados y creación de registros.** RF-1, RF-3
  - Hecho cuando: `npx jest src/features/materias/materia.logic.test.ts` queda verde para mayúsculas, espacios externos, tildes, no duplicados y registro con segundo bimestre vacío.

- [x] **T4. Crear el adaptador de persistencia local.** RF-5, RF-6, RF-7, RNF-1, RNF-3
  - Hecho cuando: el adaptador usa la dependencia existente, carga y guarda la lista serializada, propaga fallos y no escribe una lista vacía al fallar la carga; la prueba Jest de la lógica continúa verde.

- [x] **T5. Construir el formulario en español y sus estados de interacción.** RF-1, RF-2, RF-4, RF-5
  - Hecho cuando: en Expo Go el formulario tiene campos de nombre/nota, teclado decimal, botón accesible de al menos 44x44, errores simultáneos, limpieza tras éxito y conservación de entradas tras fallo.
  - Verificación manual rn-conventions: vertical y giro; teclado no tapa campo ni botón; textos visibles en español y estados legibles sin depender del color.

- [x] **T6. Integrar la carga inicial y la lista persistente.** RF-1, RF-4, RF-6, RF-7, RNF-1
  - Hecho cuando: en Expo Go una materia válida aparece con su nombre recortado, nota y segundo bimestre vacío; al cerrar por completo y reabrir conserva los datos; ante fallo de carga se muestra aviso y lista vacía temporal sin guardar.
  - Verificación manual rn-conventions: lista con `FlatList` y clave estable por id; respeta Safe Area; textos de estado explícitos.

- [x] **T7. Integrar guardado exitoso, duplicados y fallos de escritura.** RF-1, RF-3, RF-4, RF-5
  - Hecho cuando: en Expo Go el éxito actualiza la lista y limpia el formulario, un duplicado avisa sin crear otra fila y un fallo de guardado avisa, conserva el formulario y no muestra la materia como registrada.
  - Verificación manual rn-conventions: botón y mensajes siguen siendo utilizables con teclado abierto y todos los avisos son legibles en vertical y horizontal.

- [x] **T8. Ejecutar la regresión de lógica y la revisión final manual.** RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: `npx jest` queda verde y se completa en Expo Go la lista manual rn-conventions completa, incluyendo persistencia tras cierre y reapertura; se documenta cualquier escenario no verificable sin declarar la spec implementada por adelantado.
