import { IconFacebook, IconInstagram, IconLinkedIn, IconYouTube } from "./Icons";
import Logo from "./Logo";

const SOCIALS = [
  { name: "Facebook", href: "https://www.facebook.com/", Icon: IconFacebook },
  { name: "Instagram", href: "https://www.instagram.com/", Icon: IconInstagram },
  { name: "YouTube", href: "https://www.youtube.com/", Icon: IconYouTube },
  { name: "LinkedIn", href: "https://www.linkedin.com/", Icon: IconLinkedIn },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <Logo />
        <div className="socials">
          {SOCIALS.map(({ name, href, Icon }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
              <Icon />
            </a>
          ))}
        </div>
        <p className="copy">© 2026 CampusCart. All rights reserved.</p>
      </div>
    </footer>
  );
}
