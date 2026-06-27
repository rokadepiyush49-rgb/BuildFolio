const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const {
  analyzeGithub
} = require("../controllers/githubController");

router.patch(
  "/github-username",
  authMiddleware,
  async (req, res) => {
    try {
      const { githubUsername } = req.body;

      if (!githubUsername) {
        return res.status(400).json({
          message: "GitHub username is required"
        });
      }

      const user = await User.findById(
        req.user.id
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if (user.githubUsername) {
        return res.status(400).json({
          message:
            "GitHub username already linked"
        });
      }

      const existingUser =
        await User.findOne({
          githubUsername
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "GitHub username already in use"
        });
      }

      user.githubUsername=githubUsername.trim();

      await user.save();
      return res.status(200).json({
        message:
          "GitHub username saved successfully",

        githubUsername:
          user.githubUsername
      });
    }

    catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

router.get(
  "/github-analysis",
  authMiddleware,
  analyzeGithub
);

module.exports = router;