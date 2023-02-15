const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

router.use("/profile", require("./profile.routes.js"));

module.exports = router;
