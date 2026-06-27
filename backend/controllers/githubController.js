const User = require("../models/User");
const fetchGithubData = require("../services/githubService");

exports.analyzeGithub = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.githubUsername) {
      return res.status(400).json({
        message: "GitHub username not linked"
      });
    }

    const githubData =
      await fetchGithubData(
        user.githubUsername
      );

    const githubUser =
      githubData.user;

    const repos =
      githubData.repos;

    let stars = 0;
    let forks = 0;

    const languageCount = {};

    repos.forEach(repo => {
      stars += repo.stargazers_count;
      forks += repo.forks_count;
      if (repo.language) {
        languageCount[repo.language] =
          (languageCount[repo.language] || 0) + 1;
      }
    });

    const mostUsedLanguage =
      Object.keys(languageCount)
        .sort(
          (a, b) =>
            languageCount[b] -
            languageCount[a]
        )[0] || "N/A";

    const topRepositories =
      [...repos]
        .sort(
          (a, b) =>
            b.stargazers_count -
            a.stargazers_count
        )
        .slice(0, 4)
        .map(repo => ({
          name: repo.name,
          language: repo.language,
          stars: repo.stargazers_count
        }));

    let githubScore = 0;

    if (repos.length >= 20)
        githubScore += 30;

    else if (repos.length >= 10)
        githubScore += 20;

    else if (repos.length >= 5)
        githubScore += 10;

    else
        githubScore += 5;

    if (stars >= 20)
        githubScore += 20;

    else if (stars >= 10)
        githubScore += 10;

    else
        githubScore += 5;

    if (githubUser.followers >= 30)
        githubScore += 15;

    else if (githubUser.followers >= 10)
        githubScore += 10;

    else
        githubScore += 5;

    if (Object.keys(languageCount).length >= 4)
        githubScore += 20;

    else if (Object.keys(languageCount).length >= 3)
        githubScore += 15;

    else if (Object.keys(languageCount).length >= 2)
        githubScore += 10;

    else
        githubScore += 5;

    githubScore+= 15;
    githubScore= Math.min(100,githubScore);

    const strengths= [
      "Consistent repository activity",
      "Strong coding profile",
      "Technology diversity",
      "Active development"
    ];

    const recommendations= [
      "Improve documentation",
      "Add more projects",
      "Contribute to open source",
      "Increase testing"
    ];

    user.githubScore=githubScore;
    user.portfolioScore =Math.round(((user.resumeScore || 0) * 0.6) +(githubScore * 0.4));

    user.githubAnalysis = {
      followers: githubUser.followers,

      following: githubUser.following,

      repositories: githubUser.public_repos,

      totalStars: stars,

      totalForks: forks,

      mostUsedLanguage,

      languageDistribution: languageCount,

      topRepositories,

      strengths,

      recommendations,

      lastGithubAnalysis:
        new Date()
    };

    await user.save();
    return res.json({
      name: githubUser.name,

      username: githubUser.login,

      bio: githubUser.bio,

      followers: githubUser.followers,

      following: githubUser.following,

      repositories: githubUser.public_repos,

      githubScore,

      totalStars: stars,

      totalForks: forks,

      mostUsedLanguage,

      languageDistribution: languageCount,

      topRepositories,

      strengths,

      recommendations
    });
  }

  catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};