# Backend III - Entrega Final

Proyecto backend con Express + MongoDB, incluyendo:
- Documentación Swagger del módulo `Users`
- Tests funcionales del router `adoption.router.js`
- Dockerfile para generar imagen del proyecto

## Módulos principales
- `Users` (`/api/users`)
- `Pets` (`/api/pets`)
- `Mocks` (`/api/mocks`)
- `Adoptions` (`/api/adoptions`)

## Swagger
La documentación se expone en:
- `GET /api/docs`

Incluye documentación OpenAPI para el módulo `Users`:
- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `DELETE /api/users/{id}`

## Tests funcionales (Adoptions)
Se implementaron tests funcionales para todos los endpoints del router `adoption.router.js`, cubriendo casos de éxito y error:
- `GET /api/adoptions`
- `GET /api/adoptions/:aid`
- `POST /api/adoptions/:uid/:pid`
- `DELETE /api/adoptions/:aid`

### Ejecutar tests
```bash
npm test
```

## Ejecución local (sin Docker)
```bash
npm install
npm start
```

La API queda disponible en:
- `http://localhost:8080`

## Docker

### 1) Construir imagen
```bash
docker build -t backend3-entrega-final:latest .
```

### 2) Ejecutar contenedor
```bash
docker run -d --name backend3-api -p 8080:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/backend3_entrega1 backend3-entrega-final:latest
```

### 3) Verificar
- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/api/docs`

## Publicación en DockerHub

1. Login:
```bash
docker login
```

2. Etiquetar imagen:
```bash
docker tag backend3-entrega-final:latest TU_USUARIO_DOCKERHUB/backend3-entrega-final:latest
```

3. Subir imagen:
```bash
docker push TU_USUARIO_DOCKERHUB/backend3-entrega-final:latest
```

## Link de imagen en DockerHub
Reemplaza este enlace por el tuyo una vez publicada la imagen:

`https://hub.docker.com/r/TU_USUARIO_DOCKERHUB/backend3-entrega-final`

