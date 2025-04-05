
function StationCard({ fchannel, playAndPause, fChannels }) {
  return (
    <div className="station-card" id={"station" + fchannel.stationuuid}>
      <div className="card-header">
        <div>
          <img
            loading="lazy"
            className="station-img"
            src={fchannel.favicon ? fchannel.favicon : "https://placehold.co/100x100?text=Station+Logo"}
          />
          <h3 title={fchannel.name}>{fchannel.name}</h3>
        </div>
        <div>
          <p>Likes: {fchannel.votes}</p>
        </div>
      </div>
      <div className="card-body">
        <audio id={fchannel.stationuuid} src={fchannel.url || fchannel.url_resolved}></audio>
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
      </div>
    </div>
  );
}

export default StationCard;