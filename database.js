// Simulación de Base de Datos Relacional para Biblioteca
class LibraryDatabase {
    constructor() {
        this.tables = {
            books: new Map(),
            users: new Map(),
            loans: new Map(),
            categories: new Map(),
            authors: new Map(),
            publishers: new Map(),
            loan_history: new Map(),
            reservations: new Map(),
            reviews: new Map(),
            fines: new Map()
        };
        
        this.indexes = {
            books_by_dewey: new Map(),
            books_by_category: new Map(),
            books_by_author: new Map(),
            books_by_isbn: new Map(),
            loans_by_user: new Map(),
            loans_by_book: new Map(),
            loans_by_status: new Map(),
            users_by_email: new Map(),
            users_by_student_id: new Map()
        };
        
        this.sequences = {
            book_id: 1,
            user_id: 1,
            loan_id: 1,
            author_id: 1,
            publisher_id: 1,
            category_id: 1,
            review_id: 1,
            fine_id: 1
        };
        
        this.initializeDatabase();
    }
    
    // Inicializar base de datos con datos de ejemplo
    initializeDatabase() {
        this.createCategories();
        this.createAuthors();
        this.createPublishers();
        this.createBooks();
        this.createUsers();
        this.createSampleLoans();
        this.loadFromStorage();
    }
    
    // Crear categorías
    createCategories() {
        const categories = [
            { id: 1, name: 'Ciencia', dewey_range: '500-599', description: 'Ciencias naturales y matemáticas' },
            { id: 2, name: 'Literatura', dewey_range: '800-899', description: 'Literatura y retórica' },
            { id: 3, name: 'Historia', dewey_range: '900-999', description: 'Historia y geografía' },
            { id: 4, name: 'Tecnología', dewey_range: '600-699', description: 'Tecnología y ciencias aplicadas' },
            { id: 5, name: 'Medicina', dewey_range: '610-619', description: 'Medicina y salud' },
            { id: 6, name: 'Derecho', dewey_range: '340-349', description: 'Derecho y jurisprudencia' },
            { id: 7, name: 'Filosofía', dewey_range: '100-199', description: 'Filosofía y psicología' },
            { id: 8, name: 'Arte', dewey_range: '700-799', description: 'Arte y recreación' },
            { id: 9, name: 'Matemáticas', dewey_range: '510-519', description: 'Matemáticas puras' },
            { id: 10, name: 'Psicología', dewey_range: '150-159', description: 'Psicología' },
            { id: 11, name: 'Ecología y Sostenibilidad', dewey_range: '577-577.999', description: 'Ecología, sostenibilidad ambiental y ciencias ambientales' }
        ];
        
        categories.forEach(category => {
            this.tables.categories.set(category.id, category);
        });
    }
    
    // Crear autores
    createAuthors() {
        const authors = [
            { id: 1, name: 'Gabriel García Márquez', birth_year: 1927, death_year: 2014, nationality: 'Colombiano' },
            { id: 2, name: 'Isaac Asimov', birth_year: 1920, death_year: 1992, nationality: 'Estadounidense' },
            { id: 3, name: 'Carl Sagan', birth_year: 1934, death_year: 1996, nationality: 'Estadounidense' },
            { id: 4, name: 'Stephen Hawking', birth_year: 1942, death_year: 2018, nationality: 'Británico' },
            { id: 5, name: 'Donald Knuth', birth_year: 1938, death_year: null, nationality: 'Estadounidense' },
            { id: 6, name: 'Robert C. Martin', birth_year: 1952, death_year: null, nationality: 'Estadounidense' },
            { id: 7, name: 'Yuval Noah Harari', birth_year: 1976, death_year: null, nationality: 'Israelí' },
            { id: 8, name: 'Antonio Damasio', birth_year: 1944, death_year: null, nationality: 'Portugués' },
            { id: 9, name: 'Mario Vargas Llosa', birth_year: 1936, death_year: null, nationality: 'Peruano' },
            { id: 10, name: 'Octavio Paz', birth_year: 1914, death_year: 1998, nationality: 'Mexicano' },
            
            // Nuevos autores para libros de sostenibilidad y ecología
            { id: 11, name: 'José Marcelo Torres Ortega', birth_year: null, death_year: null, nationality: 'Colombiano' },
            { id: 12, name: 'Lisbett Liliana Cabrera Pabón', birth_year: null, death_year: null, nationality: 'Venezolano' },
            { id: 13, name: 'Rafael Tomás-Cardoso', birth_year: null, death_year: null, nationality: 'Español' },
            { id: 14, name: 'Muhammad Zahid Rafique', birth_year: null, death_year: null, nationality: 'Pakistaní' },
            { id: 15, name: 'Shafique Ur Rehman', birth_year: null, death_year: null, nationality: 'Pakistaní' },
            { id: 16, name: 'Sahar Afshan', birth_year: null, death_year: null, nationality: 'Pakistaní' },
            { id: 17, name: 'Muntasir Murshed', birth_year: null, death_year: null, nationality: 'Bangladesí' },
            { id: 18, name: 'Abiael Alexis Illescas-Cobos', birth_year: null, death_year: null, nationality: 'Peruano' },
            { id: 19, name: 'Sughra Hakim', birth_year: null, death_year: null, nationality: 'Pakistaní' },
            { id: 20, name: 'Peter Pál Pelbart', birth_year: null, death_year: null, nationality: 'Brasileño' },
            { id: 21, name: 'Jhon Holguin-Alvarez', birth_year: null, death_year: null, nationality: 'Peruano' },
            { id: 22, name: 'García Valencia, Isabel Salvadora', birth_year: null, death_year: null, nationality: 'Español' },
            { id: 23, name: 'Elena Sierra Rubio', birth_year: null, death_year: null, nationality: 'Español' }
        ];
        
        authors.forEach(author => {
            this.tables.authors.set(author.id, author);
        });
    }
    
