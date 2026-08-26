# Backend Turnos y Reservas

API REST para la gestión de servicios y reservas de un sistema de turnos, desarrollada con Node.js, Express, MongoDB y Mongoose (ESM).

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
- **Migración sin fricción**: esta arquitectura permitió migrar la persistencia de FileSystem (JSON) a MongoDB Atlas cambiando únicamente la capa DAO. Controllers y services no se modificaron.

### Reglas

- Los controllers son los únicos que acceden a `req` y `res`.
- Los services no importan `express` ni acceden a la base de datos directamente.
- Los repositories no contienen reglas de negocio, solo delegan al DAO.
- Los DAOs no validan ni transforman datos, solo leen y escriben.

---

## Recurso `services`

Cada servicio representa un tratamiento o prestación disponible para reservar.

### Estructura

```json
{
  "_id": "64a1b2c3d4e5f60718293a4b",
  "name": "Corte de Pelo",
  "description": "Corte de pelo personalizado según el estilo del cliente.",
  "duration": 45,
  "price": 25,
  "category": "pelo",
  "available": true,
  "createdAt": "2025-08-10T14:30:00.000Z",
  "updatedAt": "2025-08-10T14:30:00.000Z"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | `ObjectId` | Identificador único (autogenerado por MongoDB) |
| `name` | `string` | Nombre del servicio |
| `description` | `string` | Descripción del servicio |
| `duration` | `number` | Duración en minutos |
| `price` | `number` | Precio del servicio |
| `category` | `string` | Categoría del servicio (se almacena en minúsculas) |
| `available` | `boolean` | Disponibilidad del servicio |
| `createdAt` / `updatedAt` | `date` | Timestamps autogenerados por Mongoose |

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/services` | Obtener todos los servicios |
| `GET` | `/api/services?category=Pelo` | Filtrar servicios por categoría (sin distinguir mayúsculas) |
| `GET` | `/api/services?available=true` | Filtrar servicios por disponibilidad |
| `GET` | `/api/services/:sid` | Obtener un servicio por ID |
| `POST` | `/api/services` | Crear un nuevo servicio |
| `PUT` | `/api/services/:sid` | Actualizar un servicio |
| `DELETE` | `/api/services/:sid` | Eliminar un servicio |

> Los valores de `_id` y los timestamps de los ejemplos son ilustrativos: los reales los genera MongoDB.

### Ejemplos de uso

#### Obtener todos los servicios

```
GET /api/services

Response 200:
{
  "status": "success",
  "count": 2,
  "payload": [
    {
      "_id": "64a1b2c3d4e5f60718293a4b",
      "name": "Corte de Pelo",
      "description": "Corte de pelo personalizado según el estilo del cliente.",
      "duration": 45,
      "price": 25,
      "category": "pelo",
      "available": true,
      "createdAt": "2025-08-10T14:30:00.000Z",
      "updatedAt": "2025-08-10T14:30:00.000Z"
    },
    ...
  ]
}
```

#### Filtrar por categoría

```
GET /api/services?category=Pelo

Response 200:
{
  "status": "success",
  "count": 1,
  "payload": [
    {
      "_id": "64a1b2c3d4e5f60718293a4b",
      "name": "Corte de Pelo",
      ...
    }
  ]
}
```

#### Obtener un servicio por ID

```
GET /api/services/64a1b2c3d4e5f60718293a4d

Response 200:
{
  "status": "success",
  "payload": {
    "_id": "64a1b2c3d4e5f60718293a4d",
    "name": "Coloración",
    "description": "Aplicación de color completo con productos de alta calidad.",
    "duration": 120,
    "price": 80,
    "category": "color",
    "available": true,
    "createdAt": "2025-08-10T14:30:00.000Z",
    "updatedAt": "2025-08-10T14:30:00.000Z"
  }
}
```

Si el ID no existe:

```
Response 404:
{
  "status": "error",
  "message": "Service not found"
}
```

#### Crear un servicio

