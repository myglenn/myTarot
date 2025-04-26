

function mkCard() {
  const grid = document.querySelector('#card_grid');
  grid.innerHTML = "";
  for (let i = 0; i < 78; i++) {
    const div = document.createElement('div');
    div.className = 'card';
    div.id = 'card_' + i;
    grid.appendChild(div);
  }
}

function selectCard(cnt, lastIdx) {
  const cards = document.querySelectorAll(".card");
  let rtn;
  let isCause;
  cards.forEach(card => {
    card.addEventListener("click", () => {
      let sCnt = 0;
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains('selected')) {
          sCnt++;
        }
      }
      if (sCnt > cnt) {
        return;
      }
      card.classList.toggle("selected");
    });
  });
}

function applySystemTheme() {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.classList.toggle('dark', prefersDark);
}

window.addEventListener('DOMContentLoaded', () => {
  const starsContainer = document.querySelector('.stars');
  for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDuration = `${1.5 + Math.random()}s`;
    starsContainer.appendChild(star);
  }

  const toggleBtn = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem('theme');


  toggleBtn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });

});

function showAlert(message) {
  const alertBox = document.getElementById('customAlert');
  document.getElementById('alertMessage').textContent = message;
  alertBox.style.display = 'flex';
  requestAnimationFrame(() => alertBox.classList.add('show'));
}

function closeAlert() {
  const alertBox = document.getElementById('customAlert');
  alertBox.classList.remove('show');
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 400);
}



function showLoading() {
  const loader = document.getElementById('loadingView');
  if (loader) {
    loader.style.opacity = '1';
    loader.style.pointerEvents = 'auto';
    loader.style.visibility = 'visible';
  }
}

function hideLoading() {
  const loader = document.getElementById('loadingView');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    loader.style.visibility = 'hidden';
  }
}

let selectedCards = new Set();

function setupCardSelection({ max = 3, onComplete }) {
  const cards = document.querySelectorAll(".card");
  selectedCards.clear();

  cards.forEach((card) => {
    if (card.dataset.bound === "true") return;
    card.dataset.bound = "true";

    card.addEventListener("click", () => {
      const cardId = card.id;
      if (!cardId) return;

      if (selectedCards.has(cardId)) {
        card.classList.remove("selected");
        selectedCards.delete(cardId);
        return;
      }

      if (selectedCards.size >= max) return;

      card.classList.add("selected");
      selectedCards.add(cardId);


      if (selectedCards.size === max && typeof onComplete === "function") {
        onComplete(Array.from(selectedCards));
      }
    });
  });
}
function resetCards() {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("selected");
  });
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function beforeRunReadingApi(qusetion, ...cardIdxs) {
  try {
    showLoading();

    

    const response = await fetch('/main/act', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qusetion, cards: cardIdxs }),
    });
    
    if (!response.ok) {
      throw new Error('서버에서 오류 상태를 반환했습니다');
    }
    
    await sleep(5000);
    
    const result = await response.json();
    
    hideLoading();
    showResult(result);
  } catch (error) {
    hideLoading();
    showAlert('문제가 발생했어요. 다시 시도해 주세요.');

  }
}

function showResult(result) {
  const resultSection = document.getElementById("result-section");
  if (resultSection) {
    resultSection.style.display = "block";

    // 카드나 해석 내용 갱신하는 코드 추가 가능
    // 예시로만 보여줄게
    const tarotCards = document.querySelectorAll('.tarot-card');
    // tarotCards.forEach((cardDiv, idx) => {
    //   const img = document.createElement('img');
    //   img.src = `/cards/${result.cards[idx]}.jpg`; // 가라 데이터라면 번호만 있다고 가정
    //   img.alt = `Card ${idx}`;
    //   img.width = 100;
    //   cardDiv.innerHTML = ''; // 초기화
    //   cardDiv.appendChild(img);
    // });

    const summary = document.querySelector('ul');
    if (summary) {
      summary.innerHTML = `<li><strong>데이터 수신 완료</strong></li>`;
    }

    const fullReading = document.querySelector('p');
    if (fullReading) {
      fullReading.innerText = "가라 데이터 기반 리딩 결과입니다.";
    }
  }
}
// curl
async function readingApi(taroApiKey, question, selectedCards) {
  const response = await fetch('/api/reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({taroApiKey, question, cards: selectedCards }),
  });

  return await response.json();
}

const alertClose = document.getElementById('alert-close');

if (alertClose) {
  alertClose.addEventListener('click', () => {
    closeAlert();
  });
}

export default {
  beforeRunReadingApi,
  mkCard,
  selectCard,
  applySystemTheme,
  showAlert,
  closeAlert,
  showLoading,
  hideLoading,
  setupCardSelection,
  resetCards,
  readingApi
};