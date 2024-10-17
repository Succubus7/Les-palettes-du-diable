const letters = ['A', 'B', 'C'];
const numbers = Array.from({length: 20}, (_, i) => i + 1);
let availableCases = [];
let history = [];
let isGenerating = false;
let currentCase = null;

const team1Board = {};
const team2Board = {};

let team1Participants = [];
let team2Participants = [];
let currentDuel = [];

const allActions = [
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
    // Ajoutez ici 30 actions supplémentaires pour atteindre un total de 50 actions
];

let availableActions = [...allActions];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getUniqueAction() {
    if (availableActions.length === 0) {
        availableActions = [...allActions];
        shuffleArray(availableActions);
    }
    return availableActions.pop();
}

function initializeBoards() {
    const allCases = letters.flatMap(letter => 
        numbers.map(number => `${letter}${number}`)
    );

    shuffleArray(allCases);

    for (let i = 0; i < allCases.length; i++) {
        const currentCase = allCases[i];
        
        if (i < 15) {
            team1Board[currentCase] = "vide";
            team2Board[currentCase] = "vide";
        } else {
            team1Board[currentCase] = getUniqueAction();
            team2Board[currentCase] = getUniqueAction();
        }
    }

    const team2Cases = Object.keys(team2Board);
    shuffleArray(team2Cases);

    team2Cases.forEach((c, i) => {
        if (i < 15) {
            team2Board[c] = "vide";
        } else {
            team2Board[c] = getUniqueAction();
        }
    });
}

function generateDuel() {
    const team1Player = team1Participants[Math.floor(Math.random() * team1Participants.length)];
    const team2Player = team2Participants[Math.floor(Math.random() * team2Participants.length)];
    currentDuel = [team1Player, team2Player];
    
    const team1Name = document.querySelector('#challenge1 h2').textContent;
    const team2Name = document.querySelector('#challenge2 h2').textContent;
    
    const duelAnnouncement = `${team1Player} (${team1Name}) VS ${team2Player} (${team2Name})`;
    document.getElementById('duelAnnouncement').innerText = duelAnnouncement;
    
    document.getElementById('duelOverlay').style.display = 'flex';
}

function closeDuelOverlay() {
    document.getElementById('duelOverlay').style.display = 'none';
    document.querySelector('.grim-reaper-container').style.pointerEvents = 'auto';
    document.getElementById('currentDuel').innerText = `Duel en cours : ${currentDuel[0]} VS ${currentDuel[1]}`;
    document.getElementById('result').innerText = currentCase || '-';
}

function startGeneration() {
    if (isGenerating) return;
    isGenerating = true;
    document.querySelector('#grim-reaper').style.pointerEvents = 'none';
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

function generateCase() {
    if (availableCases.length === 0) {
        document.getElementById('result').innerText = "Toutes les cases ont été utilisées!";
        hideRevealButtons();
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableCases.length);
    currentCase = availableCases.splice(randomIndex, 1)[0];
    
    document.getElementById('result').innerText = currentCase;
    history.unshift(currentCase);
    if (history.length > 5) history.pop();
    
    showRevealButtons();
    resetPotionCheckboxes();
    updateHistory();
    updateRemaining();

    isGenerating = false;
    document.querySelector('#grim-reaper').style.pointerEvents = 'auto';
    document.getElementById('nextDuelButton').classList.remove('hidden');
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

function resetPotionCheckboxes() {
    const checkboxes = document.querySelectorAll('.potion-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = false;
    });
}

function revealChallenge(team) {
    const checkbox = document.getElementById(`potionCheckbox${team}`);
    const challengeText = document.querySelector(`#challenge${team} p`);
    
    if (checkbox.checked) {
        challengeText.innerText = "Boire la fiole";
    } else {
        const teamBoard = team === 1 ? team1Board : team2Board;
        const action = teamBoard[currentCase];
        challengeText.innerText = action === "vide" ? "Case vide" : action;
    }
    
    challengeText.classList.remove('hidden');
    document.querySelector(`#revealButton${team}`).classList.add('hidden');
    checkbox.disabled = true;
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
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        ghost.style.transform = `translate(${newX}px, ${newY}px) rotate(${Math.random() * 20 - 10}deg)`;
        setTimeout(animate, 5000 + Math.random() * 3000);
    }

    animate();
}

function saveGameState() {
    const gameState = {
        team1Board,
        team2Board,
        team1Participants,
        team2Participants,
        availableCases,
        history,
        currentCase,
        currentDuel
    };
    localStorage.setItem('tcsGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('tcsGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        team1Board = gameState.team1Board;
        team2Board = gameState.team2Board;
        team1Participants = gameState.team1Participants;
        team2Participants = gameState.team2Participants;
        availableCases = gameState.availableCases;
        history = gameState.history;
        currentCase = gameState.currentCase;
        currentDuel = gameState.currentDuel;
        return true;
    }
    return false;
}

function clearGameState() {
    localStorage.removeItem('tcsGameState');
}

function saveTeamNames() {
    const team1Name = document.getElementById('team1Name').value || "Équipe 1";
    const team2Name = document.getElementById('team2Name').value || "Équipe 2";
    
    document.querySelector('#challenge1 h2').textContent = team1Name;
    document.querySelector('#challenge2 h2').textContent = team2Name;
    
    team1Participants = Array.from(document.querySelectorAll('#team1Participants input')).map(input => input.value).filter(name => name.trim() !== '');
    team2Participants = Array.from(document.querySelectorAll('#team2Participants input')).map(input => input.value).filter(name => name.trim() !== '');

    if (team1Participants.length !== 6 || team2Participants.length !== 6) {
        alert("Chaque équipe doit avoir exactement 6 participants !");
        return;
    }

    document.getElementById('teamNameOverlay').style.display = 'none';
    
    initializeBoards();
    availableCases = Object.keys(team1Board);
    updateRemaining();
    generateDuel();
    saveGameState();
}

function nextDuel() {
    document.getElementById('nextDuelButton').classList.add('hidden');
    generateDuel();
    saveGameState();
}

function restartGame() {
    if (confirm("Êtes-vous sûr de vouloir recommencer le jeu ? Toute progression sera perdue.")) {
        clearGameState();
        location.reload();
    }
}

function updateUI() {
    document.querySelector('#challenge1 h2').textContent = team1Participants[0] ? `Équipe de ${team1Participants[0]}` : "Équipe 1";
    document.querySelector('#challenge2 h2').textContent = team2Participants[0] ? `Équipe de ${team2Participants[0]}` : "Équipe 2";
    document.getElementById('result').innerText = currentCase || '-';
    document.getElementById('currentDuel').innerText = currentDuel.length ? `Duel en cours : ${currentDuel[0]} VS ${currentDuel[1]}` : '';
    updateHistory();
    updateRemaining();
}

function closeOverlay() {
    document.getElementById('teamNameOverlay').style.display = 'none';
}

window.onload = function() {
    if (loadGameState()) {
        updateUI();
    } else {
        document.getElementById('teamNameOverlay').style.display = 'flex';
    }
    moveGhost();
};

window.addEventListener('resize', moveGhost);
document.getElementById('nextDuelButton').addEventListener('click', nextDuel);
document.getElementById('restartGameButton').addEventListener('click', restartGame);
