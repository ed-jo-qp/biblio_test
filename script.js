// Variables globales actualizadas para usar la nueva API
let books = [];
let filteredBooks = [];
let currentPage = 1;
let itemsPerPage = 9;
let currentView = 'grid';
let currentUser = null;
let isAdminMode = false;
let loans = [];
let loanHistory = [];

// Inicializar la aplicación

// Inicialización robusta de la base de datos y API
let libraryDB;
if (!window.libraryDB) {
    libraryDB = new LibraryDatabase();
    window.libraryDB = libraryDB;
} else {
    libraryDB = window.libraryDB;
}

let libraryAPI;
if (!window.libraryAPI) {
    libraryAPI = new LibraryAPI(libraryDB);
    window.libraryAPI = libraryAPI;
} else {
    libraryAPI = window.libraryAPI;
}

document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
    setupEventListeners();
    setupModals();
    // Cargar datos iniciales
    await loadBooksFromAPI();
    await loadLoansFromAPI();
    displayBooks();
    updateUI();
});

// Inicializar aplicación
async function initializeApp() {
    // Verificar si hay sesión activa
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            libraryAPI.authToken = session.token;
            libraryAPI.currentUser = session.user;
            currentUser = session.user;
            isAdminMode = session.user.role === 'admin';
            updateUI();
        } catch (error) {
            console.error('Error restaurando sesión:', error);
            localStorage.removeItem('userSession');
        }
    }
}

// Cargar libros desde la API
async function loadBooksFromAPI() {
    try {
        const response = await libraryAPI.getBooks({ limit: 100 });
        if (response.success) {
            books = response.data.books;
            filteredBooks = [...books];
        } else {
            console.error('Error cargando libros:', response.error);
        }
    } catch (error) {
        console.error('Error en loadBooksFromAPI:', error);
    }
}

// Cargar préstamos desde la API
async function loadLoansFromAPI() {
    try {
        const response = await libraryAPI.getLoans({ limit: 100 });
        if (response.success) {
            loans = response.data.loans;
        } else {
            console.error('Error cargando préstamos:', response.error);
        }
    } catch (error) {
        console.error('Error en loadLoansFromAPI:', error);
    }
}

// Sistema de autenticación básico
function login(username, password) {
    // Simulación de autenticación
    if (username === 'admin' && password === 'admin123') {
        currentUser = { id: 'admin', name: 'Administrador', role: 'admin' };
        isAdminMode = true;
        document.querySelector('.btn-admin').style.display = 'inline-block';
        document.querySelector('.btn-login').innerHTML = '<i class="fas fa-user"></i> ' + currentUser.name;
        return true;
    } else if (username && password) {
        currentUser = { id: username, name: username, role: 'student' };
        document.querySelector('.btn-login').innerHTML = '<i class="fas fa-user"></i> ' + currentUser.name;
        return true;
    }
    return false;
}

// Generar código Dewey automáticamente
function generateDeweyCode(category, author) {
    const deweyCategories = {
        'ciencia': '500',
        'tecnologia': '004',
        'medicina': '610',
        'derecho': '340',
        'literatura': '800',
        'historia': '900',
        'filosofia': '100',
        'arte': '700',
        'matematicas': '510',
        'psicologia': '150',
        'ecologia': '333.7'
    };
    
    const categoryCode = deweyCategories[category] || '000';
    const authorCode = author.split(' ').pop().substring(0, 3).toUpperCase();
    const subCode = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    
    return `${categoryCode}.${subCode} ${authorCode}`;
}

// Función para actualizar automáticamente el código Dewey
function updateDeweyCode() {
    const categorySelect = document.getElementById('bookCategory');
    const authorInput = document.getElementById('bookAuthor');
    const deweyInput = document.getElementById('bookDewey');
    
    if (categorySelect && authorInput && deweyInput) {
        const category = categorySelect.value;
        const author = authorInput.value.trim();
        
        if (category && author) {
            const deweyCode = generateDeweyCode(category, author);
            deweyInput.value = deweyCode;
        }
    }
}

// Configurar listeners para actualización automática del código Dewey
function setupDeweyAutoGeneration() {
    const categorySelect = document.getElementById('bookCategory');
    const authorInput = document.getElementById('bookAuthor');
    
    if (categorySelect && authorInput) {
        categorySelect.addEventListener('change', updateDeweyCode);
        authorInput.addEventListener('input', updateDeweyCode);
        authorInput.addEventListener('blur', updateDeweyCode);
    }
}

// Cargar libros desde data.json
async function loadBooks() {
    try {
        const response = await fetch('data.json');
        books = await response.json();
        
        // Agregar códigos Dewey si no existen
        books.forEach(book => {
            if (!book.deweyCode) {
                book.deweyCode = generateDeweyCode(book.category, book.author);
            }
            if (!book.totalCopies) book.totalCopies = 1;
            if (!book.availableCopies) book.availableCopies = 1;
            if (!book.location) book.location = 'Piso 1, Estante A-01';
            if (!book.borrowCount) book.borrowCount = 0;
        });
        
        filteredBooks = [...books];
        displayBooks();
        updatePagination();
        displayManagedBooks();
    } catch (error) {
        console.error('Error loading books:', error);
        books = generateSampleBooks();
        filteredBooks = [...books];
        displayBooks();
        updatePagination();
        displayManagedBooks();
    }
}

