const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/transactions");
const guard = require("../../../helpers/guard");

const { validationCreateTransaction } = require("./validate");

router
  .get("/", guard, ctrl.getAll)
  .post("/", guard, validationCreateTransaction, ctrl.create);
router.get("/balance", guard, ctrl.getBalance);
router.get("/statistic", guard, ctrl.getStatistic);
router.get("/categories", ctrl.getCategories);

module.exports = router;
