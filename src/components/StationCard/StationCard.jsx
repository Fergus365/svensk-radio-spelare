import { useEffect } from "react";

function StationCard({ fchannel, playAndPause, fChannels, currentVolume, setCurrentVolume, isFavorite, toggleFavorite }) {
  useEffect(() => {
    const audio = document.getElementById(fchannel.stationuuid);
    if (audio) {
      audio.volume = currentVolume;
    }
  }, [currentVolume, fchannel.stationuuid]);

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
          <img src="./favicon.webp" alt="" />
          <h3 className="inter-text-bold" title={fchannel.name}>{fchannel.name}</h3>
        </div>
        <p className="inter-text showHideStationItemReverse"><i className="fa-solid fa-thumbs-up"></i> {fchannel.votes}</p>
      </div>
      <div className="card-body">
        <audio id={fchannel.stationuuid} src=""></audio>
        <button className={isFavorite ? "favorite-active" : ""} onClick={() => toggleFavorite(fchannel)}>
          {isFavorite ? <i className='fa-solid fa-heart-circle-xmark'></i> : <i className='fa-solid fa-heart-circle-plus'></i>}
        </button>
        <button className="showHideStationItem" id={"prevbtn" + fchannel.stationuuid} onClick={() => {
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
        <button className="showHideStationItem" id={"nextbtn" + fchannel.stationuuid} onClick={() => {
          const currentIndex = fChannels.findIndex((ch) => ch.stationuuid === fchannel.stationuuid);
          const nextIndex = (currentIndex + 1) % fChannels.length;
          playAndPause(fChannels[nextIndex].stationuuid);
        }}><i className="fa-solid fa-forward"></i></button>
        <div className="volume-container">
          <button onClick={volumeClick} className="showHideStationItem">
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