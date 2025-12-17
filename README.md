
# Forma Monorepo

Forma is a full-stack AI Gym Coach platform including:

* **Mobile app**: React Native + Expo
* **Backend API**: NestJS
* **Shared packages**: TypeScript libraries (decision engine, plan generator, shared types)

This README covers **installation, setup, and running each workspace**.

---

## Prerequisites

* Node.js v24+ (LTS recommended)
* pnpm v10+
* Git
* WSL / Linux / macOS recommended for dev

---

## 1️⃣ Setup monorepo

```bash
# Clone repo
git clone <repo-url> forma
cd forma

# Install dependencies in the root
pnpm install
```

This will install **all workspace packages and apps**.

---

### 2️⃣ PNPM Workspace

`pnpm-workspace.yaml` defines all workspaces:

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

* Packages in `packages/` are shared libraries (decision engine, plan generator, shared types)
* Apps in `apps/` include `mobile` and `backend`

---

### 3️⃣ Packages Setup

**Example packages:**

* `@forma/shared-types`
* `@forma/decision-engine`
* `@forma/plan-generator`

No additional setup required. They are automatically linked via `workspace:*`.

---

### 4️⃣ Backend (NestJS)

**Folder:** `apps/backend`

**Install dependencies:**

```bash
# From monorepo root
pnpm install --filter backend
```

**Compile TypeScript:**

```bash
pnpm run --filter backend build
```

**Run in dev mode (with hot reload):**

```bash
pnpm run --filter backend start:dev
```

**Health check:**

```bash
curl http://localhost:3000/health
```

**Notes:**

* Backend uses **CommonJS** (`module: "CommonJS"`) for Node runtime.
* Uses **workspace packages** via `workspace:*`.
* TS config overrides root for NestJS decorators and CJS compatibility.

---

### 5️⃣ Mobile App (React Native + Expo)

**Folder:** `apps/mobile`

**Install dependencies:**

```bash
# From monorepo root
pnpm install --filter mobile
```

**Run app:**

```bash
pnpm run --filter mobile start
```

* Opens Metro bundler
* Supports **iOS / Android simulators** or **physical device**

**Notes:**

* Uses `expo-router` and `react-native-safe-area-context`
* TypeScript paths point to workspace packages: `"@forma/*": ["../../packages/*/src"]`

---

### 6️⃣ Running Everything Together (Skeleton)

1. Start backend first:

```bash
pnpm run --filter backend start:dev
```

2. Start mobile app:

```bash
pnpm run --filter mobile start
```

3. Mobile app can call backend APIs at `http://localhost:3000`.

---

### 7️⃣ Adding / Linking New Workspace Packages

1. Create new package under `packages/`
2. Add `package.json` and `src/` folder
3. Add dependency to backend or mobile via workspace:

```bash
pnpm add "@forma/new-package@workspace:*" --filter backend
pnpm add "@forma/new-package@workspace:*" --filter mobile
```

---

### 8️⃣ TypeScript Tips

* **Backend TS config** (`apps/backend/tsconfig.json`) overrides root:

```json
{
  "module": "CommonJS",
  "moduleResolution": "node",
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "useDefineForClassFields": false
}
```

* **Mobile TS config** (`apps/mobile/tsconfig.json`) extends base:

```json
{
  "paths": {
    "@forma/*": ["../../packages/*/src"]
  }
}
```

* **Shared packages** compile with ESNext, no runtime execution in Node.

---

### 9️⃣ Common Commands

| Command                               | Scope            | Description                            |
| ------------------------------------- | ---------------- | -------------------------------------- |
| `pnpm install`                        | Root             | Install all workspaces                 |
| `pnpm run --filter backend start:dev` | Backend          | Run NestJS in dev mode                 |
| `pnpm run --filter mobile start`      | Mobile           | Run Expo/React Native dev server       |
| `pnpm add <pkg>`                      | Root or filtered | Add dependencies to specific workspace |

---

### 10️⃣ Notes & Tips

* Use **pnpm workspace protocol (`workspace:*`)** to avoid npm registry fetches for local packages.
* Always run installs from **root**.
* Clean builds: `rm -rf apps/backend/dist` or `apps/mobile/.expo`.
* Zsh users: quote `workspace:*` when running `pnpm add`.
