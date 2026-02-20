# 📹 Libreto para Vídeo-Memoria: Tests Funcionales de UI (Criterio 2 - Actividad 3)

## 🎬 Introducción (30 segundos)

**[Pantalla: VS Code abierto en el proyecto]**

> "Hola, soy Diego Arévalo y voy a presentar los **tests funcionales de interfaz de usuario** para el proyecto **Relatos de Papel**, correspondientes al **Criterio 2 de la Actividad 3**."
>
> "A diferencia de los tests de aceptación que validan flujos completos, estos tests se centran en la **lógica y comportamiento específico de componentes de la UI**: validaciones de formularios, estados de botones, renderizado de elementos y manejo de eventos."
>
> "He implementado **23 tests funcionales** utilizando **Playwright** que validan solo los mocks del frontend, sin dependencia de un backend real."

---

## 🔍 Componente 1: SearchBar - Comportamiento de la Barra de Búsqueda

**[Pantalla: Archivo `searchbar-ui-behavior.spec.ts` abierto]**

> "El primer conjunto de tests valida el **comportamiento funcional del componente SearchBar**, que permite a los usuarios filtrar libros por título."

### Tests del SearchBar (6 tests)

**[Mostrar estructura de los 6 tests]**

> "Este conjunto incluye **6 tests** que validan:
>
> **Test 1**: Debe mostrar el **label correcto 'Buscar por título'** usando Material UI.
>
> **Test 2**: Debe **filtrar la lista al escribir texto**. Por ejemplo, al escribir 'Sombras', solo muestra libros con ese término en el título.
>
> **Test 3**: Debe **restaurar todos los libros al borrar el texto** de búsqueda, volviendo al estado inicial.
>
> **Test 4**: Debe mostrar el **mensaje 'No se han encontrado libros'** cuando la búsqueda no tiene resultados.
>
> **Test 5**: Debe **actualizar el valor del input en tiempo real** mientras el usuario escribe.
>
> **Test 6**: Debe **mantener el foco en el input durante la escritura**, asegurando una buena experiencia de usuario."

**[Ejecutar test específico en modo headed]**

```bash
npx playwright test tests/ui/searchbar-ui-behavior.spec.ts --headed
```

**[Mostrar código de un test específico, por ejemplo el test de filtrado]**

> "Veamos el test que valida el filtrado en tiempo real:
>
> 1. **Given**: La página muestra libros inicialmente.
> 2. **When**: El usuario escribe 'Sombras' en el buscador.
> 3. **Then**: La lista se filtra mostrando solo libros que contienen 'Sombras'.
> 4. **Then**: Validamos que todos los títulos mostrados contienen el término buscado.
>
> Este test asegura que el componente reacciona correctamente a la entrada del usuario."

---

## 🛒 Componente 2: Header Cart Badge - Badge del Carrito

**[Pantalla: Archivo `header-cart-badge-ui.spec.ts` abierto]**

> "El segundo conjunto valida el **badge del carrito en el Header**, que muestra el número de artículos añadidos."

### Tests del Cart Badge (7 tests)

**[Mostrar estructura de los 7 tests]**

> "Este conjunto incluye **7 tests** que validan:
>
> **Test 1**: Con **carrito vacío**, debe mostrar badge con 0 items o no mostrarlo.
>
> **Test 2**: Debe **actualizar el badge al añadir un libro**, mostrando el número correcto.
>
> **Test 3**: Debe mostrar el **número correcto después de añadir múltiples libros** diferentes.
>
> **Test 4**: Debe **persistir el valor del badge después de recargar la página**, validando el uso de **localStorage**.
>
> **Test 5**: Al añadir el **mismo libro varias veces**, el badge refleja el número de items únicos.
>
> **Test 6**: Debe **navegar al carrito al hacer clic** en el icono del badge.
>
> **Test 7**: Debe **mantener el badge visible al navegar entre páginas**, demostrando la persistencia del estado."

**[Ejecutar test de persistencia en localStorage]**

```bash
npx playwright test tests/ui/header-cart-badge-ui.spec.ts:81 --headed
```

**[Mostrar ejecución del test]**

> "Este test es especialmente importante porque valida que:
>
> 1. El usuario añade un libro al carrito.
> 2. El badge muestra '1'.
> 3. **Se recarga la página completa**.
> 4. El badge sigue mostrando '1' gracias a localStorage.
>
> Esto asegura que el carrito no se pierde al refrescar el navegador."

---

## 📚 Componente 3: BookList - Renderizado de Lista de Libros

**[Pantalla: Archivo `booklist-rendering.spec.ts` abierto]**

> "El tercer conjunto valida el **renderizado correcto de la lista de libros** con los datos mock."

### Tests del BookList (10 tests)

**[Mostrar estructura de los 10 tests]**

