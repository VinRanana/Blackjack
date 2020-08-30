// By Davinder Rana

// Console logs for debugging left in.

const cards = [];
let dealerCards = [];
let dealerTotalScore;
let dealerColumns = '';
let playerCards = [];
let playerTotalScore;
let playerColumns = '';
let noOfPlayerCards = 0;
const shortDelay = 200;
const mediumDelay = 450;
const longDelay = 800;
const longerDelay = 2400;


for (let i = 2; i <= 14; i++) { // Populates cards array using cardFactory().
  cards.push(cardFactory('clubs', i));
  cards.push(cardFactory('diamonds', i));
  cards.push(cardFactory('hearts', i));
  cards.push(cardFactory('spades', i));
}

$('#begin').on('click', displayCards);



function displayCards() { // Begins the game.
  console.log('\ndisplayCards');
  $('.notice')
      .off('click', displayCards)
      .fadeTo('fast', 0)
      .hide();

  resetGame();

  window.setTimeout(function() { // Deals cards.
    $('#player1')
        .css('filter','brightness(1.15)')
        .show();
  }, shortDelay);

  window.setTimeout(function() {
    $('#dealer1')
        .css('filter','brightness(1.15)')
        .show();
  }, shortDelay * 2);

  window.setTimeout(function() {
    $('#player2')
        .css('filter','brightness(1.15)')
        .show();
  }, shortDelay * 3);

  window.setTimeout(function() {
    $('#dealer2')
        .css('filter','brightness(1.15)')
        .show();
  }, shortDelay * 4);

  window.setTimeout(dealerFirstTurn, shortDelay * 5);
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

  $('#dealer1')
      .css('filter','')
      .attr('src', `card-pics/${dealerCard1}.jpg`);

  playerTurn();
}


function playerTurn() { // Once dealer has been dealt first card.
  console.log('\nplayerTurn');
  let drawnCardScore;

  window.setTimeout(playerDrawCard, mediumDelay);

  window.setTimeout(function() {
    playerDrawCard();
    $('#playerTurnDiv').fadeTo('fast', 1);
    $('#player').css('border-style', 'solid');
    $('#hit, #stand').fadeTo('fast', 1);
  }, mediumDelay + shortDelay);

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

    if (playerTotalScore >= 21) { // Turns off hit and stand buttons.
      $('#hit').off('click', hit);
      $('#stand').off('click', stand);
    }

    console.log(`Player has ${noOfPlayerCards} cards:`);
    console.log(playerCards);
    console.log(`Total score: ${playerTotalScore}`)
    console.log('\n');

    let playerCard = cards[randomNum].name;

    $(`#player${noOfPlayerCards}`) // Displays drawn card.
        .show()
        .attr('src', `card-pics/${playerCard}.jpg`)
        .css('filter','');

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
    $('#stand').on('click', stand);


  function hit() { // Hit.
    console.log('hit');

    hitStand('#playerHit');

    playerDrawCard();
  }

  function stand() { // Stand.
    console.log('stand');

    hitStand('#playerStand');

    window.setTimeout(dealerTurn, shortDelay);
    $('#stand').off('click', stand);
    $('#hit').off('click', hit);
  }
}


function dealerTurn() { // After player has finished their turn.
  console.log('\ndealerTurn');
  let noOfDealerCards = 1;
  let drawnCardScore = 0;

  $('#playerTurnDiv').fadeTo('fast', 0);
  $('#player').css('border-style', 'hidden');
  $('#hit, #stand').fadeTo('fast', 0.4);
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

    $(`#dealer${noOfDealerCards}`) // Displays drawn card.
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
      window.setTimeout(hitStand('#dealerHit'), shortDelay);

      window.setTimeout(dealerDrawCard, longDelay);

    } else { // Stand.
      if (dealerTotalScore < 21) {
        window.setTimeout(hitStand('#dealerStand'), shortDelay);
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
    winLoseDraw('WIN', '#win', '#winH');
  } else if (playerTotalScore < dealerTotalScore) {
    winLoseDraw('LOSE', '#lose', '#loseH');
  } else {
    winLoseDraw('DRAW', '#draw', '#drawH');
  }

  function winLoseDraw(result, resultId, resultHeading) {
    console.log(result);
    window.setTimeout(function() {
      $(resultId)
          .show()
          .fadeTo('fast', 1)
          .on('click', function() {
            $(resultId)
                .fadeTo('fast', 0)
                .hide();
            displayCards();
          })

      window.setTimeout(function() {
        $(resultHeading)
            .text('- Click here to play again -')
            .css('font-size', '60px');
      }, longerDelay);

    }, longDelay);
  }
}


function resetGame() { // Resets cards, scores, etc.
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

  $('#winH')
      .text('You win!')
      .css('font-size', '100px');

  $('#loseH')
      .text('Dealer wins!')
      .css('font-size', '100px');

  $('#drawH')
      .text('Draw')
      .css('font-size', '100px');
}


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


function addGridColumn(whichGrid, whichColumns, noOfCards) { // Adds a new grid column for each new card.
  for (let i = 1; i < noOfCards; i++) {
    whichColumns += 'minmax(40px, 1fr) ';
  }
  whichColumns += '224px';

  $(whichGrid).css('grid-template-columns', whichColumns);

  if (noOfCards === 4) {
    $(whichGrid).css('max-width', '630px');
  }
  if (noOfCards === 5) {
    $(whichGrid).css('max-width', '670px');
  }
  if (noOfCards > 5) {
    $(whichGrid).css('max-width', '690px');
  }
}


function hitStand(playerChoiceId, delay) { // If Player or Dealer hits or stands.
  $(playerChoiceId)
      .show()
      .fadeTo('fast', 1);
  window.setTimeout(function() {
    $(playerChoiceId)
        .fadeTo('fast', 0)
        .hide();
  }, longDelay);
}
