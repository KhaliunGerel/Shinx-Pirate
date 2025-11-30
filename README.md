# The Pirate - Web3 enabled game

<video src="demo.mov" controls style="max-width:100%; height:auto; display:block; margin:0 auto 1rem;">Your browser does not support the video tag. Download the demo: <a href="demo.mov">demo.mov</a></video>

https://github.com/user-attachments/assets/c734c5bb-7942-4fc1-8ced-90c46236c841



**Project**: Pirate (Web + Backend)

- **Repository structure**: frontend in `pirate_web/`, backend in `pirate_backend/`.
- **Deployed (frontend) URL**: https://shinx-steppeshadows.web.app/

**Overview**
- **Purpose**: A web3-enabled game service with a React + Unity WebGL frontend and a TypeScript/Express backend. The backend integrates with Supabase for data storage and uses Ethereum listeners + worker jobs for payment processing.

**Quick Links**
- **Frontend**: `pirate_web/`
- **Backend**: `pirate_backend/`

**Getting Started (summary)**
- Clone repository, then follow the backend and frontend steps below.

**Backend**
- **Location**: `pirate_backend/`
- **Tech**: Node.js, TypeScript, Express, Supabase, ethers

- Install dependencies:

```bash
cd pirate_backend
npm install
```

- Environment: Create a `.env` file at the root of `pirate_backend/` and populate the variables listed in the "Environment Variables" section below.

- Run in development:

```bash
npm run start
```

- Build for production:

```bash
npm run build
npm run start:prod
```

**Frontend**
- **Location**: `pirate_web/`
- **Tech**: Vite, React (TypeScript), Unity WebGL integration (`react-unity-webgl`)

- Install dependencies and start dev server:

```bash
cd pirate_web
npm install
npm run dev
```

- Build for production:

```bash
npm run build
npm run preview   # locally preview the built site
```

- Deploy: the site is hosted at the Firebase URL above. To deploy yourself (if the project uses Firebase hosting):

```bash
# Install firebase tools if needed
npm install -g firebase-tools
firebase login
firebase init hosting   # choose the correct project and public directory (e.g. `dist` or `build` depending on pipeline)
firebase deploy --only hosting
```

**Environment Variables (backend)**
Add a `.env` file in `pirate_backend/` with at least the following keys (these are derived from `src/config/env.ts`):

- `PORT` : port to run the server (e.g. `4000`)
- `JWT_SECRET` : secret used to sign JWTs
- `SUPABASE_URL` : Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` : Supabase service role key used for server-side operations
- `TREASURY_WALLET` : address of the treasury wallet
- `ETH_RPC_URL` : HTTP RPC URL for the Ethereum network
- `ALCHEMY_WSS_URL` : optional websocket URL used by the eth listener (e.g. Alchemy WebSocket)
- `MASTER_MNEMONIC` : mnemonic for master account (used by internal services)
- `ETH_TO_COIN_RATE` : conversion rate from ETH to in-game coin (number, default 10000)

Be careful to keep `SUPABASE_SERVICE_ROLE_KEY` and `MASTER_MNEMONIC` secret; never commit them to source control.

**Architecture (high-level)**
- **Frontend** (`pirate_web`): React app that embeds a Unity WebGL build for the game experience (`public/unity/`). It handles UI flows like login, buying coins, and communicating with backend API endpoints.
- **Backend** (`pirate_backend`): TypeScript + Express REST API exposing endpoints for authentication, game actions, payments, and shop operations. See `src/controllers/` and `src/routes/` for routes and handlers.
- **Database / Auth**: Supabase used as the primary backend (database + auth). The backend uses the Supabase JS client for server-side operations.
- **Ethereum Integration**: `ethers` is used to listen for on-chain events and to manage wallet interactions. An `EthListenerService` and worker processes handle incoming deposits and sweeping operations.
- **Workers**: Background workers (`workers/confirm.worker.ts`, `workers/sweep.worker.ts`) and cron jobs are used to confirm deposits and sweep funds to the treasury.
- **Services + Models**: Business logic is organized into `services/` and `models/` directories; controllers orchestrate request handling and responses.

**Main Features**
- **Authentication**: JWT-backed auth and user management via `AuthController` and `AuthService`.
- **Payments / Deposits**: On-chain deposit detection, deposit confirmation workflow, and coin crediting for users.
- **Game Runs**: Game session logic and persistence (game runs, results, rewards).
- **Shop & Inventory**: Purchase items with in-game coins and manage user inventory.
- **Admin / Treasury**: Worker-based sweeps and treasury management to consolidate funds.

**Network & Payments**
- The project is configured to use the Sepolia Ethereum testnet for on-chain payments and listeners. Players can buy in-game coins using Sepolia ETH (testnet ether). The backend expects RPC/WSS endpoints pointed at Sepolia (see `ETH_RPC_URL` and `ALCHEMY_WSS_URL` in the Environment Variables section).
- To test purchases locally:

```bash
# 1. Fund a test wallet using a Sepolia faucet
# 2. Set your frontend/backend to use a Sepolia RPC (e.g. Alchemy/Infura Sepolia endpoint)
# 3. Use the game's buy-coin flow in the UI to send Sepolia ETH to the deposit address
```

Notes:
- Use a Sepolia faucet to obtain test ETH — do not use mainnet ETH. Confirm `ETH_TO_COIN_RATE` in the backend env to control conversion from ETH to game coins.
- Ensure `ALCHEMY_WSS_URL` (or other websocket provider) is set to the Sepolia websocket endpoint so the `EthListenerService` can detect deposits in real-time.

**Troubleshooting**
- Missing env var errors: check `pirate_backend/src/config/env.ts` and your `.env` file.
- Backend not starting: run `npm install` in `pirate_backend` and ensure you use a supported Node.js version (Node 16+ is recommended).
- Frontend build/runtime errors: ensure the Unity WebGL build artifacts are present in `pirate_web/public/unity/`.

**Where to look in the codebase**
- API entry: `pirate_backend/src/index.ts` and `pirate_backend/src/app.ts`.
- Controllers: `pirate_backend/src/controllers/`.
- Services: `pirate_backend/src/services/` (business logic, eth listener, deposit processing).
- Workers: `pirate_backend/src/workers/`.
- Frontend app: `pirate_web/src/` (React + Unity integration in `components/UnityBattle.tsx`).

**Deployed URL**
- Frontend hosted at: https://shinx-steppeshadows.web.app/

---
