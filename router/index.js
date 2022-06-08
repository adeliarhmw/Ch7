//Adelia Rahmawati
const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "foto_profil") {
      cb(null, "./uploads/images");
    } else {
      cb(null, "./uploads/video");
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "foto_profil") {
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/png"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only Accepted .jpeg, .jpg, .png format Allowed"));
      }
    } else {
      if (
        file.mimetype == "video/mp4" ||
        file.mimetype == "video/x-msvideo" ||
        file.mimetype == "video/quicktime"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only Accepted .mp4, .avi, .mov format Allowed"));
      }
    }
  },
});

const {
  getuser_game_api,
  getuser_gamebyid_api,
  createuser_game_api,
  update_user_game_api,
  deleteuser_game_api,
} = require("../controller/user_game_api");

const {
  getuser_game_admin_views,
  getuser_game_user_views,
  getuser_gameById_views,
  createuser_game_form_views,
  createuser_game_views,
  update_user_game_views,
  deleteuser_game_views,
} = require("../controller/user_game_views");

const {
  getuser_game_biodata_api,
  getuser_game_biodatabyid_api,
  createuser_game_biodata_api,
  update_user_game_biodata_api,
  deleteuser_game_biodata_api,
} = require("../controller/user_game_biodata_api");

const {
  getuser_game_biodata_admin_views,
  getuser_game_biodata_user_views,
  getuser_game_biodatabyid_views,
  createuser_game_biodata_form_admin_views,
  createuser_game_biodata_form_user_views,
  createuser_game_biodata_admin_views,
  createuser_game_biodata_user_views,
  update_user_game_biodata_views,
  deleteuser_game_biodata_views,
} = require("../controller/user_game_biodata_views");

const {
  getuser_game_history_api,
  getuser_game_historybyid_api,
  createuser_game_history_api,
  update_user_game_history_api,
  deleteuser_game_history_api,
} = require("../controller/user_game_history_api");

const {
  getuser_game_history_admin_views,
  getuser_game_history_user_views,
  getuser_game_historybyid_views,
  createuser_game_history_form_views,
  createuser_game_history_views,
  update_user_game_history_views,
  deleteuser_game_history_views,
} = require("../controller/user_game_history_views");

const { register, login } = require("../controller/auth_api");
const { registerPage, registerViews } = require("../controller/register");

const user_game_views = require("../controller/user_game_views");
const { errorPage } = require("../controller/error");
const { user_game_biodata } = require("../models");

// user_game Endpoint
router.get("/api/get-user-game", auth, getuser_game_api);
router.get("/api/get-user-gamebyid/:id", auth, getuser_gamebyid_api);
router.post(
  "/api/create-user-game",
  auth,
  AuthorizationAdminApi,
  createuser_game_api
);
router.put(
  "/api/update-user-game/:id",
  auth,
  AuthorizationAdminApi,
  update_user_game_api
);
router.delete(
  "/api/delete-user-game/:id",
  auth,
  AuthorizationAdminApi,
  deleteuser_game_api
);

// user_game_biodata Endpoint
router.get("/api/get-user-game-biodata", auth, getuser_game_biodata_api);
router.get(
  "/api/get-user-game-biodatabyid/:id",
  auth,
  getuser_game_biodatabyid_api
);
router.post(
  "/api/create-user-games-biodata",
  auth,
  AuthorizationAdminApi,
  createuser_game_biodata_api
);
router.put(
  "/api/update-user-game-biodata/:id",
  auth,
  AuthorizationAdminApi,
  update_user_game_biodata_api
);
router.delete(
  "/api/delete-user-game-biodata/:id",
  auth,
  AuthorizationAdminApi,
  deleteuser_game_biodata_api
);

// user_game_history Endpoint
router.get("/api/get-user-game-history", auth, getuser_game_history_api);
router.get(
  "/api/get-user-game-historybyid/:id",
  auth,
  getuser_game_historybyid_api
);
router.post(
  "/api/create-user-game-history",
  auth,
  AuthorizationAdminApi,
  createuser_game_history_api
);
router.put(
  "/api/update-user-game-history/:id",
  auth,
  AuthorizationAdminApi,
  update_user_game_history_api
);
router.delete(
  "/api/delete-user-game-history/:id",
  auth,
  AuthorizationAdminApi,
  deleteuser_game_history_api
);

router.post("/api/register", register);
router.post("/api/login", login);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/view/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/view/usergames");
  }
  next();
}

