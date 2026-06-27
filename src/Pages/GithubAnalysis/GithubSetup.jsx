import { useState } from "react";

export default function GithubSetup({ userData }) {
  const [githubUsername,setGithubUsername]=useState("");
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!githubUsername.trim()) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:5000/github-username",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              "Bearer " +
              localStorage.getItem("token")
          },

          body: JSON.stringify({
            githubUsername
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(
          "GitHub account linked successfully."
        );

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage(
          data.message ||
          "Failed to save username."
        );
      }
    } catch (err) {
      console.error(err);
      setMessage(
        "Something went wrong."
      );
    }
    setSaving(false);
  };

  return (
    <section className="github-setup-section">

      <div className="github-setup-bg">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>

      <div className="github-setup-content">
        <div className="github-setup-left">
          <p className="github-setup-tag">GITHUB ANALYSIS</p>
          <h1 className="github-setup-name">Hello, {userData.name}</h1>

          <p className="github-setup-description">
            Connect your GitHub account to unlock
            repository analysis, contribution
            tracking, portfolio insights and
            personalized recommendations.
          </p>

          <p className="github-setup-note">
            This username can only be linked
            once and will become permanently
            associated with your BuildFolio
            profile.
          </p>
        </div>

        <div className="github-setup-card">
          <h2>Connect GitHub</h2>
          <p>Enter your GitHub username</p>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="e.g. piyushsohanda" value={githubUsername} onChange={(e) =>
                setGithubUsername(
                  e.target.value
                )
              } required/>
            <button
              type="submit"
              disabled={saving}
            >
              {
                saving
                  ? "Saving..."
                  : "Save Username"
              }
            </button>
          </form>
          {message && <p className="github-message">{message}</p>}
        </div>
      </div>
    </section>
  );
}