// Cargar préstamos
function loadLoans() {
    // Cargar desde localStorage o generar datos de ejemplo
    const savedLoans = localStorage.getItem('libraryLoans');
    if (savedLoans) {
        loans = JSON.parse(savedLoans);
    } else {
        loans = generateSampleLoans();
        saveLoans();
    }
    
    const savedHistory = localStorage.getItem('libraryLoanHistory');
    if (savedHistory) {
        loanHistory = JSON.parse(savedHistory);
    } else {
        loanHistory = generateSampleLoanHistory();
        saveLoanHistory();
    }
    
    displayActiveLoans();
    displayPendingLoans();
    displayLoanHistory();
    updateLoanStats();
}

// Guardar préstamos
function saveLoans() {
    localStorage.setItem('libraryLoans', JSON.stringify(loans));
}

function saveLoanHistory() {
    localStorage.setItem('libraryLoanHistory', JSON.stringify(loanHistory));
}

// Generar datos de ejemplo para préstamos
function generateSampleLoans() {
    return [
        {
            id: 1,
            bookId: 1,
            studentId: '20231001',
            studentName: 'Ana García',
            faculty: 'ingenieria',
            loanDate: '2025-01-01',
            dueDate: '2025-01-15',
            status: 'active',
            renewals: 0,
            purpose: 'Proyecto de tesis'
        },
        {
            id: 2,
            bookId: 5,
            studentId: '20231002',
            studentName: 'Carlos López',
            faculty: 'medicina',
            loanDate: '2025-01-05',
            dueDate: '2025-01-10',
            status: 'overdue',
            renewals: 1,
            purpose: 'Estudio para examen'
        }
    ];
}

function generateSampleLoanHistory() {
    return [
        {
            id: 101,
            bookId: 4,
            studentId: '20231003',
            studentName: 'María Rodríguez',
            faculty: 'humanidades',
            loanDate: '2024-12-01',
            returnDate: '2024-12-14',
            dueDate: '2024-12-15',
            status: 'returned',
            renewals: 0
        }
    ];
}

// Funcionalidad de pestañas para préstamos
function showLoanTab(tabName) {
    document.querySelectorAll('.loan-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.loans .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Funcionalidad de pestañas para administración
function showAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Buscar libros para préstamo
function searchForLoan() {
    const searchTerm = document.getElementById('loanSearchInput').value.toLowerCase();
    const results = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.deweyCode.toLowerCase().includes(searchTerm)
    );
    
    displayLoanSearchResults(results);
}

function displayLoanSearchResults(results) {
    const resultsDiv = document.getElementById('loanSearchResults');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="no-results">No se encontraron libros.</p>';
        return;
    }
    
    resultsDiv.innerHTML = results.map(book => `
        <div class="loan-result-item">
            <div class="book-info">
                <h4>${book.title}</h4>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Código Dewey:</strong> ${book.deweyCode}</p>
                <p><strong>Disponibles:</strong> ${book.availableCopies}/${book.totalCopies}</p>
                <p><strong>Ubicación:</strong> ${book.location}</p>
            </div>
            <div class="loan-actions">
                <button onclick="selectBookForLoan(${book.id})" 
                        class="btn-primary" 
                        ${book.availableCopies === 0 ? 'disabled' : ''}>
                    ${book.availableCopies === 0 ? 'No Disponible' : 'Seleccionar'}
                </button>
            </div>
        </div>
    `).join('');
}

// Seleccionar libro para préstamo
function selectBookForLoan(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('selectedBook').value = book.title;
    document.getElementById('deweyCode').value = book.deweyCode;
    document.getElementById('loanFormContainer').style.display = 'block';
    
    // Scroll al formulario
    document.getElementById('loanFormContainer').scrollIntoView({ behavior: 'smooth' });
}

// Procesar solicitud de préstamo
function processLoanRequest(formData) {
    const bookId = books.find(b => b.deweyCode === formData.deweyCode)?.id;
    const book = books.find(b => b.id === bookId);
    
    if (!book || book.availableCopies === 0) {
        alert('El libro no está disponible.');
        return false;
    }
    
    // Verificar si el formato seleccionado está disponible
    const selectedFormat = formData.format || 'physical';
    if (book.formats && !book.formats.includes(selectedFormat)) {
        alert(`El libro no está disponible en formato ${selectedFormat === 'physical' ? 'físico' : 'digital'}.`);
        return false;
    }
    
    const newLoan = {
        id: Date.now(),
        bookId: bookId,
        studentId: formData.studentId,
        studentName: formData.studentName,
        faculty: formData.faculty,
        loanDate: new Date().toISOString().split('T')[0],
        dueDate: calculateDueDate(parseInt(formData.loanDuration)),
        status: 'pending',
        renewals: 0,
        purpose: formData.purpose,
        format: selectedFormat
    };
    
    loans.push(newLoan);
    
    // Actualizar disponibilidad del libro solo si es formato físico
    if (selectedFormat === 'physical') {
        book.availableCopies--;
    }
    book.borrowCount++;
    
    saveLoans();
    displayPendingLoans();
    updateLoanStats();
    
    showNotification(`Solicitud de préstamo ${selectedFormat === 'physical' ? 'físico' : 'digital'} enviada exitosamente`, 'success');
    document.getElementById('loanForm').reset();
    document.getElementById('loanFormContainer').style.display = 'none';
    
    return true;
}

