#include "../include/Catalog.h"
#include <iostream>
#include <fstream>
#include <sstream>

void Catalog::loadFromFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cout << "Помилка: не вдалося відкрити файл.\n";
        return;
    }

    books.clear();
    std::string line;
    while (std::getline(file, line)) {
        if (line.empty()) continue;

        std::stringstream ss(line);
        Book book;
        std::getline(ss, book.title, '|');
        std::getline(ss, book.author, '|');
        std::getline(ss, book.genre, '|');
        std::getline(



ss, book.description, '|');

        if (book.title.empty()) continue;

        books.push_back(book);
    }
    file.close();
}

void Catalog::showAllBooks() {
    if (books.empty()) {
        std::cout << "Каталог порожній.\n";
            return;
    }

    std::cout << "\n=== КАТАЛОГ КНИГ BOOKWORLD ===\n";
    int number = 1;
    for (const auto& book : books) {
        std::string g = book.genre;
 







       if (g.empty()) g = "Не вказано";

        std::string d = book.description;
        if (d.empty()) d = "Не вказано";

        std::cout << number++ << ". Назва: " << book.title << "\n"





                  << "   Автор: " << book.author << "\n"
                  << "   Жанр:  " << g << "\n"
                  << "   Опис:  " << d << "\n"
               



   << "---------------------------------\n";
    }
}

int Catalog::getBooksCount() {





    return books.size();
}

bool Catalog::isEmpty() {
 



   return books.empty();

}



