const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

router.get("/current", guard, ctrl.getCurrent);
router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.post("/logout", guard, ctrl.logout);

module.exports = router;
