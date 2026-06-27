import { useEffect, useState } from "react";

export default function DashboardHero() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/profile",
          {
            headers: {
              Authorization:
                "Bearer " +
                localStorage.getItem("token"),
            },
          }
        );
        const data = await res.json();
        setUserData(data);
      }
      catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!userData) {
    return (
      <section className="dashboard-hero-loading">
        <h2>Loading Dashboard...</h2>
      </section>
    );
  }

  const portfolioScore=userData.portfolioScore || 0;

  return (
    <section className="dashboard-hero">
      <div className="dashboard-fluid-bg">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>

      <div className="dashboard-hero-content">
        <div className="dashboard-user-info">
          <p className="dashboard-greeting">Welcome Back</p>

          <h1 className="dashboard-username">
            {userData.name}
          </h1>

          <div className="dashboard-user-details">
            <p className="dashboard-detail">
              Email ID: {userData.email}
            </p>
          </div>
        </div>

        <div className="dashboard-score-card">
          <p className="score-card-title">
            Portfolio Score
          </p>
          <div className="gauge-wrapper">
            <svg
              className="gauge-svg"
              viewBox="0 0 200 120"
            >
              <defs>
                <linearGradient
                  id="gaugeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor="#3B82F6"
                  />
                  <stop
                    offset="100%"
                    stopColor="#38BDF8"
                  />
                </linearGradient>
              </defs>

              <path
                className="gauge-bg"
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
              />
              <path
                className="gauge-progress"
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                pathLength="100"
                strokeDasharray={`${portfolioScore} 100`}
              />
            </svg>

            <div className="gauge-score">
              <h2>{portfolioScore}</h2>
              <span>/100</span>
            </div>
          </div>

          <p className="score-insight">
            {portfolioScore >= 85? "Excellent portfolio strength.": portfolioScore >= 70? "Strong portfolio with room for growth.": portfolioScore >= 50? "Good start. Continue improving skills.": "Build more skills and projects to improve your score."}
          </p>
        </div>
      </div>
    </section>
  );
}