    // Crear editoriales
    createPublishers() {
        const publishers = [
            { id: 1, name: 'Penguin Random House', country: 'Estados Unidos', founded: 1927 },
            { id: 2, name: 'Pearson Education', country: 'Reino Unido', founded: 1844 },
            { id: 3, name: 'McGraw-Hill', country: 'Estados Unidos', founded: 1888 },
            { id: 4, name: 'Planeta', country: 'España', founded: 1949 },
            { id: 5, name: 'Anagrama', country: 'España', founded: 1969 },
            { id: 6, name: 'Fondo de Cultura Económica', country: 'México', founded: 1934 },
            { id: 7, name: 'Crítica', country: 'España', founded: 1976 },
            { id: 8, name: 'Addison-Wesley', country: 'Estados Unidos', founded: 1942 },
            { id: 9, name: 'MIT Press', country: 'Estados Unidos', founded: 1962 },
            { id: 10, name: 'Debate', country: 'España', founded: 1970 },
            
            // Nuevas editoriales para publicaciones académicas
            { id: 11, name: 'Revista Interdisciplinaria', country: 'Colombia', founded: 2015 },
            { id: 12, name: 'Journal UVM', country: 'Venezuela', founded: 2010 },
            { id: 13, name: 'Revista UCM', country: 'España', founded: 1990 },
            { id: 14, name: 'Springer', country: 'Alemania', founded: 1842 },
            { id: 15, name: 'Emerald Publishing', country: 'Reino Unido', founded: 1967 },
            { id: 16, name: 'Elsevier', country: 'Países Bajos', founded: 1880 },
            { id: 17, name: 'Nature Publishing Group', country: 'Reino Unido', founded: 1869 },
            { id: 18, name: 'PUCP Press', country: 'Perú', founded: 1974 },
            { id: 19, name: 'Frontiers Media', country: 'Suiza', founded: 2007 },
            { id: 20, name: 'Redalyc', country: 'México', founded: 2003 },
            { id: 21, name: 'Universidad Wiener', country: 'Perú', founded: 1996 },
            { id: 22, name: 'Universidad de Jaén', country: 'España', founded: 1993 },
            { id: 23, name: 'CIEGC', country: 'Venezuela', founded: 2018 }
        ];
        
        publishers.forEach(publisher => {
            this.tables.publishers.set(publisher.id, publisher);
        });
    }
    
