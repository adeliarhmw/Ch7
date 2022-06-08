"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_game_biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user_game, {
        foreignKey: "id_user",
        as: "user_game_biodata",
      }); // relasi
    }
  }
  user_game_biodata.init(
    {
      id_biodata_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name_user: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.TEXT,
      },
      gender: {
        type: DataTypes.TEXT,
      },
      id_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user_game_biodata",
    }
  );
  return user_game_biodata;
};
