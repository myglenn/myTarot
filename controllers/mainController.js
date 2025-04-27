const dotenv = require('dotenv');
dotenv.config();
const tarotService = require('../services/tarotService');
const axios = require('axios');
const { spawn } = require('child_process');


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

  if (!allowIps.includes(cleanedIp)) {
    return res.status(403).json({ message: '허용되지 않은 접근입니다.' });
  }
  const { question, tarotApiKey, cards } = req.body;
  if (!question || !cards || !tarotApiKey) {
    return res.status(403).json({ message: '허용되지 않은 접근입니다.' });
  }
  if (tarotApiKey !== process.env.TAROT_API_KEY) {
    return res.status(403).json({ message: '허용되지 않은 접근입니다.' });
  }
  const regex = /^[ㄱ-ㅎ가-힣a-zA-Z\d!?,.~\s\n]{6,100}$/;
  if (!regex.test(question)) {
    return res.status(400).json({ message: "질문 형식이 올바르지 않습니다. 한글, 영문, 숫자, 띄어쓰기, 개행, !?,.~ 만 허용됩니다. 글자수는 6개에서 100개 사이입니다." });
  }


  const englishWordCount = await new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['pythonUtils/wordSplitter.py', question]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(Number(result.trim()));
      } else {
        reject(new Error(`Python process error: ${error}`));
      }
    });
  });
  if (englishWordCount > 3) {
    return res.status(400).json({ message: "질문에 영어 단어가 너무 많습니다. 한글 위주의 질문만 가능합니다." });
  }


  const cardList = await tarotService.getRandomCard(cards);

  const cardDescriptions = cardList.map((card, index) => {
    return `${index + 1}. ${card.name_en} (${card.direction})\n- 의미: ${card.meaning}`;
  }).join('\n\n');



  const systemMessage = {
    role: "system",
    content: `당신은 섬세하고 공감 능력이 뛰어난 타로 리더입니다.
              사용자는 한국어를 사용하는 일반인입니다.
              질문자의 감정과 상황을 깊이 이해하고, 마음을 어루만지듯 부드럽게 카드를 해석해 주세요.
              각 카드를 해석할 때, 표면적 의미를 간단히 설명한 뒤 질문자의 감정에 다정하게 공감해 주세요.
              그리고 그 감정에 대해 가볍게 인정하고, 현실적으로 적용 가능한 작은 조언을 함께 제시해 주세요. 
              이때 질문자가 선택할 수 있도록 1~2가지 작은 실천 방법을 제안해 주세요.
              리딩 전반은 카드별 해석이 단순히 나열되지 않도록, 하나의 부드러운 이야기처럼 자연스럽게 이어가 주세요.
              리딩 마지막에는 질문자에게 따뜻한 한 문장 위로를 건네 주세요.
              단순한 카드 설명에 그치지 말고, 카드가 담고 있는 심층적 메시지를 부드럽게 전달해 주세요.
              맹목적인 긍정은 피하고, 현실적이면서도 따뜻한 조언을 함께 담아 주세요.
              답변은 친근하고 자연스러운 대화체로 작성해 주세요.
              딱딱하거나 건조한 문장은 피하고, 자연스럽고 다정한 흐름을 유지해 주세요.
              **중요: 마크다운 문법(별표 **, # 제목표시 등)을 사용하지 말고**, 순수한 문장 형태로만 답변하세요.
              추가요청: 만약 질문이나 카드 설명에 비속어, 민감 정보(지명, 실명 등)나 부적절한 표현이 포함되어 있다고 판단되면, 해석을 즉시 중단하고 "해석할 수 없습니다."라고만 답변하세요. 추가 설명은 하지 마세요.`
  };
  const userMessage = {
    role: "user",
    content: `질문: ${question}\n\n카드 목록:\n${cardDescriptions}\n\n각 카드에 대해 따로따로 설명해 주시고, 전체적인 흐름도 자연스럽게 정리해 주세요. 공감어린 위로와 현실적인 조언도 함께 전해주시면 감사하겠습니다`
  };

  const prompt = {
    model: "gpt-4o",
    temperature: 0.8,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0.2,
    presence_penalty: 0.8,
    messages: [systemMessage, userMessage]
  };

  const tokenCount = await tarotService.countTokens(prompt.messages);

  if (process.env.INPUT_LIMIT_TOKEN <= tokenCount) {
    return res.status(403).json({ message: '월 사용량 초과로 API 사용을 중단합니다.' });
  }


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

    // 메시지는 db에 저장하지 않고 토큰 계산에만 쓰임
    await tarotService.inputLog(prompt.messages, 'INPUT');

    const resultMsg = response.data.choices[0].message.content;


    const result = {
      cards: cardList,
      result: resultMsg
    }

    // 메시지는 db에 저장하지 않고 토큰 계산에만 쓰임
    await tarotService.inputLog(response.data.choices[0].message, 'OUTPUT');
    if (result.result === '해석할 수 없습니다.') {
      return res.status(400).json({ message: result.result });
    }

    res.json(result);

  } catch (error) {
    throw error;
  }

};
