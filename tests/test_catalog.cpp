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
    std::cout << "[OK] Тест 1 і 2: завантажено 3 книги.\n";
}

void testLoadNonExistentFile() {
    Catalog catalog;
    catalog.loadFromFile("data/no_such_file.txt");
    assert(catalog.getBooksCount() == 0);
    std::cout << "[OK] Тест 3: неіснуючий файл оброблено.\n";
}

void testLoadEmptyFile() {
    std::ofstream f("data/empty_test.txt");
    f.close();
    Catalog catalog;
    catalog.loadFromFile("data/empty_test.txt");
    assert(catalog.isEmpty() == true);
    std::remove("data/empty_test.txt");
    std::cout << "[OK] Тест 4: порожній файл оброблено.\n";
}

void testBrokenLineWithoutTitle() {
    std::ofstream f("data/broken_test.txt");
    f << "|||\n";
    f << "|Автор без назви|Жанр|Опис\n";
    f.close();
 








   Catalog catalog;
    catalog.loadFromFile("data/broken_test.txt");
    assert(catalog.getBooksCount() == 0);
    std::remove("data/broken_test.txt");
    std::cout << "[OK] Тест 5 (Issue #3): пошкоджені рядки ігноруються.\n";
}






int main() {
    SetConsoleOutputCP(65001);
    std::cout << "=== ПОВТОРНЕ ТЕСТУВАННЯ BOOKWORLD ===\n\n";
    testLoadValidFile();






    testLoadNonExistentFile();
    testLoadEmptyFile();
    testBrokenLineWithoutTitle();
    std::cout << "\nУсі 5 тестів успішно пройдено!\n";
 



   return 0;

}



