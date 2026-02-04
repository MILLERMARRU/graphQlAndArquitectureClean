# 🏗️ Arquitectura del Proyecto

## 📊 Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│          (Browser, Mobile App, Postman, etc.)               │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/GraphQL
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               PRESENTATION LAYER                             │
│                  (Capa de Presentación)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   GraphQL    │  │   Web BFF    │  │  Mobile BFF  │     │
│  │   Principal  │  │              │  │              │     │
│  │              │  │              │  │              │     │
│  │  - Schemas   │  │  - Schemas   │  │  - Schemas   │     │
│  │  - Resolvers │  │  - Resolvers │  │  - Resolvers │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER                               │
│               (Capa de Aplicación)                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              USE CASES (Casos de Uso)              │    │
│  │                                                     │    │
│  │  User:                    Post:                    │    │
│  │  - CreateUserUseCase      - CreatePostUseCase      │    │
│  │  - GetUserByIdUseCase     - GetPostByIdUseCase     │    │
│  │  - GetAllUsersUseCase     - GetAllPostsUseCase     │    │
│  │  - UpdateUserUseCase      - UpdatePostUseCase      │    │
│  │  - DeleteUserUseCase      - DeletePostUseCase      │    │
│  │                           - GetPostsByUserIdUseCase │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         DTOs (Data Transfer Objects)                │    │
│  │  - CreateUserDTO / UpdateUserDTO                    │    │
│  │  - CreatePostDTO / UpdatePostDTO                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  DOMAIN LAYER                                │
│                 (Capa de Dominio)                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         ENTITIES (Entidades de Negocio)            │    │
│  │                                                     │    │
│  │  - User (id, name, email, age, ...)               │    │
│  │    • validateEmail()                               │    │
│  │    • validateAge()                                 │    │
│  │    • isAdult()                                     │    │
│  │                                                     │    │
│  │  - Post (id, title, content, userId, ...)         │    │
│  │    • validateTitle()                               │    │
│  │    • validateContent()                             │    │
│  │    • publish() / unpublish()                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │        INTERFACES (Contratos)                      │    │
│  │                                                     │    │
│  │  - IUserRepository                                 │    │
│  │  - IPostRepository                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            INFRASTRUCTURE LAYER                              │
│            (Capa de Infraestructura)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │      REPOSITORIES (Implementaciones)               │    │
│  │                                                     │    │
│  │  - UserRepository implements IUserRepository       │    │
│  │  - PostRepository implements IPostRepository       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         MODELS (TypeORM Entities)                  │    │
│  │                                                     │    │
│  │  - UserModel (@Entity('users'))                    │    │
│  │  - PostModel (@Entity('posts'))                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│                   MySQL 8.0                                  │
│                                                              │
│  Tables:                                                     │
│  - users (id, name, email, age, ...)                        │
│  - posts (id, title, content, user_id, ...)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### Query Example: Obtener un usuario con sus posts

```
1. Cliente envía GraphQL query:
   query { user(id: "123") { name posts { title } } }

2. GraphQL Resolver recibe la request
   → user.resolver.ts → Query.user()

3. Resolver llama al Use Case
   → GetUserByIdUseCase.execute(id)

4. Use Case valida y usa el Repository
   → userRepository.findById(id)

5. Repository consulta la base de datos
   → SELECT * FROM users WHERE id = '123'

6. Repository convierte UserModel → User (entity)

7. Use Case retorna User al Resolver

8. Field Resolver resuelve el campo 'posts'
   → GetPostsByUserIdUseCase.execute(userId)

9. Se repite el flujo para posts

10. GraphQL formatea y envía la respuesta al cliente
```

## 🎯 Principios SOLID Aplicados

### 1️⃣ Single Responsibility (SRP)

**Cada clase tiene UNA sola responsabilidad**

```typescript
// ✅ Correcto
class CreateUserUseCase {
  execute() { /* Solo crea usuarios */ }
}

// ❌ Incorrecto
class UserService {
  create() { }
  update() { }
  delete() { }
  sendEmail() { }  // ❌ Responsabilidad adicional
}
```

**En el proyecto:**
- `User.ts` → Solo define la entidad User
- `CreateUserUseCase.ts` → Solo crea usuarios
- `UserRepository.ts` → Solo maneja persistencia de users

### 2️⃣ Open/Closed (OCP)

**Abierto a extensión, cerrado a modificación**

```typescript
// Puedes agregar nuevos casos de uso sin modificar los existentes
class UpdateUserEmailUseCase {  // ✅ Nueva funcionalidad
  constructor(private userRepo: IUserRepository) {}
  execute() { /* ... */ }
}
```

### 3️⃣ Liskov Substitution (LSP)

**Las implementaciones deben ser intercambiables**

```typescript
// Puedes cambiar la implementación sin romper nada
const repository: IUserRepository = new UserRepository();
// O: const repository: IUserRepository = new MockUserRepository();
// O: const repository: IUserRepository = new MongoUserRepository();
```

### 4️⃣ Interface Segregation (ISP)

**Interfaces específicas, no generales**

```typescript
// ✅ Correcto: Interfaces separadas
interface IUserRepository { /* métodos de User */ }
interface IPostRepository { /* métodos de Post */ }

// ❌ Incorrecto: Interface genérica
interface IRepository {
  createUser() { }
  createPost() { }
  updateUser() { }
  updatePost() { }
}
```

### 5️⃣ Dependency Inversion (DIP)

**Depender de abstracciones, no de implementaciones**

