
# 📖 Quiz Bible - Guide Complet

## 🎮 Vue d'ensemble du jeu

**JEUX Bible** est un quiz interactif basé sur la Bible avec un système de progression, de sauvegarde de données et des paliers de récompenses.

---

## 🔑 Nouvelles Modifications

### 1. ✅ Thème : Questions sur la Bible
- **71 questions** disponibles réparties sur 3 niveaux de difficulté :
  - **Facile** (20 questions) : Connaissances générales bibliques
  - **Moyen** (20 questions) : Détails historiques et contextes bibliques
  - **Difficile** (31 questions) : Questions avancées et détails spécifiques

### 2. ✅ Nombre de questions par partie
- **20 questions** par partie (au lieu de 12)
- Questions sélectionnées aléatoirement dans la base de données
- Pas de répétition au cours d'une même partie

### 3. ✅ Temps pour répondre
- **40 secondes** par question (au lieu de 60)
- Compte à rebours visuel
- Arrêt automatique à 0 secondes

### 4. ✅ Système de paliers de récompenses
- **20 paliers de récompenses** (au lieu de 12) :
  ```
  Palier 1:     500 FCFA
  Palier 2:   1 000 FCFA
  Palier 3:   2 000 FCFA
  ...
  Palier 20: 10 000 000 FCFA
  ```

### 5. ✅ Avantages (Lifelinse) - Utilisables une seule fois par partie
Chaque utilisateur peut utiliser ces avantages **UNE SEULE FOIS** pendant une partie :
- **50/50** : Retire 2 mauvaises réponses
- **Coup de pouce** : Affiche un indice
- **Sondage** : Montre le pourcentage de réponses correctes selon le public
- **Temps supplémentaire** : Ajoute du temps de réponse

---

## 💾 Système de Sauvegarde de Données

### Authentification
Les utilisateurs doivent s'**inscrire et se connecter** pour :
- Sauvegarder leurs progrès
- Garder un historique de leurs parties
- Accumuler des points tokens
- Apparaître au classement

### Données sauvegardées dans `localStorage`
```javascript
// Utilisateurs
USERS_KEY: "lakota-users"  // Profils utilisateurs
SESSION_KEY: "lakota-session"  // Session active

// Classement
LEADERBOARD_KEY: "lakota-leaderboard"  // Top 25

// Historique
QUESTION_HISTORY_KEY: "genie-ivoire-question-history"
QUESTION_STATS_KEY: "genie-ivoire-question-stats"
```

### Structure de l'utilisateur
```javascript
{
  id: "uuid",
  pseudo: "NomUtilisateur",
  password: "hashed",
  region: "Abidjan",
  avatarStyle: "sunrise",
  tokens: 0,
  stats: {
    gamesPlayed: 0,
    goodAnswers: 0,
    wrongAnswers: 0,
    bestStreak: 0,
    categoryStats: {
      "Bible": { correct: 0, wrong: 0 }
    }
  },
  createdAt: "ISO-DATE"
}
```

---

## 🎯 Flux de Jeu

### 1. Inscription
- Créer un compte avec pseudo et mot de passe
- Choisir un avatar parmi les styles disponibles
- Sélectionner une région

### 2. Connexion
- Entrer pseudo et mot de passe
- Une session est créée et sauvegardée

### 3. Mode de Jeu
- Sélectionner le niveau de difficulté (Facile, Moyen, Difficile)
- **20 questions** seront posées
- **40 secondes** par question
- Utiliser les avantages stratégiquement (une seule fois)

### 4. Résultats
- Affichage du score final en FCFA
- Calcul des tokens gagnés
- Mise à jour du classement

---

## 📊 Statistiques Suivies

Par utilisateur:
- ✅ Nombre de parties jouées
- ✅ Bonnes réponses / Mauvaises réponses
- ✅ Taux de succès (%)
- ✅ Meilleure série consécutive
- ✅ Catégories jouées
- ✅ Performance par catégorie
- ✅ Top 25 classement global

---

## 🛠️ Constantes du Jeu

```javascript
QUESTION_TIME = 40          // Secondes par question
QUESTIONS_PER_RUN = 20      // Questions par partie
GAINS = [500, 1000, ..., 10000000]  // 20 paliers
LEADERBOARD_LIMIT = 25      // Nombre max au classement
```

---

## 🔒 Sécurité

- Mots de passe stockés localement (considérer le chiffrement pour production)
- Sessions avec tokens
- Validation des données d'entrée
- Sanitization des pseudo

---

## 📱 Questions Disponibles

### Distribution
- **71 questions totales** disponibles
- Répartition : 20 Facile, 20 Moyen, 31 Difficile
- Sélection aléatoire pour chaque partie
- Sans répétition dans la même partie

### Exemple de Question
```javascript
{
  id: "facile-bible-premier-livre",
  category: "Bible",
  question: "Quel est le premier livre de la Bible ?",
  answers: ["Exode", "Genèse", "Lévitique", "Nombres"],
  correctIndex: 1,
  difficulty: "Facile",
  hint: "Il commence par 'Au commencement...'"
}
```

---

## 🎬 Comment Démarrer

1. **Ouvrir le jeu** : Ouvrir `index.html` dans un navigateur
2. **Créer un compte** : Cliquer sur "Inscription"
3. **Se connecter** : Utiliser vos identifiants
4. **Choisir un niveau** : Facile, Moyen, ou Difficile
5. **Répondre aux questions** : 20 questions, 40 secondes chacune
6. **Vérifier le classement** : Voir votre rang dans le top 25

---

## ✅ Checklist de Vérification

- [x] 20 questions par partie
- [x] 40 secondes par question
- [x] Questions sur la Bible
- [x] Grande palette de questions (71+)
- [x] Pas de répétition dans la même partie
- [x] Système de connexion/inscription
- [x] Sauvegarde des données utilisateur
- [x] Avantages utilisables une fois par partie
- [x] 20 paliers de récompenses
- [x] Classement global
- [x] Statistiques utilisateur
- [x] localStorage pour la persistance

---

## 🐛 Dépannage

### Les questions ne se chargent pas
Vérifier que `questions-data.js` est chargé avant `script.js` dans `index.html`

### Les données ne se sauvegardent pas
Vérifier que localStorage est disponible et non désactivé

### Session perdue
Les sessions sont stockées dans localStorage avec une limite de 25 entrées au classement

---

## 📝 Notes Supplémentaires

- Le système utilise `localStorage` pour une persistance locale
- Pour une application en production, considérer une base de données serveur
- Les questions peuvent être complétées avec plus de contenu Bible
- Les récompenses (FCFA) sont virtuelles et destinées au jeu

**Version**: 1.0
**Dernière mise à jour**: 28 avril 2026
