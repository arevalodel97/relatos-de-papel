# 📹 Libreto para Vídeo-Memoria: Tests de Aceptación (Criterio 1 - Actividad 3)

## 🎬 Introducción (30 segundos)

**[Pantalla: VS Code abierto en el proyecto]**

> "Hola, soy Diego Arévalo y voy a presentar los **tests de aceptación automatizados** para el proyecto **Relatos de Papel**, correspondientes al **Criterio 1 de la Actividad 3**."
>
> "Estos tests validan **flujos completos end-to-end** del usuario, desde la búsqueda de libros hasta la finalización de la compra, utilizando **Playwright** como framework de automatización."

---

## 📦 Escenario 1: Flow Completo - Búsqueda → Detalle → Carrito → Resumen

**[Pantalla: Archivo `1-search-detail-cart.spec.ts` abierto]**

> "El **primer escenario** simula el flujo completo de un cliente que busca un libro, lo visualiza en detalle, lo añade al carrito y revisa el resumen."

### Test 1.1: Cliente busca un libro, lo ve en detalle, lo añade al carrito y revisa el resumen

**[Mostrar código del test 1.1]**

> "Este test valida el **happy path** completo:
>
> 1. **Given**: El cliente está en la página de inicio con 40 libros en el catálogo y el carrito vacío.
> 2. **When**: Escribe 'Sombras' en la barra de búsqueda.
> 3. **Then**: Se filtran los resultados mostrando solo libros que contienen 'Sombras' en el título.
> 4. **When**: Hace clic en el primer libro filtrado.
> 5. **Then**: Navega a la página de detalle mostrando título, precio, descripción e imagen.
> 6. **When**: Añade el libro al carrito mediante el modal.
> 7. **Then**: El badge del carrito se actualiza a 1.
> 8. **When**: Navega a `/cart`.
> 9. **Then**: Se muestra 1 item en el carrito con el libro correcto."

**[Ejecutar test en modo headed]**

```bash
npx playwright test tests/acceptance/1-search-detail-cart.spec.ts:4 --headed
```

> "Como pueden ver, el test simula las acciones del usuario en el navegador y valida cada paso del flujo."

---

### Test 1.2: El carrito persiste después de recargar la página

**[Mostrar código del test 1.2]**

> "Este test valida la **persistencia del carrito usando localStorage**:
>
> 1. El usuario añade un libro al carrito.
> 2. Navega a `/cart` y verifica que hay 1 item.
> 3. **Recarga la página**.
> 4. Valida que el carrito sigue teniendo 1 item.
>
> Esto asegura que los datos no se pierden al refrescar el navegador."

---

### Test 1.3: Búsqueda sin resultados muestra lista vacía

**[Mostrar código del test 1.3]**

> "Este test valida el **manejo de búsquedas sin resultados**:
>
> 1. El usuario busca un término que no existe: 'xyz1234567890notexist'.
> 2. La lista de libros queda vacía.
> 3. Se muestra el mensaje: 'No se han encontrado libros con el título...'.
>
> Esto asegura que la aplicación maneja correctamente casos donde no hay coincidencias."

---

## 🚫 Escenario 2: Validación de Flujo - Intento de Pago con Carrito Vacío

**[Pantalla: Archivo `2-empty-checkout.spec.ts` abierto]**

> "El **segundo escenario** valida que la aplicación maneja correctamente el intento de acceder al checkout con el carrito vacío."

### Tests del Escenario 2

**[Mostrar estructura de los 5 tests]**

> "Este escenario incluye **5 tests** que validan:
>
> **Test 2.1**: Al acceder a `/checkout` con carrito vacío, se muestra el mensaje 'No hay artículos para pagar — tu carrito está vacío'.
>
> **Test 2.2**: El botón 'Pagar' **no está visible** cuando el carrito está vacío, previniendo acciones inválidas.
>
> **Test 2.3**: Se muestra el botón 'Explorar libros' como call-to-action para que el usuario vuelva al catálogo.
>
> **Test 2.4**: Al hacer clic en 'Explorar libros', navega correctamente a `/home`.
>
> **Test 2.5**: El mensaje de carrito vacío está en **español correcto**, validando la localización de la aplicación."

**[Ejecutar uno de los tests]**

```bash
npx playwright test tests/acceptance/2-empty-checkout.spec.ts:6 --headed
```

> "Estos tests aseguran una **experiencia de usuario clara y sin errores** cuando el carrito está vacío."

---

## 🔍 Escenario 3: Filtrado y Búsqueda - Resultados por Criterio

**[Pantalla: Archivo `3-search-filters.spec.ts` abierto]**

> "El **tercer escenario** valida exhaustivamente el sistema de búsqueda de libros."

### Tests del Escenario 3

**[Mostrar estructura de los 8 tests]**

> "Este escenario incluye **8 tests** que validan diferentes aspectos de la búsqueda:
>
> **Test 3.1**: La búsqueda por texto filtra libros correctamente, mostrando solo los que coinciden.
>
> **Test 3.2**: La búsqueda es **insensible a mayúsculas y minúsculas** - buscar 'sombras', 'SOMBRAS' o 'Sombras' da los mismos resultados.
>
> **Test 3.3**: Funciona la **búsqueda parcial (substring matching)** - buscar 'som' encuentra 'Sombras'.
>
> **Test 3.4**: Al limpiar la búsqueda, se restauran todos los libros del catálogo.
>
> **Test 3.5**: Una búsqueda sin resultados muestra el mensaje apropiado.
>
> **Test 3.6**: Test de **performance** - la búsqueda se ejecuta en aproximadamente 350ms.
>
> **Test 3.7**: Búsquedas múltiples consecutivas actualizan los resultados correctamente.
>
> **Test 3.8**: Búsqueda con string vacío restaura la vista inicial."

