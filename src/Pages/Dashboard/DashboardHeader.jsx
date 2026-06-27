import logo from "../../assets/BuildFolio_Logo.png";
import { Link } from "react-router-dom";

export default function DashboardHeader() {
    return (
        <>
            <div className="header">
                <div className="logo-section">
                    <img src={logo} alt="BuildFolio Logo" />
                </div>
                <div className="nav-section">
                    <nav>
                        <Link to="/" id="home-button">
                            Return to Home
                        </Link>
                        <Link to="/github-analysis" id="home-button">
                            <span>Github Analysis</span>
                        </Link>
                        <Link to="/resume-analysis" id="home-button">
                            <span>Resume Analysis & Recommendations</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    )
}