
// ......... Zip up with compressed jquery.js
// ......... Remove console logs?
// ....... Tidy card edges
// ...... Make a tally that shows the number of wins, losses and draws
// ..... Display current score
// ..... Add Blackjack rule and "Blackjack!" notice
// ..... Make webpage responsive
// .... "You Win!" bigger and "Play again?" smaller
// .... Make sure that no card appears twice
// .... Add transitions
// .... Cards take too long to load - sort out
// .... Buttons on:hover
// .... Tidy up code big time
// ... Put repeated code into global scope
// .. Fade things away when restarting game
// . Add rules (inc "Dealer must draw on 16 and stand on 17")
// Position "Bust" and "21"


const cards = [];
let dealerCards = [];
let dealerTotalScore;
let dealerColumns = '';
let playerCards = [];
let playerTotalScore;
let playerColumns = '';
let noOfPlayerCards = 0;
const shortDelay = 300;
const mediumDelay = 500;
const longDelay = 800;


for (let i = 2; i <= 14; i++) { // Populates cards array using cardFactory().
  cards.push(cardFactory('clubs', i));
  cards.push(cardFactory('diamonds', i));
  cards.push(cardFactory('hearts', i));
  cards.push(cardFactory('spades', i));
}

$('#begin').on('click', displayCards);


function cardFactory(suit, rank) { // Factory function for creating cards.
  let value = 0;
  let name = `${suit}-${rank}`;

  if (rank > 11 && rank <= 14) {  // A=11, J=12, Q=13, K=14
    value = 10;
  } else {
    value = rank;
  }

  return {
    suit,
    rank,
    value,
    name
  }
}

function displayCards() { // Begins the game.
  console.log('\ndisplayCards');
  $('.notice')
      .off('click', displayCards)
      .fadeTo('fast', 0)
      .hide();

  resetGame();

  window.setTimeout(function() { // Deals cards.
    $('#player1').show();
    window.setTimeout(function() {
      $('#dealer1').show();
      window.setTimeout(function() {
        $('#player2').show();
        window.setTimeout(function() {
          $('#dealer2').show();
          window.setTimeout(dealerFirstTurn, shortDelay);
        }, shortDelay);
      }, shortDelay);
    }, shortDelay);
  }, mediumDelay);
}

function dealerFirstTurn() { // Dealer gets first card face-up.
  console.log('\ndealerFirstTurn');

  const randomNum = Math.floor(Math.random() * 52);
  dealerTotalScore = cards[randomNum].value;
  let dealerCard1 = cards[randomNum].name;

  console.log(`card ${randomNum}: ${cards[randomNum].name}`);
  console.log(cards[randomNum]);

  dealerCards.push(dealerTotalScore);

  console.log(`Dealer has 1 card:`);
  console.log(dealerCards);
  console.log(`Total score: ${dealerTotalScore}`)
  console.log('\n');

  $('#dealer1').attr('src', `card-pics/${dealerCard1}.jpg`);

  playerTurn();
}

