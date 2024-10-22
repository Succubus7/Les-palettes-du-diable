const letters = ['A', 'B', 'C'];
const numbers = Array.from({length: 20}, (_, i) => i + 1);
let availableCases = [];
let history = [];
let isGenerating = false;
let currentCase = null;
let remainingPotions = 15; // Variable globale pour les fioles

const team1Board = {};
const team2Board = {};

let team1Participants = [];
let team2Participants = [];
let currentDuel = [];

const halloweenNames = [
    "Dracula", "Frankenstein", "Zombie", "Loup-garou", "Fantôme",
    "Sorcière", "Vampire", "Momie", "Squelette", "Spectre",
    "Banshee", "Gobelin", "Goule", "Citrouille", "Chauve-souris",
    "Araignée", "Corbeau", "Chat noir", "Hibou", "Troll",
    "Clown", "Épouvantail", "Démon", "Lutin maléfique", "Spectre",
    "Sorcier", "Nécromancien", "Faucheuse", "Harpie", "Sirène",
    "Ogre", "Croque-mitaine", "Poltergeist", "Wendigo", "Changelin",
    "Minotaure", "Cyclope", "Méduse", "Kraken", "Chimère"
];

const allActions = [
    "{player} doit faire un compliment sincère à {randomPlayer}.",
    "{player} doit imiter {randomPlayer} pendant 30 secondes.",
    "{player} et {randomPlayer} doivent improviser une scène de film romantique ensemble.",
    "{player} doit porter {randomPlayer} sur son dos et faire un tour de la pièce.",
    "Imite ton animal préféré pendant 30 secondes.",
    "{player} doit faire deviner un mot à {randomPlayer} sans parler, seulement en dessinant dans l'air.",
    "{player} et {randomPlayer} doivent faire un concours de grimaces, les autres votent pour le gagnant.",
    "{player} embrasse {randomPlayer}.",
    "{player} doit faire un massage des épaules de 30 secondes à {randomPlayer}.",
    "{player} doit lire les lignes de la main de {randomPlayer} et prédire son avenir de façon humoristique.",
    "{player} et {randomPlayer} doivent jouer à pierre-papier-ciseaux, le perdant doit faire 10 pompes.",
    "{player} doit chuchoter un secret (réel ou inventé) à l'oreille de {randomPlayer}.",
    "Action spécial créateur du jeu : Toutes les femmes doivent l'embrasser :D.",
    "{player} doit faire un suçon à {randomPlayer} sur l'endroit de son choix.",
    "{player} doit embrasser langoureusement {randomPlayer} pendant 30 secondes.",
    "{player} doit essayer de faire rire {randomPlayer} sans parler ni le toucher.",
    "{player} doit décrire en détail comment il/elle séduirait {randomPlayer} et {randomPlayer2}.",
    "{player} doit mimer sa position sexuelle préférée avec {randomPlayer}.",
    "{player} et {randomPlayer} doivent faire un duel de compliments, 5 chacun a tour de rôle.",
    "{player} et {randomPlayer} doivent s'échanger un verre d'alcool de bouche en bouche.",
    "{player} se fait bander les yeux, chaque participant l'embrasse sur la joue, il/elle doit deviner qui c'est.",
    "{player} doit donner 3 surnoms originaux à {randomPlayer}, qui choisit son préféré.",
    "{player} doit faire un compliment à chaque joueur, mais en commençant par {randomPlayer}.",
    "{player} doit faire une imitation de célébrité choisie par {randomPlayer}.",
    "{player} doit faire deviner un film à {randomPlayer} en n'utilisant que des sons.",
    "{player} doit révéler son plus grand fantasme sexuel.",
    "{player} doit décrire en détail sa première expérience sexuelle.",
    "{player} doit avouer le lieu le plus insolite où il/elle a eu des rapports sexuels.",
    "{player} doit partager sa position sexuelle préférée et expliquer pourquoi.",
    "{player} doit révéler le nombre de partenaires sexuels qu'il/elle a eu.",
    "{player} doit avouer si il a déjà voulu coucher/flirter avec un des participant (hors partenaire actuel!).",
    "{player} doit avouer s'il/elle a déjà eu des rapports avec quelqu'un du même sexe, et si oui, raconter l'expérience.",
    "{player} doit dire quelle partie du corps de {randomPlayer} il/elle trouve la plus attirante.",
    "{player} doit avouer s'il/elle a déjà eu des pensées coquines concernant {randomPlayer}.",
    "{player} doit dire quel type de relation sexuelle il/elle imagine que {randomPlayer} préfère.",
    "{player} doit deviner et décrire les sous-vêtements que porte actuellement {randomPlayer}.",
    "{player} doit dire s'il/elle pense que {randomPlayer} est doué(e) au lit et pourquoi.",
    "{player} doit avouer s'il/elle a déjà espionné ou cherché à voir {randomPlayer} nu(e).",
    "{player} doit dire quel personnage de film érotique {randomPlayer} pourrait incarner.",
    "{player} doit choisir : avoir des rapports avec {randomPlayer} devant tout le monde ici présent, ou avec tout le monde ici présent devant {randomPlayer} ?",
    "{player} doit choisir : ne plus jamais avoir de rapports sexuels ou avoir des rapports uniquement en public ?",
    "{player} doit choisir : échanger de partenaire sexuel avec {randomPlayer} pour une nuit, ou avoir un plan à trois avec {randomPlayer} et {randomPlayer2} ?",
    "{player} doit choisir : embrasser passionnément {randomPlayer} devant tout le monde, ou faire un strip-tease complet pour {randomPlayer2} en privé ?",
    "{player} doit choisir : avoir un rendez-vous romantique très public avec {randomPlayer}, ou une nuit secrète mais torride avec {randomPlayer2} ?",
    "{player} doit choisir : être le/la serviteur(se) sexuel(le) de {randomPlayer} pendant une semaine, ou avoir un plan à trois avec {randomPlayer2} et la personne de son choix dans cette pièce ?",
    "{player} doit choisir : échanger de partenaire avec {randomPlayer} pour un mois, ou ne plus jamais pouvoir avoir de rapports avec quelqu'un d'autre que {randomPlayer2} ?",
    "{player} doit choisir : laisser {randomPlayer} contrôler un sex-toy télécommandé sur toi pendant toute une journée en public, ou laisser {randomPlayer2} choisir tous tes partenaires sexuels pendant un an ?",
    "{player} doit choisir : regarder une vidéo de tes parents en train de faire l'amour, ou laisser {randomPlayer} et {randomPlayer2} regarder une vidéo de toi en train de te masturber ?",
    "{player} doit choisir : avoir des rapports sur un manège dans un parc d'attractions avec {randomPlayer}, ou dans une bibliothèque bondée avec {randomPlayer2} ?",
    "{player} doit choisir : être nu(e) devant tout le groupe pendant le reste de la soirée, ou embrasser chaque partie du corps de {randomPlayer} (au choix de {randomPlayer}) ?"
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
    
    action = action.replace("{player}", currentPlayer);
    
    let allPlayers = [...team1Participants, ...team2Participants];
    let otherPlayers = allPlayers.filter(player => player !== currentPlayer);
    shuffleArray(otherPlayers);
    
    action = action.replace("{randomPlayer}", otherPlayers[0] || "un autre joueur");
    action = action.replace("{randomPlayer2}", otherPlayers[1] || "un autre joueur");
    
    return action;
}

