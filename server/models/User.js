const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema({
  date: Date,
  message: String,
  additions: Number,
  deletions: Number,
  sha: String,
  url: String,
});

const prSchema = new mongoose.Schema({
  id: Number,
  number: Number,
  title: String,
  state: String,
  status: String,
  created_at: Date,
  updated_at: Date,
  merged: Boolean,
  merged_at: Date,
  html_url: String,
  repo: String,
});

const commitStatsSchema = new mongoose.Schema({
  repo: String,
  totalCommits: Number,
  commits: [commitSchema],
});

const pullRequestDataSchema = new mongoose.Schema({
  total: Number,
  open: Number,
  closed: Number,
  avgMergeTime: Number,
});

const qualityDataSchema = new mongoose.Schema({
  repoCount: Number,
  popularity: Number,
  activeProjects: Number,
  communityEngagement: Number,
  resolutionTime: {
    Critical: Number,
    High: Number,
    Medium: Number,
    Low: Number,
  },
});

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: String,
  displayName: String,
  avatar: String,
  email: String,
  accessToken: String,
  isoc_id: { type: String, unique: true },
  ongoingprojects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repo" }],
  joinedAt: Date,
  followers: Number,
  following: Number,
  pullRequests: [prSchema],
  commitStats: [commitStatsSchema],
  pullRequestData: pullRequestDataSchema,
  qualityData: qualityDataSchema,
});

module.exports = mongoose.model("User", userSchema);
