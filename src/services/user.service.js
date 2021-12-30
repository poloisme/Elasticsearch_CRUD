const client = require("../elastic/connection");
const bcrypt = require("bcrypt");

const createNew = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Create password_hash
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(data.password, salt);
      const res = await client.index({
        index: "rest_api",
        type: "users",
        body: {
          username: data.username,
          password_hash: password_hash,
          email: data.email,
          status: data.status,
        },
      });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

const getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = client.search({
        index: "rest_api",
        type: "users",
        body: {
          query: {
            match_all: {},
          },
        },
      });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

const getOne = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = client.get({
        index: "rest_api",
        type: "users",
        id: id,
      });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

const update = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Create password_hash
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(data.password, salt);
      const res = client.update({
        index: "rest_api",
        type: "users",
        id: id,
        body: {
          doc: {
            ...data,
            password_hash: password_hash,
          },
        },
      });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

const deleteOne = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await client.delete({
        index: "rest_api",
        type: "users",
        id: id,
      });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createNew,
  getAll,
  getOne,
  update,
  deleteOne,
};
