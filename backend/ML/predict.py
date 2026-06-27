import ssl
import re
import pickle
import numpy as np
import nltk
import os
import warnings
warnings.filterwarnings("ignore")

from nltk.corpus import stopwords

ssl._create_default_https_context = ssl._create_unverified_context
nltk.download("stopwords", quiet=True)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "resume_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(ENCODER_PATH, "rb") as f:
    le = pickle.load(f)

# Keys MUST match the dataset category labels exactly (uppercase)
SKILL_MAP = {
    "INFORMATION-TECHNOLOGY": [
        "python",
        "java",
        "javascript",
        "react",
        "node",
        "mongodb",
        "sql",
        "git",
        "docker",
        "aws",
        "linux",
        "rest api",
        "c++",
    ],
    "ENGINEERING": [
        "python",
        "java",
        "c++",
        "data structures",
        "algorithms",
        "sql",
        "git",
        "linux",
        "project management",
        "autocad",
    ],
    "BUSINESS-DEVELOPMENT": [
        "sales",
        "lead generation",
        "crm",
        "negotiation",
        "market research",
        "b2b",
        "presentation",
    ],
    "FINANCE": [
        "financial modeling",
        "excel",
        "valuation",
        "accounting",
        "investment",
        "risk",
        "taxation",
    ],
    "ACCOUNTANT": [
        "accounting",
        "tally",
        "gst",
        "taxation",
        "excel",
        "financial reporting",
        "auditing",
    ],
    "ADVOCATE": [
        "litigation",
        "legal research",
        "contracts",
        "court",
        "compliance",
        "drafting",
    ],
    "AGRICULTURE": [
        "agronomy",
        "soil science",
        "irrigation",
        "crop management",
        "fertilizers",
        "horticulture",
    ],
    "APPAREL": [
        "fashion design",
        "textile",
        "pattern making",
        "merchandising",
        "garment",
        "cad",
    ],
    "ARTS": [
        "drawing",
        "painting",
        "adobe illustrator",
        "photoshop",
        "creative writing",
        "design",
    ],
    "AUTOMOBILE": [
        "autocad",
        "engine",
        "chassis",
        "automotive",
        "solidworks",
        "maintenance",
    ],
    "AVIATION": ["aviation", "aircraft", "navigation", "atc", "safety", "faa"],
    "BANKING": ["banking", "finance", "credit", "loans", "risk management", "kyc"],
    "BPO": [
        "customer service",
        "communication",
        "crm",
        "call center",
        "data entry",
        "english",
    ],
    "CHEF": [
        "cooking",
        "menu planning",
        "food safety",
        "kitchen management",
        "baking",
        "haccp",
    ],
    "CONSTRUCTION": [
        "autocad",
        "project management",
        "civil",
        "safety",
        "estimation",
        "site management",
    ],
    "CONSULTANT": [
        "consulting",
        "strategy",
        "stakeholder management",
        "presentation",
        "analysis",
        "project management",
    ],
    "DESIGNER": [
        "photoshop",
        "illustrator",
        "figma",
        "ui ux",
        "typography",
        "branding",
    ],
    "DIGITAL-MEDIA": [
        "social media",
        "seo",
        "content writing",
        "google analytics",
        "video editing",
        "marketing",
    ],
    "FITNESS": [
        "personal training",
        "nutrition",
        "exercise",
        "anatomy",
        "certification",
        "diet",
    ],
    "HEALTHCARE": [
        "patient care",
        "medical terminology",
        "ehr",
        "clinical",
        "nursing",
        "pharmacology",
    ],
    "HR": [
        "recruitment",
        "onboarding",
        "payroll",
        "employee relations",
        "hrms",
        "training",
    ],
    "PUBLIC-RELATIONS": [
        "media relations",
        "press release",
        "communication",
        "event management",
        "branding",
        "crisis management",
    ],
    "SALES": [
        "sales",
        "negotiation",
        "crm",
        "target",
        "communication",
        "product knowledge",
    ],
    "TEACHER": [
        "curriculum",
        "lesson planning",
        "classroom management",
        "assessment",
        "communication",
        "subject knowledge",
    ],
    # Extra user-intent categories for skill gap lookup when resume intent is detected
    "Data Science": [
        "python",
        "machine learning",
        "deep learning",
        "tensorflow",
        "pandas",
        "statistics",
        "sql",
        "nlp",
    ],
    "Java Developer": [
        "java",
        "spring boot",
        "hibernate",
        "maven",
        "sql",
        "rest api",
        "microservices",
    ],
    "DevOps Engineer": [
        "docker",
        "kubernetes",
        "jenkins",
        "aws",
        "linux",
        "terraform",
        "ci cd",
    ],
    "Python Developer": [
        "python",
        "django",
        "flask",
        "rest api",
        "sql",
        "docker",
        "git",
    ],
    "Web Designer": [
        "html",
        "css",
        "javascript",
        "react",
        "figma",
        "ui ux",
        "bootstrap",
    ],
}