// Calcular fecha de vencimiento
function calculateDueDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Mostrar préstamos activos
function displayActiveLoans() {
    const activeLoans = loans.filter(loan => loan.status === 'active');
    const container = document.getElementById('activeLoans');
    
    if (activeLoans.length === 0) {
        container.innerHTML = '<p class="no-loans">No tienes préstamos activos.</p>';
        return;
    }
    
    container.innerHTML = activeLoans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const isOverdue = new Date(loan.dueDate) < new Date();
        
        return `
            <div class="loan-card ${isOverdue ? 'overdue' : ''}">
                <div class="loan-header">
                    <h4>${book ? book.title : 'Libro no encontrado'}</h4>
                    <span class="loan-status ${loan.status}">${loan.status.toUpperCase()}</span>
                </div>
                <div class="loan-details">
                    <p><strong>Código Dewey:</strong> ${book ? book.deweyCode : 'N/A'}</p>
                    <p><strong>Fecha de préstamo:</strong> ${loan.loanDate}</p>
                    <p><strong>Fecha de vencimiento:</strong> ${loan.dueDate}</p>
                    <p><strong>Formato:</strong> ${loan.format === 'physical' ? '📚 Físico' : '💻 Digital'}</p>
                    <p><strong>Renovaciones:</strong> ${loan.renewals}/2</p>
                    ${isOverdue ? '<p class="overdue-text">¡PRÉSTAMO VENCIDO!</p>' : ''}
                </div>
                <div class="loan-actions">
                    <button onclick="renewLoan(${loan.id})" 
                            class="btn-secondary"
                            ${loan.renewals >= 2 ? 'disabled' : ''}>
                        Renovar
                    </button>
                    <button onclick="returnBook(${loan.id})" class="btn-primary">
                        Devolver
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Mostrar préstamos pendientes
function displayPendingLoans() {
    const pendingLoans = loans.filter(loan => loan.status === 'pending');
    const container = document.getElementById('pendingLoans');
    
    if (pendingLoans.length === 0) {
        container.innerHTML = '<p class="no-loans">No tienes préstamos pendientes.</p>';
        return;
    }
    
    container.innerHTML = pendingLoans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        
        return `
            <div class="loan-card pending">
                <div class="loan-header">
                    <h4>${book ? book.title : 'Libro no encontrado'}</h4>
                    <span class="loan-status pending">PENDIENTE</span>
                </div>
                <div class="loan-details">
                    <p><strong>Código Dewey:</strong> ${book ? book.deweyCode : 'N/A'}</p>
                    <p><strong>Fecha de solicitud:</strong> ${loan.loanDate}</p>
                    <p><strong>Formato:</strong> ${loan.format === 'physical' ? '📚 Físico' : '💻 Digital'}</p>
                    <p><strong>Propósito:</strong> ${loan.purpose}</p>
                </div>
                <div class="loan-actions">
                    <button onclick="cancelLoan(${loan.id})" class="btn-secondary">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Renovar préstamo
function renewLoan(loanId) {
    const loan = loans.find(l => l.id === loanId);
    if (!loan || loan.renewals >= 2) {
        alert('No se puede renovar este préstamo.');
        return;
    }
    
    loan.renewals++;
    loan.dueDate = calculateDueDate(14); // 14 días más
    loan.status = 'active';
    
    saveLoans();
    displayActiveLoans();
    alert('Préstamo renovado exitosamente.');
}

// Devolver libro
function returnBook(loanId) {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    const book = books.find(b => b.id === loan.bookId);
    if (book && loan.format === 'physical') {
        // Solo restaurar disponibilidad si es préstamo físico
        book.availableCopies++;
    }
    
    // Mover al historial
    loanHistory.push({
        ...loan,
        returnDate: new Date().toISOString().split('T')[0],
        status: 'returned'
    });
    
    // Eliminar de préstamos activos
    const index = loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
        loans.splice(index, 1);
    }
    
    saveLoans();
    saveLoanHistory();
    displayActiveLoans();
    displayLoanHistory();
    updateLoanStats();
    
    showNotification(`Libro ${loan.format === 'physical' ? 'físico' : 'digital'} devuelto exitosamente`, 'success');
}

// Cancelar préstamo
function cancelLoan(loanId) {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    const book = books.find(b => b.id === loan.bookId);
    if (book && loan.format === 'physical') {
        // Solo restaurar disponibilidad si es préstamo físico
        book.availableCopies++;
    }
    
    const index = loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
        loans.splice(index, 1);
    }
    
    saveLoans();
    displayPendingLoans();
    showNotification(`Préstamo ${loan.format === 'physical' ? 'físico' : 'digital'} cancelado`, 'info');
}

// Agregar nuevo libro
function addNewBook(bookData) {
    const newBook = {
        id: Date.now(),
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        deweyCode: bookData.deweyCode,
        category: bookData.category,
        type: bookData.type,
        year: parseInt(bookData.year),
        pages: parseInt(bookData.pages) || 0,
        publisher: bookData.publisher,
        language: bookData.language,
        description: bookData.description,
        cover: bookData.cover || generatePlaceholderCover(bookData.title),
        totalCopies: parseInt(bookData.copies),
        availableCopies: parseInt(bookData.copies),
        location: bookData.location,
        downloadCount: 0,
        borrowCount: 0,
        rating: 0,
        available: true,
        acquisitionDate: new Date().toISOString().split('T')[0],
        format: ['PDF']
    };
    
    books.push(newBook);
    filteredBooks = [...books];
    displayBooks();
    displayManagedBooks();
    
    // Guardar en localStorage
    localStorage.setItem('libraryBooks', JSON.stringify(books));
    
    alert('Libro agregado exitosamente.');
    document.getElementById('addBookForm').reset();
}

