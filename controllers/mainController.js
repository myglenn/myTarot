const tarotService = require('../services/tarotService');

exports.drawCard = async (req, res) => {
  try {
    const card = await tarotService.getRandomCard();
    if (!card) return res.status(404).json({ error: 'No cards found' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to draw card' });
  }
};

exports.listCards = async (req, res) => {
  try {
    const cards = await tarotService.getAllCards();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get cards' });
  }
};