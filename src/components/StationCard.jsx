import { use } from "react";
import { useState, useEffect } from "react";

function StationCard({ fchannel, playAndPause, fChannels, currentVolume, setCurrentVolume }) {
  useEffect(() => {
    const audio = document.getElementById(fchannel.stationuuid);
    if (audio) {
      audio.volume = currentVolume;
    }
  }, [currentVolume, fchannel.stationuuid]);

  /*const handleClickOutside = () => {
    const volumeRange = document.getElementById("volumeRange" + fchannel.stationuuid);
    const volumeRangeContainer = document.getElementById("volumeRangeContainer" + fchannel.stationuuid);
    console.log("clicked outside volume range");
    if (volumeRange && volumeRangeContainer && volumeRange.classList.contains("volumeShow") && volumeRangeContainer.classList.contains("volumeShow")) {
      volumeRange.classList.remove("volumeShow");
      volumeRangeContainer.classList.remove("volumeShow");
      window.removeEventListener("click", handleClickOutside, { once: true });
    }

  };*/

  function volumeClick() {
    const volumeRange = document.getElementById("volumeRange" + fchannel.stationuuid);
    const volumeRangeContainer = document.getElementById("volumeRangeContainer" + fchannel.stationuuid);
    volumeRange.classList.toggle("volumeShow");
    volumeRangeContainer.classList.toggle("volumeShow");
  }

  return (
    <div className="station-card" id={"station" + fchannel.stationuuid}>
      <div className="card-header">
        <div>
          <h3 className="poppins-semibold" title={fchannel.name}>{fchannel.name}</h3>
        </div>
        <div>
          <p className="lato-regular">Votes: {fchannel.votes}</p>
        </div>
      </div>
      <div className="card-body">
        <audio id={fchannel.stationuuid} src=""></audio>
        <button className="controlbtns" id={"prevbtn" + fchannel.stationuuid} onClick={() => {
          const currentIndex = fChannels.findIndex((ch) => ch.stationuuid === fchannel.stationuuid);
          const prevIndex = (currentIndex - 1 + fChannels.length) % fChannels.length;
          playAndPause(fChannels[prevIndex].stationuuid);
        }}><i className="fa-solid fa-backward"></i></button>
        <button
          id={"btn" + fchannel.stationuuid}
          onClick={() => playAndPause(fchannel.stationuuid)}
        >
          <i className="fas fa-play"></i>
        </button>
        <button className="controlbtns" id={"nextbtn" + fchannel.stationuuid} onClick={() => {
          const currentIndex = fChannels.findIndex((ch) => ch.stationuuid === fchannel.stationuuid);
          const nextIndex = (currentIndex + 1) % fChannels.length;
          playAndPause(fChannels[nextIndex].stationuuid);
        }}><i className="fa-solid fa-forward"></i></button>
        <div className="volume-container">
          <button onClick={volumeClick} className="controlbtns">
            {currentVolume == 0 && (<i className="fa-solid fa-volume-xmark"></i>)}
            {currentVolume <= 0.1 && currentVolume > 0 && (<i className="fa-solid fa-volume-off"></i>)}
            {currentVolume <= 0.5 && currentVolume > 0.1 && (<i className="fa-solid fa-volume-low"></i>)}
            {currentVolume > 0.5 && (<i className="fa-solid fa-volume-high"></i>)}
          </button>
          <div id={"volumeRangeContainer" + fchannel.stationuuid} className="volume-range-container">
            <input
              id={"volumeRange" + fchannel.stationuuid}
              className="volume-range"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={currentVolume}
              onChange={(e) => setCurrentVolume(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationCard;