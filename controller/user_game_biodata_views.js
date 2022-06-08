const { user_game_biodata } = require("../models");
const moment = require("moment");

module.exports = {
  getuser_game_biodata_admin_views: (req, res) => {
    user_game_biodata
      .findAll()
      .then((result) => {
        if (result.length > 0) {
          //res.status(200).json({ message: "Valid Get All User Game Biodata", data: result });
          res.render("usergamesbiodata/index", {
            usergamesbiodata: result,
            moment,
          });
        } else {
          // res.status(404).json({ message: "User Game Biodata Not Found", data: result });
          res.render("usergamesbiodata/index", {
            usergamesbiodata: result,
            moment,
          });
        }
      })
      .catch((err) => {
        //res.status(500).json({ message: "Failed Get All User Game Biodata", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  getuser_game_biodata_user_views: (req, res) => {
    user_game_biodata
      .findOne({
        where: {
          id_user: req.user.id_user,
        },
      })
      .then((result) => {
        if (result) {
          //res.status(200).json({ message: "Valid Get All User Game Biodata", data: result });
          res.render("usergamesbiodata/index_user_biodata", {
            user_games_biodata: result,
            moment,
          });
        } else {
          // res.status(404).json({ message: "User Game Biodata Not Found", data: result });
          res.render("usergamesbiodata/index_user_biodata", {
            user_games_biodata: result,
            moment,
          });
        }
      })
      .catch((err) => {
        //res.status(500).json({ message: "Failed Get All User Game Biodata", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  getuser_game_biodatabyid_views: (req, res) => {
    user_game_biodata
      .findOne({
        where: {
          id_user: req.params.id,
        },
        attributes: ["id_biodata_user", "name_user", "email", "gender"],
      })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: "Valid Get User Game Biodata By Id", result });
          res.render("usergamesbiodata/update", { user_game_biodata: result });
        } else {
          //res.status(404).json({message:"User Game Biodata dengan ID " + req.params.id + " Not Found", result,});
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "failed Get User Game Biodata By Id",
          err: err.message,
        });
      });
  },
  createuser_game_biodata_form_admin_views: (req, res) => {
    res.render("usergamesbiodata/create");
  },
  createuser_game_biodata_form_user_views: (req, res) => {
    res.render("usergamesbiodata/create_user");
  },
  createuser_game_biodata_admin_views: (req, res) => {
    user_game_biodata
      .create({
        name_user: req.body.name_user,
        email: req.body.email,
        gender: req.body.gender,
        id_user: req.body.id_user,
      })
      .then((result) => {
        // res.status(200).json({ message: "Valid Membuat User Game Biodata", result });
        res.redirect("/view/usergamesbiodata");
      })
      .catch((err) => {
        //res.status(500).json({message: "Failed Membuat User Game Biodata", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  createuser_game_biodata_user_views: (req, res) => {
    user_game_biodata
      .create({
        name_user: req.body.name_user,
        email: req.body.email,
        gender: req.body.gender,
        id_user: req.body.id_user,
      })
      .then((result) => {
        // res.status(200).json({ message: "Valid Membuat User Game Biodata", result });
        res.redirect("/view/user/usergamesbiodata");
      })
      .catch((err) => {
        //res.status(500).json({message: "Failed Membuat User Game Biodata", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  update_user_game_biodata_views: (req, res) => {
    user_game_biodata
      .update(
        {
          name_user: req.body.name_user,
          email: req.body.email,
          gender: req.body.gender,
        },
        {
          where: {
            id_user: req.params.id,
          },
        }
      )
      .then((result) => {
        if (result[0] === 0) {
          //res.status(404).json({message:"User Game Biodata dengan ID " + req.params.id + " Not Found",result, });
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        } else {
          //res.status(200).json({ message: "Valid Mengupdate User Game Biodata", result });
          res.redirect("/view/usergamesbiodata");
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed Mengupdate User Game Biodata",
          err: err.message,
        });
        //res.render("error", { status: res.status(500), err: err.message });
      });
  },
  deleteuser_game_biodata_views: (req, res) => {
    user_game_biodata
      .destroy({
        where: {
          id_user: req.params.id,
        },
      })
      .then((result) => {
        if (result[0] === 0) {
          //res.status(404).json({message: "User Game Biodata dengan ID " + req.params.id + " Not Found",result,});
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        } else {
          //res.status(200).json({ message: "Valid Menghapus User Game Biodata", result });
          res.redirect("/view/usergamesbiodata");
        }
      })
      .catch((err) => {
        //res.status(500).json({message: "Failed Menghapus User Game Biodata", err: err.message,});
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
};
