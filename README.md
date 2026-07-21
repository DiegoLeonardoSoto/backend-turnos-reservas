# Backend Turnos y Reservas

API REST para la gestión de servicios de un sistema de turnos y reservas, desarrollada con Node.js, Express y ESM.

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

Probar los endpoints con Postman o cualquier cliente HTTP.

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
GET /api/services/99

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
