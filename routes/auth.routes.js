const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

// GET "/auth/signup" => renderizar formulario registro
router.get("/signup", (req, res, next) => {
  res.render("auth/signup-form.hbs");
});

// POST "/auth/signup" => recivir data de usuario y crear en la DB
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      password: hashPassword,
    });

    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
});

// GET "/auth/login" => renderizar formulario login
router.get("/login", (req, res, next) => {
  res.render("auth/login-form.hbs");
});

// POST "/auth/login" => enviar datos a DB para iniciar/guardar sesion
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ username: username });

    if (!foundUser) {
      res.render("auth/login-form.hbs", {
        errorMessage: "Nosiste ese username",
      });
      return;
    }

    const isPasswordOk = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordOk) {
      res.render("auth/login-form.hbs", {
        errorMessage: "Emosidoengañado password",
      });
      return;
    }

    req.session.activeUser = foundUser;
    req.session.save(() => {
      res.redirect("/profile");
    });
  } catch (error) {
    next();
  }
});

module.exports = router;
