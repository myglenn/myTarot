function mkCard() {
    const contains = document.querySelector('#card_grid');
    
    for(let i = 0; i < 77; i++) {
        let newDiv = document.createElement("div");
        contains.append(newDiv);
    }
    let cards = contains.querySelectorAll('div');
    for(let i = 0; i <77; i++) {
        let card = cards[i];
        card.className = 'card';
        card.id = 'card_' + i;
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
    
      // 현재 모드가 저장되어 있다면 불러오기 (선택사항)
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
      }
    
      toggleBtn?.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        document.documentElement.classList.toggle('dark');
    
        // 상태 저장 (선택사항)
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
    loader.style.display = 'flex';
  }
  
  function hideLoading() {
    const loader = document.getElementById('loadingView');
    loader.style.display = 'none';
  }
  
  async function runReading(question, selectedCards) {
    try {
      showLoading(); // 1. 로딩 보여주기
  
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, cards: selectedCards }),
      });

      await sleep(1200);
  
      const result = await response.json();
  
      hideLoading(); // 2. 로딩 숨기기
      showResult(result); // 3. 결과 출력
    } catch (error) {
      hideLoading();
      showAlert('문제가 발생했어요. 다시 시도해 주세요.');
      console.error(error);
    }
  }