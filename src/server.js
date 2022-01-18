const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const initRoute = require("./routes/index");

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//init route
initRoute(app);

const server = app.listen(port, () => {
  console.log(`Server is listening http://localhost:${port}`);
});

module.exports = { app, server };
