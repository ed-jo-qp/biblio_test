// Configuración del Sistema de Biblioteca Virtual
const LibraryConfig = {
    // Configuración de la base de datos
    database: {
        // Tablas a crear al inicializar
        tables: [
            'books', 'users', 'loans', 'categories', 
            'authors', 'publishers', 'loan_history', 
            'reservations', 'reviews', 'fines'
        ],
        
        // Índices automáticos
        autoIndexes: true,
        
        // Tamaño máximo de la base de datos (MB)
        maxSize: 50,
        
        // Intervalo de guardado automático (ms)
        autoSaveInterval: 30000,
        
        // Compresión de datos
        compression: false
    },
    
    // Configuración del API
    api: {
        // URL base del API
        baseUrl: '/api/v1',
        
        // Tiempo de espera de red simulado (ms)
        networkDelay: 100,
        
        // Máximo de intentos de reintento
        maxRetries: 3,
        
        // Tiempo de vida del token (ms)
        tokenLifetime: 24 * 60 * 60 * 1000, // 24 horas
        
        // Tamaño de página por defecto
        defaultPageSize: 10,
        
        // Máximo de elementos por página
        maxPageSize: 100
    },
    
    // Configuración de la biblioteca
    library: {
        // Información de la institución
        institution: {
            name: 'Universidad BiblioUni',
            code: 'UBU',
            address: 'Campus Universitario, Ciudad',
            phone: '(555) 123-4567',
            email: 'info@bibliouji.edu',
            website: 'https://bibliouji.edu'
        },
        
        // Horarios de operación
        hours: {
            weekdays: { open: '08:00', close: '22:00' },
            saturday: { open: '09:00', close: '18:00' },
            sunday: { open: '12:00', close: '20:00' }
        },
        
        // Configuración de préstamos
        loans: {
            // Duración por defecto (días)
            defaultDuration: 14,
            
            // Duraciones permitidas por rol
            durationsByRole: {
                student: [7, 14, 21],
                professor: [14, 21, 30, 60],
                admin: [7, 14, 21, 30, 60, 90]
            },
            
            // Máximo de préstamos por rol
            maxLoansByRole: {
                student: 5,
                professor: 10,
                admin: 20
            },
            
            // Renovaciones máximas
            maxRenewals: 2,
            
            // Días de gracia antes de multa
            graceDays: 3,
            
            // Multa por día (moneda local)
            finePerDay: 0.50
        },
        
        // Configuración de reservas
        reservations: {
            // Duración de reserva (días)
            duration: 7,
            
            // Máximo de reservas por usuario
            maxReservations: 3,
            
            // Tiempo de espera antes de cancelar (horas)
            waitTimeBeforeCancel: 24
        },
        
        // Configuración de categorías Dewey
        deweyCategories: {
            '000-099': 'Ciencias de la Computación, Información y Obras Generales',
            '100-199': 'Filosofía y Psicología',
            '200-299': 'Religión',
            '300-399': 'Ciencias Sociales',
            '400-499': 'Lenguas',
            '500-599': 'Ciencias Naturales y Matemáticas',
            '600-699': 'Tecnología (Ciencias Aplicadas)',
            '700-799': 'Las Artes, Recreación',
            '800-899': 'Literatura',
            '900-999': 'Historia y Geografía'
        },
        
        // Ubicaciones físicas
        locations: {
            floors: 3,
            sectionsPerFloor: 10,
            shelvesPerSection: 20,
            booksPerShelf: 50
        }
    },
    
    // Configuración de la interfaz
    ui: {
        // Tema
        theme: 'light', // 'light' | 'dark' | 'auto'
        
        // Colores principales
        colors: {
            primary: '#2c3e50',
            secondary: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            danger: '#e74c3c',
            info: '#17a2b8'
        },
        
        // Paginación
        pagination: {
            itemsPerPage: 9,
            showPageNumbers: true,
            showTotalItems: true
        },
        
        // Búsqueda
        search: {
            debounceTime: 300,
            minCharacters: 2,
            maxResults: 100,
            showSuggestions: true
        },
        
        // Notificaciones
        notifications: {
            duration: 3000,
            position: 'top-right',
            showProgress: true
        }
    },
    
    // Configuración de seguridad
    security: {
        // Configuración de contraseñas
        password: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false
        },
        
        // Intentos de login
        login: {
            maxAttempts: 5,
            lockoutDuration: 15 * 60 * 1000, // 15 minutos
            sessionTimeout: 60 * 60 * 1000 // 1 hora
        },
        
        // Auditoría
        audit: {
            logAll: true,
            logSensitiveData: false,
            maxLogEntries: 10000,
            retentionDays: 90
        }
    },
    
    // Configuración de reportes
    reports: {
        // Tipos de reportes disponibles
        types: [
            'monthly',
            'inventory',
            'overdue',
            'popular',
            'users',
            'statistics'
        ],
        
        // Formatos de exportación
        formats: ['pdf', 'excel', 'csv', 'json'],
        
        // Programación automática
        schedule: {
            monthly: { enabled: true, day: 1 },
            weekly: { enabled: false, day: 'monday' },
            daily: { enabled: false, hour: 6 }
        }
    },
    
    // Configuración de notificaciones
    notifications: {
        // Notificaciones por email
        email: {
            enabled: false,
            smtp: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'biblioteca@universidad.edu',
                    pass: 'password'
                }
            },
            templates: {
                loanReminder: 'loan-reminder.html',
                overdueNotice: 'overdue-notice.html',
                returnConfirmation: 'return-confirmation.html'
            }
        },
        
        // Notificaciones push
        push: {
            enabled: false,
            vapidKeys: {
                publicKey: '',
                privateKey: ''
            }
        },
        
        // Recordatorios automáticos
        reminders: {
            dueSoon: { enabled: true, daysBefore: 3 },
            overdue: { enabled: true, daysAfter: 1 },
            returnConfirmation: { enabled: true }
        }
    },
    
    // Configuración de backup
    backup: {
        // Backup automático
        automatic: {
            enabled: true,
            interval: 24 * 60 * 60 * 1000, // 24 horas
            maxBackups: 7
        },
        
        // Compresión
        compression: {
            enabled: true,
            level: 6
        },
        
        // Ubicación de backups
        location: 'localStorage', // 'localStorage' | 'indexedDB' | 'external'
        
        // Encriptación
        encryption: {
            enabled: false,
            key: ''
        }
    },
    
    // Configuración de desarrollo
    development: {
        // Datos de prueba
        seedData: {
            enabled: true,
            books: 20,
            users: 10,
            loans: 15,
            categories: 10,
            authors: 15,
            publishers: 8
        },
        
        // Debug
        debug: {
            enabled: false,
            logLevel: 'info', // 'error' | 'warn' | 'info' | 'debug'
            showQueries: false,
            showApiCalls: false
        },
        
        // Métricas de rendimiento
        performance: {
            enabled: false,
            trackQueries: true,
            trackApiCalls: true,
            reportInterval: 60000 // 1 minuto
        }
    }
};

