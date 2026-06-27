import HomeCommonHeader from "../../Common_Components/HomeCommonHeader.jsx";
import HomeCommonFooter from "../../Common_Components/HomeCommonFooter.jsx";
import HomeHero from "./HomeHero.jsx";
import HomeInfoCards from "./HomeInfoCards.jsx";

import "./home.css";

export default function Home() {
  return (
    <>
        <HomeHero>
            <HomeCommonHeader headerButton={"About Us"}/>
        </HomeHero>
        <HomeInfoCards />
        <HomeCommonFooter />
    </>
  );
}