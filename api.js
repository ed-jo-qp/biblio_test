// API Simulado para la Biblioteca - Simula un backend REST API
class LibraryAPI {
    constructor(database) {
        this.db = database;
        this.apiBaseUrl = '/api/v1';
        this.authToken = null;
        this.currentUser = null;
        
        // Simular latencia de red
        this.networkDelay = 100; // milisegundos
        
        // Logs de auditoría
        this.auditLog = [];
    }
    
    // Simular delay de red
    async simulateNetworkDelay() {
        return new Promise(resolve => setTimeout(resolve, this.networkDelay));
    }
    
    // Registrar acciones en el log de auditoría
    logAction(action, userId, details) {
        this.auditLog.push({
            timestamp: new Date().toISOString(),
            action,
            userId,
            details,
            ip: '127.0.0.1' // Simulado
        });
    }
    
    // Autenticación
    async login(credentials) {
        await this.simulateNetworkDelay();
        
        try {
            const { username, password } = credentials;
            
            // Buscar usuario por student_id o email
            let user = null;
            for (const u of this.db.tables.users.values()) {
                if ((u.student_id === username || u.email === username) && 
                    u.password === password && u.active) {
                    user = u;
                    break;
                }
            }
            
            if (!user) {
                this.logAction('LOGIN_FAILED', null, { username });
                return {
                    success: false,
                    error: 'Credenciales inválidas',
                    code: 401
                };
            }
            
            // Generar token simulado
            this.authToken = this.generateToken(user);
            this.currentUser = user;
            
            // Actualizar última conexión
            user.last_login = new Date().toISOString();
            this.db.saveToStorage();
            
            this.logAction('LOGIN_SUCCESS', user.id, { username });
            
            return {
                success: true,
                data: {
                    token: this.authToken,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        faculty: user.faculty,
                        student_id: user.student_id
                    }
                }
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error del servidor',
                code: 500
            };
        }
    }
    
    // Cerrar sesión
    async logout() {
        await this.simulateNetworkDelay();
        
        if (this.currentUser) {
            this.logAction('LOGOUT', this.currentUser.id, {});
        }
        
        this.authToken = null;
        this.currentUser = null;
        
        return { success: true };
    }
    
    // Verificar autenticación
    isAuthenticated() {
        return this.authToken !== null && this.currentUser !== null;
    }
    
    // Verificar permisos de administrador
    isAdmin() {
        return this.isAuthenticated() && this.currentUser.role === 'admin';
    }
    
    // Generar token JWT simulado
    generateToken(user) {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            userId: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        }));
        const signature = btoa('simulated-signature');
        
        return `${header}.${payload}.${signature}`;
    }
    
    // ENDPOINTS DE LA API
    
    // GET /api/v1/books
    async getBooks(params = {}) {
        await this.simulateNetworkDelay();
        
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                category = '',
                author = '',
                sortBy = 'title',
                sortOrder = 'asc'
            } = params;
            
            let books;
            
            // Búsqueda
            if (search) {
                books = this.db.searchBooks(search);
            } else {
                books = this.db.selectBooksWithAuthors();
            }
            
            // Filtros
            if (category) {
                books = books.filter(book => book.category?.name.toLowerCase() === category.toLowerCase());
            }
            
            if (author) {
                books = books.filter(book => book.author?.name.toLowerCase().includes(author.toLowerCase()));
            }
            
            // Ordenamiento
            books.sort((a, b) => {
                let aValue = a[sortBy] || '';
                let bValue = b[sortBy] || '';
                
                if (sortBy === 'author') {
                    aValue = a.author?.name || '';
                    bValue = b.author?.name || '';
                }
                
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }
                
                const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                return sortOrder === 'desc' ? -comparison : comparison;
            });
            
            // Paginación
            const total = books.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedBooks = books.slice(startIndex, endIndex);
            
            return {
                success: true,
                data: {
                    books: paginatedBooks,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener libros',
                code: 500
            };
        }
    }
    
    // GET /api/v1/books/:id
    async getBook(id) {
        await this.simulateNetworkDelay();
        
        try {
            const book = this.db.tables.books.get(parseInt(id));
            
            if (!book) {
                return {
                    success: false,
                    error: 'Libro no encontrado',
                    code: 404
                };
            }
            
            const author = this.db.tables.authors.get(book.author_id);
            const category = this.db.tables.categories.get(book.category_id);
            const publisher = this.db.tables.publishers.get(book.publisher_id);
            
            return {
                success: true,
                data: {
                    ...book,
                    author,
                    category,
                    publisher
                }
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener libro',
                code: 500
            };
        }
    }
    
    // POST /api/v1/books
    async createBook(bookData) {
        await this.simulateNetworkDelay();
        
        if (!this.isAdmin()) {
            return {
                success: false,
                error: 'Permisos insuficientes',
                code: 403
            };
        }
        
        try {
            // Validar datos requeridos
            const requiredFields = ['title', 'author_id', 'category_id', 'dewey_code'];
            for (const field of requiredFields) {
                if (!bookData[field]) {
                    return {
                        success: false,
                        error: `Campo requerido: ${field}`,
                        code: 400
                    };
                }
            }
            
            // Verificar que el código Dewey no existe
            if (this.db.findBookByDewey(bookData.dewey_code)) {
                return {
                    success: false,
                    error: 'El código Dewey ya existe',
                    code: 409
                };
            }
            
            // Verificar ISBN si se proporciona
            if (bookData.isbn && this.db.findBookByISBN(bookData.isbn)) {
                return {
                    success: false,
                    error: 'El ISBN ya existe',
                    code: 409
                };
            }
            
            const book = this.db.insertBook(bookData);
            
            this.logAction('CREATE_BOOK', this.currentUser.id, {
                bookId: book.id,
                title: book.title
            });
            
            return {
                success: true,
                data: book
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al crear libro',
                code: 500
            };
        }
    }
    
    // PUT /api/v1/books/:id
    async updateBook(id, updateData) {
        await this.simulateNetworkDelay();
        
        if (!this.isAdmin()) {
            return {
                success: false,
                error: 'Permisos insuficientes',
                code: 403
            };
        }
        
        try {
            const book = this.db.updateBook(parseInt(id), updateData);
            
            if (!book) {
                return {
                    success: false,
                    error: 'Libro no encontrado',
                    code: 404
                };
            }
            
            this.logAction('UPDATE_BOOK', this.currentUser.id, {
                bookId: book.id,
                title: book.title,
                changes: updateData
            });
            
            return {
                success: true,
                data: book
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al actualizar libro',
                code: 500
            };
        }
    }
    
    // DELETE /api/v1/books/:id
    async deleteBook(id) {
        await this.simulateNetworkDelay();
        
        if (!this.isAdmin()) {
            return {
                success: false,
                error: 'Permisos insuficientes',
                code: 403
            };
        }
        
        try {
            const book = this.db.tables.books.get(parseInt(id));
            
            if (!book) {
                return {
                    success: false,
                    error: 'Libro no encontrado',
                    code: 404
                };
            }
            
            const deleted = this.db.deleteBook(parseInt(id));
            
            if (!deleted) {
                return {
                    success: false,
                    error: 'No se pudo eliminar el libro',
                    code: 500
                };
            }
            
            this.logAction('DELETE_BOOK', this.currentUser.id, {
                bookId: parseInt(id),
                title: book.title
            });
            
            return {
                success: true,
                message: 'Libro eliminado correctamente'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al eliminar libro',
                code: 500
            };
        }
    }
    
    // GET /api/v1/loans
    async getLoans(params = {}) {
        await this.simulateNetworkDelay();
        
        try {
            const {
                userId = null,
                status = null,
                page = 1,
                limit = 10
            } = params;
            
            let loans = this.db.selectLoansWithDetails();
            
            // Filtrar por usuario si no es admin
            if (!this.isAdmin() && this.currentUser) {
                loans = loans.filter(loan => loan.user_id === this.currentUser.id);
            } else if (userId) {
                loans = loans.filter(loan => loan.user_id === parseInt(userId));
            }
            
            // Filtrar por estado
            if (status) {
                loans = loans.filter(loan => loan.status === status);
            }
            
            // Paginación
            const total = loans.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedLoans = loans.slice(startIndex, endIndex);
            
            return {
                success: true,
                data: {
                    loans: paginatedLoans,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener préstamos',
                code: 500
            };
        }
    }
    
    // POST /api/v1/loans
    async createLoan(loanData) {
        await this.simulateNetworkDelay();
        
        if (!this.isAuthenticated()) {
            return {
                success: false,
                error: 'Debe iniciar sesión',
                code: 401
            };
        }
        
        try {
            const { book_id, duration = 14 } = loanData;
            
            // Verificar que el libro existe
            const book = this.db.tables.books.get(book_id);
            if (!book) {
                return {
                    success: false,
                    error: 'Libro no encontrado',
                    code: 404
                };
            }
            
            // Verificar disponibilidad
            if (book.available_copies <= 0) {
                return {
                    success: false,
                    error: 'No hay copias disponibles',
                    code: 409
                };
            }
            
            // Calcular fecha de vencimiento
            const loanDate = new Date();
            const dueDate = new Date(loanDate.getTime() + (duration * 24 * 60 * 60 * 1000));
            
            const loan = this.db.createLoan({
                book_id,
                user_id: this.currentUser.id,
                loan_date: loanDate.toISOString().split('T')[0],
                due_date: dueDate.toISOString().split('T')[0],
                notes: loanData.notes || ''
            });
            
            this.logAction('CREATE_LOAN', this.currentUser.id, {
                loanId: loan.id,
                bookId: book_id,
                bookTitle: book.title
            });
            
            return {
                success: true,
                data: loan
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al crear préstamo',
                code: 500
            };
        }
    }
    
    // PUT /api/v1/loans/:id/return
    async returnLoan(loanId) {
        await this.simulateNetworkDelay();
        
        if (!this.isAuthenticated()) {
            return {
                success: false,
                error: 'Debe iniciar sesión',
                code: 401
            };
        }
        
        try {
            const loan = this.db.tables.loans.get(parseInt(loanId));
            
            if (!loan) {
                return {
                    success: false,
                    error: 'Préstamo no encontrado',
                    code: 404
                };
            }
            
            // Verificar permisos
            if (!this.isAdmin() && loan.user_id !== this.currentUser.id) {
                return {
                    success: false,
                    error: 'Permisos insuficientes',
                    code: 403
                };
            }
            
            const returnedLoan = this.db.returnBook(parseInt(loanId));
            
            this.logAction('RETURN_LOAN', this.currentUser.id, {
                loanId: parseInt(loanId),
                bookId: loan.book_id
            });
            
            return {
                success: true,
                data: returnedLoan
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al devolver libro',
                code: 500
            };
        }
    }
    
    // GET /api/v1/statistics
    async getStatistics() {
        await this.simulateNetworkDelay();
        
        if (!this.isAdmin()) {
            return {
                success: false,
                error: 'Permisos insuficientes',
                code: 403
            };
        }
        
        try {
            const stats = this.db.getStatistics();
            
            return {
                success: true,
                data: stats
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener estadísticas',
                code: 500
            };
        }
    }
    
    // GET /api/v1/categories
    async getCategories() {
        await this.simulateNetworkDelay();
        
        try {
            const categories = Array.from(this.db.tables.categories.values());
            
            return {
                success: true,
                data: categories
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener categorías',
                code: 500
            };
        }
    }
    
    // GET /api/v1/authors
    async getAuthors() {
        await this.simulateNetworkDelay();
        
        try {
            const authors = Array.from(this.db.tables.authors.values());
            
            return {
                success: true,
                data: authors
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener autores',
                code: 500
            };
        }
    }
    
    // GET /api/v1/audit-log
    async getAuditLog(params = {}) {
        await this.simulateNetworkDelay();
        
        if (!this.isAdmin()) {
            return {
                success: false,
                error: 'Permisos insuficientes',
                code: 403
            };
        }
        
        try {
            const { page = 1, limit = 50, action = null, userId = null } = params;
            
            let logs = [...this.auditLog];
            
            // Filtros
            if (action) {
                logs = logs.filter(log => log.action === action);
            }
            
            if (userId) {
                logs = logs.filter(log => log.userId === parseInt(userId));
            }
            
            // Ordenar por fecha más reciente
            logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Paginación
            const total = logs.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedLogs = logs.slice(startIndex, endIndex);
            
            return {
                success: true,
                data: {
                    logs: paginatedLogs,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener logs',
                code: 500
            };
        }
    }
    
    // Método para backup de datos
    async backupDatabase() {
        await this.simulateNetworkDelay();
        
        if (!this.isAdmin()) {
            return {
                success: false,
                error: 'Permisos insuficientes',
                code: 403
            };
        }
        
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                data: this.db.exportData(),
                audit_log: this.auditLog
            };
            
            this.logAction('DATABASE_BACKUP', this.currentUser.id, {
                timestamp: backup.timestamp
            });
            
            return {
                success: true,
                data: backup
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al crear backup',
                code: 500
            };
        }
    }
    
    // Método para restaurar datos
    async restoreDatabase(backupData) {
        await this.simulateNetworkDelay();
        
        if (!this.isAdmin()) {
            return {
                success: false,
                error: 'Permisos insuficientes',
                code: 403
            };
        }
        
        try {
            const success = this.db.importData(backupData.data);
            
            if (success) {
                this.logAction('DATABASE_RESTORE', this.currentUser.id, {
                    backupTimestamp: backupData.timestamp
                });
                
                return {
                    success: true,
                    message: 'Base de datos restaurada correctamente'
                };
            } else {
                return {
                    success: false,
                    error: 'Error al restaurar base de datos',
                    code: 500
                };
            }
            
        } catch (error) {
            return {
                success: false,
                error: 'Error al restaurar base de datos',
                code: 500
            };
        }
    }
}

// Instancia global del API
const libraryAPI = new LibraryAPI(libraryDB);

// Funciones auxiliares para la interfaz
window.LibraryAPI = libraryAPI;
window.LibraryDB = libraryDB;
