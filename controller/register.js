const express = require("express");
const app = express();
const { user_game } = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
  registerPage: (req, res) => {
    res.render("register");
  },
  registerViews: async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user_game
      .create({
        username: req.body.username,
        password: hashedPassword,
        role_id: 2,
      })
      .then((user) => {
        res.redirect("/view/login");
      })
      .catch((err) => {
        res.redirect("/view/register");
      });
  },
};
