import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionTab from "./QuestionTab.jsx";
import "./onboarding.css";

export default function Onboarding() {

  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);

  const [answers, setAnswers] = useState({
    currentStage: "",
    mainGoal: "",
    interestedField: "",
    codingConfidence: "",
    dailyTime: "",
    learningStyle: "",
    biggestStruggle: "",
    projectExperience: "",
    dsaComfort: "",
    motivation: "",
  });

  const questions = [
    {
      key: "currentStage",
      question: "What is your current stage?",
      options: ["Student", "Beginner", "Intermediate", "Advanced"]
    },
    {
      key: "mainGoal",
      question: "What is your main goal?",
      options: ["Get a job", "Build projects", "Learn coding", "Improve DSA"]
    },
    {
      key: "interestedField",
      question: "Which area interests you most?",
      options: [
        "Web Development",
        "App Development",
        "AI / Data / Machine Learning",
        "Problem Solving / Competitive Programming"
      ]
    },
    {
      key: "codingConfidence",
      question: "How confident are you in coding?",
      options: ["Very low", "Basic", "Moderate", "High"]
    },
    {
      key: "dailyTime",
      question: "How much time can you dedicate daily?",
      options: ["< 1 hour", "1–2 hours", "3–4 hours", "5+ hours"]
    },
    {
      key: "learningStyle",
      question: "How do you prefer learning?",
      options: [
        "Watching tutorials",
        "Building projects",
        "Solving problems",
        "Reading docs/articles"
      ]
    },
    {
      key: "biggestStruggle",
      question: "What do you struggle with most?",
      options: [
        "Understanding concepts",
        "Staying consistent",
        "Building projects",
        "Solving coding problems"
      ]
    },
    {
      key: "projectExperience",
      question: "Have you built any projects before?",
      options: [
        "No, none",
        "1–2 small projects",
        "Multiple projects",
        "Real-world / deployed projects"
      ]
    },
    {
      key: "dsaComfort",
      question: "How comfortable are you with problem solving (DSA)?",
      options: [
        "Never tried",
        "Basic questions",
        "Intermediate problems",
        "Advanced problems"
      ]
    },
    {
      key: "motivation",
      question: "What motivates you the most right now?",
      options: [
        "Getting placed / earning",
        "Building something cool",
        "Learning new skills",
        "Becoming better than peers"
      ]
    }
  ];

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login-signup");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login-signup");
          return;
        }

        if (data.isOnboarded) {
          navigate("/dashboard");
          return;
        }

        setAuthorized(true);
      } 
      catch (err) {
        console.error(err);
        navigate("/login-signup");
      } 
      finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [navigate]);


  const handleAnswer = (option) => {
    const currentQuestionKey = questions[currentStep].key;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionKey]: option,
    }));

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/onboarding", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },

        body: JSON.stringify({
          onboardingAnswers: answers,
          isOnboarded: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("isOnboarded", "true");
        navigate("/dashboard");
      } else {
        console.log(data.message);
      }

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="onboarding-container">
        <div className="background-animation" />
        <p className="checking-auth">Checking authentication...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  if (currentStep>=questions.length) {

    return (
      <div className="onboarding-container">
        <div className="background-animation" />
        <div className="completion-screen">
          <h2>You're all set 🚀</h2>
          <p>We've created your personalized BuildFolio profile.</p>
          <button onClick={handleSubmit} className="submit-btn">Continue to Dashboard</button>
          <button className="back-btn" onClick={handleBack}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="background-animation" />
      <div className="onboarding-header">
        <h1>Welcome to BuildFolio</h1>
        <p>
          Please answer a few questions so we can personalize your experience.
        </p>
        <p>
          Question {currentStep + 1} of {questions.length}
        </p>
      </div>
      <QuestionTab
        question={questions[currentStep].question}
        options={questions[currentStep].options}
        onAnswer={handleAnswer}
      />
      {currentStep > 0 && (
        <button
          className="back-btn"
          onClick={handleBack}
        >
          ← Back
        </button>
      )}
    </div>
  );
}