function playerTurn() { // Once dealer has been dealt first card.
  console.log('\nplayerTurn');
  let drawnCardScore;

  window.setTimeout(function() { // First two cards revealed.
    playerDrawCard();

    window.setTimeout(function() {
      playerDrawCard();
      $('#playerTurnDiv').fadeTo('fast', 1);
      $('#player').css('border-style', 'solid');
      $('#hit, #stay').fadeTo('fast', 1);
    }, shortDelay);
  }, mediumDelay);

  function playerDrawCard() {
    console.log('playerDrawCard');
    const randomNum = Math.floor(Math.random() * 52);
    drawnCardScore = cards[randomNum].value;

    console.log(`card ${randomNum}: ${cards[randomNum].name}`);
    console.log(cards[randomNum]);

    playerCards.push(drawnCardScore);
    noOfPlayerCards++

    function scoreCards() { // Totals the cards scores.
      console.log('scoreCards');
      playerTotalScore = playerCards.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    }
    scoreCards();

    while (playerTotalScore > 21) { // Turns first 11 into a 1 when necessary.
      if (playerCards.findIndex(element => element === 11) !== -1) {
        playerCards[playerCards.findIndex(element => element === 11)] = 1;

        scoreCards();
      } else {
        break;
      }
    }

    if (playerTotalScore >= 21) { // Turns off hit and stay buttons.
      $('#hit').off('click', hit);
      $('#stay').off('click', stay);
    }

    console.log(`Player has ${noOfPlayerCards} cards:`);
    console.log(playerCards);
    console.log(`Total score: ${playerTotalScore}`)
    console.log('\n');

    let playerCard = cards[randomNum].name;

    $(`#player${noOfPlayerCards}`)
      .show()
      .attr('src', `card-pics/${playerCard}.jpg`);

    addGridColumn('#playerGrid', playerColumns, noOfPlayerCards);

    if (playerTotalScore === 21) { // Twenty One!
      console.log('Twenty One!');
      window.setTimeout(function(){
        $('#playerTwentyOne')
            .fadeTo('fast', 1)
            .css('display', 'inline-block');
        window.setTimeout(dealerTurn, longDelay);
      }, longDelay)
    }

    if (playerTotalScore > 21) { // Bust!
      console.log('Bust!');
      window.setTimeout(function(){
      $('#playerBust')
          .fadeTo('fast', 1)
          .css('display', 'inline-block');
      window.setTimeout(dealerTurn, longDelay);
      }, longDelay)
    }
  }
    $('#hit').on('click', hit);
    $('#stay').on('click', stay);


  function hit() { // Hit.
    console.log('hit');

      $('#playerHit')
          .show()
          .fadeTo('fast', 1);
      window.setTimeout(function() {
        $('#playerHit')
            .fadeTo('fast', 0)
            .hide();
      }, shortDelay);

    playerDrawCard();
  }

  function stay() { // Stay.
    console.log('stay');

    $('#playerStay')
        .show()
        .fadeTo('fast', 1);
    window.setTimeout(function() {
      $('#playerStay')
          .fadeTo('fast', 0)
          .hide();
    }, longDelay);

    window.setTimeout(dealerTurn, shortDelay);
    $('#stay').off('click', stay);
    $('#hit').off('click', hit);
  }
}

function dealerTurn() { // After player has finished their turn.
  console.log('\ndealerTurn');
  let noOfDealerCards = 1;
  let drawnCardScore = 0;

  $('#playerTurnDiv').fadeTo('fast', 0);
  $('#player').css('border-style', 'hidden');
  $('#hit, #stay').fadeTo('fast', 0.4);
  $('#dealerTurnDiv').fadeTo('fast', 1);
  $('#dealer').css('border-style', 'solid');


  dealerDrawCard();

  function dealerDrawCard() {
    console.log('dealerDrawCard');
    const randomNum = Math.floor(Math.random() * 52);
    drawnCardScore = cards[randomNum].value;

    console.log(`card ${randomNum}: ${cards[randomNum].name}`);
    console.log(cards[randomNum]);

    dealerCards.push(drawnCardScore);
    noOfDealerCards++

    function scoreCards() { // Totals the cards scores.
      console.log('scoreCards');
      dealerTotalScore = dealerCards.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    }
    scoreCards();

    while (dealerTotalScore > 21) { // Turns first 11 into a 1 when necessary.
      if (dealerCards.findIndex(element => element === 11) !== -1) {
        //turn first 11 into a 1
        dealerCards[dealerCards.findIndex(element => element === 11)] = 1;
        scoreCards();
      } else {
        break;
      }
    }

    console.log(`Dealer has ${noOfDealerCards} cards:`);
    console.log(dealerCards);
    console.log(`Total score: ${dealerTotalScore}`)
    console.log('\n');

    let dealerCard = cards[randomNum].name;

    $(`#dealer${noOfDealerCards}`)
      .show()
      .attr('src', `card-pics/${dealerCard}.jpg`);

    addGridColumn('#dealerGrid', dealerColumns, noOfDealerCards);

    if (dealerTotalScore === 21) { // Twenty One.
      console.log('Twenty One');
      window.setTimeout(function(){
        $('#dealerTwentyOne').fadeTo('fast', 1)
      }, longDelay)
    }

    if (dealerTotalScore > 21) { // Bust!
      console.log('Bust!');
      window.setTimeout(function(){
        $('#dealerBust').fadeTo('fast', 1);
      }, longDelay)
    }

    if (dealerTotalScore < 17) { // Hit.
      window.setTimeout(function() {
        $('#dealerHit')
            .show()
            .fadeTo('fast', 1);
        window.setTimeout(function() {
          $('#dealerHit')
              .fadeTo('fast', 0)
              .hide();
        }, shortDelay);
      }, shortDelay);

      window.setTimeout(dealerDrawCard, longDelay);

    } else { // Stay.
      if (dealerTotalScore < 21) {
        window.setTimeout(function() {
          $('#dealerStay')
              .show()
              .fadeTo('fast', 1);
          window.setTimeout(function() {
            $('#dealerStay')
                .fadeTo('fast', 0)
                .hide();
          }, longDelay);
        }, shortDelay);
      }

      window.setTimeout(gameEnd, longDelay);
    }
  }
}