// Función para obtener configuración
function getConfig(path) {
    return path.split('.').reduce((config, key) => config[key], LibraryConfig);
}

// Función para establecer configuración
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((config, key) => config[key], LibraryConfig);
    target[lastKey] = value;
}

// Función para validar configuración
function validateConfig() {
    const errors = [];
    
    // Validar configuración de base de datos
    if (!LibraryConfig.database.tables || LibraryConfig.database.tables.length === 0) {
        errors.push('database.tables no puede estar vacío');
    }
    
    // Validar configuración de API
    if (LibraryConfig.api.networkDelay < 0) {
        errors.push('api.networkDelay debe ser mayor o igual a 0');
    }
    
    // Validar configuración de préstamos
    if (LibraryConfig.library.loans.defaultDuration <= 0) {
        errors.push('library.loans.defaultDuration debe ser mayor a 0');
    }
    
    // Validar configuración de seguridad
    if (LibraryConfig.security.password.minLength < 4) {
        errors.push('security.password.minLength debe ser al menos 4');
    }
    
    return errors;
}

// Función para cargar configuración desde localStorage
function loadConfig() {
    const saved = localStorage.getItem('libraryConfig');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            Object.assign(LibraryConfig, config);
        } catch (error) {
            console.error('Error cargando configuración:', error);
        }
    }
}

// Función para guardar configuración
function saveConfig() {
    localStorage.setItem('libraryConfig', JSON.stringify(LibraryConfig));
}

// Función para resetear configuración
function resetConfig() {
    localStorage.removeItem('libraryConfig');
    location.reload();
}

// Cargar configuración al inicio
loadConfig();

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LibraryConfig,
        getConfig,
        setConfig,
        validateConfig,
        loadConfig,
        saveConfig,
        resetConfig
    };
}
