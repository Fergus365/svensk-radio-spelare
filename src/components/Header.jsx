import { NavLink } from "react-router";

function Header() {
  return (
    <header>
      <div className="site-meta">
        <img className="logo" src="./logo.png" alt="" />
      </div>
      <nav>
        <NavLink to="/">Hem</NavLink>
        <NavLink to="/radioplayer">Radio Kanaler</NavLink>
        <NavLink to="/om-svensk-radio-spelare">Om Svensk Radio Spelare</NavLink>
      </nav>
      <div className="spacer"></div>
    </header>
  );
}

export default Header;