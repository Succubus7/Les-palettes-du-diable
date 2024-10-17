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

const halloweenNames = [
    "Dracula", "Frankenstein", "Zombie", "Werewolf", "Ghost", "Witch", "Vampire", "Mummy", "Skeleton", "Phantom",
    "Banshee", "Goblin", "Ghoul", "Pumpkin", "Bat", "Spider", "Raven", "Black Cat", "Owl", "Troll",
    "Clown", "Scarecrow", "Demon", "Imp", "Wraith", "Warlock", "Necromancer", "Reaper", "Harpy", "Siren",
    "Ogre", "Boogeyman", "Poltergeist", "Wendigo", "Changeling", "Minotaur", "Cyclops", "Medusa", "Kraken", "Chimera"
];

const allActions = [
    "{player} doit faire un compliment sincère à {randomPlayer}.",
    "{player} doit imiter {randomPlayer} pendant 30 secondes, et les autres doivent deviner qui est imité.",
    "{player} et {randomPlayer} doivent improviser une scène de film romantique ensemble.",
    "{player} doit porter {randomPlayer} sur son dos et faire un tour de la pièce.",
    "{player} doit raconter une histoire effrayante en incluant tous les autres joueurs comme personnages.",
    "{player} doit faire deviner un mot à {randomPlayer} sans parler, seulement en dessinant dans l'air.",
    "{player} et {randomPlayer} doivent faire un concours de grimaces, les autres votent pour le gagnant.",
    "{player} doit créer un chapeau original pour {randomPlayer} en utilisant uniquement des objets dans la pièce.",
    "{player} doit inventer et enseigner une danse ridicule à {randomPlayer}.",
    "{player} doit faire un massage des épaules de 30 secondes à {randomPlayer}.",
    "{player} doit lire les lignes de la main de {randomPlayer} et prédire son avenir de façon humoristique.",
    "{player} et {randomPlayer} doivent jouer à pierre-papier-ciseaux, le perdant doit faire 10 pompes.",
    "{player} doit chuchoter un secret (réel ou inventé) à l'oreille de {randomPlayer}.",
    "{player} doit faire un portrait rapide de {randomPlayer} et l'afficher pour tous.",
    "{player} doit inventer un jingle publicitaire pour un produit choisi par {randomPlayer}.",
    "{player} et {randomPlayer} doivent faire un concours de regard fixe, le premier qui rit perd.",
    "{player} doit faire un discours de 1 minute sur pourquoi {randomPlayer} devrait être président.",
    "{player} doit créer un cocktail non alcoolisé avec des ingrédients choisis par {randomPlayer}.",
    "{player} doit essayer de faire rire {randomPlayer} sans parler ni le toucher.",
    "{player} doit mimer une scène de film célèbre avec {randomPlayer}, les autres devinent.",
    "{player} doit inventer une histoire courte où {randomPlayer} est le héros.",
    "{player} et {randomPlayer} doivent faire un duel de compliments pendant 1 minute.",
    "{player} doit faire un tour de magie improvisé avec l'aide de {randomPlayer}.",
    "{player} doit créer une coiffure originale pour {randomPlayer} en 2 minutes.",
    "{player} doit inventer un nouveau sport et en expliquer les règles à {randomPlayer}.",
    "{player} et {randomPlayer} doivent échanger leurs chaussures pour les 3 prochains tours.",
    "{player} doit mimer un animal choisi par {randomPlayer}, les autres devinent.",
    "{player} doit inventer une chanson de rap sur {randomPlayer} et la performer.",
    "{player} doit faire un discours de mariage improvisé pour {randomPlayer}.",
    "{player} et {randomPlayer} doivent créer une chorégraphie de 30 secondes ensemble.",
    "{player} doit donner 3 surnoms originaux à {randomPlayer}, qui choisit son préféré.",
    "{player} doit faire un compliment à chaque joueur, mais en commençant par {randomPlayer}.",
    "{player} doit mimer une journée typique dans la vie de {randomPlayer}.",
    "{player} et {randomPlayer} doivent jouer à 'Je n'ai jamais' pendant 2 minutes.",
    "{player} doit inventer une histoire courte en utilisant 5 mots choisis par {randomPlayer}.",
    "{player} doit faire une imitation de célébrité choisie par {randomPlayer}.",
    "{player} doit inventer un nouveau plat culinaire et le 'préparer' avec {randomPlayer} comme assistant.",
    "{player} et {randomPlayer} doivent faire un concours de qui peut tenir le plus longtemps sur un pied.",
    "{player} doit décrire {randomPlayer} comme s'il était un personnage de roman fantastique.",
    "{player} doit inventer une nouvelle danse de fête avec {randomPlayer} comme partenaire.",
    "{player} doit faire un portrait chinois de {randomPlayer} (Si tu étais un animal, une couleur, etc.).",
    "{player} et {randomPlayer} doivent jouer à Twister imaginaire pendant 1 minute.",
    "{player} doit inventer une publicité pour vendre un objet choisi par {randomPlayer}.",
    "{player} doit raconter une blague à {randomPlayer}, qui doit la répéter de mémoire.",
    "{player} et {randomPlayer} doivent faire un concours du meilleur accent étranger.",
    "{player} doit faire deviner un film à {randomPlayer} en n'utilisant que des sons.",
    "{player} doit créer un personnage de super-héros basé sur {randomPlayer}.",
    "{player} doit mimer une scène de film d'horreur avec {randomPlayer} comme victime.",
    "{player} et {randomPlayer} doivent inventer et performer un nouveau rituel de salutation.",
    "{player} doit faire un discours d'investiture présidentielle en incluant 3 mots choisis par {randomPlayer}."
];