    // Crear libros con relaciones (expandiendo la colección)
    createBooks() {
        const books = [
            // Libros originales
            {
                id: 1,
                title: 'Cien años de soledad',
                author_id: 1,
                publisher_id: 4,
                category_id: 2,
                isbn: '978-84-376-0494-7',
                dewey_code: '863.64 GAR',
                publication_year: 1967,
                pages: 471,
                language: 'Español',
                total_copies: 5,
                available_copies: 3,
                location: 'Piso 2, Estante L-15',
                description: 'Obra maestra del realismo mágico que narra la historia de la familia Buendía.',
                cover_url: 'https://images.cdn1.buscalibre.com/fit-in/360x360/61/8d/618d227e8967274cd9589a549adff52d.jpg',
                created_at: '2024-01-15',
                updated_at: '2024-01-15',
                status: 'active',
                rating: 4.8,
                borrow_count: 147,
                type: 'libro',
                format: 'physical',
                download_url: null
            },
            {
                id: 2,
                title: 'Fundación',
                author_id: 2,
                publisher_id: 1,
                category_id: 1,
                isbn: '978-84-96208-18-4',
                dewey_code: '813.54 ASI',
                publication_year: 1951,
                pages: 320,
                language: 'Español',
                total_copies: 4,
                available_copies: 2,
                location: 'Piso 1, Estante F-08',
                description: 'Primera novela de la serie Fundación sobre el futuro de la humanidad.',
                cover_url: 'https://images.cdn2.buscalibre.com/fit-in/360x360/c2/7c/c27c3d7f8e8c2f4a6b7d8e9f0a1b2c3d.jpg',
                created_at: '2024-01-15',
                updated_at: '2024-01-15',
                status: 'active',
                rating: 4.6,
                borrow_count: 89,
                type: 'libro',
                format: 'physical',
                download_url: null
            },
            {
                id: 3,
                title: 'Cosmos',
                author_id: 3,
                publisher_id: 1,
                category_id: 1,
                isbn: '978-84-01-32287-4',
                dewey_code: '523.1 SAG',
                publication_year: 1980,
                pages: 528,
                language: 'Español',
                total_copies: 6,
                available_copies: 4,
                location: 'Piso 3, Estante C-12',
                description: 'Viaje fascinante por el universo y la ciencia.',
                cover_url: 'https://images.cdn3.buscalibre.com/fit-in/360x360/d3/8e/d38e4f9g0h1i2j3k4l5m6n7o8p9q0r1s.jpg',
                created_at: '2024-01-15',
                updated_at: '2024-01-15',
                status: 'active',
                rating: 4.7,
                borrow_count: 156,
                type: 'libro',
                format: 'physical',
                download_url: null
            },
            {
                id: 4,
                title: 'Breve historia del tiempo',
                author_id: 4,
                publisher_id: 7,
                category_id: 1,
                isbn: '978-84-08-06944-0',
                dewey_code: '523.1 HAW',
                publication_year: 1988,
                pages: 256,
                language: 'Español',
                total_copies: 3,
                available_copies: 1,
                location: 'Piso 3, Estante C-14',
                description: 'Explicación accesible de la cosmología moderna.',
                cover_url: 'https://images.cdn4.buscalibre.com/fit-in/360x360/e4/9f/e49f5g0h1i2j3k4l5m6n7o8p9q0r1s2t.jpg',
                created_at: '2024-01-15',
                updated_at: '2024-01-15',
                status: 'active',
                rating: 4.5,
                borrow_count: 203,
                type: 'libro',
                format: 'physical',
                download_url: null
            },
            {
                id: 5,
                title: 'El Arte de Programar',
                author_id: 5,
                publisher_id: 8,
                category_id: 4,
                isbn: '978-0-201-89683-1',
                dewey_code: '004.678 KNU',
                publication_year: 1968,
                pages: 634,
                language: 'Español',
                total_copies: 2,
                available_copies: 1,
                location: 'Piso 1, Estante T-05',
                description: 'Obra fundamental sobre algoritmos y programación.',
                cover_url: 'https://images.cdn5.buscalibre.com/fit-in/360x360/f5/0a/f50a6h1i2j3k4l5m6n7o8p9q0r1s2t3u.jpg',
                created_at: '2024-01-15',
                updated_at: '2024-01-15',
                status: 'active',
                rating: 4.9,
                borrow_count: 78,
                type: 'libro',
                format: 'physical',
                download_url: null
            },
            
            // Nuevos libros académicos sobre sostenibilidad y ecología
            {
                id: 6,
                title: 'Educación y Ecología: modelos de sostenibilidad en instituciones de Educación Superior',
                author_id: 11,
                publisher_id: 11,
                category_id: 11,
                isbn: null,
                dewey_code: '378.013 TOR',
                publication_year: 2024,
                pages: null,
                language: 'Español',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-01',
                description: 'Modelos de sostenibilidad aplicados en instituciones de educación superior, abordando la integración de la ecología en los procesos educativos.',
                cover_url: 'https://via.placeholder.com/300x400/2e8b57/fff?text=Educación+y+Ecología',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.3,
                borrow_count: 12,
                type: 'articulo',
                format: 'both',
                download_url: 'https://revistainterdisciplinaria.com/index.php/home/article/view/29',
                license: 'open_access'
            },
            {
                id: 7,
                title: 'Sostenibilidad y desarrollo, en armonía con la naturaleza',
                author_id: 12,
                publisher_id: 12,
                category_id: 11,
                isbn: null,
                dewey_code: '304.2 CAB',
                publication_year: 2022,
                pages: null,
                language: 'Español',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-02',
                description: 'Análisis sobre la sostenibilidad y el desarrollo sostenible en armonía con la naturaleza.',
                cover_url: 'https://via.placeholder.com/300x400/228b22/fff?text=Sostenibilidad+y+Desarrollo',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.1,
                borrow_count: 8,
                type: 'articulo',
                format: 'both',
                download_url: 'https://journal.uvm.edu.ve/index.php/momboy/article/view/75',
                license: 'open_access'
            },
            {
                id: 8,
                title: 'Aproximaciones socioecológicas en torno a la Sostenibilidad: Economía, Ecología, Evolución y Comportamiento Proambiental Humano',
                author_id: 13,
                publisher_id: 13,
                category_id: 11,
                isbn: null,
                dewey_code: '304.2 TOM',
                publication_year: 2024,
                pages: null,
                language: 'Español',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-03',
                description: 'Estudio interdisciplinario sobre sostenibilidad que abarca economía, ecología, evolución y comportamiento humano proambiental.',
                cover_url: 'https://via.placeholder.com/300x400/32cd32/fff?text=Aproximaciones+Socioecológicas',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.5,
                borrow_count: 15,
                type: 'articulo',
                format: 'both',
                download_url: 'https://revistas.ucm.es/index.php/OBMD/article/view/99729',
                license: 'open_access'
            },
            {
                id: 9,
                title: 'Does economic complexity matter for environmental sustainability? Using ecological footprint as an indicator',
                author_id: 14,
                publisher_id: 14,
                category_id: 11,
                isbn: null,
                dewey_code: '333.7 RAF',
                publication_year: 2021,
                pages: null,
                language: 'Inglés',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-04',
                description: 'Investigación sobre la complejidad económica y la sostenibilidad ambiental utilizando la huella ecológica como indicador.',
                cover_url: 'https://via.placeholder.com/300x400/006400/fff?text=Economic+Complexity',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.2,
                borrow_count: 22,
                type: 'articulo',
                format: 'both',
                download_url: 'https://link.springer.com/article/10.1007/s10668-021-01625-4',
                license: 'open_access'
            },
            {
                id: 10,
                title: 'The role of environmental management control systems for ecological sustainability and sustainable performance',
                author_id: 15,
                publisher_id: 15,
                category_id: 11,
                isbn: null,
                dewey_code: '658.408 REH',
                publication_year: 2021,
                pages: null,
                language: 'Inglés',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-05',
                description: 'El papel de los sistemas de control de gestión ambiental para la sostenibilidad ecológica y el rendimiento sostenible.',
                cover_url: 'https://via.placeholder.com/300x400/8fbc8f/fff?text=Environmental+Management',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.4,
                borrow_count: 18,
                type: 'articulo',
                format: 'both',
                download_url: 'https://www.emerald.com/insight/content/doi/10.1108/md-06-2020-0800/full/html',
                license: 'open_access'
            },
            {
                id: 11,
                title: 'Facilitating renewable energy transition, ecological innovations and stringent environmental policies to improve ecological sustainability',
                author_id: 16,
                publisher_id: 16,
                category_id: 11,
                isbn: null,
                dewey_code: '333.794 AFS',
                publication_year: 2022,
                pages: null,
                language: 'Inglés',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-06',
                description: 'Facilitando la transición hacia energías renovables, innovaciones ecológicas y políticas ambientales estrictas para mejorar la sostenibilidad ecológica.',
                cover_url: 'https://via.placeholder.com/300x400/20b2aa/fff?text=Renewable+Energy',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.3,
                borrow_count: 25,
                type: 'articulo',
                format: 'both',
                download_url: 'https://www.sciencedirect.com/science/article/pii/S096014812200965X?casa_token=Jyhe_Dxi2UoAAAAA:upDW9OobcyafmcztgcXaFuh9UPCr59f8kavc94GgpZ6nW_JnNMNRGCUlB-8Mr62-AMbT0bKeBJo',
                license: 'open_access'
            },
            {
                id: 12,
                title: 'The nexus between environmental regulations, economic growth, and environmental sustainability',
                author_id: 17,
                publisher_id: 17,
                category_id: 11,
                isbn: null,
                dewey_code: '333.7 MUR',
                publication_year: 2021,
                pages: null,
                language: 'Inglés',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-07',
                description: 'El nexo entre las regulaciones ambientales, el crecimiento económico y la sostenibilidad ambiental, vinculando las patentes ambientales con la reducción de la huella ecológica en el sur de Asia.',
                cover_url: 'https://via.placeholder.com/300x400/4682b4/fff?text=Environmental+Regulations',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.6,
                borrow_count: 31,
                type: 'articulo',
                format: 'both',
                download_url: 'https://link.springer.com/article/10.1007/s11356-021-13381-z',
                license: 'open_access'
            },
            {
                id: 13,
                title: 'Las ciencias ambientales interdisciplinarias del presente y futuro: Ecología aplicada, Biología integrativa y Ecología integral',
                author_id: 18,
                publisher_id: 18,
                category_id: 11,
                isbn: null,
                dewey_code: '577 ILL',
                publication_year: 2025,
                pages: null,
                language: 'Español',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-08',
                description: 'Las ciencias ambientales interdisciplinarias del presente y futuro, abarcando ecología aplicada, biología integrativa y ecología integral.',
                cover_url: 'https://via.placeholder.com/300x400/800080/fff?text=Ciencias+Ambientales',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.7,
                borrow_count: 9,
                type: 'articulo',
                format: 'both',
                download_url: 'https://revistas.pucp.edu.pe/index.php/Kawsaypacha/article/view/29373',
                license: 'open_access'
            },
            {
                id: 14,
                title: 'Rhizosphere Engineering With Plant Growth-Promoting Microorganisms for Agriculture and Ecological Sustainability',
                author_id: 19,
                publisher_id: 19,
                category_id: 11,
                isbn: null,
                dewey_code: '630.2 HAK',
                publication_year: 2021,
                pages: null,
                language: 'Inglés',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-09',
                description: 'Ingeniería de rizosfera con microorganismos promotores del crecimiento vegetal para la agricultura y sostenibilidad ecológica.',
                cover_url: 'https://via.placeholder.com/300x400/ff6347/fff?text=Rhizosphere+Engineering',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.4,
                borrow_count: 14,
                type: 'articulo',
                format: 'both',
                download_url: 'https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2021.617157/full',
                license: 'open_access'
            },
            {
                id: 15,
                title: 'Ecologia do virtual',
                author_id: 20,
                publisher_id: 20,
                category_id: 11,
                isbn: null,
                dewey_code: '577 PEL',
                publication_year: 2023,
                pages: null,
                language: 'Portugués',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-10',
                description: 'Ecología de lo virtual, explorando las dimensiones virtuales de la ecología contemporánea.',
                cover_url: 'https://via.placeholder.com/300x400/dc143c/fff?text=Ecologia+Virtual',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.2,
                borrow_count: 7,
                type: 'articulo',
                format: 'both',
                download_url: 'https://www.redalyc.org/journal/6733/673377571014/',
                license: 'open_access'
            },
            {
                id: 16,
                title: 'Ecología robótica desde el litoral: resultados de un programa fortalecedor de las habilidades para la ciencia',
                author_id: 21,
                publisher_id: 21,
                category_id: 11,
                isbn: null,
                dewey_code: '577.6 HOL',
                publication_year: 2023,
                pages: null,
                language: 'Español',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-11',
                description: 'Ecología robótica desde el litoral, presentando resultados de un programa fortalecedor de las habilidades para la ciencia.',
                cover_url: 'https://via.placeholder.com/300x400/00ced1/fff?text=Ecología+Robótica',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.1,
                borrow_count: 11,
                type: 'articulo',
                format: 'both',
                download_url: 'https://repositorio.uwiener.edu.pe/server/api/core/bitstreams/2976032b-f734-485e-99fc-9f9157917ecb/content',
                license: 'open_access'
            },
            {
                id: 17,
                title: 'Conciencia ambiental: ecología, sostenibilidad y dinámica de ecosistemas',
                author_id: 22,
                publisher_id: 22,
                category_id: 11,
                isbn: null,
                dewey_code: '577.27 GAR',
                publication_year: 2024,
                pages: null,
                language: 'Español',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-12',
                description: 'Conciencia ambiental enfocada en ecología, sostenibilidad y dinámica de ecosistemas.',
                cover_url: 'https://via.placeholder.com/300x400/9370db/fff?text=Conciencia+Ambiental',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.3,
                borrow_count: 13,
                type: 'articulo',
                format: 'both',
                download_url: 'https://crea.ujaen.es/items/df0db3f3-1f06-4dc8-8283-225a4133abb5',
                license: 'open_access'
            },
            {
                id: 18,
                title: 'Educar para la sostenibilidad: una mirada desde la ecología socioemocional',
                author_id: 23,
                publisher_id: 23,
                category_id: 11,
                isbn: null,
                dewey_code: '370.115 SIE',
                publication_year: 2022,
                pages: null,
                language: 'Español',
                total_copies: 1,
                available_copies: 1,
                location: 'Piso 2, Estante ECO-13',
                description: 'Educar para la sostenibilidad desde una perspectiva de ecología socioemocional.',
                cover_url: 'https://via.placeholder.com/300x400/ff1493/fff?text=Educar+Sostenibilidad',
                created_at: '2024-07-15',
                updated_at: '2024-07-15',
                status: 'active',
                rating: 4.4,
                borrow_count: 16,
                type: 'articulo',
                format: 'both',
                download_url: 'https://ciegc.org.ve/wp-content/uploads/2023/01/sostenibilidad.pdf#page=212',
                license: 'open_access'
            }
        ];
        
        books.forEach(book => {
            this.tables.books.set(book.id, book);
            this.buildIndexes(book);
        });
    }
    
