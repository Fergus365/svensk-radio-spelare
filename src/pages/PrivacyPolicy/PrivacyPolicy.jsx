import React from "react";
import { Link } from "react-router-dom"

function PrivacyPolicy() {
    return (
        <>
            <div className="wrapper full-page privacypolicy">
                <Link className="inter-text-bold" to='/'><i className="fa-solid fa-arrow-left"></i> Go back</Link>
                <div className="privacypolicy-container">
                    <h2 className="montserrat-title">Privacy Policy</h2>
                    <p className="inter-text"><strong>Effective Date:</strong> May 1, 2025</p>
                    <br />
                    <h3 className="inter-text-bold">1. Introduction</h3>
                    <p className="inter-text">
                        This Privacy Policy explains how this website (“we”, “us”, “our”) collects and processes your personal data in accordance with the General Data Protection Regulation (GDPR).
                        We are committed to protecting your privacy and only collect the minimum amount of data necessary to deliver our radio streaming services.
                    </p>
                    <br />
                    <h3 className="inter-text-bold">2. Data Controller & Contact</h3>
                    <p className="inter-text">
                        The data controller for this website is its owner.
                        If you have any questions about this Privacy Policy or wish to exercise your rights under the GDPR, please contact us using our contact form:
                        <strong> https://yourwebsite.com/contact</strong>
                    </p>
                    <br />
                    <h3 className="inter-text-bold">3. What Data We Collect</h3>
                    <p className="inter-text">We collect the following information:</p>
                    <ul>
                        <li className="inter-text"><strong className="inter-text-bold">IP Address:</strong> Used temporarily to determine your country (e.g., SE for Sweden).</li>
                        <li className="inter-text"><strong className="inter-text-bold">Country Code:</strong> Detected from your IP to load local radio stations.</li>
                        <li className="inter-text"><strong className="inter-text-bold">Basic browser data:</strong> Such as browser type and visit time for security and performance.</li>
                    </ul>
                    <br />
                    <h3 className="inter-text-bold">4. Purpose of Processing</h3>
                    <p className="inter-text">We use your IP address and country code solely to:</p>
                    <ul className="inter-text">
                        <li>Show radio stations from your country</li>
                        <li>Improve user experience through localization</li>
                        <li>Maintain website functionality and basic analytics</li>
                    </ul>
                    <p className="inter-text">We do <strong>not</strong> store full IP addresses permanently or use the data for profiling or ads.</p>
                    <br />
                    <h3 className="inter-text-bold">5. Legal Basis</h3>
                    <p className="inter-text">
                        We rely on <strong>legitimate interest</strong> (Article 6(1)(f) GDPR) to process minimal data for essential functionality.
                    </p>
                    <br />
                    <h3 className="inter-text-bold">6. Data Retention</h3>
                    <p className="inter-text">
                        We only process geolocation data during your visit.
                        We do not retain this data after the session, except anonymized logs for security.
                    </p>
                    <br />
                    <h3 className="inter-text-bold">7. Your Rights Under GDPR</h3>
                    <p className="inter-text">You have the right to:</p>
                    <ul className="inter-text">
                        <li>Access your personal data</li>
                        <li>Request correction or deletion</li>
                        <li>Object to or restrict processing</li>
                        <li>File a complaint with your local authority</li>
                    </ul>
                    <p className="inter-text">
                        To exercise your rights, contact us here:
                        <strong> https://yourwebsite.com/contact</strong>
                    </p>
                    <br />
                    <h3 className="inter-text-bold">8. Data Sharing</h3>
                    <p className="inter-text">
                        We do not sell, rent, or share your data with third parties.
                        We may use trusted hosting or infrastructure providers under GDPR-compliant agreements.
                    </p>
                    <br />
                    <h3 className="inter-text-bold">9. Cookies</h3>
                    <p className="inter-text">
                        We only use cookies essential for site functionality.
                        No tracking or advertising cookies are used.
                    </p>
                    <br />
                    <h3 className="inter-text-bold">10. Changes</h3>
                    <p className="inter-text">
                        We may update this Privacy Policy as needed.
                        Changes will be posted on this page with a new "Effective Date".
                    </p>
                </div>
            </div>
        </>
    );
}

export default PrivacyPolicy;