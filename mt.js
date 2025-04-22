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
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            timerDisplay.textContent = elapsedSeconds;
        }, 1000);
    }
}

// Load a new sentence and reset the state
async function loadNewState() {
    currentSentence = await getRandomSentence();
    sentenceDisplay.innerHTML = renderSentence(currentSentence, "");
    hiddenInput.value = ""; // Reset input
    startTime = null; // Reset start time
    timerDisplay.textContent = "0"; // Reset timer display
    clearInterval(timerInterval); // Clear any previous timer
    hiddenInput.focus(); // Focus hidden input for typing
}

// Handle typing in the hidden input
hiddenInput.addEventListener("input", () => {
    const typedText = hiddenInput.value;

    // Update the displayed sentence with highlighting
    sentenceDisplay.innerHTML = renderSentence(currentSentence, typedText);

    // Start the timer on the first keystroke
    startTimer();
});

// Start button to load a new sentence
// btn.addEventListener("click", () => {
    // loadNewState();
// });

document.addEventListener("keydown", (e) => {
    if(e.key === "Tab"){
        e.preventDefault();
        loadNewState();
    }
})

// Initialize on page load
loadNewState();
