const client = require("./connection");
const dotenv = require("dotenv");
const res = require("express/lib/response");

dotenv.config();

const createIndex = async (req, res, next) => {
  try {
    const resp = await client.indices.create({
      index: process.env.INDEX_NAME,
    });
    res.status(resp.statusCode).json({ message: resp.body });
  } catch (err) {
    next(err);
  }
};

const deleteIndex = async (req, res, next) => {
  try {
    const resp = await client.indices.delete({ index: process.env.INDEX_NAME });
    res.status(resp.statusCode).json({ message: resp.body });
  } catch (err) {
    next(err);
  }
};

const putMapping = async (req, res, next) => {
  try {
    const resp = await client.indices.putMapping({
      index: process.env.INDEX_NAME,
      type: process.env.TYPE_NAME,
      body: {
        properties: {
          username: { type: "text" },
          password_hash: { type: "text" },
          email: { type: "keyword" },
          status: { type: "integer" },
        },
      },
    });
    res.status(resp.statusCode).json({ message: resp.body });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createIndex,
  deleteIndex,
  putMapping,
};
