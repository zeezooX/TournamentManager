const express = require("express");
const tournament = require("../modules/tournament");
const matchmake = require("../modules/matchmake");
const router = express.Router();

router.post("/", (req, res, next) => {
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
    tournament.groups[0] = teamIDs.slice(0, numberOfTeams);

    tournament.leaderboard = Array.from(
      { length: numberOfTeams },
      (_, __) => 0
    );

    tournament.matches = matchmake(tournament.groups[0], 1);

    for (const element of tournament.matches) {
      delete element.bestOf;
      element.remainingTime = 600;
      element.isRunning = false;
    }

    tournament.currentMatch = 0;
    res.status(200).send(tournament);
    next();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating tournament.",
    });
  }
});

module.exports = router;
