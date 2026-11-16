const USE_MOCK_DATA = true;
const API_BASE_URL = "http://localhost:8080/api/books";

const MOCK_BOOKS = [
    {
        id: 1,
        title: "Маленький принц",
        author: "Антуан де Сент-Екзюпері",
        genre: "Філософська казка",
        description: "Історія про дружбу, любов і відповідальність."
    },
    {
        id: 2,
        title: "Кобзар",
        author: "Тарас Шевченко",
        genre: "Поезія",
        description: "Збірка поетичних творів видатного українського письменника."
    },
    {
        id: 3,
        title: "1984",
        author: "Джордж Орвелл",
        genre: "Антиутопія",
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