    // Crear usuarios del sistema
    createUsers() {
        const users = [
            {
                id: 1,
                student_id: 'ADM001',
                name: 'Administrador Sistema',
                email: 'admin@bibliouji.edu',
                password: 'admin123',
                role: 'admin',
                faculty: 'Sistemas',
                active: true,
                created_at: '2024-01-01',
                last_login: '2024-12-15'
            },
            {
                id: 2,
                student_id: '20231001',
                name: 'Ana García López',
                email: 'ana.garcia@estudiantes.edu',
                password: 'student123',
                role: 'student',
                faculty: 'Ingeniería',
                active: true,
                created_at: '2024-01-10',
                last_login: '2024-12-14'
            },
            {
                id: 3,
                student_id: '20231002',
                name: 'Carlos Rodríguez Pérez',
                email: 'carlos.rodriguez@estudiantes.edu',
                password: 'student123',
                role: 'student',
                faculty: 'Medicina',
                active: true,
                created_at: '2024-01-12',
                last_login: '2024-12-13'
            },
            {
                id: 4,
                student_id: 'PROF001',
                name: 'Dr. María Fernández',
                email: 'maria.fernandez@profesores.edu',
                password: 'professor123',
                role: 'professor',
                faculty: 'Ciencias',
                active: true,
                created_at: '2024-01-05',
                last_login: '2024-12-15'
            }
        ];
        
        users.forEach(user => {
            this.tables.users.set(user.id, user);
            this.indexes.users_by_email.set(user.email, user.id);
            this.indexes.users_by_student_id.set(user.student_id, user.id);
        });
    }
    
