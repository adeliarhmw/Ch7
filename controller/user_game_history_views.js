const { user_game_history } = require("../models");
const moment = require("moment");

module.exports = {
  getuser_game_history_admin_views: (req, res) => {
    user_game_history
      .findAll({
        where: {
          id_user: req.user.id_user,
        },
      })
      .then((result) => {
        if (result.length > 0) {
          //res.status(200).json({ message: "Valid Get All User Game History", data: result });
          res.render("usergameshistory/index", {
            usergameshistory: result,
            moment,
          });
        } else {
          // res.status(404).json({ message: "User Game history Not Found", data: result });
          res.render("usergameshistory/index", {
            usergameshistory: result,
            moment,
          });
        }
      })
      .catch((err) => {
        //res.status(500).json({ message: "Failed Get All User Game history", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  getuser_game_history_user_views: (req, res) => {
    user_game_history
      .findAll({
        attributes: ["id_history", "game_tittle", "score", "level", "id_user"],
      })
      .then((result) => {
        if (result.length > 0) {
          //res.status(200).json({ message: "Valid Get All User Game History", data: result });
          res.render("usergameshistory/index_user", {
            usergameshistory: result,
            moment,
          });
        } else {
          // res.status(404).json({ message: "User Game history Not Found", data: result });
          res.render("usergameshistory/index_user", {
            usergameshistory: result,
            moment,
          });
        }
      })
      .catch((err) => {
        //res.status(500).json({ message: "Failed Get All User Game history", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  getuser_game_historybyid_views: (req, res) => {
    user_game_history
      .findOne({
        where: {
          id_user: req.params.id,
        },
        attributes: ["id_history", "game_tittle", "score", "level"],
      })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: "Valid Get User Game history By Id", result });
          res.render("usergameshistory/update", { user_game_history: result });
        } else {
          //res.status(404).json({message:"User Game history dengan ID " + req.params.id + " Not Found", result,});
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "failed Get User Game history By Id",
          err: err.message,
        });
      });
  },
  createuser_game_history_form_views: (req, res) => {
    res.render("usergameshistory/create");
  },
  createuser_game_history_views: (req, res) => {
    user_game_history
      .create({
        game_tittle: req.body.game_tittle,
        score: req.body.score,
        level: req.body.level,
        id_user: req.body.id_user,
      })
      .then((result) => {
        // res.status(200).json({ message: "Valid Membuat User Game history", result });
        res.redirect("/view/usergameshistory");
      })
      .catch((err) => {
        //res.status(500).json({message: "Failed Membuat User Game history", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  update_user_game_history_views: (req, res) => {
    user_game_history
      .update(
        {
          game_tittle: req.body.game_tittle,
          score: req.body.score,
          level: req.body.level,
        },
        {
          where: {
            id_user: req.params.id,
          },
        }
      )
      .then((result) => {
        if (result[0] === 0) {
          //res.status(404).json({message:"User Game History dengan ID " + req.params.id + " Not Found",result, });
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        } else {
          //res.status(200).json({ message: "Valid Mengupdate User Game History", result });
          res.redirect("/view/usergameshistory");
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed Mengupdate User Game History",
          err: err.message,
        });
        //res.render("error", { status: res.status(500), err: err.message });
      });
  },
  deleteuser_game_history_views: (req, res) => {
    user_game_history
      .destroy({
        where: {
          id_user: req.params.id,
        },
      })
      .then((result) => {
        if (result[0] === 0) {
          //res.status(404).json({message: "User Game History dengan ID " + req.params.id + " Not Found",result,});
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        } else {
          //res.status(200).json({ message: "Valid Menghapus User Game History", result });
          res.redirect("/view/usergameshistory");
        }
      })
      .catch((err) => {
        //res.status(500).json({message: "Failed Menghapus User Game History", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
};