> "Este conjunto incluye **10 tests** que validan diferentes aspectos del renderizado:
>
> **Test 1**: Debe renderizar **exactamente 10 libros en la primera página** debido a la paginación.
>
> **Test 2**: Cada card debe mostrar **título, autor y precio** correctamente formateados.
>
> **Test 3**: Debe mostrar el **botón 'Añadir' visible y habilitado** en cada card.
>
> **Test 4**: Debe existir **paginación funcional** para los 40 libros mock (4 páginas de 10 libros).
>
> **Test 5**: Debe **navegar a la página 2 y mostrar libros diferentes**, validando que la paginación funciona.
>
> **Test 6**: Cada card debe mostrar una **imagen visible** con URL válida.
>
> **Test 7**: Al **hacer clic en una card**, debe navegar correctamente a la página de detalle del libro.
>
> **Test 8**: Debe mantener el **layout de grid con espaciado correcto**, verificando el diseño responsive.
>
> **Test 9**: Debe mostrar **precios numéricos válidos** en formato `$XX.XX`.
>
> **Test 10**: Debe **respetar la paginación al volver del detalle**, manteniendo la página actual."

**[Ejecutar test de renderizado]**

```bash
npx playwright test tests/ui/booklist-rendering.spec.ts:20 --headed
```

**[Mostrar código del test que valida título, autor y precio]**

> "Este test recorre las 10 cards de la página y valida que cada una tenga:
>
> - **Título**: visible y no vacío
> - **Autor**: visible y con formato 'Autor N'
> - **Precio**: visible y con formato `$XX.XX`
>
> Esto asegura que todos los datos se renderizan correctamente desde el mock."

---

## ✅ Ejecución de Todos los Tests de UI

**[Pantalla: Terminal]**

> "Ahora voy a ejecutar **todos los tests funcionales de UI** para demostrar que funcionan correctamente."

```bash
npx playwright test tests/ui/
```

**[Mostrar resultados]**

> "Como pueden ver, los **23 tests funcionales de UI** han pasado exitosamente:
>
> - **6 tests** de SearchBar (comportamiento de búsqueda)
> - **7 tests** de Header Cart Badge (badge del carrito)
> - **10 tests** de BookList (renderizado de lista)
>
> Todos se ejecutaron en aproximadamente **10-12 segundos**."

---

## 📊 Visualización del Reporte HTML

**[Pantalla: Terminal]**

```bash
npx playwright show-report
```

**[Navegar por el reporte en el navegador]**

> "En el reporte HTML podemos ver:
>
> - ✅ **23 tests passed** en verde
> - ⏱️ **Tiempos de ejecución** de cada test (todos bajo 2 segundos)
> - 📸 **Screenshots** en caso de fallo (ninguno en este caso)
> - 📂 **Organización por archivo** (searchbar, header-badge, booklist)
>
> El reporte facilita identificar rápidamente qué componente tiene problemas si algún test falla."

---

## 🎯 Diferencias con Tests de Aceptación

**[Pantalla: Comparación lado a lado de archivos]**

> "Es importante destacar las **diferencias entre estos tests de UI y los tests de aceptación**:
>
> **Tests de Aceptación (Criterio 1)**:
> - Validan **flujos completos end-to-end**
> - Simulan **acciones del usuario de principio a fin**
> - Verifican **integración entre múltiples componentes**
> - Más largos y complejos (30-60 segundos por test)
>
> **Tests Funcionales de UI (Criterio 2)**:
> - Validan **componentes individuales**
> - Se enfocan en **lógica y comportamiento específico**
> - Prueban **validaciones, estados, y renderizado**
> - Más rápidos y atómicos (1-3 segundos por test)
> - No repiten flujos largos
>
> Ambos tipos son complementarios y necesarios para una cobertura completa."

---

## 🔧 Características Técnicas de los Tests de UI

**[Pantalla: Código mostrando características]**

> "Estos tests implementan las siguientes **mejores prácticas para tests de UI**:
>
> **1. Alcance reducido**: Cada test valida **una sola funcionalidad específica**.
>
> **2. beforeEach consistente**: Todos limpian localStorage y navegan a la ruta apropiada.
>
> **3. Selectores específicos**: Uso de clases CSS del componente (`.book-card__title`, `.search-bar__input`).
>
> **4. Validaciones completas**:
>    - Estado de elementos (visible, habilitado, deshabilitado)
>    - Contenido de texto preciso
>    - Formato de datos (precios, URLs)
>    - Conteo de elementos
>
> **5. Esperas apropiadas**: `waitForTimeout()` solo cuando es necesario para el filtrado.
>
> **6. Sin dependencias externas**: Todo funciona solo con BOOKS_MOCK y localStorage."

---

## 🧪 Casos de Prueba Específicos Destacados

**[Pantalla: Código de casos interesantes]**

### Caso 1: Validación de Mensaje de Error (SearchBar)

> "Este test valida que al buscar un libro inexistente:
>
> 1. La lista queda vacía (0 cards).
> 2. Aparece el mensaje: 'No se han encontrado libros con el título...'.
> 3. El mensaje incluye el término buscado.
>
> Esto asegura una buena UX cuando no hay resultados."

### Caso 2: Persistencia del Badge (Cart Badge)

> "Este test es crítico para la experiencia del usuario:
>
> 1. Añade libro → Badge = 1
> 2. Recarga página → Badge debe seguir = 1
> 3. Navega a otra página → Badge debe seguir = 1
>
> Demuestra que localStorage funciona correctamente."