function gameEnd() { // Win, lose or draw.
  console.log('\ngameEnd');
  $('#dealerTurnDiv').fadeTo('fast', 0);
  $('#dealer').css('border-style', 'hidden');

  if (playerTotalScore > 21) playerTotalScore = 0;
  if (dealerTotalScore > 21) dealerTotalScore = 0;

  if (playerTotalScore > dealerTotalScore) {
    win();
  } else if (playerTotalScore < dealerTotalScore) {
    lose();
  } else {
    draw();
  }

  function win() {
    console.log('WIN');
    window.setTimeout(function() {
      $('#win')
          .show()
          .fadeTo('fast', 1)
          .on('click', function() {
            $('#win')
                .fadeTo('fast', 0)
                .hide();
            displayCards();
          });
    }, longDelay);
  }

  function lose() {
    console.log('LOSE');
    window.setTimeout(function() {
      $('#lose')
          .show()
          .fadeTo('fast', 1)
          .on('click', function() {
            $('#lose')
                .fadeTo('fast', 0)
                .hide();
            displayCards();
          });
    }, longDelay);
  }

  function draw() {
    console.log('DRAW');
    window.setTimeout(function() {
    $('#draw')
        .show()
        .fadeTo('fast', 1)
        .on('click', function() {
          $('#draw')
              .fadeTo('fast', 0)
              .hide();
          displayCards();
        });
    }, longDelay);
  }
}

function resetGame() { // Resets cards and scores.
  console.log('\nresetGame');
  dealerCards = [];
  dealerTotalScore;
  dealerColumns = '';
  playerCards = [];
  playerTotalScore;
  playerColumns = '';
  noOfPlayerCards = 0;

  for (let i = 1; i <= 12; i++) {
    $(`#dealer${i}`)
        .attr('src', 'card-back.png')
        .hide();
    $(`#player${i}`)
        .attr('src', 'card-back.png')
        .hide();
  }

  $('#win, #lose, #draw').off('click');

  $('#dealerGrid, #playerGrid').css('grid-template-columns', '1fr 1fr');
}

function addGridColumn(whichGrid, whichColumns, noOfCards) { // Adds a new grid column for the new card.
  for (let i = 1; i < noOfCards; i++) {
    whichColumns += 'minmax(40px, 1fr) ';
  }
  whichColumns += '224px';
  $(whichGrid).css('grid-template-columns', whichColumns);
  if (noOfCards > 3) {
    $(whichGrid).css('max-width', '630px');
  }
  if (noOfCards > 4) {
    $(whichGrid).css('max-width', '670px');
  }
  if (noOfCards > 5) {
    $(whichGrid).css('max-width', '690px');
  }
}
