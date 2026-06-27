import logo from "../assets/BuildFolio_Logo.png";
import { Link } from "react-router-dom";

export default function HomeCommonHeader({headerButton}) {
    let button;

    if (headerButton === "Return To Home") {
        button=(<Link to="/" id="home-button">{headerButton}</Link>)
    } 
    else if (headerButton === "About Us") {
        button=(<Link to="/about-us" id="about-us-button">{headerButton}</Link>)
    }
    
    return (
        <>
            <div className="header">
                <div className="logo-section">
                    <img src={logo} alt="BuildFolio Logo" />
                </div>
                <div className="nav-section">
                    <nav>
                        {button} 
                        <Link to="/login-signup" id="login-signup-button">
                            <span>Login / Sign Up</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    )
}