require("dotenv").config();
const express = require("express");
const app = express();
const swaggerJSON = require("./swagger.json");
const swaggerUI = require("swagger-ui-express");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const originalSend = app.response.send;
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "acces.log"),
  { flags: "a" }
);
require("./passport-config");

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set(express.static("public"));
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/video", express.static("uploads/video"));
app.use(express.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.response.send = function sendOverWrite(body) {
  originalSend.call(this, body);
  this.resBody = body;
};

morgan.token("res-body", (_req, res) => {
  if (res.getHeader("Content-Type") === "application/json; charset=utf-8") {
    return JSON.stringify(res.resBody);
  } else {
    return null;
  }
});

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :res-body',
    {
      stream: accessLogStream,
    }
  )
);

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/view/usergames");
  }
  next();
}

const router = require("./router");
const res = require("express/lib/response");
app.use(router);

router.get("/view/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/view/usergames",
    failureRedirect: "/view/login",
    failureFlash: true,
  })
);

router.get("/view/logout", (req, res) => {
  req.logOut();
  res.redirect("/view/login");
});

app.all("*", (req, res) => {
  res.redirect("/view/login");
});

module.exports = app;
