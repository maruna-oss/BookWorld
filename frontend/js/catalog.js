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

// Перевіряє, чи безпечне посилання на обкладинку
function isValidCoverUrl(url) {
    if (!url || typeof url !== "string") return false;
    return ["http://", "https://", "data:image/"].some(p => url.startsWith(p));
}

// Безпечно створює картки книг через DOM-елементи (захист від лапок і HTML-коду)
function renderBooks(books) {
    booksContainer.innerHTML = "";

    if (books.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Книг за вашим запитом не знайдено.";
        booksContainer.appendChild(emptyMsg);
        return;
    }

    books.forEach(function (book) {
        const card = document.createElement("div");
        card.className = "book-card";

        const infoDiv = document.createElement("div");

        if (isValidCoverUrl(book.cover)) {
            const img = document.createElement("img");
            img.src = book.cover;
            img.alt = book.title;
            img.className = "book-cover";
            infoDiv.appendChild(img);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "book-cover-placeholder";
            placeholder.textContent = "📖";
            infoDiv.appendChild(placeholder);
        }

        const h3 = document.createElement("h3");
        h3.textContent = book.title;
        infoDiv.appendChild(h3);

        const authorP = document.createElement("p");
        authorP.className = "book-author";
        authorP.textContent = book.author;
        infoDiv.appendChild(authorP);

        const genreSpan = document.createElement("span");
        genreSpan.className = "genre-badge";
        genreSpan.textContent = book.genre ? book.genre : "Не вказано";
        infoDiv.appendChild(genreSpan);

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "card-actions";

        const detailsLink = document.createElement("a");
        detailsLink.href = "book.html?id=" + encodeURIComponent(book.id);
        detailsLink.className = "btn";
        detailsLink.style.textAlign = "center";
        detailsLink.textContent = "Детальніше";
        actionsDiv.appendChild(detailsLink);

        const rowDiv = document.createElement("div");
        rowDiv.className = "card-actions-row";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-secondary";
        editBtn.textContent = "Редагувати";
        editBtn.addEventListener("click", function () {
            startEditBook(book.id);
        });
        rowDiv.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-danger";
        deleteBtn.textContent = "Видалити";
        deleteBtn.addEventListener("click", function () {
            handleDeleteBook(book.id);
        });
        rowDiv.appendChild(deleteBtn);

        actionsDiv.appendChild(rowDiv);
        card.appendChild(infoDiv);
        card.appendChild(actionsDiv);
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

// Перезавантажує список книг із обробкою помилок мережі (try...catch)
async function refreshCatalog() {
    try {
        allBooks = await fetchAllBooks();
        populateGenres(allBooks);
        filterBooks();
    } catch (error) {
        booksContainer.innerHTML = "";
        const errP = document.createElement("p");
        errP.textContent = "Не вдалося завантажити каталог книг. Перевірте підключення до сервера.";
        booksContainer.appendChild(errP);
        showMessage("Помилка мережі: сервер недоступний.", true);
    }
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