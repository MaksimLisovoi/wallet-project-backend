const express = require("express");
const router = express.Router();
const cntr = require("../../../controllers/transactions");
const guard = require("../../../helpers/guard");

const { validationCreateTransaction } = require("./validate");

router.use((req, res, next) => {
  console.log(req.url);
  next();
});

router
  .get("/", guard, cntr.getAll)
  .post("/", guard, validationCreateTransaction, cntr.create);
router.get("/balance", guard, cntr.getBalance);

// router.get("/statistic", guard, validateMongoId, cntr.getStatistic);

module.exports = router;
