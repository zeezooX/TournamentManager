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

    const noOfMatches = tournament.groups.reduce((x, i) => {
      return x + (i.length * (i.length - 1)) / 2;
    }, 0);
    if (
      match.score[0] === match.score[1] &&
      tournament.currentMatch >= noOfMatches
    ) {
      res.status(400).send({
        message: "Cannot end a knockout match in a draw.",
      });
      return;
    }

    tournament.matches[tournament.currentMatch].done = true;
    let multiplier = 1;

    const n = tournament.groups[0].length;
    const m = tournament.groups[1].length;

    if (
      tournament.currentMatch < noOfMatches &&
      n < m &&
      tournament.groups[0].includes(match.teams[0])
    ) {
      multiplier = (m - 1) / (n - 1);
    }

    if (match.score[0] > match.score[1]) {
      tournament.leaderboard[match.teams[0]] += multiplier * 3;
    } else if (match.score[0] < match.score[1]) {
      tournament.leaderboard[match.teams[1]] += multiplier * 3;
    } else {
      tournament.leaderboard[match.teams[0]] += multiplier;
      tournament.leaderboard[match.teams[1]] += multiplier;
    }

    const numOfDone = tournament.matches.reduce((x, i) => {
      return x + (i.done === true ? 1 : 0);
    }, 0);
    if (numOfDone === noOfMatches) {
      const standings = [[], []];

      standings[0] = tournament.groups[0].sort((a, b) => {
        return tournament.leaderboard[b] - tournament.leaderboard[a];
      });
      standings[1] = tournament.groups[1].sort((a, b) => {
        return tournament.leaderboard[b] - tournament.leaderboard[a];
      });

      const first = {
        teams: [standings[0][1], standings[1][0]],
        score: [0, 0],
        done: false,
        bestOf: 5,
      };
      const second = {
        teams: [standings[0][0], standings[1][1]],
        score: [0, 0],
        done: false,
        bestOf: 5,
      };
      tournament.matches.push(first);
      tournament.matches.push(second);
    } else if (numOfDone === noOfMatches + 2) {
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

      const third = {
        teams: standings[0],
        score: [0, 0],
        done: false,
        bestOf: 5,
      };
      const final = {
        teams: standings[1],
        score: [0, 0],
        done: false,
        bestOf: 7,
      };
      tournament.matches.push(third);
      tournament.matches.push(final);
    }

    tournament.currentMatch = tournament.matches.findIndex(
      (match) => match.done === false
    );
    res.status(200).send(tournament);
    next();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while ending match.",
    });
  }
});

module.exports = router;
