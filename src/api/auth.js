// No backend yet — faking auth locally so the Login/Register flow is usable.
//
// const BASE_URL = "/api/auth";
// export const login = async (credentials) => {
//   const res = await fetch(`${BASE_URL}/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(credentials),
//   });
//   if (!res.ok) throw new Error("Login failed");
//   return res.json();
// };

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async ({ email, password }) => {
  await delay(300);
  if (!email || !password) throw new Error("Email and password are required");
  return { id: email.trim().toLowerCase(), name: email.split("@")[0], email };
};

export const register = async ({ name, email, password }) => {
  await delay(300);
  if (!name || !email || !password) throw new Error("All fields are required");
  return { id: email.trim().toLowerCase(), name, email };
};
