import { useLocalStorage } from "./useLocalStorage.js";

// Tracks which out-of-stock books the visitor has asked to be notified about.
// No real backend to actually send that email — this just remembers the
// request locally so the button reflects it was already submitted.
export const useNotifyRequests = () => {
  const [requested, setRequested] = useLocalStorage(
    "bookstore:notify-requests",
    [],
    Array.isArray
  );

  const isRequested = (bookId) => requested.includes(bookId);

  const requestNotify = (bookId) => {
    setRequested((prev) => (prev.includes(bookId) ? prev : [...prev, bookId]));
  };

  return { isRequested, requestNotify };
};
