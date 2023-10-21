const express = require('express');
const app = express();
const port = 8080;

app.use(express.json())

const createRoute = require('./routes/create');
const retrieveRoute = require('./routes/retrieve');
const updateRoute = require('./routes/update');
const playRoute = require('./routes/play');
const winRoute = require('./routes/win');

app.use('/create', createRoute);
app.use('/retrieve', retrieveRoute);
app.use('/update', updateRoute);
app.use('/play', playRoute);
app.use('/win', winRoute);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
