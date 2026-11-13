#include <iostream>
#include <windows.h>
#include "../include/Catalog.h"

int main() {
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);

    Catalog catalog;
    catalog.loadFromFile("data/books.txt");

    int choice = 0;
    while (true) {
        std::cout << "\n--- Вітаємо у BookWorld ---\n";
        std::cout << "1. Переглянути каталог книг\n";
        std::cout << "0. Вихід\n";
        std::cout << "Оберіть дію: ";
        std::cin >> choice;

        if (choice == 1) {
            catalog.showAllBooks();
        } else if (choice == 0) {
            std::cout << "Роботу завершено. До зустрічі!\n";
            break;
        } else {
            std::cout << "Невірний вибір. Спробуйте ще раз.\n";
        }
    }

    return 0;

}