COURSE_MAP = {
    "python": "Python for Everybody — Coursera",
    "machine learning": "ML Specialization — Andrew Ng (Coursera)",
    "deep learning": "Deep Learning Specialization — deeplearning.ai",
    "tensorflow": "TensorFlow Developer Certificate — Google",
    "sql": "SQL for Data Science — Coursera",
    "nlp": "NLP with Classification and Vector Spaces — Coursera",
    "docker": "Docker & Kubernetes: The Practical Guide — Udemy",
    "aws": "AWS Certified Solutions Architect — A Cloud Guru",
    "react": "React — The Complete Guide — Udemy",
    "java": "Java Masterclass — Udemy",
    "spring boot": "Spring Boot 3 & Spring Framework — Udemy",
    "kubernetes": "Certified Kubernetes Administrator (CKA) — Linux Foundation",
    "jenkins": "DevOps with Jenkins, Docker & Kubernetes — Udemy",
    "terraform": "HashiCorp Terraform Associate Certification",
    "selenium": "Selenium WebDriver with Java — Udemy",
    "figma": "UI/UX Design Bootcamp — Coursera",
    "excel": "Excel Skills for Business — Coursera",
    "financial modeling": "Financial Modeling & Valuation Analyst (FMVA) — CFI",
    "microservices": "Microservices with Spring Boot and Spring Cloud — Udemy",
    "ci cd": "GitHub Actions — The Complete Guide — Udemy",
    "linux": "The Linux Command Line Bootcamp — Udemy",
    "git": "Git & GitHub Crash Course — Udemy",
    "rest api": "REST API Design, Development & Management — Udemy",
}

PROJECT_MAP = {
    "python": "Build a Python REST API with FastAPI",
    "machine learning": "End-to-end ML Pipeline with scikit-learn",
    "deep learning": "Image Classifier using CNN (PyTorch/TensorFlow)",
    "tensorflow": "Sentiment Analysis using TensorFlow & LSTM",
    "pandas": "Exploratory Data Analysis Dashboard",
    "sql": "SQL-Based Inventory Management System",
    "nlp": "NLP Chatbot or Text Summarizer",
    "java": "Java Spring Boot CRUD REST API",
    "spring boot": "Microservices App with Spring Boot & Docker",
    "docker": "Dockerized Full-Stack Application",
    "kubernetes": "Deploy App on Kubernetes Cluster (Minikube)",
    "jenkins": "CI/CD Pipeline with Jenkins & GitHub",
    "aws": "Deploy App on AWS (EC2 + S3 + RDS)",
    "react": "React Dashboard with API Integration",
    "microservices": "Containerised Microservices with Docker Compose",
    "terraform": "Infrastructure as Code with Terraform on AWS",
    "ci cd": "Full CI/CD Pipeline with GitHub Actions",
    "linux": "Linux Shell Scripting Automation Suite",
    "git": "Open-Source Contribution / GitHub Project",
    "rest api": "RESTful API with Authentication (JWT)",
    "figma": "UI/UX Prototype for a Mobile App in Figma",
    "excel": "Excel Financial Model or Automation with VBA",
    "financial modeling": "Discounted Cash Flow Valuation Model",
}

