# kc-wallet-svc

A RESTful wallet service built with **Node.js** and **Express** that provides crypto wallet management, blockchain interactions, fiat-to-crypto conversion, and smart contract integration via [ethers.js](https://docs.ethers.org/v6/).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Authentication & Signature Key](#authentication--signature-key)
- [Docker](#docker)
- [Project Structure](#project-structure)
- [License](#license)

---

## Tech Stack

- **Runtime**: Node.js >= 18
- **Framework**: Express.js
- **Database**: MySQL (via Sequelize ORM)
- **Blockchain**: ethers.js v6, Web3.js, Infura
- **Auth**: SHA-256 HMAC-based signature verification
- **Docs**: Swagger UI
- **Testing**: Mocha + Supertest
- **Linting/Formatting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/)
- A running **MySQL** database
- API keys for: [Infura](https://infura.io), [Etherscan](https://etherscan.io), [CoinMarketCap](https://coinmarketcap.com/api)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd kc-wallet-svc
```

### 2. Install dependencies

```bash
npm install && npm run prepare
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

See the [Environment Variables](#environment-variables) section for details on each variable.

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the server

```bash
npm start
```

The server will run on `http://localhost:3020` by default (configurable via `NODE_PORT`).

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | App environment | `development` |
| `NODE_PORT` | Port the server listens on | `3020` |
| `SECRET_KEY` | App-level secret key | `your-secret` |
| `DB_HOST` | MySQL host | `127.0.0.1` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `kc_wallet` |
| `DB_USERNAME` | Database user | `root` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_DIALECT` | ORM dialect (keep as `mysql`) | `mysql` |
| `DB_LOGGING` | Log SQL queries (`0` = off, `1` = on) | `0` |
| `ACCESS_CODE` | Platform access code | — |
| `GCLOUDENV` | Google Cloud environment identifier | `production` |
| `SM_ENV` | Secret Manager environment | `dev` |
| `INFURA_API_KEY` | Infura project API key | — |
| `ETHERSCAN_API_KEY` | Etherscan API key | — |
| `CMC_API_KEY` | CoinMarketCap API key | — |
| `CMC_URL` | CoinMarketCap base URL | — |
| `SWAGGER_KEY` | Key to access Swagger UI | — |

> **Never commit your `.env` file.** It is already excluded via `.gitignore`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run migrations then start the server with nodemon |
| `npm test` | Run all tests with Mocha |
| `npm run db:migrate` | Run Sequelize database migrations |
| `npm run lint` | Lint source files with ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format all files with Prettier |
| `npm run validate` | Run lint + format check + tests |

---

## API Overview

All endpoints require a valid `signature-key` header. See [Authentication & Signature Key](#authentication--signature-key).

### Wallet — `/api/wallet`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/wallet` | Create a new wallet |
| `POST` | `/api/wallet/private` | Get wallet by private key |
| `POST` | `/api/wallet/mnemonic` | Get wallet by mnemonic phrase |
| `POST` | `/api/wallet/balance` | Get wallet balance |
| `POST` | `/api/wallet/transfer` | Transfer crypto |
| `POST` | `/api/wallet/convert` | Convert fiat to crypto |
| `POST` | `/api/wallet/estimate` | Estimate gas for a transaction |
| `POST` | `/api/wallet/estimate/gas` | Estimate cost for balance transfer |
| `GET` | `/api/wallet/gas-price` | Get current gas price |
| `POST` | `/api/wallet/nonce` | Get wallet nonce |
| `POST` | `/api/wallet/transaction/history` | Get transaction history |
| `POST` | `/api/wallet/transaction/detail` | Get transaction detail |
| `POST` | `/api/wallet/call/smart-contract` | Call a smart contract method |
| `GET` | `/api/wallet/block/latest` | Get latest block |
| `GET` | `/api/wallet/block/hash` | Get block by hash |
| `GET` | `/api/wallet/block/number` | Get block by number |
| `GET` | `/api/wallet/block/transactions` | Get block with transactions |

### Platform — `/api/platform`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/platform` | Register a new platform |
| `GET` | `/api/platform` | Get platform info |

> Full request/response schemas are available via Swagger UI at `/api-docs` (requires `SWAGGER_KEY`).

---

## Authentication & Signature Key

Every API request (except platform registration) must include a `signature-key` header. The signature is generated from your **UUID**, **Access Key**, and the **request body**.

### Step 1 — Generate Auth Token

```
auth_token = SHA256(uuid + ":" + accessKey)
```

### Step 2 — Generate Signature Key

```
signature_key = SHA256(minified_json_body + ":" + auth_token)
```

> The JSON body must be **minified** (no spaces) and must exactly match the raw HTTP body sent.

### Code Examples

<details>
<summary>Node.js</summary>

```javascript
const crypto = require('crypto');

const uuid = 'YOUR_UUID';
const accessKey = 'YOUR_ACCESS_KEY';
const body = { fiatCurrency: 'IDR', cryptoSymbol: 'POL', amount: 50000 };

const sha256 = (str) => crypto.createHash('sha256').update(str).digest('hex');

const authToken = sha256(`${uuid}:${accessKey}`);
const signatureKey = sha256(`${JSON.stringify(body)}:${authToken}`);

console.log('Signature Key:', signatureKey);
```

</details>

<details>
<summary>PHP</summary>

```php
<?php
$uuid = 'YOUR_UUID';
$accessKey = 'YOUR_ACCESS_KEY';
$body = ["fiatCurrency" => "IDR", "cryptoSymbol" => "POL", "amount" => 50000];

$authToken = hash('sha256', $uuid . ':' . $accessKey);
$signatureKey = hash('sha256', json_encode($body) . ':' . $authToken);

echo "Signature Key: " . $signatureKey;
?>
```

</details>

<details>
<summary>Python</summary>

```python
import hashlib, json

uuid = 'YOUR_UUID'
access_key = 'YOUR_ACCESS_KEY'
body = {"fiatCurrency": "IDR", "cryptoSymbol": "POL", "amount": 50000}

sha256 = lambda s: hashlib.sha256(s.encode('utf-8')).hexdigest()

auth_token = sha256(f"{uuid}:{access_key}")
# separators=(',', ':') is required to produce minified JSON
signature_key = sha256(f"{json.dumps(body, separators=(',', ':'))}:{auth_token}")

print(f"Signature Key: {signature_key}")
```

</details>

### Troubleshooting Invalid Signatures

| Problem | Fix |
|---|---|
| Wrong JSON key order | Key order in the stringified body must match the HTTP body exactly |
| Whitespace in JSON | Use minified JSON — no spaces after `:` or `,` |
| Hidden characters | Ensure no `\n` or trailing spaces when concatenating before hashing |

---

## Docker

Build and run the service using Docker:

```bash
# Build the image
docker build -t kc-wallet-svc .

# Run the container
docker run -p 3000:3000 --env-file .env kc-wallet-svc
```

> The Docker image uses `node:21-alpine` and exposes port `3000`.

---

## Project Structure

```
kc-wallet-svc/
├── bin/                    # Server entry point & secret loader
├── config/                 # DB and Swagger configuration
├── docs/                   # Swagger JSDoc definitions
│   ├── 01-wallet/
│   ├── 02-platform/
│   └── generateSignatureKey/
├── smart-contracts/        # Solidity contracts (EnterpriseDocumentNFT)
├── src/
│   ├── constants/          # Shared constants
│   ├── controllers/        # Route handlers
│   ├── databases/          # Sequelize models, migrations, seeders
│   ├── middlewares/        # Auth & request middleware
│   ├── routes/             # Express route definitions
│   ├── services/           # Business logic & external integrations
│   ├── utils/              # Helpers, crypto, response formatter
│   ├── validators/         # Joi request validators
│   └── server.js           # Express app setup
├── tests/                  # Mocha test suites
├── scripts/                # Git hook scripts
├── .env.example            # Environment variable template
├── Dockerfile
└── package.json
```
