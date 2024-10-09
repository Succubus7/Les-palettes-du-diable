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
    historyElement.innerHTML = "<h3>Dernières cases :</h3>" + history.join(" - ");
}

function updateRemaining() {
    const remainingElement = document.getElementById('remaining');
    remainingElement.innerHTML = `<h3>Cases restantes : ${availableCases.length}</h3>`;
}

function moveGhost() {
    const ghost = document.getElementById('ghost');
    const maxX = window.innerWidth - ghost.offsetWidth;
    const maxY = window.innerHeight - ghost.offsetHeight;

    function animate() {
        const newX = Math.random() * (maxX - 100);
        const newY = Math.random() * (maxY - 100);
        ghost.style.left = `${newX}px`;
        ghost.style.top = `${newY}px`;
        ghost.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        setTimeout(animate, 5000 + Math.random() * 3000);
    }

    animate();
}

function checkGhostVisibility() {
    const ghost = document.getElementById('ghost');
    const rect = ghost.getBoundingClientRect();
    const isVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

    if (!isVisible) {
        ghost.style.left = `${Math.random() * (window.innerWidth - ghost.offsetWidth)}px`;
        ghost.style.top = `${Math.random() * (window.innerHeight - ghost.offsetHeight)}px`;
    }
}

window.onload = function() {
    initializeAvailableCases();
    updateRemaining();
    moveGhost();
    setInterval(checkGhostVisibility, 1000);
};

window.addEventListener('resize', moveGhost);
