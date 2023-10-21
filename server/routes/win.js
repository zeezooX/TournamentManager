const express = require("express");
const tournament = require("../modules/tournament");
const router = express.Router();

router.post("/", (req, res) => {
  try {
    if (tournament.currentMatch === -1) {
      res.status(400).send({
        message: "No match is being played currently.",
      });
      return;
    }

    res.status(200).send(tournament.leaderboard);
    next();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while winning match.",
    });
  }
});

module.exports = router;