# Maps dataset category → best user-intent key for richer skill gap lookup
CATEGORY_TO_INTENT = {
    "INFORMATION-TECHNOLOGY": "INFORMATION-TECHNOLOGY",
    "ENGINEERING": "ENGINEERING",
    "BUSINESS-DEVELOPMENT": "BUSINESS-DEVELOPMENT",
    "FINANCE": "FINANCE",
    "ACCOUNTANT": "ACCOUNTANT",
    "ADVOCATE": "ADVOCATE",
    "AGRICULTURE": "AGRICULTURE",
    "APPAREL": "APPAREL",
    "ARTS": "ARTS",
    "AUTOMOBILE": "AUTOMOBILE",
    "AVIATION": "AVIATION",
    "BANKING": "BANKING",
    "BPO": "BPO",
    "CHEF": "CHEF",
    "CONSTRUCTION": "CONSTRUCTION",
    "CONSULTANT": "CONSULTANT",
    "DESIGNER": "DESIGNER",
    "DIGITAL-MEDIA": "DIGITAL-MEDIA",
    "FITNESS": "FITNESS",
    "HEALTHCARE": "HEALTHCARE",
    "HR": "HR",
    "PUBLIC-RELATIONS": "PUBLIC-RELATIONS",
    "SALES": "SALES",
    "TEACHER": "TEACHER",
}

# ─────────────────────────────────────────────
# 1. CLEAN RESUME TEXT
# ─────────────────────────────────────────────


