const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Login & Score Elements
const loginModal = document.querySelector(".login-modal");
const playerNameInput = document.querySelector("#player-name-input");
const startGameBtn = document.querySelector("#start-game-btn");
const playerNameDisplay = document.querySelector("#player-name-display");
const currentScoreDisplay = document.querySelector("#current-score");
const lastScoreDisplay = document.querySelector("#last-score");
const scoreBoard = document.querySelector(".score-board");

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;
let playerName = "";
let currentScore = 0;

const backgroundImages = [
    "images/bg-1.png",
    "images/bg-2.png",
    "images/bg-3.png"
];

const setRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    document.body.style.backgroundImage = `url('${backgroundImages[randomIndex]}')`;
}

const updateScoreUI = () => {
    playerNameDisplay.innerText = playerName;
    currentScoreDisplay.innerText = currentScore;
    const savedData = JSON.parse(localStorage.getItem("hangman_last_score"));
    if (savedData) {
        lastScoreDisplay.innerText = `${savedData.score} (${savedData.date})`;
    } else {
        lastScoreDisplay.innerText = "-";
    }
}

const saveScore = () => {
    const now = new Date();
    const dateString = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const scoreData = {
        score: currentScore,
        date: dateString
    };
    localStorage.setItem("hangman_last_score", JSON.stringify(scoreData));
    updateScoreUI();
}

const handleLogin = () => {
    const name = playerNameInput.value.trim();
    if (name) {
        playerName = name;
        loginModal.classList.remove("show");
        scoreBoard.style.display = "block";
        updateScoreUI();
        getRandomWord();
    } else {
        alert("Por favor, digite seu nome!");
    }
}

const resetGame = () => {
    // Ressetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Making currentWord as random word
    document.querySelector(".hint-text b").innerText = hint;
    setRandomBackground();
    resetGame();
}

const gameOver = (isVictory) => {
    // After game complete.. showing modal with relevant details
    const modalText = isVictory ? `Você encontrou a palavra:` : 'A palavra correta é:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Tu Ganhou!' : 'Tu Perdeu!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");

    if (isVictory) {
        currentScore++;
    } else {
        saveScore();
        currentScore = 0;
    }
    updateScoreUI();
}

const initGame = (button, clickedLetter) => {
    // Checking if clickedLetter is exist on the currentWord
    if(currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true; // Disabling the clicked button so user can't click again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Calling gameOver function if any of these condition meets
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

// Event Listeners
startGameBtn.addEventListener("click", handleLogin);
playAgainBtn.addEventListener("click", getRandomWord);

// Initial UI Update
updateScoreUI();