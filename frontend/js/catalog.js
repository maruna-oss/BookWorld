// Глобальний масив усіх книг у каталозі
let allBooks = [];

// Знаходимо потрібні елементи на сторінці за їхніми id
const booksContainer = document.getElementById("books-container");
const searchInput = document.getElementById("search-input");
const genreSelect = document.getElementById("genre-select");
const statusMessage = document.getElementById("status-message");

// Елементи форми додавання та редагування
const bookForm = document.getElementById("book-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const bookIdInput = document.getElementById("book-id");
const titleInput = document.getElementById("book-title");
const authorInput = document.getElementById("book-author");
const genreInput = document.getElementById("book-genre");
const coverInput = document.getElementById("book-cover");
const descriptionInput = document.getElementById("book-description");

// Показує зелене або червоне повідомлення користувачу на 4 секунди
function showMessage(text, isError) {
    statusMessage.textContent = text;
    statusMessage.className = isError
        ? "status-message status-error"
        : "status-message status-success";
    setTimeout(function () {
        statusMessage.className = "status-message";
    }, 4000);
}

// Малює картки книг на сторінці
function renderBooks(books) {
    booksContainer.innerHTML = "";

    if (books.length === 0) {
        booksContainer.innerHTML = "<p>Книг за вашим запитом не знайдено.</p>";
        return;
    }

    books.forEach(function (book) {
        const card = document.createElement("div");
        card.className = "book-card";
        const genreText = book.genre ? book.genre : "Не вказано";
        const coverHtml = book.cover
            ? "<img src=\"" + book.cover + "\" alt='" + book.title + "' class='book-cover'>"
            : "<div class='book-cover-placeholder'>📖</div>";

        card.innerHTML =
            "<div>" +
                coverHtml +
                "<h3>" + book.title + "</h3>" +
                "<p class='book-author'>" + book.author + "</p>" +
                "<span class='genre-badge'>" + genreText + "</span>" +
            "</div>" +
            "<div class='card-actions'>" +
                "<a href='book.html?id=" + book.id + "' class='btn' style='text-align: center;'>Детальніше</a>" +
                "<div class='card-actions-row'>" +
                    "<button type='button' class='btn btn-secondary' onclick='startEditBook(" + book.id + ")'>Редагувати</button>" +
                    "<button type='button' class='btn btn-danger' onclick='handleDeleteBook(" + book.id + ")'>Видалити</button>" +
                "</div>" +
            "</div>";
        booksContainer.appendChild(card);
    });
}
// Оновлює випадаючий список жанрів без дублікатів
function populateGenres(books) {
    genreSelect.innerHTML = "<option value='all'>Усі жанри</option>";
    const genres = [...new Set(books.map(function (b) { return b.genre; }).filter(Boolean))];
    genres.forEach(function (genre) {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

// Живий пошук за назвою/автором та фільтр за жанром
function filterBooks() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreSelect.value;

    const filtered = allBooks.filter(function (book) {
        const matchesSearch =
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query);
        const matchesGenre =
            selectedGenre === "all" || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    renderBooks(filtered);
}

// Заповнює форму даними обраної книги для редагування
function startEditBook(id) {
    const book = allBooks.find(function (b) { return b.id === id; });
    if (!book) return;

    bookIdInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    genreInput.value = book.genre || "";
    coverInput.value = book.cover && !book.cover.startsWith("data:") ? book.cover : "";
    descriptionInput.value = book.description || "";

    formTitle.textContent = "Редагувати книгу";
    submitBtn.textContent = "Зберегти зміни";
    cancelBtn.style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Скидає форму назад у режим додавання нової книги
function resetForm() {
    bookForm.reset();
    bookIdInput.value = "";
    formTitle.textContent = "Додати нову книгу";
    submitBtn.textContent = "Додати книгу";
    cancelBtn.style.display = "none";
}

// Обробляє натискання кнопки "Додати книгу" або "Зберегти зміни"
async function handleFormSubmit(event) {
    event.preventDefault();

    const bookData = {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        genre: genreInput.value.trim(),
        cover: coverInput.value.trim(),
        description: descriptionInput.value.trim()
    };

    if (!bookData.title || !bookData.author) {
        showMessage("Помилка: вкажіть назву книги та автора.", true);
        return;
    }

    try {
        const editId = bookIdInput.value;
        if (editId) {
            await updateBook(editId, bookData);
            showMessage("Книгу успішно оновлено!", false);
        } else {
            await createBook(bookData);
            showMessage("Нову книгу успішно додано до каталогу!", false);
        }
        resetForm();
        await refreshCatalog();
    } catch (error) {
        showMessage("Помилка: " + error.message, true);
    }
}

// Видаляє книгу після підтвердження користувача
async function handleDeleteBook(id) {
    if (!confirm("Ви впевнені, що хочете видалити цю книгу?")) {
        return;
    }
    try {
        await deleteBook(id);
        showMessage("Книгу видалено з каталогу.", false);
        await refreshCatalog();
    } catch (error) {
        showMessage("Помилка: " + error.message, true);
    }
}

// Перезавантажує актуальний список книг і оновлює сторінку
async function refreshCatalog() {
    allBooks = await fetchAllBooks();
    populateGenres(allBooks);
    filterBooks();
}

// Запуск усіх обробників при відкритті сторінки
async function initCatalog() {
    await refreshCatalog();
    searchInput.addEventListener("input", filterBooks);
    genreSelect.addEventListener("change", filterBooks);
    bookForm.addEventListener("submit", handleFormSubmit);
    cancelBtn.addEventListener("click", resetForm);
}

initCatalog();