**[Ejecutar test de performance]**

```bash
npx playwright test tests/acceptance/3-search-filters.spec.ts:148 --headed
```

> "El test de performance es especialmente importante para asegurar que la aplicación responde rápidamente a las búsquedas del usuario."

---

## ✅ Ejecución de Todos los Tests de Acceptance

**[Pantalla: Terminal]**

> "Ahora voy a ejecutar **todos los tests de aceptación** para demostrar que funcionan correctamente."

```bash
npx playwright test tests/acceptance/
```

**[Mostrar resultados]**

> "Como pueden ver, los **16 tests de aceptación** han pasado exitosamente:
>
> - **3 tests** del Escenario 1 (Flow completo)
> - **5 tests** del Escenario 2 (Carrito vacío)
> - **8 tests** del Escenario 3 (Filtrado y búsqueda)
>
> Todos se ejecutaron en aproximadamente **12 segundos**."

---

## 📊 Visualización del Reporte HTML

**[Pantalla: Terminal]**

> "Playwright genera un **reporte HTML interactivo** que podemos visualizar:"

```bash
npx playwright show-report
```

**[Navegar por el reporte HTML en el navegador]**

> "En este reporte podemos ver:
>
> - ✅ Tests que pasaron (en verde)
> - ❌ Tests que fallaron (si los hubiera)
> - 📸 Screenshots automáticos en caso de fallos
> - ⏱️ Tiempos de ejecución de cada test
> - 📹 Videos de la ejecución (si están habilitados)"

---

## 🎯 Características Técnicas Implementadas

**[Pantalla: Código de configuración]**

> "Estos tests utilizan las siguientes **mejores prácticas**:
>
> 1. **Patrón Given-When-Then**: Cada test está estructurado con comentarios que explican el escenario, la acción y la validación.
>
> 2. **Selectores robustos**: Uso de selectores CSS específicos (`.book-card`, `.search-bar__input`) y selectores semánticos (`text=/.../, role="..."`).
>
> 3. **Esperas explícitas**: `waitForLoadState('networkidle')` y `waitFor()` para evitar falsos negativos.
>
> 4. **Limpieza de estado**: Cada test limpia `localStorage` antes de ejecutarse para asegurar independencia.
>
> 5. **Validaciones completas**: No solo verificamos que elementos existan, sino también su contenido, estado (visible/habilitado) y comportamiento.
>
> 6. **Coverage completo**: Los tests cubren casos felices (happy path), casos de error y casos límite."

---

## 🔧 Configuración del Proyecto

**[Pantalla: package.json y playwright.config.ts]**

> "Los tests están configurados en el proyecto de la siguiente manera:
>
> - **Framework**: Playwright con TypeScript
> - **Navegadores**: Chromium (puede extenderse a Firefox y WebKit)
> - **Puerto de la aplicación**: `http://localhost:5173`
> - **Workers paralelos**: 6 (para ejecución rápida)
> - **Timeout por test**: 30 segundos
> - **Reporters**: HTML report, list (consola)"

---

## 🎓 Conclusión (30 segundos)

**[Pantalla: Resumen de resultados]**

> "En resumen, he implementado **16 tests de aceptación end-to-end** que validan:
>
> ✅ El flujo completo de búsqueda, detalle y carrito  
> ✅ El manejo correcto de carrito vacío  
> ✅ El sistema de búsqueda y filtrado exhaustivo  
> ✅ La persistencia de datos en localStorage  
> ✅ La experiencia de usuario en español  
> ✅ El rendimiento de la aplicación  
>
> Estos tests cubren el **Criterio 1 de la Actividad 3**, demostrando la correcta automatización de pruebas de aceptación para Relatos de Papel.
>
> Gracias por su atención."

---

## 📝 Comandos de Referencia para la Demostración

```bash
# Ejecutar todos los tests de acceptance
npx playwright test tests/acceptance/

# Ejecutar un escenario específico
npx playwright test tests/acceptance/1-search-detail-cart.spec.ts

# Ejecutar en modo headed (ver navegador)
npx playwright test tests/acceptance/ --headed

# Ejecutar un solo test
npx playwright test tests/acceptance/1-search-detail-cart.spec.ts:4

# Ver el reporte
npx playwright show-report

# Ejecutar en modo debug
npx playwright test tests/acceptance/ --debug
```

---

## 📋 Checklist para la Vídeo-Memoria

- [ ] Aplicación corriendo en `http://localhost:5173`
- [ ] Todos los tests pasando (16/16)
- [ ] Grabar navegador en modo headed para mostrar interacción
- [ ] Mostrar código de al menos 1 test completo
- [ ] Mostrar reporte HTML
- [ ] Explicar estructura Given-When-Then
- [ ] Mencionar los 3 escenarios y qué validan
- [ ] Tiempo total: ~5-7 minutos

---

**Fecha de creación**: 19 de febrero de 2026  
**Proyecto**: Relatos de Papel  
**Estudiante**: Diego Arévalo  
**Actividad**: Actividad 3 - Criterio 1 (Tests de Aceptación)
