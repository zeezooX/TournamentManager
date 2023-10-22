const fs = require("fs");
const tournament = require("../modules/tournament");

const backup = function (req, res, next) {
  fs.writeFile("backup.json", JSON.stringify(tournament), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = backup;
