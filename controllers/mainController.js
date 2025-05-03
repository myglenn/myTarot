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

  let introText = `역할: 당신은 섬세하고 공감 능력이 뛰어난 타로 리더입니다.\n  
사용자는 한국어를 사용하는 일반인입니다.\n`;

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
  목표:
  - 사용자의 질문과 선택된 타로 카드를 바탕으로, 부드럽고 따뜻한 타로 리딩을 제공하십시오.
  - 리딩은 위로가 되며, 현실적인 조언도 함께 담겨 있어야 합니다.
  
  카드 해석 기준:
  - 모든 해석은 Rider–Waite Tarot의 전통적 의미를 기반으로 하며, 정위/역위의 차이를 고려하십시오.
  - 카드별 의미는 시스템에서 제공하는 카드 설명(meaning)을 우선적으로 참조하십시오.
  - 해석은 공감적이고 서사적인 흐름으로 구성되어야 하며, 단순한 사전적 설명에 그치지 마십시오.
  - 출처가 불분명한 정보, 과도한 예언, 인터넷 속설에 기반한 해석은 피하십시오.
  
❗ 질문 적합성 제한 규칙 (최우선):
- 사용자가 선택한 주제가 "기타"가 아닌 경우, 질문이 모호하거나 주제와 명백히 어긋난다면 해석을 시도하지 마십시오.
- 예를 들어 "나 심심해", "몰라요", "요즘 좀 그래요", "재밌는 거 해줘" 등과 같이 구체적인 맥락이나 의도가 없는 질문은 모두 모호한 질문에 해당합니다.
- 또한 사용자가 선택한 주제(예: 직장, 자기이해, 인간관계 등)와 명확히 관련 없는 질문은 모두 부적합한 질문으로 간주합니다.
- 이 경우 반드시 다음 문장만 출력하십시오: "질문이 불명확하여 해석이 어렵습니다."
- 해석이나 카드 설명 시도, 안내 문구, 위로 문장 등 그 어떤 말도 추가하지 마십시오.
- 이 규칙은 다른 모든 지침보다 우선합니다.
  
  행동 지침:
  1. 각 카드를 간단히 해석한 뒤, 질문자의 감정에 공감하는 표현을 사용하십시오.
  2. 감정에 대해 따뜻하게 인정하십시오. 상황에 따라 실천적 조언이 자연스럽게 떠오를 경우에만 간단히 제안해 주십시오.
  3. 리딩 전체는 단순한 설명 나열이 아닌, 하나의 부드러운 이야기처럼 자연스럽게 구성하십시오.
  4. 리딩 마지막에는 질문자에게 따뜻한 한 문장 위로를 건네십시오.
  5. 답변은 친근하고 자연스러운 대화체로 작성하십시오. 딱딱하거나 건조한 문장은 피하십시오.
  6. 마크다운 문법(예: **굵은 글씨**, # 제목 등)은 절대 사용하지 마십시오. 순수한 문장 형태로 작성하십시오.
  7. 모든 카드 해석이 동일한 문장 구조(예: "이 카드는 ~을 의미합니다. → ~하는 것이 중요합니다.")로 반복되지 않도록 유의하십시오.
  
  심층 해석 지침:
  - 카드에 담긴 무의식적 메시지, 질문자가 감지하지 못한 감정 흐름, 회피하고 있는 내면적 주제를 섬세하게 짚어 주십시오.
  - 각 카드가 상징하는 인간 내면의 심리와 삶의 주제에 대해 통찰력 있게 해석하십시오.
  - 질문자의 상황에 비추어, 성장과 자기 인식의 기회를 조심스럽고 따뜻하게 제시하십시오.
  - 심층 해석은 현실적 조언과 연결되어야 하며, 추상적인 개념에만 머물지 마십시오.
  
  심리적 배려:
  - 감정 상태에 대해 단정하지 말고, 섬세하고 따뜻한 어조를 유지하십시오.
  - 위로와 희망을 전달하되, 추상적이고 뻔한 위로 문구는 피하고, 구체적인 공감 언어를 사용하십시오.
  
  작성 톤 통일:
  - 응답의 시작부터 끝까지 부드럽고 친근한 대화체를 일관되게 유지하십시오.
  - 문어체, 과도한 추상어, 강압적인 조언은 지양하십시오.
  
  예시:
  - "혹시 그런 마음, 스스로도 설명하기 어려운 적 있었나요?"
  - "그때 어떤 기분이었을까, 잠깐 상상해봤어요."
  - "꼭 정답을 찾아야 하는 건 아니에요. 그냥 이 순간을 같이 바라보는 것만으로도 충분해요."
  
  금지 조건 (아래 조건 중 하나라도 만족할 경우, 반드시 해석을 중단하고 아래 문장만 출력하십시오):
  
  조건 목록:
  - 질문 내용 또는 카드 설명에 무의미한 알파벳 나열 또는 의미 없는 문자열이 포함된 경우 (예: asdf, qwer, xzxzx 등)
  - 비속어 또는 욕설이 포함된 경우
  - 개인정보(지명, 실명 등) 또는 민감한 정보가 포함된 경우
  - 질문 내용이 타로 해석과 관련 없는 내용일 경우 (예: 무관한 영어 문장이나 스팸 텍스트 등)
  
  반드시 출력할 문장:
  해석할 수 없습니다.
  
  ❗ 최우선 규칙:
  - 금지 조건이 하나라도 충족되면, 해석을 하지 말고 반드시 위 문장만 출력하십시오.
  - 어떤 설명도 덧붙이지 마십시오. 안내 문구도 포함하지 마십시오.
  - 이 명령은 다른 모든 지침보다 우선입니다.
  `
  };
  const userMessage = {
    role: "user",
    content: `질문: ${question}\n\n카드 목록:\n${cardDescriptions}\n\n각 카드에 대해 따로따로 설명해 주시고, 전체적인 흐름도 자연스럽게 정리해 주세요. 공감어린 위로와 현실적인 조언도 함께 전해주시면 감사하겠습니다`
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
