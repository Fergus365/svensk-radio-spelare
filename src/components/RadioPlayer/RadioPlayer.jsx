// *******************************************************************************
// IMPORTS
// *******************************************************************************
import { useEffect, useState } from "react";
import StationCard from "../StationCard/StationCard";
import useFetchData from "../fetchData";
import DOMPurify from "dompurify"; // Cleaning library to sanitize user input

// *******************************************************************************
// MAIN FUNCTION
// *******************************************************************************
function RadioPlayer() {
  // *******************************************************************************
  // STATE VARIABLES
  // *******************************************************************************
  const { fetchData } = useFetchData();
  const [allChannels, setAllChannels] = useState([]);
  const [fChannels, setFilteredChannels] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isLoading, setIsLoading] = useState(1);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [countries, setCoutries] = useState([]);
  const [visibleItems, setVisibleItems] = useState(18); // Start with 9 items
  const [favorites, setFavorites] = useState([]); // State for favorites
  const [countryCodeText, setCountryCodeText] = useState('');

  // *******************************************************************************
  // ON-MOUNT / ON-CHANGE EFFECTS
  // *******************************************************************************



  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (favorites.length === 0 && allChannels.length === 0) return;

    const mergedChannels = [
      ...favorites,
      ...allChannels.filter(
        (channel) => !favorites.some((fav) => fav.stationuuid === channel.stationuuid)
      ),
    ];

    setFilteredChannels((prev) => {
      const isSame = prev.length === mergedChannels.length && prev.every((ch, i) => ch.stationuuid === mergedChannels[i].stationuuid);
      return isSame ? prev : mergedChannels;
    });
  }, [favorites, allChannels]);

  useEffect(() => {
    const fetchCountryData = async () => {
      const countryCode = await fetchUserCountry(); // Wait for the country code
      if (countryCode) {
        validateData(countryCode); // Use the country code
      }
    };
    fetchCountryData(); // Fetch data on mount
  }, []);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    const filtered = allChannels.filter((channel) =>
      channel.name.toLowerCase().includes(search.toLowerCase()) || channel.tags.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredChannels(filtered);
  }, [search, allChannels, favorites]);

  useEffect(() => {
    setVisibleItems(18); // Reset visible items when channels change
  }, [search]);

  // *******************************************************************************
  // FETCHING DATA
  // *******************************************************************************
  const fetchUserCountry = async () => {
    try {
      // Check if GDPR consent is given
      const consent = localStorage.getItem("gdprConsent");
      if (!consent) {
        console.warn("GDPR consent not given. Skipping Geo API call.");
        return null; // Return null if consent is not given
      }
      const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
      if (response.ok) {
        const data = await response.json();
        return data.country_code; // Return the country code
      } else {
        console.error("Failed to fetch user location");
      }
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
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
              index === self.findIndex((cy) => cy.iso_3166_1.toUpperCase() == country.iso_3166_1.toUpperCase())
          );
          uniqueCountries.sort((a, b) => a.name.localeCompare(b.name)); // Sort countries by name
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

  // *******************************************************************************
  // VALIDATE DATA with country-code value
  // *******************************************************************************
  async function validateData(countrycode) {
    setCountryCodeText(countrycode)
    // Reset states before fetching new data
    setVisibleItems(18); // Reset visible items when channels change
    setIsLoading(1); // Set loading state
    setAllChannels([]); // Clear all channels
    setFilteredChannels([]); // Clear filtered channels

    setSearch(""); // Clear search input

    try {
      setIsLoading(2); // Update loading state
      const fetchedChannels = await fetchData(countrycode); // Fetch channels for the selected country

      setIsLoading(3); // Update loading state
      fetchedChannels.sort((a, b) => b.votes - a.votes); // Sort channels by votes

      setIsLoading(3.5); // Update loading state to indicate validation progress

      // Step 1: Filter out channels that have a lastcheckok value of 1 and hls value of 0
      const okChannels = fetchedChannels.filter((c) => c.lastcheckok === 1 && c.hls === 0);

      // Step 2: Filter out channels with unplayable formats (exclude bad formats)
      const filteredChannels = okChannels.filter((channel) => {
        return !isUnplayableAudioFormat(channel.url_resolved) && !isUnplayableAudioFormat(channel.url);
      });

      // Step 3: Set all channels to the filtered list
      setAllChannels(filteredChannels);

      setIsLoading(4); // Loading complete
    } catch (error) {
      console.error("Error validating data:", error);
      setIsLoading(1); // Reset loading state on error
    }
  }

  // Helper function to check for unplayable audio formats
  const isUnplayableAudioFormat = (url) => {
    // Unplayable formats for <audio> tag (e.g., playlist formats and video formats)
    const unplayableAudioExtensions = /\.(m3u|m3u8|pls|asx|mp4|webm)$/i;
    return unplayableAudioExtensions.test(url);
  };

  // *******************************************************************************
  // UTILITY FUNCTIONS
  // *******************************************************************************
  const loadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 18, fChannels.length)); // Incrementally render 9 more items
  };

  const playAndPause = (stationuuid) => {
    const audio = document.getElementById(stationuuid);
    const stationCardHTML = document.getElementById("station" + stationuuid);
    const stationCard = stationCardHTML?.classList;

    if (audio) {
      const playBtn = document.getElementById("btn" + stationuuid);

      if (audio.paused || audio.src === "") {

        // Stop the currently playing station if it exists
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
          } else {
            console.warn(`Current audio element not found for stationuuid: ${currentPlaying}`);
          }
        }

        // Find the channel in either favorites or fChannels
        const channel =
          favorites.find((favorite) => favorite.stationuuid === stationuuid) ||
          fChannels.find((channel) => channel.stationuuid === stationuuid);

        if (channel) {
          audio.src = channel.url_resolved || channel.url || "";
          audio.play();
          if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
          if (stationCard) stationCard.add("station-card-selected");

          setCurrentPlaying(stationuuid); // Update the currently playing station
        }
      } else {
        audio.pause(); // Pause the audio
        audio.src = ""; // Stop the audio
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (stationCard) stationCard.remove("station-card-selected");

        setCurrentPlaying(null); // Clear the currently playing station
      }
    } else {
      console.warn(`Audio element not found for stationuuid: ${stationuuid}`);
    }
  };

  const toggleFavorite = (station) => {
    try {
      if (!station || !station.stationuuid) {
        throw new Error("Invalid station object");
      }

      if (favorites.some((fav) => fav.stationuuid === station.stationuuid)) {
        // Remove from favorites
        setFavorites(favorites.filter((fav) => fav.stationuuid !== station.stationuuid));
      } else {
        // Add to favorites
        setFavorites([...favorites, station]);
      }
    } catch (error) {
      console.error("Error in toggleFavorite:", error);
    }
  };

  const handleSearchChange = (e) => {
    const rawValue = e.target.value;

    const sanitizedValue = DOMPurify.sanitize(rawValue);

    setSearch(sanitizedValue);
  };

  // Remove duplicates from favorites/fChannels
  const filteredChannels = fChannels.filter(
    (channel) => !favorites.some((fav) => fav.stationuuid === channel.stationuuid)
  );

  // *******************************************************************************
  // RENDERING
  // *******************************************************************************
  return (
    <div className="wrapper radioplayer">
      <div className="station-background">
        <h2 className="montserrat-title">Your Favorites</h2>
        <div className="station-grid">
          {
            [...new Map(favorites.map((favorite) => [favorite.stationuuid, favorite])).values()]
              .slice(0, visibleItems)
              .map((favorite) => (
                <StationCard
                  key={favorite.stationuuid}
                  fChannels={favorites}
                  fchannel={favorite}
                  playAndPause={playAndPause}
                  currentVolume={currentVolume}
                  setCurrentVolume={setCurrentVolume}
                  isFavorite={favorites.some((fav) => fav.stationuuid === favorite.stationuuid)}
                  toggleFavorite={toggleFavorite}
                />
              ))
          }
          {favorites.length === 0 && <p className="inter-text">You have no favorite stations yet.</p>}
        </div>
      </div>
      <div className="station-list-container">
        <i className="fa-solid fa-earth-americas"></i>
        <select disabled={!(isLoading === 1 || isLoading === 4)} className="station-list inter-text-bold" onChange={(e) => validateData(e.target.value)}>
          <option value="0" disabled selected className="inter-text-bold">Choose a country</option>
          {countries.map((country) => (
            <option key={country.iso_3166_1} value={country.iso_3166_1} className="inter-text-bold"><p>{country.name}</p></option>
          ))}
        </select>
      </div>
      <div className="station-background">
        <div className="search-station-container">
          <input
            disabled={!(isLoading === 1 || isLoading === 4) || allChannels.length === 0}
            className="search-station inter-text"
            type="text"
            placeholder="Search with genres, tags or station names..."
            value={search}
            onChange={handleSearchChange}
          />


          {isLoading === 4 && (
            <p className="inter-text-bold loading-text">
              {fChannels.length} live stations – pick your vibe.
            </p>
          )}

          {isLoading === 3 || isLoading === 3.5 && (
            <p className="inter-text-bold loading-text">
              <i className="fa-solid fa-spinner"></i> Loading and sorting stations...
            </p>
          )}

          {isLoading === 3.5 && (
            <p className="inter-text-bold loading-text">
              {fChannels.length} stations ready to stream!
            </p>
          )}

          {isLoading === 2 && (
            <p className="inter-text-bold loading-text">
              <i className="fa-solid fa-spinner"></i> Checking for available stations, please be patient.
            </p>
          )}

          {isLoading === 1 && (
            <p className="inter-text-bold loading-text">
              👋 Welcome! Pick a country to start listening.
            </p>
          )}

        </div>
        <h2 className="montserrat-title">All Stations {countryCodeText}</h2>
        <p className="inter-text">Some channels are slower than others and some might now work at all.</p>
        <div className="station-grid">
          {
            [...new Map(filteredChannels.map((channel) => [channel.stationuuid, channel])).values()]
              .slice(0, visibleItems)
              .map((fChannel) => (
                <StationCard
                  key={fChannel.stationuuid}
                  fChannels={fChannels}
                  fchannel={fChannel}
                  playAndPause={playAndPause}
                  currentVolume={currentVolume}
                  setCurrentVolume={setCurrentVolume}
                  isFavorite={favorites.some((fav) => fav.stationuuid === fChannel.stationuuid)}
                  toggleFavorite={toggleFavorite}
                />
              ))
          }
        </div>
      </div>
      {/* Add a button to load more items */}
      {visibleItems < fChannels.length && (
        <div className="load-more-container">
          <p className="inter-text">Load more stations...</p>
          <button className="load-more-button inter-text-bold" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default RadioPlayer;