let availableActions = [...allActions];


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getUniqueAction(currentPlayer) {
    if (availableActions.length === 0) {
        availableActions = [...allActions];
        shuffleArray(availableActions);
    }
    let action = availableActions.pop();
    
    // Remplacer {player} par le nom du joueur actuel
    action = action.replace("{player}", currentPlayer);
    
    // Choisir un joueur aléatoire différent du joueur actuel
    let allPlayers = [...team1Participants, ...team2Participants];
    let otherPlayers = allPlayers.filter(player => player !== currentPlayer);
    let randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    
    // Remplacer {randomPlayer} par le nom du joueur aléatoire
    action = action.replace("{randomPlayer}", randomPlayer);
    
    return action;
}

function initializeBoards() {
    const allCases = letters.flatMap(letter => 
        numbers.map(number => `${letter}${number}`)
    );

    shuffleArray(allCases);
    availableCases = [...allCases];

    for (let i = 0; i < allCases.length; i++) {
        const currentCase = allCases[i];
        
        if (i < 15) {
            team1Board[currentCase] = "vide";
            team2Board[currentCase] = "vide";
        } else {
            const team1Player = team1Participants[Math.floor(Math.random() * team1Participants.length)];
            const team2Player = team2Participants[Math.floor(Math.random() * team2Participants.length)];
            team1Board[currentCase] = getUniqueAction(team1Player);
            team2Board[currentCase] = getUniqueAction(team2Player);
        }
    }

    const team2Cases = Object.keys(team2Board);
    shuffleArray(team2Cases);

    team2Cases.forEach((c, i) => {
        if (i < 15) {
            team2Board[c] = "vide";
        } else {
            const team2Player = team2Participants[Math.floor(Math.random() * team2Participants.length)];
            team2Board[c] = getUniqueAction(team2Player);
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
    document.querySelector('#grim-reaper').style.pointerEvents = 'auto';
    document.getElementById('currentDuel').innerText = `Duel en cours : ${currentDuel[0]} VS ${currentDuel[1]}`;
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
        Object.assign(team1Board, gameState.team1Board);
        Object.assign(team2Board, gameState.team2Board);
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

    initializeBoards();
    updateRemaining();
    generateDuel();
    saveGameState();
    
    document.getElementById('teamNameOverlay').style.display = 'none';
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
    if (currentDuel.length) {
        document.getElementById('currentDuel').innerText = `Duel en cours : ${currentDuel[0]} VS ${currentDuel[1]}`;
    }
    updateHistory();
    updateRemaining();
}

function closeOverlay() {
    // Ne fermez pas l'overlay automatiquement, laissez l'utilisateur remplir les informations
    // document.getElementById('teamNameOverlay').style.display = 'none';
}

function fillRandomHalloweenNames() {
    const inputs = document.querySelectorAll('#team1Participants input, #team2Participants input');
    shuffleArray(halloweenNames);
    inputs.forEach((input, index) => {
        if (index < halloweenNames.length) {
            input.value = halloweenNames[index];
            input.dataset.original = halloweenNames[index];
            input.addEventListener('focus', function() {
                if (this.value === this.dataset.original) {
                    this.value = '';
                }
            });
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.value = this.dataset.original;
                }
            });
        }
    });
}
window.onload = function() {
    if (loadGameState()) {
        updateUI();
        document.getElementById('teamNameOverlay').style.display = 'none';
    } else {
        fillRandomHalloweenNames();
        document.getElementById('teamNameOverlay').style.display = 'flex';
    }
    moveGhost();
};
window.addEventListener('resize', moveGhost);
document.getElementById('nextDuelButton').addEventListener('click', nextDuel);
document.getElementById('restartGameButton').addEventListener('click', restartGame);
