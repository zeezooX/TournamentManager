const express = require("express");
const tournament = require("../modules/tournament");
const matchmake = require("../modules/matchmake");
const router = express.Router();

router.post("/", (req, res) => {
  try {
    if (req.body.teams === undefined) {
      res.status(400).send({
        message: "Teams not sent.",
      });
      return;
    }

    if (req.body.teams.length < 4) {
      res.status(400).send({
        message: "Number of teams are less than 4.",
      });
      return;
    }

    tournament.teams = req.body.teams;
    const numberOfTeams = tournament.teams.length;
    const teamIDs = Array.from({ length: numberOfTeams }, (_, i) => i);
    teamIDs.sort(() => Math.random() - 0.5);
    tournament.groups[0] = teamIDs.slice(0, numberOfTeams / 2);
    tournament.groups[1] = teamIDs.slice(numberOfTeams / 2, numberOfTeams);

    tournament.leaderboard = Array.from(
      { length: numberOfTeams },
      (_, __) => 0
    );

    const matches = [];
    for (let i = 0; i < 2; i++) {
      matches.push(matchmake(tournament.groups[i], 1));
    }

    tournament.matches = [];
    const step = Math.floor(matches[1].length / matches[0].length);
    for (let i = 0; i < matches[0].length; i++) {
      tournament.matches.push(matches[0][i]);
      for (let j = 0; j < step; j++) {
        tournament.matches.push(matches[1][i * step + j]);
      }
    }

    res.status(200).send(tournament);
    next();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating tournament.",
    });
  }
});

module.exports = router;
