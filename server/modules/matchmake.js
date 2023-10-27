function matchmake(teams, level) {
  if (level == teams.length) return [];
  const matches = [[], []];
  for (let i = 0; i < teams.length; i += level) {
    for (let j = i; j + level < teams.length && j - i < level; j++) {
      const match = {
        teams: [teams[j], teams[j + level]],
        score: [0, 0],
        done: false,
        bestOf: 5,
      };
      matches[i % 2].push(match);
    }
  }
  return [...matches[0], ...matches[1], ...matchmake(teams, level + 1)];
}

module.exports = matchmake;
