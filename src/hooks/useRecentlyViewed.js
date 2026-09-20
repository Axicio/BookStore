import { useLocalStorage } from "./useLocalStorage.js";

const MAX_RECENT = 8;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage(
    "bookstore:recently-viewed",
    [],
    Array.isArray
  );

  const addRecentlyViewed = (book) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((b) => b.id !== book.id);
      return [book, ...filtered].slice(0, MAX_RECENT);
    });
  };

  return { recentlyViewed, addRecentlyViewed };
};
