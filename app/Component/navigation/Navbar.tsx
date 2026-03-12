import NavbarShell from "./NavbarShell";
import { NAV_ITEMS, GITHUB_URL, NAV_HEIGHT } from "./navConfig";

export default function Navbar() {
  return (
    <NavbarShell
      navItems={NAV_ITEMS}
      githubUrl={GITHUB_URL}
      navHeight={NAV_HEIGHT}
    />
  );
}
