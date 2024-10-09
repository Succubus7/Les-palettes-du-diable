const letters = ['A', 'B', 'C'];
const numbers = Array.from({length: 20}, (_, i) => i + 1);
let availableCases = [];
let history = [];

const allChallenges = [
    "Fais un défilé de mode exagéré en utilisant un objet de la pièce comme accessoire principal.",
    "Imite ton animal préféré pendant 30 secondes.",
    "Raconte une blague en utilisant uniquement des bruits d'animaux.",
    "Fais semblant d'être un commentateur sportif et commente les actions des autres joueurs pendant 1 minute.",
    "Chante le refrain de ta chanson préférée en mode opéra.",
    "Fais une déclaration d'amour passionnée à un objet dans la pièce.",
    "Mime une scène célèbre d'un film sans parler, les autres doivent deviner.",
    "Invente et démontre un nouveau pas de danse ridicule.",
    "Fais un discours de remerciement comme si tu venais de gagner un Oscar pour le rôle le plus improbable.",
    "Imite trois célébrités différentes en moins d'une minute.",
    // Ajoutez ici les 50 défis supplémentaires
];

const allQuestions = [
    "Quelle est la chose la plus embarrassante que tu aies faite en public ?",
    "Si tu pouvais échanger ta vie avec quelqu'un dans cette pièce pendant une journée, qui choisirais-tu et pourquoi ?",
    "Quel est ton plus grand regret ?",
    "Quelle est la chose la plus folle sur ta bucket list ?",
    "Si tu devais avoir un tatouage, que serait-ce et où le placerais-tu ?",
    "Quel est le mensonge le plus important que tu aies jamais dit ?",
    "Quelle est la chose la plus étrange que tu aies mangée ?",
    "Si tu pouvais effacer un souvenir de ta mémoire, lequel serait-ce ?",
    "Quelle est la chose la plus chère que tu aies volée ou que tu aurais voulu voler ?",
    "Si tu devais être enfermé dans un magasin pour une nuit, lequel choisirais-tu ?",
    // Ajoutez ici les 50 questions supplémentaires
];

let isGenerating = false;

function initializeAvailableCases() {
    availableCases = letters.flatMap(letter => 
        numbers.map(number => `${letter}${number}`)
    );
}

function startGeneration() {
    if (isGenerating) return;
    isGenerating = true;
    document.getElementById('generateButton').disabled = true;
    document.getElementById('invocationSound').play();
    shuffleDisplay();
}

function shuffleDisplay() {
    if (availableCases.length === 0) {
        document.getElementById('result').innerText = "Toutes les cases ont été utilisées!";
        return;
    }

    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
        const randomCase = availableCases[Math.floor(Math.random() * availableCases.length)];
        document.getElementById('result').innerText = randomCase;
        shuffleCount++;

        if (shuffleCount >= 50) {
            clearInterval(shuffleInterval);
            setTimeout(generateCase, 100);
        }
    }, 100);
}

function getRandomChallenge() {
    return allChallenges[Math.floor(Math.random() * allChallenges.length)];
}

function getRandomQuestion() {
    return allQuestions[Math.floor(Math.random() * allQuestions.length)];
}

function generateCase() {
    if (availableCases.length === 0) {
        document.getElementById('result').innerText = "Toutes les cases ont été utilisées!";
        hideRevealButtons();
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableCases.length);
    const newCase = availableCases.splice(randomIndex, 1)[0];
    
    document.getElementById('result').innerText = newCase;
    history.unshift(newCase);
    if (history.length > 5) history.pop();
    
    const challengeOrQuestion1 = Math.random() < 0.5 ? getRandomChallenge() : getRandomQuestion();
    const challengeOrQuestion2 = Math.random() < 0.5 ? getRandomChallenge() : getRandomQuestion();
    
    document.querySelector('#challenge1 p').innerText = challengeOrQuestion1;
    document.querySelector('#challenge2 p').innerText = challengeOrQuestion2;
    
    showRevealButtons();
    updateHistory();
    updateRemaining();

    isGenerating = false;
    document.getElementById('generateButton').disabled = false;
}

function showRevealButtons() {
    document.getElementById('revealButton1').classList.remove('hidden');
    document.getElementById('revealButton2').classList.remove('hidden');
    document.querySelector('#challenge1 p').classList.add('hidden');
    document.querySelector('#challenge2 p').classList.add('hidden');
}

function hideRevealButtons() {
    document.getElementById('revealButton1').classList.add('hidden');
    document.getElementById('revealButton2').classList.add('hidden');
    document.querySelector('#challenge1 p').classList.add('hidden');
    document.querySelector('#challenge2 p').classList.add('hidden');
}

function revealChallenge(team) {
    document.querySelector(`#challenge${team} p`).classList.remove('hidden');
    document.querySelector(`#revealButton${team}`).classList.add('hidden');
}

function updateHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = "<h3
