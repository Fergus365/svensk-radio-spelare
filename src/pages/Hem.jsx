import { NavLink } from "react-router";

function Hem() {
    return (
        <div className="wrapper full-page">
            <div className="h1img">
                <div className="hero">
                    <h1>Dags att lyssna på radio?</h1>
                    <NavLink className="heroBtn" to="/radioplayer">Radio Kanaler <i className="fa-solid fa-arrow-right"></i></NavLink>
                </div>
                <img src="./radiopratare.png" alt="En bild på en radio pratare" />
            </div>
        </div>
    );
}

export default Hem;