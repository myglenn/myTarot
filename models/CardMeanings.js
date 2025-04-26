const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const TarotCard = require('../models/Cards');

const CardMeanings = sequelize.define('CardMeanings', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  card_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  is_reversed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  meaning: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'CARD_MEANINGS',
  timestamps: false,
});

TarotCard.hasMany(CardMeanings, { foreignKey: 'card_id' });
CardMeanings.belongsTo(TarotCard, { foreignKey: 'card_id' });

module.exports = CardMeanings;