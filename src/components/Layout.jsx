import { Outlet } from "react-router-dom";
import AuthModal from "./AuthModal";
import Footer from "./Footer";
import Header from "./Header";
import ScrollManager from "./ScrollManager";
import Toaster from "./Toaster";

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <Toaster />
    </>
  );
}
