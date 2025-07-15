# Sistema de Base de Datos - Biblioteca Virtual Universitaria

## 🗃️ Descripción del Sistema

Este sistema implementa una **simulación realista de base de datos relacional** para la biblioteca virtual universitaria. Utiliza estructuras de datos avanzadas, índices, y un API REST simulado para proporcionar una experiencia similar a un sistema de gestión de biblioteca real.

## 📊 Arquitectura de la Base de Datos

### Tablas Principales

#### 1. **Books** (Libros)
- `id` - Identificador único
- `title` - Título del libro
- `author_id` - Referencia al autor
- `publisher_id` - Referencia a la editorial
- `category_id` - Referencia a la categoría
- `isbn` - Número ISBN
- `dewey_code` - Código de clasificación Dewey
- `publication_year` - Año de publicación
- `pages` - Número de páginas
- `language` - Idioma
- `total_copies` - Copias totales
- `available_copies` - Copias disponibles
- `location` - Ubicación física
- `description` - Descripción
- `cover_url` - URL de la portada
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización
- `status` - Estado del libro
- `rating` - Calificación promedio
- `borrow_count` - Cantidad de préstamos

#### 2. **Authors** (Autores)
- `id` - Identificador único
- `name` - Nombre completo
- `birth_year` - Año de nacimiento
- `death_year` - Año de fallecimiento
- `nationality` - Nacionalidad

#### 3. **Categories** (Categorías)
- `id` - Identificador único
- `name` - Nombre de la categoría
- `dewey_range` - Rango Dewey correspondiente
- `description` - Descripción

#### 4. **Publishers** (Editoriales)
- `id` - Identificador único
- `name` - Nombre de la editorial
- `country` - País de origen
- `founded` - Año de fundación

#### 5. **Users** (Usuarios)
- `id` - Identificador único
- `student_id` - ID de estudiante
- `name` - Nombre completo
- `email` - Correo electrónico
- `password` - Contraseña
- `role` - Rol (admin, student, professor)
- `faculty` - Facultad
- `active` - Estado activo
- `created_at` - Fecha de creación
- `last_login` - Último inicio de sesión

#### 6. **Loans** (Préstamos)
- `id` - Identificador único
- `book_id` - Referencia al libro
- `user_id` - Referencia al usuario
- `loan_date` - Fecha de préstamo
- `due_date` - Fecha de vencimiento
- `return_date` - Fecha de devolución
- `status` - Estado (active, returned, overdue)
- `renewals` - Número de renovaciones
- `notes` - Notas adicionales

#### 7. **Loan_History** (Historial de Préstamos)
- Mismo esquema que Loans
- Registro histórico de préstamos devueltos

## 🔍 Sistema de Índices

### Índices Implementados

1. **books_by_dewey** - Búsqueda por código Dewey
2. **books_by_category** - Libros por categoría
3. **books_by_author** - Libros por autor
4. **books_by_isbn** - Búsqueda por ISBN
5. **loans_by_user** - Préstamos por usuario
6. **loans_by_book** - Préstamos por libro
7. **loans_by_status** - Préstamos por estado
8. **users_by_email** - Usuarios por email
9. **users_by_student_id** - Usuarios por ID estudiante

### Beneficios de los Índices

- **Búsquedas O(1)** para claves primarias
- **Búsquedas rápidas** por campos indexados
- **Consultas complejas** eficientes
- **Integridad referencial** automática

## 🔧 API REST Simulado

### Endpoints Principales

#### Autenticación
- `POST /api/v1/login` - Iniciar sesión
- `POST /api/v1/logout` - Cerrar sesión

#### Libros
- `GET /api/v1/books` - Obtener libros (con paginación, filtros, búsqueda)
- `GET /api/v1/books/:id` - Obtener libro específico
- `POST /api/v1/books` - Crear nuevo libro (admin)
- `PUT /api/v1/books/:id` - Actualizar libro (admin)
- `DELETE /api/v1/books/:id` - Eliminar libro (admin)

#### Préstamos
- `GET /api/v1/loans` - Obtener préstamos
- `POST /api/v1/loans` - Crear préstamo
- `PUT /api/v1/loans/:id/return` - Devolver libro

