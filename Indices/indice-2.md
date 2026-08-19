# Indice 2
Pour trouver la moyenne des notes pour un sujet on peut utiliser
```js
grades.reduce((sum, grade) => sum + Number(grade.score), 0) / grades.length;
```