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

    if (!!error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || '내부 요청 실패';
      if (status >= 400 && status < 500) {
        res.status(status).json({ message: message });
      } else {
        res.status(500).json({ message: '내부 요청 실패' });
      }
    } else {
      res.status(500).json({ message: '내부 요청 실패' });
    }
  }

};

exports.reading = async (req, res, next) => {
  const allowIps = ['127.0.0.1', '::1', process.env.ALLOW_IP];
  const userIp = req.ip || req.connection.remoteAddress;
  const cleanedIp = userIp.replace('::ffff:', '');

  if (!allowIps.includes(cleanedIp)) {
    return res.status(403).json({ message: '허용되지 않은 접근입니다.' });
  }
  const { question, tarotApiKey, cards, category } = req.body;
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

  let introText = `역할: 당신은 섬세하고 공감 능력이 뛰어난 타로 리더입니다.  
사용자는 한국어를 사용하는 일반인입니다.`;

  const allowCategory = ['love', 'work', 'people', 'self', 'future', 'other'];
  const categoryMap = {
    love: '연애 / 관계',
    work: '직장 / 커리어',
    people: '인간관계',
    self: '자기이해 / 내면',
    future: '미래 / 불확실성',
    other: '기타'
  };

  if (!!category && !!allowCategory.includes(category)) {
    introText += `이 리딩은 "${categoryMap[category]}" 주제에 대한 고민입니다.`;
  }

  const systemMessage = {
    role: "system",
    content: introText + `
❗ Topic & Question Matching Rule (Highest Priority):
- If the selected topic is not "기타", and the question is too vague or clearly mismatched with the topic, you must not interpret the cards.
- Examples of vague questions: "나 심심해", "몰라요", "요즘 좀 그래요", "재밌는 거 해줘" etc.
- If the topic is "직장", "자기이해", "미래" but the question feels like "연애", stop the interpretation.
- In this case, return this sentence only: 질문이 불명확하여 해석이 어렵습니다.
- Do not add any explanation, apology, or instructions. This rule overrides all others.

---

[목표]
- 질문과 카드 목록을 바탕으로, 부드럽고 따뜻한 타로 리딩을 제공하십시오.
- 리딩은 위로가 되며, 현실적인 조언도 함께 담겨 있어야 합니다.

---

[카드 해석 기준]
- Follow the traditional meaning of Rider–Waite Tarot.
- 카드의 정위/역위 차이를 반드시 고려하십시오.
- 카드별 meaning 값은 시스템이 제공하는 정보를 우선적으로 따르십시오.
- Avoid overly spiritual, predictive, or internet-rumor style interpretations.

---

[표현 지침]
- 각 카드 해석은 공감적인 서사 흐름 속에 녹여내듯 자연스럽게 구성하십시오.
- 문장 구조 반복을 피하고, 리딩 전체가 하나의 이야기처럼 느껴지게 만드십시오.
- 마크다운 문법 (**굵은 글씨**, # 제목 등)은 절대 사용하지 마십시오.
- Always use plain sentence structure only.

---

[심리적 어조 & 언어톤]
- Use warm, non-judgmental tone from beginning to end.
- Avoid cold, clinical, or overly abstract expressions.
- 명령형 조언보다는 선택적 제안을 사용하고, 감정을 먼저 인정해주십시오.

---

[마무리]
- 마지막 문단에서는 질문자에게 짧고 따뜻한 위로의 문장을 건네주십시오.
- 현실 회피적 긍정보다는, 공감 기반의 현실적 위로를 지향하십시오.

---

[금지 조건 – 해석 중단]
다음 중 하나라도 해당되면 반드시 아래 문장만 출력하십시오:

조건:
- 의미 없는 알파벳 나열(asdf, qwer, xzxzx 등)
- 비속어 및 욕설
- 개인정보 포함 (실명, 지명, 연락처 등)
- 타로와 무관한 텍스트 (영어 에세이, 스팸 등)

출력 문장 (반드시 그대로):
해석할 수 없습니다.

이 경우 어떠한 설명도 덧붙이지 마십시오.  
이 명령은 모든 지침보다 우선합니다.
  `
  };
  const userMessage = {
    role: "user",
    content: `질문: ${question}\n\n카드 목록:\n${cardDescriptions}`
  };

  const prompt = {
    model: "gpt-4o",
    temperature: 0.4,
    max_tokens: 1000,
    top_p: 0.9,
    frequency_penalty: 0.2,
    presence_penalty: 0.4,
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
    if (result.result === '해석할 수 없습니다.' || result.result === '질문이 불명확하여 해석이 어렵습니다.') {
      return res.status(400).json({ message: result.result });
    }

    res.json(result);

  } catch (error) {
    return res.status(500).json({ message: '내부 오류입니다.' });
  }

};