#### Administración
- `GET /api/v1/statistics` - Estadísticas del sistema
- `GET /api/v1/categories` - Obtener categorías
- `GET /api/v1/authors` - Obtener autores
- `GET /api/v1/audit-log` - Log de auditoría

### Características del API

- **Autenticación JWT** simulada
- **Paginación** automática
- **Filtros y búsqueda** avanzada
- **Códigos de error** HTTP estándar
- **Validación de datos** completa
- **Log de auditoría** detallado

## 🛠️ Funcionalidades Avanzadas

### 1. Búsqueda de Texto Completo
```javascript
// Búsqueda inteligente con relevancia
const results = libraryDB.searchBooks(query);
```

### 2. Consultas Tipo SQL
```javascript
// SELECT con JOIN simulado
const booksWithAuthors = libraryDB.selectBooksWithAuthors();

// SELECT con condiciones
const scienceBooks = libraryDB.selectBooks(
    book => book.category_id === 1
);
```

### 3. Operaciones CRUD Completas
```javascript
// INSERT
const newBook = libraryDB.insertBook(bookData);

// UPDATE
const updatedBook = libraryDB.updateBook(id, updateData);

// DELETE
const deleted = libraryDB.deleteBook(id);
```

### 4. Integridad Referencial
- Validación de claves foráneas
- Cascada de eliminaciones
- Verificación de dependencias

### 5. Backup y Restauración
```javascript
// Backup completo
const backup = await libraryAPI.backupDatabase();

// Restaurar desde backup
await libraryAPI.restoreDatabase(backupData);
```

## 📈 Estadísticas y Reportes

### Métricas Disponibles
- Total de libros por categoría
- Préstamos activos y vencidos
- Usuarios más activos
- Libros más solicitados
- Estadísticas de inventario

### Tipos de Reportes
- **Mensual** - Resumen del mes
- **Inventario** - Estado actual del inventario
- **Vencidos** - Préstamos atrasados
- **Auditoría** - Log de actividades

## 🔐 Seguridad y Auditoría

### Sistema de Roles
- **Admin** - Acceso completo
- **Student** - Acceso limitado
- **Professor** - Permisos extendidos

### Log de Auditoría
- Registro de todas las acciones
- Timestamps precisos
- Información del usuario
- Detalles de la operación

## 💾 Persistencia de Datos

### localStorage
- Datos guardados automáticamente
- Recuperación al cargar la página
- Sincronización en tiempo real

### Formato de Datos
```json
{
  "tables": {
    "books": {...},
    "users": {...},
    "loans": {...}
  },
  "indexes": {...},
  "sequences": {...}
}
```

## 🚀 Uso del Sistema

### Inicialización


### Operaciones Básicas
```javascript
// Buscar libros
const books = await libraryAPI.getBooks({
    search: 'javascript',
    category: 'tecnologia',
    page: 1,
    limit: 10
});

// Crear préstamo
const loan = await libraryAPI.createLoan({
    book_id: 1,
    duration: 14
});
```

## 📚 Ventajas del Sistema

1. **Realismo** - Simula una base de datos real
2. **Rendimiento** - Índices optimizados
3. **Escalabilidad** - Estructura modular
4. **Mantenibilidad** - Código organizado
5. **Extensibilidad** - Fácil de ampliar
6. **Seguridad** - Sistema de permisos
7. **Auditoría** - Trazabilidad completa

## 🎯 Casos de Uso

### Para Estudiantes
- Buscar libros por tema
- Solicitar préstamos
- Ver historial personal
- Renovar préstamos

### Para Administradores
- Gestionar inventario
- Procesar préstamos
- Generar reportes
- Monitorear sistema

### Para Profesores
- Acceso prioritario
- Préstamos extendidos
- Reservas especiales

## 🔧 Configuración Avanzada

### Personalización de Índices
```javascript
// Agregar índice personalizado
libraryDB.indexes.books_by_rating = new Map();
```

### Extensión de Tablas
```javascript
// Agregar nueva tabla
libraryDB.tables.reservations = new Map();
```

Este sistema proporciona una base sólida y realista para una biblioteca virtual universitaria, con todas las características que esperarías de un sistema de gestión de biblioteca profesional.
