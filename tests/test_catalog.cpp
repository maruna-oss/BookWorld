#include <iostream>
#include <fstream>
#include <cassert>
#include <windows.h>
#include "../include/Catalog.h"

void testLoadValidFile() {
    Catalog catalog;
    catalog.loadFromFile("data/books.txt");
    assert(catalog.getBooksCount() == 3);
    assert(catalog.isEmpty() == false);
    std::cout << "[OK] Тест 1 і 2 (Позитивні): завантажено 3 книги з робочого файлу.\n";
}

void testLoadNonExistentFile() {
    Catalog catalog;
    catalog.loadFromFile("data/no_such_file.txt");
    assert(catalog.getBooksCount() == 0);
    assert(catalog.isEmpty() == true);
    std::cout << "[OK] Тест 3 (Негативний): неіснуючий файл оброблено коректно.\n";
}



void testLoadEmptyFile() {
    std::ofstream tempFile("data/empty_test.txt");
    tempFile.close();

    Catalog catalog;
    catalog.loadFromFile("data/empty_test.txt");
    assert(catalog.isEmpty() == true);
    assert(catalog.getBooksCount() == 0);

    std::remove("data/empty_test.txt");











    std::cout << "[OK] Тест 4 (Негативний): порожній файл оброблено коректно.\n";
}

int main() {
    SetConsoleOutputCP(65001);
    std::cout << "=== ЗАПУСК АВТОМАТИЗОВАНИХ ТЕСТІВ BOOKWORLD ===\n\n";

    testLoadValidFile();
    testLoadNonExistentFile();
    testLoadEmptyFile();











    std::cout << "\nУсі 4 тести успішно пройдено!\n";
    return 0;

}

