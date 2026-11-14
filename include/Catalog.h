#ifndef CATALOG_H
#define CATALOG_H

#include <vector>
#include <string>
#include "Book.h"

class Catalog {
private:
    std::vector<Book> books;

public:
    void loadFromFile(const std::string& filename);
    void showAllBooks();
    int getBooksCount();
    bool isEmpty();
};

#endif
