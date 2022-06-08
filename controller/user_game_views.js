const { user_game } = require("../models");
const moment = require("moment");
const bcrypt = require("bcrypt");

module.exports = {
  getuser_game_admin_views: (req, res) => {
    user_game
      .findAll()
      .then((result) => {
        if (result.length > 0) {
          // res.status(200).json({ message: 'Berhasil Get All User Game', result });
          res.render("usergames/index", { usergames: result, moment });
        } else {
          // res.status(404).json({ message: 'User Game Tidak di temukan', result });
          res.render("usergames/index", { usergames: result, moment });
        }
      })
      .catch((err) => {
        //res.status(500).json({ message: "Gagal Get All User Game", err: err.message });
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  getuser_game_user_views: (req, res) => {
    user_game
      .findOne({
        where: {
          id_user: req.user.id_user,
        },
      })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: 'Berhasil Get All User Game', result });
          res.render("usergames/index_user", { user_game: result, moment });
        } else {
          // res.status(404).json({ message: 'User Game Tidak di temukan', result });
          res.render("usergames/index_user", { user_game: result, moment });
        }
      })
      .catch((err) => {
        //res.status(500).json({ message: "Gagal Get All User Game", err: err.message });
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  getuser_gameById_views: (req, res) => {
    user_game
      .findOne({
        where: {
          id_user: req.params.id,
        },
      })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: 'Berhasil Get User Game By Id', result });
          res.render("usergames/update", {
            user_game: result,
          });
        } else {
          // res.status(404).json({ message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan', result });
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Gagal Get User Game By Id", err: err.message });
        //res.render("error", { status: res.status(500), err: err.message });
      });
  },
  createuser_game_form_views: (req, res) => {
    res.render("usergames/create");
  },
  createuser_game_views: async (req, res) => {
    const { username, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user_game
      .create({
        username: req.body.username,
        password: hashedPassword,
        foto_profil: req.files[0].filename,
        video: req.files[1].filename,
        role_id,
      })
      .then((result) => {
        res.redirect("/view/usergames");
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Membuat User Game', err: err.message });
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
  update_user_game_views: async (req, res) => {
    // req.method = req.body._method;
    const { username, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    user_game
      .update(
        {
          username: username,
          password: hashedPassword,
          foto_profil: req.files[0].filename,
          video: req.files[1].filename,
          role_id,
        },
        {
          where: {
            id_user: req.params.id,
          },
        }
      )
      .then((result) => {
        if (result[0] === 0) {
          // res.status(404).json({
          //   message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan',
          //   result,
          // });
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        } else {
          res.redirect("/view/usergames");
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Gagal Mengupdate User Game", err: err.message });
        // res.render("error", { status: res.status(500), err: err.message });
      });
  },
  deleteuser_game_views: (req, res) => {
    user_game
      .destroy({
        where: {
          id_user: req.params.id,
        },
      })
      .then((result) => {
        if (result === 0) {
          // res.status(404).json({
          //   message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan',
          //   result,
          // });
          res.render("error", {
            status: res.status(404),
            err: "Data tidak ditemukan!",
          });
        } else {
          // res.status(200).json({ message: 'Berhasil Menghapus User Game', result });
          res.redirect("/view/usergames");
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Menghapus User Game', err: err.message });
        res.render("error", { status: res.status(500), err: err.message });
      });
  },
};
