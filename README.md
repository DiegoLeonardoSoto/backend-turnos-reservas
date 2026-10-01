# Backend Turnos y Reservas

API REST con vistas server-side (Handlebars), tiempo real (Socket.io) y reportes con agregación, para la gestión de servicios y reservas de un sistema de turnos. Desarrollada con Node.js, Express, MongoDB y Mongoose (ESM).

## Instalación

```bash
pnpm install
```

## Ejecución

```bash
# Desarrollo (con --watch)
pnpm dev

# Producción
pnpm start
```

El servidor se levanta en el puerto definido por la variable de entorno `PORT`.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto donde se ejecuta el servidor | `8080` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `MONGO_URI` | Cadena de conexión a MongoDB Atlas | `mongodb+srv://usuario:clave@cluster.mongodb.net/turnos-reservas` |

Hay un archivo `.env.example` como referencia. **Nunca** subir el `.env` ni `node_modules` al repositorio.

---

## Arquitectura en capas

La API sigue una arquitectura en capas con separación estricta de responsabilidades:

```
router → controller → service → repository → DAO → MongoDB (Atlas)
```

| Capa | Responsabilidad |
|------|----------------|
| **Router** | Define los endpoints y los conecta al controller correspondiente |
| **Controller** | Lee la request (`req`), llama al service, y responde con `res`. No contiene lógica de negocio. |
| **Service** | Contiene las reglas de negocio. No conoce `req` ni `res`, solo trabaja con datos. |
| **Repository** | Ofrece métodos de acceso a datos (`getAll`, `getById`, `create`, `update`, `delete`) sin lógica de negocio. Actúa como interfaz entre el service y el DAO. |
| **DAO (Data Access Object)** | Interactúa con MongoDB a través de Mongoose. Sin lógica de negocio ni validaciones. |
| **Model** | Define el schema de cada colección (`src/models`). |

### ¿Por qué esta arquitectura?

- **Separación de responsabilidades**: cada capa tiene un único propósito.
- **Testabilidad**: cada capa puede testearse de forma aislada mediante inyección de dependencias.
- **Mantenibilidad**: las reglas de negocio están concentradas en los services, sin mezclarse con detalles de HTTP o persistencia.
- **Migración sin fricción**: migrar de una persistencia FileSystem (JSON) a MongoDB Atlas solo requirió cambiar la capa DAO. Controllers y services no se modificaron.

### Reglas

- Los controllers son los únicos que acceden a `req` y `res`.
- Los services no importan `express` ni acceden a la base de datos directamente.
- Los repositories no contienen reglas de negocio, solo delegan al DAO.
- Los DAOs no contienen lógica de negocio ni validaciones — solo operaciones de persistencia, incluidas las primitivas atómicas (`$inc`, `$not`, `$push`) y los pipelines de agregación.

---

## Vistas con Handlebars

