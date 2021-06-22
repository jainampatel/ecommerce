const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/:uid", userController.getUserById);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signup
);

router.post(
  "/login",
  [
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.login
);

module.exports = router;
