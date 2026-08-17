# FlixBuzz Kubernetes Production Plan

This is the production plan for launching FlixBuzz as a live Kubernetes-hosted website with a real backend API and SQLite database.

The app is no longer frontend-only. The production system now has:

```text
React/Vite frontend
Express API backend
SQLite database file
WhatsApp order flow
Kubernetes deployment
CI/CD automation
```

Orders and payments still happen manually in WhatsApp. The backend exists mainly to make product/pricing/admin updates real and globally visible.

## Production Architecture

```text
GitHub
  -> GitHub Actions
  -> Build frontend image
  -> Build backend image
  -> Push images to GHCR
  -> Deploy to Kubernetes
  -> Ingress + HTTPS
  -> Public website
```

Runtime:

```text
Browser
  -> HTTPS
  -> Ingress
  -> Frontend Service
  -> React static site
  -> /api requests
  -> Backend Service
  -> Express API
  -> SQLite PersistentVolume
```

## Environments

Use two namespaces:

```text
flixbuzz-dev
flixbuzz-prod
```

Development:

```text
Branch: dev
Namespace: flixbuzz-dev
Domain: dev.flixbuzz.com
```

Production:

```text
Branch: main
Namespace: flixbuzz-prod
Domain: flixbuzz.com
```

## Services

### Frontend

Purpose:

- Serves the React/Vite production build.
- Uses Nginx.
- Routes all SPA paths to `index.html`.

Kubernetes:

```text
frontend Deployment
frontend Service
frontend Ingress route /
```

Recommended replicas:

```text
dev: 1
prod: 2
```

### Backend API

Purpose:

- Serves `/api/*`.
- Loads products from SQLite.
- Saves catalog changes from `/admin`.
- Stores admin passcode hash/salt in SQLite.

Kubernetes:

```text
backend Deployment
backend Service
PersistentVolumeClaim for SQLite
Ingress route /api
```

Recommended replicas:

```text
dev: 1
prod: 1
```

Important: keep the backend at **one writer replica** while using SQLite. SQLite is file-based and should not be treated like a multi-writer database behind many pods.

## SQLite Persistence

Default backend database path:

```text
data/flixbuzz.sqlite
```

In Kubernetes, use:

```text
DATA_DIR=/data
SQLITE_PATH=/data/flixbuzz.sqlite
```

Mount a PersistentVolumeClaim:

```text
/data
```

Production PVC:

```text
ReadWriteOnce
5Gi initial size
daily backups
```

Backup strategy:

```text
Nightly CronJob
  -> copy SQLite file
  -> upload to object storage
```

Examples:

```text
DigitalOcean Spaces
AWS S3
Backblaze B2
```

## Backend API Routes

```text
GET  /api/health
GET  /api/products
GET  /api/admin/status
POST /api/admin/login
PUT  /api/admin/products
```

Admin flow:

```text
First login
  -> create passcode
  -> backend hashes passcode
  -> stores hash/salt in SQLite
  -> returns session token

Later login
  -> verify passcode
  -> return session token

Save catalog
  -> frontend sends full product catalog
  -> backend validates
  -> backend replaces products in SQLite transaction
```

## Kubernetes Manifests

Recommended structure:

```text
k8s/
  base/
    frontend-deployment.yaml
    frontend-service.yaml
    backend-deployment.yaml
    backend-service.yaml
    backend-pvc.yaml
    ingress.yaml
    configmap.yaml
    kustomization.yaml
  overlays/
    dev/
      kustomization.yaml
      patch.yaml
    prod/
      kustomization.yaml
      patch.yaml
```

Use Kustomize first. Helm can come later.

## Docker Images

Use two images:

```text
ghcr.io/fahid-khan/flixbuzz-frontend:<git-sha>
ghcr.io/fahid-khan/flixbuzz-backend:<git-sha>
```

Frontend Dockerfile:

```text
Node build stage
  -> npm ci
  -> npm run build

Nginx runtime stage
  -> copy dist
  -> serve static files
```

Backend Dockerfile:

```text
Node runtime
  -> npm ci --omit=dev
  -> copy server and src/data seed file
  -> run node server/index.js
```

Because the backend imports `src/data/products.js` for initial seeding, the backend image must include:

```text
server/
src/data/products.js
package.json
package-lock.json
```

## Ingress and HTTPS

Install:

```text
ingress-nginx
cert-manager
```

Use:

```text
Let's Encrypt staging issuer
Let's Encrypt production issuer
```

Routes:

```text
https://flixbuzz.com/      -> frontend service
https://flixbuzz.com/api   -> backend service
```

Dev:

```text
https://dev.flixbuzz.com/    -> dev frontend
https://dev.flixbuzz.com/api -> dev backend
```

## CI/CD Pipeline

GitHub Actions jobs:

```text
lint
frontend-build
backend-smoke
docker-build-frontend
docker-build-backend
push-images
deploy-dev or deploy-prod
rollout-check
smoke-test
```

Required checks:

```bash
npm ci
npm run lint
npm run build
node --input-type=module -e "import { getProducts } from './server/database.js'; console.log(getProducts().length)"
```

Development deployment:

```text
push to dev
  -> test
  -> build images
  -> push images
  -> deploy to flixbuzz-dev
  -> smoke test dev.flixbuzz.com
```

Production deployment:

```text
merge to main
  -> test
  -> build images
  -> push images
  -> manual approval
  -> deploy to flixbuzz-prod
  -> smoke test flixbuzz.com
```