function initializeBoards() {
    // Réinitialiser les compteurs de fioles
    remainingPotionsTeam1 = 15;
    remainingPotionsTeam2 = 15;

    const allCases = letters.flatMap(letter => 
        numbers.map(number => `${letter}${number}`)
    );

    shuffleArray(allCases);
    availableCases = [...allCases];

    for (let i = 0; i < allCases.length; i++) {
        const currentCase = allCases[i];
        
        if (i < 20) {
            // 20 cases vides
            team1Board[currentCase] = "vide";
            team2Board[currentCase] = "vide";
        } else {
            // Le reste en actions
            const team1Player = team1Participants[Math.floor(Math.random() * team1Participants.length)];
            const team2Player = team2Participants[Math.floor(Math.random() * team2Participants.length)];
            team1Board[currentCase] = getUniqueAction(team1Player);
            team2Board[currentCase] = getUniqueAction(team2Player);
        }
    }
}

function countRemainingCases() {
    const counts = {
        team1: {
            empty: 0,
            potion: remainingPotionsTeam1,
            action: 0,
            total: 0
        },
        team2: {
            empty: 0,
            potion: remainingPotionsTeam2,
            action: 0,
            total: 0
        }
    };

    // Compter les cases non révélées
    availableCases.forEach(caseId => {
        // Pour l'équipe 1
        if (team1Board[caseId] === "vide") {
            counts.team1.empty++;
        } else {
            counts.team1.action++;
        }
        
        // Pour l'équipe 2
        if (team2Board[caseId] === "vide") {
            counts.team2.empty++;
        } else {
            counts.team2.action++;
        }
    });

    counts.team1.total = availableCases.length;
    counts.team2.total = availableCases.length;

    return counts;
}

