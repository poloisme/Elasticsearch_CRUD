module.exports = class CustomError extends Error {
  constructor(message, name, status) {
    super(message);

    this.name = name;

    Error.captureStackTrace(this, this.constructor);

    this.status = status || 500;
  }
};
