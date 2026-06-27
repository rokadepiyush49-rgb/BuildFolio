const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authMiddleware = require("./middleware/authMiddleware");

const User = require("./models/User");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/githubRoutes"));
app.use("/",require("./routes/skillAnalysisRoutes"));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

app.post("/onboarding", authMiddleware, async (req, res) => {
  try {
    const { onboardingAnswers } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        onboardingAnswers,
        isOnboarded: true,
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Onboarding completed successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});