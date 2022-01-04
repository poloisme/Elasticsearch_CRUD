const userService = require("../services/user.service");

//create a new user
const createNewUser = async (req, res, next) => {
  try {
    const response = await userService.createNew(req.body);
    return res.status(response.statusCode).json(response.body);
  } catch (err) {
    next(err);
  }
};

//get all user
const getAllUser = async (req, res, next) => {
  try {
    const response = await userService.getAll();
    return res.status(response.statusCode).json(response.body.hits);
  } catch (err) {
    next(err);
  }
};

//get a user by id
const getOneUser = async (req, res, next) => {
  try {
    const response = await userService.getOne(req.params.id);
    return res.status(response.statusCode).json(response.body);
  } catch (err) {
    next(err);
  }
};

//delete a user by id
const deleteOneUser = async (req, res, next) => {
  try {
    const response = await userService.deleteOne(req.params.id);
    return res.status(response.statusCode).json(response.body);
  } catch (err) {
    next(err);
  }
};

//update a user by id
const updateOneUser = async (req, res, next) => {
  try {
    const response = await userService.update(req.params.id, req.body);
    return res.status(response.statusCode).json(response.body);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNewUser,
  getAllUser,
  getOneUser,
  deleteOneUser,
  updateOneUser,
};
