# Deployment

## Target

- URL canónica: `https://toomanyaitems.technoir.cloud`
- Mirror (GitHub Pages, auto-deployed by `.github/workflows/pages.yml`): `https://ponzgpt.github.io/toomanyaitems/`
- Runtime: Vite static build + `nginx:1.27-alpine`
- Edge: Hostinger VPS → Traefik/Dokploy → container port 80

Same shape as `javier-ponz-site` and `memento-mori` — one Dockerfile, one nginx.conf, Dokploy
builds from `main` and routes by domain.

## Local verification

```bash
npm ci
npm run check   # tsc -b && node --test
npm run build
```

## Dokploy / Swarm

- Branch: `main`
- Build: Dockerfile (sets `BASE_PATH=/` so the app serves from the domain root, not
  `/toomanyaitems/` — GitHub Pages keeps the subpath build via its own workflow)
- Container port: `80`
- Domain: `toomanyaitems.technoir.cloud`
- HTTPS: Let's Encrypt
- Health path: `/healthz`

First-time setup in the Dokploy dashboard: New Application → Git → point at
`https://github.com/ponzgpt/toomanyaitems`, branch `main`, build type Dockerfile, add the
domain, done — Dokploy handles the certificate and the Traefik route. No secrets live in this
repo; the git→build→deploy wiring is entirely Dokploy-side, same as the other two.

## Rollback

Conservar la imagen o deployment anterior en Dokploy. Si el nuevo servicio falla healthcheck,
volver a la revisión anterior.

## Verificación pública

```bash
curl -fsS https://toomanyaitems.technoir.cloud/healthz
curl -fsSI https://toomanyaitems.technoir.cloud/
```
