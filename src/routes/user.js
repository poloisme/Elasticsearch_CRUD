const router = require("express").Router();

const userController = require("../controllers/user.controller");
const { validateBody, validateParam } = require("../middlewares/validateData");
const elasticsearch = require("../elastic/elasticsearch");
const authToken = require("../middlewares/auth");

router.route("/create-index").get(elasticsearch.createIndex);
router.route("/delete-index").get(elasticsearch.deleteIndex);
router.route("/putMapping").get(elasticsearch.putMapping);

router
  .route("/signup")
  .post(validateBody("userSchemaCreate"), userController.signup);

router
  .route("/login")
  .post(validateBody("userSchemaLogin"), userController.login);

router.route("/refresh-token").post(authToken, userController.refreshToken);

router
  .route("/create")
  .post(
    authToken,
    validateBody("userSchemaCreate"),
    userController.createNewUser
  );

router.route("/").get(authToken, userController.getAllUser);

router.route("/delete-all").delete(authToken, userController.deleteAllUser);

router
  .route("/:id")
  .get(authToken, userController.getOneUser)
  .delete(authToken, userController.deleteOneUser)
  .put(
    authToken,
    validateBody("userSchemaUpdate"),
    userController.updateOneUser
  );

module.exports = router;
