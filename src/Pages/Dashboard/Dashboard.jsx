import DashboardHeader from "./DashboardHeader.jsx";
import DashboardHero from "./DashboardHero.jsx";
import DashboardMainSection from "./DashboardMainSection.jsx";
import DashboardFooter from "./DashboardFooter.jsx";

import "./dashboard.css";

export default function Dashboard() {
  return (
    <>
        <DashboardHeader />
        <DashboardHero />
        <DashboardMainSection />
        <DashboardFooter />
    </>
  );
}