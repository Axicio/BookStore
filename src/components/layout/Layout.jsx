import { Outlet } from "react-router-dom";
import AppNavbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import FloatingContactButton from "../FloatingContactButton.jsx";
import TopLoadingBar from "../TopLoadingBar.jsx";

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <TopLoadingBar />
      <AppNavbar />
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingContactButton />
    </div>
  );
};

export default Layout;
