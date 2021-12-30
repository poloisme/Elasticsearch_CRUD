const express = require("express");
const bodyParser = require("body-parser");
const initRoute = require("./routes/index");

const app = express();
const port = 3003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//init route
initRoute(app);

app.listen(port, () => {
  console.log(`Server is listening http://localhost:${port}`);
});
