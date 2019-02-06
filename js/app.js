// Create a list that holds all of your cards
let cards = ['fa-diamond','fa-diamond',
              'fa-paper-plane-o','fa-paper-plane-o',
              'fa-anchor','fa-anchor',
              'fa-bolt','fa-bolt',
              'fa-cube','fa-cube',
              'fa-leaf','fa-leaf',
              'fa-bicycle','fa-bicycle',
              'fa-bomb','fa-bomb',
            ]

function generateCard(card) {
  return `<li class="card"><i class="fa ${card}"></i></li>`;
}

// Create a list that holds all the starting stars
const stars_html = `<li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>`

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 *    New Game
 *   - Shuffle the list of cards
 *   - Reset Stars
 *   - Reset Timer and Moves
 */

function initGame() {
  let cardHTML = shuffle(cards.map(generateCard));
  deck.innerHTML = cardHTML.join('');
  stars.innerHTML = stars_html;
  moves = 0;
  timer = 0;
  start = false;
  clearInterval(timer_object);
  document.querySelector('.moves').textContent = 0;
  document.querySelector('.timer-string').textContent = '00:00';
}


function openCard(evt) {
  // start timer on opening the first card
  if (start === false) {
    start = true;
    timer_object = setInterval(myTimer, 1000);
  }
  // check if stack of open cards already contains 2 cards
  if (open_cards.length < 2) {
    evt.target.classList.add('open','show');
  }
  open_cards = document.querySelectorAll('.card.open');
  if (open_cards.length === 2 && open_cards[0].getElementsByClassName('fa').item(0).className === open_cards[1].getElementsByClassName('fa').item(0).className) {
      matchCards();
  } else if (open_cards.length === 2 && open_cards[0].getElementsByClassName('fa').item(0).className !== open_cards[1].getElementsByClassName('fa').item(0).className) {
      for (const card of open_cards) {
        card.classList.add('wrong');
      }
      setTimeout(closeCards,1000);
  }
}

// lock matched cards
function matchCards() {
  for (const card of open_cards) {
    card.classList.add('match');
    card.classList.remove('show','open');
  }
  open_cards = [];
  moves = moves + 1;
  document.querySelector('.moves').textContent = moves;
  // if win, pop-up the modal and display the result
  if (checkWin() === true) {
    clearInterval(timer_object);
    modal.style.display = "block";
    document.querySelector('.result').textContent = `With ${moves} moves and ${document.querySelectorAll('.fa-star').length} stars, within ${document.querySelector('.timer-string').textContent}`;
  }
  removeStar();
}

//close unmatched cards
function closeCards() {
  if (open_cards.length === 2) {
    for (const card of open_cards) {
      card.classList.remove('show','open','wrong');
    }
    open_cards = [];
    moves = moves + 1;
    document.querySelector('.moves').textContent = moves;
    removeStar();
  }
}

function removeStar() {
  star = document.querySelector('.fa-star')
  if (document.querySelectorAll('.fa-star').length > 1) {
  star.parentNode.removeChild(star);
  }
}

function myTimer() {
  timer = timer + 1;
  timer_minute = Math.floor(timer/60);
  timer_second = timer % 60;
  document.querySelector('.timer-string').textContent = `${pad(timer_minute,2)}:${pad(timer_second,2)}`;
}

function pad(num, size) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

// winning condition: all 16 cards are matched
function checkWin() {
    if (document.querySelectorAll(".match").length == 16) {
      return true;
    }
    else {
      return false;
    }
}


/*
* Main
*/
let deck = document.querySelector('.deck');
let stars = document.querySelector('.stars');
let all_cards = document.querySelectorAll('.card');
let open_cards = [];
let moves = 0;
let timer = 0;
let timer_minute = 0;
let timer_second = 0;
let star = document.querySelector('.fa-star')
let start = false;
let timer_object = null;
let modal = document.getElementsByClassName("modal")[0];
let win = false;

initGame();
deck.addEventListener('click',openCard);

//restart game
let restart = document.querySelector('.restart');
restart.addEventListener('click',function(){
  for (const card of all_cards) {
    card.classList.remove('show','open','match');
  }
  initGame();
});
//close modal
let close = document.querySelector('.close');
close.addEventListener('click',function(){
  modal.style.display = "none";
});

//play again
document.querySelector('.play-again').addEventListener('click',function(){
  for (const card of all_cards) {
    card.classList.remove('show','open','match');
  }
  modal.style.display = "none";
  initGame();
});
