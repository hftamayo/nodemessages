const express = require("express");
const { body, check } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    check("email")
      .exists().
      withMessage("email value does not exists or it is blank")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((custom, { req }) => {
        let inputEmail = body('email');
        return User.findOne({ email: inputEmail }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    check("password").trim().isLength({ min: 5 }),
    check("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post('/login')
module.exports = router;
