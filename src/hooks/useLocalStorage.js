import { useState, useEffect, useRef } from "react";

const readValue = (key, initialValue, isValid) => {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return initialValue;
    const parsed = JSON.parse(stored);
    return isValid(parsed) ? parsed : initialValue;
  } catch {
    return initialValue;
  }
};

// `isValid` guards against a value that parses as JSON fine but isn't the
// shape the caller expects (a stale schema, manual devtools edit, etc.) —
// without it, consumers like `items.reduce(...)` in Navbar can throw and,
// with no ErrorBoundary in the app, take down the whole page.
export const useLocalStorage = (key, initialValue, isValid = () => true) => {
  const [value, setValue] = useState(() => readValue(key, initialValue, isValid));
  const isFirstRender = useRef(true);

  // Re-read from storage whenever the key itself changes (e.g. cart/wishlist
  // switching from one user's storage to another's after login/logout).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue(readValue(key, initialValue, isValid));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialValue/isValid are often fresh each render; only react to key changes
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — ignore
    }
  }, [key, value]);

  return [value, setValue];
};
