const { deCodedToken } = require("../utils/handleJWT");
const CustomError = require("../utils/Error");

//auth token
const authToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1] || authHeader;
    if (!token) {
      throw new CustomError("Token not found", "Unauthorized!", 401);
    }
    const data = await deCodedToken(token, process.env.JWT_SECRET);
    //send data to next middleware
    res.locals.data = data;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authToken;
