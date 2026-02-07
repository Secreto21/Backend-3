# Backend III - Entrega N°1 - Mocking y Testing

## Descripción

Este proyecto implementa la **Entrega N°1** del curso Backend III, enfocándose en la creación de un sistema de mocking para generar datos falsos de usuarios y mascotas, así como la inserción de estos datos en una base de datos MongoDB.

## Características Implementadas

✅ **Router de Mocks** (`/api/mocks`)  
✅ **Endpoint /mockingpets** - Genera mascotas mock  
✅ **Endpoint /mockingusers** - Genera usuarios mock con contraseñas encriptadas  
✅ **Endpoint /generateData** - Genera e inserta datos en la base de datos  
✅ **Servicios GET para users y pets** para verificar registros insertados  
✅ **Módulos de mocking** con Faker.js  
✅ **Encriptación de contraseñas** con bcrypt  

## Requisitos Previos

- **Node.js** v16 o superior
- **MongoDB** running locally o MongoDB Atlas
- **npm** o **yarn**

## Instalación

1. **Clonar o descargar el proyecto**
   
2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
4. **Iniciar MongoDB** (si es local)
   ```bash
   mongod
   ```

5. **Iniciar la aplicación**
   ```bash
   # Modo desarrollo (con nodemon)
   npm run dev
   
   # Modo producción
   npm start
   ```

## Endpoints API

### Información General
- **GET** `/` - Información de la API y endpoints disponibles

### Mocking Endpoints
- **GET** `/api/mocks/mockingpets` - Genera mascotas mock
  - Query param: `count` (opcional, default: 100)
  - Ejemplo: `GET /api/mocks/mockingpets?count=50`

- **GET** `/api/mocks/mockingusers` - Genera usuarios mock
  - Query param: `count` (opcional, default: 50)  
  - Ejemplo: `GET /api/mocks/mockingusers?count=25`

- **POST** `/api/mocks/generateData` - Genera e inserta datos en DB
  - Body: `{ "users": number, "pets": number }`
  - Ejemplo:
    ```json
    {
      "users": 10,
      "pets": 20
    }
    ```

### Data Endpoints
- **GET** `/api/users` - Obtiene todos los usuarios de la DB
- **GET** `/api/users/:id` - Obtiene un usuario específico
- **GET** `/api/pets` - Obtiene todas las mascotas de la DB  
- **GET** `/api/pets/:id` - Obtiene una mascota específica

## Estructura del Proyecto

```
Backend3/
├── src/
│   ├── models/           # Modelos de datos (Mongoose)
│   │   ├── User.js
│   │   └── Pet.js
│   ├── routes/           # Rutas de la API
│   │   ├── mocks.router.js
│   │   ├── users.router.js
│   │   └── pets.router.js
│   └── utils/            # Utilidades
│       ├── mockingUsers.js
│       ├── mockingPets.js
│       └── database.js
├── app.js               # Aplicación principal
├── package.json
├── .env.example
└── README.md
```

## Características de los Usuarios Mock

Los usuarios generados tienen las siguientes características:

- **password**: Siempre "coder123" encriptada con bcrypt
- **role**: Alternando entre "user" y "admin"  
- **pets**: Array vacío `[]`
- **Formato MongoDB**: Incluye `_id`, `createdAt`, `updatedAt`, `__v`

## Características de las Mascotas Mock

Las mascotas generadas incluyen:

- **Especies**: dog, cat, bird, fish, rabbit, hamster, turtle
- **Nombres**: Específicos por especie
- **Fechas**: Nacimiento entre 1 mes y 5 años atrás
- **Estado**: adopted (true/false aleatorio)

## Ejemplos de Uso

### 1. Generar usuarios mock
```bash
curl http://localhost:8080/api/mocks/mockingusers
```

### 2. Generar mascotas mock  
```bash
curl http://localhost:8080/api/mocks/mockingpets?count=30
```

### 3. Insertar datos en la DB
```bash
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 5, "pets": 10}'
```

### 4. Verificar datos insertados
```bash
# Ver usuarios
curl http://localhost:8080/api/users

# Ver mascotas  
curl http://localhost:8080/api/pets
```

## Scripts Disponibles

- `npm start` - Iniciar en producción
- `npm run dev` - Iniciar con nodemon (desarrollo)

## Base de Datos

Por defecto se conecta a `mongodb://localhost:27017/backend3_entrega1`

Puedes cambiar la configuración en el archivo `.env`:
```
MONGODB_URI=mongodb://localhost:27017/tu_base_de_datos
```

## Tecnologías Utilizadas

- **Express.js** - Framework web
- **Mongoose** - ODM para MongoDB  
- **Faker.js** - Generación de datos falsos
- **bcrypt** - Encriptación de contraseñas
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

## Validaciones Implementadas

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Validación de parámetros en `/generateData`  
- ✅ Manejo de errores global
- ✅ Validación de modelos con Mongoose
- ✅ Respuestas consistentes con status y mensajes

---

**Desarrollado para Backend III - Entrega N°1**