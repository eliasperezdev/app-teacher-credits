# API Response Shapes

> Extraídas de requests reales al servidor (localhost:3000).
> Todas las responses envuelven los datos en `{ "data": ... }`.

---

## Auth

### `POST /auth/login`

**Response:**
```json
{
  "data": {
    "token": "eyJ...",
    "teacher": {
      "id": "56dd56fe-dfcf-4bb7-9f4b-b4c4ce5c6c45",
      "email": "ex@gma.com",
      "name": "Elias"
    }
  }
}
```

---

## Subjects

### `GET /subjects` — Lista

```json
{
  "data": [
    {
      "id": "7d717a56-6c62-400a-84dd-448c93d113bc",
      "name": "Programación I",
      "code": "PROG-1",
      "createdAt": "2026-05-25T19:30:02.321Z",
      "_count": {
        "commissions": 1
      }
    }
  ]
}
```

### `GET /subjects/:id` — Detalle

```json
{
  "data": {
    "id": "7d717a56-6c62-400a-84dd-448c93d113bc",
    "name": "Programación I",
    "code": "PROG-1",
    "createdAt": "2026-05-25T19:30:02.321Z",
    "commissions": [
      {
        "id": "01358c64-3cd4-4e7c-af61-468aee16912c",
        "name": "Lunes tarde",
        "year": 2025,
        "period": 1
      }
    ]
  }
}
```

### `POST /subjects` — Crear

**Body:**
```json
{ "name": "Programación II", "code": "PROG-2" }
```

**Response:** misma forma que `GET /subjects/:id`.

### `PATCH /subjects/:id` — Editar

**Body:** subset de `{ name, code }`.

### `DELETE /subjects/:id` — Eliminar

---

## Commissions

### `POST /subjects/:id/commissions` — Crear

**Body:**
```json
{
  "name": "Martes manana",
  "year": 2025,
  "period": 1,
  "minGroupSize": 3,
  "maxGroupSize": 5,
  "creditValue": 0.05,
  "autoCompleteGroups": true
}
```

**Response:**
```json
{
  "data": {
    "id": "18ca03df-b274-4d9b-8f82-53cb95bf7ce7",
    "name": "Martes manana",
    "year": 2025,
    "period": 1,
    "minGroupSize": 3,
    "maxGroupSize": 5,
    "creditValue": 0.05,
    "autoCompleteGroups": true,
    "createdAt": "2026-05-25T20:33:39.332Z"
  }
}
```

### `GET /subjects/:id/commissions` — Lista

```json
{
  "data": [
    {
      "id": "01358c64-3cd4-4e7c-af61-468aee16912c",
      "name": "Lunes tarde",
      "year": 2025,
      "period": 1,
      "minGroupSize": 3,
      "maxGroupSize": 5,
      "creditValue": 0.05,
      "autoCompleteGroups": true,
      "createdAt": "2026-05-25T20:10:20.887Z",
      "_count": {
        "commissionStudents": 68,
        "groups": 0
      }
    }
  ]
}
```

### `GET /commissions/:id` — Detalle

```json
{
  "data": {
    "id": "01358c64-3cd4-4e7c-af61-468aee16912c",
    "name": "Lunes tarde",
    "year": 2025,
    "period": 1,
    "minGroupSize": 3,
    "maxGroupSize": 5,
    "creditValue": 0.05,
    "autoCompleteGroups": true,
    "createdAt": "2026-05-25T20:10:20.887Z",
    "subject": {
      "id": "7d717a56-6c62-400a-84dd-448c93d113bc",
      "name": "Programación I",
      "code": "PROG-1"
    },
    "_count": {
      "commissionStudents": 68,
      "groups": 0,
      "classSessions": 0
    }
  }
}
```

### `PATCH /commissions/:id` — Editar

**Body:** subset de los campos del POST.

**Response:** misma forma que `GET /commissions/:id` (sin `subject` ni `_count`).

### `DELETE /commissions/:id` — Eliminar

```json
{
  "data": {
    "message": "Comisión eliminada correctamente"
  }
}
```

---

## Students

### `GET /commissions/:id/students` — Lista

```json
{
  "data": [
    {
      "id": "122a9067-7afc-4984-9a95-2d7a95e3206f",
      "fileNumber": "53991",
      "lastName": "ADAN THOMA",
      "firstName": "ALEX AGUSTÍN",
      "enrolledAt": "2026-05-25T20:26:44.912Z",
      "group": null
    }
  ]
}
```

