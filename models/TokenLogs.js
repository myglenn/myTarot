const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TokenLogs = sequelize.define('TokenLogs', {
  c_id: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  rq_token: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rs_token: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  create_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'TOKEN_LOGS',
  timestamps: false,
});

module.exports = TokenLogs;