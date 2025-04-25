const tarotService = require('../services/tarotService');

// exports.drawCard = async (req, res) => {
//   try {
//     const card = await tarotService.getRandomCard();
//     if (!card) return res.status(404).json({ error: 'No cards found' });
//     res.json(card);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to draw card' });
//   }
// };

exports.apiAct = async (req, res) => {
  res.send('API 문서 페이지입니다!');
};


exports.mainAct = async (req, res) => {
  res.send('API 문서 페이지입니다!');
};



exports.api = async (req, res) => {
  res.send('API 문서 페이지입니다!');
};

exports.index = async (req, res) => {
  // const regex = /^[ㄱ-ㅎ가-힣a-zA-Z\d!?.]{1,100}$/;
};

exports.reading = async (req, res) => {
  res.send('API 문서 페이지입니다!');
};