```typescript
// ✅ Correcto: Depende de la interfaz
class CreateUserUseCase {
  constructor(private repository: IUserRepository) {}
}

// ❌ Incorrecto: Depende de la implementación
class CreateUserUseCase {
  constructor(private repository: UserRepository) {}
}
```

## 🔀 Patrón BFF (Backend For Frontend)

### Concepto

Diferentes clientes tienen diferentes necesidades:

```
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│  Web Client │        │Mobile Client│        │  IoT Device │
│             │        │             │        │             │
│ - Más datos │        │ - Menos     │        │ - Mínimos   │
│ - Ancho de  │        │   datos     │        │   datos     │
│   banda OK  │        │ - Batería   │        │ - Bandwidth │
│             │        │   limitada  │        │   crítico   │
└──────┬──────┘        └──────┬──────┘        └──────┬──────┘
       │                      │                       │
       ▼                      ▼                       ▼
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│   Web BFF   │        │ Mobile BFF  │        │   IoT BFF   │
│             │        │             │        │             │
│ - Queries   │        │ - Queries   │        │ - Queries   │
│   complejas │        │   simples   │        │   mínimas   │
│ - Más       │        │ - Paginación│        │ - Solo IDs  │
│   campos    │        │   obligatoria│        │             │
└─────────────┘        └─────────────┘        └─────────────┘
       │                      │                       │
       └──────────────────────┴───────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Use Cases      │
                    │   Repositories   │
                    │   Database       │
                    └──────────────────┘
```

### Ejemplo Práctico

**Web BFF** (más datos):
```graphql
query {
  webUsers {
    id
    name
    email
    age
    postsCount
    publishedPostsCount    # ✅ Campo adicional
    draftPostsCount        # ✅ Campo adicional
  }
}
```

**Mobile BFF** (datos esenciales):
```graphql
query {
  mobileUsers(limit: 10) {  # ✅ Límite obligatorio
    id
    name
    postsCount              # Solo el conteo
  }
}
```

## 📦 Patrón Repository

### Propósito
Abstraer la lógica de acceso a datos.

```
┌────────────────┐
│   Use Case     │  ← No sabe NADA sobre TypeORM/MySQL
└───────┬────────┘
        │ depends on
        ▼
┌────────────────┐
│  IRepository   │  ← Interface (contrato)
└───────┬────────┘
        │ implements
        ▼
┌────────────────┐
│  Repository    │  ← Implementación con TypeORM
└───────┬────────┘
        │ uses
        ▼
┌────────────────┐
│  TypeORM Model │  ← Entidad de base de datos
└────────────────┘
```

### Ventajas

1. **Testeable**: Puedes mockear el repository
2. **Flexible**: Cambiar de MySQL a PostgreSQL sin tocar Use Cases
3. **Mantenible**: Cambios en DB solo afectan repositories

## 🌊 Flujo Completo de Request

### POST /graphql → createUser

```
1. Cliente HTTP
   POST /graphql
   body: { query: "mutation { createUser(...) }" }
   ↓

2. Express Middleware
   expressMiddleware(apolloServer)
   ↓

3. Apollo Server
   Parsea y valida el GraphQL query
   ↓

4. GraphQL Resolver
   user.resolver.ts → createUser()
   ↓

5. Use Case
   CreateUserUseCase.execute(dto)
   - Valida email único
   - Crea entidad User
   ↓

6. Repository
   userRepository.create(user)
   - Convierte User → UserModel
   - Ejecuta INSERT en MySQL
   ↓

7. Database
   INSERT INTO users ...
   ↓

8. Response Chain (inverso)
   DB → Repository → Use Case → Resolver → Apollo → Express → Cliente
```

## 📝 Convenciones de Código

### Nomenclatura

- **Entities**: `User`, `Post` (PascalCase, singular)
- **Models**: `UserModel`, `PostModel` (PascalCase + Model)
- **Interfaces**: `IUserRepository` (I + PascalCase)
- **Use Cases**: `CreateUserUseCase` (Verbo + Entity + UseCase)
- **DTOs**: `CreateUserDTO` (Action + Entity + DTO)

### Estructura de archivos

```
domain/entities/User.ts              → export class User
application/useCases/user/CreateUserUseCase.ts  → export class CreateUserUseCase
```

## 🎓 Para Estudiar el Código

### Orden recomendado:

1. **Config** → `src/config/`
2. **Entities** → `src/domain/entities/`
3. **Interfaces** → `src/domain/interfaces/`
4. **DTOs** → `src/application/dtos/`
5. **Use Cases** → `src/application/useCases/`
6. **Models** → `src/infrastructure/database/models/`
7. **Repositories** → `src/infrastructure/repositories/`
8. **Schemas** → `src/presentation/graphql/schemas/`
9. **Resolvers** → `src/presentation/graphql/resolvers/`
10. **BFF** → `src/presentation/bff/`
11. **Index** → `src/index.ts`

### Preguntas para hacerte mientras estudias:

1. ¿Por qué `User.ts` no importa nada de TypeORM?
2. ¿Cómo se relacionan `IUserRepository` y `UserRepository`?
3. ¿Por qué los Use Cases reciben interfaces y no implementaciones?
4. ¿Cómo se resuelven las relaciones (User → Posts)?
5. ¿Qué diferencias hay entre Web BFF y Mobile BFF?
6. ¿Cómo fluye un error desde la DB hasta el cliente?

---

**Este proyecto es tu laboratorio para aprender GraphQL y Clean Architecture. Experimenta, rompe cosas, aprende! 🚀**
