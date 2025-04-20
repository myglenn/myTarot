const Card = require('../models/cards');

exports.getRandomCard = async () => {
  const cards = await Card.findAll();
  if (cards.length === 0) return null;
  const index = Math.floor(Math.random() * cards.length);
  return cards[index];
};

exports.getAllCards = async () => {
  return await Card.findAll();
};