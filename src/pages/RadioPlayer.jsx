
import { useEffect, useState } from "react";
import StationCard from "../components/StationCard";

function RadioPlayer() {
  const [originalChannels, setOriginalChannels] = useState([]);
  const [channels, setChannels] = useState([]);
  const [fChannels, setFilteredChannels] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isReversed, setIsReversed] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Hämtar data:", new Date().toLocaleTimeString());
      await fetch("https://de1.api.radio-browser.info/json/stations/bycountry/Sweden")
        .then((response) => response.json())
        .then((json) => {
          setChannels(json);
          setOriginalChannels(json);
          setFilteredChannels(json);
        })
        .catch((error) => console.error("Error:", error));
    };

    fetchData();
    console.log(channels);
  }, []);

  useEffect(() => {
    setFilteredChannels(
      channels.filter((channel) =>
        channel.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [channels, search]);

  function sortChannels() {
    console.log("Sorterar kanaler efter röster");
    const sorted = [...fChannels].sort((a, b) => a.votes - b.votes);
    if (isReversed) {
      sorted.reverse();
    }
    setFilteredChannels(sorted);
    setIsReversed(!isReversed);
  }

  function resetChannels() {
    console.log("Återställer kanaler");
    setFilteredChannels(
      originalChannels.filter((channel) =>
        channel.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  const playAndPause = (stationuuid) => {
    const audio = document.getElementById(stationuuid);
    const stationCardHTML = document.getElementById("station" + stationuuid);
    const stationCard = stationCardHTML.classList;

    if (audio && audio.error === null) {
      const playBtn = document.getElementById("btn" + stationuuid);

      if (audio.paused) {
        if (currentPlaying && currentPlaying !== stationuuid) {
          const currentAudio = document.getElementById(currentPlaying);
          if (currentAudio) {
            console.log("Pausar:", currentAudio);
            currentAudio.pause();
            const currentPlayBtn = document.getElementById("btn" + currentPlaying);
            if (currentPlayBtn) {
              currentPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
            const currentStationCardHTML = document.getElementById("station" + currentPlaying);
            if (currentStationCardHTML) {
              currentStationCardHTML.classList.remove("station-card-selected");
            }
          }
        }

        audio.volume = 0.5;
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
        stationCard.add("station-card-selected");
        console.log("Spelar:", audio);
        setCurrentPlaying(stationuuid);
      } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        stationCard.remove("station-card-selected");

        console.log("Pausar:", audio);
        setCurrentPlaying(null);
      }
    } else {
      console.log("Ej spelbar:", audio);
      alert("Denna station är inte tillgänglig för tillfället.");
      stationCardHTML.style.display = "none";
      setFilteredChannels(fChannels.filter((ch) => ch.stationuuid !== stationuuid));
    }
  };

  return (

    <div className="wrapper">
      <div className="spacer"></div>
      <h2>Radio Kanaler</h2>
      <input
        className="search-station"
        type="text"
        placeholder="Sök på kanaler..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="btn-container">
        <button onClick={resetChannels}>Utvalda</button>
        <button onClick={sortChannels}>Sortera Efter Likes</button>
      </div>
      <div className="station-grid">
        {fChannels.map((fchannel) => (
          <StationCard
            key={fchannel.stationuuid}
            fChannels={fChannels}
            fchannel={fchannel}
            playAndPause={playAndPause}
          />
        ))}
      </div>
    </div>

  );
}

export default RadioPlayer;