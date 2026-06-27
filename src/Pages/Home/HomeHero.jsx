import bg from "../../assets/hero_section_bg.jpg";

import { Link } from "react-router-dom";

export default function HomeHero({children}) {
    return (
        <>
            {children}
            <div className="hero-section" style={{ backgroundImage: `url(${bg})` }}>
                <div className="hero-content">
                    <h1>Build Projects that Build Your Portfolio</h1>

                    <p>
                        Get personalized project recommendations, analyze your GitHub,
                        and improve your chances of internships.
                    </p>

                    <Link to="/login-signup" className="hero-btn">
                        <span>Analyze My Portfolio</span>
                    </Link>
                </div>
            </div>
        </>
    )
}