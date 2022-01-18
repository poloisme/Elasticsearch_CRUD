const errorHandle = (err, req, res, next) => {
  //res to client
  err.status = err.status || 500;
  res.status(err.status).json({ message: err.message, namne: err.name });
};

module.exports = errorHandle;