**Nota:** `group` es `null` cuando no tiene grupo asignado. Cuando tiene grupo, será un objeto.

### `POST /commissions/:id/students` — Inscribir

**Body:**
```json
{ "fileNumber": "123456" }
```

**Error si el alumno no existe en SIU:**
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "No existe ningún alumno con legajo \"99999\". Importalo primero desde el SIU Guaraní."
}
```

### `DELETE /commissions/:id/students/:studentId` — Desinscribir

```json
{
  "data": {
    "message": "Alumno desinscripto correctamente"
  }
}
```

### `POST /commissions/:id/students/import` — Importar

**Content-Type:** `multipart/form-data`
**Campo:** `file` (`.xlsx`, máx 5MB)
**Columnas:** `nro`, `legajo`, `"APELLIDO, Nombre"`

---

## Groups

### `POST /commissions/:id/groups` — Crear

**Body:**
```json
{ "name": "Los Capos" }
```

**Response:**
```json
{
  "data": {
    "id": "0a633877-a9f8-4cd0-9d5e-4a1871a6bb73",
    "name": "Los Capos",
    "isActive": true,
    "totalCredits": 0,
    "createdAt": "2026-05-25T21:12:54.523Z",
    "members": []
  }
}
```

### `GET /commissions/:id/groups` — Lista

```json
{
  "data": [
    {
      "id": "019be56a-eaf0-44fd-8b5c-f447279cf3ed",
      "name": "Los Bugs",
      "isActive": true,
      "totalCredits": 0,
      "createdAt": "2026-05-25T20:44:45.127Z",
      "members": [
        {
          "id": "f6a9598b-b4ff-4504-8e6f-04bb30a6ebb8",
          "fileNumber": "54061",
          "lastName": "ALBRECH",
          "firstName": "SERGIO ESTEBAN",
          "joinedAt": "2026-05-25T20:46:39.362Z"
        }
      ]
    }
  ]
}
```

### `GET /groups/:id` — Detalle

```json
{
  "data": {
    "id": "019be56a-eaf0-44fd-8b5c-f447279cf3ed",
    "name": "Los Bugs",
    "isActive": true,
    "totalCredits": 0,
    "createdAt": "2026-05-25T20:44:45.127Z",
    "members": [
      {
        "id": "f6a9598b-b4ff-4504-8e6f-04bb30a6ebb8",
        "fileNumber": "54061",
        "lastName": "ALBRECH",
        "firstName": "SERGIO ESTEBAN",
        "joinedAt": "2026-05-25T20:46:39.362Z"
      }
    ],
    "creditEvents": []
  }
}
```

### `PATCH /groups/:id` — Editar

**Body:**
```json
{ "name": "Nuevo nombre", "isActive": true }
```

**Response:** misma forma que `POST /commissions/:id/groups`.

**Nota:** `isActive = false` excluye el grupo de sorteos.

### `DELETE /groups/:id` — Eliminar

```json
{
  "data": {
    "message": "Grupo eliminado correctamente"
  }
}
```

**Restricción:** falla si tiene créditos registrados.

### `POST /groups/:id/members` — Agregar integrante

**Body:**
```json
{ "studentId": "uuid" }
```

**Response:**
```json
{
  "data": {
    "id": "28c0893e-cc0a-469a-b7d9-873420e67bc6",
    "fileNumber": "32193",
    "lastName": "ANTELO LAURENCIO",
    "firstName": "RAMIRO",
    "joinedAt": "2026-05-25T21:13:45.734Z"
  }
}
```

**Error 409 — ya tiene grupo:**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "El alumno ya pertenece al grupo \"Los Bugs\" en esta comisión"
}
```

### `DELETE /groups/:id/members/:studentId` — Quitar integrante

```json
{
  "data": {
    "message": "Integrante removido correctamente"
  }
}
```

**Nota:** Es soft delete — conserva historial, setea `leftAt`.

---

## Sessions

### `POST /commissions/:id/sessions` — Abrir sesión

**Body:**
```json
{ "notes": "Clase de repaso" }
```

**Response:**
```json
{
  "data": {
    "id": "7b019201-bd2e-4776-959c-fd7180a9e3c0",
    "sessionDate": "2026-05-25",
    "notes": "Clase de repaso",
    "isClosed": false,
    "createdAt": "2026-05-25T21:19:51.104Z",
    "_count": {
      "raffles": 0,
      "creditEvents": 0
    }
  }
}
```