Use immutable image tags:

```text
<git-sha>
```

## GitHub Secrets

Recommended secrets:

```text
KUBE_CONFIG_DEV
KUBE_CONFIG_PROD
GHCR_TOKEN
```

Optional:

```text
SLACK_WEBHOOK_URL
BACKUP_BUCKET_ACCESS_KEY
BACKUP_BUCKET_SECRET_KEY
```

The admin passcode is created from the admin UI and stored hashed in SQLite. Do not hardcode it in Kubernetes manifests.

## Health Checks

Frontend readiness/liveness:

```text
GET /
```

Backend readiness/liveness:

```text
GET /api/health
```

Smoke tests:

```bash
curl -f https://dev.flixbuzz.com
curl -f https://dev.flixbuzz.com/api/health
curl -f https://dev.flixbuzz.com/api/products
curl -f https://flixbuzz.com
curl -f https://flixbuzz.com/api/health
curl -f https://flixbuzz.com/api/products
```

Manual production checks:

- Home page loads.
- Catalog loads from API.
- Product detail page works.
- Checkout WhatsApp link works.
- Review WhatsApp link works.
- Admin login works.
- Price update + Save catalog updates public catalog.
- Dark/light mode works.
- Mobile layout works.

## Monitoring

Minimum:

```bash
kubectl get pods -n flixbuzz-prod
kubectl rollout status deployment/flixbuzz-frontend -n flixbuzz-prod
kubectl rollout status deployment/flixbuzz-backend -n flixbuzz-prod
kubectl logs deployment/flixbuzz-backend -n flixbuzz-prod
```

Recommended production stack:

```text
Prometheus
Grafana
Loki
Alertmanager
```

Monitor:

- Frontend pod restarts.
- Backend pod restarts.
- Backend 5xx errors.
- Ingress 4xx/5xx rates.
- SQLite PVC disk usage.
- Certificate expiry.
- Deployment rollout status.

## Backups

SQLite must be backed up.

Recommended:

```text
Kubernetes CronJob
  -> pause writes briefly or use SQLite backup command
  -> copy /data/flixbuzz.sqlite
  -> upload to object storage
  -> keep daily backups for 30 days
```

Also test restore:

```text
download backup
mount into staging/dev
start backend
verify products
```

## Security Notes

Immediate:

- HTTPS only.
- No hardcoded credentials.
- SQLite file stored on PVC, not in Git.
- Database files ignored by `.gitignore`.
- Production deploy requires manual approval.
- Backend admin routes require bearer token.

Next hardening:

- Use signed JWT or durable sessions.
- Add rate limiting to login.
- Add CSRF strategy if cookies are introduced.
- Add admin audit log.
- Add image scanning with Trivy.
- Add Kubernetes RBAC.
- Add NetworkPolicies.
- Add backup encryption.

## Rollback

Frontend rollback:

```bash
kubectl rollout undo deployment/flixbuzz-frontend -n flixbuzz-prod
```

Backend rollback:

```bash
kubectl rollout undo deployment/flixbuzz-backend -n flixbuzz-prod
```

Check rollout:

```bash
kubectl rollout status deployment/flixbuzz-frontend -n flixbuzz-prod
kubectl rollout status deployment/flixbuzz-backend -n flixbuzz-prod
```

Database rollback:

```text
restore latest known-good SQLite backup to PVC
restart backend pod
verify /api/products
```

## Production Launch Phases

### Phase 1: Local Backend

- Install dependencies.
- Run `npm run dev:api`.
- Confirm SQLite database seeds.
- Run `npm run dev:web`.
- Confirm frontend loads products from API.
- Confirm admin save persists to SQLite.

### Phase 2: Docker

- Add frontend Dockerfile.
- Add backend Dockerfile.
- Add Nginx config.
- Build both images locally.
- Run both containers locally.
- Confirm `/api` routing works.

### Phase 3: Local Kubernetes

- Use kind or minikube.
- Deploy frontend/backend.
- Add local ingress.
- Add PVC for SQLite.
- Confirm catalog save persists after backend pod restart.

### Phase 4: Cloud Kubernetes Dev

- Create `flixbuzz-dev` namespace.
- Install ingress-nginx.
- Install cert-manager.
- Deploy dev frontend/backend/PVC.
- Configure `dev.flixbuzz.com`.
- Run smoke tests.

### Phase 5: Production

- Create `flixbuzz-prod` namespace.
- Configure production PVC.
- Configure production ingress and TLS.
- Deploy from `main` only.
- Require manual approval.
- Run smoke tests.

### Phase 6: Observability and Backup

- Add monitoring.
- Add logging.
- Add SQLite backup CronJob.
- Test restore.

### Phase 7: Future Upgrade

SQLite is fine for this small catalog/admin workflow. If FlixBuzz later needs higher traffic, multiple admin users, order storage, review approval, or analytics, migrate to:

```text
Postgres
Prisma
durable auth/session storage
separate order/review tables
```

## Final Production Flow

```text
Developer pushes to dev
  -> tests run
  -> frontend image builds
  -> backend image builds
  -> images push to GHCR
  -> deploy to flixbuzz-dev
  -> smoke tests run

Merge dev to main
  -> tests run
  -> images build
  -> manual production approval
  -> deploy to flixbuzz-prod
  -> smoke tests run
  -> monitor rollout
```

This gives FlixBuzz a real backend, persistent pricing, and a cloud-native deployment path while keeping the business workflow centered on WhatsApp.
