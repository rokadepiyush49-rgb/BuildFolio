import HomeCommonHeader from "../../Common_Components/HomeCommonHeader.jsx";
import HomeCommonFooter from "../../Common_Components/HomeCommonFooter.jsx";
import AboutHero from "./AboutHero.jsx";
import AboutInfoCards from "./AboutInfoCards.jsx";
import AboutTeam from "./AboutTeam.jsx";

import "./about.css";

export default function About() {
    return (
        <>
            <HomeCommonHeader headerButton={"Return To Home"}/>
            <AboutHero />
            <AboutInfoCards />
            <AboutTeam />
            <HomeCommonFooter />
        </>
    )
}