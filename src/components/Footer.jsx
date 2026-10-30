import { Link } from "react-router-dom";
import { IconFacebook, IconInstagram, IconLinkedIn, IconYouTube } from "./Icons";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <Logo />
        <div>
          <nav className="footer-links" aria-label="Footer">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/about">About</Link>
            <Link to="/about#contact">Contact</Link>
          </nav>
          <div className="socials" aria-hidden="true">
            <span><IconFacebook /></span>
            <span><IconInstagram /></span>
            <span><IconYouTube /></span>
            <span><IconLinkedIn /></span>
          </div>
        </div>
        <p className="copy">© 2026 CampusCart. All rights reserved.</p>
      </div>
    </footer>
  );
}
