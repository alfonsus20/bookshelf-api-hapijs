const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getBooks = (req, h) => {
  const { name, reading, finished } = req.query;

  let allBooks = books;

  if (name !== undefined) {
    allBooks = allBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    if (Number(reading) === 1) {
      allBooks = allBooks.filter((book) => book.reading === true);
    }
    if (Number(reading) === 0) {
      allBooks = allBooks.filter((book) => book.reading === false);
    }
  }

  if (finished !== undefined) {
    if (Number(finished) === 1) {
      allBooks = allBooks.filter((book) => book.finished === true);
    }
    if (Number(finished) === 0) {
      allBooks = allBooks.filter((book) => book.finished === false);
    }
  }

  const returnedBooks = allBooks.map((book) => ({
    id: book.id,
    name:
    book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: returnedBooks,
    },
  });
};

const getBookById = (req, h) => {
  const { id } = req.params;

  const foundBook = books.find((book) => book.id === id);

  if (!foundBook) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: { book: foundBook },
  });
};

const editBook = (req, h) => {
  const { id } = req.params;
  const foundBookIndex = books.findIndex((book) => book.id === id);

  if (foundBookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  books[foundBookIndex] = {
    ...books[foundBookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBook = (req, h) => {
  const { id } = req.params;
  const foundBookIndex = books.findIndex((book) => book.id === id);

  if (foundBookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(foundBookIndex, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

module.exports = {
  addBook, getBooks, getBookById, editBook, deleteBook,
};
