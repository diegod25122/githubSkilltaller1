# Plan de implementación — Spec 001: Registrar materia

## Alcance y trazabilidad

Este plan implementa únicamente el registro de una materia con la nota del
primer bimestre. Cubre RF-1 a RF-7 y RNF-1 a RNF-3; no incorpora segundo
bimestre, edición, eliminación ni cálculos académicos.

## Archivos y responsabilidades

### Archivos nuevos

- `src/features/materias/materia.types.ts`: tipos de dominio para una materia
  registrada, el formulario y los errores de validación. RF-1, RF-3, RF-4.
- `src/features/materias/materia.logic.ts`: funciones puras de normalización,
  validación, detección de duplicados y construcción del registro. No importa
  React ni AsyncStorage. RF-1, RF-2, RF-3.
- `src/features/materias/materia.storage.ts`: adaptador de persistencia local
  usando la dependencia ya instalada `@react-native-async-storage/async-storage`.
  Expone operaciones de cargar y guardar, propagando fallos sin borrar ni
  sobrescribir datos. RF-5, RF-6, RF-7, RNF-1 y RNF-3.
- `src/features/materias/materia.logic.test.ts`: pruebas Jest de las funciones
  puras y sus casos límite. RF-1, RF-2 y RF-3; RNF-2.

### Archivos modificados

- `src/app/index.tsx`: reemplaza la pantalla de plantilla por el formulario y
  la lista de materias; coordina estado, carga inicial, guardado, mensajes y
  limpieza del formulario sin contener reglas de negocio. RF-1 a RF-7.

## Funciones puras de lógica

En `materia.logic.ts` se definirán, como mínimo:

- `trimNombre(nombre)`: quita solo espacios externos para el valor mostrado y
  guardado.
- `normalizarNombreParaComparar(nombre)`: aplica `trim`, minúsculas y
  descomposición Unicode para retirar tildes, de modo que las equivalencias de
  la decisión 5 sean estables.
- `validarFormulario(nombre, notaTexto)`: devuelve todos los errores aplicables
  en una sola respuesta. La nota debe coincidir con el formato decimal con
  punto y hasta dos cifras decimales, aceptar `0`, `0.00`, `20` y `20.00`, y
  quedar en `[0, 20]`; la coma, más de dos decimales, vacío y valores fuera de
  rango se rechazan (decisiones 1, 3 y 9).
- `buscarDuplicado(nombre, materias)`: compara nombres normalizados y devuelve
  si existe coincidencia (decisiones 2 y 5).
- `crearMateriaValida(nombre, notaTexto)`: después de validación, crea el
  registro con nombre recortado, nota numérica y segundo bimestre vacío
  (decisión 4).

Las funciones no mutarán listas ni formularios y no redondearán la nota de
forma que cambie el valor introducido.

## Persistencia

`materia.storage.ts` usará una única clave versionable de la aplicación y
serializará una lista de registros con el segundo bimestre vacío. La lectura
parseará y validará la forma mínima antes de entregarla; cualquier error de
lectura, parseo o escritura se propagará al llamador. El adaptador no hará
fallback de escritura cuando falle la lectura y nunca reemplazará datos por
una lista vacía (decisiones 6 y 7). Se usa AsyncStorage porque ya está en
`package.json`; se descarta añadir otra dependencia o una base de datos para
este alcance simple, en cumplimiento de la constitución (principio 1).

## Algoritmo (pseudocódigo)

### Carga inicial

```text
al montar pantalla:
  marcar carga en curso
  intentar materias = cargarMaterias()
  si carga exitosa:
    mostrar materias
  si falla:
    mostrar aviso "No se pudieron cargar las materias"
    mostrar lista vacía solo en memoria
    no llamar a guardarMaterias
  finalizar carga
```

### Registro

