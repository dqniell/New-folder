// Define constants for selectors
const boardContainer = document.querySelector('.board-container');
const board = document.querySelector('.board');
const moves = document.querySelector('.numMoves');
const winMessage = document.querySelector('.win');

// Game state variables
const gameState = {
    started: true, // Start the game automatically
    cardsFlipped: 0,
    score: 0,
};

// Shuffle an array randomly
function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Pick a specific number of random items from an array
function pickRandomItems(array, numItems) {
    const clonedArray = [...array];
    const randomPicks = [];
    for (let i = 0; i < numItems; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }
    return randomPicks;
}

// Generate the game board with cute emojis
function generateGameBoard() {
    const cuteEmojis = ['🐶', '🐱', '🐻', '🐼', '🐰', '🐨', '🦁', '🦄', '🐷', '🐸'];
    const picks = pickRandomItems(cuteEmojis, (4 * 4) / 2);
    const items = shuffleArray([...picks, ...picks]);

    let cardsHTML = '<div class="board" style="grid-template-columns: repeat(' + 4 + ', auto)">';

    items.forEach(function (item) {
        cardsHTML += '<div class="card">' +
            '<div class="card-front"></div>' +
            '<div class="card-back">' + item + '</div>' +
            '</div>';
    });

    cardsHTML += '</div';

    board.innerHTML = cardsHTML;
}

// Start the game and track time and moves
function startGame() {
    gameState.started = true;
    startButton.classList.add('disabled');

    gameState.interval = setInterval(function () {
        moves.innerText = gameState.score + ' moves';
    }, 1000);
}

// Flip back unmatched cards
function flipBackUnmatchedCards() {
    document.querySelectorAll('.card:not(.matched)').forEach(function (card) {
        card.classList.remove('flipped');
    });

    gameState.cardsFlipped = 0;
}

// Flip a card
function flipCard(card) {
    gameState.cardsFlipped++;
    gameState.score++; // Increment the score

    if (!gameState.started) {
        startGame();
    }

    if (gameState.cardsFlipped <= 2) {
        card.classList.add('flipped');
    }

    if (gameState.cardsFlipped === 2) {
        const cardsFlipped = document.querySelectorAll('.flipped:not(.matched)');

        if (cardsFlipped[0].querySelector('.card-back').innerText === cardsFlipped[1].querySelector('.card-back').innerText) {
            cardsFlipped[0].classList.add('matched');
            cardsFlipped[1].classList.add('matched');
        }

        setTimeout(function () {
            flipBackUnmatchedCards();
        }, 1000);
    }

    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(function () {
            boardContainer.classList.add('flipped');
            winMessage.innerHTML = '<span class="win-text">' +
                'You won!<br />' +
                'with <span class="highlight">' + gameState.score + '</span> moves<br />' +
                'under <span class="highlight">' + gameState.totalTime + '</span> seconds' +
                '</span>';

            clearInterval(gameState.interval);
        }, 1000);
    }
}

// Attach event listeners to the game elements
function attachEventListeners() {
    document.addEventListener('click', function (event) {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        }
    });
}

// Initialize the game
generateGameBoard();
attachEventListeners();