def clean_resume(text):
    text = re.sub(r"http\S+", " ", text)
    text = re.sub(r"RT|cc", " ", text)
    text = re.sub(r"#\S+", " ", text)
    text = re.sub(r"@\S+", " ", text)
    text = re.sub(r"[^\x00-\x7f]", " ", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    stop_words = set(stopwords.words("english"))
    words = [w for w in text.split() if w not in stop_words and len(w) > 2]
    return " ".join(words)

def skill_gap_analysis(resume_text, predicted_category):
    """
    Look up required skills for the predicted category.
    Falls back to checking resume keywords to infer a more specific role
    (e.g. if classified as ENGINEERING but resume mentions data science keywords).
    """
    resume_lower = resume_text.lower()

    # Try intent override: if resume text strongly signals a sub-role, use that
    intent_override = None
    if any(
        kw in resume_lower
        for kw in [
            "machine learning",
            "data scientist",
            "scikit",
            "pandas",
            "tensorflow",
            "deep learning",
        ]
    ):
        intent_override = "Data Science"
    elif (
        any(kw in resume_lower for kw in ["spring boot", "hibernate", "maven"])
        and "java" in resume_lower
    ):
        intent_override = "Java Developer"
    elif any(
        kw in resume_lower
        for kw in ["kubernetes", "terraform", "jenkins", "ci cd", "cicd"]
    ):
        intent_override = "DevOps Engineer"
    elif (
        any(kw in resume_lower for kw in ["django", "flask"])
        and "python" in resume_lower
    ):
        intent_override = "Python Developer"
    elif any(kw in resume_lower for kw in ["html", "css", "figma", "ui ux"]):
        intent_override = "Web Designer"

    lookup_key = (
        intent_override
        if intent_override
        else CATEGORY_TO_INTENT.get(predicted_category, predicted_category)
    )
    required = SKILL_MAP.get(lookup_key, SKILL_MAP.get(predicted_category, []))

    present = [s for s in required if s in resume_lower]
    missing = [s for s in required if s not in resume_lower]
    return present, missing, lookup_key

# ─────────────────────────────────────────────
# 10. RESUME SCORE
# ─────────────────────────────────────────────


def compute_resume_score(present, missing):
    total = len(present) + len(missing)
    if total == 0:
        return 50
    base = (len(present) / total) * 100
    bonus = min(5, len(present))
    return min(100, round(base + bonus))

# ─────────────────────────────────────────────
# 11. RECOMMENDATIONS
# ─────────────────────────────────────────────


def generate_skill_recommendations(missing_skills):
    recs = []
    for skill in missing_skills:
        course = COURSE_MAP.get(skill, f"Search '{skill}' on Coursera / Udemy")
        recs.append(
            {
                "skill": skill,
                "action": f"Learn / add '{skill}' to strengthen your profile",
                "course": course,
            }
        )
    return recs


def generate_project_recommendations(missing_skills, max_projects=5):
    projects, seen = [], set()
    for skill in missing_skills:
        proj = PROJECT_MAP.get(skill)
        if proj and proj not in seen:
            projects.append(proj)
            seen.add(proj)
        if len(projects) >= max_projects:
            break
    return projects

def get_top_matches(pipeline, cleaned_text, le, top_n=3):
    tfidf_vec = pipeline["tfidf"].transform([cleaned_text])
    clf = pipeline["clf"]

    if hasattr(clf, "decision_function"):
        scores = np.array(
            clf.decision_function(tfidf_vec)
        )
        if scores.ndim > 1:
            scores = scores[0]
    elif hasattr(clf, "predict_proba"):
        scores = clf.predict_proba(
            tfidf_vec
        )[0]
    else:
        pred = clf.predict(
            tfidf_vec
        )[0]
        return [
            {
                "rank": 1,
                "category": le.inverse_transform(
                    [pred]
                )[0],
                "score": 1.0
            }
        ]
    top_idx = np.argsort(
        scores
    )[::-1][:top_n]
    return [
        {
            "rank": rank + 1,
            "category": le.inverse_transform(
                [idx]
            )[0],
            "score": round(
                float(scores[idx]),
                4
            )
        }
        for rank, idx in enumerate(top_idx)
    ]

# ─────────────────────────────────────────────
# 13. ROLE DISPLAY MAP  — raw label → clean name for UI / JSON
# ─────────────────────────────────────────────

ROLE_DISPLAY_MAP = {
    # Intent-refined roles (sub-roles detected from resume text)
    "Data Science": "Data Scientist",
    "Java Developer": "Java Developer",
    "DevOps Engineer": "DevOps Engineer",
    "Python Developer": "Python Developer",
    "Web Designer": "Web / UI Designer",
    # Dataset category labels → readable names
    "INFORMATION-TECHNOLOGY": "Information Technology",
    "ENGINEERING": "Engineering",
    "BUSINESS-DEVELOPMENT": "Business Development",
    "FINANCE": "Finance",
    "ACCOUNTANT": "Accountant",
    "ADVOCATE": "Advocate / Legal",
    "AGRICULTURE": "Agriculture",
    "APPAREL": "Apparel / Fashion",
    "ARTS": "Arts & Creative",
    "AUTOMOBILE": "Automobile",
    "AVIATION": "Aviation",
    "BANKING": "Banking",
    "BPO": "BPO / Customer Service",
    "CHEF": "Chef / Culinary",
    "CONSTRUCTION": "Construction",
    "CONSULTANT": "Consultant",
    "DESIGNER": "Designer",
    "DIGITAL-MEDIA": "Digital Media",
    "FITNESS": "Fitness",
    "HEALTHCARE": "Healthcare",
    "HR": "Human Resources",
    "PUBLIC-RELATIONS": "Public Relations",
    "SALES": "Sales",
    "TEACHER": "Teacher / Education",
}

# ─────────────────────────────────────────────
# 14. FULL ANALYSIS FUNCTION
# ─────────────────────────────────────────────


def analyze_resume(resume_text, label=""):
    cleaned = clean_resume(resume_text)

    pred_id = model.predict([cleaned])[0]

    category = le.inverse_transform([pred_id])[0]

    top_matches = get_top_matches(model, cleaned, le)
    skills_found, missing_skills, role_used = skill_gap_analysis(resume_text, category)
    resume_score = compute_resume_score(skills_found, missing_skills)
    recommendations = generate_skill_recommendations(missing_skills)
    project_recs = generate_project_recommendations(missing_skills)

    # Use refined intent name if detected, otherwise fall back to formatted category name
    predicted_role_display = ROLE_DISPLAY_MAP.get(
        role_used, ROLE_DISPLAY_MAP.get(category, category)
    )

    # Clean top_matches category names too
    top_matches_display = [
        {**m, "category": ROLE_DISPLAY_MAP.get(m["category"], m["category"])}
        for m in top_matches
    ]

    return {
        "predicted_role": predicted_role_display,  # clean name → use this on frontend
        "resume_score": resume_score,  # int 0–100
        "top_matches": top_matches_display,  # list of {rank, category, score}
        "skills_found": skills_found,  # list of strings
        "missing_skills": missing_skills,  # list of strings
        "recommendations": recommendations,  # list of {skill, action, course}
        "project_recommendations": project_recs,  # list of strings
    }

def predict_resume(resume_text):
    return analyze_resume(resume_text)


if __name__ == "__main__":
    import sys
    import json

    try:
        resume_text = (
            sys.stdin.read()
            .strip()
        )
        if not resume_text:
            print(
                json.dumps(
                    {
                        "error":
                        "No resume text received"
                    }
                )
            )
            sys.exit(0)

        result = predict_resume(
            resume_text
        )
        print(
            json.dumps(
                result,
                ensure_ascii=False
            )
        )
    except Exception as e:
        print(
            json.dumps(
                {
                    "error": str(e)
                }
            )
        )