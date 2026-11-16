async function loadBookDetails() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    const container = document.getElementById("book-details");

    if (!bookId) {
        container.innerHTML = "<p>Помилка: не вказано ідентифікатор книги.</p>";
        return;
    }

    const book = await fetchBookById(bookId);

    if (!book) {
        container.innerHTML = "<p>Книгу не знайдено.</p>";
        return;
    }

    const genreText = book.genre ? book.genre : "Не вказано";
    const descText = book.description ? book.description : "Опис відсутній.";
    const coverHtml = book.cover
        ? "<img src=\"" + book.cover + "\" alt='" + book.title + "' class='book-cover' style='max-width: 240px; height: 300px;'>"
        : "<div class='book-cover-placeholder' style='max-width: 240px; height: 220px;'>📖</div>";

    container.innerHTML =
        coverHtml +
        "<h1 style='color: #172a45; margin-bottom: 8px;'>" + book.title + "</h1>" +
        "<p style='font-size: 18px; color: #4b5563; margin-bottom: 14px;'><strong>Автор:</strong> " + book.author + "</p>" +
        "<span class='genre-badge'>" + genreText + "</span>" +
        "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;'>" +
        "<h3 style='color: #172a45; margin-bottom: 8px;'>Опис книги</h3>" +
        "<p style='color: #374151; font-size: 16px;'>" + descText + "</p>";
}

loadBookDetails();