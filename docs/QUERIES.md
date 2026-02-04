# 📝 Ejemplos de Queries GraphQL

Este archivo contiene ejemplos de queries y mutations para probar la API GraphQL.

Puedes copiar y pegar estos ejemplos en Apollo Sandbox (http://localhost:4000/graphql).

## 🎯 GraphQL Principal (`/graphql`)

### Queries (Lectura)

#### 1. Obtener todos los usuarios

```graphql
query GetAllUsers {
  users {
    id
    name
    email
    age
    isAdult
    createdAt
  }
}
```

#### 2. Obtener un usuario específico

```graphql
query GetUser {
  user(id: "USER_ID_AQUI") {
    id
    name
    email
    age
    isAdult
    postsCount
    posts {
      id
      title
      published
    }
  }
}
```

#### 3. Obtener todos los posts

```graphql
query GetAllPosts {
  posts {
    id
    title
    content
    published
    createdAt
    author {
      id
      name
      email
    }
  }
}
```

#### 4. Obtener solo posts publicados

```graphql
query GetPublishedPosts {
  posts(publishedOnly: true) {
    id
    title
    contentPreview: content
    published
    author {
      name
    }
  }
}
```

#### 5. Obtener un post específico

```graphql
query GetPost {
  post(id: "POST_ID_AQUI") {
    id
    title
    content
    published
    createdAt
    updatedAt
    author {
      id
      name
      email
      age
    }
  }
}
```

#### 6. Obtener posts de un usuario específico

```graphql
query GetPostsByUser {
  postsByUser(userId: "USER_ID_AQUI", publishedOnly: false) {
    id
    title
    published
    createdAt
  }
}
```

#### 7. Query compleja con datos anidados

```graphql
query ComplexQuery {
  users {
    id
    name
    email
    isAdult
    postsCount
    posts {
      id
      title
      published
      contentPreview: content
    }
  }
}
```

### Mutations (Escritura)

#### 1. Crear un usuario

```graphql
mutation CreateUser {
  createUser(input: {
    name: "Juan Pérez"
    email: "juan.perez@example.com"
    age: 25
  }) {
    id
    name
    email
    age
    isAdult
    createdAt
  }
}
```

#### 2. Crear varios usuarios (ejecuta múltiples veces cambiando los datos)

```graphql
mutation CreateUser2 {
  createUser(input: {
    name: "María García"
    email: "maria.garcia@example.com"
    age: 30
  }) {
    id
    name
    email
  }
}
```

```graphql
mutation CreateUser3 {
  createUser(input: {
    name: "Carlos López"
    email: "carlos.lopez@example.com"
    age: 17
  }) {
    id
    name
    email
    isAdult
  }
}
```

#### 3. Actualizar un usuario

```graphql
mutation UpdateUser {
  updateUser(
    id: "USER_ID_AQUI"
    input: {
      name: "Juan Pérez Actualizado"
      age: 26
    }
  ) {
    id
    name
    email
    age
    updatedAt
  }
}
```

#### 4. Crear un post

```graphql
mutation CreatePost {
  createPost(input: {
    title: "Mi primer post sobre GraphQL"
    content: "GraphQL es increíble! Permite solicitar exactamente los datos que necesitas. Este es un contenido largo para demostrar cómo funciona."
    userId: "USER_ID_AQUI"
    published: true
  }) {
    id
    title
    content
    published
    createdAt
    author {
      name
      email
    }
  }
}
```

#### 5. Crear más posts

```graphql
mutation CreatePost2 {
  createPost(input: {
    title: "Aprendiendo Clean Architecture"
    content: "La arquitectura limpia nos ayuda a separar las responsabilidades y hacer el código más mantenible y testeable."
    userId: "USER_ID_AQUI"
    published: false
  }) {
    id
    title
    published
    author {
      name
    }
  }
}
```

#### 6. Actualizar un post

```graphql
mutation UpdatePost {
  updatePost(
    id: "POST_ID_AQUI"
    input: {
      title: "Título actualizado"
      content: "Contenido actualizado con más información."
    }
  ) {
    id
    title
    content
    updatedAt
  }
}
```

#### 7. Publicar un post

```graphql
mutation PublishPost {
  publishPost(id: "POST_ID_AQUI") {
    id
    title
    published
  }
}
```

#### 8. Despublicar un post

```graphql
mutation UnpublishPost {
  unpublishPost(id: "POST_ID_AQUI") {
    id
    title
    published
  }
}
```

#### 9. Eliminar un post

```graphql
mutation DeletePost {
  deletePost(id: "POST_ID_AQUI")
}
```

#### 10. Eliminar un usuario

```graphql
mutation DeleteUser {
  deleteUser(id: "USER_ID_AQUI")
}
```

### Variables (Queries con Variables)

#### Query con variables

```graphql
query GetUserById($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    posts {
      id
      title
    }
  }
}
```

Variables:
```json
{
  "userId": "TU_USER_ID"
}
```

#### Mutation con variables

```graphql
mutation CreateUserWithVariables($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```

Variables:
```json
{
  "input": {
    "name": "Ana Martínez",
    "email": "ana.martinez@example.com",
    "age": 28
  }
}
```

---

## 🌐 Web BFF (`/graphql/web`)

### Queries optimizadas para Web

#### 1. Dashboard de usuarios

```graphql
query WebDashboard {
  webUsers {
    id
    name
    email
    isAdult
    postsCount
    publishedPostsCount
    draftPostsCount
  }
}
```

#### 2. Feed de posts

```graphql
query WebPostsFeed {
  webPostsFeed(limit: 10, publishedOnly: true) {
    id
    title
    contentPreview
    contentLength
    published
    createdAt
    author {
      id
      name
      email
    }
  }
}
```

#### 3. Detalles completos de usuario

```graphql
query WebUserDetails {
  webUser(id: "USER_ID_AQUI") {
    id
    name
    email
    age
    isAdult
    postsCount
    publishedPostsCount
    draftPostsCount
    posts {
      id
      title
      contentPreview
      published
    }
  }
}
```

---

## 📱 Mobile BFF (`/graphql/mobile`)

### Queries optimizadas para Mobile

#### 1. Lista de usuarios (ligera)

```graphql
query MobileUsers {
  mobileUsers(limit: 10) {
    id
    name
    email
    postsCount
  }
}
```

#### 2. Feed de posts con paginación

```graphql
query MobilePostsFeed {
  mobilePostsFeed(limit: 10, offset: 0) {
    id
    title
    contentPreview
    published
    createdAt
    authorName
    authorId
  }
}
```

#### 3. Página 2 del feed

```graphql
query MobilePostsFeedPage2 {
  mobilePostsFeed(limit: 10, offset: 10) {
    id
    title
    contentPreview
    authorName
  }
}
```

#### 4. Detalles de un post

```graphql
query MobilePostDetails {
  mobilePost(id: "POST_ID_AQUI") {
    id
    title
    content
    published
    createdAt
    author {
      id
      name
      email
      postsCount
    }
  }
}
```

#### 5. Posts de un usuario

```graphql
query MobileUserPosts {
  mobileUserPosts(userId: "USER_ID_AQUI", limit: 5) {
    id
    title
    contentPreview
    published
    authorName
  }
}
```

---

## 🎯 Flujo Completo de Ejemplo

### Paso 1: Crear usuarios

```graphql
mutation {
  user1: createUser(input: {
    name: "Elena Rodríguez"
    email: "elena@example.com"
    age: 25
  }) {
    id
    name
  }

  user2: createUser(input: {
    name: "Pedro Sánchez"
    email: "pedro@example.com"
    age: 32
  }) {
    id
    name
  }
}
```

### Paso 2: Crear posts para cada usuario

```graphql
mutation {
  post1: createPost(input: {
    title: "Introducción a GraphQL"
    content: "GraphQL revoluciona la forma en que construimos APIs..."
    userId: "ELENA_ID"
    published: true
  }) {
    id
    title
    author { name }
  }

  post2: createPost(input: {
    title: "Clean Architecture en práctica"
    content: "Implementar Clean Architecture nos permite..."
    userId: "PEDRO_ID"
    published: true
  }) {
    id
    title
    author { name }
  }
}
```

### Paso 3: Consultar datos relacionados

```graphql
query {
  users {
    name
    email
    posts {
      title
      published
    }
  }
}
```

---

## 💡 Tips para Aprender GraphQL

1. **Introspección**: GraphQL permite explorar el schema directamente
   ```graphql
   query {
     __schema {
       types {
         name
       }
     }
   }
   ```

2. **Aliases**: Puedes renombrar campos
   ```graphql
   query {
     firstUser: user(id: "1") {
       name
     }
     secondUser: user(id: "2") {
       name
     }
   }
   ```

3. **Fragments**: Reutiliza campos
   ```graphql
   fragment UserInfo on User {
     id
     name
     email
   }

   query {
     users {
       ...UserInfo
     }
   }
   ```

4. **Directivas**: Condicionales en queries
   ```graphql
   query GetUser($withPosts: Boolean!) {
     user(id: "1") {
       name
       posts @include(if: $withPosts) {
         title
       }
     }
   }
   ```

---

## 🔥 Ejercicios Prácticos

1. Crea 3 usuarios con diferentes edades
2. Crea 5 posts asignados a diferentes usuarios
3. Obtén solo usuarios adultos (age >= 18)
4. Obtén posts con su autor en una sola query
5. Actualiza un usuario y verifica que updatedAt cambió
6. Compara las respuestas del BFF Web vs Mobile

---

**¡Ahora estás listo para explorar GraphQL! 🚀**
