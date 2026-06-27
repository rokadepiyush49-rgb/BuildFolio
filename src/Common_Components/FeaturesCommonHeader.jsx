import logo from "../assets/BuildFolio_Logo.png";
import { Link } from "react-router-dom";

export default function FeaturesCommonHeader() {
    return (
        <>
            <div className="header">
                <div className="logo-section">
                    <img src={logo} alt="BuildFolio Logo" />
                </div>
                <div className="nav-section">
                    <nav>
                        <Link to="/dashboard" id="home-button">
                            Return to Dashboard
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    )
}