// Generar placeholder para portada
function generatePlaceholderCover(title) {
    const colors = ['667eea', '764ba2', 'e74c3c', '27ae60', '3498db', 'f39c12'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://via.placeholder.com/200x300/${color}/ffffff?text=${encodeURIComponent(title.substring(0, 10))}`;
}

// Mostrar libros gestionados
function displayManagedBooks() {
    const container = document.getElementById('managedBooks');
    
    container.innerHTML = books.map(book => `
        <div class="managed-book-item">
            <div class="book-cover-small">
                <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/100x150/ccc/fff?text=No+Image'">
            </div>
            <div class="book-details">
                <h4>${book.title}</h4>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Código Dewey:</strong> ${book.deweyCode}</p>
                <p><strong>Disponibles:</strong> ${book.availableCopies}/${book.totalCopies}</p>
                <p><strong>Ubicación:</strong> ${book.location}</p>
                <p><strong>Préstamos:</strong> ${book.borrowCount}</p>
            </div>
            <div class="book-actions">
                <button onclick="editBook(${book.id})" class="btn-secondary">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deleteBook(${book.id})" class="btn-danger">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Actualizar estadísticas de préstamos
function updateLoanStats() {
    const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'overdue');
    const overdueLoans = loans.filter(l => l.status === 'overdue' || 
        (l.status === 'active' && new Date(l.dueDate) < new Date()));
    const todayLoans = loans.filter(l => l.loanDate === new Date().toISOString().split('T')[0]);
    
    document.getElementById('activeLoansCount').textContent = activeLoans.length;
    document.getElementById('overdueLoansCount').textContent = overdueLoans.length;
    document.getElementById('todayLoansCount').textContent = todayLoans.length;
}

// Generar reportes
function generateReports() {
    generatePopularBooksReport();
    generateLoanStatsReport();
    generateActiveUsersReport();
    generateCategoryInventoryReport();
}

function generatePopularBooksReport() {
    const sortedBooks = [...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5);
    const container = document.getElementById('popularBooks');
    
    container.innerHTML = sortedBooks.map((book, index) => `
        <div class="report-item">
            <span class="rank">${index + 1}</span>
            <div class="item-details">
                <strong>${book.title}</strong><br>
                <small>Préstamos: ${book.borrowCount}</small>
            </div>
        </div>
    `).join('');
}

function generateLoanStatsReport() {
    const totalLoans = loans.length + loanHistory.length;
    const activeLoans = loans.filter(l => l.status === 'active').length;
    const overdueLoans = loans.filter(l => l.status === 'overdue').length;
    
    const container = document.getElementById('loanStats');
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-number">${totalLoans}</div>
                <div class="stat-label">Total Préstamos</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${activeLoans}</div>
                <div class="stat-label">Activos</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${overdueLoans}</div>
                <div class="stat-label">Vencidos</div>
            </div>
        </div>
    `;
}

function generateActiveUsersReport() {
    // Agrupar préstamos por usuario
    const userLoans = {};
    [...loans, ...loanHistory].forEach(loan => {
        if (!userLoans[loan.studentId]) {
            userLoans[loan.studentId] = {
                name: loan.studentName,
                faculty: loan.faculty,
                count: 0
            };
        }
        userLoans[loan.studentId].count++;
    });
    
    const topUsers = Object.entries(userLoans)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 5);
    
    const container = document.getElementById('activeUsers');
    container.innerHTML = topUsers.map(([id, user], index) => `
        <div class="report-item">
            <span class="rank">${index + 1}</span>
            <div class="item-details">
                <strong>${user.name}</strong><br>
                <small>ID: ${id} | Facultad: ${user.faculty} | Préstamos: ${user.count}</small>
            </div>
        </div>
    `).join('');
}

function generateCategoryInventoryReport() {
    const categoryStats = {};
    books.forEach(book => {
        if (!categoryStats[book.category]) {
            categoryStats[book.category] = {
                total: 0,
                available: 0
            };
        }
        categoryStats[book.category].total += book.totalCopies;
        categoryStats[book.category].available += book.availableCopies;
    });
    
    const container = document.getElementById('categoryInventory');
    container.innerHTML = Object.entries(categoryStats).map(([category, stats]) => `
        <div class="report-item">
            <div class="item-details">
                <strong>${category.charAt(0).toUpperCase() + category.slice(1)}</strong><br>
                <small>Total: ${stats.total} | Disponibles: ${stats.available}</small>
            </div>
        </div>
    `).join('');
}

// Alternar modo admin
function toggleAdminMode() {
    if (!isAdminMode) {
        alert('Acceso denegado. Requiere permisos de administrador.');
        return;
    }
    
    const adminSection = document.getElementById('admin');
    adminSection.scrollIntoView({ behavior: 'smooth' });
}

// Configurar event listeners adicionales
function setupEventListeners() {
    // Búsqueda
    document.getElementById('searchInput').addEventListener('input', debounce(searchBooks, 300));
    document.getElementById('categoryFilter').addEventListener('change', searchBooks);
    document.getElementById('typeFilter').addEventListener('change', searchBooks);
    
    // Ordenamiento
    document.getElementById('sortBy').addEventListener('change', sortBooks);
    
    // Formulario de préstamo
    document.getElementById('loanForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        processLoanRequest(data);
    });
    
    // Formulario de agregar libro
    document.getElementById('addBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        addNewBook(data);
    });
    
    // Modales
    setupModals();
    
    // Configurar generación automática de código Dewey
    setupDeweyAutoGeneration();
    
    // Navegación suave
    setupSmoothScroll();
}

