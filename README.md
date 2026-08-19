# Node Sonar Sample App

A minimal Express app pre-wired to run tests, generate coverage, and get scanned
by SonarQube on every push via GitHub Actions.

## What's in this zip
```
node-sonar-sample-app/
├── src/app.js                       # app logic + routes
├── src/server.js                    # entrypoint
├── test/app.test.js                 # unit tests (Jest)
├── package.json
├── sonar-project.properties         # tells Sonar what to scan
├── .eslintrc.json
├── .gitignore
└── .github/workflows/sonar.yml      # CI: test -> coverage -> Sonar scan
```

## Prerequisites
- Node.js 18+ installed locally (to test before pushing)
- A GitHub repo (push this code into it)
- SonarQube running and reachable (see Package 1 — the EC2 setup)
- A SonarQube token (generated in Package 1, Step 6)

## Step-by-step: local test first

### 1. Install dependencies
```bash
cd node-sonar-sample-app
npm install
```

### 2. Run the app locally
```bash
npm start
# visit http://localhost:3000  -> {"message":"Node Sonar Sample App is running"}
# visit http://localhost:3000/add/4/5 -> {"result":9}
```

### 3. Run tests + generate coverage
```bash
npm test
```
This creates `coverage/lcov.info` — the file Sonar reads for coverage %.

## Step-by-step: push to GitHub and wire up CI

### 4. Create a new GitHub repo and push this code
```bash
git init
git add .
git commit -m "initial commit: sample app with sonar CI"
git branch -M main
git remote add origin https://github.com/<your-username>/node-sonar-sample-app.git
git push -u origin main
```

### 5. Add repo secrets
In GitHub: **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `SONAR_TOKEN` | the token you generated in SonarQube (Package 1, Step 6) |
| `SONAR_HOST_URL` | `http://<your-EC2-public-ip>:9000` |

### 6. Register the project in SonarQube (must match `sonar.projectKey`)
- SonarQube UI → **Projects → Create Project → Manually**
- Project key: `node-sonar-sample-app` (must exactly match `sonar-project.properties`)
- Skip the "Analyze" wizard — GitHub Actions will do it

### 7. Create the webhook (so n8n gets notified after each scan)
- Inside that project: **Project Settings → Webhooks → Create**
- Name: `n8n-report`
- URL: your n8n webhook URL — from Package 3, e.g. `https://<your-n8n-host>/webhook/sonar-report`
- (Leave this pointing nowhere for now if you haven't set up Package 3 yet — you can add it later without re-running anything)

### 8. Trigger the pipeline
```bash
git commit --allow-empty -m "trigger CI test run"
git push
```

### 9. Verify
- GitHub repo → **Actions** tab → the `CI - Test and SonarQube Analysis` workflow should run green
- SonarQube UI → your project → **Activity** tab → a new analysis should appear with metrics (bugs, coverage, code smells, etc.)
- If Package 3 (n8n) is already running, check its Webhook node's execution log — it should show an incoming POST within seconds of the Sonar analysis finishing

## Troubleshooting
| Symptom | Fix |
|---|---|
| CI fails at "SonarQube Scan" step | Double check `SONAR_TOKEN` and `SONAR_HOST_URL` secrets are set exactly, no trailing slash on the URL |
| Sonar shows 0% coverage | Confirm `coverage/lcov.info` was generated (`npm test` locally) and the path in `sonar-project.properties` matches |
| "Project not found" error | The `sonar.projectKey` in the properties file must match the project key created in the SonarQube UI exactly |
| EC2 not reachable from GitHub Actions | Your EC2 Security Group must allow inbound 9000 from GitHub's runners (0.0.0.0/0 on 9000, or a NAT/VPN setup) — GitHub-hosted runners have no fixed IP |