```
POST /api/services

Body (JSON):
{
  "name": "Masaje Descontracturante",
  "description": "Masaje focalizado en zonas de tensión.",
  "duration": 50,
  "price": 45,
  "category": "Bienestar",
  "available": true
}

Response 201:
{
  "status": "success",
  "payload": {
    "_id": "64a1b2c3d4e5f60718293a4e",
    "name": "Masaje Descontracturante",
    "description": "Masaje focalizado en zonas de tensión.",
    "duration": 50,
    "price": 45,
    "category": "bienestar",
    "available": true,
    "createdAt": "2025-08-10T14:30:00.000Z",
    "updatedAt": "2025-08-10T14:30:00.000Z"
  }
}
```

Si faltan campos obligatorios:

```
Response 400:
{
  "status": "error",
  "message": "Missing required fields: name, description, duration, price, category, available"
}
```

#### Actualizar un servicio

```
PUT /api/services/64a1b2c3d4e5f60718293a4b

Body (JSON):
{
  "name": "Corte de Pelo Premium",
  "description": "Corte con lavado y styling incluido.",
  "duration": 60,
  "price": 35,
  "category": "Pelo",
  "available": true
}

Response 200:
{
  "status": "success",
  "payload": {
    "_id": "64a1b2c3d4e5f60718293a4b",
    "name": "Corte de Pelo Premium",
    "description": "Corte con lavado y styling incluido.",
    "duration": 60,
    "price": 35,
    "category": "pelo",
    "available": true,
    "createdAt": "2025-08-10T14:30:00.000Z",
    "updatedAt": "2025-08-10T15:00:00.000Z"
  }
}
```

Si el ID no existe:

```
Response 404:
{
  "status": "error",
  "message": "Service not found or no valid fields to update"
}
```

#### Eliminar un servicio

```
DELETE /api/services/64a1b2c3d4e5f60718293a4b

Response 200:
{
  "status": "success",
  "payload": {
    "_id": "64a1b2c3d4e5f60718293a4b",
    "name": "Corte de Pelo Premium",
    ...
  }
}
```

Si el ID no existe:

```
Response 404:
{
  "status": "error",
  "message": "Service not found"
}
```

---

## Recurso `bookings`

Cada reserva representa un turno asignado a un cliente, compuesto por uno o más servicios.

### Estructura

```json
{
  "_id": "64b2c3d4e5f60718293a4b1",
  "clientName": "María González",
  "clientEmail": "maria.gonzalez@email.com",
  "date": "2025-08-10",
  "time": "10:00",
  "status": "confirmed",
  "services": [
    { "service": "64a1b2c3d4e5f60718293a4b", "quantity": 1 },
    { "service": "64a1b2c3d4e5f60718293a4c", "quantity": 1 }
  ],
  "createdAt": "2025-08-10T14:30:00.000Z",
  "updatedAt": "2025-08-10T14:30:00.000Z"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | `ObjectId` | Identificador único (autogenerado por MongoDB) |
| `clientName` | `string` | Nombre del cliente |
| `clientEmail` | `string` | Email del cliente (se almacena en minúsculas) |
| `date` | `string` | Fecha de la reserva (formato `YYYY-MM-DD`) |
| `time` | `string` | Hora de la reserva (formato `HH:mm`) |
| `status` | `string` | Estado de la reserva: `pending`, `confirmed`, `cancelled`, `completed` |
| `services` | `array` | Lista de servicios reservados. Cada item tiene `service` (ObjectId del servicio) y `quantity` (cantidad). Si se agrega el mismo servicio dos veces, se incrementa `quantity`. |
| `createdAt` / `updatedAt` | `date` | Timestamps autogenerados por Mongoose |

> Los servicios se referencian por `ObjectId`, no como objeto completo.

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/bookings` | Crear una nueva reserva |
| `GET` | `/api/bookings/:bid` | Obtener una reserva por ID |
| `POST` | `/api/bookings/:bid/services/:sid` | Agregar un servicio a una reserva existente |

