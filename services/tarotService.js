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


exports.countTokens = async (messages, model = "gpt-4") => {
  const encoding = encoding_for_model(model);
  let tokens = 0;

  for (const message of messages) {
    tokens += 4; // role 포함 오버헤드
    tokens += encoding.encode(message.content || "").length;
    if (message.name) tokens += encoding.encode(message.name).length;
  }

  tokens += 2;
  encoding.free();
  return tokens;
};