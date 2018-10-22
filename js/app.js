//Creates an array that holds all cards
const cardsList = [
	"fa fa-diamond", "fa fa-diamond", 
	"fa fa-paper-plane-o", "fa fa-paper-plane-o", 
	"fa fa-anchor", "fa fa-anchor",  
	"fa fa-bolt", "fa fa-bolt", 
	"fa fa-cube", "fa fa-cube",
	"fa fa-leaf", "fa fa-leaf", 
	"fa fa-bicycle", "fa fa-bicycle", 
	"fa fa-bomb", "fa fa-bomb"
];

const deck = document.querySelector('.deck');
let openCardSymbols = [];
let moveCounter = 0;
let secs = 0;
let mins = 0;

//Shuffle function from http://stackoverflow.com/a/2450976
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

//Loops through each card and creates its HTML
function createCards() {
	const cards = document.createDocumentFragment();
	for (const card of cardsList) {
		// prebacit u funkciju - performance funkcija vs inline coda
		const newListItem = document.createElement('li');
		newListItem.className = 'card';
		const newImage = document.createElement('i');
		newImage.className = card;
		newListItem.appendChild(newImage);
		cards.appendChild(newListItem);
	}
	deck.appendChild(cards);
}

//Handles moves logic
function handleGameMove(event) {
	if (shouldHandleEvent(event)) {
		displayCard(event);
		addToDisplayedCardsList(event);
		if (shouldCompareCards()) {
			updateGameStats();
			if (doCardsMatch(openCardSymbols[0],openCardSymbols[1])) {
				handleCardsMatch();
				isGameWon(); 
			} else {
				handleCardsDoNotMatch();
			}			
		}
	}
}

//Makes sure only clicks on unopened cards count
function shouldHandleEvent(event) {
	return (event.target.nodeName === 'LI') && !(event.target.classList.contains('open')) && !(event.target.classList.contains('match'));
}

function displayCard(event) {
	event.target.classList.add('open');
}

function addToDisplayedCardsList(event) {
	const openCard = event.target.children[0].className;
	openCardSymbols.push(openCard);
}

//Makes sure comparison happens when two cards are open
function shouldCompareCards() {
	return (openCardSymbols.length === 2);
}

function updateGameStats() {
	incrementMoves();
	stripStars();
}

function incrementMoves() {
	moveCounter++;
	const moves = document.querySelector('.moves');
	moves.textContent = moveCounter;
}

function stripStars() {
	const stars = document.querySelector('.stars');
	if ((moveCounter===11) || (moveCounter===16)) {
		stars.lastElementChild.remove();
	}
}

function doCardsMatch(card1,card2) {
	return (card1 === card2);
}

//
function handleCardsMatch() {
	handleOpenCardSymbols(true);
}

//Handles move depending on the symbols matching; makes code less repetitive by handling 
function handleOpenCardSymbols(cardsMatch) {
	const shownCards = document.querySelectorAll('.open');
	for (const shownCard of shownCards) {
		shownCard.classList.remove('open');
		if(cardsMatch) {
			shownCard.classList.add('match');
		}			
	}
	openCardSymbols = [];
}

function isGameWon() {
	const matchedCards = document.querySelectorAll('.match');
	if (matchedCards.length===cardsList.length) {
		const finalStars = document.querySelector('.final-stars');
		const stars = document.querySelector('.stars').innerHTML;
		finalStars.insertAdjacentHTML('afterbegin', stars);
		const moves = document.querySelector('.final-moves');
		moves.textContent = moveCounter;
		const minutes = document.querySelector('.final-minutes');
		minutes.textContent = mins.toString().padStart(2,"0");
		const seconds = document.querySelector('.final-seconds');
		seconds.textContent = secs.toString().padStart(2,"0");
		const gameWonModal = document.querySelector('.modal');
		gameWonModal.style.display = "block";
	} 
}

function handleCardsDoNotMatch() {
	deck.removeEventListener('click', handleGameMove); //prevents clicking while setTimeout completes
	setTimeout (function() { //keeps unmatched cards open for 1 second
		handleOpenCardSymbols(false);
		deck.addEventListener('click', handleGameMove);
	}, 1000);
}

function timeGame(event) {
	if (event.target.nodeName === 'LI') {
		//Updates minutes and seconds
		const seconds = document.querySelector('.seconds');
		seconds.textContent = secs.toString().padStart(2,"0");
		const minutes = document.querySelector('.minutes');
		minutes.textContent = mins.toString().padStart(2,"0");
		
		//Displays minutes and seconds
		if (secs===59) {
			mins++;
			secs = 0;
		} else {
			secs++;
		}
		
		//If game is not won, function calls itself each second
		const matchedCards = document.querySelectorAll('.match');
		if (matchedCards.length!==cardsList.length) {
			setTimeout (function() {
				timeGame(event);
			}, 1000);
		}
	}
}

function resetGame() {
	const restartElements = document.querySelectorAll('.restart');
	for (const restartElement of restartElements) {
		restartElement.addEventListener('click', function() {
			window.location.reload();
		});
	}
}

//Calls 
shuffle(cardsList);
createCards();
deck.addEventListener('click', handleGameMove);
deck.addEventListener('click', timeGame, {once: true}); 
resetGame();
