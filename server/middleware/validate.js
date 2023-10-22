const fs = require("fs");
const tournament = require("../modules/tournament");

const validate = function (req, res, next) {
  if (tournament.teams.length === 0) {
    fs.readFile("backup.json", (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          message: "Tournament not yet created.",
        });
        return;
      }

      tournament.teams = JSON.parse(data).teams;
      tournament.groups = JSON.parse(data).groups;
      tournament.leaderboard = JSON.parse(data).leaderboard;
      tournament.currentMatch = JSON.parse(data).currentMatch;
      tournament.matches = JSON.parse(data).matches;
      console.log("Backup file loaded.");
      next();
    });
  } else {
    next();
  }
};

module.exports = validate;
