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

Sur l'écran de profil, la génération se choisit dans un carrousel qui fait
défiler les vraies cartes du jeu (flèches, points de navigation, balayage
tactile et flèches du clavier) ; les années et l'époque s'affichent dans le
panneau crème de la carte, comme pendant une partie.

## Principe

Chaque carte est un objet ou un événement d'époque, rattaché à une des 5 générations
(Baby-boomers, X, Y, Z, Alpha). À son tour, chaque joueur tire 5 cartes :

- **Territoire** (sa propre génération) : bonne réponse **+100**, erreur **−50** — tu es censé savoir.
- **Adverse** (une autre génération) : bonne réponse **×2, ×3 ou ×4** selon l'écart générationnel, aucune pénalité en cas d'erreur.

20 secondes par carte en Classique, 15 en Expert. À la fin de la manche, le tableau des scores détaille la
réussite de chacun sur son territoire et en terrain adverse.

## Contenu

- **2648 cartes**, chacune avec une anecdote « le savais-tu » révélée après la réponse
- Deux niveaux de difficulté : **Classique** (~1850 cartes, 20 s par question) et
  **Expert** (~800 cartes nettement plus pointues, 15 s) — choisi sur l'écran de
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
`qbank/merge-qbank.js` les valide (bonne réponse en tête, options distinctes,
longueurs, anecdote présente), dédoublonne globalement et régénère
`questions.js`, le seul fichier que charge le jeu. Pour ajouter des questions :
éditer ou ajouter un fichier de thème, relancer la fusion.

La fusion signale aussi les **fuites de réponse** : un énoncé qui contient un
mot présent dans la bonne réponse et absent de toutes les autres options se
devine sans rien savoir (« Quel petit objet indiquait combien de timbres
coller sur une *lettre* ? » → « Le pèse-*lettre* »). Les questions à deux
options sont exclues du contrôle, leurs réponses reprenant forcément les mots
de l'énoncé.

## Direction artistique

L'interface (accueil, menus, écran de passage, scores) est habillée façon app premium :
fond navy à motifs en filigrane et logo « GÉNÉRATIONS » (`img/logo.webp`, détouré
du visuel de référence) sur l'écran d'accueil et au dos des cartes.

Les boutons reprennent le liseré du logo : un contour en dégradé rose `#F1297A`
→ bleu `#098FEF` → vert `#89DC21` peint sur la zone de bordure
(`background-clip: border-box`) tandis que le fond navy occupe l'intérieur
(`padding-box`). Les boutons secondaires prennent une teinte franche de cette
palette, et les tuiles de sélection s'allument dans leur propre couleur.

Chaque génération a son fond de carte illustré, embarqué dans le HTML (WebP en
base64) : Boomer psychédélique 70s, Gen X synthwave néon, Millennial Memphis
pixel 90s, Gen Z chrome Y2K, Gen Alpha pastel 3D. La question, le chrono et les
réponses se posent dans le panneau crème de l'illustration. Après la réponse,
les options restent **exactement à leur place** : la réponse choisie à tort
passe en rouge avec une croix, la bonne en vert avec une coche, et les autres
s'estompent. Le verdict vient occuper
l'espace de la question, déjà lue — un bouton « Suivant » sous la carte
enchaîne.

Les fichiers sources des fonds sont dans `img/` (768×1152 WebP). Pour changer
la DA, remplacer ces fichiers puis ré-encoder en base64 dans `index.html`
(variables `--pk-img`) ; la zone du panneau crème se règle par génération via
la variable CSS `--panel` (insets haut/droite/bas/gauche).

## Installer sur mobile

Le jeu est installable comme une application : sur iPhone, ouvrir le site dans
Safari puis *Partager → Sur l'écran d'accueil* ; l'icône (`img/icon.png`)
apparaît sur l'écran d'accueil et le jeu s'ouvre en plein écran, sans barre
d'adresse (`manifest.webmanifest` + balises `apple-touch-icon`).

Deux variantes d'icône sont conservées dans `img/` :
`icon-variante-eventail.png` (éventail doré, proche de l'emblème) et
`icon-variante-carte.png` (une carte, un grand « ? »). Pour en adopter une,
la copier sur `img/icon.png` et régénérer les tailles 180/192/512.

## Lancer le jeu

Ouvrir `index.html` dans un navigateur, idéalement sur mobile. Fichier unique,
aucune dépendance, aucun serveur — les polices décoratives sont chargées depuis
Google Fonts si le réseau est disponible, sinon le jeu fonctionne avec les
polices système.
