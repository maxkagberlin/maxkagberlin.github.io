const GAME_EGG_HEIGHT = 40;
const GAME_EGG_WIDTH = 30;
const TOTAL_EGGS = 20;
const DECORATIVE_COUNT = 20;
const DECORATIVE_ICONS = ["🌸", "🍫", "🌳", "🐥"];

// Neue Konstanten
const WRONG_EGG_COLOR = "red";
const BUNNY_EMOJI = "🐰";

let startTime;
let timerInterval;
let correctEgg = null;
let hintVerticalUsed = false;
let hintHorizontalUsed = false;
let hintsUsed = 0;

// Event Listener für Start-Button
document.getElementById('start-game').addEventListener('click', startGame);
// Event Listener für Replay-Button
document.getElementById('restart-game').addEventListener('click', startGame);
// Event Listener für die Hint-Buttons
document.getElementById('hint-vertical').addEventListener('click', useVerticalHint);
document.getElementById('hint-horizontal').addEventListener('click', useHorizontalHint);

function startGame() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';

    // Starte Hintergrundmusik (falls vorhanden)
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.play();
    }

    // Reset Hint-Variablen
    hintVerticalUsed = false;
    hintHorizontalUsed = false;
    hintsUsed = 0;
    updateHintCounter();

    // Verstecke Ergebnis-, Hinweis-Elemente und Replay-Button
    document.getElementById('result').style.display = 'none';
    document.getElementById('message').style.display = 'none';
    document.getElementById('restart-game').style.display = 'none';

    // Starte den Timer
    startTime = new Date();
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    updateTimer();
    timerInterval = setInterval(updateTimer, 50);

    const areaWidth = gameArea.offsetWidth;
    const areaHeight = gameArea.offsetHeight;

    // Füge dekorative Elemente (Blumen, Schokolade, Bäume, Küken) hinzu
    for (let i = 0; i < DECORATIVE_COUNT; i++) {
        const deco = document.createElement('div');
        deco.classList.add('deco');
        deco.style.position = 'absolute';
        deco.style.fontSize = '30px';
        deco.textContent = DECORATIVE_ICONS[Math.floor(Math.random() * DECORATIVE_ICONS.length)];
        deco.style.top = Math.random() * (areaHeight - 30) + 'px';
        deco.style.left = Math.random() * (areaWidth - 30) + 'px';
        gameArea.appendChild(deco);
    }

    // Erzeuge mehrere Eier, von denen nur eins richtig ist
    const correctEggIndex = Math.floor(Math.random() * TOTAL_EGGS);
    for (let i = 0; i < TOTAL_EGGS; i++) {
        const egg = document.createElement('div');
        egg.classList.add('egg');
        egg.style.top = Math.random() * (areaHeight - GAME_EGG_HEIGHT) + 'px';
        egg.style.left = Math.random() * (areaWidth - GAME_EGG_WIDTH) + 'px';
        egg.textContent = '🥚';
        if (i === correctEggIndex) {
            egg.dataset.correct = "true";
            correctEgg = egg;
        } else {
            egg.dataset.correct = "false";
        }
        egg.addEventListener('click', function() {
            if (this.dataset.correct === "true") {
                collectEgg();
            } else {
                // Markiere falsche Eier in Rot
                this.style.color = WRONG_EGG_COLOR;
            }
        });
        gameArea.appendChild(egg);
    }
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    const elapsed = new Date() - startTime; // in Millisekunden
    const seconds = Math.floor(elapsed / 1000);
    const milliseconds = elapsed % 1000;
    const paddedMs = ('00' + milliseconds).slice(-3);
    timerElement.textContent = 'Zeit: ' + seconds + ' Sek ' + paddedMs + ' ms';
}

function collectEgg() {
    clearInterval(timerInterval);
    const endTime = new Date();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(3);

    // Aus dem richtigen Ei schlüpft ein Hase
    if (correctEgg) {
        correctEgg.textContent = BUNNY_EMOJI;
    }

    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Du hast das Ei in ' + timeTaken + ' Sekunden gefunden!';
    resultElement.style.display = 'block';

    // Kopiere die errechnete Zeit in die Zwischenablage (optional)
    if (navigator.clipboard) {
        navigator.clipboard.writeText(timeTaken).catch(err => console.error('Clipboard error:', err));
    }

    // Zeige Hinweis für Screenshot und Teilen
    document.getElementById('message').style.display = 'block';

    // Zeige Replay-Button
    document.getElementById('restart-game').style.display = 'block';
}

function updateHintCounter() {
    document.getElementById('hint-counter').textContent = 'Hinweise: ' + hintsUsed + '/2';
}

function useVerticalHint() {
    if (hintVerticalUsed || !correctEgg) return;
    hintVerticalUsed = true;
    hintsUsed++;
    updateHintCounter();

    const gameArea = document.getElementById('game-area');
    const areaHeight = gameArea.offsetHeight;
    const eggTop = parseInt(correctEgg.style.top);
    let hint = eggTop < areaHeight / 2 ? "Das Ei befindet sich im oberen Bereich!" : "Das Ei befindet sich im unteren Bereich!";
    alert(hint);
}

function useHorizontalHint() {
    if (hintHorizontalUsed || !correctEgg) return;
    hintHorizontalUsed = true;
    hintsUsed++;
    updateHintCounter();

    const gameArea = document.getElementById('game-area');
    const areaWidth = gameArea.offsetWidth;
    const eggLeft = parseInt(correctEgg.style.left);
    let hint = eggLeft < areaWidth / 2 ? "Das Ei befindet sich im linken Bereich!" : "Das Ei befindet sich im rechten Bereich!";
    alert(hint);
}

// Lautstärkeregler für Hintergrundmusik
const volumeSlider = document.getElementById('volume-slider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            bgMusic.volume = this.value;
        }
    });
}