**Error 409 — ya hay sesión abierta hoy:**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Ya hay una sesión abierta para hoy en esta comisión."
}
```

### `GET /commissions/:id/sessions` — Historial

```json
{
  "data": [
    {
      "id": "7b019201-bd2e-4776-959c-fd7180a9e3c0",
      "sessionDate": "2026-05-25",
      "notes": null,
      "isClosed": false,
      "createdAt": "2026-05-25T21:19:51.104Z",
      "_count": {
        "raffles": 0,
        "creditEvents": 0
      }
    }
  ]
}
```

### `GET /sessions/:id` — Detalle

```json
{
  "data": {
    "id": "7b019201-bd2e-4776-959c-fd7180a9e3c0",
    "sessionDate": "2026-05-25",
    "notes": null,
    "isClosed": false,
    "createdAt": "2026-05-25T21:19:51.104Z",
    "_count": {
      "raffles": 0,
      "creditEvents": 0
    },
    "raffles": [],
    "creditEvents": []
  }
}
```

### `PATCH /sessions/:id/close` — Cerrar sesión

**Body:** `{}` (vacío o sin body).

**Response:**
```json
{
  "data": {
    "id": "7b019201-bd2e-4776-959c-fd7180a9e3c0",
    "sessionDate": "2026-05-25",
    "notes": null,
    "isClosed": true,
    "createdAt": "2026-05-25T21:19:51.104Z",
    "_count": {
      "raffles": 0,
      "creditEvents": 0
    }
  }
}
```

**Restricción:** falla si hay sorteos en estado `PENDING`.

---

## Raffles (Sorteos)

### `POST /sessions/:id/raffles` — Ejecutar sorteo

**Body:**
```json
{ "quantity": 2 }
```

**Response:**
```json
{
  "data": {
    "id": "338e35bb-a75b-43fb-9f2a-dae2fa348fe6",
    "quantity": 2,
    "roundNumber": 1,
    "createdAt": "2026-05-25T22:30:22.150Z",
    "results": [
      {
        "id": "b526d08a-10bd-4065-97a9-41bde73166e7",
        "status": "PENDING",
        "resolvedAt": null,
        "group": {
          "id": "0141e271-f656-4ea3-a9db-3e32671acfa2",
          "name": "Grupo Alpha",
          "totalCredits": 0,
          "memberCount": 3
        }
      },
      {
        "id": "c8634794-99ee-47b2-b92b-6a4376dcb5d7",
        "status": "PENDING",
        "resolvedAt": null,
        "group": {
          "id": "117def87-d336-4cfd-8c97-3aa1650076b9",
          "name": "Grupo Beta",
          "totalCredits": 0,
          "memberCount": 3
        }
      }
    ]
  }
}
```

**Error 400 — quantity > grupos disponibles:**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Se pidieron 3 grupos pero solo hay 2 disponibles en el pool"
}
```

**Error 409 — todos los grupos ya participaron/ausentes hoy:**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Todos los grupos ya participaron o fueron marcados ausentes hoy"
}
```

### `GET /sessions/:id/raffles` — Listar sorteos

```json
{
  "data": [
    {
      "id": "338e35bb-a75b-43fb-9f2a-dae2fa348fe6",
      "quantity": 2,
      "roundNumber": 1,
      "createdAt": "2026-05-25T22:30:22.150Z",
      "results": [
        {
          "id": "b526d08a-10bd-4065-97a9-41bde73166e7",
          "status": "PARTICIPATED",
          "resolvedAt": "2026-05-25T22:30:47.658Z",
          "group": {
            "id": "0141e271-f656-4ea3-a9db-3e32671acfa2",
            "name": "Grupo Alpha",
            "totalCredits": 1,
            "memberCount": 3
          }
        }
      ]
    }
  ]
}
```

### `PATCH /raffle-results/:id/status` — Resolver resultado

**Body:**
```json
{ "status": "PARTICIPATED" }
```

**Estados válidos:** `PARTICIPATED`, `ABSENT`, `SKIPPED`

**Response:**
```json
{
  "data": {
    "id": "b526d08a-10bd-4065-97a9-41bde73166e7",
    "status": "PARTICIPATED",
    "resolvedAt": "2026-05-25T22:30:47.658Z",
    "group": {
      "id": "0141e271-f656-4ea3-a9db-3e32671acfa2",
      "name": "Grupo Alpha",
      "totalCredits": 1,
      "memberCount": 3
    }
  }
}
```

**Nota:** `PARTICIPATED` crea automáticamente un `creditEvent` con `amount: 1` y `reason: "Participación en sorteo"`.

### `POST /sessions/:id/raffles/:raffleId/rerun` — Re-sortear pendientes

**Body:** `{}` (vacío).

**Response esperada:** mismo formato que `POST /sessions/:id/raffles` (nuevo sorteo).

**Error 409 — no hay PENDING:**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "No hay grupos pendientes para re-sortear en este sorteo"
}
```

