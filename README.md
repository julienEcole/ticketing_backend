# Ticketing Backend

Ce projet est la partie backend du système de billetterie basé sur la blockchain Ethereum en utilisant Foundry.

---

## 📌 Prérequis

Assurez-vous que votre environnement dispose des versions suivantes :

### 🔹 Système et Outils de Développement
- **OS** : Linux, macOS ou Windows (WSL recommandé sur Windows)
- **Node.js** : v16 ou supérieur ([Télécharger Node.js](https://nodejs.org/))
- **npm** : v8 ou supérieur (installé avec Node.js)
- **Foundry (Forge CLI)** : dernière version ([Installer Foundry](https://book.getfoundry.sh/getting-started/installation))
- **Ethers.js** : v6 ou supérieur (installé via npm)
- **Anvil** : Simulateur Ethereum local (inclus avec Foundry)

### 🔹 Dépendances Blockchain
- **Solidity** : v0.8.19 (utilisé dans Foundry)
- **OpenZeppelin Contracts** : dernière version

### 🔹 Outils Optionnels
- **VS Code** (avec l'extension Solidity pour la rédaction des smart contracts)
- **Postman** (pour tester les API REST du backend)

Vérifiez que tout est installé correctement :
```bash
node -v  # Vérifie la version de Node.js
npm -v   # Vérifie la version de npm
forge --version  # Vérifie la version de Foundry
anvil --version  # Vérifie la version d'Anvil
```

---

## 📌 Installation et Configuration

1️⃣ **Cloner le projet**
```bash
git clone https://github.com/votre-compte/ticketing_backend.git
cd ticketing_backend
```

2️⃣ **Installer les dépendances Node.js**
```bash
npm install
```

3️⃣ **Configurer les variables d'environnement**
Créer un fichier `.env` à la racine du projet :
```bash
touch .env
```
Ajoutez les configurations suivantes (ajustez selon votre réseau blockchain) :
```env
PORT=3000
ETH_RPC_URL=http://localhost:8545  # URL du nœud Ethereum (Anvil local par défaut)
PRIVATE_KEY=VOTRE_CLE_PRIVEE  # Clé privée pour signer les transactions Ethereum
```

4️⃣ **Installer Foundry et OpenZeppelin Contracts**
```bash
forge install OpenZeppelin/openzeppelin-contracts
```

5️⃣ **Compiler le smart contract Solidity**
```bash
forge build
```

6️⃣ **Lancer un réseau Ethereum local avec Anvil**
```bash
anvil
```
Cela démarre un nœud Ethereum sur `http://localhost:8545` avec des comptes de test.

7️⃣ **Déployer le smart contract**
```bash
forge create --rpc-url adresseBlockchain \
            --private-key privateKeyDuPropriétaireSans0xDevant \
            src/Ticketing.sol:Ticketing --broadcast
```
Cela affichera l'adresse du contrat déployé (`Contract deployed at: 0x...`).

8️⃣ **Lancer le backend en mode développement**
```bash
npm run dev
```

9️⃣ **Lancer le backend en mode production**
```bash
npm run build
npm start
```

---

## 📌 Structure du Projet

```
ticketing_backend/
 ├── blockchain/               # Dossier pour la partie blockchain (Foundry)    //TODO
 │   ├── contracts/            # Smart contracts Solidity
 │   ├── scripts/              # Scripts de déploiement/interaction
 │   ├── forge.toml            # Config de Foundry
 │   └── ...
 ├── src/
 │   ├── index.ts              # Point d'sentrée du backend
 │   ├── blockchain/
 │   │   ├── ethereum.service.ts  # Interaction avec Ethereum
 │   │   └── ...
 │   ├── controllers/
 │   ├── services/
 │   ├── models/
 │   └── routes/
 ├── package.json
 ├── tsconfig.json
 ├── .env
 └── ...
```

---

## 📌 Tests & Développement

- **Tester le backend** avec Postman ou cURL :
```bash
curl -X GET http://localhost:3000/
```

- **Vérifier le déploiement des smart contracts**
```bash
forge test
```

---

## 📌 Contribution

Les pull requests sont les bienvenues. Merci de suivre les bonnes pratiques de code et d'effectuer des tests avant soumission.

---

## 📌 Licence

NONE

---

