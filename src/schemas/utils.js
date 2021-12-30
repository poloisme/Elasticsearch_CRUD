const schemas = {
  userSchemaUpdate: {
    type: "object",
    properties: {
      username: { type: "string", minLength: 5, maxLength: 12 },
      password: {
        type: "string",
        format: "password",
        minLength: 6,
        maxLength: 12,
      },
      email: { type: "string", format: "email" },
      status: { type: "integer", enum: [1, 10] },
      roles_id: { type: "integer", enum: [1, 2, 3, 4] },
    },
    additionalProperties: false,
    errorMessage: {
      type: "should be an object",
      properties: {
        username: "username should be string with length >= 5 and <= 12",
        password: "password should be password with length >= 6 and <= 12",
        email: "email should be email",
        status: "status should be enum 1 or 10",
        roles_id: "roles_id should be enum 1, 2, 3 or 4",
      },
      additionalProperties: "should not have properties other",
    },
  },
  userSchemaCreate: {
    type: "object",
    properties: {
      username: { type: "string", minLength: 5, maxLength: 12 },
      password: {
        type: "string",
        format: "password",
        minLength: 6,
        maxLength: 12,
      },
      email: { type: "string", format: "email" },
      status: { type: "integer", enum: [1, 10] },
      roles_id: { type: "integer", enum: [1, 2, 3, 4] },
    },
    required: ["username", "password", "email"],
    additionalProperties: false,
    errorMessage: {
      type: "should be an object",
      properties: {
        username: "username should be string with length >= 5 and <= 12",
        password: "password should be password with length >= 6 and <= 12",
        email: "email should be email",
        status: "status should be enum 1 or 10",
        roles_id: "roles_id should be enum 1, 2, 3 or 4",
      },
      required: {
        username: 'should have an integer property "username"',
        password: 'should have a password property "password"',
        email: 'should have a email property "email"',
      },
      additionalProperties: "should not have properties other",
    },
  },
};

module.exports = schemas;
