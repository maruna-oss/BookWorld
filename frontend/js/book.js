// Перевіряє, чи є посилання безпечним URL або згенерованою картинкою
function isValidCoverUrl(url) {
    if (!url || typeof url !== "string") return false;
   return ["http://", "https://", "data:image/"].some(p => url.startsWith(p));
}

async function loadBookDetails() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    const container = document.getElementById("book-details");

    if (!bookId) {
        container.textContent = "Помилка: не вказано ідентифікатор книги.";
        return;
    }

    try {
        const book = await fetchBookById(bookId);

        if (!book) {
            container.textContent = "Книгу не знайдено.";
            return;
        }

        container.innerHTML = "";

        if (isValidCoverUrl(book.cover)) {
            const img = document.createElement("img");
            img.src = book.cover;
            img.alt = book.title;
            img.className = "book-cover";
            img.style.maxWidth = "240px";
            img.style.height = "300px";
            container.appendChild(img);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "book-cover-placeholder";
            placeholder.style.maxWidth = "240px";
            placeholder.style.height = "220px";
            placeholder.textContent = "📖";
            container.appendChild(placeholder);
        }

        const titleEl = document.createElement("h1");
        titleEl.style.color = "#172a45";
        titleEl.style.marginBottom = "8px";
        titleEl.textContent = book.title;
        container.appendChild(titleEl);

        const authorEl = document.createElement("p");
        authorEl.style.fontSize = "18px";
        authorEl.style.color = "#4b5563";
        authorEl.style.marginBottom = "14px";
        const strongEl = document.createElement("strong");
        strongEl.textContent = "Автор: ";
        authorEl.appendChild(strongEl);
        authorEl.appendChild(document.createTextNode(book.author));
        container.appendChild(authorEl);

        const genreEl = document.createElement("span");
        genreEl.className = "genre-badge";
        genreEl.textContent = book.genre ? book.genre : "Не вказано";
        container.appendChild(genreEl);

        const hrEl = document.createElement("hr");
        hrEl.style.border = "none";
        hrEl.style.borderTop = "1px solid #e5e7eb";
        hrEl.style.margin = "16px 0";
        container.appendChild(hrEl);

        const descHeading = document.createElement("h3");
        descHeading.style.color = "#172a45";
        descHeading.style.marginBottom = "8px";
        descHeading.textContent = "Опис книги";
        container.appendChild(descHeading);

        const descEl = document.createElement("p");
        descEl.style.color = "#374151";
        descEl.style.fontSize = "16px";
        descEl.textContent = book.description ? book.description : "Опис відсутній.";
        container.appendChild(descEl);
    } catch (error) {
        container.textContent = "Помилка завантаження книги: сервер недоступний.";
    }
}

loadBookDetails();