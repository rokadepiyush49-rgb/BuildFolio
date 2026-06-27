import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import About from "./Pages/About_Us/About.jsx";

import Onboard from "./Pages/Onboarding/Onboard.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";

import ResumeAnalysis from "./Pages/ResumeAnalysis/ResumeAnalysis.jsx";
import GithubAnalysis from "./Pages/GithubAnalysis/GithubAnalysis.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login-signup" element={<Login />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/onboarding" element={<Onboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume-analysis" element={<ResumeAnalysis />} />
      <Route path="/github-analysis" element={<GithubAnalysis />} />
    </Routes>
  );
}

export default App;