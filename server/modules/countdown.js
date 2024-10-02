const tournament = require("./tournament");

function countdown() {
  for (const element of tournament.matches) {
    if (element.isRunning) {
      element.remainingTime--;
      if (element.remainingTime <= 0) {
        element.remainingTime = 0;
        element.isRunning = false;
      }
    }
  }
}

module.exports = countdown;
