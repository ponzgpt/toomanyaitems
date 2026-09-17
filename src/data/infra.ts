/**
 * Compute and network are not a tenth and eleventh job. The 9-slot grid is
 * "what software do you run"; this is "on what, and connected how" — one
 * choice each, sitting underneath the grid like a workbench under the items
 * on it. Keeping the grid at a clean 3x3 is what makes it shareable as a
 * square image; this stays a footer strip instead of growing the grid.
 */

export interface Infra {
  id: string;
  name: string;
  si: string | null;
  note: string;
  url: string;
}

export const COMPUTE: Infra[] = [
  { id: 'laptop',       name: 'This laptop',    si: null,             note: 'Whatever you already have open.',        url: '' },
  { id: 'raspberrypi',  name: 'Raspberry Pi',   si: 'raspberrypi',    note: 'Cheapest always-on box.',                 url: 'https://raspberrypi.com' },
  { id: 'synology',     name: 'Synology NAS',   si: 'synology',       note: 'Storage first, Docker second.',           url: 'https://synology.com' },
  { id: 'unraid',       name: 'Unraid',         si: 'unraid',         note: 'Home server OS, easy VMs and containers.', url: 'https://unraid.net' },
  { id: 'truenas',      name: 'TrueNAS',        si: 'truenas',        note: 'ZFS storage, free and open source.',      url: 'https://truenas.com' },
  { id: 'proxmox',      name: 'Proxmox',        si: 'proxmox',        note: 'Free hypervisor for a homelab box.',      url: 'https://proxmox.com' },
  { id: 'hetzner',      name: 'Hetzner',        si: 'hetzner',        note: 'Cheapest real VPS in the EU.',            url: 'https://hetzner.com' },
  { id: 'hostinger',    name: 'Hostinger VPS',  si: null,             note: 'VPS with a one-click AI panel.',          url: 'https://hostinger.com/vps-hosting' },
  { id: 'digitalocean', name: 'DigitalOcean',   si: 'digitalocean',   note: 'Simple VPS, predictable pricing.',        url: 'https://digitalocean.com' },
  { id: 'vultr',        name: 'Vultr',          si: 'vultr',          note: 'Global regions, GPU instances.',          url: 'https://vultr.com' },
  { id: 'runpod',       name: 'RunPod',         si: null,             note: 'Rent a real GPU by the hour.',            url: 'https://runpod.io' },
];

export const NETWORK: Infra[] = [
  { id: 'internet',        name: 'Just the internet', si: null,          note: 'Public endpoints, nothing meshed.',        url: '' },
  { id: 'tailscale',       name: 'Tailscale',         si: 'tailscale',   note: 'Zero-config mesh VPN, the default.',       url: 'https://tailscale.com' },
  { id: 'headscale',       name: 'Headscale',         si: null,          note: 'Self-hosted, open-source Tailscale.',      url: 'https://headscale.net' },
  { id: 'netbird',         name: 'Netbird',           si: null,          note: 'Open-source WireGuard mesh.',              url: 'https://netbird.io' },
  { id: 'zerotier',        name: 'ZeroTier',          si: 'zerotier',    note: 'Software-defined LAN, older and stable.',  url: 'https://zerotier.com' },
  { id: 'wireguard',       name: 'WireGuard',         si: 'wireguard',   note: 'The protocol most of the above wrap.',     url: 'https://wireguard.com' },
  { id: 'cloudflaretunnel', name: 'Cloudflare Tunnel', si: 'cloudflare', note: 'Expose a service with no open port.',      url: 'https://cloudflare.com/products/tunnel' },
];

export const COMPUTE_BY_ID = new Map(COMPUTE.map((c) => [c.id, c]));
export const NETWORK_BY_ID = new Map(NETWORK.map((n) => [n.id, n]));
