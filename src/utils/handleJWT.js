const jwt = require("jsonwebtoken");
const CustomError = require("../utils/Error");

const enCodedToken = async (data, secret, timeExp) => {
  try {
    const token = await jwt.sign(
      {
        ...data,
      },
      secret,
      { expiresIn: timeExp }
    );
    return token;
  } catch (err) {
    throw new CustomError(err, "JWT error", 500);
  }
};

const deCodedToken = async (token, secret) => {
  try {
    const data = await jwt.verify(token, secret);
    return data;
  } catch (err) {
    throw new CustomError(err, "JWT error", 500);
  }
};

module.exports = {
  enCodedToken,
  deCodedToken,
};