```text
al pulsar Guardar:
  errores = validarFormulario(nombre, notaTexto)
  si errores no está vacío:
    mostrar todos los errores
    conservar formulario y lista
    terminar
  si buscarDuplicado(nombre, materias) existe:
    mostrar aviso de materia repetida
    conservar formulario y lista
    terminar
  materia = crearMateriaValida(nombre, notaTexto)
  intentar:
    guardarMaterias(materias + materia)
    actualizar lista con materias + materia
    limpiar nombre, nota y errores
  si falla:
    mostrar "No se pudo guardar"
    conservar formulario y lista anterior
```

El estado de la lista solo se actualiza después de que la escritura confirma
éxito, evitando presentar como guardado un registro fallido (RF-5 y RNF-3).

## Interfaz

`index.tsx` mostrará todos los textos visibles en español: encabezado,
formulario de nombre y nota, botón Guardar, errores simultáneos, avisos de
duplicado/carga/guardado y lista de materias. La nota usará
`keyboardType="decimal-pad"` y el texto de ayuda indicará que el punto es el
separador aceptado; la validación seguirá rechazando la coma según la spec.
El formulario se envolverá en un contenedor desplazable/ajustable al teclado,
respetará Safe Area y tendrá controles de al menos 44x44 puntos.

La lista usará `FlatList` con el id estable de cada materia, mostrando nombre,
nota y segundo bimestre vacío. Los estados de error y éxito se comunicarán
también con texto, no solo con color. Se aplicará `StyleSheet` y la paleta
EPN disponible: encabezado `#001F3F`, botón primario `#357ca5`, fondo
`#e2e4e9`, tarjetas/campos `#FFFFFF`, texto `#111111`, texto secundario
`#5a6e82` y bordes `#b5bbc8`, manteniendo los contrastes indicados por la
convención. No se añade una librería visual.

## Decisiones técnicas justificadas

- **Lógica pura separada de React y almacenamiento:** cumple el principio 3 y
  permite verificar RF-1/RF-3 y RNF-2 sin montar la pantalla. Alternativa
  descartada: validar dentro de `index.tsx`, porque acoplaría reglas y haría
  frágiles las pruebas.
- **Regex de entrada con punto y máximo dos decimales, seguida de conversión
  numérica:** implementa literalmente la decisión 9 y conserva límites
  `0.00`/`20.00`. Alternativa descartada: reemplazar coma por punto o usar
  `parseFloat` permisivo, porque aceptaría entradas que la spec rechaza.
- **Normalización Unicode para tildes y `toLocale`/minúsculas de comparación:**
  implementa la decisión 5 sin alterar el nombre mostrado. Alternativa
  descartada: comparar solo el texto original, porque permitiría duplicados
  equivalentes.
- **AsyncStorage existente con escritura de lista completa y actualización
  posterior al éxito:** implementa decisiones 4, 6 y 7 sin dependencia nueva.
  Alternativa descartada: solo memoria o una base de datos nueva, porque no
  sobrevive al cierre o viola simplicidad.
- **Carga fallida como lista vacía temporal, sin persistirla:** sigue decisión
  7 y protege los datos sagrados del principio 5. Alternativa descartada:
  guardar automáticamente `[]`, porque borraría datos ante un fallo de
  lectura.

## Estrategia de pruebas con Jest

- Probar nombre vacío, nombre recortado y equivalencia por mayúsculas,
  espacios externos y tildes.
- Probar nota vacía, no numérica, con coma, con más de dos decimales, menor
  que 0, mayor que 20, y los límites `0.00` y `20.00`.
- Probar que se devuelven simultáneamente errores de nombre y nota y que los
  datos válidos producen una materia con nota numérica y segundo bimestre
  vacío.
- Probar duplicados y no duplicados con la normalización definida.
- Mantener las pruebas puras en `materia.logic.test.ts`; los escenarios de
  AsyncStorage y los avisos/limpieza de pantalla se comprobarán en la
  integración manual de Expo Go indicada en `tasks.md`, sin inventar
  requisitos fuera de la spec.
