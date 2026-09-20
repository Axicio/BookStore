export const PROMO_CODES = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  WELCOME5: { type: "flat", value: 5, label: "$5 off" },
};

export const getDiscount = (code, subtotal) => {
  const promo = PROMO_CODES[code?.trim().toUpperCase()];
  if (!promo) return null;

  const amount =
    promo.type === "percent"
      ? Math.round(subtotal * (promo.value / 100) * 100) / 100
      : Math.min(promo.value, subtotal);

  return { code: code.trim().toUpperCase(), label: promo.label, amount };
};
