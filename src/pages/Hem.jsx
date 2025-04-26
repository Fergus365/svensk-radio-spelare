import RadioPlayer from "./RadioPlayer";
import Overview from "../components/Overview/Overview";

function Hem() {
    function scrollToPlayer() {
        const element = document.getElementById("all-stations");
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function scrollToOverview() {
        const element = document.getElementById("overview");
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
                                <a onClick={scrollToPlayer} className="lato-bold heroBtn text-links"><i class="fa-solid fa-tower-cell"></i> All Stations</a>
                                <a onClick={scrollToOverview} className="lato-bold heroBtn text-links"><i class="fa-solid fa-table-list"></i> Overview</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spacer"></div>
            <div className="section-overview" id="overview">
                <Overview />
            </div>
            <div className="spacer"></div>
            <div className="section-radio-player" id="all-stations">
                <RadioPlayer />
            </div>
            <div className="spacer"></div>
            <div className="section-footer">
                <div className="wrapper">
                    <div className="footer-content">
                        <p className="lato-regular">Made by <a href="#">Kristoffer Karlsson</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Hem;