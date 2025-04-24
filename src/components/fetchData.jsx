
function useFetchData() {

    const fetchData = async (countryCode) => {
        console.log('fetchData', countryCode);
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
                    console.log('fetchData', httpsChannels);
                    return httpsChannels;
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