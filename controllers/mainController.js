const dotenv = require('dotenv');
dotenv.config();
const tarotService = require('../services/tarotService');
const axios = require('axios');


exports.apiAct = async (req, res) => {
  res.send('API 문서 페이지입니다!');
};


exports.mainAct = async (req, res) => {
  const { question, cards } = req.body;



  for (let i = 0; i < cards.length; i++) {
    cards[i] = cards[i].split('_').pop();
  }
  try {
    const response = await axios.post('http://localhost:3000/api/reading', {
      question: question,
      tarotApiKey: process.env.TAROT_API_KEY,
      cards: cards,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: '내부 요청 실패' });
  }

};

exports.reading = async (req, res, next) => {
  const allowIps = ['127.0.0.1', '::1', process.env.ALLOW_IP];
  const userIp = req.ip || req.connection.remoteAddress;
  const cleanedIp = userIp.replace('::ffff:', '');
  const regex = /^[ㄱ-ㅎ가-힣a-zA-Z\d!?.~\s\n]{1,100}$/;

  if (!allowIps.includes(cleanedIp)) {
    return res.status(403).json({ message: '허용되지 않은 접근입니다.' });
  }
  const { question, tarotApiKey, cards } = req.body;
  if (!question || !cards || !tarotApiKey) {
    return res.status(403).json({ message: '허용되지 않은 접근입니다.' });
  }
  if (!regex.test(question)) {
    return res.status(400).json({ message: "질문 형식이 올바르지 않습니다. 한글, 영문, 숫자, 띄어쓰기, 개행, !?. 만 허용됩니다." });
  }
  if (tarotApiKey !== process.env.TAROT_API_KEY) {
    return res.status(403).json({ message: '허용되지 않은 접근입니다.' });
  }


  const cardList = await tarotService.getRandomCard(cards);

  const cardDescriptions = cardList.map((card, index) => {
    return `${index + 1}. ${card.name_en} (${card.direction})\n- 의미: ${card.meaning}`;
  }).join('\n\n');



  const systemMessage = {
    role: "system",
    content: `당신은 섬세하고 공감 능력이 뛰어난 타로 리더입니다.
              사용자는 한국어를 사용하는 일반인입니다.
              질문자의 감정과 상황을 고려해 카드를 따뜻하고 부드럽게 해석해 주세요.
              맹목적인 긍정은 피하고, 진심 어린 조언을 함께 담아 주세요.
              리딩 마지막엔 한 줄의 따뜻한 위로 문장으로 마무리해 주세요.
              딱딱하거나 건조한 문장은 피하고, 자연스럽게 말해 주세요.
              **중요: 마크다운 문법(별표 **, # 제목표시 등)을 사용하지 말고**, 순수한 문장 형태로만 답변하세요.**
              추가요청: 만약 질문이나 카드 설명에 비속어, 민감 정보(지명, 실명 등)나 부적절한 표현이 포함되어 있다고 판단되면, 해석을 즉시 중단하고 "해석할 수 없습니다."라고만 답변하세요. 추가 설명은 하지 마세요.`
  };
  const userMessage = {
    role: "user",
    content: `질문: ${question}\n\n카드 목록:\n${cardDescriptions}\n\n각 카드에 대해 따로따로 설명해 주시고, 전체적인 흐름도 자연스럽게 정리해 주세요. 공감어린 위로와 현실적인 조언도 함께 전해주시면 감사하겠습니다`
  };

  const prompt = {
    model: "gpt-4o",
    temperature: 0.9,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0.2,
    presence_penalty: 0.6,
    messages: [systemMessage, userMessage]
  };


  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      prompt,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`
        }
      }
    );

    const resultMsg = response.data.choices[0].message.content;


    const result = {
      cards: cardList,
      result: resultMsg
    }

    if (result.result === '해석할 수 없습니다.') {
      return res.status(400).json({ message: result.result });
    }

    res.json(result);

  } catch (error) {
    throw error;
  }

};
