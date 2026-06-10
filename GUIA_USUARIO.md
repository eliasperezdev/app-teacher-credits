# 📘 Guía de Usuario — Sistema de Participación

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Acceso y Autenticación](#2-acceso-y-autenticación)
3. [Panel Principal (Dashboard)](#3-panel-principal-dashboard)
4. [Gestión de Materias](#4-gestión-de-materias)
5. [Gestión de Comisiones](#5-gestión-de-comisiones)
6. [Consola de Clase (Sorteos)](#6-consola-de-clase-sorteos)
7. [Gestión de Comisiones (Configuración, Alumnos, Grupos)](#7-gestión-de-comisiones-configuración-alumnos-grupos)
8. [Historial de Créditos](#8-historial-de-créditos)
9. [Ranking Público](#9-ranking-público)
10. [Flujos de Trabajo Completos](#10-flujos-de-trabajo-completos)
11. [Glosario](#11-glosario)

---

## 1. Introducción

El **Sistema de Participación** es una plataforma diseñada para docentes que necesitan gestionar la participación de alumnos en clase mediante un sistema de **créditos por sorteos**. El sistema permite:

- Organizar alumnos en **comisiones** dentro de **materias**
- Formar **grupos de trabajo**
- Realizar **sorteos en vivo** durante las clases
- Registrar participación, ausencias y omisiones
- Acumular **créditos** que se convierten en puntos para la calificación
- Compartir un **ranking público** con los alumnos

---

## 2. Acceso y Autenticación

### 2.1 Iniciar Sesión

1. Accedé a la URL del sistema (por defecto: `http://localhost:5173` en desarrollo)
2. Serás redirigido automáticamente a la pantalla de **Login**
3. Ingresá tu **correo electrónico** y **contraseña** de docente
4. Hacé clic en **"Iniciar Sesión"**

> Si las credenciales son incorrectas, aparecerá un mensaje de error en rojo.

### 2.2 Cerrar Sesión

- Hacé clic en el ícono de **logout** (flecha saliendo de una puerta) en la esquina superior derecha del header
- La sesión se cierra inmediatamente y serás redirigido al login

### 2.3 Sesión Persistente

- El sistema mantiene la sesión activa mediante cookies seguras
- Al refrescar la página o cerrar el navegador, la sesión se mantiene (7 días)
- Si el token expira, se renueva automáticamente

---

## 3. Panel Principal (Dashboard)

### 3.1 Vista General

Al iniciar sesión, llegás al **Dashboard** (`/dashboard` o `/commissions`), que muestra:

- **Header superior**: logo, nombre del docente, avatar y botón de logout
- **Título**: "Mis Comisiones" con el período actual
- **Botones de acción**: "Crear Materia" y "+ Nueva Comisión"
- **Tarjetas de comisiones**: una por cada comisión existente

### 3.2 Tarjetas de Comisión

Cada tarjeta muestra:

| Elemento | Descripción |
|---|---|
| **Badge de materia** | Nombre de la materia a la que pertenece |
| **Nombre** | Nombre de la comisión (ej: "Lunes tarde") |
| **Período** | Año y cuatrimestre |
| **Alumnos** | Cantidad de alumnos inscriptos |
| **Grupos** | Cantidad de grupos creados |
| **Alerta roja** | Aparece si no se importaron alumnos aún |

### 3.3 Acciones Rápidas desde la Tarjeta

Cada tarjeta tiene botones para:

- **Abrir Consola de Clase** → Va a la vista de sorteos en vivo
- **Gestionar** → Va a la configuración de la comisión
- **Alumnos** → Va directamente a la pestaña de alumnos
- **Ver Historial** → Va al resumen de créditos (solo si hay alumnos)

---

## 4. Gestión de Materias

### 4.1 Crear una Materia

1. Hacé clic en **"Crear Materia"** en el Dashboard
2. Se abre un modal con dos campos:
   - **Nombre**: nombre de la materia (ej: "Programación I")
   - **Código**: código identificador (ej: "PROG-1")
3. Completá ambos campos y hacé clic en **"Crear"**

### 4.2 Visualizar Materias

- Las materias aparecen como contenedores en el Dashboard
- Cada materia muestra sus comisiones asociadas debajo
- Si una materia no tiene comisiones, muestra "Sin comisiones"

---

## 5. Gestión de Comisiones

### 5.1 Crear una Comisión

1. Hacé clic en **"+ Nueva Comisión"** en el Dashboard
2. Completá el formulario:

| Campo | Descripción | Ejemplo |
|---|---|---|
| **Materia** | Seleccioná la materia | "Programación I" |
| **Nombre** | Nombre de la comisión | "Lunes tarde" |
| **Año** | Año lectivo | 2026 |
| **Período** | Cuatrimestre | 1er o 2do |
| **Grupo mín.** | Tamaño mínimo de grupo | 3 |
| **Grupo máx.** | Tamaño máximo de grupo | 5 |
| **Valor de crédito** | Puntos que vale cada crédito | 0.05 |
| **Auto-completar grupos** | Si se activa, los grupos se llenan automáticamente | ✅ |

3. Hacé clic en **"Crear"**

### 5.2 Editar una Comisión

1. Desde el Dashboard, hacé clic en el ícono de **engranaje** ⚙️ en la tarjeta
2. O bien, hacé clic en **"Gestionar"**
3. Se abre la vista de gestión con la pestaña **Configuración**
4. Modificá los campos que necesites
5. Hacé clic en **"Guardar Cambios"**

### 5.3 Eliminar una Comisión

1. En la vista de gestión, bajá hasta la **"Zona de Peligro"**
2. Hacé clic en **"Eliminar Comisión"**
3. Confirmá la eliminación
4. ⚠️ **Esta acción es irreversible**: se eliminan alumnos, grupos y sesiones asociadas

---

## 6. Consola de Clase (Sorteos)

Esta es la vista principal del sistema, donde se realizan los sorteos en vivo durante las clases.

### 6.1 Acceder a la Consola

- Desde el Dashboard: botón **"Abrir Consola de Clase"** en cualquier tarjeta
- URL: `/commission/:id/class`

### 6.2 Iniciar una Clase

1. Al entrar, verás un formulario para **Iniciar Clase de Hoy**
2. Opcionalmente escribí una **nota** (ej: "Clase de repaso")
3. Hacé clic en **"Iniciar Clase"**

> **Regla**: Solo se puede abrir **una sesión por día**. Si ya se cerró una sesión hoy, no se pueden abrir más.

### 6.3 Interfaz de la Consola

La consola tiene **tres paneles**:

#### Panel Izquierdo — Nuevo Sorteo

| Elemento | Función |
|---|---|
| **Selector de cantidad** | Botones `+` y `-` para elegir cuántos grupos sortear |
| **Disponibles** | Muestra cuántos grupos quedan sin participar hoy |
| **Botón "Lanzar Sorteo"** | Ejecuta el sorteo con la cantidad seleccionada |
| **Botón "Re-sortear ausentes"** | Aparece cuando hay grupos ausentes/omitidos |

#### Panel Central — Grupos Seleccionados

Muestra los resultados del sorteo actual:

- **Grupos pendientes**: aparecen con botones para resolver
- **Grupos resueltos**: se muestran en la sección "Resueltos" con su estado

#### Panel Derecho — Acciones y Registro

| Elemento | Función |
|---|---|
| **Deshacer última acción** | Revierte el último crédito otorgado |
| **Estadísticas** | Contadores de participaron, ausentes y rondas |
| **Registro en vivo** | Timeline cronológico de todas las acciones de la sesión |

### 6.4 Resolver un Sorteo

Cuando un grupo es sorteado, aparecen **tres botones**:

| Botón | Acción | Efecto |
|---|---|---|
| **+ Sumar** (verde) | El grupo participó | Otorga **+1 crédito** automáticamente |
| **- Falta** (rojo) | El grupo estuvo ausente | Marca como **ausente**, sin crédito |
| **~** (gris) | Omitir | Marca como **omitido**, sin crédito ni penalización |

### 6.5 Re-sortear Ausentes/Omitidos

Si hay grupos marcados como **ausentes** u **omitidos**:

1. Aparece un botón **"Re-sortear ausentes/omitidos (X)"**
2. Al hacer clic, esos grupos se marcan como `SKIPPED` y se sortean nuevos grupos como reemplazo
3. Si no hay grupos disponibles para reemplazar, aparece la opción **"Descartar grupos pendientes"**

### 6.6 Advertencia de Pendientes

Si intentás lanzar un nuevo sorteo sin resolver los pendientes:

1. Aparece un **modal de advertencia** mostrando los grupos sin resolver
2. Podés elegir:
   - **Re-sortear estos grupos** → Re-sortear los ausentes/omitidos
   - **Descartar pendientes y hacer sorteo nuevo** → Descartar y continuar
   - **Cancelar** → Volver a la consola

### 6.7 Corregir un Estado

1. En la sección **"Resueltos"**, pasá el mouse sobre un grupo resuelto
2. Aparece un ícono de **lápiz** ✏️
3. Hacé clic para abrir el modal de corrección
4. Elegí el nuevo estado:
   - **Marcar como Participó** → +1 crédito
   - **Marcar como Ausente** → -1 crédito
   - **Marcar como Omitido** → Sin cambio
5. La corrección queda registrada en el historial

### 6.8 Cerrar la Sesión

1. Hacé clic en **"Cerrar Sesión"** en la esquina superior derecha
2. Se confirma con un `confirm()` del navegador
3. ⚠️ No se puede cerrar si hay sorteos en estado `PENDING`

---

## 7. Gestión de Comisiones (Configuración, Alumnos, Grupos)

### 7.1 Acceder

- Desde el Dashboard: botón **"Gestionar"** o ícono ⚙️
- URL: `/commission/:id`
- Tres pestañas: **Configuración**, **Alumnos e Importación**, **Gestión de Grupos**

---

### 7.2 Pestaña: Configuración

#### Editar Comisión

Formulario con los mismos campos que al crear la comisión (ver [5.2](#52-editar-una-comisión)).

#### Link Público de Ranking

1. Hacé clic en **"Generar Link Público"**
2. Se genera un enlace único tipo `/public/:slug`
3. Podés **copiar** el enlace al portapapeles
4. Podés **revocar** el enlace en cualquier momento (deja de funcionar)

#### Zona de Peligro

- Botón para **eliminar la comisión** con confirmación doble
- Ver [5.3](#53-eliminar-una-comisión)

---

### 7.3 Pestaña: Alumnos e Importación

#### Importar Alumnos desde SIU Guaraní

1. Si no hay alumnos, aparece una zona de carga destacada
2. Hacé clic en la zona o arrastrá un archivo **Excel/CSV** (`.xlsx`, `.xls`, `.csv`)
3. El archivo debe tener las columnas: `nro`, `legajo`, `APELLIDO, Nombre`
4. El sistema valida por **Legajo** contra el SIU Guaraní
5. Si un legajo no existe en el SIU, muestra error

#### Lista de Alumnos

- **Buscador**: filtrá por apellido, nombre o legajo
- **Tabla** con columnas:
  - Alumno (avatar + nombre)
  - Legajo
  - Grupo asignado (o "Sin grupo")
  - Créditos acumulados
  - Acciones

#### Acciones por Alumno

| Botón | Función |
|---|---|
| **Editar** | Abre modal para modificar nombre, apellido o legajo |
| **Canjear** | Resta todos los créditos del alumno (solo si tiene créditos > 0) |

#### Modal: Editar Alumno

- Campos: Nombre, Apellido, Legajo
- Solo se guardan los campos que modificaste
- Hacé clic en **"Guardar Cambios"**

#### Modal: Canjear Créditos

- Muestra el nombre del alumno y cantidad de créditos
- Confirmá con **"Confirmar Canje"**
- Se crea un evento de crédito negativo con razón "Canje de créditos"

---

### 7.4 Pestaña: Gestión de Grupos

#### Vista General

- **Columna izquierda**: Directorio de grupos (lista seleccionable)
- **Columna derecha**: Editor del grupo seleccionado

#### Crear un Grupo

1. Hacé clic en **"+ Crear Nuevo Grupo"**
2. Escribí el nombre del grupo
3. Hacé clic en **"Crear"**

#### Directorio de Grupos

Cada grupo en el directorio muestra:

- **Badge** con las primeras letras del nombre
- **Nombre** del grupo
- **Cantidad de alumnos** (con alerta si está incompleto)
- **Botón de eliminar** (aparece al pasar el mouse)

Los grupos **incompletos** (menos del mínimo) se muestran con borde rojo.

#### Editor de Grupo

Al seleccionar un grupo, se abre el editor con dos columnas:

**Columna izquierda — Buscar y Agregar:**

1. Buscá alumnos por nombre o legajo
2. Los alumnos sin grupo aparecen disponibles
3. Los alumnos ya asignados muestran su estado:
   - "Ya en este grupo" (deshabilitado)
   - "En [nombre del grupo]" (deshabilitado)
4. Hacé clic en **"+ Agregar"** para añadir un alumno

**Columna derecha — Integrantes Actuales:**

- Lista de miembros actuales del grupo
- Cada miembro tiene un botón de **eliminar** 🗑️
- Muestra el contador `actual/máximo`

#### Editar Nombre del Grupo

- El nombre del grupo es un campo editable directamente en el header del editor
- Se guarda automáticamente al salir del campo (onBlur) o al presionar Enter

#### Eliminar un Grupo

1. En el directorio, pasá el mouse sobre el grupo
2. Hacé clic en el ícono de **basurero** 🗑️
3. Confirmá la eliminación
4. ⚠️ Falla si el grupo tiene créditos registrados

---

## 8. Historial de Créditos

### 8.1 Acceder

- Desde el Dashboard: botón **"Ver Historial"** (solo si hay alumnos)
- Desde la gestión de comisión: no hay acceso directo, usar Dashboard
- URL: `/commission/:id/history`

### 8.2 Estadísticas Generales

En la parte superior se muestran 4 tarjetas:

| Tarjeta | Información |
|---|---|
| **Grupos** | Total de grupos y cuántos están activos |
| **Alumnos** | Total de alumnos con grupo asignado |
| **Promedio Créditos** | Promedio de créditos por alumno |
| **Valor Crédito** | Cuántos puntos vale cada crédito |

### 8.3 Filtros

- **Buscador**: filtrá por nombre de grupo o alumno
- **Tipo de filtro**:
  - Todos los grupos
  - Activos
  - Inactivos
  - ≥5 créditos
  - <5 créditos
- **Limpiar**: resetea todos los filtros

### 8.4 Tabla de Alumnos

Cada fila muestra:

| Columna | Contenido |
|---|---|
| **Alumno** | Avatar + nombre completo |
| **Estado** | Activo / Inactivo (badge de color) |
| **Créditos** | Cantidad de créditos acumulados |
| **Puntos** | Valor en puntos (créditos × valor de crédito) |
| **Acciones** | Botón "Ver detalle" (link al grupo) |

Los alumnos están agrupados por su grupo, con un header separador.

---

## 9. Ranking Público

### 9.1 Qué Es

El ranking público es una vista **sin autenticación** que muestra el estado actual de los grupos y sus créditos. Cualquiera con el enlace puede verlo.

### 9.2 Generar el Enlace

1. Andá a **Gestión de Comisión** → pestaña **Configuración**
2. Sección **"Link Público de Ranking"**
3. Hacé clic en **"Generar Link Público"**
4. Copiá el enlace y compartilo

### 9.3 Revocar el Enlace

1. En la misma sección, hacé clic en **"Revocar"**
2. El enlace deja de funcionar inmediatamente
3. Quienes intenten acceder verán un mensaje de "Link no válido o expirado"

### 9.4 Vista del Ranking

- **Header**: materia, comisión, año y cuatrimestre
- **Lista de grupos**: ordenados por ranking
- Cada grupo muestra:
  - Nombre y cantidad de integrantes
  - Total de créditos y puntos
- Hacé clic en un grupo para **expandirlo** y ver los miembros
- Cada miembro muestra: nombre, legajo, créditos y puntos
- Al pie: valor por crédito

---

## 10. Flujos de Trabajo Completos

### 10.1 Flujo: Configuración Inicial del Semestre

```
1. Crear Materia → Dashboard > "Crear Materia"
2. Crear Comisión → Dashboard > "+ Nueva Comisión"
   → Seleccionar materia, configurar parámetros
3. Importar Alumnos → Gestión > pestaña "Alumnos"
   → Subir archivo Excel del SIU Guaraní
4. Crear Grupos → Gestión > pestaña "Grupos"
   → Crear grupos y asignar alumnos manualmente
5. (Opcional) Generar Link Público → Gestión > "Configuración"
   → Generar y compartir con alumnos
```

### 10.2 Flujo: Clase Típica con Sorteos

```
1. Abrir Consola → Dashboard > "Abrir Consola de Clase"
2. Iniciar Clase → Escribir nota (opcional) > "Iniciar Clase"
3. Lanzar Sorteo → Seleccionar cantidad > "Lanzar Sorteo"
4. Resolver cada grupo sorteado:
   → "+ Sumar" si participó
   → "- Falta" si estuvo ausente
   → "~" si se omite
5. (Opcional) Re-sortear ausentes → Botón "Re-sortear ausentes/omitidos"
6. Repetir pasos 3-5 según necesidad
7. (Opcional) Deshacer última acción → Botón "Deshacer"
8. (Opcional) Corregir estado → Hover sobre resuelto > ícono ✏️
9. Cerrar Sesión → Botón "Cerrar Sesión"
```

### 10.3 Flujo: Corrección de Errores

```
Opción A — Deshacer inmediato:
  → Botón "Deshacer última acción" en panel derecho
  → Revierte el último crédito otorgado

Opción B — Corregir estado de un grupo:
  → Hover sobre grupo en "Resueltos" > ícono ✏️
  → Elegir nuevo estado (Participó/Ausente/Omitido)
  → Los créditos se ajustan automáticamente

Opción C — Canjear créditos de un alumno:
  → Gestión > pestaña "Alumnos"
  → Botón "Canjear" en el alumno
  → Confirmar canje (resta todos los créditos)
```

### 10.4 Flujo: Gestión de Grupos

```
1. Crear grupo → Gestión > "Grupos" > "+ Crear Nuevo Grupo"
2. Agregar integrantes → Seleccionar grupo > buscar alumno > "+ Agregar"
3. Quitar integrante → Panel derecho > botón 🗑️ en el miembro
4. Renombrar grupo → Clic en el nombre > editar > Enter o clic fuera
5. Eliminar grupo → Directorio > hover > botón 🗑️
```

---

## 11. Glosario

| Término | Definición |
|---|---|
| **Materia** | Asignatura académica (ej: Programación I). Contiene comisiones. |
| **Comisión** | Subdivisión de una materia con un horario/turno específico (ej: Lunes tarde). |
| **Grupo** | Equipo de trabajo formado por varios alumnos dentro de una comisión. |
| **Sesión** | Una clase en un día específico. Se abre y se cierra. |
| **Sorteo** | Selección aleatoria de grupos para participar en una sesión. |
| **Crédito** | Unidad de participación. Cada crédito vale una cantidad de puntos configurable. |
| **PARTICIPATED** | Estado: el grupo participó en el sorteo. Otorga +1 crédito. |
| **ABSENT** | Estado: el grupo estuvo ausente. Sin crédito. |
| **SKIPPED** | Estado: el grupo fue omitido. Sin crédito ni penalización. |
| **PENDING** | Estado: el grupo fue sorteado pero aún no se resolvió. |
| **REPLACED** | Estado: el grupo fue reemplazado por otro en un re-sorteo. |
| **Link Público** | Enlace sin autenticación para ver el ranking de grupos. |
| **SIU Guaraní** | Sistema de gestión académica desde donde se importan los alumnos. |
| **Auto-completar grupos** | Opción de configuración que permite llenar grupos automáticamente. |
| **Canjear créditos** | Acción de restar todos los créditos de un alumno (como "cobrar" sus puntos). |

---

## Notas Importantes

- **Una sesión por día**: No se pueden abrir dos sesiones en el mismo día para la misma comisión.
- **No se puede cerrar sesión con sorteos pendientes**: Todos los grupos sorteados deben estar resueltos antes de cerrar.
- **Los grupos inactivos no participan en sorteos**: Si `isActive = false`, el grupo queda excluido.
- **No se puede eliminar un grupo con créditos**: Primero hay que revertir los créditos.
- **El canje de créditos es irreversible**: Una vez canjeados, los créditos se restan permanentemente.
- **El link público es accesible para cualquiera**: Quien tenga el enlace puede ver el ranking. Revocalo si es necesario.
