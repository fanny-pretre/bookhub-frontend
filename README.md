# 📚 BookHub - Frontend Angular

Interface web de la plateforme de gestion de bibliothèque communautaire **BookHub**.  
Développée avec Angular 21 dans le cadre du projet DEV25_0364B.

---

## 🛠️ Stack technique

| Technologie | Version |
|---|---|
| Angular | 21 |
| TypeScript | 5.9 |
| Angular HttpClient | inclus dans `@angular/common` |
| Jasmine / Karma | Configuré par defaut dans un projet Angular CLI classique |

---

## 📋 Prérequis

- [Node.js](https://nodejs.org/) v24.15.0
- [npm](https://www.npmjs.com/) v11.12.1 
- [Angular CLI](https://angular.io/cli) v21

```bash
npm install -g @angular/cli
```

---

## 🚀 Installation et lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/fanny-pretre/bookhub-frontend.git
cd bookhub-frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

Copier le fichier d'environnement et renseigner l'URL de l'API :

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 4. Lancer l'application

```bash
ng serve
```

L'application est accessible sur **http://localhost:4200**

---

## 🏗️ Structure du projet

```
src/
├── app/
│   ├── core/                  # Services globaux, intercepteurs, guards
│   │   ├── auth/              # AuthService, JwtInterceptor, AuthGuard
│   │   └── services/          # BookService, LoanService, ReservationService...
│   ├── shared/                # Composants réutilisables (header, footer, spinner...)
│   ├── features/              # Modules fonctionnels
│   │   ├── auth/              # Inscription, Connexion, Profil
│   │   ├── catalogue/         # Liste livres, Détail livre, Recherche
│   │   ├── loans/             # Mes emprunts, Historique
│   │   ├── reservations/      # Mes réservations
│   │   ├── ratings/           # Notation et commentaires
│   │   └── dashboard/         # Dashboard lecteur, bibliothécaire, admin
│   └── app-routing.module.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── assets/
```

---

## 🔐 Authentification

Le token JWT est stocké côté client et transmis automatiquement via un intercepteur HTTP sur toutes les requêtes authentifiées.

Les routes sont protégées par des **guards Angular** selon les rôles :

| Rôle | Accès |
|---|---|
| `USER` | Catalogue, emprunts, réservations, notation |
| `LIBRARIAN` | + Gestion catalogue, validation retours, modération |
| `ADMIN` | + Gestion utilisateurs, accès complet |

---

## 🧪 Tests

```bash
# Lancer les tests unitaires
ng test

# Avec rapport de couverture
ng test --code-coverage
```

> Couverture minimale attendue : **20%**

---

## 📦 Build de production

```bash
ng build --configuration production
```

Les fichiers compilés sont générés dans `dist/bookhub-frontend/`.

---

## 👥 Équipe

| Nom | Rôle |
|---|---|
| Fanny | - |
| Emma | - |
| Sofia | - |
| Agathe | - |

---

## 📄 Licence

Projet réalisé dans le cadre de la formation **CDA** - ENI École Informatique.
