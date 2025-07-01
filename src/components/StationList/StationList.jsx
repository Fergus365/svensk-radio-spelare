import React, { useEffect, useState } from "react";

function StationList() {
    const [allWorldChannels, setAllWorldChannels] = useState([]);

    // Helper function to check for unplayable audio formats
    const isUnplayableAudioFormat = (url) => {
        // Unplayable formats for <audio> tag (e.g., playlist formats and video formats)
        const unplayableAudioExtensions = /\.(m3u|m3u8|pls|asx|mp4|webm)$/i;
        return unplayableAudioExtensions.test(url);
    };

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        const apiServers = [
            `https://de1.api.radio-browser.info/json/stations/topvote/10`,
            `https://fr1.api.radio-browser.info/json/stations/topvote/10`,
            `https://nl1.api.radio-browser.info/json/stations/topvote/10`,
            `https://us1.api.radio-browser.info/json/stations/topvote/10`,
            `https://at1.api.radio-browser.info/json/stations/topvote/10`,
            `https://all.api.radio-browser.info/json/stations/topvote/10`,
        ];

        let success = false;

        for (const server of apiServers) {
            try {
                const res = await fetch(`${server}`);
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
                    success = true;
                    // Remove duplicate channels based on stationuuid
                    const uniqueChannels = httpsChannels.filter(
                        (channel, index, self) =>
                            index === self.findIndex((ch) => ch.stationuuid === channel.stationuuid)
                    );
                    // Step 1: Filter out channels that have a lastcheckok value of 1 and hls value of 0
                    const okChannels = uniqueChannels.filter((c) => c.lastcheckok === 1 && c.hls === 0);
                    // Step 2: Filter out channels with unplayable formats (exclude bad formats)
                    const filteredChannels = okChannels.filter((channel) => {
                        return !isUnplayableAudioFormat(channel.url_resolved) && !isUnplayableAudioFormat(channel.url);
                    });
                    console.log('all stations', filteredChannels)
                    setAllWorldChannels(filteredChannels.slice(0, 10));
                    break;
                }
            } catch (error) {
                console.warn(`Server failed: ${server}`, error);
            }
        }

        if (!success) {
            console.error("All servers failed to respond.");
            setAllWorldChannels([]);
        }
    };

    return (
        <div className="stationlist-container">
            <h2 className="montserrat-title">Top 10 Radio Stations Around the World</h2>

            <div className="stationlist">
                {allWorldChannels.map((station) => (
                    <div key={station.stationuuid} className="stationlist-item">
                        <p className="inter-text">{station.country}</p>
                        <a href={station.homepage}>
                            <img src={station.favicon} alt={`${station.name} logo`} />
                        </a>
                        <h3 className="inter-text-bold">{station.name}</h3>
                        <p className="inter-text"><i className="fa-solid fa-thumbs-up"></i> {station.votes}</p>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default StationList;
