// Variables globales
let books = [];
let currentPage = 1;
let booksPerPage = 12;
let filteredBooks = [];
let currentView = 'grid';

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    setupEventListeners();
    setupNavigation();
});

// Cargar libros desde data.json
async function loadBooks() {
    try {
        const response = await fetch('data.json');
        books = await response.json();
        filteredBooks = [...books];
        displayBooks();
        updatePagination();
    } catch (error) {
        console.error('Error loading books:', error);
        // Datos de ejemplo si no se puede cargar el archivo
        books = generateSampleBooks();
        filteredBooks = [...books];
        displayBooks();
        updatePagination();
    }
}

// Generar libros de ejemplo
function generateSampleBooks() {
    return [
        {
            id: 1,
            title: "Introducción a la Programación",
            author: "Juan Pérez",
            category: "tecnologia",
            type: "libro",
            year: 2023,
            rating: 4.5,
            description: "Un libro completo sobre los fundamentos de la programación.",
            cover: "https://via.placeholder.com/200x300/667eea/ffffff?text=Programación",
            available: true
        },
        {
            id: 2,
            title: "Historia del Arte",
            author: "María García",
            category: "historia",
            type: "libro",
            year: 2022,
            rating: 4.8,
            description: "Un recorrido completo por la historia del arte mundial.",
            cover: "https://via.placeholder.com/200x300/764ba2/ffffff?text=Arte",
            available: true
        },
        {
            id: 3,
            title: "Química Orgánica",
            author: "Dr. Carlos López",
            category: "ciencia",
            type: "libro",
            year: 2024,
            rating: 4.2,
            description: "Principios fundamentales de la química orgánica.",
            cover: "https://via.placeholder.com/200x300/e74c3c/ffffff?text=Química",
            available: false
        },
        {
            id: 4,
            title: "Cien Años de Soledad",
            author: "Gabriel García Márquez",
            category: "literatura",
            type: "libro",
            year: 1967,
            rating: 4.9,
            description: "La obra maestra del realismo mágico.",
            cover: "https://via.placeholder.com/200x300/27ae60/ffffff?text=Literatura",
            available: true
        },
        {
            id: 5,
            title: "Anatomía Humana",
            author: "Dra. Ana Rodríguez",
            category: "medicina",
            type: "libro",
            year: 2023,
            rating: 4.6,
            description: "Atlas completo de anatomía humana.",
            cover: "https://via.placeholder.com/200x300/3498db/ffffff?text=Medicina",
            available: true
        },
        {
            id: 6,
            title: "Derecho Constitucional",
            author: "Prof. Luis Martínez",
            category: "derecho",
            type: "libro",
            year: 2022,
            rating: 4.3,
            description: "Principios básicos del derecho constitucional.",
            cover: "https://via.placeholder.com/200x300/f39c12/ffffff?text=Derecho",
            available: true
        },
        {
            id: 7,
            title: "Revista de Ciencia Moderna",
            author: "Varios Autores",
            category: "ciencia",
            type: "revista",
            year: 2024,
            rating: 4.4,
            description: "Últimos avances en ciencia y tecnología.",
            cover: "https://via.placeholder.com/200x300/9b59b6/ffffff?text=Revista",
            available: true
        },
        {
            id: 8,
            title: "Inteligencia Artificial",
            author: "Dr. Roberto Silva",
            category: "tecnologia",
            type: "libro",
            year: 2024,
            rating: 4.7,
            description: "Conceptos avanzados de inteligencia artificial.",
            cover: "https://via.placeholder.com/200x300/1abc9c/ffffff?text=IA",
            available: true
        }
    ];
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    document.getElementById('searchInput').addEventListener('input', debounce(searchBooks, 300));
    document.getElementById('categoryFilter').addEventListener('change', searchBooks);
    document.getElementById('typeFilter').addEventListener('change', searchBooks);
    
    // Ordenamiento
    document.getElementById('sortBy').addEventListener('change', sortBooks);
    
    // Modales
    setupModals();
    
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
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
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
                <div class="book-actions">
                    <button class="btn-primary" onclick="downloadBook(${book.id})" ${!book.available ? 'disabled' : ''}>
                        <i class="fas fa-download"></i> Descargar
                    </button>
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
            </div>
            <div class="book-actions">
                <button class="btn-primary" onclick="downloadBook(${book.id})" ${!book.available ? 'disabled' : ''}>
                    <i class="fas fa-download"></i> Descargar
                </button>
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
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
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
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
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

// Agregar a favoritos
function addToFavorites(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        // Simular agregar a favoritos
        alert(`"${book.title}" agregado a favoritos`);
        // Aquí iría la lógica real de favoritos
        console.log(`Added to favorites: ${book.title}`);
    }
}

// Compartir libro
function shareBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        if (navigator.share) {
            navigator.share({
                title: book.title,
                text: `Mira este libro: ${book.title} por ${book.author}`,
                url: window.location.href
            });
        } else {
            // Fallback para navegadores que no soportan Web Share API
            const shareText = `Mira este libro: ${book.title} por ${book.author} - ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('¡Enlace copiado al portapapeles!');
            });
        }
    }
}

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
