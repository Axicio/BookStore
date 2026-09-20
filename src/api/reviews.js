import { mockReviews } from "./mockData.js";

const STORAGE_KEY = "bookstore:reviews";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

const readLocalReviews = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeLocalReviews = (reviewsByBook) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsByBook));
  } catch {
    // localStorage unavailable — review still returns to the caller, just isn't persisted
  }
};

export const getReviews = async (bookId) => {
  await delay(250);
  const seeded = mockReviews[bookId] ?? [];
  const added = readLocalReviews()[bookId] ?? [];
  return [...added, ...seeded].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const addReview = async (bookId, { author, rating, comment }) => {
  await delay(300);
  if (!author || !rating || !comment) throw new Error("Please fill in all fields");

  const newReview = {
    id: crypto.randomUUID(),
    author,
    rating,
    comment,
    date: new Date().toISOString(),
  };

  const all = readLocalReviews();
  all[bookId] = [newReview, ...(all[bookId] ?? [])];
  writeLocalReviews(all);

  return newReview;
};
