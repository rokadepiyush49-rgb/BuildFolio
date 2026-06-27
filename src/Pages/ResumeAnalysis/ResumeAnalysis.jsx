import FeaturesCommonHeader from "../../Common_Components/FeaturesCommonHeader.jsx";
import FeaturesCommonFooter from "../../Common_Components/FeaturesCommonFooter.jsx";
import ResumeAnalysisSection from "./ResumeAnalysisSection.jsx";

import "./ResumeAnalysis.css";

export default function ResumeAnalysis() {
    return (
        <>
            <FeaturesCommonHeader />
            <ResumeAnalysisSection />
            <FeaturesCommonFooter />
        </>
    );
}