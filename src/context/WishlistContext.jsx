import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useAuth } from "../hooks/useAuth.js";
import { WishlistContext } from "./wishlist-context.js";

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useLocalStorage(
    `bookstore:wishlist:${user?.id ?? "guest"}`,
    [],
    Array.isArray
  );

  const isWishlisted = (bookId) => items.some((item) => item.id === bookId);

  const toggleWishlist = (book) => {
    setItems((prev) =>
      prev.some((item) => item.id === book.id)
        ? prev.filter((item) => item.id !== book.id)
        : [...prev, book]
    );
  };

  const removeItem = (bookId) => {
    setItems((prev) => prev.filter((item) => item.id !== bookId));
  };

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
};