function updateRemainingDisplay() {
    const counts = countRemainingCases();
    
    const remainingElement = document.getElementById('remaining');
    remainingElement.innerHTML = `
        <div class="counters-container">
            <div class="team-counter">
                <h4>${document.querySelector('#challenge1 h2').textContent}</h4>
                <div class="counter-stats">
                    <div class="counter-stat">
                        <div class="stat-label">Cases vides</div>
                        <div class="stat-value">${counts.team1.empty}</div>
                    </div>
                    <div class="counter-stat">
                        <div class="stat-label">Fioles</div>
                        <div class="stat-value">${counts.team1.potion}</div>
                    </div>
                    <div class="counter-stat">
                        <div class="stat-label">Actions</div>
                        <div class="stat-value">${counts.team1.action}</div>
                    </div>
                    <div class="counter-stat total-cases">
                        <div class="stat-label">Total restant</div>
                        <div class="stat-value">${counts.team1.total}</div>
                    </div>
                </div>
            </div>
            <div class="team-counter">
                <h4>${document.querySelector('#challenge2 h2').textContent}</h4>
                <div class="counter-stats">
                    <div class="counter-stat">
                        <div class="stat-label">Cases vides</div>
                        <div class="stat-value">${counts.team2.empty}</div>
                    </div>
                    <div class="counter-stat">
                        <div class="stat-label">Fioles</div>
                        <div class="stat-value">${counts.team2.potion}</div>
                    </div>
                    <div class="counter-stat">
                        <div class="stat-label">Actions</div>
                        <div class="stat-value">${counts.team2.action}</div>
                    </div>
                    <div class="counter-stat total-cases">
                        <div class="stat-label">Total restant</div>
                        <div class="stat-value">${counts.team2.total}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
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
        const randomIndex = Math.floor(Math.random() * availableCases.length);
        const randomCase = availableCases[randomIndex];
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
    currentCase = availableCases[randomIndex]; // On ne retire plus la case ici
    
    document.getElementById('result').innerText = currentCase;
    history.unshift(currentCase);
    if (history.length > 5) history.pop();
    
    showRevealButtons();
    resetPotionCheckboxes();
    updateHistory();

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

let remainingPotionsTeam1 = 15;
let remainingPotionsTeam2 = 15;

function revealChallenge(team) {
    const checkbox = document.getElementById(`potionCheckbox${team}`);
    const challengeText = document.querySelector(`#challenge${team} p`);
    const teamBoard = team === 1 ? team1Board : team2Board;
    const remainingPotions = team === 1 ? remainingPotionsTeam1 : remainingPotionsTeam2;
    
    // On retire la case des disponibles
    const index = availableCases.indexOf(currentCase);
    if (index > -1) {
        availableCases.splice(index, 1);
    }
    
    if (checkbox.checked) {
        // Vérifie si il reste des fioles à placer
        if (remainingPotions > 0) {
            challengeText.innerText = "Boire la fiole";
            // Décrémenter le compteur de fioles pour l'équipe correspondante
            if (team === 1) {
                remainingPotionsTeam1--;
            } else {
                remainingPotionsTeam2--;
            }
        } else {
            alert("Plus de fioles disponibles pour cette équipe !");
            checkbox.checked = false;
            const content = teamBoard[currentCase];
            challengeText.innerText = content === "vide" ? "Case vide" : content;
        }
    } else {
        // Révéler si c'est une case vide ou une action
        const content = teamBoard[currentCase];
        challengeText.innerText = content === "vide" ? "Case vide" : content;
    }
    
    challengeText.classList.remove('hidden');
    document.querySelector(`#revealButton${team}`).classList.add('hidden');
    checkbox.disabled = true;
    
    updateRemainingDisplay();
}

function updateHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = "<h3>Dernières cases :</h3>" + history.join(" - ");
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
        currentDuel,
        remainingPotions
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
        remainingPotions = gameState.remainingPotions;
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
    updateRemainingDisplay();
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
    updateRemainingDisplay();
}

function closeOverlay() {
    // Ne fermez pas l'overlay automatiquement
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

// Event listeners et initialisation
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
