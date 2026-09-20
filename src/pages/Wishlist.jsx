import { useWishlist } from "../hooks/useWishlist.js";
import { useCart } from "../hooks/useCart.js";
import { useNotification } from "../hooks/useNotification.js";
import BookGrid from "../components/BookGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";

const Wishlist = () => {
  const { items } = useWishlist();
  const { addItem } = useCart();
  const { notify } = useNotification();

  const handleAddToCart = (book) => {
    addItem(book);
    notify(`Added "${book.title}" to cart`);
  };

  if (!items.length) {
    return (
      <EmptyState
        icon="bi-heart"
        title="Your Wishlist is Empty"
        message="Tap the heart on any book to save it here."
        actionLabel="Browse Books"
      />
    );
  }

  return (
    <div>
      <h1 className="mb-4">Your Wishlist</h1>
      <BookGrid books={items} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default Wishlist;
