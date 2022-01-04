const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const userSchemaCreate = require("../schemas/user-create.json");
const userSchemaUpdate = require("../schemas/user-update.json");

const ajv = new Ajv({ allErrors: true });

addFormats(ajv);
require("ajv-errors")(ajv /*, {singleError: true} */);

//add schema to use
ajv.addSchema(userSchemaCreate, "userSchemaCreate");
ajv.addSchema(userSchemaUpdate, "userSchemaUpdate");

//validate body
const validateBody = (schemaName) => {
  return async (req, res, next) => {
    try {
      //validate body
      const { schema } = await ajv.getSchema(schemaName);
      const valid = ajv.validate(schema, req.body);
      if (!valid) {
        const err = new Error(ajv.errors[0].message);
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
// const validateParam = (schemaName, param) => {
//   return async (req, res, next) => {
//     try {
//       //check schema exist
//       if (!ajv.getSchema(schemaName)) {
//         ajv.addSchema(schemas[schemaName], schemaName);
//       }
//       //validate body
//       const validate = ajv.getSchema(schemaName);
//       const valid = validate(req.param[param]);
//       if (!valid) {
//         const err = new Error(validate.errors[0].message);
//         err.status = 400;
//         return next(err);
//       } else {
//         next();
//       }
//     } catch (err) {
//       next(err);
//     }
//   };
// };

module.exports = {
  validateBody,
};
