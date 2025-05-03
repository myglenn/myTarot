function mkCard() {
  const grid = document.querySelector('#card_grid');
  grid.innerHTML = "";
  for (let i = 0; i < 78; i++) {
    const div = document.createElement('div');
    div.className = 'card';
    div.id = 'card_' + i;

    div.style.opacity = '0';
    div.style.transform = 'scale(0.8)';
    div.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      div.style.opacity = '1';
      div.style.transform = 'scale(1)';
    }, i * 15);

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
      console.log('sCnt ' + sCnt);
      if (sCnt > cnt) {
        return;
      }
      card.classList.toggle("selected");
    });
  });
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


function showLoading(message) {
  const loader = document.getElementById('loadingView');
  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';
    loader.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
    let contentArea = document.getElementById('contentMsg');
    contentArea.innerText = !!message ? message : '카드 해석 중입니다..';
  }
}

function hideLoading() {
  const loader = document.getElementById('loadingView');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    loader.style.visibility = 'hidden';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 400);
    document.body.style.overflow = '';
  }
}


let selectedCards = new Set();

function setupCardSelection({ max = 3, onComplete }) {
  const cards = document.querySelectorAll(".card");
  selectedCards.clear();

  cards.forEach((card) => {
    if (card.dataset.bound === "true") {
      return;
    }
    card.dataset.bound = "true";

    card.addEventListener("click", () => {
      const cardId = card.id;
      if (!cardId) {
        return;
      }

      if (selectedCards.has(cardId)) {
        card.classList.remove("selected");
        selectedCards.delete(cardId);
      } else {
        if (selectedCards.size >= max) { return; }

        card.classList.add("selected");
        selectedCards.add(cardId);
      }

      cards.forEach(c => {
        if (selectedCards.has(c.id)) {
          c.style.opacity = 1;
          c.style.zIndex = 10;
        } else {
          c.style.opacity = 0.3;
          c.style.zIndex = 1;
        }
      });

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

    const result = await response.json();

    if (!response.ok) {
      showAlert(result.message);
      return false;
    }



    await sleep(1300);

    hideLoading();
    showResult(result);

    return true;
  } catch (error) {
    hideLoading();
    showAlert('문제가 발생했어요. 다시 시도해 주세요.');
    return false;
  } finally {
    hideLoading();
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

      img.classList.add('result-card');

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



function applyCardLayout() {
  const cards = document.querySelectorAll(".card");
  const total = cards.length;
  const container = document.querySelector(".card-grid");

  if (!container) {
    return;
  }

  container.style.position = "relative";

  const groupSize = 20;
  const spacing = 0.5;
  const groupCount = Math.ceil(total / groupSize);
  const estimatedHeight = (spacing * groupSize + 2) * 1.25;
  container.style.minHeight = estimatedHeight + 5 + "rem";

  if (total <= 20) {
    const angleStep = 40 / (total - 1);
    cards.forEach((card, i) => {
      const angle = -20 + i * angleStep;
      card.style.transform = `rotate(${angle}deg) translateX(-50%)`;
      card.style.transformOrigin = "bottom center";
      card.style.position = "absolute";
      card.style.left = "50%";
      card.style.bottom = "0";
    });
  } else {
    const isMobile = window.innerWidth <= 480;
    const groupSpacing = isMobile ? 4.35 : 7;
    const baseLeft = 0;

    const groupWidthRem = groupSpacing;
    const groupWidthPx = groupWidthRem * 16;
    const totalStackWidthPx = groupCount * groupWidthPx;
    const containerWidth = container.clientWidth;
    const offsetX = containerWidth / 2 - totalStackWidthPx / 2;

    cards.forEach((card, i) => {
      const group = Math.floor(i / groupSize);
      const offset = i % groupSize;
      const leftPx = group * groupWidthPx + offsetX;
      card.style.position = "absolute";
      card.style.left = `${leftPx}px`;
      card.style.top = `${offset * spacing}rem`;
      card.style.transform = "translateX(0)";
      card.style.zIndex = offset;
    });
  }
}

function shuffleCardsAnimation() {
  const cards = document.querySelectorAll(".card");
  const cardArea = document.querySelector("#card_grid");

  showLoading('카드를 섞는 중입니다...');

  cardArea.classList.add("hidden");

  requestAnimationFrame(() => {
    setTimeout(() => {
      cards.forEach((card, i) => {
        card.style.position = "absolute";
        card.style.left = "0";
        card.style.top = "0";

        const angle = Math.random() * 30 - 15;
        const offsetX = (Math.random() * 2.5 - 1) + "rem";
        const offsetY = (Math.random() * 1.25 - 0.625) + "rem";

        card.style.transition = "transform 0.4s ease, opacity 0.4s ease";
        card.style.transform = `translate(${offsetX}, ${offsetY}) rotate(${angle}deg)`;
        card.style.opacity = "0.6";

        setTimeout(() => {
          card.style.opacity = "1";
        }, 400 + i * 10);
      });

      setTimeout(() => {
        cardArea.classList.remove("hidden");
        applyCardLayout();
        hideLoading();
        window.scrollTo(0, 0);
      }, 1000);
    }, 50);
  });
}


function setupCardClickEffect(max = 3, onComplete) {
  const cards = document.querySelectorAll(".card");
  const selected = new Set();

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.id;
      if (!id || selected.has(id)) {
        return;
      }
      if (selected.size >= max) {
        return;
      }

      selected.add(id);
      card.classList.add("selected");
      card.style.transform += " translateY(-1.25rem) scale(1.2)";
      card.style.zIndex = 100;

      cards.forEach(c => {
        if (!selected.has(c.id)) c.style.opacity = 0.3;
      });

      if (selected.size === max && typeof onComplete === "function") {
        onComplete(Array.from(selected));
      }
    });
  });
}

export default {
  beforeRunReadingApi,
  mkCard,
  selectCard,
  showAlert,
  closeAlert,
  showLoading,
  hideLoading,
  setupCardSelection,
  resetCards,
  readingApi,
  delImgs,
  shuffleCardsAnimation,
  applyCardLayout,
  setupCardClickEffect
};