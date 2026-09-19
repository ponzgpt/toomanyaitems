# Deployment

- **Production:** https://toomanyaitems.technoir.cloud: Hostinger VPS (`ssh hoid`), Swarm service `toomanyaitems` on `dokploy-network`, Traefik route `/etc/dokploy/traefik/dynamic/toomanyaitems.yml`, Let's Encrypt.
- **Mirror:** https://ponzgpt.github.io/toomanyaitems/, rebuilt on every push to `main` by `.github/workflows/pages.yml` (subpath build).

## Deploy

```bash
./scripts/deploy.sh
```

Refuses a dirty tree, runs `npm run check`, builds `toomanyaitems:<sha>` on the VPS (the Dockerfile sets `BASE_PATH=/`, checks and builds), rolls the service with a `/healthz` health check and waits until `https://toomanyaitems.technoir.cloud/healthz` answers.

## Rollback

```bash
ssh hoid docker service rollback toomanyaitems
```
