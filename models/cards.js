const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cards = sequelize.define('Cards', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: false,
  },
  name_kr: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  name_en: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
}, {
  tableName: 'TAROT_CARDS',
  timestamps: false,
});


module.exports = Cards;