// Configurar navegación suave
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Configurar modales
function setupModals() {
    // Modal de login
    const loginBtn = document.querySelector('.btn-login');
    const loginModal = document.getElementById('loginModal');
    const bookModal = document.getElementById('bookModal');
    const closeButtons = document.querySelectorAll('.close');
    
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Form de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simulación de login
        if (username && password) {
            alert('¡Bienvenido, ' + username + '!');
            loginModal.style.display = 'none';
            document.querySelector('.btn-login').innerHTML = '<i class="fas fa-user"></i> ' + username;
        }
    });
}

// Configurar navegación activa
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Función de búsqueda
function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        const matchesType = !typeFilter || book.type === typeFilter;
        
        return matchesSearch && matchesCategory && matchesType;
    });
    
    currentPage = 1;
    displayBooks();
    updatePagination();
    
    // Mostrar/ocultar mensaje de resultados
    const resultsDiv = document.getElementById('searchResults');
    if (searchTerm || categoryFilter || typeFilter) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `<h3>Resultados de búsqueda: ${filteredBooks.length} libros encontrados</h3>`;
    } else {
        resultsDiv.style.display = 'none';
    }
}

// Función de ordenamiento
function sortBooks() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredBooks.sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return a.author.localeCompare(b.author);
            case 'year':
                return b.year - a.year;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
    
    displayBooks();
}

// Mostrar libros
function displayBooks() {
    const bookGrid = document.getElementById('bookGrid');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);
    
    if (currentView === 'grid') {
        bookGrid.className = 'book-grid';
        bookGrid.innerHTML = currentBooks.map(book => createBookCard(book)).join('');
    } else {
        bookGrid.className = 'book-list';
        bookGrid.innerHTML = currentBooks.map(book => createBookListItem(book)).join('');
    }
    
    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = parseInt(card.dataset.bookId);
            showBookDetails(bookId);
        });
    });
}

// Crear tarjeta de libro
function createBookCard(book) {
    const stars = generateStars(book.rating);
    const availabilityBadge = book.available ? 
        '<span class="availability available">Disponible</span>' : 
        '<span class="availability unavailable">No disponible</span>';
    return `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\"fas fa-book\\"></i>'">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">por ${book.author}</p>
                <span class="book-category">${book.category}</span>
                <div class="book-rating">
                    <span class="stars">${stars}</span>
                    <span>(${book.rating})</span>
                </div>
                <p class="book-year">${book.year}</p>
                ${availabilityBadge}
                ${book.formats ? `
                    <div class="book-formats">
                        <strong>Formatos:</strong>
                        <div class="format-options">
                            ${book.formats.includes('physical') ? '<span class="format-badge physical">📚 Físico</span>' : ''}
                            ${book.formats.includes('digital') ? '<span class="format-badge digital">💻 Digital</span>' : ''}
                        </div>
                    </div>
                ` : ''}
                <div class="book-actions">
                    ${book.downloadUrl ? `
                        <button class="btn-primary" onclick="handleDownload('${book.id}', '${book.downloadUrl}')">
                            <i class="fas fa-download"></i> Descargar
                        </button>
                    ` : `
                        <button class="btn-primary" onclick="downloadBook(${book.id})" ${!book.available ? 'disabled' : ''}>
                            <i class="fas fa-download"></i> Descargar
                        </button>
                    `}
                    <button class="btn-secondary" onclick="addToFavorites(${book.id})">
                        <i class="fas fa-heart"></i> Favorito
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Crear item de lista
function createBookListItem(book) {
    const stars = generateStars(book.rating);
    return `
        <div class="book-list-item" data-book-id="${book.id}">
            <div class="book-cover-small">
                <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\"fas fa-book\\"></i>'">
            </div>
            <div class="book-info-detailed">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">por ${book.author}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-meta">
                    <span class="book-category">${book.category}</span>
                    <span class="book-year">${book.year}</span>
                    <div class="book-rating">
                        <span class="stars">${stars}</span>
                        <span>(${book.rating})</span>
                    </div>
                </div>
                ${book.formats ? `
                    <div class="book-formats">
                        <strong>Formatos:</strong>
                        <div class="format-options">
                            ${book.formats.includes('physical') ? '<span class="format-badge physical">📚 Físico</span>' : ''}
                            ${book.formats.includes('digital') ? '<span class="format-badge digital">💻 Digital</span>' : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="book-actions">
                ${book.downloadUrl ? `
                    <button class="btn-primary" onclick="handleDownload('${book.id}', '${book.downloadUrl}')">
                        <i class="fas fa-download"></i> Descargar
                    </button>
                ` : `
                    <button class="btn-primary" onclick="downloadBook(${book.id})" ${!book.available ? 'disabled' : ''}>
                        <i class="fas fa-download"></i> Descargar
                    </button>
                `}
                <button class="btn-secondary" onclick="addToFavorites(${book.id})">
                    <i class="fas fa-heart"></i> Favorito
                </button>
            </div>
        </div>
    `;
}

// Generar estrellas
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Cambiar vista
function changeView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`button[onclick="changeView('${view}')"]`).classList.add('active');
    displayBooks();
}

