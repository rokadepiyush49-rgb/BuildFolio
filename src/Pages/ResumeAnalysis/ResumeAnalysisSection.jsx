import { useState } from "react";

export default function ResumeAnalysisSection() {
  const [resumeText, setResumeText] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatSkill = (skill) => {
    return skill.toUpperCase();
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert("Please paste resume text first");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/analyze-resume",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            resumeText
          })
        }
      );

      if (!res.ok) {
        throw new Error("Backend Error");
      }

      const data = await res.json();
      console.log(
        "Analysis Result:",
        data
      );
      setAnalysisData(data);
    }

    catch (err) {
      console.error(err);

      alert(
        "Resume analysis failed"
      );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <section className="skill-analysis-page">
      <section className="skill-hero">
        <div className="skill-hero-bg">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
          <div className="blob blob3"></div>
        </div>

        <div className="skill-hero-content">
          <div className="skill-left">
            <p className="skill-tag">RESUME ANALYSIS & RECOMMENDATIONS</p>
            <h1>Analyze Your Resume</h1>

            <p>
              Analyze your resume, uncover skill gaps,
              and receive tailored learning paths and
              project recommendations to strengthen
              your portfolio.
            </p>
          </div>
          <div className="skill-input-card">
            <h2>Resume Input</h2>
            <textarea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) =>
                setResumeText(
                  e.target.value
                )
              }
            />

            <button
              onClick={handleAnalyze} disabled={loading}>
              {
                loading
                  ? "Analyzing..."
                  : "Analyze Resume"
              }
            </button>
          </div>
        </div>
      </section>

      {
        analysisData && (
          <>
            <section className="analysis-overview">
              <div className="analysis-score-card">
                <h2>Resume Score</h2>
                <div className="score-circle">
                  {analysisData.resume_score}/100
                </div>
              </div>

              <div className="analysis-role-card">
                <h2>Predicted Role Based on your Resume</h2>
                <h1>{analysisData.predicted_role}</h1>
              </div>
            </section>

            <section className="analysis-section">
              <h2>Top Career Matches Recommended for you</h2>
              <div className="top-matches-grid">
                {
                  analysisData.top_matches?.map(
                    (match) => (
                      <div key={match.rank} className="match-card">
                        <h3>#{match.rank}</h3>
                        <p>{match.category}</p>
                      </div>
                    )
                  )
                }
              </div>
            </section>

            <section className="skills-grid">
              <div className="skills-card">
                <h2>Skills Found</h2>
                <ul>
                  {
                    analysisData.skills_found?.map(
                      (skill, index) => (
                        <li key={index}>
                          {formatSkill(skill)}
                        </li>
                      )
                    )
                  }
                </ul>
              </div>

              <div className="skills-card">
                <h2>Skills you can add to your resume</h2>
                <ul>
                  {
                    analysisData.missing_skills?.map(
                      (skill, index) => (
                        <li key={index}>
                          {formatSkill(skill)}
                        </li>
                      )
                    )
                  }
                </ul>
              </div>
            </section>

            <section className="analysis-section">
              <h2>Recommended Courses for a better Learning Path</h2>
              <div className="recommendation-grid">
                {
                  analysisData.recommendations?.map(
                    (item, index) => (
                      <div key={index} className="recommendation-card">
                        <h3>{formatSkill(item.skill)}</h3>
                        <p>{item.course}</p>
                      </div>
                    )
                  )
                }
              </div>
            </section>

            <section className="analysis-section">
              <h2>Suggested Projects</h2>
              <div className="project-grid">
                {
                  analysisData.project_recommendations?.length > 0
                    ? (
                      analysisData.project_recommendations.map(
                        (project, index) => (
                          <div key={index} className="project-card">
                            {project}
                          </div>
                        )
                      )
                    )
                    : (
                      <p>No project recommendations available.</p>
                    )
                }
              </div>
            </section>
          </>
        )
      }
    </section>
  );
}