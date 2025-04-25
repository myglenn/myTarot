

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
        for(let i = 0; i < cards.length; i++) {
            if(cards[i].classList.contains('selected')) {
                sCnt++;
            }
        }
        if(sCnt > cnt) {
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
    loader.style.display = 'flex';
  }
  
  function hideLoading() {
    const loader = document.getElementById('loadingView');
    loader.style.display = 'none';
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
  
  // async function runReading(question, selectedCards) {
  //   try {
  //     showLoading(); // 1. 로딩 보여주기
  
  //     const response = await fetch('/api/reading', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ question, cards: selectedCards }),
  //     });

  //     await sleep(1200);
  
  //     const result = await response.json();
  
  //     hideLoading(); // 2. 로딩 숨기기
  //     showResult(result); // 3. 결과 출력
  //   } catch (error) {
  //     hideLoading();
  //     showAlert('문제가 발생했어요. 다시 시도해 주세요.');
  //     console.error(error);
  //   }
  // }