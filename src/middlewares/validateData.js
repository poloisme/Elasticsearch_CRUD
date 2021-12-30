const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
require("ajv-errors")(ajv /*, {singleError: true} */);

const schemas = require("../schemas/utils");

//validate body
const validateBody = (schemaName) => {
  return async (req, res, next) => {
    try {
      //check schema exist
      if (!ajv.getSchema(schemaName)) {
        ajv.addSchema(schemas[schemaName], schemaName);
      }
      //validate body
      const validate = ajv.getSchema(schemaName);
      const valid = validate(req.body);
      if (!valid) {
        const err = new Error(validate.errors[0].message);
        err.status = 400;
        return next(err);
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
};

//validate param
const validateParam = (schemaName, param) => {
  return async (req, res, next) => {
    try {
      //check schema exist
      if (!ajv.getSchema(schemaName)) {
        ajv.addSchema(schemas[schemaName], schemaName);
      }
      //validate body
      const validate = ajv.getSchema(schemaName);
      const valid = validate(req.param[param]);
      if (!valid) {
        const err = new Error(validate.errors[0].message);
        err.status = 400;
        return next(err);
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  validateBody,
  validateParam,
};
