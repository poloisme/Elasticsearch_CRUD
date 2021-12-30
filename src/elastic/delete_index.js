const client = require("./connection.js");

client.indices.delete({ index: "rest_api" }, function (err, resp, status) {
  if (err) {
    console.log(err);
  } else {
    console.log("delete", resp);
  }
});
