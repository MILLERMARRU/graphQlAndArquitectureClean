# GraphQL Clean Architecture - Proyecto Educativo

![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![GraphQL](https://img.shields.io/badge/GraphQL-16.8-E10098)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

Proyecto educativo completo de **Node.js + Express + GraphQL** con arquitectura en capas, principios SOLID y patrón BFF (Backend For Frontend).

## 📚 ¿Qué aprenderás con este proyecto?

### GraphQL
- ✅ Schemas y Type Definitions
- ✅ Queries y Mutations
- ✅ Resolvers y Field Resolvers
- ✅ Relaciones entre entidades
- ✅ Patrón BFF (Backend For Frontend)
- ✅ Optimización de queries

### Arquitectura
- ✅ Arquitectura en Capas (Clean Architecture)
- ✅ Principios SOLID
- ✅ Separación de responsabilidades
- ✅ Dependency Inversion
- ✅ Inyección de Dependencias

### Tecnologías
- ✅ Node.js + Express
- ✅ TypeScript
- ✅ Apollo Server
- ✅ TypeORM + MySQL
- ✅ Docker Compose

## 🏗️ Arquitectura del Proyecto

```
src/
├── domain/                  # 🎯 Capa de Dominio
│   ├── entities/           # Entidades de negocio (User, Post)
│   └── interfaces/         # Interfaces (Repositorios)
├── application/            # 📋 Capa de Aplicación
│   ├── useCases/          # Casos de uso (lógica de negocio)
│   └── dtos/              # Data Transfer Objects
├── infrastructure/         # 🔧 Capa de Infraestructura
│   ├── database/          # Modelos de TypeORM
│   └── repositories/      # Implementaciones de repositorios
├── presentation/           # 🎨 Capa de Presentación
│   ├── graphql/           # Schemas y Resolvers principales
│   └── bff/               # Backend For Frontend
│       ├── web/           # BFF optimizado para Web
│       └── mobile/        # BFF optimizado para Mobile
└── config/                 # ⚙️ Configuración
```

### 📊 Diagrama de Flujo

```
Cliente → GraphQL → Resolvers → Use Cases → Repositorios → Base de Datos
            ↓
         Schema
```

## 🚀 Inicio Rápido

### 1. Prerrequisitos

- Node.js 20+
- Docker y Docker Compose
- npm o yarn

### 2. Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno (ya está creado el .env)
# Edita el archivo .env si necesitas cambiar algo

# Iniciar base de datos con Docker
docker-compose up -d mysql

# O iniciar todo el stack (app + database)
docker-compose up -d
```

### 3. Ejecutar en Desarrollo

```bash
# Modo desarrollo con hot-reload
npm run dev
```

### 4. Acceder a la aplicación

- **API Principal**: http://localhost:4000
- **GraphQL Playground**: http://localhost:4000/graphql
- **Web BFF**: http://localhost:4000/graphql/web
- **Mobile BFF**: http://localhost:4000/graphql/mobile
- **phpMyAdmin**: http://localhost:8080

## 📖 Entendiendo GraphQL

### ¿Qué es GraphQL?

GraphQL es un lenguaje de consulta para APIs que permite al cliente solicitar exactamente los datos que necesita.

**Ventajas sobre REST:**
- ✅ Sin over-fetching (obtener datos de más)
- ✅ Sin under-fetching (obtener datos de menos)
- ✅ Un solo endpoint
- ✅ Tipado fuerte
- ✅ Documentación auto-generada
- ✅ Queries anidadas y relaciones

### Conceptos Clave

#### 1. Schema (Esquema)
Define la estructura de la API, qué datos están disponibles y cómo se relacionan.

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!  # Relación
}
```

#### 2. Query (Consulta)
Operaciones de lectura, equivalente a GET en REST.

```graphql
query {
  users {
    id
    name
    email
  }
}
```

#### 3. Mutation (Mutación)
Operaciones de escritura, equivalente a POST/PUT/DELETE en REST.

```graphql
mutation {
  createUser(input: {
    name: "Juan"
    email: "juan@example.com"
    age: 25
  }) {
    id
    name
  }
}
```

#### 4. Resolver (Resolvedor)
Función que se ejecuta para obtener los datos de cada campo.

```typescript
const resolvers = {
  Query: {
    users: async () => {
      // Lógica para obtener usuarios
    }
  }
}
```

## 🎯 Ejemplos de Uso

### Crear un Usuario

```graphql
mutation {
  createUser(input: {
    name: "María García"
    email: "maria@example.com"
    age: 28
  }) {
    id
    name
    email
    createdAt
  }
}
```

### Obtener Usuarios con sus Posts

```graphql
query {
  users {
    id
    name
    email
    postsCount
    posts {
      id
      title
      published
    }
  }
}
```

### Crear un Post

```graphql
mutation {
  createPost(input: {
    title: "Mi primer post"
    content: "Este es el contenido de mi primer post en GraphQL"
    userId: "USER_ID_AQUI"
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

### Obtener Posts con Autor (Query Anidada)

```graphql
query {
  posts(publishedOnly: true) {
    id
    title
    content
    author {
      id
      name
      email
    }
  }
}
```

## 🔄 Patrón BFF (Backend For Frontend)

Este proyecto implementa BFF para demostrar cómo optimizar APIs para diferentes clientes.

### Web BFF (`/graphql/web`)
- Más datos en las respuestas
- Estadísticas adicionales
- Sin límites estrictos

```graphql
query {
  webUsers {
    id
    name
    publishedPostsCount
    draftPostsCount
  }
}
```

### Mobile BFF (`/graphql/mobile`)
- Respuestas ligeras
- Paginación obligatoria
- Datos esenciales

```graphql
query {
  mobilePostsFeed(limit: 10, offset: 0) {
    id
    title
    contentPreview
    authorName
  }
}
```

## 🏛️ Principios SOLID Aplicados

### 1. Single Responsibility (Responsabilidad Única)
Cada clase tiene una única razón para cambiar.

**Ejemplo:** `CreateUserUseCase` solo se encarga de crear usuarios.

```typescript
export class CreateUserUseCase {
  async execute(dto: CreateUserDTO): Promise<User> {
    // Solo lógica de creación
  }
}
```

### 2. Open/Closed (Abierto/Cerrado)
Abierto a extensión, cerrado a modificación.

**Ejemplo:** Puedes agregar nuevos casos de uso sin modificar los existentes.

### 3. Liskov Substitution (Sustitución de Liskov)
Las implementaciones pueden sustituirse por sus interfaces.

**Ejemplo:** Puedes cambiar `UserRepository` por otra implementación sin afectar los casos de uso.

### 4. Interface Segregation (Segregación de Interfaces)
Interfaces específicas mejor que una interfaz general.

**Ejemplo:** `IUserRepository` e `IPostRepository` son interfaces separadas.

### 5. Dependency Inversion (Inversión de Dependencias)
Depender de abstracciones, no de implementaciones concretas.

**Ejemplo:** Los casos de uso dependen de `IUserRepository` (interface), no de `UserRepository` (implementación).

```typescript
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  // Depende de la abstracción, no de la implementación
}
```

## 📁 Estructura de Archivos Detallada

### Domain Layer (Capa de Dominio)
```
domain/
├── entities/
│   ├── User.ts              # Entidad User con validaciones
│   └── Post.ts              # Entidad Post con validaciones
└── interfaces/
    ├── IUserRepository.ts   # Contrato para UserRepository
    └── IPostRepository.ts   # Contrato para PostRepository
```

### Application Layer (Capa de Aplicación)
```
application/
├── useCases/
│   ├── user/
│   │   ├── CreateUserUseCase.ts
│   │   ├── GetUserByIdUseCase.ts
│   │   ├── GetAllUsersUseCase.ts
│   │   ├── UpdateUserUseCase.ts
│   │   └── DeleteUserUseCase.ts
│   └── post/
│       ├── CreatePostUseCase.ts
│       ├── GetPostByIdUseCase.ts
│       ├── GetAllPostsUseCase.ts
│       ├── GetPostsByUserIdUseCase.ts
│       ├── UpdatePostUseCase.ts
│       └── DeletePostUseCase.ts
└── dtos/
    ├── CreateUserDTO.ts
    └── CreatePostDTO.ts
```

### Infrastructure Layer (Capa de Infraestructura)
```
infrastructure/
├── database/
│   └── models/
│       ├── UserModel.ts     # Modelo TypeORM para User
│       └── PostModel.ts     # Modelo TypeORM para Post
└── repositories/
    ├── UserRepository.ts    # Implementación de IUserRepository
    └── PostRepository.ts    # Implementación de IPostRepository
```

### Presentation Layer (Capa de Presentación)
```
presentation/
├── graphql/
│   ├── schemas/
│   │   ├── user.schema.ts   # Schema GraphQL para User
│   │   └── post.schema.ts   # Schema GraphQL para Post
│   ├── resolvers/
│   │   ├── user.resolver.ts # Resolvers para User
│   │   └── post.resolver.ts # Resolvers para Post
│   └── index.ts             # Combina todos los schemas
└── bff/
    ├── web/
    │   ├── schema.ts        # Schema optimizado para Web
    │   └── resolvers.ts     # Resolvers para Web
    └── mobile/
        ├── schema.ts        # Schema optimizado para Mobile
        └── resolvers.ts     # Resolvers para Mobile
```

## 🔍 Cómo Estudiar Este Proyecto

### 1. Empieza por el Flujo de Datos
```
Cliente → index.ts → Resolvers → Use Cases → Repositories → Database
```

### 2. Estudia en Este Orden

1. **Configuración** (`src/config/`)
   - `environment.ts` - Variables de entorno
   - `database.ts` - Conexión a MySQL

2. **Dominio** (`src/domain/`)
   - `entities/User.ts` - Entidad User
   - `entities/Post.ts` - Entidad Post
   - `interfaces/` - Contratos de repositorios

3. **Aplicación** (`src/application/`)
   - `dtos/` - Objetos de transferencia
   - `useCases/user/CreateUserUseCase.ts` - Ejemplo de caso de uso

4. **Infraestructura** (`src/infrastructure/`)
   - `database/models/UserModel.ts` - Modelo de base de datos
   - `repositories/UserRepository.ts` - Implementación del repositorio

5. **Presentación** (`src/presentation/`)
   - `graphql/schemas/user.schema.ts` - Schema de GraphQL
   - `graphql/resolvers/user.resolver.ts` - Resolvers

6. **BFF** (`src/presentation/bff/`)
   - `web/` - BFF para Web
   - `mobile/` - BFF para Mobile

7. **Punto de Entrada** (`src/index.ts`)
   - Configuración de servidores GraphQL
   - Inicialización de la aplicación

### 3. Prueba las Queries

Ve al archivo `QUERIES.md` para ver ejemplos de queries GraphQL que puedes probar.

## 🛠️ Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Producción
npm start

# Gestión de migraciones (TypeORM)
npm run typeorm -- migration:generate src/migrations/InitialMigration
npm run typeorm -- migration:run
npm run typeorm -- migration:revert
```

## 🐳 Docker

### Iniciar solo MySQL
```bash
docker-compose up -d mysql
```

### Iniciar todo
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f app
```

### Detener
```bash
docker-compose down
```

## 📚 Recursos Adicionales

- [GraphQL Official Docs](https://graphql.org/learn/)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [TypeORM Documentation](https://typeorm.io/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

## 🎓 Ejercicios Propuestos

1. Agregar paginación a las queries de users y posts
2. Implementar autenticación con JWT
3. Agregar DataLoader para resolver el problema N+1
4. Crear nuevas entidades (Comments, Likes, etc.)
5. Implementar subscriptions de GraphQL
6. Agregar tests unitarios y de integración
7. Implementar soft delete en las entidades

## 🤝 Contribuciones

Este es un proyecto educativo. Siéntete libre de:
- Hacer fork del proyecto
- Crear nuevas features
- Mejorar la documentación
- Reportar issues

## 📝 Licencia

ISC

---

**Hecho con ❤️ para aprender GraphQL y Clean Architecture**
