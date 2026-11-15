#include <iostream>
#include <string>
#include <windows.h>
#include "../include/Catalog.h"

int main() {
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);

    Catalog catalog;
    catalog.loadFromFile("data/books.txt");

    std::string choice;
    while (true) {
        std::cout << "\n--- Вітаємо у BookWorld ---\n";
        std::cout << "1. Переглянути каталог книг\n";
        std::cout << "0. Вихід\n";
        std::cout << "Оберіть дію: ";
        std::getline(std::cin, choice);

        if (choice ==

 "1") {
            catalog.showAllBooks();
        } else if (choice == "0") {
            std::cout << "Роботу завершено.\n";
            break;
        } else {
            std::cout << "Невірний вибір.\n";
        }
    }

    return 0;

}