Además de la API REST, el servidor renderiza vistas server-side con Handlebars.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/views/services` | Listado de servicios |
| `GET` | `/views/services/:sid` | Detalle de un servicio |
| `GET` | `/views/bookings` | Listado de reservas (usa el reporte, muestra el total gastado) |
| `GET` | `/views/bookings/:bid` | Detalle de una reserva (servicios con `populate`) |

Las vistas viven en `src/views/` (layout en `layouts/main.handlebars`) y usan las mismas capas que la API: `views.controller → service → repository → DAO → model`.

Existe además una vista `error.handlebars` que se renderiza cuando una petición a una vista falla o no encuentra el recurso.

---

## Tiempo real con Socket.io

El botón "Cambiar disponibilidad" en el detalle de un servicio actualiza su disponibilidad en tiempo real, sin recargar la página.

Flujo:

1. El cliente emite `toggle-available` con el `id` del servicio.
2. El servidor flipea `available` de forma atómica (pipeline `$not` en MongoDB).
3. El servidor emite `available-changed` con el servicio actualizado a todos los clientes.
4. Cada cliente actualiza el DOM con el nuevo valor.

Archivos: `public/js/socket.js` (cliente) y la configuración en `src/app.js`.

---

## Recurso `services`

Cada servicio representa una prestación o clase disponible para reservar.

### Estructura

```json
{
  "_id": "6aa1f4be7ffd0a17657a655a",
  "name": "Yoga Integral",
  "description": "Clase de yoga integral para todos los niveles.",
  "duration": 60,
  "price": 4000,
  "category": "yoga",
  "available": true,
  "capacity": 20,
  "reserved": 3,
  "createdAt": "2026-09-10T14:30:00.000Z",
  "updatedAt": "2026-09-10T14:30:00.000Z"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | `ObjectId` | Identificador único (autogenerado por MongoDB) |
| `name` | `string` | Nombre del servicio (único) |
| `description` | `string` | Descripción del servicio |
| `duration` | `number` | Duración en minutos |
| `price` | `number` | Precio por unidad |
| `category` | `string` | Categoría del servicio (ver enum más abajo) |
| `available` | `boolean` | Si el servicio se ofrece actualmente |
| `capacity` | `number` | Cupo total |
| `reserved` | `number` | Cupos ya reservados (arranca en 0 y solo lo mueve el servidor) |
| `createdAt` / `updatedAt` | `date` | Timestamps autogenerados por Mongoose |

Categorías válidas (`category`):

`musculacion`, `cardio`, `funcional`, `crossfit`, `yoga`, `pilates`, `spinning`, `entrenamiento_personal`, `clases_grupales`, `otros`

> La disponibilidad real de cupos es dinámica: `capacity - reserved`. `available` indica si el servicio se ofrece, no si quedan cupos.

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/services` | Listar servicios (con filtros, paginación y ordenamiento) |
| `GET` | `/api/services/:sid` | Obtener un servicio por ID |
| `POST` | `/api/services` | Crear un servicio |
| `PUT` | `/api/services/:sid` | Actualizar un servicio |
| `DELETE` | `/api/services/:sid` | Eliminar un servicio |

> `DELETE /api/services/:sid` devuelve `409` si el servicio tiene reservas asociadas — no se puede eliminar un servicio con turnos.

### Filtros, paginación y ordenamiento

`GET /api/services` acepta los siguientes query params:

| Param | Tipo | Descripción |
|-------|------|-------------|
| `category` | `string` | Filtra por categoría |
| `available` | `"true"` / `"false"` | Filtra por disponibilidad |
| `minPrice` | `number` | Precio mínimo |
| `maxPrice` | `number` | Precio máximo |
| `page` | `number` | Número de página (default `1`) |
| `limit` | `number` | Resultados por página (default `10`) |
| `sortBy` | `string` | Campo por el que ordenar (ej. `price`, `duration`, `name`) |
| `order` | `"asc"` / `"desc"` | Dirección del ordenamiento |

> `minPrice` debe ser menor que `maxPrice`. Valores inválidos (p. ej. `available=si`, `page=0`) devuelven `400`.

La respuesta incluye el listado y los metadatos de paginación:

```json
{
  "status": "success",
  "items": [ ... ],
  "total": 14,
  "page": 1,
  "pageSize": 10,
  "totalPages": 2,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

### Ejemplos

#### Filtrar, paginar y ordenar

```
GET /api/services?category=yoga&available=true&sortBy=price&order=desc&page=1&limit=2
```

#### Crear un servicio

```
POST /api/services

Body:
{
  "name": "Yoga Integral",
  "description": "Clase de yoga integral para todos los niveles.",
  "duration": 60,
  "price": 4000,
  "category": "yoga",
  "available": true,
  "capacity": 20
}

Response 201:
{
  "status": "success",
  "payload": {
    "_id": "6aa1f4be7ffd0a17657a655a",
    "name": "Yoga Integral",
    "description": "Clase de yoga integral para todos los niveles.",
    "duration": 60,
    "price": 4000,
    "category": "yoga",
    "available": true,
    "capacity": 20,
    "reserved": 0,
    "createdAt": "2026-09-10T14:30:00.000Z",
    "updatedAt": "2026-09-10T14:30:00.000Z"
  }
}
```

#### Validación

Los datos de entrada se validan con **Zod antes de llegar a MongoDB**:

- `POST` → `createServiceSchema`: todos los campos requeridos, `category` dentro del enum, `duration` y `capacity` enteros positivos.
- `PUT` → `updateServiceSchema`: cualquier subconjunto de campos, pero al menos uno.
- `GET /` → `getServiceQuerySchema` para los query params.
- `:sid` → ObjectId válido (24 caracteres hex).

Datos inválidos devuelven `400` con el mensaje de validación. Un `:sid` con formato inválido devuelve `400`; con formato válido pero inexistente, `404`.

---

## Recurso `bookings`

Cada reserva representa un turno asignado a un cliente, compuesto por uno o más servicios.

### Estructura

```json
{
  "_id": "6aa1f5f4098648b9eb4249a7",
  "clientName": "Carlos Ruiz",
  "clientEmail": "carlos@email.com",
  "date": "2026-09-20",
  "time": "18:00",
  "status": "confirmed",
  "services": [
    { "service": "6aa1f4be7ffd0a17657a655a", "quantity": 2 }
  ],
  "createdAt": "2026-09-20T14:30:00.000Z",
  "updatedAt": "2026-09-20T14:30:00.000Z"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `clientName` | `string` | Nombre del cliente |
| `clientEmail` | `string` | Email del cliente (se guarda en minúsculas) |
| `date` | `string` | Fecha de la reserva (`YYYY-MM-DD`) |
| `time` | `string` | Hora de la reserva (`HH:mm`, 24h) |
| `status` | `string` | `pending`, `confirmed` o `cancelled` |
| `services` | `array` | Servicios reservados. Cada item tiene `service` (ObjectId) y `quantity`. Si se agrega el mismo servicio dos veces, se incrementa `quantity`. |

> Los servicios se guardan por **referencia** (`ObjectId` + `quantity`), nunca el objeto completo. La consulta con `populate` devuelve los datos completos.

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/bookings` | Listar reservas |
| `GET` | `/api/bookings/report` | Reporte de reservas (ver sección siguiente) |
| `POST` | `/api/bookings` | Crear una reserva |
| `GET` | `/api/bookings/:bid` | Obtener una reserva con sus servicios completos (`populate`) |
| `PUT` | `/api/bookings/:bid` | Actualizar los metadatos de una reserva (cliente, fecha, hora, estado) |
| `DELETE` | `/api/bookings/:bid` | Eliminar una reserva y liberar los cupos de todos sus servicios |
| `POST` | `/api/bookings/:bid/services/:sid` | Agregar un servicio a una reserva |
| `PATCH` | `/api/bookings/:bid/services/:sid` | Quitar un servicio (o reducir su cantidad) de una reserva |

### Crear una reserva

```
POST /api/bookings

Body:
{
  "clientName": "Carlos Ruiz",
  "clientEmail": "carlos@email.com",
  "date": "2026-09-20",
  "time": "18:00",
  "status": "confirmed",
  "service": { "sid": "6aa1f4be7ffd0a17657a655a", "quantity": 1 }
}

Response 201:
{
  "status": "success",
  "payload": { ... reserva creada ... }
}
```

> Se crea con **un** servicio (`service: { sid, quantity }`), no con un array. Los servicios adicionales se agregan después con `POST /:bid/services/:sid`.

Al crear una reserva se reserva el cupo del servicio (incrementa `reserved`):

- Si el servicio no existe → `404`.
- Si no hay cupo o el servicio no está disponible → `409`.
- Si ya existe una reserva para el mismo cliente, día y hora → `409`.

> Existe un índice único compuesto sobre `(date, time, clientEmail)` que impide crear dos reservas idénticas para la misma franja horaria.

### Obtener una reserva con servicios completos

```
GET /api/bookings/6aa1f5f4098648b9eb4249a7

Response 200:
{
  "status": "success",
  "payload": {
    "_id": "6aa1f5f4098648b9eb4249a7",
    "clientName": "Carlos Ruiz",
    "clientEmail": "carlos@email.com",
    "date": "2026-09-20",
    "time": "18:00",
    "status": "confirmed",
    "services": [
      {
        "service": {
          "_id": "6aa1f4be7ffd0a17657a655a",
          "name": "Spinning",
          "price": 3500,
          "duration": 45,
          "category": "spinning"
        },
        "quantity": 2
      }
    ]
  }
}
```

### Validación

- `POST` → `createBookingSchema`: `clientEmail` con `z.email()`, `date` con formato `YYYY-MM-DD`, `time` con formato `HH:mm`, `status` dentro del enum.
- `POST /:bid/services/:sid` → `addServiceSchema` (`quantity` entero positivo) además de los params.
- `:bid` y `:sid` se validan como ObjectId.

---

## Reporte de reservas

`GET /api/bookings/report` devuelve un reporte **anidado**: una entrada por reserva, con el total gastado y el detalle de cada servicio (nombre, cantidad, duración, precio unitario y total por línea).

Se implementa con un pipeline de agregación: `$unwind` → `$lookup` → `$unwind` → `$project` → `$group`.

### Query params

Todos opcionales:

| Param | Tipo | Descripción |
|-------|------|-------------|
| `minDate` | `YYYY-MM-DD` | Filtra reservas desde esta fecha |
| `maxDate` | `YYYY-MM-DD` | Filtra reservas hasta esta fecha |
| `minTotalSpent` | `number` | Filtra reservas con total gastado mayor o igual a este valor |

### Respuesta

```
GET /api/bookings/report?minTotalSpent=5000

Response 200:
{
  "status": "success",
  "payload": [
    {
      "_id": "6aa1f5f4098648b9eb4249a7",
      "clientName": "Carlos Ruiz",
      "date": "2026-09-20",
      "time": "18:00",
      "totalSpent": 11000,
      "services": [
        { "name": "Spinning", "quantity": 2, "duration": 45, "unitPrice": 3500, "totalPrice": 7000 },
        { "name": "Yoga Integral", "quantity": 1, "duration": 60, "unitPrice": 4000, "totalPrice": 4000 }
      ]
    }
  ]
}
```

---

## Transacciones y consistencia de cupos

Las operaciones que modifican **dos colecciones a la vez** (`bookings` y `services.reserved`) se ejecutan dentro de una **transacción de MongoDB** para garantizar atomicidad: o se aplican todos los cambios, o ninguno.

### Operaciones transaccionales

| Operación | Escribe en `services` | Escribe en `bookings` |
|-----------|----------------------|----------------------|
| Crear reserva (`POST /api/bookings`) | `reserveService` (+cupo) | `create` |
| Agregar servicio (`POST /:bid/services/:sid`) | `reserveService` (+cupo) | `addService` |
| Quitar servicio (`PATCH /:bid/services/:sid`) | `releaseService` (−cupo) | `removeService` |
| Eliminar reserva (`DELETE /:bid`) | `releaseService` (−cupo, N veces) | `delete` |

La lógica está orquestada por el helper `runInTransaction` (`src/utils/transactions.js`), que abre una `session`, ejecuta la operación dentro de `session.withTransaction(...)` y libera la session siempre. La `session` viaja como parámetro opcional a través de las capas (`service → repository → DAO`) hasta las operaciones de Mongoose.

### Por qué transacciones

`service.reserved` es un contador desnormalizado que debe mantenerse sincronizado con el array `services` de cada reserva. Sin transacción, un fallo a mitad de la secuencia dejaría la base inconsistente: por ejemplo, cupo reservado pero reserva no creada, o cupos liberados de una reserva que sigue existiendo. La transacción garantiza que si cualquier paso falla, **todo se revierte**.

### Requisito: replica set

Las transacciones multi-documento en MongoDB requieren un **replica set**. **MongoDB Atlas** (incluso el tier gratuito M0) lo provee por defecto, por lo que la conexión configurada en `MONGO_URI` ya soporta transacciones. Un `mongod` **standalone local no**: al ejecutar la app contra una instancia local sin replica set, las operaciones transaccionales fallarán con *"Transaction numbers are only allowed on a replica set member or mongos"*.

### Limitación conocida

El read previo (`getById` / `getServiceById`) se realiza **fuera** de la transacción (sin `session`). Esto deja una pequeña ventana de carrera entre la lectura y la escritura. Para un sistema de turnos de baja concurrencia es aceptable, pero es una limitación a tener en cuenta.

---

## Manejo de errores

| Situación | Status |
|-----------|--------|
| Validación fallida (Zod) | `400` con mensaje claro |
| Recurso no encontrado | `404` |
| Sin cupo / servicio no disponible | `409` |
| Reserva duplicada (mismo cliente, día y hora) | `409` |
| Eliminar un servicio que tiene reservas | `409` |
| Error no controlado | `500` |

Las respuestas negocian contenido: JSON para la API, HTML (`error.handlebars`) para las vistas.
