import styles from "./Footer.module.css";

// The four dropdown headings at the top of the footer.
const menus = ["Z App", "For businesses", "About Z", "Rewards and promotions"];

// Social media icons (orange circles in public/icons).
const socials = [
  { name: "Facebook", icon: "/icons/facebook.png" },
  { name: "Instagram", icon: "/icons/instagram.png" },
  { name: "LinkedIn", icon: "/icons/linkedin.png" },
  { name: "TikTok", icon: "/icons/tiktok.png" },
];

// Small links near the bottom.
const legalLinks = [
  "Privacy",
  "Terms of use",
  "Fuel and Store Products Safety",
  "Investor relations",
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* 1. Dropdown menus.
          <details> opens and closes by itself, no JavaScript needed.
          TODO: add the links that go inside each menu. */}
      <nav aria-label="Footer">
        {menus.map((menu) => (
          <details key={menu} className={styles.menu}>
            <summary className={styles.menuTitle}>
              {menu}
              <img src="/icons/chevron.png" alt="" className={styles.chevron} />
            </summary>
          </details>
        ))}
      </nav>

      <hr className={styles.divider} />

      {/* 2. Social media icons. TODO: add the real page links */}
      <div className={styles.socials}>
        {socials.map((social) => (
          <a key={social.name} href="#" aria-label={social.name}>
            <img src={social.icon} alt="" className={styles.socialIcon} />
          </a>
        ))}
      </div>

      {/* 3. App store badges */}
      <h2 className={styles.appTitle}>Get the Z App</h2>
      <div className={styles.appBadges}>
        <a href="#">
          <img src="/icons/Google-Play.png" alt="Get it on Google Play" className={styles.badge} />
        </a>
        <a href="#">
          <img src="/icons/App-Store.png" alt="Download on the App Store" className={styles.badge} />
        </a>
      </div>

      {/* 4. Legal links and copyright */}
      <ul className={styles.legalList}>
        {legalLinks.map((link) => (
          <li key={link}>
            <a href="#" className={styles.legalLink}>
              {link}
            </a>
          </li>
        ))}
      </ul>

      <p className={styles.copyright}>
        © Z Energy Limited. All trademarks are used under license.
      </p>
    </footer>
  );
}