// Cambiar página
function changePage(direction) {
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayBooks();
        updatePagination();
        
        // Scroll hacia el catálogo
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    }
}

// Actualizar paginación
function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Mostrar detalles del libro
function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const modal = document.getElementById('bookModal');
    const detailsDiv = document.getElementById('bookDetails');
    
    detailsDiv.innerHTML = `
        <div class="book-details">
            <div class="book-cover-large">
                <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\"fas fa-book\\"></i>'">
            </div>
            <div class="book-info-detailed">
                <h2>${book.title}</h2>
                <p class="author"><strong>Autor:</strong> ${book.author}</p>
                <p class="category"><strong>Categoría:</strong> ${book.category}</p>
                <p class="type"><strong>Tipo:</strong> ${book.type}</p>
                <p class="year"><strong>Año:</strong> ${book.year}</p>
                <div class="rating">
                    <strong>Calificación:</strong> 
                    <span class="stars">${generateStars(book.rating)}</span>
                    <span>(${book.rating})</span>
                </div>
                <p class="description"><strong>Descripción:</strong> ${book.description}</p>
                <div class="book-actions">
                    <button class="btn-primary" onclick="downloadBook(${book.id})" ${!book.available ? 'disabled' : ''}>
                        <i class="fas fa-download"></i> Descargar
                    </button>
                    <button class="btn-secondary" onclick="addToFavorites(${book.id})">
                        <i class="fas fa-heart"></i> Agregar a Favoritos
                    </button>
                    <button class="btn-secondary" onclick="shareBook(${book.id})">
                        <i class="fas fa-share"></i> Compartir
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Descargar libro
function downloadBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book && book.available) {
        // Simular descarga
        alert(`Descargando "${book.title}"...`);
        // Aquí iría la lógica real de descarga
        console.log(`Downloading book: ${book.title}`);
    }
}

// Manejar descarga de libros con URLs reales
function handleDownload(bookId, downloadUrl) {
    const book = books.find(b => b.id === parseInt(bookId));
    if (!book) {
        alert('Libro no encontrado');
        return;
    }
    
    // Confirmar descarga
    if (confirm(`¿Deseas descargar "${book.title}"?\n\nEsto te llevará al enlace externo de descarga.`)) {
        // Registrar la descarga en el sistema
        const downloadRecord = {
            id: Date.now(),
            bookId: parseInt(bookId),
            userId: currentUser.id,
            downloadDate: new Date().toISOString(),
            downloadUrl: downloadUrl
        };
        
        // Guardar registro de descarga
        const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
        downloads.push(downloadRecord);
        localStorage.setItem('downloads', JSON.stringify(downloads));
        
        // Abrir enlace en nueva pestaña
        window.open(downloadUrl, '_blank');
        
        // Mostrar mensaje de éxito
        showNotification('Descarga iniciada exitosamente', 'success');
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Agregar botón de scroll to top al final del body
document.addEventListener('DOMContentLoaded', () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTop';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    scrollBtn.onclick = scrollToTop;
    document.body.appendChild(scrollBtn);
});

// Función debounce para optimizar búsqueda
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Funciones adicionales para mejorar la experiencia
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mostrar botón de scroll to top
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollToTop');
    if (window.pageYOffset > 300) {
        if (scrollBtn) scrollBtn.style.display = 'block';
    } else {
        if (scrollBtn) scrollBtn.style.display = 'none';
    }
});

// Agregar animaciones de entrada
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animaciones a elementos cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.book-card, .service-card, .stat-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }, 500);
});

// Mostrar historial de préstamos
function displayLoanHistory() {
    const container = document.getElementById('loanHistory');
    
    if (loanHistory.length === 0) {
        container.innerHTML = '<p class="no-loans">No hay historial de préstamos.</p>';
        return;
    }
    
    container.innerHTML = loanHistory.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const statusClass = loan.status === 'returned' ? 'returned' : 'overdue';
        
        return `
            <div class="history-item">
                <div class="history-info">
                    <h4>${book ? book.title : 'Libro no encontrado'}</h4>
                    <p><strong>Código Dewey:</strong> ${book ? book.deweyCode : 'N/A'}</p>
                    <p><strong>Fecha préstamo:</strong> ${loan.loanDate}</p>
                    <p><strong>Fecha devolución:</strong> ${loan.returnDate || 'N/A'}</p>
                    <p><strong>Estado:</strong> <span class="status ${statusClass}">${loan.status.toUpperCase()}</span></p>
                </div>
            </div>
        `;
    }).join('');
}

// Filtrar historial
function filterHistory() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const status = document.getElementById('statusFilter').value;
    
    let filtered = [...loanHistory];
    
    if (dateFrom) {
        filtered = filtered.filter(loan => loan.loanDate >= dateFrom);
    }
    
    if (dateTo) {
        filtered = filtered.filter(loan => loan.loanDate <= dateTo);
    }
    
    if (status) {
        filtered = filtered.filter(loan => loan.status === status);
    }
    
    displayFilteredHistory(filtered);
}

function displayFilteredHistory(filteredHistory) {
    const container = document.getElementById('loanHistory');
    
    if (filteredHistory.length === 0) {
        container.innerHTML = '<p class="no-loans">No se encontraron préstamos con los filtros aplicados.</p>';
        return;
    }
    
    container.innerHTML = filteredHistory.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const statusClass = loan.status === 'returned' ? 'returned' : 'overdue';
        
        return `
            <div class="history-item">
                <div class="history-info">
                    <h4>${book ? book.title : 'Libro no encontrado'}</h4>
                    <p><strong>Código Dewey:</strong> ${book ? book.deweyCode : 'N/A'}</p>
                    <p><strong>Fecha préstamo:</strong> ${loan.loanDate}</p>
                    <p><strong>Fecha devolución:</strong> ${loan.returnDate || 'N/A'}</p>
                    <p><strong>Estado:</strong> <span class="status ${statusClass}">${loan.status.toUpperCase()}</span></p>
                </div>
            </div>
        `;
    }).join('');
}

// Filtrar libros gestionados
function filterManagedBooks() {
    const search = document.getElementById('manageSearch').value.toLowerCase();
    const category = document.getElementById('manageCategory').value;
    
    let filtered = [...books];
    
    if (search) {
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search) ||
            book.deweyCode.toLowerCase().includes(search)
        );
    }
    
    if (category) {
        filtered = filtered.filter(book => book.category === category);
    }
    
    displayFilteredManagedBooks(filtered);
}

function displayFilteredManagedBooks(filteredBooks) {
    const container = document.getElementById('managedBooks');
    
    container.innerHTML = filteredBooks.map(book => `
        <div class="managed-book-item">
            <div class="book-cover-small">
                <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/100x150/ccc/fff?text=No+Image'">
            </div>
            <div class="book-details">
                <h4>${book.title}</h4>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Código Dewey:</strong> ${book.deweyCode}</p>
                <p><strong>Disponibles:</strong> ${book.availableCopies}/${book.totalCopies}</p>
                <p><strong>Ubicación:</strong> ${book.location}</p>
                <p><strong>Préstamos:</strong> ${book.borrowCount}</p>
            </div>
            <div class="book-actions">
                <button onclick="editBook(${book.id})" class="btn-secondary">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deleteBook(${book.id})" class="btn-danger">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Filtrar préstamos en administración
