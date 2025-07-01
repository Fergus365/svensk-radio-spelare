import RadioPlayer from "../../components/RadioPlayer/RadioPlayer";
import Overview from "../../components/Overview/Overview";
import StationList from "../../components/StationList/StationList";

function Home() {

    function scrollToPlayer() {
        const element = document.getElementById("all-stations");
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function scrollToOverview() {
        const element = document.getElementById("overview");
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function toggleRadioPlayer() {
        const HTMLAllStations = document.querySelector('#all-stations');
        const HTMLAllStationsClasses = HTMLAllStations.classList;
        console.log(HTMLAllStationsClasses);
        HTMLAllStationsClasses.toggle("popout");
    }

    return (
        <>
            <div className="section-hero">
                <div className="wrapper full-page">
                    <div className="h1img">
                        <div className="hero">
                            <h1 className="montserrat-title">Audiory</h1>
                            <p className="inter-text">Your Radio, One Home</p>
                            <div>
                                <a onClick={scrollToPlayer} className="inter-text-bold heroBtn text-links"><i class="fa-solid fa-tower-cell"></i> Browse Stations</a>
                                <a onClick={scrollToOverview} className="inter-text-bold heroBtn text-links"><i class="fa-solid fa-table-list"></i> Overview</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spacer"></div>
            <div className="section-stationlist" id="stationlist">
                <div className="wrapper">
                    <StationList />
                </div>
            </div>
            <div className="spacer"></div>
            <div className="section-overview" id="overview">
                <Overview />
            </div>
            <div className="spacer"></div>
            <div className="section-radio-player" id="all-stations">
                <button onClick={toggleRadioPlayer}>Klicka!</button>
                <RadioPlayer />
            </div>
        </>
    );
}

export default Home;