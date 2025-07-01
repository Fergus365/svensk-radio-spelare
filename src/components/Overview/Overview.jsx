
function overview() {
    return (
        <div className="wrapper">
            <div className="overview-container">
                <div>
                    <h2 className="montserrat-title">Overview</h2>
                    <div className="overview-dropdown">
                        <div className="overview-dropdown-title inter-text-bold" onClick={() => document.querySelector('#overview-dropdown-content-1').classList.toggle('overview-dropdown-content-hide')}><i class="fa-solid fa-bullseye"></i> What Is This?</div>
                        <div id="overview-dropdown-content-1" className="overview-dropdown-content">
                            <p className="inter-text">This is a simple and modern web app that lets you explore and listen to radio stations from all over the world — right in your browser. No installs, no fuss. Just hit play and enjoy.</p>
                        </div>
                    </div>
                    <div className="overview-dropdown">
                        <div className="overview-dropdown-title inter-text-bold" onClick={() => document.querySelector('#overview-dropdown-content-3').classList.toggle('overview-dropdown-content-hide')}><i class="fa-solid fa-globe"></i> Powered by Radio Browser API</div>
                        <div id="overview-dropdown-content-3" className="overview-dropdown-content">
                            <p className="inter-text">We use the Radio Browser API to bring you a wide selection of global radio stations. It provides real-time access to station names, streams, and other info — all in one place.</p>
                        </div>
                    </div>
                    <div className="overview-dropdown">
                        <div className="overview-dropdown-title inter-text-bold" onClick={() => document.querySelector('#overview-dropdown-content-4').classList.toggle('overview-dropdown-content-hide')}><i class="fa-solid fa-headphones-simple"></i> What You Can Do</div>
                        <div id="overview-dropdown-content-4" className="overview-dropdown-content">
                            <p className="inter-text">
                                <i class="fa-solid fa-check"></i> Browse and search for stations worldwide
                                <br />
                                <i class="fa-solid fa-check"></i> Play and stop live streams instantly
                                <br />
                                <i class="fa-solid fa-check"></i> See details like station name, country, and votes
                                <br />
                                <i class="fa-solid fa-check"></i> Use it easily on desktop, tablet, or mobile</p>
                        </div>
                    </div>
                </div>
                <div>
                    <img className="overview-image" src="./headphones.svg" alt="An image of headphones" />
                </div>
            </div>
        </div>
    );
}

export default overview;