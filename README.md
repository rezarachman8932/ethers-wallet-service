## Installation

Install kc-wallet-svc with npm

```bash
  npm install && npm run prepare
```

Set .env file

```env
NODE_ENV="development"
NODE_PORT=3020
SECRET_KEY="YOUR_SECRET_KEY"

DB_HOST="YOUR_DB_HOST"
DB_PORT="YOUR_DB_PORT"
DB_NAME="YOUR_DB_NAME"
DB_USERNAME="YOUR_DB_USERNAME"
DB_PASSWORD="YOUR_DB_PASSWORD"
DB_DIALECT="mysql"
DB_LOGGING=0

ACCESS_CODE=""

GCLOUDENV=""
```

Migrate Table with npm

```bash
  npm run db:migrate
```

Running kc-wallet-svc with npm

```bash
  npm start
```
