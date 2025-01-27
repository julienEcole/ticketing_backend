# Ticket Backend

Ce projet est la partie backend pour l'achat et la revente de tickets, avec intégration blockchain via **Forge**.

---

## Prérequis

Assurez-vous que votre environnement dispose des versions suivantes :

- **Node.js** : v16 ou supérieur
- **npm** : v8 ou supérieur (installé avec Node.js)
- **Forge CLI** : dernière version installée globalement (si vous gérez une blockchain locale)

Pour vérifier les versions :
```bash
node -v
npm -v
forge --version  # pour Forge
```

## Installation
Cloner le depot :

```bash
git clone https://github.com/julienEcole/ticketing_backend.git
cd ticketing_backend
```
Installer les dépendances :

```bash
npm install
```
Configurer les variables d'environnement :
Créez un fichier .env à la racine et configurez les variables nécessaires. Exemple minimal :

```bash
PORT=3000
FORGE_ENDPOINT=http://localhost:8210/api(TODO)
```
Compiler le projet (TypeScript) :


```bash
npm run build
```