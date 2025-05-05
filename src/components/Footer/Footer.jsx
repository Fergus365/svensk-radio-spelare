import { Link } from "react-router-dom";


function Footer() {
    return (
        <>
            <div className="spacer"></div>
            <div className="section-footer">
                <div className="wrapper">
                    <div className="footer-content">
                        <p className="inter-text-bold">Made by <Link to="#">Kristoffer Karlsson</Link></p>
                        <Link to="/privacy-policy" className="inter-text-bold">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
            <div className="spacer"></div>
        </>
    );
}

export default Footer;