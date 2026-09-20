import { mockBooks, categories } from "./mockData.js";

// No backend yet — serving mock data with a simulated delay.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getBooks = async () => {
  await delay(300);
  return mockBooks;
};

export const getBookById = async (bookId) => {
  await delay(300);
  const book = mockBooks.find((b) => b.id === bookId);
  if (!book) throw new Error("Book not found");
  return book;
};

export const getRelatedBooks = async (bookId, category, limit = 4) => {
  await delay(200);
  return mockBooks
    .filter((b) => b.category === category && b.id !== bookId)
    .slice(0, limit);
};

export const getCategories = () => categories;
