import { useEffect, useState } from "react";

export default function GithubDashboard() {
  const [githubData, setGithubData]=useState(null);
  const [loading, setLoading]=useState(true);

  useEffect(() => {
    const fetchGithubAnalysis =
      async () => {
        try {
          const res =
            await fetch(
              "http://localhost:5000/github-analysis",
              {
                headers: {
                  Authorization:
                    "Bearer " +
                    localStorage.getItem("token")
                }
              }
            );

          const data =
            await res.json();
          setGithubData(data);
        }

        catch (err) {
          console.error(err);
        }

        finally {
          setLoading(false);
        }
      };

    fetchGithubAnalysis();
  }, []);

  if (loading) {
    return (
      <section className="github-dashboard">
        <h2>Loading GitHub Analysis...</h2>
      </section>
    );

  }

  if (!githubData) {
    return (
      <section className="github-dashboard">
        <h2>Unable to load GitHub data.</h2>
      </section>
    );

  }

  const totalLanguages = Object.values(githubData.languageDistribution || {}).reduce((sum, count) => sum + count,0);

  return (
    
    <section className="github-dashboard">

      <div className="github-dashboard-hero">
        <div className="github-dashboard-bg">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
          <div className="blob blob3"></div>
        </div>
        <div className="github-dashboard-hero-content">
          <div className="github-dashboard-user">
            <p className="github-dashboard-tag">GITHUB ANALYSIS</p>
            <h1>{githubData.name}</h1>
            <p className="github-username">@{githubData.username}</p>
            <p className="github-bio">{githubData.bio}</p>
          </div>
          <div className="github-score-card">
            <h2>GitHub Score</h2>
            <div className="github-score-circle">{githubData.githubScore}</div>
            <p>Based on activity, repository quality and consistency.</p>
          </div>
        </div>
      </div>

      <div className="github-section github-profile-overview">
        <h2>Profile Overview</h2>
        <div className="overview-grid">
          <div className="overview-card"><h3>{githubData.repositories}</h3><span>Repositories</span></div>
          <div className="overview-card"><h3>{githubData.followers}</h3><span>Followers</span></div>
          <div className="overview-card"><h3>{githubData.following}</h3><span>Following</span></div>
        </div>
      </div>

      <div className="github-section">
        <h2>Repository Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card"><h3>{githubData.repositories}</h3><span>Total Repositories</span></div>
          <div className="stat-card"><h3>{githubData.totalStars}</h3><span>Total Stars</span></div>
          <div className="stat-card"><h3>{githubData.totalForks}</h3><span>Total Forks</span></div>
          <div className="stat-card"><h3>{githubData.mostUsedLanguage}</h3><span>Most Used Language</span></div>
        </div>
      </div>

      <div className="github-section">
        <h2>Repository Language Breakdown</h2>
        <div className="language-list">
          {Object.entries(githubData.languageDistribution || {}).map(
            ([language, count], index) => {
              const percentage=totalLanguages>0?((count/totalLanguages)*100):0;
              return (
                <div key={index} className="language-row">
                  <span>{language}</span>
                      <div className="language-bar">
                        <div className="language-bar-fill" style={{ width: `${percentage}%`}}></div>
                      </div>
                  <span>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
            );}
          )}
        </div>
      </div>

      <div className="github-section">
        <h2>Top Repositories</h2>
        <div className="repo-list">
          {githubData.topRepositories?.map((repo, index) => (
            <div key={index} className="repo-card">
              <h3>{repo.name}</h3>
              <p>{repo.language || "No Primary Language"}</p>
              <span>⭐ {repo.stars}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="github-bottom-grid">
        <div className="github-section">
          <h2>Strengths</h2>
          <ul>{githubData.strengths?.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
        <div className="github-section">
          <h2>Recommendations</h2>
          <ul>{githubData.recommendations?.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}