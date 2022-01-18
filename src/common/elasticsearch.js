const client = require("../elastic/connection");
const md5 = require("md5");
const CustomError = require("../utils/Error");

const createNew = async (index, type, data) => {
  try {
    //hash password
    const password = await md5(data.password);
    const res = await client.index({
      index: index,
      type: type,
      body: {
        username: data.username,
        password: password,
        email: data.email,
        status: data.status,
      },
    });
    return res;
  } catch (err) {
    throw new CustomError(err, "create fail!", 500);
  }
};

const getAll = async (index, type) => {
  try {
    const res = await client.search({
      index: index,
      type: type,
      body: {
        query: {
          match_all: {},
        },
      },
    });
    return res;
  } catch (err) {
    throw new CustomError(err, "data not found!", 500);
  }
};

const getOne = async (index, type, id) => {
  try {
    const res = await client.get({
      index: index,
      type: type,
      id: id,
    });
    return res;
  } catch (err) {
    throw new CustomError(err, "data not found!", 500);
  }
};

const update = async (index, type, id, data) => {
  try {
    if (data.password) {
      //hash password
      const password = await md5(data.password);
      data.password = password;
    }
    const res = await client.update({
      index: index,
      type: type,
      id: id,
      body: {
        doc: {
          ...data,
        },
      },
    });
    return res;
  } catch (err) {
    throw new CustomError(err, "update fail!", 500);
  }
};

const deleteOne = async (index, type, id) => {
  try {
    const res = await client.delete({
      index: index,
      type: type,
      id: id,
    });
    return res;
  } catch (err) {
    throw new CustomError(err, "delete fail!", 500);
  }
};

const deleteAll = async (index, type) => {
  try {
    const res = await client.deleteByQuery({
      index: index,
      type: type,
      body: {
        query: {
          match_all: {},
        },
      },
    });
    return res;
  } catch (err) {
    throw new CustomError(err, "delete fail!", 500);
  }
};

const getByFieldName = async (index, type, data) => {
  try {
    const res = await client.search({
      index: index,
      type: type,
      body: {
        query: {
          match_phrase: {
            ...data,
          },
        },
      },
    });
    return res.body.hits;
  } catch (err) {
    throw new CustomError(err, "data not found!", 500);
  }
};

const checkDuplicate = async (index, type, data) => {
  try {
    let isDuplicate = false;
    const res = await client.search({
      index: index,
      type: type,
      body: {
        query: {
          match_phrase_prefix: {
            ...data,
          },
        },
      },
    });
    if (res.body.hits.total > 0) {
      isDuplicate = true;
    }
    return isDuplicate;
  } catch (err) {
    throw new CustomError(err, "check duplicate fail!", 500);
  }
};

const searchById = async (index, type, id) => {
  try {
    const res = await client.search({
      index: index,
      type: type,
      q: `_id:${id}`,
    });
    return res.body.hits;
  } catch (err) {
    throw new CustomError(err, "data not found!", 500);
  }
};

module.exports = {
  createNew,
  getAll,
  update,
  deleteOne,
  getByFieldName,
  checkDuplicate,
  searchById,
  getOne,
  deleteAll,
};
