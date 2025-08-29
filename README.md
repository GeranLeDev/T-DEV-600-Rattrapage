# Projet de Gestion de projet à l'aide de tableaux de suivi

Ce projet est une application web de gestion de tableaux, similaire à Trello, permettant la gestion de workspaces, de tableaux, de listes et de cartes.

## Fonctionnalités

### Gestion des Workspaces

- Création, modification et suppression de workspaces
- Personnalisation des paramètres du workspace
- Gestion des membres et des permissions
- Interface de tableau de bord personnalisable

### Gestion des Tableaux

- Création, modification et suppression de tableaux
- Système de templates prédéfinis
- Personnalisation des colonnes et des étiquettes

### Gestion des Listes

- Création, modification et suppression de listes
- Réorganisation par glisser-déposer
- Limitation du nombre de cartes par liste

### Gestion des Cartes

- Création, modification et suppression de cartes
- Attribution d'utilisateurs et de dates d'échéance
- Système de commentaires et d'activité
- Pièces jointes et liens externes
- Étiquettes et catégories personnalisables

### Fonctionnalités Avancées

- Système de recherche global
- Filtres et vues personnalisées
- Intégration avec des outils externes
- Notifications en temps réel

## Technologies Utilisées

### Frontend

- React avec TypeScript
- Material-UI pour les composants
- Redux pour la gestion d'état
- React Router pour la navigation
- Jest et React Testing Library pour les tests
- Axios pour les requêtes HTTP
- Styled-components pour le styling
- React DnD pour le glisser-déposer
- React Query pour la gestion du cache

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Git

## Installation

1. Cloner le repository :

```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances :

```bash
cd frontend
npm install
```

3. Configurer les variables d'environnement :

```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SOCKET_URL=ws://localhost:3001
REACT_APP_GOOGLE_ANALYTICS_ID=votre_id_ga
```

4. Lancer l'application :

```bash
cd frontend
npm start
```

## 🖥️ Version Desktop

Pour lancer l'application en version desktop (avec Electron) :

```bash
cd frontend
npm run electron:serve
```

Cette commande lancera l'application dans une fenêtre desktop native, avec tous les avantages d'une application de bureau :

- Intégration avec le système d'exploitation
- Accès aux fonctionnalités natives
- Meilleure performance
- Utilisation hors-ligne possible

## Tests

Pour lancer les tests :

```bash
cd frontend
npm test
npm run test:coverage
```

## Architecture

L'application suit une architecture moderne de React avec une séparation claire des responsabilités.

### Structure du Projet

- `components/` : Composants React réutilisables
  - `common/` : Composants génériques
  - `layout/` : Composants de mise en page
  - `forms/` : Composants de formulaire
  - `cards/` : Composants liés aux cartes
  - `boards/` : Composants liés aux tableaux
- `pages/` : Pages principales de l'application
- `services/` : Services pour les appels API
- `store/` : Gestion d'état avec Redux
  - `actions/` : Actions Redux
  - `reducers/` : Réducteurs Redux
  - `selectors/` : Sélecteurs Redux
- `types/` : Types TypeScript
- `utils/` : Fonctions utilitaires
- `hooks/` : Hooks personnalisés
- `assets/` : Ressources statiques
- `styles/` : Styles globaux et thèmes

## Déploiement

Pour déployer l'application en production :

```bash
# Build de production
cd frontend
npm run build
```

Le build créera un dossier `build` contenant les fichiers optimisés pour la production. Ces fichiers peuvent être déployés sur n'importe quel serveur web statique.

## Contribution

1. Créer une branche pour votre fonctionnalité :

```bash
git checkout -b feature/nom-de-la-fonctionnalite
```

2. Commiter vos changements :

```bash
git commit -m "Description des changements"
```

3. Pousser vers la branche :

```bash
git push origin feature/nom-de-la-fonctionnalite
```

4. Créer une Pull Request

### Guidelines de Contribution

- Suivre les conventions de code existantes
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire
- Respecter les règles de commit conventionnel
- S'assurer que tous les tests passent avant de soumettre une PR

## Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Consulter la documentation

## Performance

- Lazy loading des composants
- Optimisation des images
- Compression des assets
- Gestion optimisée du state
- Memoization des composants

```

```
