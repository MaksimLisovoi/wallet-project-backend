const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../swagger.json");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/transactions", require("./transactions"));
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
