const enterButtonEventListener = () => { playRound(); };
const enterKeyEventListener = () => {if (event.key == 'Enter') { 
    playRound(); 
    event.preventDefault();
}};

const hitEventListener = () => { onHit(); };
const standEventListener = () => { onStand(); };
const leaveTableEventListener = () => { onLeaveTable(); };


const playNewHandEventListener = () => { resetElements(); };

document.querySelector('.js-enter-button')
    .addEventListener('click', enterButtonEventListener);

document.querySelector('.js-bet-input')
    .addEventListener('keydown', enterKeyEventListener);

document.querySelector('.js-leave-table-button')
    .addEventListener('click', leaveTableEventListener);

document.querySelector('.js-play-new-hand-button')
    .addEventListener('click', playNewHandEventListener);

let cardDeck = new Map();





let player = {
    cards: new Map (),
    coins: 5000,
    bet: 0,
    points: '',
    name: 'player'
}

let dealer = {
    cards: new Map (),
    coins: '',
    points: '',
    name: 'dealer'
}


resetElements();
function playRound() {
    clearBetElements();
    dealHand();
    tally(player);
    tally(dealer);
    console.log("player score is: " + player.points);
    console.log("dealer score is: " + dealer.points);
    displayDealerHand();
    displayHand(player);
    if (!checkForBlackjack(player) && !checkForBlackjack(dealer)) {
        askNextMove();
    }
}



function clearBetElements() {

    player.bet = Number(document.querySelector('.js-bet-input').value);
    document.querySelector('.js-bet-input').value = "";





    document.querySelector(".js-end-result")
        .innerHTML = "";

    document.querySelector(".js-player-hand")
        .innerHTML = "";

    document.querySelector(".js-dealer-hand")
        .innerHTML = "";

    document.querySelector(".js-bet-question")
        .innerHTML = "";




    document.querySelector('.js-bet-input').classList.add('invisible');
    document.querySelector('.js-enter-button').classList.add('invisible');
    document.querySelector('.js-leave-table-button').classList.add('invisible');
}



function dealHand() {
    randomDraw(player);
    randomDraw(player);
    randomDraw(dealer);
    randomDraw(dealer);

}

function randomDraw(person) {
    if (cardDeck.size == 0) {
        cardDeck = new Map([["ace-spades", 11], ["king-spades", 10], ["queen-spades", 10], ["jack-spades", 10], ["10-spades", 10], ["9-spades", 9], ["8-spades", 8], ["7-spades", 7], ["6-spades", 6], ["5-spades", 5], ["4-spades", 4], ["3-spades", 3], ["2-spades", 2], ["ace-clubs", 11], ["king-clubs", 10], ["queen-clubs", 10], ["jack-clubs", 10], ["10-clubs", 10], ["9-clubs", 9], ["8-clubs", 8], ["7-clubs", 7], ["6-clubs", 6], ["5-clubs", 5], ["4-clubs", 4], ["3-clubs", 3], ["2-clubs", 2], ["ace-hearts", 11], ["king-hearts", 10], ["queen-hearts", 10], ["jack-hearts", 10], ["10-hearts", 10], ["9-hearts", 9], ["8-hearts", 8], ["7-hearts", 7], ["6-hearts", 6], ["5-hearts", 5], ["4-hearts", 4], ["3-hearts", 3], ["2-hearts", 2], ["ace-diamonds", 11], ["king-diamonds", 10], ["queen-diamonds", 10], ["jack-diamonds", 10], ["10-diamonds", 10], ["9-diamonds", 9], ["8-diamonds", 8], ["7-diamonds", 7], ["6-diamonds", 6], ["5-diamonds", 5], ["4-diamonds", 4], ["3-diamonds", 3], ["2-diamonds", 2]]);
    }

    const cardDeckArray = Array.from(cardDeck);
    const index = Math.floor(Math.random() * cardDeckArray.length);
    const [drawnCard, value] = cardDeckArray[index];
    cardDeck.delete(drawnCard);

    person.cards.set(drawnCard, value);
}


function displayDealerHand() {
    let dealerHandElement = document.getElementById('dealer-hand');
    dealerHandElement.innerHTML = "";

    if (dealer.points == 21) {
        for (const [card, value] of dealer.cards) {
            displayHand(dealer);
        }
    } else {
        //gets the first key in map
        let img = document.createElement('img');
        img.src = `/images/cards/${dealer.cards.keys().next().value}.png`
        console.log(img.src);
        dealerHandElement.appendChild(img);
    }
}


function displayHand(person) {
    console.log(person);
    let handElement = document.getElementById(`${person.name}-hand`);
    handElement.innerHTML = "";

    for (const card of person.cards.keys()) {
        let img = document.createElement('img');
        img.src = `/images/cards/${card}.png`
        console.log(img.src);
        handElement.appendChild(img);
    }

    // document.querySelector('.js-player-score')
    //     .innerHTML = player.points;
}


