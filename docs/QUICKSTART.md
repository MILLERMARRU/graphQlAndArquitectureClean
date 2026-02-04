# 🚀 Guía de Inicio Rápido

## Paso 1: Instalar Dependencias

```bash
npm install
```

## Paso 2: Iniciar Base de Datos

### Opción A: Solo MySQL (Recomendado para desarrollo)

```bash
docker-compose up -d mysql
```

Esto iniciará:
- MySQL en el puerto **3303** (accesible desde `localhost:3303`)
- phpMyAdmin en http://localhost:8080

### Opción B: Todo el stack (App + MySQL)

```bash
docker-compose up -d
```

## Paso 3: Iniciar la Aplicación

```bash
npm run dev
```

Verás algo como esto:

```
🚀 Iniciando aplicación...

✅ Conexión a MySQL establecida correctamente
✅ GraphQL Principal disponible en /graphql
✅ GraphQL Web BFF disponible en /graphql/web
✅ GraphQL Mobile BFF disponible en /graphql/mobile

🎯 Servidor iniciado exitosamente!

📍 URL: http://localhost:4000
🔍 GraphQL Playground: http://localhost:4000/graphql
🌐 Web BFF: http://localhost:4000/graphql/web
📱 Mobile BFF: http://localhost:4000/graphql/mobile
💚 Health Check: http://localhost:4000/health
```

## Paso 4: Probar la API

### Opción 1: Apollo Sandbox (Recomendado)

1. Abre tu navegador
2. Ve a http://localhost:4000/graphql
3. Apollo Sandbox se abrirá automáticamente
4. Copia las queries de `QUERIES.md`

### Opción 2: curl

```bash
# Health check
curl http://localhost:4000/health

# Query GraphQL
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { id name email } }"}'
```

## Paso 5: Crear Datos de Prueba

### Crear un usuario

```graphql
mutation {
  createUser(input: {
    name: "Juan Pérez"
    email: "juan@example.com"
    age: 25
  }) {
    id
    name
    email
  }
}
```

**Guarda el `id` que te devuelve** (lo necesitarás para crear posts).

### Crear un post

```graphql
mutation {
  createPost(input: {
    title: "Mi primer post"
    content: "Este es el contenido de mi primer post"
    userId: "PEGA_AQUI_EL_ID_DEL_USUARIO"
    published: true
  }) {
    id
    title
    author {
      name
    }
  }
}
```

### Ver todos los datos

```graphql
query {
  users {
    id
    name
    email
    posts {
      id
      title
      published
    }
  }
}
```

## 📊 Ver la Base de Datos

### phpMyAdmin

1. Abre http://localhost:8080
2. Servidor: `mysql`
3. Usuario: `root`
4. Contraseña: `root123`
5. Base de datos: `graphql_db`

## 🛑 Detener el Proyecto

```bash
# Detener solo la base de datos
docker-compose stop mysql

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (borra los datos)
docker-compose down -v
```

## ❓ Solución de Problemas

### Error: "Cannot connect to database"

1. Verifica que Docker esté corriendo
2. Verifica que MySQL esté iniciado:
   ```bash
   docker-compose ps
   ```
3. Espera unos segundos, MySQL tarda en iniciar

### Error: "Port 3303 already in use"

Cambia el puerto en:
- `docker-compose.yml` (línea `"3303:3306"`)
- `.env` (línea `DB_PORT=3303`)

### Error: "Module not found"

```bash
# Limpia e instala de nuevo
rm -rf node_modules package-lock.json
npm install
```

## 📚 Siguientes Pasos

1. Lee `README.md` para entender la arquitectura
2. Explora `QUERIES.md` para ver ejemplos de queries
3. Estudia el código en este orden:
   - `src/config/` - Configuración
   - `src/domain/` - Entidades e Interfaces
   - `src/application/` - Casos de Uso
   - `src/infrastructure/` - Repositorios
   - `src/presentation/` - GraphQL y BFF
   - `src/index.ts` - Punto de entrada

## 🎯 Conceptos Clave a Entender

1. **GraphQL Schema** → Define la estructura de la API
2. **Resolvers** → Funciones que obtienen los datos
3. **Queries** → Lecturas (GET)
4. **Mutations** → Escrituras (POST/PUT/DELETE)
5. **Field Resolvers** → Resuelven campos específicos (relaciones)
6. **BFF** → APIs optimizadas por cliente

## 🔥 Reto Final

Después de estudiar el código, intenta:

1. Agregar un campo `bio` (biografía) a User
2. Crear un nuevo caso de uso `GetPostsCountByUserUseCase`
3. Agregar una query `userStats` que devuelva estadísticas
4. Implementar paginación en la query `posts`

---

**¡Disfruta aprendiendo GraphQL! 🚀**