    // Crear préstamos de ejemplo
    createSampleLoans() {
        const loans = [
            {
                id: 1,
                book_id: 1,
                user_id: 2,
                loan_date: '2024-12-01',
                due_date: '2024-12-15',
                return_date: null,
                status: 'active',
                renewals: 0,
                notes: 'Préstamo regular'
            },
            {
                id: 2,
                book_id: 4,
                user_id: 3,
                loan_date: '2024-11-20',
                due_date: '2024-12-04',
                return_date: null,
                status: 'overdue',
                renewals: 1,
                notes: 'Préstamo vencido'
            },
            {
                id: 3,
                book_id: 2,
                user_id: 4,
                loan_date: '2024-12-10',
                due_date: '2024-12-24',
                return_date: null,
                status: 'active',
                renewals: 0,
                notes: 'Préstamo profesor'
            }
        ];
        
        loans.forEach(loan => {
            this.tables.loans.set(loan.id, loan);
            this.buildLoanIndexes(loan);
        });
    }
    
    // Construir índices para libros
    buildIndexes(book) {
        // Índice por código Dewey
        this.indexes.books_by_dewey.set(book.dewey_code, book.id);
        
        // Índice por categoría
        if (!this.indexes.books_by_category.has(book.category_id)) {
            this.indexes.books_by_category.set(book.category_id, new Set());
        }
        this.indexes.books_by_category.get(book.category_id).add(book.id);
        
        // Índice por autor
        if (!this.indexes.books_by_author.has(book.author_id)) {
            this.indexes.books_by_author.set(book.author_id, new Set());
        }
        this.indexes.books_by_author.get(book.author_id).add(book.id);
        
        // Índice por ISBN
        if (book.isbn) {
            this.indexes.books_by_isbn.set(book.isbn, book.id);
        }
    }
    
