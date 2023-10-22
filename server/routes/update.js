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

    if (tournament.matches[tournament.currentMatch].done) {
      res.status(400).send({
        message: "Match is already over.",
      });
      return;
    }

    if (req.query.score0 === undefined || req.query.score1 === undefined) {
      res.status(400).send({
        message: "Missing score parameters.",
      });
      return;
    }

    const score = [parseInt(req.query.score0), parseInt(req.query.score1)];
    if (
      Math.min(score[0], score[1]) < 0 ||
      Math.max(score[0], score[1]) >
        tournament.matches[tournament.currentMatch].bestOf / 2 + 1 ||
      score[0] + score[1] > tournament.matches[tournament.currentMatch].bestOf
    ) {
      res.status(400).send({
        message: "Score is out of range.",
      });
      return;
    }

    tournament.matches[tournament.currentMatch].score = score;

    res.status(200).send(tournament.matches[tournament.currentMatch]);
    next();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating match.",
    });
  }
});

module.exports = router;
