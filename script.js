const catBtns = document.querySelector('.category-btns')
const gameZone = document.querySelector('.game-zone')
const gameWord = document.querySelector('.game-word')
const letters = document.querySelector('.letters')
const incorrectGuessesCounter = document.querySelector('.counter')
const gallow = document.querySelector('.gallow')
const popup = document.querySelector('.popup')
const gameModal = document.querySelector('.game-modal')
const popupContainer = document.querySelector('.popup-container')
let currentCat;
let currentWord;
let incorrectGuesses = 0
let correctGuesses = 0

function selectCategory(event) {
    if (event.target.tagName !== 'BUTTON') return
    if (currentCat) return
    currentCat = event.target.getAttribute('id')
    createGameWord()
    event.target.classList.add('select-category')
    catBtns.classList.add('hidden-down')
}


function createGameWord() {
    fetch('word-list.json')
        .then(response => response.json())
        .then(wordList => {
            currentWord = wordList[currentCat][Math.floor(Math.random() * (10 - 0 + 1)) + 0]
            let result = ''
            for (let i = 0; i < currentWord.length; i++) {
                result += '<li class="word-letter">_</li>'
            }
            gameWord.innerHTML = result
        })
}

function changeGameState() {
    gallow.setAttribute('src', `images/hangman-${incorrectGuesses}.svg`)
    incorrectGuessesCounter.textContent = `${incorrectGuesses} / 6`
    if (incorrectGuesses >= 2 && incorrectGuesses < 4) {
        incorrectGuessesCounter.style.color = '#f1d023';
    }
    else if (incorrectGuesses >= 4) {
        incorrectGuessesCounter.style.color = '#f12323';
    }
}

function gameOver(isVictory) {
    if (!isVictory) {
        popup.innerHTML = `
        <h1 class="popup-title">You win!</h1>
        <h1 class="emoji">🎉</h1>
        <span class = "info">You found the word:<span class="founded-word">${currentWord}</span></span>
        <button class="retry">PLAY AGAIN</button>`
    } else {
        popup.innerHTML = `
       <h1 class="popup-title">You lose!</h1>
       <h1 class="emoji">😰</h1>
       <span class = "info">The hidden word:<span class="founded-word">${currentWord}</span></span>
       <button class="retry">PLAY AGAIN</button>`
    }
    gameModal.classList.add('show')
    popupContainer.classList.remove('hiddenPopup-down')
    popupContainer.classList.add('hiddenPopup-top')
    const playAgainBtn = document.querySelector('.retry')
    playAgainBtn.addEventListener('click', playAgain)
}


function playAgain() {
    correctGuesses = 0
    incorrectGuesses = 0
    currentWord = 0
    gameWord.innerHTML = ''
    gallow.setAttribute('src', 'images/hangman-0.svg')
    incorrectGuessesCounter.innerHTML = '0 / 6'
    incorrectGuessesCounter.style.color = '#12d146'
    popupContainer.classList.remove('hiddenPopup-top')
    popupContainer.classList.add('hiddenPopup-down')

    const popupDownAnim = function () {
        gameModal.classList.remove('show')
        document.querySelector('.popup-container').removeEventListener('animationend', popupDownAnim)
    }

    popupContainer.addEventListener('animationend', popupDownAnim)
    let letters = document.querySelectorAll('.letter')
    for (let letter of letters) {
        letter.classList.remove('used')
    }

    return createGameWord()
}


catBtns.addEventListener('click', selectCategory)


// Waiting for the animation to pass
catBtns.addEventListener('animationend', () => {
    catBtns.style.display = 'none'
    gameZone.classList.remove('hidden-down')
    gameZone.style.display = 'flex'
    gameZone.classList.add('hidden-top')

})

// Main logic
letters.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    if (event.target.classList.contains('used')) return
    let letter = event.target
    let wordLetters = gameWord.querySelectorAll('.word-letter')
    let temp = correctGuesses
    for (let i = 0; i < currentWord.length; i++) {
        if (letter.textContent === currentWord[i].toUpperCase()) {
            wordLetters[i].textContent = letter.textContent
            correctGuesses += 1
        }
    }
    letter.classList.add('used')
    if (correctGuesses === currentWord.length) return gameOver(false)
    if (correctGuesses === temp) {
        incorrectGuesses += 1
        changeGameState()
    }

    if (incorrectGuesses === 6) return gameOver(true)
})

