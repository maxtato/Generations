# ARTEFACT — le quiz des générations

Jeu de société mobile en un seul fichier (`index.html`), à jouer à plusieurs sur un seul téléphone.

## Principe

Chaque carte est un objet ou un événement d'époque, rattaché à une des 5 générations
(Baby-boomers, X, Y, Z, Alpha). À son tour, chaque joueur tire 5 cartes :

- **Territoire** (sa propre génération) : bonne réponse **+100**, erreur **−50** — tu es censé savoir.
- **Adverse** (une autre génération) : bonne réponse **×2, ×3 ou ×4** selon l'écart générationnel, aucune pénalité en cas d'erreur.

20 secondes par carte. À la fin de la manche, le tableau des scores détaille la
réussite de chacun sur son territoire et en terrain adverse.

## Contenu

- 100 cartes (20 par génération), chacune avec une anecdote « le savais-tu » révélée après la réponse
- 2 à 6 joueurs, manches illimitées, scores cumulés
- Le plateau de joueurs est sauvegardé localement (localStorage)

## Direction artistique

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
