const express = require("express");
const tournament = require("../modules/tournament");
const router = express.Router();

router.post("/", (req, res, next) => {
  try {
    if(req.query.matchID === undefined) {
      res.status(400).send({
        message: "No parameter 'matchID' is sent.",
      });
      return;
    }

    if(req.query.matchID < 0 || req.query.matchID >= tournament.matches.length) {
      res.status(400).send({
        message: "Parameter 'matchID' is out of range.",
      });
      return;
    }

    tournament.currentMatch = req.query.matchID;
    
    res.status(200).send(tournament.matches[tournament.currentMatch]);
    next();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while playing match.",
    });
  }
});

module.exports = router;
