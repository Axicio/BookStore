// No backend yet — faking the contact form submission locally.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendMessage = async ({ name, email, subject, message }) => {
  await delay(400);
  if (!name || !email || !message)
    throw new Error("Please fill in all required fields");
  return { id: crypto.randomUUID(), status: "received", subject };
};
