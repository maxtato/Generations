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

## Lancer le jeu

Ouvrir `index.html` dans un navigateur, idéalement sur mobile. Aucune dépendance,
aucun serveur — les polices décoratives sont chargées depuis Google Fonts si le
réseau est disponible, sinon le jeu fonctionne avec les polices système.
