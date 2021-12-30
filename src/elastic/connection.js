const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200", pingTimeout: 3000 });

client.ping({}, async function (err) {
  if (err) {
    console.log("connect fail: ", err);
  } else {
    console.log("connect success");
  }
});

module.exports = client;
