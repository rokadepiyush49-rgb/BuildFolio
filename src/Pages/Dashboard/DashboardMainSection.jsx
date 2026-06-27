import { Link } from "react-router-dom";

export default function DashboardMainSection() {
  return (
    <section className="dashboard-main-section">
      <div className="dashboard-grid">

        <Link to="/github-analysis" className="dashboard-feature-card" id="github-analysis-button">
          <div className="feature-card-content">
            <h2 className="feature-title">GitHub Analysis</h2>
            <p className="feature-description">Analyze your repositories, coding consistency, commit activity, and overall GitHub profile strength to understand how recruiters may perceive your development journey.</p>
            <div className="feature-line"></div>
            <p className="feature-navigation"><span>Open GitHub Insights →</span></p>
          </div>
        </Link>

        <Link to="/resume-analysis" className="dashboard-feature-card" id="skill-analysis-button">
          <div className="feature-card-content">
            <h2 className="feature-title">Resume Analysis & Recommendations</h2>
            <p className="feature-description">Understand your current technical strengths, identify weak areas, and receive structured recommendations for improving your overall development skillset.</p>
            <div className="feature-line"></div>
            <p className="feature-navigation"><span>View Resume Breakdown →</span></p>
          </div>
        </Link>

      </div>
    </section>
  );
}