### Ejemplos de uso

#### Crear una reserva

```
POST /api/bookings

Body (JSON):
{
  "clientName": "Lucía Fernández",
  "clientEmail": "lucia.fernandez@email.com",
  "date": "2025-08-13",
  "time": "11:00",
  "status": "confirmed",
  "services": [
    { "service": "64a1b2c3d4e5f60718293a4b", "quantity": 1 },
    { "service": "64a1b2c3d4e5f60718293a4c", "quantity": 1 }
  ]
}

Response 201:
{
  "status": "success",
  "payload": {
    "_id": "64b2c3d4e5f60718293a4b2",
    "clientName": "Lucía Fernández",
    "clientEmail": "lucia.fernandez@email.com",
    "date": "2025-08-13",
    "time": "11:00",
    "status": "confirmed",
    "services": [
      { "service": "64a1b2c3d4e5f60718293a4b", "quantity": 1 },
      { "service": "64a1b2c3d4e5f60718293a4c", "quantity": 1 }
    ],
    "createdAt": "2025-08-13T11:00:00.000Z",
    "updatedAt": "2025-08-13T11:00:00.000Z"
  }
}
```

Si faltan campos obligatorios (`clientName`, `clientEmail`, `date`, `time`, `status`):

```
Response 400:
{
  "status": "error",
  "message": "Missing required fields: clientName, clientEmail, date, time, status"
}
```

#### Obtener una reserva por ID

```
GET /api/bookings/64b2c3d4e5f60718293a4b1

Response 200:
{
  "status": "success",
  "payload": {
    "_id": "64b2c3d4e5f60718293a4b1",
    "clientName": "María González",
    "clientEmail": "maria.gonzalez@email.com",
    "date": "2025-08-10",
    "time": "10:00",
    "status": "confirmed",
    "services": [
      { "service": "64a1b2c3d4e5f60718293a4b", "quantity": 1 },
      { "service": "64a1b2c3d4e5f60718293a4c", "quantity": 1 }
    ],
    "createdAt": "2025-08-10T14:30:00.000Z",
    "updatedAt": "2025-08-10T14:30:00.000Z"
  }
}
```

Si el ID no existe:

```
Response 404:
{
  "status": "error",
  "message": "Booking not found"
}
```

#### Agregar un servicio a una reserva

```
POST /api/bookings/64b2c3d4e5f60718293a4b1/services/64a1b2c3d4e5f60718293a4d

Response 201:
{
  "status": "success",
  "payload": {
    "_id": "64b2c3d4e5f60718293a4b1",
    "clientName": "María González",
    "clientEmail": "maria.gonzalez@email.com",
    "date": "2025-08-10",
    "time": "10:00",
    "status": "confirmed",
    "services": [
      { "service": "64a1b2c3d4e5f60718293a4b", "quantity": 1 },
      { "service": "64a1b2c3d4e5f60718293a4c", "quantity": 1 },
      { "service": "64a1b2c3d4e5f60718293a4d", "quantity": 1 }
    ],
    "createdAt": "2025-08-10T14:30:00.000Z",
    "updatedAt": "2025-08-10T15:10:00.000Z"
  }
}
```

Si se vuelve a agregar el mismo servicio, se incrementa `quantity`:

```
POST /api/bookings/64b2c3d4e5f60718293a4b1/services/64a1b2c3d4e5f60718293a4d

Response 201:
{
  "status": "success",
  "payload": {
    ...
    "services": [
      { "service": "64a1b2c3d4e5f60718293a4b", "quantity": 1 },
      { "service": "64a1b2c3d4e5f60718293a4c", "quantity": 1 },
      { "service": "64a1b2c3d4e5f60718293a4d", "quantity": 2 }
    ]
  }
}
```

Si la reserva no existe:

```
Response 404:
{
  "status": "error",
  "message": "Booking doesn't exist"
}
```

Si el servicio no existe:

```
Response 404:
{
  "status": "error",
  "message": "Service doesn't exist"
}
```
