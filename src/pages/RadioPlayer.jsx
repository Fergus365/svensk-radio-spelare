
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
      try {
        const response = await fetch("https://de1.api.radio-browser.info/json/stations/bycountry/Sweden");
        const json = await response.json();
        const httpsChannels = json.filter((channel) => channel.url.startsWith("https://") || channel.url_resolved.startsWith("https://"));
        console.log(httpsChannels);
        const playableChannels = await validatePlayableLinks(httpsChannels);
        setChannels(playableChannels);
        setOriginalChannels(playableChannels);
        setFilteredChannels(playableChannels);
      } catch (error) {
        console.error("Error fetching from primary source, trying backup:", error);
        try {
          const backupResponse = await fetch("https://nl1.api.radio-browser.info/json/stations/bycountry/Sweden");
          const backupJson = await backupResponse.json();
          const httpsChannels = backupJson.filter((channel) =>
            channel.url.startsWith("http") ||
            channel.url_resolved.startsWith("http")
          );
          console.log(httpsChannels);
          const playableChannels = await validatePlayableLinks(httpsChannels);
          setChannels(playableChannels);
          setOriginalChannels(playableChannels);
          setFilteredChannels(playableChannels);
        } catch (backupError) {
          console.error("Error fetching from backup source:", backupError);
        }
      }
    };

    fetchData();
  }, []);

  const validatePlayableLinks = async (channels) => {
    const results = await Promise.all(
      channels.map((channel) =>
        new Promise((resolve) => {
          const audio = new Audio(channel.url || channel.url_resolved);
          const timeout = setTimeout(() => resolve({ channel, isPlayable: false }), 30000);
          audio.addEventListener("canplay", () => {
            clearTimeout(timeout);
            resolve({ channel, isPlayable: true });
          }, { once: true });
          audio.addEventListener("error", () => {
            clearTimeout(timeout);
            resolve({ channel, isPlayable: false });
          }, { once: true });
          audio.load();
        })
      )
    );

    const playableChannels = results
      .filter((result) => result.isPlayable)
      .map((result) => result.channel);
    console.log(`${playableChannels.length} playable | ${channels.length - playableChannels.length} unplayable`);
    return playableChannels;
  };

  useEffect(() => {
    setFilteredChannels(
      channels.filter((channel) =>
        channel.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [channels, search]);

  function sortChannels() {
    const sorted = [...fChannels].sort((a, b) => a.votes - b.votes);
    if (isReversed) {
      sorted.reverse();
    }
    setFilteredChannels(sorted);
    setIsReversed(!isReversed);
  }

  function resetChannels() {
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

    if (audio) {
      const playBtn = document.getElementById("btn" + stationuuid);

      if (audio.paused) {
        if (currentPlaying && currentPlaying !== stationuuid) {
          const currentAudio = document.getElementById(currentPlaying);
          if (currentAudio) {
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

        setCurrentPlaying(stationuuid);
      } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        stationCard.remove("station-card-selected");

        setCurrentPlaying(null);
      }
    } else {
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