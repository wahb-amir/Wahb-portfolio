import NavbarShell from "./NavbarShell";
import { NAV_ITEMS, GITHUB_URL, NAV_HEIGHT, LINKEDIN_URL ,X_URL} from "./navConfig";

export default function Navbar() {
  return (
    <NavbarShell
      navItems={NAV_ITEMS}
      githubUrl={GITHUB_URL}
      navHeight={NAV_HEIGHT}
      linkdinUrl={LINKEDIN_URL}
      xUrl={X_URL}
    />
  );
}
