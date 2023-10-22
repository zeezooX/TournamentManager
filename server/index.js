const express = require('express');
const app = express();
const port = 8080;

app.use(express.json())

const createRoute = require('./routes/create');
const retrieveRoute = require('./routes/retrieve');
const updateRoute = require('./routes/update');
const playRoute = require('./routes/play');
const endRoute = require('./routes/end');
const backup = require('./middleware/backup');
const validate = require('./middleware/validate');

app.use('/create', createRoute, backup);
app.use('/retrieve', validate, retrieveRoute, backup);
app.use('/update', validate, updateRoute, backup);
app.use('/play', validate, playRoute, backup);
app.use('/end', validate, endRoute, backup);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
