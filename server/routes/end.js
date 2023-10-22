const express = require("express");
const tournament = require("../modules/tournament");
const router = express.Router();

router.post("/", (req, res, next) => {
  try {
    if (tournament.currentMatch === -1) {
      res.status(400).send({
        message: "No match is being played currently.",
      });
      return;
    }

    const match = tournament.matches[tournament.currentMatch];
    if (match.done === true) {
      res.status(400).send({
        message: "Match is already over.",
      });
      return;
    }

    if (match.score[0] === match.score[1]) {
      res.status(400).send({
        message: "Cannot end the match in a draw.",
      });
      return;
    }

    tournament.matches[tournament.currentMatch].done = true;
    let increment = 1;

    const n = tournament.groups[0].length;
    const m = tournament.groups[1].length;
    let phaseThreshold =
      tournament.groups.length * ((m * (m - 1)) / 2) -
      (n < m ? ((m - n) / (n - 1)) * ((n * (n - 1)) / 2) : 0);
    let leaderboardSum = tournament.leaderboard.reduce((x, i) => {
      return x + i;
    });

    if (
      leaderboardSum < phaseThreshold &&
      n < m &&
      tournament.groups[0].includes(match.teams[0])
    ) {
      increment = (m - 1) / (n - 1);
    }
    leaderboardSum += increment;

    if (match.score[0] > match.score[1]) {
      tournament.leaderboard[match.teams[0]] += increment;
    } else {
      tournament.leaderboard[match.teams[1]] += increment;
    }
    tournament.currentMatch = -1;

    if (leaderboardSum == phaseThreshold) {
      const standings = [[], []];

      standings[0] = tournament.groups[0].sort((a, b) => {
        return tournament.leaderboard[b] - tournament.leaderboard[a];
      });
      standings[1] = tournament.groups[1].sort((a, b) => {
        return tournament.leaderboard[b] - tournament.leaderboard[a];
      });

      first = {
        teams: [standings[0][1], standings[1][0]],
        score: [0, 0],
        done: false,
        bestOf: 3,
      };
      second = {
        teams: [standings[0][0], standings[1][1]],
        score: [0, 0],
        done: false,
        bestOf: 3,
      };
      tournament.matches.push(first);
      tournament.matches.push(second);
    } else if (leaderboardSum == phaseThreshold + 2) {
      const semifinals = tournament.matches.slice(-2);
      const standings = [[], []];

      standings[1].push(
        semifinals[0].score[0] > semifinals[0].score[1]
          ? semifinals[0].teams[0]
          : semifinals[0].teams[1]
      );
      standings[1].push(
        semifinals[1].score[0] > semifinals[1].score[1]
          ? semifinals[1].teams[0]
          : semifinals[1].teams[1]
      );
      standings[0].push(
        semifinals[0].score[0] < semifinals[0].score[1]
          ? semifinals[0].teams[0]
          : semifinals[0].teams[1]
      );
      standings[0].push(
        semifinals[1].score[0] < semifinals[1].score[1]
          ? semifinals[1].teams[0]
          : semifinals[1].teams[1]
      );

      third = {
        teams: standings[0],
        score: [0, 0],
        done: false,
        bestOf: 3,
      };
      final = {
        teams: standings[1],
        score: [0, 0],
        done: false,
        bestOf: 5,
      };
      tournament.matches.push(third);
      tournament.matches.push(final);
    }

    res.status(200).send(tournament);
    next();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while ending match.",
    });
  }
});

module.exports = router;
