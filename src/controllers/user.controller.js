const userService = require("../services/user.service");

//[POST] api/users/create
const createNewUser = async (req, res, next) => {
  try {
    const response = await userService.createNew(req.body);
    return res.status(response.statusCode).json(response.body);
  } catch (err) {
    next(err);
  }
};

//[GET] api/users
const getAllUser = async (req, res, next) => {
  try {
    const response = await userService.getAll();
    return res.status(response.statusCode).json(response.body.hits);
  } catch (err) {
    next(err);
  }
};

//[GET] api/users/:id
const getOneUser = async (req, res, next) => {
  try {
    const response = await userService.getOne(req.params.id);
    return res.status(response.statusCode).json(response.body);
  } catch (err) {
    next(err);
  }
};

//[DELETE] api/users/:id
const deleteOneUser = async (req, res, next) => {
  try {
    const response = await userService.deleteOne(req.params.id);
    return res.status(response.statusCode).json(response.body);
  } catch (err) {
    next(err);
  }
};

//[PUT] api/users/:id
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