function tally(person) {
    let points = 0;
    for (const [card, value] of person.cards) {
        points += value;
    }

    points = optimizeAces(points, person);

    person.points = points;

    document.querySelector('.js-player-score')
        .innerHTML = player.points;
}

function optimizeAces(points, person) {
    if (points > 21) {
        for (const [card, value] of person.cards) {
            if (card.includes('ace') && points > 21) {
                points -= 10; // ace becomes a 1
            }
        }
    }

    return points;
}

function checkForBlackjack(person) {
    if (person.points == 21) {
        endRound(person.name + "BJ");
        return true;
    }
    return false;
}

function checkForBust(person) {
    if (person.points > 21) {
        endRound(`${person.name}Bust`);
        return true;
    }
    return false;
}

function askNextMove () {
    document.querySelector(".js-hit-or-stand")
        .innerHTML = "Would you like to hit or stand?";
    
    document.querySelector('.js-hit-button')
        .addEventListener('click', hitEventListener);

    document.querySelector('.js-stand-button')
        .addEventListener('click', standEventListener);
}

function onHit() {
    randomDraw(player);
    displayHand(player);
    tally(player);
    console.log("player score is: " + player.points);
    checkForBlackjack(player);
    checkForBust(player);
}

function onStand() {
    dealerLogic();
    if (!checkForBlackjack(dealer) && !checkForBust(dealer)) {
        calculateFinal();
    }
}

function dealerLogic() {
    displayHand(dealer) // edit, reveal second card
    while (dealer.points < 16 || (dealer.points === 17 && dealer.cards.has('Ace of Spades') && dealer.points <= 17)) { // dealer hits on 16 and soft 17
        randomDraw(dealer);
        displayHand(dealer);
        tally(dealer);
    }
}

function calculateFinal() {
    if (player.points > dealer.points) {
        endRound('win');
    } else if (player.points < dealer.points) {
        endRound('loss');
    } else {
        endRound('tie');
    }
}

function endRound (endReason) {
    document.querySelector('.js-hit-button')
        .removeEventListener('click', hitEventListener);

    document.querySelector('.js-stand-button')
        .removeEventListener('click', standEventListener);

    document.querySelector('.js-hit-or-stand')
        .innerHTML = "";



    console.log(player.coins);
    console.log(typeof player.coins);
    console.log(typeof player.bet);




    let endMessage = "";

    switch (endReason) {
        case 'win':
            endMessage = "You win!!";
            player.coins += player.bet;
            break;
        case 'loss':
            endMessage = "You lose :(";
            player.coins -= player.bet;
            break;
        case 'tie':
            endMessage = "You Tie.  Keep your bet!!";
            break;
        case 'playerBJ':
            endMessage = "BLACKJACK!!! You win!!";
            player.coins += player.bet;
            break;
        case 'playerBust':
            endMessage = "BUST!!! You lose :(";
            player.coins -= player.bet;
            break;
        case 'dealerBJ':
            endMessage = "DEALER BLACKJACK!!! You lose :(";
            player.coins -= player.bet;
            break;
        case 'dealerBust':
            endMessage = "DEALER BUST!!! You win!!";
            player.coins += player.bet;
            break;
        default:
            endMessage = "error !!!!!!";
            break;
    }


    document.querySelector('.js-net-worth')
        .innerHTML = "You have " + player.coins + " coins.";


    document.querySelector(".js-end-result")
        .innerHTML = endMessage;

    if (player.coins <= 0) { // if you run out of coins, end game
        setTimeout (function () { clearAllElements() }, 3000);
    }
    askNewHand(); 
}

function askNewHand() {
    document.querySelector(".js-play-new-hand-button").classList.remove('invisible');
    document.querySelector(".js-leave-table-button").classList.remove('invisible');
}

function resetElements() {
    document.querySelector(".js-end-result").innerHTML="";
    document.querySelector(".js-play-new-hand-button").classList.add('invisible');
    document.querySelector(".js-leave-table-button").classList.add('invisible');



    document.querySelector(".js-bet-input").classList.remove('invisible');
    document.querySelector(".js-enter-button").classList.remove('invisible');
    

    

    player.cards.clear();
    dealer.cards.clear();




    document.querySelector(".js-bet-question")
    .innerHTML = "How much would you like to bet this hand?";
}

function onLeaveTable() {
    clearAllElements();
}

function clearAllElements() {
    clearBetElements();

    document.querySelector(".js-net-worth")
        .innerHTML = "";

    document.querySelector(".js-end-result")
        .innerHTML = "";

    document.querySelector(".js-dealer-hand-label")
        .innerHTML = "";

    document.querySelector(".js-player-hand-label")
        .innerHTML = "";

    document.querySelector(".js-player-score")
        .innerHTML = "";

    document.querySelector(".js-hit-button").classList.add('invisible');
    document.querySelector(".js-stand-button").classList.add('invisible');


    document.querySelector(".js-play-new-hand-button").classList.add('invisible');


    document.querySelector(".js-bet-question")
        .innerHTML = `The table will miss you! You started with 5000 coins, and you leave with ${player.coins} coins.  You made $${(player.coins - 5000)}!`;
}
