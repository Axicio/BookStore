import { useLocation } from "react-router-dom";

const TopLoadingBar = () => {
  const location = useLocation();
  return <div key={location.pathname} className="top-loading-bar no-print" />;
};

export default TopLoadingBar;