### Caso 3: Validación de Paginación (BookList)

> "Este test valida comportamiento complejo:
>
> 1. Usuario está en página 1 → Ve libros A, B, C...
> 2. Navega a página 2 → Ve libros diferentes K, L, M...
> 3. Hace clic en un libro → Va al detalle
> 4. Vuelve atrás → Sigue en página 2
>
> Esto asegura que el estado de navegación se mantiene."

---

## 📝 Nomenclatura para Evidencia

**[Pantalla: Estructura de describe/it]**

> "Todos los tests usan la nomenclatura explícita:
>
> **'Pruebas funcionales de UI – Criterio 2 Actividad 3'**
>
> Ejemplo:
> ```typescript
> test.describe('Pruebas funcionales de UI – Criterio 2 Actividad 3: SearchBar', () => {
>   test('debe mostrar el label correcto "Buscar por título"', ...)
> })
> ```
>
> Esto facilita identificarlos en el reporte y usarlos como evidencia en la vídeo-memoria."

---

## 🎓 Conclusión (30 segundos)

**[Pantalla: Resumen de resultados]**

> "En resumen, he implementado **23 tests funcionales de UI** que validan:
>
> ✅ **Comportamiento del SearchBar**: filtrado, mensajes, estados del input  
> ✅ **Badge del carrito**: actualización, persistencia en localStorage  
> ✅ **Renderizado de BookList**: paginación, datos correctos, layout  
> ✅ **Validaciones de UI**: labels, placeholders, formatos de precio  
> ✅ **Estados de elementos**: visibilidad, habilitación, foco  
> ✅ **Interactividad**: clicks, navegación, actualización en tiempo real  
>
> Estos tests cubren el **Criterio 2 de la Actividad 3**, demostrando la correcta automatización de pruebas funcionales de interfaz de usuario para Relatos de Papel.
>
> Gracias por su atención."

---

## 📝 Comandos de Referencia para la Demostración

```bash
# Ejecutar todos los tests de UI
npx playwright test tests/ui/

# Ejecutar un componente específico
npx playwright test tests/ui/searchbar-ui-behavior.spec.ts
npx playwright test tests/ui/header-cart-badge-ui.spec.ts
npx playwright test tests/ui/booklist-rendering.spec.ts

# Ejecutar en modo headed (ver navegador)
npx playwright test tests/ui/ --headed

# Ejecutar un solo test específico
npx playwright test tests/ui/searchbar-ui-behavior.spec.ts:20

# Ver el reporte
npx playwright show-report

# Ejecutar en modo debug
npx playwright test tests/ui/ --debug

# Ejecutar TODOS los tests (acceptance + ui)
npx playwright test
```

---

## 📋 Checklist para la Vídeo-Memoria

- [ ] Aplicación corriendo en `http://localhost:5173`
- [ ] Todos los tests de UI pasando (23/23)
- [ ] Grabar al menos 1 test de cada componente en modo headed
- [ ] Mostrar código de al menos 2 tests completos
- [ ] Mostrar reporte HTML con los 23 tests
- [ ] Explicar diferencia entre tests de UI y tests de acceptance
- [ ] Destacar persistencia de localStorage
- [ ] Mostrar estructura de carpetas `tests/ui/`
- [ ] Mencionar que son 3 componentes validados
- [ ] Tiempo total: ~5-7 minutos

---

## 🔄 Cobertura Combinada: Acceptance + UI

**[Pantalla: Ambos reportes juntos]**

> "Combinando los tests de acceptance (Criterio 1) y los tests de UI (Criterio 2), tenemos:
>
> **Total de tests**: 39 tests automatizados
> - 16 tests de aceptación (flujos end-to-end)
> - 23 tests funcionales de UI (componentes individuales)
>
> **Cobertura**:
> - ✅ Búsqueda y filtrado
> - ✅ Detalle de libro
> - ✅ Carrito de compras
> - ✅ Checkout y validaciones
> - ✅ Persistencia de datos
> - ✅ Navegación y routing
> - ✅ Renderizado de componentes
> - ✅ Estados de UI
>
> Esto demuestra una **cobertura exhaustiva** del frontend de Relatos de Papel."

---

## 📊 Comparación Visual Tests Acceptance vs UI

| Aspecto | Tests Acceptance (Criterio 1) | Tests UI (Criterio 2) |
|---------|-------------------------------|----------------------|
| **Alcance** | Flujos completos end-to-end | Componentes individuales |
| **Duración** | 12-15 segundos (16 tests) | 10-12 segundos (23 tests) |
| **Cantidad** | 16 tests en 3 escenarios | 23 tests en 3 componentes |
| **Enfoque** | Experiencia del usuario | Lógica y comportamiento de UI |
| **Complejidad** | Alta (múltiples pasos) | Media (validaciones específicas) |
| **Carpeta** | `tests/acceptance/` | `tests/ui/` |

---

**Fecha de creación**: 19 de febrero de 2026  
**Proyecto**: Relatos de Papel  
**Estudiante**: Diego Arévalo  
**Actividad**: Actividad 3 - Criterio 2 (Tests Funcionales de UI)
