import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function GDPRConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if the user has already given consent
        const consent = localStorage.getItem("gdprConsent");
        if (!consent) {
            setShowBanner(true); // Show the banner if no consent is found
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("gdprConsent", "true"); // Store consent in localStorage
        setShowBanner(false); // Hide the banner
    };

    const handleDeny = () => {
        setShowBanner(false); // Hide the banner
    };

    return (
        showBanner && (
            <div className="GDPR-banner">
                <p className="inter-text GDPR-text">
                    We use cookies to improve your experience. By using our site, you agree to our{" "}
                    <Link to="/privacy-policy" className="inter-text-bold GDPR-link">
                        Privacy Policy
                    </Link>.
                </p>
                <div className="GDPR-button-container">
                    <button onClick={handleAccept} className="inter-text-bold GDPR-button">
                        Accept
                    </button>
                    <button onClick={handleDeny} className="inter-text-bold GDPR-button">
                        Deny
                    </button>
                </div>
            </div>
        )
    );
}

export default GDPRConsent;