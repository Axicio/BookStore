const CATEGORY_BADGE_CLASSES = {
  Programming: "badge-cat-programming",
  Fiction: "badge-cat-fiction",
  Fantasy: "badge-cat-fantasy",
  "Sci-Fi": "badge-cat-sci-fi",
  "Non-Fiction": "badge-cat-non-fiction",
  Biography: "badge-cat-biography",
  Mystery: "badge-cat-mystery",
  Romance: "badge-cat-romance",
};

const CATEGORY_ICONS = {
  Programming: "bi-code-slash",
  Fiction: "bi-book",
  Fantasy: "bi-stars",
  "Sci-Fi": "bi-rocket-takeoff",
  "Non-Fiction": "bi-journal-text",
  Biography: "bi-person-badge",
  Mystery: "bi-search",
  Romance: "bi-heart",
};

export const getCategoryBadgeClass = (category) =>
  CATEGORY_BADGE_CLASSES[category] ?? "badge-cat-programming";

export const getCategoryIcon = (category) => CATEGORY_ICONS[category] ?? "bi-tag";
