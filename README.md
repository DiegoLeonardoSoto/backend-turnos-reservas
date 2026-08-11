# Backend Turnos y Reservas

API REST para la gestión de servicios y reservas de un sistema de turnos, desarrollada con Node.js, Express y ESM.

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

El servidor se levanta en `http://localhost:8080` por defecto.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto donde se ejecuta el servidor | `8080` |
| `NODE_ENV` | Entorno de ejecución | `development` |

Hay un archivo `.env.example` como referencia.

---

## Arquitectura en capas

La API sigue una arquitectura en capas con separación estricta de responsabilidades:

```
router → controller → service → repository → DAO → archivo JSON
```

| Capa | Responsabilidad |
|------|----------------|
| **Router** | Define los endpoints y los conecta al controller correspondiente |
| **Controller** | Lee la request (`req`), llama al service, y responde con `res`. No contiene lógica de negocio. |
| **Service** | Contiene las reglas de negocio. No conoce `req` ni `res`, solo trabaja con datos. |
| **Repository** | Ofrece métodos de acceso a datos (`getAll`, `getById`, `create`, `update`, `delete`) sin lógica de negocio. Actúa como interfaz entre el service y el DAO. |
| **DAO (Data Access Object)** | Lee y escribe directamente en el archivo JSON. Sin lógica de negocio ni validaciones. |

### ¿Por qué esta arquitectura?

- **Separación de responsabilidades**: cada capa tiene un único propósito. Si cambia la fuente de datos (ej. pasar de JSON a MongoDB), solo se modifica el DAO.
- **Testabilidad**: cada capa puede testearse de forma aislada mediante inyección de dependencias.
- **Mantenibilidad**: las reglas de negocio están concentradas en los services, sin mezclarse con detalles de HTTP o persistencia.

### Reglas

- Los controllers son los únicos que acceden a `req` y `res`.
- Los services no importan `express` ni acceden a archivos.
- Los repositories no contienen reglas de negocio, solo delegan al DAO.
- Los DAOs no validan ni transforman datos, solo leen y escriben.

---

## Recurso `services`

Cada servicio representa un tratamiento o prestación disponible para reservar.

### Estructura

```json
{
  "id": 1,
  "name": "Corte de Pelo",
  "description": "Corte de pelo personalizado según el estilo del cliente.",
  "duration": 45,
  "price": 25,
  "category": "Pelo",
  "available": true
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | Identificador único (autogenerado) |
| `name` | `string` | Nombre del servicio |
| `description` | `string` | Descripción del servicio |
| `duration` | `number` | Duración en minutos |
| `price` | `number` | Precio del servicio |
| `category` | `string` | Categoría del servicio |
| `available` | `boolean` | Disponibilidad del servicio |

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/services` | Obtener todos los servicios |
| `GET` | `/api/services?category=Pelo` | Filtrar servicios por categoría |
| `GET` | `/api/services/:id` | Obtener un servicio por ID |
| `POST` | `/api/services` | Crear un nuevo servicio |
| `PUT` | `/api/services/:id` | Actualizar un servicio |
| `DELETE` | `/api/services/:id` | Eliminar un servicio |

### Ejemplos de uso

#### Obtener todos los servicios

```
GET /api/services

Response 200:
{
  "status": "success",
  "payload": [
    {
      "id": 1,
      "name": "Corte de Pelo",
      "description": "Corte de pelo personalizado según el estilo del cliente.",
      "duration": 45,
      "price": 25,
      "category": "Pelo",
      "available": true
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
  "payload": [
    {
      "id": 1,
      "name": "Corte de Pelo",
      ...
    },
    {
      "id": 2,
      "name": "Lavado y Peinado",
      ...
    }
  ]
}
```

#### Obtener un servicio por ID

```
GET /api/services/3

Response 200:
{
  "status": "success",
  "payload": {
    "id": 3,
    "name": "Coloración",
    "description": "Aplicación de color completo con productos de alta calidad.",
    "duration": 120,
    "price": 80,
    "category": "Color",
    "available": true
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
    "id": 9,
    "name": "Masaje Descontracturante",
    "description": "Masaje focalizado en zonas de tensión.",
    "duration": 50,
    "price": 45,
    "category": "Bienestar",
    "available": true
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
PUT /api/services/1

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
    "id": 1,
    "name": "Corte de Pelo Premium",
    "description": "Corte con lavado y styling incluido.",
    "duration": 60,
    "price": 35,
    "category": "Pelo",
    "available": true
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
DELETE /api/services/1

Response 200:
{
  "status": "success",
  "payload": {
    "id": 1,
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
  "id": 1,
  "clientName": "María González",
  "clientEmail": "maria.gonzalez@email.com",
  "date": "2025-08-10",
  "time": "10:00",
  "status": "confirmed",
  "services": [
    { "service": 1, "quantity": 1 },
    { "service": 2, "quantity": 1 }
  ]
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | Identificador único (autogenerado) |
| `clientName` | `string` | Nombre del cliente |
| `clientEmail` | `string` | Email del cliente |
| `date` | `string` | Fecha de la reserva (formato `YYYY-MM-DD`) |
| `time` | `string` | Hora de la reserva (formato `HH:mm`) |
| `status` | `string` | Estado de la reserva: `pending`, `confirmed`, `cancelled`, `completed` |
| `services` | `array` | Lista de servicios reservados. Cada item tiene `service` (ID del servicio) y `quantity` (cantidad). Si se agrega el mismo servicio dos veces, se incrementa `quantity`. |

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/bookings` | Crear una nueva reserva |
| `GET` | `/api/bookings/:id` | Obtener una reserva por ID |
| `POST` | `/api/bookings/:id/services/:sid` | Agregar un servicio a una reserva existente |

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
    { "service": 7, "quantity": 1 },
    { "service": 1, "quantity": 1 }
  ]
}

Response 201:
{
  "status": "success",
  "payload": {
    "id": 5,
    "clientName": "Lucía Fernández",
    "clientEmail": "lucia.fernandez@email.com",
    "date": "2025-08-13",
    "time": "11:00",
    "status": "confirmed",
    "services": [
      { "service": 7, "quantity": 1 },
      { "service": 1, "quantity": 1 }
    ]
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
GET /api/bookings/1

Response 200:
{
  "status": "success",
  "payload": {
    "id": 1,
    "clientName": "María González",
    "clientEmail": "maria.gonzalez@email.com",
    "date": "2025-08-10",
    "time": "10:00",
    "status": "confirmed",
    "services": [
      { "service": 1, "quantity": 1 },
      { "service": 2, "quantity": 1 }
    ]
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
POST /api/bookings/1/services/3

Response 201:
{
  "status": "success",
  "payload": {
    "id": 1,
    "clientName": "María González",
    "clientEmail": "maria.gonzalez@email.com",
    "date": "2025-08-10",
    "time": "10:00",
    "status": "confirmed",
    "services": [
      { "service": 1, "quantity": 1 },
      { "service": 2, "quantity": 1 },
      { "service": 3, "quantity": 1 }
    ]
  }
}
```

Si se vuelve a agregar el mismo servicio, se incrementa `quantity`:

```
POST /api/bookings/1/services/3

Response 201:
{
  "status": "success",
  "payload": {
    ...
    "services": [
      { "service": 1, "quantity": 1 },
      { "service": 2, "quantity": 1 },
      { "service": 3, "quantity": 2 }
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
