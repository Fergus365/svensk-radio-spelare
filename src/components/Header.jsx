import { NavLink } from "react-router";

function Header() {
  return (
    <header>
      <div>
        <NavLink to="/"><img className="logo" src="./logo.png" alt="World Radio Service Logo" /></NavLink>
      </div>
      <nav>
        <NavLink className="lato-bold text-links" to="/all-stations">All Stations</NavLink>
        <NavLink className="lato-bold text-links" to="/about">About</NavLink>
      </nav>
    </header>
  );
}

export default Header;