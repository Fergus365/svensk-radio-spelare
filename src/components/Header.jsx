import { NavLink } from "react-router";

function Header() {
  return (
    <header>
      <div>
        <NavLink to="/"><img className="logo" src="./logo.png" alt="World Radio Service Logo" /></NavLink>
      </div>
    </header>
  );
}

export default Header;