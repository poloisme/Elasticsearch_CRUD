const userService = require("../services/user.service");

//create a new user
const createNewUser = async (req, res, next) => {
  try {
    const resp = await userService.createNewUser(req.body);
    return res.status(resp.status).json({ message: "successfully" });
  } catch (err) {
    next(err);
  }
};

//get all user
const getAllUser = async (req, res, next) => {
  try {
    const resp = await userService.getAllUser();
    return res.status(resp.status).json(resp);
  } catch (err) {
    next(err);
  }
};

//get a user by id
const getOneUser = async (req, res, next) => {
  try {
    const resp = await userService.getOneUser(req.params.id);
    return res.status(resp.status).json(resp);
  } catch (err) {
    next(err);
  }
};

//delete a user by id
const deleteOneUser = async (req, res, next) => {
  try {
    const resp = await userService.deleteOneUser(req.params.id);
    return res.status(resp.status).json(resp);
  } catch (err) {
    next(err);
  }
};

//delete all user
const deleteAllUser = async (req, res, next) => {
  try {
    const resp = await userService.deleteAllUser();
    return res.status(resp.status).json(resp);
  } catch (err) {
    next(err);
  }
};

//update a user by id
const updateOneUser = async (req, res, next) => {
  try {
    const resp = await userService.updateOneUser(req.params.id, req.body);
    return res.status(resp.status).json(resp);
  } catch (err) {
    next(err);
  }
};

//sign up
const signup = async (req, res, next) => {
  try {
    const { token, refreshToken } = await userService.signup(req.body);
    return res
      .status(200)
      .setHeader("authorization", token)
      .json({ token, refreshToken });
  } catch (err) {
    next(err);
  }
};

//login
const login = async (req, res, next) => {
  try {
    const { token, refreshToken } = await userService.login(req.body);
    return res
      .status(200)
      .setHeader("authorization", token)
      .json({ token, refreshToken });
  } catch (err) {
    next(err);
  }
};

//refresh token
const refreshToken = async (req, res, next) => {
  try {
    const resp = await userService.refreshToken(req.body);
    return res.status(200).setHeader("authorization", resp.token).json(resp);
  } catch (err) {
    next(err);
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
