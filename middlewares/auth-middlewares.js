const isLogged = (req, res, next) => {
  if (!req.session.activeUser) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

module.exports = isLogged;
