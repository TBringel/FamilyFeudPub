let questions = [];
const listEl = document.getElementById('questionsList');
const statusMsg = document.getElementById('statusMsg');

fetch('questions.json')
  .then(r => r.json())
  .then(data => {
    questions = data;
    render();
  })
  .catch(() => {
    statusMsg.textContent = "Impossible de charger questions.json (vérifie que le fichier est bien présent à côté d'editer.html).";
  });

function render() {
  listEl.innerHTML = '';
  questions.forEach((q, qIndex) => {
    const card = document.createElement('div');
    card.className = 'question-card';

    const textarea = document.createElement('textarea');
    textarea.value = q.question;
    textarea.addEventListener('input', () => q.question = textarea.value);
    card.appendChild(textarea);

    const answersWrap = document.createElement('div');
    answersWrap.className = 'answers-wrap';
    card.appendChild(answersWrap);

    function renderAnswers() {
      answersWrap.innerHTML = '';
      q.answers.forEach((ans, aIndex) => {
        const row = document.createElement('div');
        row.className = 'answer-row';

        const txt = document.createElement('input');
        txt.type = 'text';
        txt.placeholder = 'Réponse';
        txt.value = ans.text;
        txt.addEventListener('input', () => ans.text = txt.value);

        const pts = document.createElement('input');
        pts.type = 'number';
        pts.placeholder = 'Points';
        pts.value = ans.points;
        pts.addEventListener('input', () => ans.points = parseInt(pts.value, 10) || 0);

        const delBtn = document.createElement('button');
        delBtn.textContent = '✕';
        delBtn.title = 'Supprimer cette réponse';
        delBtn.addEventListener('click', () => {
          q.answers.splice(aIndex, 1);
          renderAnswers();
        });

        row.append(txt, pts, delBtn);
        answersWrap.appendChild(row);
      });
    }
    renderAnswers();

    const addAnswerBtn = document.createElement('button');
    addAnswerBtn.textContent = '+ Ajouter une réponse';
    addAnswerBtn.className = 'btn btn-edit';
    addAnswerBtn.style.marginTop = '0.4rem';
    addAnswerBtn.addEventListener('click', () => {
      q.answers.push({ text: '', points: 0 });
      renderAnswers();
    });
    card.appendChild(addAnswerBtn);

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const delQBtn = document.createElement('button');
    delQBtn.textContent = 'Supprimer cette question';
    delQBtn.addEventListener('click', () => {
      questions.splice(qIndex, 1);
      render();
    });
    actions.appendChild(delQBtn);
    card.appendChild(actions);

    listEl.appendChild(card);
  });
}

function ajouterQuestion() {
  const nextId = questions.length ? Math.max(...questions.map(q => q.id)) + 1 : 1;
  questions.push({
    id: nextId,
    question: 'Nouvelle question...',
    answers: [{ text: '', points: 0 }]
  });
  render();
}

function enregistrer() {
  // GitHub Pages est un hébergement statique : il ne peut pas recevoir d'écriture
  // depuis le navigateur. On télécharge donc le fichier questions.json à jour ;
  // il faut ensuite le remplacer dans le dépôt GitHub (web/questions.json) et pousser
  // le changement pour que le site en ligne soit mis à jour.
  const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'questions.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  statusMsg.textContent = '✓ Fichier questions.json téléchargé — remplace-le dans ton dépôt GitHub (web/questions.json) et pousse le changement pour mettre le site à jour.';
}
