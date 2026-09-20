import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useAuth } from "../hooks/useAuth.js";
import { CartContext } from "./cart-context.js";

const MAX_QUANTITY = 99;
const clamp = (quantity) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useLocalStorage(
    `bookstore:cart:${user?.id ?? "guest"}`,
    [],
    Array.isArray
  );

  const addItem = (book, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: clamp(item.quantity + quantity) } : item
        );
      }
      return [...prev, { ...book, quantity: clamp(quantity) }];
    });
  };

  const removeItem = (bookId) => {
    setItems((prev) => prev.filter((item) => item.id !== bookId));
  };

  // Restores an item after a removal, merging into any quantity the user may
  // have already re-added in the meantime rather than silently no-op-ing.
  const restoreItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: clamp(i.quantity + item.quantity) } : i
        );
      }
      return [...prev, item];
    });
  };

  const setQuantity = (bookId, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.id === bookId ? { ...item, quantity: clamp(quantity) } : item))
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, restoreItem, setQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
