const errorHandle = (err, req, res, next) => {
  if (err.name === "ResponseError") {
    err.status = err.meta.statusCode;
    err.message = err.meta.body;
  }
  err.status = err.status || 500;

  // ObjectID: not found
  if (err.kind === "ObjectID") {
    err.status = 404;
    err.message = `The ${req.originalUrl} is not found because wrong id`;
  }

  //handle error sequelize
  if (err.name === "SequelizeUniqueConstraintError") {
    if (err.original.sqlState === "23000") {
      err.status = 400;
      err.message = err.original.sqlMessage;
    }
  }

  //res to client
  res.status(err.status).json({
    error: {
      status: "fail",
      message: err.message,
    },
  });
};

module.exports = errorHandle;