**Nota:** Los `PENDING` pasan a `SKIPPED` y se crea un nuevo sorteo.

---

## Session después de sorteos (detalle)

```json
{
  "data": {
    "id": "d06bf42a-d5b4-4183-8daf-447a3f12592a",
    "sessionDate": "2026-05-25",
    "notes": "Sesión de prueba para sorteos",
    "isClosed": false,
    "_count": {
      "raffles": 1,
      "creditEvents": 1
    },
    "raffles": [
      {
        "id": "338e35bb-a75b-43fb-9f2a-dae2fa348fe6",
        "quantity": 2,
        "roundNumber": 1,
        "results": [
          {
            "id": "b526d08a-10bd-4065-97a9-41bde73166e7",
            "status": "PARTICIPATED",
            "resolvedAt": "2026-05-25T22:30:47.658Z",
            "group": { "id": "...", "name": "Grupo Alpha", "totalCredits": 1, "memberCount": 3 }
          },
          {
            "id": "c8634794-99ee-47b2-b92b-6a4376dcb5d7",
            "status": "ABSENT",
            "resolvedAt": "2026-05-25T22:31:00.785Z",
            "group": { "id": "...", "name": "Grupo Beta", "totalCredits": 0, "memberCount": 3 }
          }
        ]
      }
    ],
    "creditEvents": [
      {
        "id": "2e205010-cb9f-456a-bf0f-51555335d1f2",
        "amount": 1,
        "reason": "Participación en sorteo",
        "createdAt": "2026-05-25T22:30:47.678Z",
        "group": { "id": "...", "name": "Grupo Alpha" },
        "reversedBy": null
      }
    ]
  }
}
```

---

## Credits

### `POST /groups/:id/credits` — Sumar crédito manual

**Body:**
```json
{
  "amount": 1,
  "sessionId": "uuid",
  "reason": "Participacion destacada"
}
```

**Response:**
```json
{
  "data": {
    "id": "5eb4cc37-6aac-415d-9cc1-4e8527ce9399",
    "amount": 1,
    "reason": "Participacion destacada",
    "createdAt": "2026-05-25T22:49:47.918Z",
    "isReversal": false,
    "reversedById": null,
    "session": {
      "id": "d06bf42a-d5b4-4183-8daf-447a3f12592a",
      "sessionDate": "2026-05-25"
    },
    "raffleResult": null
  }
}
```

### `GET /groups/:id/credits` — Historial

```json
{
  "data": {
    "totalCredits": 2,
    "events": [
      {
        "id": "5eb4cc37-6aac-415d-9cc1-4e8527ce9399",
        "amount": 1,
        "reason": "Participacion destacada",
        "createdAt": "2026-05-25T22:49:47.918Z",
        "isReversal": false,
        "reversedById": null,
        "session": { "id": "...", "sessionDate": "2026-05-25" },
        "raffleResult": null
      },
      {
        "id": "2e205010-cb9f-456a-bf0f-51555335d1f2",
        "amount": 1,
        "reason": "Participación en sorteo",
        "createdAt": "2026-05-25T22:30:47.678Z",
        "isReversal": false,
        "reversedById": null,
        "session": { "id": "...", "sessionDate": "2026-05-25" },
        "raffleResult": {
          "id": "b526d08a-10bd-4065-97a9-41bde73166e7",
          "status": "PARTICIPATED"
        }
      }
    ]
  }
}
```

### `POST /credits/:id/reverse` — Revertir crédito

Sin body (o `{}`).

