const dotenv = require('dotenv');
dotenv.config();
const Card = require('../models/Card');
const CardMeaning = require('../models/CardMeaning');
const TokenLogs = require('../models/TokenLog');
const { tokenChecker } = require('../utils/tokenChecker');


exports.getRandomCard = async (...idxs) => {
  const cards = await Card.findAll({ raw: true });
  const limit = 77;
  let randomNums = [];
  let rtn = [];

  if (Array.isArray(idxs) && Array.isArray(idxs[0])) {
    idxs = idxs[0];
  }

  if (cards.length <= 1 || idxs.length < 3 || idxs.length > 3) {
    return null;
  }

  for (let i = 0; i < idxs.length; i++) {
    let tmpNum = idxs[i];
    if (!!Number.isNaN(tmpNum) || tmpNum < 0 || tmpNum > limit) {
      return null;
    }

  }

  while (randomNums.length < 3) {
    let n = Math.floor(Math.random() * cards.length) + 1;
    if (!randomNums.includes(n)) {
      randomNums.push(n);
    }
  }

  for (let i = 0; i < idxs.length; i++) {
    let targetNum = parseInt(idxs[i]);
    let card = cards.find(c => c.id === targetNum);
    if (!card) {
      return null;
    }
    let isFwd = Math.random() < 0.5;
    const meaningData = await CardMeaning.findOne({
      where: {
        card_id: card.id,
        is_reversed: !isFwd
      }
    });
    rtn.push({
      ...card,
      direction: !!isFwd ? '정방향' : '역방향',
      meaning: meaningData ? meaningData.meaning : '해석을 찾을 수 없습니다'
    });
  }

  return rtn;
};

exports.inputLog = async (messages, tokenType) => {
  if (!messages||!tokenType) {
    return;
  }
  const token = await tokenChecker(messages);
  const data = { create_at: new Date() };
  if (tokenType === 'INPUT') {
    data.rq_token = token;
  } else {
    if (tokenType === 'OUTPUT') {
      data.rs_token = token;
    } else {
      return;
    }
  }
  await TokenLogs.create(data);
};

exports.countTokens = async (messages, isInput) => {
  const extMsg = !!messages;
  let chkToken = 0;

  if ((extMsg && isInput) || extMsg) {
    chkToken = await tokenChecker(messages);
  }

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const targetMonth = `${year}${month}`;

    const totalInputTokens = await TokenLogs.sum('rq_token', {
      where: {
        c_id: {
          [Op.like]: `${targetMonth}%`
        }
      }
    }) || 0;

    return totalInputTokens + chkToken;
  } catch (error) {
    throw error;
  }
};