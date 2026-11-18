// Перемикач режиму: true — тестові дані, false — реальний C++ сервер Ангеліни
const USE_MOCK_DATA = true;

// Базова адреса API, про яку домовилися з Backend
const API_BASE_URL = "http://localhost:8080/api/books";

// Функція малює кольорову обкладинку, якщо користувач не вказав своє посилання
function makeCover(title, author, color) {
    const c = document.createElement("canvas");
    c.width = 300;
    c.height = 400;
    const ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 300, 400);
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, 264, 364);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, 150, 180);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "15px Arial";
    ctx.fillText(author, 150, 220);
    return c.toDataURL();
}

// Початковий тестовий список книг
const DEFAULT_MOCK_BOOKS = [
    {
        id: 1,
        title: "Маленький принц",
        author: "Антуан де Сент-Екзюпері",
        genre: "Філософська казка",
        cover: makeCover("Маленький принц", "А. де Сент-Екзюпері", "#1e3a8a"),
        description: "Історія про дружбу, любов і відповідальність."
    },
    {
        id: 2,
        title: "Кобзар",
        author: "Тарас Шевченко",
        genre: "Поезія",
        cover: makeCover("Кобзар", "Тарас Шевченко", "#7c2d12"),
        description: "Збірка поетичних творів видатного українського письменника."
    },
    {
        id: 3,
        title: "1984",
        author: "Джордж Орвелл",
        genre: "Антиутопія",
        cover: makeCover("1984", "Джордж Орвелл", "#111827"),
        description: "Роман-попередження про тоталітарне суспільство та контроль."
    }
];

// Бере збережені тестові книги з пам'яті браузера
function getLocalBooks() {
    const saved = localStorage.getItem("bookworld_mock_books");
    if (saved) {
        return JSON.parse(saved);
    }
    localStorage.setItem("bookworld_mock_books", JSON.stringify(DEFAULT_MOCK_BOOKS));
    return DEFAULT_MOCK_BOOKS;
}

// Зберігає оновлений список тестових книг у пам'ять браузера
function saveLocalBooks(books) {
    localStorage.setItem("bookworld_mock_books", JSON.stringify(books));
}

// 1. Отримати всі книги (GET /api/books)
async function fetchAllBooks() {
    if (USE_MOCK_DATA) {
        return getLocalBooks();
    }
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error("Не вдалося завантажити список книг із сервера");
    }
    return await response.json();
}

// 2. Отримати одну книгу за її id (GET /api/books/{id})
async function fetchBookById(id) {
    if (USE_MOCK_DATA) {
        const books = getLocalBooks();
        return books.find(book => book.id === Number(id)) || null;
    }
    const response = await fetch(API_BASE_URL + "/" + id);
    if (!response.ok) {
        return null;
    }
    return await response.json();
}

// 3. Додати нову книгу (POST /api/books)
async function createBook(bookData) {
    if (USE_MOCK_DATA) {
        const books = getLocalBooks();
        const nextId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
        const newBook = {
            id: nextId,
            title: bookData.title,
            author: bookData.author,
            genre: bookData.genre,
            description: bookData.description,
            cover: bookData.cover || makeCover(bookData.title, bookData.author, "#1e3a8a")
        };
        books.push(newBook);
        saveLocalBooks(books);
        return newBook;
    }
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
    });
    if (!response.ok) {
        throw new Error("Помилка під час додавання книги");
    }
    return await response.json();
// 4. Оновити існуючу книгу (PUT /api/books/{id})
async function updateBook(id, bookData) {
    if (USE_MOCK_DATA) {
        const books = getLocalBooks();
        const index = books.findIndex(b => b.id === Number(id));
        if (index === -1) {
            throw new Error("Книгу для редагування не знайдено");
        }
        const updatedCover = bookData.cover
            ? bookData.cover
            : makeCover(bookData.title, bookData.author, "#1e3a8a");

        books[index] = {
            ...books[index],
            title: bookData.title,
            author: bookData.author,
            genre: bookData.genre,
            description: bookData.description,
            cover: updatedCover
        };
        saveLocalBooks(books);
        return books[index];
    }
    const response = await fetch(API_BASE_URL + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
    });
    if (!response.ok) {
        throw new Error("Помилка під час оновлення книги");
    }
    return await response.json();
}
// 5. Видалити книгу за її id (DELETE /api/books/{id})
async function deleteBook(id) {
    if (USE_MOCK_DATA) {
        const books = getLocalBooks();
        const filtered = books.filter(b => b.id !== Number(id));
        saveLocalBooks(filtered);
        return true;
    }
    const response = await fetch(API_BASE_URL + "/" + id, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Помилка під час видалення книги");
    }
    return true;
}
}