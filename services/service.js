const model = require('../models/model');

exports.draw = (count) => {
  const shuffled = [...model.cards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(card => {
    const reversed = Math.random() < 0.5;
    return {
      ...card,
      direction: reversed ? 'reversed' : 'upright'
    };
  });
};