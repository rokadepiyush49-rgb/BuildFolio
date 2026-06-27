import { useEffect, useState } from "react";

import FeaturesCommonHeader from "../../Common_Components/FeaturesCommonHeader.jsx";
import FeaturesCommonFooter from "../../Common_Components/FeaturesCommonFooter.jsx";
import GithubAnalysisDashboard from "./GithubAnalysisDashboard.jsx";
import GithubSetup from "./GithubSetup.jsx";

import "./GithubAnalysis.css";

export default function GithubAnalysis() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/profile",
          {
            headers: {
              Authorization:
                "Bearer " +
                localStorage.getItem("token")
            }
          }
        );

        const data = await res.json();
        if (res.ok) {
          setUserData(data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <>
        <FeaturesCommonHeader />
        <div className="github-loading">
          Loading...
        </div>
        <FeaturesCommonFooter />
      </>
    );
  }

  return (
    <>
      <FeaturesCommonHeader />
      {!userData.githubUsername?(<GithubSetup userData={userData}/>):(<GithubAnalysisDashboard userData={userData}/>)}
      <FeaturesCommonFooter />
    </>
  );
}