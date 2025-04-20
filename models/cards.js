const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Card = sequelize.define('Card', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meaning: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = Card;