**Response:**
```json
{
  "data": {
    "id": "ae955ec4-8d8a-4524-b20a-ac71da40336e",
    "amount": -1,
    "reason": "Reversión de evento 5eb4cc37-6aac-415d-9cc1-4e8527ce9399",
    "createdAt": "2026-05-25T22:50:12.686Z",
    "isReversal": true,
    "reversedById": "5eb4cc37-6aac-415d-9cc1-4e8527ce9399",
    "session": { "id": "...", "sessionDate": "2026-05-25" },
    "raffleResult": null
  }
}
```

**Error 409 — ya revertido:**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Este evento ya fue revertido anteriormente"
}
```

**Restricciones:**
- No puede revertirse dos veces
- La sesión debe estar abierta

### `GET /commissions/:id/credits/summary` — Resumen

```json
{
  "data": {
    "creditValue": 0.05,
    "groups": [
      {
        "id": "uuid",
        "name": "Grupo Alpha",
        "isActive": true,
        "totalCredits": 1,
        "pointsValue": 0.05,
        "memberCount": 3,
        "members": [
          {
            "id": "uuid",
            "lastName": "ADAN THOMA",
            "firstName": "ALEX AGUSTÍN",
            "totalCredits": 1,
            "pointsValue": 0.05
          }
        ]
      }
    ]
  }
}
```

---

## Notas clave

1. **Todos los IDs son UUIDs** (v4), no strings numéricos.
2. **Fechas en ISO 8601** con timezone (`2026-05-25T19:30:02.321Z`).
3. **`_count`** viene en listas de subjects/commissions para mostrar contadores sin hacer queries adicionales.
4. **El detalle de comisión** incluye `subject` embebido y `_count` con `commissionStudents`, `groups`, `classSessions`.
5. **La lista de comisiones** (dentro de subject) solo trae `id`, `name`, `year`, `period` — no los campos completos. Para el detalle completo hay que usar `GET /commissions/:id`.
6. **Students** tienen `group: null` cuando no están asignados a un grupo.

---

## Checklist para agregar nuevos endpoints a React Query

Cuando pidas agregar un nuevo endpoint, necesito esta info para crear los archivos `*Keys.js`, `*Service` y `use*` hooks:

### 1. Datos del endpoint

```
Método HTTP: GET | POST | PATCH | DELETE
URL:         /ruta/:paramId/recurso
Auth:        Bearer token (siempre sí, via axios interceptor)
```

### 2. Request (si aplica)

- **Body JSON** — estructura completa o subset
- **Content-Type** — `application/json` (default) o `multipart/form-data`
- **Path params** — qué IDs vienen en la URL (`subjectId`, `commissionId`, etc.)
- **Query params** — filtros, paginación, etc.

### 3. Response confirmada con curl real

Necesito el JSON exacto que devuelve el servidor. Si el endpoint no existe aún, puedo asumir la forma pero hay que confirmar después.

**Importante:** todas las responses del servidor siguen este patrón:
```json
{ "data": { ... } }
```
O para listas:
```json
{ "data": [ ... ] }
```

### 4. Errores especiales (si aplica)

Algunos endpoints devuelven errores con mensajes específicos (ej: alumno no existe en SIU). Útil para mostrar feedback al usuario.

### 5. Qué invalidar en el cache

Al crear/editar/eliminar un recurso, necesito saber:
- ¿Qué listas se ven afectadas? → invalidar `*Keys.lists(parentId)`
- ¿Qué detalles se ven afectados? → invalidar `*Keys.detail(id)`
- ¿Hay contadores `_count` en recursos padres que necesiten refresh?

### Patrón de archivos a crear

Para cada nuevo recurso se crean 3 archivos:

| Archivo | Contenido |
|---|---|
| `src/api/*Keys.js` | Query keys para cache (all, lists, details, detail) |
| `src/api/*.js` | Servicio con las funciones que llaman a axios |
| `src/hooks/use*.js` | Hooks de React Query (useQuery + useMutation) |

### Ejemplo de template para pedir un nuevo recurso

```
Endpoint: GET /commissions/:id/sessions
Método: GET
Response real:
{
  "data": [
    { "id": "...", "date": "...", "topic": "..." }
  ]
}

Endpoint: POST /commissions/:id/sessions
Método: POST
Body: { "date": "2025-06-01", "topic": "Clase 1" }
Response real: { "data": { "id": "...", ... } }

Endpoint: DELETE /sessions/:id
Método: DELETE
Invalida: lista de sessions de esa comisión
```
