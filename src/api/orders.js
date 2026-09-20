// No backend yet — faking order creation/storage using localStorage.

const STORAGE_KEY = "bookstore:orders";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readOrders = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeOrders = (orders) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // localStorage unavailable — order still returns to the caller, just isn't persisted
  }
};

export const createOrder = async (order) => {
  await delay(400);
  const newOrder = {
    id: crypto.randomUUID(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
    ...order,
  };
  writeOrders([newOrder, ...readOrders()]);
  return newOrder;
};

export const getOrders = async (userId) => {
  await delay(300);
  const orders = readOrders();
  return userId ? orders.filter((order) => order.userId === userId) : orders;
};
