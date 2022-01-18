const esCommon = require("../common/elasticsearch");
const CustomError = require("../utils/Error");
const { enCodedToken, deCodedToken } = require("../utils/handleJWT");
const md5 = require("md5");
const dotenv = require("dotenv");
dotenv.config();

const index = process.env.INDEX_NAME;
const type = process.env.TYPE_NAME;

const createNewUser = async (data) => {
  try {
    //check duplicate
    const duplicateUsername = await esCommon.checkDuplicate(index, type, {
      username: data.username,
    });
    if (duplicateUsername) {
      throw new CustomError("", "username already exist!", 409);
    }
    //create user
    await esCommon.createNew(index, type, data);
    return {
      status: 201,
      message: "successfully",
    };
  } catch (err) {
    throw err;
  }
};

const getAllUser = async () => {
  try {
    const resp = await esCommon.getAll(index, type);
    if (resp.body.hits.total < 1) {
      throw new CustomError("", "not found!", 404);
    }
    const result = resp.body.hits.hits;
    return {
      status: 200,
      data: result,
    };
  } catch (err) {
    throw err;
  }
};

const getOneUser = async (userId) => {
  try {
    const resp = await esCommon.searchById(index, type, userId);
    if (resp.total < 1) {
      throw new CustomError("", "user not found!", 404);
    }
    const result = resp.hits[0]["_source"];
    return {
      status: 200,
      data: { ...result, id: userId },
    };
  } catch (err) {
    throw err;
  }
};

const deleteOneUser = async (userId) => {
  try {
    const checkUser = await esCommon.searchById(index, type, userId);
    if (checkUser.total < 1) {
      throw new CustomError("", "user not found!", 404);
    }
    await esCommon.deleteOne(index, type, userId);
    return {
      status: 200,
      message: "successfully",
    };
  } catch (err) {
    throw err;
  }
};

const deleteAllUser = async () => {
  try {
    await esCommon.deleteAll(index, type);
    return {
      status: 200,
      message: "successfully",
    };
  } catch (err) {
    throw err;
  }
};

const updateOneUser = async (userId, data) => {
  try {
    const [duplicateUsername, checkUser] = await Promise.all([
      esCommon.checkDuplicate(index, type, {
        username: data.username,
      }),
      esCommon.searchById(index, type, userId),
    ]);
    if (duplicateUsername) {
      throw new CustomError("", "username already exist!", 409);
    }
    if (checkUser.total < 1) {
      throw new CustomError("", "user not found!", 404);
    }
    await esCommon.update(index, type, userId, data);
    return {
      status: 200,
      message: "successfully",
    };
  } catch (err) {
    throw err;
  }
};

const signup = async (data) => {
  try {
    //check duplicate
    const duplicateUser = await esCommon.checkDuplicate(index, type, {
      username: data.username,
    });
    if (duplicateUser) {
      throw new CustomError("", "username already exist!", 409);
    }
    //create new user
    const resp = await esCommon.createNew(index, type, data);
    //create token
    const user = await esCommon.getOne(index, type, resp.body["_id"]);
    const { username, email } = user.body["_source"];
    const token = await enCodedToken(
      { username, email },
      process.env.JWT_SECRET,
      process.env.TIME_EXP
    );
    //create refresh token
    const refreshToken = await enCodedToken(
      { username, email },
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_TIME_EXP
    );
    //save refresh token
    await esCommon.update(index, type, resp.body["_id"], {
      refreshToken,
    });
    const result = { token, refreshToken };
    return result;
  } catch (err) {
    throw err;
  }
};

const login = async (data) => {
  try {
    const resp = await esCommon.getByFieldName(index, type, {
      username: data.username,
    });
    //check username
    if (resp.total == 0) {
      throw new CustomError("", "invalid username!", 400);
    }
    //check password
    if (resp.hits[0]["_source"].password !== md5(data.password)) {
      throw new CustomError("", "invalid password!", 400);
    }
    //create token
    const { username, email } = resp.hits[0]["_source"];
    const token = await enCodedToken(
      { username, email },
      process.env.JWT_SECRET,
      process.env.TIME_EXP
    );
    //create refresh token
    const refreshToken = await enCodedToken(
      { username, email },
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_TIME_EXP
    );
    //save refresh token
    await esCommon.update(index, type, resp.hits[0]["_id"], {
      refreshToken,
    });
    const result = { token, refreshToken };
    return result;
  } catch (err) {
    throw err;
  }
};

const refreshToken = async (data) => {
  try {
    const resp = await esCommon.getByFieldName(index, type, {
      refreshToken: data.refreshToken,
    });
    if (resp.total == 0) {
      throw new CustomError("", "refresh token not found!", 404);
    }
    await deCodedToken(
      resp.hits[0]["_source"].refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    //create new token
    const { username, email } = resp.hits[0]["_source"];
    const token = await enCodedToken(
      { username, email },
      process.env.JWT_SECRET,
      process.env.TIME_EXP
    );
    return { token };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createNewUser,
  getAllUser,
  getOneUser,
  deleteOneUser,
  deleteAllUser,
  updateOneUser,
  signup,
  login,
  refreshToken,
};