    // Construir índices para préstamos
    buildLoanIndexes(loan) {
        // Índice por usuario
        if (!this.indexes.loans_by_user.has(loan.user_id)) {
            this.indexes.loans_by_user.set(loan.user_id, new Set());
        }
        this.indexes.loans_by_user.get(loan.user_id).add(loan.id);
        
        // Índice por libro
        if (!this.indexes.loans_by_book.has(loan.book_id)) {
            this.indexes.loans_by_book.set(loan.book_id, new Set());
        }
        this.indexes.loans_by_book.get(loan.book_id).add(loan.id);
        
        // Índice por estado
        if (!this.indexes.loans_by_status.has(loan.status)) {
            this.indexes.loans_by_status.set(loan.status, new Set());
        }
        this.indexes.loans_by_status.get(loan.status).add(loan.id);
    }
    
    // Métodos de consulta tipo SQL
    
    // SELECT * FROM books WHERE condition
    selectBooks(condition = null, orderBy = null, limit = null) {
        let results = Array.from(this.tables.books.values());
        
        if (condition) {
            results = results.filter(condition);
        }
        
        if (orderBy) {
            results.sort(orderBy);
        }
        
        if (limit) {
            results = results.slice(0, limit);
        }
        
        return results;
    }
    
    // SELECT * FROM books JOIN authors ON books.author_id = authors.id
    selectBooksWithAuthors(condition = null) {
        const results = [];
        
        for (const book of this.tables.books.values()) {
            const author = this.tables.authors.get(book.author_id);
            const category = this.tables.categories.get(book.category_id);
            const publisher = this.tables.publishers.get(book.publisher_id);
            
            const enrichedBook = {
                ...book,
                author: author,
                category: category,
                publisher: publisher
            };
            
            if (!condition || condition(enrichedBook)) {
                results.push(enrichedBook);
            }
        }
        
        return results;
    }
    
