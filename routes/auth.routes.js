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
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
      res.status(401).render("auth/signup-form.hbs", {
        errorMessage:
          "Password needs min 8 chars, 1 capital, 1 lowercase & 1 special char",
      });

      return;
    }

    if (!username || !password) {
      res.status(401).render("auth/signup-form.hbs", {
        errorMessage: "All fields must be filled",
      });

      return;
    }

    const foundUser = await User.findOne({ username: username });

    if (foundUser !== null) {
      res.status(401).render("auth/signup-form.hbs", {
        errorMessage: "Username already exist",
      });

      return;
    }

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

    if (!username || password) {
      res.status(401).render("auth/login-form.hbs", {
        errorMessage: "Please complete the form",
      });
      return;
    }

    if (!foundUser) {
      res.status(401).render("auth/login-form.hbs", {
        errorMessage: "Nosiste ese username",
      });
      return;
    }

    const isPasswordOk = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordOk) {
      res.status(401).render("auth/login-form.hbs", {
        errorMessage: "Emosidoengañado password",
      });
      return;
    }

    req.session.activeUser = foundUser;
    req.session.save(() => {
      res.redirect("/profile/main");
    });
  } catch (error) {
    next();
  }
});

router.get("/logout", (req, res, next) => {
  res.render("auth/login-form.hbs");
  req.session.destroy();
});

module.exports = router;
