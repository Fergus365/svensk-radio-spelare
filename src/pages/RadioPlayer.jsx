
import { useEffect, useState } from "react";
import StationCard from "../components/StationCard";

function RadioPlayer() {
  const [fChannels, setFilteredChannels] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isReversed, setIsReversed] = useState(true);
  const [che, setCh] = useState([]);

  useEffect(() => {
    const apiServers = [
      "https://de1.api.radio-browser.info/json/stations/bycountry/Sweden",
      "https://fr1.api.radio-browser.info/json/stations/bycountry/Sweden",
      "https://nl1.api.radio-browser.info/json/stations/bycountry/Sweden",
      "https://us1.api.radio-browser.info/json/stations/bycountry/Sweden",
      "https://at1.api.radio-browser.info/json/stations/bycountry/Sweden",
      "https://all.api.radio-browser.info/json/stations/bycountry/Sweden",
    ];

    async function fetchData() {
      for (const server of apiServers) {
        try {
          const res = await fetch(`${server}`)
          if (res.ok) {
            const json = await res.json();
            const upgradedChannels = json.map((channel) => {
              if (channel.url.startsWith("http://")) {
                channel.url = channel.url.replace("http://", "https://");
              }
              if (channel.url_resolved.startsWith("http://")) {
                channel.url_resolved = channel.url_resolved.replace("http://", "https://");
              }
              return channel;
            });

            const httpsChannels = upgradedChannels.filter(
              (channel) =>
                channel.url.startsWith("https://") || channel.url_resolved.startsWith("https://")
            );
            const playableChannels = await validatePlayableLinks(httpsChannels);
            setFilteredChannels(playableChannels);
            break;
          }
        } catch (error) {
          console.warn(`Server failed: ${server}`, error);
        }
      }
      throw new Error("All servers failed to respond.");
    };

    fetchData();
  }, []);

  const validatePlayableLinks = async (channels) => {
    channels.forEach((channel) => {
      new Promise((resolve) => {
        const audio = new Audio(channel.url || channel.url_resolved);

        audio.addEventListener("canplay", () => {

          resolve({ channel, isPlayable: true });
        }, { once: true });
        audio.addEventListener("error", () => {

          resolve({ channel, isPlayable: false });
        }, { once: true });
        audio.load();
      }).then((result) => {
        if (result.isPlayable) {
          setCh((prevCh) => [...prevCh, result.channel]);
        }
        return result;
      });
    });
    return results;
  };

  useEffect(() => {
    console.log("Validated Channels:", che);

    const filtered = che.filter((channel) =>
      channel.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredChannels(filtered);
  }, [che, search]);

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

  const uniqueChannels = fChannels.filter(
    (channel, index, self) =>
      index === self.findIndex((ch) => ch.stationuuid === channel.stationuuid)
  );

  return (

    <div className="wrapper">
      <h2>Radio Kanaler</h2>
      <input
        className="search-station"
        type="text"
        placeholder="Sök på kanaler..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>Getting available stations, {uniqueChannels.length}</div>
      <div className="station-grid">
        {
          uniqueChannels.map((uniqueChannel) => (
            <StationCard
              key={uniqueChannel.stationuuid}
              fChannels={uniqueChannels}
              fchannel={uniqueChannel}
              playAndPause={playAndPause}
            />
          ))
        }
      </div>
    </div>

  );
}

export default RadioPlayer;