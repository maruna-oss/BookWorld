let allBooks = [];

const booksContainer = document.getElementById("books-container");
const searchInput = document.getElementById("search-input");
const genreSelect = document.getElementById("genre-select");

function renderBooks(books) {
    booksContainer.innerHTML = "";

    if (books.length === 0) {
        booksContainer.innerHTML = "<p>Книг за вашим запитом не знайдено.</p>";
        return;
    }

  books.forEach(book => {
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
            "<a href='book.html?id=" + book.id + "' class='btn' style='text-align: center;'>Детальніше</a>";
        booksContainer.appendChild(card);
    });
}

function populateGenres(books) {
    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))];
    genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

function filterBooks() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreSelect.value;

    const filtered = allBooks.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query);
        const matchesGenre =
            selectedGenre === "all" || book.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    renderBooks(filtered);
}

async function initCatalog() {
    allBooks = await fetchAllBooks();
    populateGenres(allBooks);
    renderBooks(allBooks);

    searchInput.addEventListener("input", filterBooks);
    genreSelect.addEventListener("change", filterBooks);
}

initCatalog();