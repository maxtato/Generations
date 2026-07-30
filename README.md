# GÉNÉRATIONS — le jeu de questions intergénérationnel

Jeu de société mobile en un seul fichier (`index.html`), à jouer à plusieurs sur un seul téléphone.

**Jouer en ligne : [generations-black.vercel.app](https://generations-black.vercel.app)**

## Trois façons de jouer

- **Solo** : on entre son prénom et sa génération, on choisit son niveau, et
  c'est parti pour 5 cartes. Les manches s'enchaînent et le score se cumule.
- **À plusieurs téléphones (en ligne)** : l'hôte crée une partie, un QR code
  s'affiche ; chacun le scanne, entre son prénom et sa génération, et tout le
  monde reçoit les mêmes questions en même temps (10 par manche, 2 par
  génération). Chacun répond sur son téléphone, le résultat de tous s'affiche
  après chaque question, puis l'hôte enchaîne. La connexion est directe entre
  téléphones (WebRTC via PeerJS, broker public gratuit) — aucun serveur à
  héberger.
- **Sur un seul téléphone** : on se passe l'appareil, chacun tire 5 cartes
  personnelles à son tour.

L'accueil propose **Solo** et **Multijoueur** ; le menu multijoueur regroupe
« Créer une partie », « Rejoindre une partie » et « Sur le même téléphone ».

## Principe

Chaque carte est un objet ou un événement d'époque, rattaché à une des 5 générations
(Baby-boomers, X, Y, Z, Alpha). À son tour, chaque joueur tire 5 cartes :

- **Territoire** (sa propre génération) : bonne réponse **+100**, erreur **−50** — tu es censé savoir.
- **Adverse** (une autre génération) : bonne réponse **×2, ×3 ou ×4** selon l'écart générationnel, aucune pénalité en cas d'erreur.

20 secondes par carte en Classique, 15 en Expert. À la fin de la manche, le tableau des scores détaille la
réussite de chacun sur son territoire et en terrain adverse.

## Contenu

- **2148 cartes**, chacune avec une anecdote « le savais-tu » révélée après la réponse
- Deux niveaux de difficulté : **Classique** (~1500 cartes, 20 s par question) et
  **Expert** (~650 cartes nettement plus pointues, 15 s) — choisi sur l'écran de
  préparation en solo, et par l'hôte dans le salon en ligne
- Dix thèmes, affichés sur la carte à côté de l'année : Objets du quotidien,
  Télé & dessins animés, Musique, Cinéma, Jeux vidéo, Technologie, Pub &
  marques, Mode & tendances, Événements vécus, Expressions & langage
- Formats variés : QCM, Vrai/Faux, « Avant ou après ? » et « Quelle génération
  a été la première à… » (ces dernières font parler toute la table)
- 1 à 6 joueurs, manches illimitées, scores cumulés
- Le plateau de joueurs est sauvegardé localement (localStorage)

## Banque de questions

Les sources vivent dans `qbank/<theme>.json` (un fichier par thème, plus
`base.json` qui fige les cartes d'origine). Le script de fusion
`merge-qbank.js` les valide (bonne réponse en tête, options distinctes,
longueurs, anecdote présente), dédoublonne globalement et régénère
`questions.js`, le seul fichier que charge le jeu. Pour ajouter des questions :
éditer ou ajouter un fichier de thème, relancer la fusion.

## Direction artistique

L'interface (accueil, menus, écran de passage, scores) est habillée façon app premium :
fond navy à motifs en filigrane, liserés et boutons or brillant, emblème « GÉNÉRATIONS »
extrait du visuel de référence (`img/emblem.webp`).

Chaque génération a son fond de carte illustré, embarqué dans le HTML (WebP en
base64) : Boomer psychédélique 70s, Gen X synthwave néon, Millennial Memphis
pixel 90s, Gen Z chrome Y2K, Gen Alpha pastel 3D. La question, le chrono et les
réponses se posent dans le panneau crème de l'illustration ; après la réponse,
la bonne option remonte en tête et le verdict s'affiche par-dessus le bas du
panneau — on touche la carte pour continuer.

Les fichiers sources des fonds sont dans `img/` (768×1152 WebP). Pour changer
la DA, remplacer ces fichiers puis ré-encoder en base64 dans `index.html`
(variables `--pk-img`) ; la zone du panneau crème se règle par génération via
la variable CSS `--panel` (insets haut/droite/bas/gauche).

## Lancer le jeu

Ouvrir `index.html` dans un navigateur, idéalement sur mobile. Fichier unique,
aucune dépendance, aucun serveur — les polices décoratives sont chargées depuis
Google Fonts si le réseau est disponible, sinon le jeu fonctionne avec les
polices système.
