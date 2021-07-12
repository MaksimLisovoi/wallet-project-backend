const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

const { validationSignup, validationLogin } = require("./validate");

router.get("/current", guard, ctrl.getCurrent);
router.post("/signup", validationSignup, ctrl.signup);
router.post("/login", validationLogin, ctrl.login);
router.post("/logout", guard, ctrl.logout);

module.exports = router;
