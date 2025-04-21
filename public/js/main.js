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
        if(!cnt || cnt === 2) {
            cards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
        } else {
            let sCnt = 0;
            for(let i = 0; i < cards.length; i++) {
                if(cards[i].classList.contains('selected')) {
                    sCnt++;
                }
            }
            if(sCnt > cnt) {
                console.log( cards[lastIdx].classList);
                cards[lastIdx].classList.remove("selected")
                isCause = true;
            }
            card.classList.toggle("selected");
        }
        console.log(card.id.split('_').pop());
        return !!isCause ? card.id.split('_').pop() : -1;
      });
    });
}