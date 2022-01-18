const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const CustomError = require("../utils/Error");
const userSchemaCreate = require("../schemas/user-create.json");
const userSchemaUpdate = require("../schemas/user-update.json");
const userSchemaId = require("../schemas/user-id.json");
const userSchemaLogin = require("../schemas/user-login.json");

const ajv = new Ajv({ allErrors: true });

addFormats(ajv);
require("ajv-errors")(ajv /*, {singleError: true} */);

//add schema to use
ajv.addSchema(userSchemaCreate, "userSchemaCreate");
ajv.addSchema(userSchemaUpdate, "userSchemaUpdate");
ajv.addSchema(userSchemaId, "userSchemaId");
ajv.addSchema(userSchemaLogin, "userSchemaLogin");

//validate body
const validateBody = (schemaName) => {
  return async (req, res, next) => {
    try {
      //validate body
      const { schema } = await ajv.getSchema(schemaName);
      const valid = ajv.validate(schema, req.body);
      if (!valid) {
        throw new CustomError(ajv.errors[0].message, "Validate error!", 400);
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
};
