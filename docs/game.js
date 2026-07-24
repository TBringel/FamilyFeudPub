let questions = [];
let currentIndex = 0;
let roundTotal = 0;
let scores = { 1: 0, 2: 0 };

const board = document.getElementById('board');
const questionText = document.getElementById('questionText');
const questionCounter = document.getElementById('questionCounter');
const roundTotalEl = document.getElementById('roundTotal');

fetch('questions.json')
  .then(r => r.json())
  .then(data => {
    questions = data;
    if (questions.length === 0) {
      questionText.textContent = "Aucune question. Va dans 'Modifier les questions' pour en ajouter.";
      return;
    }
    afficherQuestion();
  })
  .catch(() => {
    questionText.textContent = "Impossible de charger questions.json (vérifie que le fichier est bien présent à côté de jouer.html).";
  });

function afficherQuestion() {
  const q = questions[currentIndex];
  questionText.textContent = q.question;
  questionCounter.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
  roundTotal = 0;
  roundTotalEl.textContent = '0';

  document.querySelectorAll('.strike').forEach(s => s.classList.remove('active'));

  // Trie les réponses par points décroissants, comme sur le vrai plateau
  const answersSorted = [...q.answers].sort((a, b) => b.points - a.points);

  board.innerHTML = '';
  answersSorted.forEach((ans, i) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.points = ans.points;
    tile.innerHTML = `
      <div class="tile-inner">
        <div class="tile-face tile-front">
          <span><span class="tile-number">${i + 1}</span></span>
          <span>?</span>
        </div>
        <div class="tile-face tile-back">
          <span>${escapeHtml(ans.text)}</span>
          <span class="pts">${ans.points}</span>
        </div>
      </div>
    `;
    tile.addEventListener('click', () => revelerTuile(tile));
    board.appendChild(tile);
  });
}

function revelerTuile(tile) {
  if (tile.classList.contains('revealed')) return;
  tile.classList.add('revealed');
  roundTotal += parseInt(tile.dataset.points, 10);
  roundTotalEl.textContent = roundTotal;
}

function toutRevele() {
  document.querySelectorAll('.tile').forEach(revelerTuile);
}

function toggleStrike(el) {
  el.classList.toggle('active');
}

function attribuerPoints(equipe) {
  scores[equipe] += roundTotal;
  document.getElementById('score' + equipe).textContent = scores[equipe];
}

function questionSuivante() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    afficherQuestion();
  } else {
    questionText.textContent = "C'était la dernière question ! Retour au menu pour recommencer.";
    board.innerHTML = '';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
