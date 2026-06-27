import logo from "../assets/BuildFolio_Logo.png";
import { Link } from "react-router-dom";

export default function FeaturesCommonFooter() {
    return (
        <>
            <footer className="footer">

            <div className="footer-section">
                <img src={logo} alt="BuildFolio Logo" className="footer-logo"/>
                <p className="footer-text">
                    © 2026 BuildFolio. All rights reserved.
                </p>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-section">
                <h3 className="footer-heading">Quick Links</h3>
                <div className="footer-links">
                    <Link to="/" className="footer-link">
                        Return to Home
                    </Link>
                    <Link to="/about-us" className="footer-link">
                        About Us
                    </Link>
                    <Link to="/dashboard" className="footer-link">
                        Dashboard
                    </Link>
                </div>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-section">
                <h3 className="footer-heading">Created By</h3>
                <p className="footer-text">
                    Sarthak Tathya Pisal <br />
                    Piyush Dinesh Sohanda <br />
                    Piyush Nitin Rokade <br />
                    Poojith Pagadekal
                </p>
            </div>
        </footer>
        </>
    )
}