const express = require("express");
const router = express.Router();
const isLogged = require("../middlewares/auth-middlewares.js");
router.get("/main", isLogged, (req, res, next) => {
  res.render("profile/main.hbs");
});

router.get("/private", isLogged, (req, res, next) => {
  res.render("profile/private.hbs");
});

module.exports = router;
