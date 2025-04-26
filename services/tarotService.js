const dotenv = require('dotenv');
dotenv.config();
const Card = require('../models/Cards');
const CardMeaning = require('../models/CardMeanings');
const TokenLogs = require('../models/TokenLogs');
const { tokenChecker } = require('../utils/tokenChecker');
const e = require('cors');


exports.getRandomCard = async (...idxs) => {
  const cards = await Card.findAll();
  const limit = 77;
  let randomNums = [];
  let rtn = [];

  if (cards.length <= 1 || idxs.length === 0 || idxs.length > 3) {
    return null;
  }

  for (let i = 0; i < idxs.length; i++) {
    let tmpNum = idxs[i];
    if (!!isNaN(tmpNum) || tmpNum < 0 || tmpNum > limit) {
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
    let targetNum = randomNums[idxs[i]];
    let card = cards.find(c => c.id === targetNum);
    if (!card) {
      return null;
    }
    let isFwd = Math.random() < 0.5 ;
    const meaningData = await CardMeaning.findOne({
      where: {
        card_id: card.id,
        is_reversed: !isFwd
      }
    });
    rtn.push({
      ...card.dataValues,
      direction: !!isFwd ? '정방향' : '역방향',
      meaning: meaningData ? meaningData.meaning : '해석을 찾을 수 없습니다'
    });
  }

  return rtn;
};

exports.countTokens = async (messages) => {
  const exitMsg = !!messages;
  let chkToken = 0;
  if (!!exitMsg) {
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
    });

    if (!totalInputTokens || totalInputTokens == null) {
      totalInputTokens = 0;
    }
    return totalInputTokens + chkToken;
  } catch (error) {
    throw error;
  }
};