    // SELECT * FROM loans JOIN books ON loans.book_id = books.id JOIN users ON loans.user_id = users.id
    selectLoansWithDetails(condition = null) {
        const results = [];
        
        for (const loan of this.tables.loans.values()) {
            const book = this.tables.books.get(loan.book_id);
            const user = this.tables.users.get(loan.user_id);
            const author = book ? this.tables.authors.get(book.author_id) : null;
            
            const enrichedLoan = {
                ...loan,
                book: book,
                user: user,
                author: author
            };
            
            if (!condition || condition(enrichedLoan)) {
                results.push(enrichedLoan);
            }
        }
        
        return results;
    }
    
    // Búsqueda con índices (más eficiente)
    findBooksByCategory(categoryId) {
        const bookIds = this.indexes.books_by_category.get(categoryId);
        if (!bookIds) return [];
        
        return Array.from(bookIds).map(id => this.tables.books.get(id));
    }
    
    findBooksByAuthor(authorId) {
        const bookIds = this.indexes.books_by_author.get(authorId);
        if (!bookIds) return [];
        
        return Array.from(bookIds).map(id => this.tables.books.get(id));
    }
    
    findBookByDewey(deweyCode) {
        const bookId = this.indexes.books_by_dewey.get(deweyCode);
        return bookId ? this.tables.books.get(bookId) : null;
    }
    
    findBookByISBN(isbn) {
        const bookId = this.indexes.books_by_isbn.get(isbn);
        return bookId ? this.tables.books.get(bookId) : null;
    }
    
    findLoansByUser(userId) {
        const loanIds = this.indexes.loans_by_user.get(userId);
        if (!loanIds) return [];
        
        return Array.from(loanIds).map(id => this.tables.loans.get(id));
    }
    
    findLoansByStatus(status) {
        const loanIds = this.indexes.loans_by_status.get(status);
        if (!loanIds) return [];
        
        return Array.from(loanIds).map(id => this.tables.loans.get(id));
    }
    
    // Búsqueda de texto completo
    searchBooks(query) {
        const searchTerm = query.toLowerCase();
        const results = [];
        
        for (const book of this.tables.books.values()) {
            const author = this.tables.authors.get(book.author_id);
            const category = this.tables.categories.get(book.category_id);
            
            const searchableText = [
                book.title,
                author?.name || '',
                book.dewey_code,
                book.isbn || '',
                category?.name || '',
                book.description || ''
            ].join(' ').toLowerCase();
            
            if (searchableText.includes(searchTerm)) {
                results.push({
                    ...book,
                    author: author,
                    category: category,
                    relevance: this.calculateRelevance(searchableText, searchTerm)
                });
            }
        }
        
        return results.sort((a, b) => b.relevance - a.relevance);
    }
    
    // Calcular relevancia de búsqueda
    calculateRelevance(text, searchTerm) {
        const occurrences = (text.match(new RegExp(searchTerm, 'g')) || []).length;
        const position = text.indexOf(searchTerm);
        
        // Más relevante si aparece al principio y múltiples veces
        return occurrences * 10 + (position === 0 ? 100 : 50 - position);
    }
    
    // Operaciones CRUD
    
    // INSERT INTO books
    insertBook(bookData) {
        const id = this.sequences.book_id++;
        const book = {
            id,
            ...bookData,
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString().split('T')[0],
            status: 'active',
            rating: 0,
            borrow_count: 0
        };
        
        this.tables.books.set(id, book);
        this.buildIndexes(book);
        this.saveToStorage();
        
        return book;
    }
    
    // UPDATE books SET ... WHERE id = ?
    updateBook(id, updateData) {
        const book = this.tables.books.get(id);
        if (!book) return null;
        
        const updatedBook = {
            ...book,
            ...updateData,
            updated_at: new Date().toISOString().split('T')[0]
        };
        
        this.tables.books.set(id, updatedBook);
        this.buildIndexes(updatedBook);
        this.saveToStorage();
        
        return updatedBook;
    }
    
    // DELETE FROM books WHERE id = ?
    deleteBook(id) {
        const book = this.tables.books.get(id);
        if (!book) return false;
        
        // Verificar si hay préstamos activos
        const activeLoans = this.findLoansByStatus('active').filter(loan => loan.book_id === id);
        if (activeLoans.length > 0) {
            throw new Error('No se puede eliminar el libro porque tiene préstamos activos');
        }
        
        this.tables.books.delete(id);
        this.removeFromIndexes(book);
        this.saveToStorage();
        
        return true;
    }
    
    // Crear préstamo
    createLoan(loanData) {
        const id = this.sequences.loan_id++;
        const loan = {
            id,
            ...loanData,
            status: 'active',
            renewals: 0,
            created_at: new Date().toISOString()
        };
        
        this.tables.loans.set(id, loan);
        this.buildLoanIndexes(loan);
        
        // Actualizar copias disponibles
        const book = this.tables.books.get(loan.book_id);
        if (book && book.available_copies > 0) {
            book.available_copies--;
            book.borrow_count++;
        }
        
        this.saveToStorage();
        return loan;
    }
    