function checkBiodataViewsReady(req, res, next) {
  user_game_biodata
    .findOne({
      where: {
        // harusnya where id_user : ngambil id_user dari data login (req.user.dataValues.id_user)
        id_user: req.user.dataValues.id_user,
      },
    })
    .then((user_game_biodata) => {
      if (user_game_biodata) {
        res.redirect("/view/user/usergamesbiodata");
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log("ini error", err);
    });
  console.log("ini req data", req.user);
}

// user game view Authorization
function AuthUserGameAdminViews(req, res, next) {
  if (req.user.dataValues.role_id == 1) {
    return next();
  }
  res.redirect("/view/user/usergames");
}

function AuthUserGameUserViews(req, res, next) {
  if (req.user.dataValues.role_id == 2) {
    return next();
  }
  res.redirect("/view/usergames");
}

//user game history view Authorization
function AuthUserGameHistoryAdminViews(req, res, next) {
  if (req.user.dataValues.role_id == 1) {
    return next();
  }
  res.redirect("/view/user/usergameshistory");
}

function AuthUserGameHistoryUserViews(req, res, next) {
  if (req.user.dataValues.role_id == 2) {
    return next();
  }
  res.redirect("/view/usergameshistory");
}

// user game biodata view Authorization
function AuthUserGameBiodataAdminViews(req, res, next) {
  if (req.user.dataValues.role_id == 1) {
    return next();
  }
  res.redirect("/view/user/usergamesbiodata");
}

function AuthUserGameBiodataUserViews(req, res, next) {
  if (req.user.dataValues.role_id == 2) {
    return next();
  }
  res.redirect("/view/usergamesbiodata");
}

// user game API Authorization
function AuthorizationAdminApi(req, res, next) {
  if (req.user.role_id == 1) {
    return next();
  }
  res.status(401).json({ error: "Un Access!!" });
}

//User Game View
//role Admin
router.get(
  "/view/usergames",
  checkAuthenticated,
  AuthUserGameAdminViews,
  getuser_game_admin_views
);
//role User
router.get(
  "/view/user/usergames",
  checkAuthenticated,
  AuthUserGameUserViews,
  getuser_game_user_views
);

router.get(
  "/view/createuser_game",
  checkAuthenticated,
  AuthUserGameAdminViews,
  createuser_game_form_views
);
router.get(
  "/view/updateformuser/:id",
  checkAuthenticated,
  getuser_gameById_views
);
router.post(
  "/view/createuser_game_views",
  checkAuthenticated,
  upload.any(),
  createuser_game_views
);
router.post(
  "/view/updateformuser/:id",
  checkAuthenticated,
  upload.any(),
  update_user_game_views
);
router.get(
  "/view/deleteusergame/:id",
  checkAuthenticated,
  AuthUserGameAdminViews,
  deleteuser_game_views
);

// User game Biodata view
//role admin
router.get(
  "/view/usergamesbiodata",
  checkAuthenticated,
  AuthUserGameBiodataAdminViews,
  getuser_game_biodata_admin_views
);
//role user
router.get(
  "/view/user/usergamesbiodata",
  checkAuthenticated,
  AuthUserGameBiodataUserViews,
  getuser_game_biodata_user_views
);

// create user game biodata admin
router.get(
  "/view/createuser_game_biodata",
  checkAuthenticated,
  AuthUserGameBiodataAdminViews,
  createuser_game_biodata_form_admin_views
);
// create user game biodata user
router.get(
  "/view/user/createuser_game_biodata",
  checkAuthenticated,
  AuthUserGameBiodataUserViews,
  checkBiodataViewsReady,
  createuser_game_biodata_form_user_views
);

router.get(
  "/view/updateformuserbiodata/:id",
  checkAuthenticated,
  getuser_game_biodatabyid_views
);

//post User biodata admin
router.post(
  "/view/createuser_game_biodata_views",
  checkAuthenticated,
  AuthUserGameBiodataAdminViews,
  createuser_game_biodata_admin_views
);
//post User biodata user
router.post(
  "/view/user/createuser_game_biodata_views",
  checkAuthenticated,
  AuthUserGameBiodataUserViews,
  createuser_game_biodata_user_views
);

router.post(
  "/view/updateformuserbiodata/:id",
  checkAuthenticated,
  update_user_game_biodata_views
);
router.get(
  "/view/deleteusergamebiodata/:id",
  checkAuthenticated,
  AuthUserGameBiodataAdminViews,
  deleteuser_game_biodata_views
);

//user game history view
//admin
router.get(
  "/view/usergameshistory",
  checkAuthenticated,
  AuthUserGameHistoryAdminViews,
  getuser_game_history_admin_views
);
//user
router.get(
  "/view/user/usergameshistory",
  checkAuthenticated,
  AuthUserGameHistoryUserViews,
  getuser_game_history_user_views
);

router.get(
  "/view/createuser_game_history",
  checkAuthenticated,
  AuthUserGameHistoryAdminViews,
  createuser_game_history_form_views
);
router.get(
  "/view/updateformuserhistory/:id",
  checkAuthenticated,
  AuthUserGameHistoryAdminViews,
  getuser_game_historybyid_views
);
router.post(
  "/view/createuser_game_history_views",
  checkAuthenticated,
  AuthUserGameHistoryAdminViews,
  createuser_game_history_views
);
router.post(
  "/view/updateformuserhistory/:id",
  checkAuthenticated,
  AuthUserGameHistoryAdminViews,
  update_user_game_history_views
);
router.get(
  "/view/deleteusergamehistory/:id",
  checkAuthenticated,
  AuthUserGameHistoryAdminViews,
  deleteuser_game_history_views
);
router.get("/view/error", errorPage);

router.get("/view/register", checkNotAuthenticated, registerPage);
router.post("/register", checkNotAuthenticated, registerViews);

module.exports = router;
