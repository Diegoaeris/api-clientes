# API REST de Clientes

API REST desarrollada con **Node.js**, **Express** y **MySQL** que implementa operaciones CRUD sobre la entidad `cliente`. Proyecto de la actividad sumativa de la Semana 9 de la asignatura Taller de plataformas web.

## Tecnologías

- Node.js y Express
- MySQL (XAMPP) con el paquete `mysql2`
- dotenv para variables de entorno
- Postman para las pruebas

## Requisitos previos

- Node.js (versión LTS)
- XAMPP (o cualquier servidor MySQL) con MySQL iniciado

## Instalación

1. Clona el repositorio e ingresa a la carpeta del proyecto.
2. Instala las dependencias:

```
npm install
```

3. Crea la base de datos y la tabla ejecutando el script `database.sql` (por ejemplo, desde la pestaña SQL de phpMyAdmin).
4. Copia el archivo `.env.example` y renómbralo como `.env`. Ajusta los valores si tu MySQL usa otro usuario o contraseña.
5. Inicia el servidor:

```
npm start
```

El servidor queda disponible en `http://localhost:3000`.

## Modelo de datos

Tabla `cliente`:

| Campo | Tipo | Detalle |
|---|---|---|
| id_cliente | INT | Clave primaria, autoincremental |
| nombre | VARCHAR(100) | Obligatorio |
| email | VARCHAR(150) | Obligatorio, único |
| telefono | VARCHAR(20) | Opcional |
| created_at | DATETIME | Se llena automáticamente |

## Endpoints

| Método | URL | Descripción |
|---|---|---|
| POST | `/api/clientes` | Crear un cliente |
| GET | `/api/clientes` | Listar todos los clientes |
| GET | `/api/clientes/:id` | Obtener un cliente por ID |
| PUT | `/api/clientes/:id` | Actualizar un cliente |
| DELETE | `/api/clientes/:id` | Eliminar un cliente |

Ejemplo de body para POST y PUT:

```json
{
  "nombre": "Diego Rojo",
  "email": "diego@correo.com",
  "telefono": "+56912345678"
}
```

## Manejo de errores

| Código | Cuándo ocurre |
|---|---|
| 400 | Datos inválidos, ID no numérico o JSON mal formado |
| 404 | El cliente o la ruta no existe |
| 409 | Ya existe un cliente con ese email |
| 500 | Error interno del servidor |

## Seguridad

- Todas las consultas SQL son parametrizadas (`?`) para prevenir inyección SQL.
- Validación de nombre, email, teléfono e ID antes de consultar la base de datos.
- Las credenciales se guardan en variables de entorno (`.env`), que no se sube al repositorio.

## Estructura del proyecto

```
├── postman/            Colección de Postman exportada (.json)
├── src/
│   ├── config/db.js    Conexión a MySQL
│   ├── controllers/    Lógica del CRUD
│   ├── routes/         Definición de rutas
│   └── app.js          Servidor principal
├── database.sql        Script de la base de datos
├── .env.example        Ejemplo de variables de entorno
└── package.json
```

## Pruebas con Postman

Importa el archivo `postman/API Clientes.postman_collection.json` en Postman. Incluye una petición por cada endpoint y las pruebas de los errores 400, 404 y 409.

## Autor

Diego Rojo Valladares