const sentenceDisplay = document.getElementById("sentence");
const hiddenInput = document.getElementById("hidden-input");
// const btn = document.querySelector("button");
const timerDisplay = document.getElementById("timer");

let currentSentence = "";
let startTime = null;
let timerInterval = null;

// Fetch a random sentence from the API
async function getRandomSentence() {
    const res = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
    const data = await res.json();
    return data.text;
}

// Render the sentence with highlighting
function renderSentence(sentence, typedText) {
    let html = "";

    for (let i = 0; i < sentence.length; i++) {
        const typedChar = typedText[i];
        const expectedChar = sentence[i];

        if(i === typedText.length){
            html += `<span id="caret"></span>`;
        }
        if (typedChar === undefined) {
            // Untyped characters (gray)
            html += `<span style="color: gray; opacity: 0.5;">${expectedChar}</span>`;
        } else if (typedChar === expectedChar) {
            // Correct characters (white)
            html += `<span style="color: white;">${expectedChar}</span>`;
        } else {
            // Incorrect characters (red)
            html += `<span style="color: red;">${expectedChar}</span>`;
        }
    }

    return html;
}

// Start the timer when typing begins
function startTimer() {
    const duration = 15 * 1000;
    if (!startTime) {
        startTime = new Date().getTime();
    }


    let remainingTime = duration;
    timerDisplay.innerText = `${Math.floor(remainingTime / 1000)}`;

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const elapsedTime = now - startTime;
        remainingTime = Math.max(0, duration - elapsedTime);
        const seconds = Math.floor(remainingTime / 1000);

        timerDisplay.innerText = `${Math.floor(remainingTime / 1000)}`

        if(remainingTime <= 0){
            clearInterval(timerInterval);
            timerDisplay.innerText = "Time's up!";
            hiddenInput.disabled = true;
        }
    }, 1000)
}

// Load a new sentence and reset the state
async function loadNewState() {
    currentSentence = await getRandomSentence();
    sentenceDisplay.innerHTML = renderSentence(currentSentence, "");
    hiddenInput.value = ""; // Reset input
    startTime = null; // Reset start time
    timerDisplay.textContent = "0"; // Reset timer display
    clearInterval(timerInterval); // Clear any previous timer
    hiddenInput.disabled = false;
    hiddenInput.focus(); // Focus hidden input for typing
}

// Handle typing in the hidden input
hiddenInput.addEventListener("input", () => {
    const typedText = hiddenInput.value;

    // Update the displayed sentence with highlighting
    sentenceDisplay.innerHTML = renderSentence(currentSentence, typedText);

    // Start the timer on the first keystroke
    if(!startTime){
        startTimer();
    }
});

// Start button to load a new sentence
// btn.addEventListener("click", () => {
    // loadNewState();
// });

document.addEventListener("keydown", (e) => {
    if(e.key === "Tab"){
        e.preventDefault();  
        if(timerInterval){
            clearInterval(timerInterval);
        }
        loadNewState();
    }
})

// Initialize on page load
loadNewState();
// startTimer();
