const dotenv = require('dotenv');
dotenv.config();
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
  res.json({ message: "API 문서 페이지입니다!" });
};

exports.index = async (req, res) => {
  // const regex = /^[ㄱ-ㅎ가-힣a-zA-Z\d!?.]{1,100}$/;
};

exports.reading = async (req, res, next) => {
  const allowIps = ['127.0.0.1', '::1', process.env.ALLOW_IP];
  const userIp = req.ip || req.connection.remoteAddress;
  const cleanedIp = userIp.replace('::ffff:', '');
  if (!allowIps.includes(cleanedIp)) {
    return res.status(403).json({ message: '허용되지 않은 접근입니다.' });
  }

  const reqBody = req.body;


  // if(reqBody.question)
  
};
