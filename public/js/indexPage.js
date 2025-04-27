import Main from './main.js';


window.onload = function () {
  // 1. DOM 요소들 먼저 가져오기
  const requestSection = document.getElementById("input-area");
  const selectSection = document.getElementById("card-area");
  const resultSection = document.getElementById("result-section");
  const loadingView = document.getElementById("loadingView");
  const questionInput = document.getElementById("question-input");
  const requestButton = document.getElementById("request-button");
  const retryButton = document.getElementById("retry-button");
  const alertClose = document.getElementById('alert-close');

  // 2. showOnlySection 함수 선언
  function showOnlySection(target, isFlex) {
    if (!target) {

      return;
    }

    [requestSection, selectSection, resultSection, loadingView].forEach(sec => {
      if (sec) sec.style.display = "none";
    });

    if (isFlex) {
      target.style.display = "flex";
    } else {
      target.style.display = "block";
    }
  }

  async function onCardSelectionComplete(selectedCardIds) {
    const question = questionInput.value.trim();
    if (!question) {
      Main.showAlert('질문을 입력해 주세요!');
      return;
    }

    showOnlySection(loadingView);

    setTimeout(async () => {
      const success = await Main.beforeRunReadingApi(question, ...selectedCardIds);
      if (!success) {
        Main.resetCards();
        Main.setupCardSelection({
          max: 3,
          onComplete: onCardSelectionComplete,
        });
        Main.delImgs();
        showOnlySection(requestSection, true);
        window.scrollTo(0, 0);
      }
    }, 400);
  }

  // 3. Main 세팅
  Main.mkCard();
  Main.setupCardSelection({
    max: 3,
    onComplete: onCardSelectionComplete,
  });
  Main.applySystemTheme();

  // 4. 버튼 이벤트 등록
  if (requestButton) {
    requestButton.addEventListener("click", () => {
      const question = questionInput.value.trim();
      if (!question) {
        Main.showAlert("질문을 입력해 주세요!");
        return;
      }
      Main.resetCards();
      showOnlySection(selectSection);
    });
  }

  if (retryButton) {
    retryButton.addEventListener("click", () => {
      questionInput.value = "";
      Main.resetCards();
      Main.setupCardSelection({
        max: 3,
        onComplete: onCardSelectionComplete,
      });
      Main.delImgs();
      showOnlySection(requestSection, true);
      window.scrollTo(0, 0);
    });
  }

  if (alertClose) {
    alertClose.addEventListener('click', function () {
      Main.closeAlert();
    });
  }
}