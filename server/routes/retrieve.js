const express = require("express");
const tournament = require("../modules/tournament");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.status(200).send(tournament);
    next();
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tournament.",
    });
  }
});

module.exports = router;