function filterLoansAdmin() {
    const status = document.getElementById('loanStatusFilter').value;
    const date = document.getElementById('loanDateFilter').value;
    
    let filtered = [...loans];
    
    if (status) {
        filtered = filtered.filter(loan => loan.status === status);
    }
    
    if (date) {
        filtered = filtered.filter(loan => loan.loanDate === date);
    }
    
    displayFilteredLoansAdmin(filtered);
}

function displayFilteredLoansAdmin(filteredLoans) {
    const container = document.getElementById('managedLoans');
    
    if (filteredLoans.length === 0) {
        container.innerHTML = '<p class="no-loans">No se encontraron préstamos con los filtros aplicados.</p>';
        return;
    }
    
    container.innerHTML = filteredLoans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const isOverdue = new Date(loan.dueDate) < new Date();
        
        return `
            <div class="managed-loan-item">
                <div class="managed-loan-info">
                    <h4>${book ? book.title : 'Libro no encontrado'}</h4>
                    <p><strong>Estudiante:</strong> ${loan.studentName} (${loan.studentId})</p>
                    <p><strong>Código Dewey:</strong> ${book ? book.deweyCode : 'N/A'}</p>
                    <p><strong>Fecha préstamo:</strong> ${loan.loanDate}</p>
                    <p><strong>Fecha vencimiento:</strong> ${loan.dueDate}</p>
                    <p><strong>Estado:</strong> <span class="status ${loan.status}">${loan.status.toUpperCase()}</span></p>
                    ${isOverdue ? '<p class="overdue-text">¡VENCIDO!</p>' : ''}
                </div>
                <div class="managed-loan-actions">
                    ${loan.status === 'pending' ? 
                        `<button onclick="approveLoan(${loan.id})" class="btn-primary">Aprobar</button>` : ''}
                    ${loan.status === 'active' ? 
                        `<button onclick="markAsReturned(${loan.id})" class="btn-primary">Marcar Devuelto</button>` : ''}
                    <button onclick="deleteLoan(${loan.id})" class="btn-danger">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

// Aprobar préstamo
function approveLoan(loanId) {
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'active';
        saveLoans();
        displayFilteredLoansAdmin(loans);
        updateLoanStats();
        alert('Préstamo aprobado.');
    }
}

// Marcar como devuelto
function markAsReturned(loanId) {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    const book = books.find(b => b.id === loan.bookId);
    if (book) {
        book.availableCopies++;
    }
    
    // Mover al historial
    loanHistory.push({
        ...loan,
        returnDate: new Date().toISOString().split('T')[0],
        status: 'returned'
    });
    
    // Eliminar de préstamos activos
    const index = loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
        loans.splice(index, 1);
    }
    
    saveLoans();
    saveLoanHistory();
    displayFilteredLoansAdmin(loans);
    updateLoanStats();
    
    alert('Préstamo marcado como devuelto.');
}

// Eliminar préstamo
function deleteLoan(loanId) {
    if (confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
        const loan = loans.find(l => l.id === loanId);
        if (loan) {
            const book = books.find(b => b.id === loan.bookId);
            if (book) {
                book.availableCopies++;
            }
        }
        
        const index = loans.findIndex(l => l.id === loanId);
        if (index !== -1) {
            loans.splice(index, 1);
        }
        
        saveLoans();
        displayFilteredLoansAdmin(loans);
        updateLoanStats();
        
        alert('Préstamo eliminado.');
    }
}

// Editar libro
function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Rellenar formulario con datos actuales
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookISBN').value = book.isbn;
    document.getElementById('bookDewey').value = book.deweyCode;
    document.getElementById('bookCategory').value = book.category;
    document.getElementById('bookType').value = book.type;
    document.getElementById('bookYear').value = book.year;
    document.getElementById('bookPages').value = book.pages;
    document.getElementById('bookPublisher').value = book.publisher;
    document.getElementById('bookLanguage').value = book.language;
    document.getElementById('bookCopies').value = book.totalCopies;
    document.getElementById('bookLocation').value = book.location;
    document.getElementById('bookDescription').value = book.description;
    document.getElementById('bookCover').value = book.cover;
    
    // Cambiar a pestaña de agregar libro
    showAdminTab('add-book');
    
    // Scroll a la sección
    document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
    
    // Cambiar texto del botón
    const submitBtn = document.querySelector('#addBookForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Libro';
    
    // Guardar ID para actualización
    document.getElementById('addBookForm').dataset.editId = bookId;
}

// Eliminar libro
function deleteBook(bookId) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        const index = books.findIndex(b => b.id === bookId);
        if (index !== -1) {
            books.splice(index, 1);
            filteredBooks = [...books];
            displayBooks();
            displayManagedBooks();
            
            // Guardar en localStorage
            localStorage.setItem('libraryBooks', JSON.stringify(books));
            
            alert('Libro eliminado exitosamente.');
        }
    }
}

// Generar reportes
function generateReport(type) {
    let reportData = '';
    
    switch (type) {
        case 'monthly':
            reportData = generateMonthlyReport();
            break;
        case 'inventory':
            reportData = generateInventoryReport();
            break;
        case 'overdue':
            reportData = generateOverdueReport();
            break;
    }
    
    // Simular descarga de reporte
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${type}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function generateMonthlyReport() {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const monthlyLoans = loans.filter(loan => {
        const loanDate = new Date(loan.loanDate);
        return loanDate.getMonth() + 1 === currentMonth && loanDate.getFullYear() === currentYear;
    });
    
    let report = `REPORTE MENSUAL DE BIBLIOTECA\n`;
    report += `Mes: ${currentMonth}/${currentYear}\n\n`;
    report += `Total de préstamos: ${monthlyLoans.length}\n`;
    report += `Préstamos activos: ${monthlyLoans.filter(l => l.status === 'active').length}\n`;
    report += `Préstamos vencidos: ${monthlyLoans.filter(l => l.status === 'overdue').length}\n\n`;
    
    report += `DETALLE DE PRÉSTAMOS:\n`;
    monthlyLoans.forEach(loan => {
        const book = books.find(b => b.id === loan.bookId);
        report += `- ${book ? book.title : 'Libro no encontrado'} (${loan.studentName})\n`;
    });
    
    return report;
}

function generateInventoryReport() {
    let report = `REPORTE DE INVENTARIO\n`;
    report += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
    
    books.forEach(book => {
        report += `${book.title}\n`;
        report += `  Código Dewey: ${book.deweyCode}\n`;
        report += `  Autor: ${book.author}\n`;
        report += `  Copias totales: ${book.totalCopies}\n`;
        report += `  Copias disponibles: ${book.availableCopies}\n`;
        report += `  Ubicación: ${book.location}\n`;
        report += `  Préstamos totales: ${book.borrowCount}\n\n`;
    });
    
    return report;
}

function generateOverdueReport() {
    const overdueLoans = loans.filter(loan => 
        loan.status === 'overdue' || 
        (loan.status === 'active' && new Date(loan.dueDate) < new Date())
    );
    
    let report = `REPORTE DE PRÉSTAMOS VENCIDOS\n`;
    report += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
    report += `Total de préstamos vencidos: ${overdueLoans.length}\n\n`;
    
    overdueLoans.forEach(loan => {
        const book = books.find(b => b.id === loan.bookId);
        report += `PRÉSTAMO VENCIDO:\n`;
        report += `  Libro: ${book ? book.title : 'Libro no encontrado'}\n`;
        report += `  Código Dewey: ${book ? book.deweyCode : 'N/A'}\n`;
        report += `  Estudiante: ${loan.studentName} (${loan.studentId})\n`;
        report += `  Fecha préstamo: ${loan.loanDate}\n`;
        report += `  Fecha vencimiento: ${loan.dueDate}\n`;
        report += `  Días de retraso: ${Math.floor((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24))}\n\n`;
    });
    
    return report;
}

// Actualizar configuración de login
function setupModals() {
    // Modal de login
    const loginBtn = document.querySelector('.btn-login');
    const loginModal = document.getElementById('loginModal');
    const bookModal = document.getElementById('bookModal');
    const closeButtons = document.querySelectorAll('.close');
    
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Form de login actualizado
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (login(username, password)) {
            loginModal.style.display = 'none';
            if (isAdminMode) {
                alert('¡Bienvenido administrador!');
            } else {
                alert('¡Bienvenido, ' + username + '!');
            }
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });
}
