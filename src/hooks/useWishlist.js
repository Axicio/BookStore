import { useContext } from "react";
import { WishlistContext } from "../context/wishlist-context.js";

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};
