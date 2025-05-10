const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email", "repo"],
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const headers = {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "IEEE-SOC-App",
          };

          // Get user email
          const emailRes = await axios.get(
            "https://api.github.com/user/emails",
            { headers }
          );
          const primaryEmail =
            emailRes.data.find((e) => e.primary && e.verified)?.email || null;

          // Get user metadata
          const userRes = await axios.get("https://api.github.com/user", {
            headers,
          });
          const { followers, following, created_at: joinedAt } = userRes.data;

          const username = profile.username;

          // Choose your target repo
          const repoOwner = "ieee-cs-bmsit"; // Can be user or org
          const repoName = "ISoC2025";

          // Additional repo to track (user-owned)
          const additionalRepoOwner = "Arnabpaul0101";
          const additionalRepoName = "CopyPal";

          const allReposToTrack = [
            { repoOwner, repoName },
            { repoOwner: additionalRepoOwner, repoName: additionalRepoName },
          ];

          // Fetch PRs, Commits, Quality metrics for each tracked repo
          let allDetailedPRs = [];
          let allCommitStats = [];
          let aggregatePullRequestData = {
            total: 0,
            open: 0,
            closed: 0,
            avgMergeTime: 0,
          };

          let totalMergedDurations = [];

          for (const { repoOwner, repoName } of allReposToTrack) {
            const q = `repo:${repoOwner}/${repoName} type:pr author:${username}`;
            let page = 1;
            let allPRs = [];

            while (true) {
              const res = await axios.get(
                "https://api.github.com/search/issues",
                {
                  headers,
                  params: { q, per_page: 100, page },
                }
              );
              if (res.data.items.length === 0) break;
              allPRs = allPRs.concat(res.data.items);
              page++;
            }

            let mergedDurations = [];
            let detailedPRs = [];

            for (const pr of allPRs) {
              const number = pr.number;

              const prDetails = await axios.get(
                `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${number}`,
                { headers }
              );

              const prData = prDetails.data;

              if (prData.merged_at) {
                const created = new Date(prData.created_at);
                const merged = new Date(prData.merged_at);
                const days = (merged - created) / (1000 * 60 * 60 * 24);
                mergedDurations.push(days);
                totalMergedDurations.push(days);
              }

              detailedPRs.push({
                id: prData.id,
                number: prData.number,
                title: prData.title,
                state: prData.state,
                created_at: prData.created_at,
                updated_at: prData.updated_at,
                html_url: prData.html_url,
                status: prData.merged_at ? "merged" : prData.state,
                merged: !!prData.merged_at,
                merged_at: prData.merged_at,
                repo: `${repoOwner}/${repoName}`,
              });
            }

            const pullRequestData = {
              total: detailedPRs.length,
              open: detailedPRs.filter((pr) => pr.state === "open").length,
              closed: detailedPRs.filter(
                (pr) => pr.state === "closed" || pr.status === "merged"
              ).length,
              avgMergeTime: mergedDurations.length
                ? mergedDurations.reduce((a, b) => a + b, 0) /
                  mergedDurations.length
                : 0,
            };

            aggregatePullRequestData.total += pullRequestData.total;
            aggregatePullRequestData.open += pullRequestData.open;
            aggregatePullRequestData.closed += pullRequestData.closed;

            allDetailedPRs = allDetailedPRs.concat(detailedPRs);

            // Commits
            const commitsRes = await axios.get(
              `https://api.github.com/repos/${repoOwner}/${repoName}/commits?author=${username}&per_page=100`,
              { headers }
            );

            const commitDetails = [];
            for (const c of commitsRes.data) {
              const fullCommit = await axios.get(
                `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${c.sha}`,
                { headers }
              );
              const stats = fullCommit.data.stats;
              commitDetails.push({
                date: c.commit.author.date,
                message: c.commit.message,
                additions: stats.additions,
                deletions: stats.deletions,
                sha: c.sha,
                url: c.html_url,
              });
            }

            allCommitStats.push({
              repo: repoName,
              totalCommits: commitDetails.length,
              commits: commitDetails,
            });
          }

          aggregatePullRequestData.avgMergeTime = totalMergedDurations.length
            ? totalMergedDurations.reduce((a, b) => a + b, 0) /
              totalMergedDurations.length
            : 0;

          // Detect if main repoOwner is an org or user
          let isOrg = false;
          try {
            const orgCheck = await axios.get(
              `https://api.github.com/orgs/${repoOwner}`,
              { headers }
            );
            isOrg = !!orgCheck?.data;
          } catch (_) {
            isOrg = false;
          }

          // Quality Metrics
          let repos = [];
          if (isOrg) {
            const reposRes = await axios.get(
              `https://api.github.com/orgs/${repoOwner}/repos`,
              { headers }
            );
            repos = reposRes.data;
          } else {
            const reposRes = await axios.get(
              `https://api.github.com/users/${repoOwner}/repos`,
              { headers }
            );
            repos = reposRes.data;
          }

          const repoCount = repos.length;
          const activeProjects = repos.filter(
            (r) =>
              new Date(r.updated_at) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length;
          const popularity = repos.reduce(
            (sum, r) => sum + r.stargazers_count,
            0
          );

          let communityEngagement = 0;
          const resolutionBuckets = {
            Critical: [],
            High: [],
            Medium: [],
            Low: [],
          };

          for (const repo of repos) {
            const issuesRes = await axios.get(
              `https://api.github.com/repos/${repoOwner}/${repo.name}/issues`,
              {
                headers,
                params: { state: "closed", per_page: 100 },
              }
            );
            for (const issue of issuesRes.data) {
              if (issue.pull_request) continue;
              communityEngagement++;
              const labels = issue.labels.map((l) => l.name);
              const created = new Date(issue.created_at);
              const closed = new Date(issue.closed_at);
              for (const label of labels) {
                const key = ["Critical", "High", "Medium", "Low"].find(
                  (lvl) => lvl.toLowerCase() === label.toLowerCase()
                );
                if (key) {
                  resolutionBuckets[key].push(
                    (closed - created) / (1000 * 60 * 60 * 24)
                  );
                }
              }
            }
          }

          const resolutionTime = {};
          for (const level in resolutionBuckets) {
            const arr = resolutionBuckets[level];
            resolutionTime[level] = arr.length
              ? arr.reduce((a, b) => a + b, 0) / arr.length
              : 0;
          }

          const qualityData = {
            repoCount,
            popularity,
            activeProjects,
            communityEngagement,
            resolutionTime,
          };

          // Create or update user in DB
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            const userCount = await User.countDocuments();
            const isocId = `isoc25#${userCount + 1}`;

            user = await User.create({
              githubId: profile.id,
              username,
              displayName: profile.displayName,
              avatar: profile.photos?.[0]?.value,
              email: primaryEmail,
              accessToken,
              isoc_id: isocId,
              joinedAt,
              followers,
              following,
              pullRequests: allDetailedPRs,
              commitStats: allCommitStats,
              pullRequestData: aggregatePullRequestData,
              qualityData,
            });

            user._loginMessage = `New user registered with ID ${isocId}`;
          } else {
            user.accessToken = accessToken;
            user.joinedAt = joinedAt;
            user.followers = followers;
            user.following = following;
            user.pullRequests = allDetailedPRs;
            user.commitStats = allCommitStats;
            user.pullRequestData = aggregatePullRequestData;
            user.qualityData = qualityData;

            await user.save();

            user._loginMessage = `Existing user logged in with ID ${user.isoc_id}`;
          }

          console.log("Authenticated user:", user);

          return done(null, user);
        } catch (error) {
          console.error("GitHub OAuth Error:", error.message);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.githubId));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ githubId: id });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
