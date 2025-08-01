
function useFetchData() {

    // Helper function to check for unplayable audio formats
    const isUnplayableAudioFormat = (url) => {
        // Unplayable formats for <audio> tag (e.g., playlist formats and video formats)
        const unplayableAudioExtensions = /\.(m3u|m3u8|pls|asx|mp4|webm)$/i;
        return unplayableAudioExtensions.test(url);
    };

    const fetchData = async (countryCode) => {
        const apiServers = [
            `https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`,
            `https://fr1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`,
            `https://nl1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`,
            `https://us1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`,
            `https://at1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`,
            `https://all.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`,
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

                    return filteredChannels;
                }
            } catch (error) {
                console.warn(`Server failed: ${server}`, error);
            }
        }

        if (!success) {
            throw new Error("All servers failed to respond.");
        }
    };

    return { fetchData };
}

export default useFetchData;