    // Devolver libro
    returnBook(loanId) {
        const loan = this.tables.loans.get(loanId);
        if (!loan) return null;
        
        loan.return_date = new Date().toISOString().split('T')[0];
        loan.status = 'returned';
        
        // Actualizar copias disponibles
        const book = this.tables.books.get(loan.book_id);
        if (book) {
            book.available_copies++;
        }
        
        // Mover al historial
        this.tables.loan_history.set(loanId, {...loan});
        this.tables.loans.delete(loanId);
        
        this.saveToStorage();
        return loan;
    }
    
    // Estadísticas y reportes
    getStatistics() {
        const totalBooks = this.tables.books.size;
        const totalUsers = this.tables.users.size;
        const activeLoans = this.findLoansByStatus('active').length;
        const overdueLoans = this.findLoansByStatus('overdue').length;
        
        const booksByCategory = new Map();
        for (const book of this.tables.books.values()) {
            const category = this.tables.categories.get(book.category_id);
            const categoryName = category ? category.name : 'Sin categoría';
            booksByCategory.set(categoryName, (booksByCategory.get(categoryName) || 0) + 1);
        }
        
        return {
            totalBooks,
            totalUsers,
            activeLoans,
            overdueLoans,
            booksByCategory: Object.fromEntries(booksByCategory)
        };
    }
    
    // Guardar en localStorage
    saveToStorage() {
        const data = {
            tables: {},
            indexes: {},
            sequences: this.sequences
        };
        
        // Convertir Maps a Objects para JSON
        for (const [tableName, table] of Object.entries(this.tables)) {
            data.tables[tableName] = Object.fromEntries(table);
        }
        
        localStorage.setItem('libraryDatabase', JSON.stringify(data));
    }
    
    // Cargar desde localStorage
    loadFromStorage() {
        const stored = localStorage.getItem('libraryDatabase');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                
                // Restaurar sequences
                if (data.sequences) {
                    this.sequences = data.sequences;
                }
                
                // Restaurar tables
                if (data.tables) {
                    for (const [tableName, tableData] of Object.entries(data.tables)) {
                        if (this.tables[tableName]) {
                            this.tables[tableName] = new Map(Object.entries(tableData));
                        }
                    }
                }
                
                // Reconstruir índices
                this.rebuildAllIndexes();
                
            } catch (error) {
                console.error('Error cargando base de datos:', error);
            }
        }
    }
    
    // Reconstruir todos los índices
    rebuildAllIndexes() {
        // Limpiar índices
        for (const index of Object.values(this.indexes)) {
            index.clear();
        }
        
        // Reconstruir índices de libros
        for (const book of this.tables.books.values()) {
            this.buildIndexes(book);
        }
        
        // Reconstruir índices de préstamos
        for (const loan of this.tables.loans.values()) {
            this.buildLoanIndexes(loan);
        }
        
        // Reconstruir índices de usuarios
        for (const user of this.tables.users.values()) {
            this.indexes.users_by_email.set(user.email, user.id);
            this.indexes.users_by_student_id.set(user.student_id, user.id);
        }
    }
    
    // Limpiar índices cuando se elimina un registro
    removeFromIndexes(book) {
        this.indexes.books_by_dewey.delete(book.dewey_code);
        
        if (this.indexes.books_by_category.has(book.category_id)) {
            this.indexes.books_by_category.get(book.category_id).delete(book.id);
        }
        
        if (this.indexes.books_by_author.has(book.author_id)) {
            this.indexes.books_by_author.get(book.author_id).delete(book.id);
        }
        
        if (book.isbn) {
            this.indexes.books_by_isbn.delete(book.isbn);
        }
    }
    
    // Método para exportar datos
    exportData() {
        const data = {
            books: Array.from(this.tables.books.values()),
            authors: Array.from(this.tables.authors.values()),
            categories: Array.from(this.tables.categories.values()),
            publishers: Array.from(this.tables.publishers.values()),
            users: Array.from(this.tables.users.values()),
            loans: Array.from(this.tables.loans.values()),
            loan_history: Array.from(this.tables.loan_history.values())
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    // Método para importar datos
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Importar cada tabla
            for (const [tableName, records] of Object.entries(data)) {
                if (this.tables[tableName]) {
                    this.tables[tableName].clear();
                    records.forEach(record => {
                        this.tables[tableName].set(record.id, record);
                    });
                }
            }
            
            // Reconstruir índices
            this.rebuildAllIndexes();
            this.saveToStorage();
            
            return true;
        } catch (error) {
            console.error('Error importando datos:', error);
            return false;
        }
    }
}

// Instancia global de la base de datos
const libraryDB = new LibraryDatabase();

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LibraryDatabase;
}
