function Svg({ children, className = "icon", ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconCart({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 5h2l1.2 10.2a1.5 1.5 0 0 0 1.5 1.3h8.8a1.5 1.5 0 0 0 1.5-1.2L21 8H7" />
      <circle cx="9" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.25" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconSearch({ className }) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16.5 4.5 4.5" />
    </Svg>
  );
}

export function IconUser({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.2a7 7 0 0 1 14 0" />
    </Svg>
  );
}

export function IconHeart({ filled = false, className = "icon" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.65-7 9-7 9z" />
    </svg>
  );
}

export function IconMoon({ className }) {
  return (
    <Svg className={className}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5z" />
    </Svg>
  );
}

export function IconSun({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
    </Svg>
  );
}

export function IconMenu({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function IconClose({ className }) {
  return (
    <Svg className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconArrow({ className }) {
  return (
    <Svg className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  );
}

export function IconTruck({ className }) {
  return (
    <Svg className={className}>
      <path d="M3 7h11v8H3zM14 10h4.2L21 13.2V15h-7" />
      <circle cx="7" cy="17.5" r="1.4" />
      <circle cx="17" cy="17.5" r="1.4" />
    </Svg>
  );
}

export function IconShield({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 3 5 6v6c0 4.2 2.8 7.2 7 8.8 4.2-1.6 7-4.6 7-8.8V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

export function IconHeadset({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2zM20 13v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

export function IconTag({ className }) {
  return (
    <Svg className={className}>
      <path d="M3 12V4h8l9 9-8 8-9-9z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconTrash({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="m7 7 1 13h8l1-13" />
    </Svg>
  );
}

export function IconPlane({ className }) {
  return (
    <Svg className={className}>
      <path d="m21 4-7 17-3.2-6.8L4 11z" />
      <path d="M21 4 11 14" />
    </Svg>
  );
}

export function IconCheck({ className }) {
  return (
    <Svg className={className}>
      <path d="m5 12.5 4.2 4.5L19 7" />
    </Svg>
  );
}

export function IconPen({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 20 8.2 18.9 19 8.1 15.9 5 5.1 15.8 4 20z" />
      <path d="m13.8 7.1 3.1 3.1" />
    </Svg>
  );
}

export function IconBook({ className }) {
  return (
    <Svg className={className}>
      <path d="M7 3h11v18H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </Svg>
  );
}

export function IconFlask({ className }) {
  return (
    <Svg className={className}>
      <path d="M9 3h6M10 3v6L5.6 18a2.8 2.8 0 0 0 2.5 4h7.8a2.8 2.8 0 0 0 2.5-4L14 9V3" />
    </Svg>
  );
}

export function IconPalette({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 4a8 8 0 1 0 .2 16H13a2 2 0 0 0 .2-4H12a2.2 2.2 0 0 1-2.2-2.2A5.8 5.8 0 0 1 15.6 8H16" />
      <circle cx="8.2" cy="10" r=".8" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r=".8" fill="currentColor" stroke="none" />
      <circle cx="15.2" cy="9.2" r=".8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconCalc({ className }) {
  return (
    <Svg className={className}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <circle cx="8.5" cy="12" r=".8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="12" r=".8" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="16" r=".8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16" r=".8" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="16" r=".8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconFolder({ className }) {
  return (
    <Svg className={className}>
      <path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </Svg>
  );
}

export function IconClip({ className }) {
  return (
    <Svg className={className}>
      <path d="M8.2 12.6 14.6 6.2a3 3 0 0 1 4.2 4.2l-8 8a4.2 4.2 0 0 1-6-6l7.4-7.4" />
    </Svg>
  );
}

const GLYPHS = {
  "writing-tools": IconPen,
  notebooks: IconBook,
  "lab-records": IconFlask,
  "art-craft": IconPalette,
  calculators: IconCalc,
  "files-folders": IconFolder,
  accessories: IconClip,
};

export function CategoryGlyph({ slug, className = "icon icon-lg" }) {
  const Glyph = GLYPHS[slug] || IconPen;
  return <Glyph className={className} />;
}

export function IconFacebook({ className }) {
  return (
    <Svg className={className} fill="currentColor" stroke="none">
      <path d="M14 8h3V4h-3c-2.2 0-4 1.8-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8c0-.6.4-1 1-1z" />
    </Svg>
  );
}

export function IconInstagram({ className }) {
  return (
    <Svg className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="17.2" cy="6.8" r=".8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconYouTube({ className }) {
  return (
    <Svg className={className}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="m11 10 4 2-4 2z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconLinkedIn({ className }) {
  return (
    <Svg className={className} fill="currentColor" stroke="none">
      <path d="M6.5 9H4V20h2.5zM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H11V9h2.4v1.5c.4-.7 1.4-1.8 3.3-1.8 2.4 0 4.3 1.6 4.3 5.1V20z" />
    </Svg>
  );
}
