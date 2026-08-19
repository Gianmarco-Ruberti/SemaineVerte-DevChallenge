# Indice 3
Pour la moyenne semestrielle, on peut ajouter un champ à la db qui indique le semestre. ensuite on sépare les moyennes de module par semestre pour calculer la moyenne semestrielle.

Pour les deux moyennes, on réutilise la même fonction du challenge précédent, seulement, on cible des groupes de notes différents.
```js
grades.reduce((sum, grade) => sum + Number(grade.score), 0) / grades.length;
```