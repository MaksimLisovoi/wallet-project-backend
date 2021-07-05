const express = require("express");
const router = express.Router();
const cntr = require("../../../controllers/transactions");
const guard = require("../../../helpers/guard");

const {
  validationCreateTransaction,
  validationUpdate,
  validateMongoId,
} = require("./validate");

router.use((req, res, next) => {
  console.log(req.url);
  next();
});

// router.get("/", cntr.getAll);
// router.get("/:id", cntr.getById);
// router.post("/", validationCreateContact, cntr.create);
// router.delete("/:id", cntr.remove);
// router.patch("/:id", validationUpdate, cntr.update);

router
  .get("/", guard, cntr.getAll)
  .post("/", guard, validationCreateTransaction, cntr.create);

router
  .get("/:id", guard, validateMongoId, cntr.getById)
  .delete("/:id", guard, validateMongoId, cntr.remove)
  .patch("/:id", guard, validateMongoId, validationUpdate, cntr.update);

module.exports = router;
