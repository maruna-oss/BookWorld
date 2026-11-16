const USE_MOCK_DATA = true;
const API_BASE_URL = "http://localhost:8080/api/books";

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

const MOCK_BOOKS = [
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

 async function fetchAllBooks() {
    if (USE_MOCK_DATA) {
        return MOCK_BOOKS;
    }
    const response = await fetch(API_BASE_URL);
    return await response.json();
}
async function fetchBookById(id) {
    if (USE_MOCK_DATA) {
        return MOCK_BOOKS.find(book => book.id === Number(id)) || null;
    }
    const response = await fetch(API_BASE_URL + "/" + id);
    if (!response.ok) return null;
    return await response.json();
}