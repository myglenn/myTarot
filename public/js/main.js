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
  const savedTheme = localStorage.getItem('theme');
  const html = document.documentElement;
  const body = document.body;

  if (savedTheme === 'dark') {
    html.classList.add('dark');
    body.classList.add('dark');
  } else if (savedTheme === 'light') {
    html.classList.remove('dark');
    body.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.toggle('dark', prefersDark);
    body.classList.toggle('dark', prefersDark);
  }
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

  toggleBtn?.addEventListener('click', () => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.toggle('dark');
    body.classList.toggle('dark');

    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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

async function beforeRunReadingApi(question, ...cardIdxs) {
  try {
    showLoading();

    const response = await fetch('/main/act', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, cards: cardIdxs }),
    });

    if (!response.ok) {
      throw new Error('서버에서 오류 상태를 반환했습니다');
    }

    const result = await response.json();

    await sleep(1300); // 또는 추가 로딩 시간

    hideLoading();
    showResult(result);

    return true; // 성공했다는 표시
  } catch (error) {
    hideLoading();
    showAlert('문제가 발생했어요. 다시 시도해 주세요.');
    return false; // 실패했다는 표시
  }
}

function delImgs() {
  const imgContainer = document.querySelectorAll('#result-section div.tarot-card img');
  imgContainer.forEach(cardImg => {
    cardImg.remove();
  });

}


function showResult(result) {
  const resultSection = document.getElementById("result-section");
  if (resultSection) {
    resultSection.style.display = "block";

    const summary = resultSection.querySelector('ul');
    const imgContainer = document.querySelectorAll('#result-section div.tarot-card');
    let cards = result.cards;
    if (summary) {
      summary.innerHTML = '';
      for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        summary.innerHTML += `<li><strong>` + card.name_en + ` (` + card.direction + `)</strong> - ` + card.meaning + `</li>`;
      }
    }

    imgContainer.forEach((tmp, j) => {
      const img = document.createElement('img');
      img.src = '/images/' + cards[j].img;

      img.classList.add('card');
      
      if (cards[j].direction === '역방향') {
        img.classList.add('reversed');
      }
      
      if (tmp) {
        tmp.appendChild(img);
      }
    });

    const fullReading = resultSection.querySelector('p');
    if (fullReading) {
      fullReading.innerText = result.result;
    }
  }
}
// curl
async function readingApi(taroApiKey, question, selectedCards) {
  const response = await fetch('/api/reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taroApiKey, question, cards: selectedCards }),
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
  readingApi,
  delImgs
};