import { NavLink } from "react-router";
import RadioPlayer from "./RadioPlayer";

function Hem() {
    function scrollToStations() {
        const element = document.getElementById("all-stations");
        element.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <>
            <div className="section-hero">
                <div className="wrapper full-page">
                    <div className="h1img">
                        <div className="hero">
                            <h1 className="poppins-semibold">World Radio Service</h1>
                            <p className="lato-bold">All your favorite radio stations in ONE place</p>
                            <div>
                                <a onClick={scrollToStations} className="lato-bold heroBtn text-links">All Stations <i className="fa-solid fa-arrow-right"></i></a>
                                <NavLink className="heroBtn lato-bold text-links" to="/about">About us <i className="fa-solid fa-arrow-right"></i></NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spacer"></div>
            <div className="section-radio-player" id="all-stations">
                <RadioPlayer />
            </div>
        </>
    );
}

export default Hem;