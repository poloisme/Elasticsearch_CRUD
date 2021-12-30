const client = require("./connection");

client.indices.putMapping(
  {
    index: "rest_api",
    type: "users",
    body: {
      properties: {
        username: { type: "text" },
        password_hash: { type: "text" },
        email: { type: "keyword" },
        status: { type: "integer" },
      },
    },
  },
  (err, resp, status) => {
    if (err) {
      console.log(err);
    } else {
      console.log("put mapping", resp);
    }
  }
);
