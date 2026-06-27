const express = require("express");
const router = express.Router();

const { spawn } = require("child_process");

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post(
    "/analyze-resume",
    authMiddleware,
    async (req, res) => {
        try {
            const { resumeText } = req.body;
            if (!resumeText) {
                return res.status(400).json({
                    message: "Resume text is required"
                });
            }

            const pythonProcess = spawn(
                "python",
                ["ML/predict.py"]
            );

            let result = "";
            let error = "";

            pythonProcess.stdout.on(
                "data",
                (data) => {
                    result += data.toString();
                }
            );

            pythonProcess.stderr.on(
                "data",
                (data) => {
                    error += data.toString();
                }
            );

            pythonProcess.on(
                "close",
                async (code) => {
                    if (code !== 0) {
                        return res.status(500).json({
                            message: "Python script failed",
                            error
                        });
                    }

                    try {
                        const parsed=JSON.parse(result.trim());
                        const user=await User.findById(req.user.id);

                        const portfolioScore =Math.round((parsed.resume_score * 0.6) +((user.githubScore || 0) * 0.4));
                        await User.findByIdAndUpdate(
                            req.user.id,
                            {
                                resumeScore:parsed.resume_score,
                                predictedRole:parsed.predicted_role,
                                portfolioScore:portfolioScore
                            },
                        );
                        return res.json(parsed);
                    }

                    catch (err) {
                        console.error(
                            "JSON Parse Error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Invalid JSON returned by ML model"
                        });
                    }

                }
            );
            pythonProcess.stdin.write(resumeText);
            pythonProcess.stdin.end();
        }

        catch (err) {
            console.error(err);

            return res.status(500).json({
                message: "Analysis failed"
            });
        }
    }
);

module.exports = router;