const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

const createRoute = require("./routes/create");
const retrieveRoute = require("./routes/retrieve");
const updateRoute = require("./routes/update");
const playRoute = require("./routes/play");
const endRoute = require("./routes/end");
const backup = require("./middleware/backup");
const validate = require("./middleware/validate");

app.use("/api/create", createRoute, backup);
app.use("/api/retrieve", validate, retrieveRoute, backup);
app.use("/api/update", validate, updateRoute, backup);
app.use("/api/play", validate, playRoute, backup);
app.use("/api/end", validate, endRoute, backup);
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
