const { response } = require("express");
const client = require("./connection");

client.indices.create(
  {
    index: "rest_api",
  },
  function (err, resp, status) {
    if (err) {
      console.log(err);
    } else {
      console.log("create", resp);
    }
  }
);
