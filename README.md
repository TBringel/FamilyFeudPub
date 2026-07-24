# Familles en Or — jeu local

Petit site 100% local pour animer une partie de "Familles en Or" en famille.

- Aucune installation lourde : juste un JDK Java (pas de Maven, pas de framework).
- Fonctionne dans un navigateur, servi par un mini serveur Java fait maison.
- Un menu pour **Jouer**, un bouton pour **Modifier les questions / réponses**.

## Structure du projet

```
familyfeud/
├── src/Main.java        <- le serveur (sert les pages + l'API des questions)
├── web/                 <- le site (HTML, CSS, JS)
│   ├── index.html        (menu)
│   ├── jouer.html + game.js   (écran de jeu)
│   ├── editer.html + editer.js (écran d'édition)
│   └── style.css
├── data/questions.json  <- tes questions et réponses (modifiable via l'éditeur, ou à la main)
├── lancer.sh / lancer.bat  <- scripts pour compiler + démarrer en un clic
```

## Prérequis

Il te faut un **JDK** (Java Development Kit), version 11 ou plus récente.
Vérifie si tu l'as déjà :

```
java -version
javac -version
```

Si `javac` n'est pas reconnu, installe un JDK (ex. Temurin/Adoptium) :
https://adoptium.net/fr/temurin/releases/

## Lancer le site

### Option A — avec Visual Studio Code (recommandé)

1. Installe l'extension **"Extension Pack for Java"** (Microsoft) dans VS Code.
2. Ouvre le dossier `familyfeud` dans VS Code (`Fichier > Ouvrir le dossier...`).
3. Ouvre `src/Main.java`. VS Code va détecter le projet Java automatiquement.
4. Clique sur **"Run"** (petit triangle) au-dessus de `public static void main`.
   - VS Code compile et lance le serveur pour toi.
   - Attention : par défaut VS Code exécute depuis la racine du dossier ouvert, ce qui est
     ce qu'il faut ici (les dossiers `web/` et `data/` sont bien à côté de `src/`).
5. Dans le terminal, tu verras : `Ouvre ton navigateur sur : http://localhost:8000`
6. Ouvre cette adresse dans ton navigateur.

### Option B — en ligne de commande

Depuis le dossier `familyfeud/` :

**Windows** : double-clique sur `lancer.bat` (ou exécute-le dans un terminal).

**Mac / Linux** :
```
./lancer.sh
```

**Ou manuellement** (fonctionne partout) :
```
javac -d out src/Main.java
java -cp out Main
```

Puis ouvre **http://localhost:8000** dans ton navigateur.

Pour arrêter le serveur : `Ctrl + C` dans le terminal.

## Utilisation

- **Menu** (`http://localhost:8000`) : deux boutons, "Jouer" et "Modifier les questions / réponses".
- **Jouer** : affiche la question, un plateau de tuiles dorées à retourner en cliquant dessus
  (réponse + points révélés), 3 croix pour les mauvaises réponses, deux compteurs de score
  (bouton "+ Points de la manche" pour attribuer le total de la manche à une famille),
  et un bouton "Question suivante".
- **Modifier les questions / réponses** : ajoute/modifie/supprime des questions et leurs
  réponses (texte + points), puis clique sur "Enregistrer" pour sauvegarder dans
  `data/questions.json`.

## Mettre le jeu en ligne (GitHub Pages / Odoo en iframe)

GitHub Pages (et donc ton site Odoo qui l'intègre en iframe) ne peut servir que des
fichiers statiques : il ne peut pas faire tourner le serveur Java `Main.java`.
Le jeu a donc été adapté pour fonctionner **sans backend** une fois en ligne :

- `web/questions.json` contient les questions/réponses, chargées directement par
  `game.js` et `editer.js` via `fetch('questions.json')` (plus besoin de `/api/questions`).
- Le bouton "Enregistrer" de l'éditeur est devenu **"Télécharger questions.json"** :
  il télécharge le fichier à jour sur ton ordinateur, car un site statique ne peut
  pas écrire de fichier tout seul.

### Workflow pour mettre à jour les questions en ligne

1. Ouvre `editer.html` (en local, avec le serveur Java lancé, ou même directement en
   ouvrant le fichier dans ton navigateur).
2. Modifie tes questions/réponses.
3. Clique sur **"Télécharger questions.json"** — le fichier arrive dans ton dossier de téléchargements.
4. Remplace `web/questions.json` dans ton dépôt GitHub par ce nouveau fichier
   (glisser-déposer sur github.com, ou `git add` / `git commit` / `git push` en local).
5. GitHub Pages se met à jour automatiquement après quelques dizaines de secondes.

Le serveur Java (`src/Main.java`, `lancer.sh`/`lancer.bat`) reste utile uniquement
pour tester en local avant de mettre en ligne — il n'est plus nécessaire pour que
le jeu fonctionne sur ton site Odoo.

## Pour aller plus loin (idées d'évolution)

- Ajouter un minuteur par question.
- Mélanger l'ordre des questions au hasard.
- Ajouter un son de "buzzer" ou de mauvaise réponse.
- Importer/exporter les questions depuis un fichier Excel/CSV.

Si tu veux une de ces évolutions, demande-moi et je te la code directement.
