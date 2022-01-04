const router = require("express").Router();

const userController = require("../controllers/user.controller");
const { validateBody } = require("../middlewares/validateData");
const elasticsearch = require("../elastic/elasticsearch");

router.route("/create-index").get(elasticsearch.createIndex);
router.route("/delete-index").get(elasticsearch.deleteIndex);
router.route("/putMapping").get(elasticsearch.putMapping);

router
  .route("/create")
  .post(validateBody("userSchemaCreate"), userController.createNewUser);

router.route("/").get(userController.getAllUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .delete(userController.deleteOneUser)
  .put(validateBody("userSchemaUpdate"), userController.updateOneUser);

module.exports = router;
