import { useEffect, useState } from "react";
import StationCard from "../components/StationCard";
import useFetchData from "../components/fetchData";
import pLimit from "p-limit";
import DOMPurify from "dompurify"; // Optional: Install with `npm install dompurify`

function RadioPlayer() {
  const { fetchData } = useFetchData();
  const [allChannels, setAllChannels] = useState([]);
  const [fChannels, setFilteredChannels] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isLoading, setIsLoading] = useState(1);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [countries, setCoutries] = useState([]);
  const [visibleItems, setVisibleItems] = useState(9); // Start with 10 items

  const loadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 9, fChannels.length)); // Incrementally render 9 more items
  };

  const fetchCountries = async () => {
    const apiServers = [
      `https://de1.api.radio-browser.info/json/countries`,
      `https://fr1.api.radio-browser.info/json/countries`,
      `https://nl1.api.radio-browser.info/json/countries`,
      `https://us1.api.radio-browser.info/json/countries`,
      `https://at1.api.radio-browser.info/json/countries`,
      `https://all.api.radio-browser.info/json/countries`,
    ];

    let success = false;

    for (const server of apiServers) {
      try {
        const res = await fetch(`${server}`);
        if (res.ok) {
          const json = await res.json();

          success = true;
          // Filter out duplicate countries based on iso_3166_1
          const uniqueCountries = json.filter(
            (country, index, self) =>
              index === self.findIndex((cy) => cy.iso_3166_1 === country.iso_3166_1)
          );
          setCoutries(uniqueCountries); // Set unique countries
          break; // Exit loop if successful
        }
      } catch (error) {
        console.warn(`Server failed: ${server}`, error);
      }
    }

    if (!success) {
      throw new Error("All servers failed to respond.");
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  async function validateData(country) {
    // Reset states before fetching new data
    setVisibleItems(9); // Reset visible items when channels change
    setIsLoading(1); // Set loading state
    setAllChannels([]); // Clear all channels
    setFilteredChannels([]); // Clear filtered channels
    setCurrentPlaying(null); // Reset currently playing station
    setSearch(""); // Clear search input

    try {
      setIsLoading(2); // Update loading state
      const fetchedChannels = await fetchData(country); // Fetch channels for the selected country

      // Remove duplicate channels based on stationuuid
      const uniqueChannels = fetchedChannels.filter(
        (channel, index, self) =>
          index === self.findIndex((ch) => ch.stationuuid === channel.stationuuid)
      );

      console.log("unique", uniqueChannels);

      setIsLoading(3); // Update loading state
      uniqueChannels.sort((a, b) => b.votes - a.votes); // Sort channels by votes



      // Validate playable channels
      const playableChannels = await validatePlayableLinks(uniqueChannels);


      console.log("validated and sorted", playableChannels);

      setIsLoading(4); // Loading complete
    } catch (error) {
      console.error("Error validating data:", error);
      setIsLoading(1); // Reset loading state on error
    }
  }

  const validatePlayableLinks = async (channels) => {
    const limit = pLimit(6); // Limit concurrency to 6
    const results = []; // Store results
    setIsLoading(3.5); // Update loading state to indicate validation progress

    await Promise.all(
      channels.map((channel) =>
        limit(() =>
          new Promise(async (resolve) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // Set a timeout of 10 seconds

            try {
              const url = channel.url || channel.url_resolved;

              // Accept only <audio>-playable formats
              const validExtensions = ["mp3", "ogg", "wav", "aac", "flac", "opus", "m4a"];
              const isValidFormat = validExtensions.some((ext) => url.includes(ext));

              if (!isValidFormat) {
                console.warn(`Skipping unsupported format for channel: ${channel.name}`);
                resolve({ channel, isPlayable: false });
                return;
              }

              // Handle URLs with a HEAD request
              const response = await fetch(url, {
                method: "HEAD",
                signal: controller.signal,
              });
              clearTimeout(timeout);

              if (response.ok) {
                resolve({ channel, isPlayable: true });
              } else {
                console.warn(`HEAD request failed for channel: ${channel.name}`);
                resolve({ channel, isPlayable: false });
              }
            } catch (error) {
              console.warn(`Error validating channel: ${channel.name}`, error);
              resolve({ channel, isPlayable: false });
            }
          }).then((result) => {
            if (result.isPlayable) {
              // Update state incrementally for playable channels
              setAllChannels((prev) => {
                const updatedChannels = [...prev, result.channel];
                updatedChannels.sort((a, b) => b.votes - a.votes); // Sort by votes
                setFilteredChannels(
                  updatedChannels.filter((ch) =>
                    ch.name.toLowerCase().includes(search.toLowerCase())
                  )
                );
                return updatedChannels;
              });
            }
            results.push(result); // Add result to the results array
          })
        )
      )
    );

    // Return only playable channels
    return results.filter((result) => result.isPlayable).map((result) => result.channel);
  };

  useEffect(() => {
    setVisibleItems(9); // Reset visible items when channels change
    setFilteredChannels(
      allChannels.filter((channel) =>
        channel.name.toLowerCase().includes(search.toLowerCase()) || channel.tags.toLowerCase().includes(search.toLowerCase())
      ));
  }, [search, allChannels]);

  const playAndPause = (stationuuid) => {

    const audio = document.getElementById(stationuuid);
    const stationCardHTML = document.getElementById("station" + stationuuid);
    const stationCard = stationCardHTML.classList;

    if (audio) {
      const playBtn = document.getElementById("btn" + stationuuid);

      if (audio.paused || audio.src === "") {
        if (currentPlaying && currentPlaying !== stationuuid) {
          const currentAudio = document.getElementById(currentPlaying);
          if (currentAudio) {
            currentAudio.pause(); // Pause the current audio
            currentAudio.src = ""; // Stop the current audio
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

        audio.src = fChannels.find((channel) => channel.stationuuid === stationuuid).url_resolved || fChannels.find((channel) => channel.stationuuid === stationuuid).url;
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
        stationCard.add("station-card-selected");

        setCurrentPlaying(stationuuid);

      } else {
        audio.pause(); // Pause the audio
        audio.src = ""; // Stop the audio
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        stationCard.remove("station-card-selected");

        setCurrentPlaying(null);
      }
    }
  };

  const handleSearchChange = (e) => {
    const rawValue = e.target.value;

    const sanitizedValue = DOMPurify.sanitize(rawValue);

    setSearch(sanitizedValue);
  };

  return (

    <div className="wrapper">
      <div className="search-station-container">

        <input
          disabled={!(isLoading === 1 || isLoading === 4)}
          className="search-station poppins-semibold"
          type="text"
          placeholder="Search with genres, tags or station names..."
          value={search}
          onChange={handleSearchChange}
        />


        {isLoading === 4 && (
          <p className="lato-bold loading-text">
            Found {fChannels.length} stations.
          </p>
        )}

        {isLoading === 3 || isLoading === 3.5 && (
          <p className="lato-bold loading-text">
            <i className="fa-solid fa-spinner"></i> Validating and sorting available stations for you. You can listen to current stations while we finish loading the rest.
          </p>
        )}

        {isLoading === 3.5 && (
          <p className="lato-bold loading-text">
            {fChannels.length} stations.
          </p>
        )}

        {isLoading === 2 && (
          <p className="lato-bold loading-text">
            <i className="fa-solid fa-spinner"></i> Checking for available stations, please be patient.
          </p>
        )}

        {isLoading === 1 && (
          <p className="lato-bold loading-text">
            Start by selecting a country.
          </p>
        )}

      </div>
      <p className="lato-regular">Some channels are slower than others.</p>
      <select disabled={!(isLoading === 1 || isLoading === 4)} className="station-list lato-bold" onChange={(e) => validateData(e.target.value)}>
        <option value="0" disabled selected className="lato-bold">Choose a country</option>
        {countries.map((country) => (
          <option key={country.iso_3166_1} value={country.iso_3166_1} className="lato-bold"><p>{country.name}</p></option>
        ))}
      </select>
      <div className="station-grid">
        {
          fChannels.slice(0, visibleItems).map((fChannel) => (
            <StationCard
              key={fChannel.stationuuid}
              fChannels={fChannels}
              fchannel={fChannel}
              playAndPause={playAndPause}
              currentVolume={currentVolume}
              setCurrentVolume={setCurrentVolume}
            />
          ))
        }
      </div>
      {/* Add a button to load more items */}
      {visibleItems < fChannels.length && (
        <div className="load-more-container">
          <p className="lato-regular">Load more stations...</p>
          <button className="load-more-button lato-bold" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
      <div className="bottom-spacer"></div>
    </div>
  );
}

export default RadioPlayer;