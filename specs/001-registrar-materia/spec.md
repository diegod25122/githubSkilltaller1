# Spec 001 — Registrar materia

Estado: aprobada
HU de origen: docs/historias/HU-001.md

## Contexto y objetivo

La estudiante necesita registrar una materia con la nota de su primer bimestre
para conservarla en su lista y completarla posteriormente cuando disponga de la
nota del segundo bimestre. La spec define la validación, el aviso de errores,
la prevención de duplicados y la conservación de los datos registrados.

## Usuarios

- Estudiante que registra y consulta sus materias.

## Historias de usuario

Como estudiante, quiero guardar una materia con la nota de mi primer bimestre,
para tenerla registrada y completarla cuando salga la del segundo.

## Definiciones

- **Nombre normalizado para comparar:** nombre sin espacios externos, sin
  distinguir mayúsculas/minúsculas y sin distinguir tildes. El nombre mostrado
  y guardado conserva el texto sin espacios externos.
- **Materia registrada:** materia con nombre y nota del primer bimestre válidos,
  con el segundo bimestre vacío.

## Requisitos funcionales

- **RF-1:** CUANDO la estudiante ingresa un nombre no vacío y una nota del
  primer bimestre válida, expresada con punto como separador decimal y hasta
  dos cifras decimales, EL SISTEMA guarda la materia y la muestra en la lista
  con su nombre sin espacios externos, su nota numérica y el segundo bimestre
  vacío. Origen: escenario «Guardar una materia» de HU-001 y decisiones 1, 2,
  4 y 9.

- **RF-2:** CUANDO la estudiante intenta registrar una materia con el nombre
  vacío, la nota vacía, una nota fuera del rango de 0.00 a 20.00 o una nota
  que no usa punto como separador decimal o supera dos cifras decimales, EL
  SISTEMA muestra todos los errores aplicables a la vez y no guarda la materia.
  Origen: escenario «Datos incompletos o inválidos» de HU-001 y decisiones 1,
  2, 3 y 9.

- **RF-3:** CUANDO la estudiante intenta registrar una materia cuyo nombre
  normalizado para comparar coincide con el de una materia ya registrada, EL
  SISTEMA avisa que la materia está repetida y no crea un duplicado. Origen:
  escenario «Materia repetida» de HU-001 y decisiones 2 y 5.

- **RF-4:** CUANDO la estudiante registra correctamente una materia, EL SISTEMA
  limpia el formulario y actualiza la lista para mostrar la materia registrada
  con la nota ingresada. Origen: decisión 8.

- **RF-5:** CUANDO falla el guardado de una materia válida, EL SISTEMA avisa que
  no se pudo guardar, mantiene los datos introducidos en el formulario y no
  muestra la materia como registrada. Origen: decisión 6.

- **RF-6:** CUANDO la estudiante cierra y vuelve a abrir la aplicación después
  de registrar una materia, EL SISTEMA muestra la materia con la nota que tenía
  registrada. Origen: escenario «Conservar mis datos» de HU-001 y decisión 4.

- **RF-7:** SI falla la carga de las materias registradas al abrir la
  aplicación, ENTONCES EL SISTEMA avisa que no se pudieron cargar, presenta
  temporalmente la lista vacía y no sobrescribe ni borra los datos existentes.
  Origen: decisión 7.

## Requisitos no funcionales

- **RNF-1:** EL SISTEMA debe conservar los datos registrados ante un cierre y
  una reapertura normales de la aplicación. Origen: escenario «Conservar mis
  datos» de HU-001.
- **RNF-2:** EL SISTEMA debe tratar los límites 0.00 y 20.00 como valores
  válidos, aceptar el punto como separador decimal y hasta dos cifras
  decimales, y rechazar los valores inferiores o superiores sin alterar su
  valor numérico registrado. Origen: decisiones 1 y 9, y principio 6 de
  docs/constitution.md.
- **RNF-3:** EL SISTEMA no debe presentar como registrada una materia cuyo
  guardado haya fallado. Origen: decisión 6 y principio 5 de
  docs/constitution.md.

## Casos límite

- Una nota exactamente igual a 0.00 o 20.00 se acepta; una nota menor que 0.00
  o mayor que 20.00 se rechaza.
- Una nota con coma como separador decimal o con más de dos cifras decimales
  se rechaza.
- Un nombre con espacios externos se guarda sin esos espacios y se compara con
  ese valor recortado.
- Las diferencias de mayúsculas/minúsculas, espacios externos o tildes no
  permiten crear dos materias equivalentes.
- Si nombre y nota son inválidos simultáneamente, se muestran todos los avisos
  aplicables y no se guarda nada.
- Si falla la carga, la lista vacía es temporal y no implica borrar ni
  sobrescribir los datos previamente existentes.
- Si falla el guardado, el formulario conserva lo introducido para permitir un
  nuevo intento.

## Fuera de alcance

- Registrar o editar la nota del segundo bimestre.
- Calcular promedios, estados académicos o notas de supletorio.
- Eliminar materias o confirmar eliminaciones.
- Definir la tecnología, la arquitectura o el formato de almacenamiento.

## Criterios de finalización

- Los cuatro escenarios de HU-001 tienen al menos un requisito funcional
  verificable.
- Las entradas válidas dentro del rango, incluidos 0.00 y 20.00, se guardan,
  se muestran y sobreviven a una reapertura.
- Las entradas incompletas, inválidas o repetidas producen los avisos
  correspondientes y no crean registros indebidos.
- Un fallo de guardado o de carga produce el comportamiento indicado sin
  presentar datos como persistidos ni borrar datos existentes.
- Cada requisito funcional identifica su origen y no contradice las decisiones
  vigentes ni la constitución.

## Revisión final de la spec

- No se observan contradicciones entre los RF.
- Los cuatro escenarios de HU-001 están cubiertos por RF-1/RF-2, RF-3, RF-6 y
  RF-4.
- Las decisiones 1 a 9 vigentes están reflejadas en los RF correspondientes.
- La entrada acepta punto como separador decimal y hasta dos cifras decimales,
  según la decisión 9.
- La spec exige conservar datos y evitar su presentación como guardados cuando
  falla el guardado, en línea con la constitución.
- La spec no define stack, arquitectura, formatos de almacenamiento ni nombres
  de archivos.
