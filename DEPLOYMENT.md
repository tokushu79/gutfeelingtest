# Deploying GutFeelingTest to your own VPS with gutfeeling.uz

This walks through hosting the whole app (frontend + API) on a single VPS you
control, with your own domain and free HTTPS. Total ongoing cost can be $0
(Oracle Cloud's Always Free ARM VM) or a few dollars/month (Hetzner,
DigitalOcean, etc.) if you'd rather not deal with Oracle's signup process.

---

## 1. Buy the domain

`.uz` has no restriction on who can register it (only sub-zones like
`.com.uz` require Uzbek citizenship). It isn't sold by the big US registrars
(Namecheap/GoDaddy don't carry it), so use one of:

- **EuroDNS**, **INWX**, or **Regery** — international registrars, accept
  cards from anywhere, roughly $30–75/year.
- A local Uzbek registrar (e.g. **aHOST**) — much cheaper (~$3–10/year) but
  may expect local payment methods.

Once purchased, you'll manage DNS records either at the registrar or by
pointing nameservers to a DNS provider you prefer (e.g. Cloudflare's free DNS,
which also gives you a nice dashboard). Either way, the record you need is:

| Type | Name | Value |
|---|---|---|
| A | `@` (gutfeeling.uz) | your VPS's public IPv4 address |
| A | `www` | your VPS's public IPv4 address |

DNS changes can take anywhere from a few minutes to a few hours to propagate.

---

## 2. Get a VPS

Any small Ubuntu 22.04/24.04 server works. Two good options:

- **Oracle Cloud Always Free** — a real ARM VM (2 OCPU / 12GB RAM as of the
  June 2026 free-tier adjustment) with persistent block storage, free
  forever. Signup can be finicky (card verification, occasional "out of
  capacity" errors in some regions), but it costs nothing ongoing.
- **A cheap paid VPS** (Hetzner ~€4/mo, DigitalOcean ~$4–6/mo) — much simpler
  signup, if Oracle is giving you trouble.

This app is tiny (Express + JSON files) — the smallest instance either
provider offers is more than enough.

---

## 3. Initial server setup

SSH into the VPS, then:

```bash
sudo apt update && sudo apt upgrade -y

# Firewall: only allow SSH, HTTP, HTTPS
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# nginx + certbot for HTTPS
sudo apt install -y nginx certbot python3-certbot-nginx

# PM2 to keep the API running and restart it on crash/reboot
sudo npm install -g pm2
```

---

## 4. Get the code onto the server

If your project is in a Git repo (recommended — push it to a private GitHub
repo first), on the server:

```bash
sudo mkdir -p /var/www/gutfeelingtest
sudo chown $USER:$USER /var/www/gutfeelingtest
git clone <your-repo-url> /var/www/gutfeelingtest
cd /var/www/gutfeelingtest
```

If you'd rather not use Git, upload the project folder from your PC with
`scp` or `rsync` instead (exclude `node_modules`):

```bash
rsync -avz --exclude node_modules --exclude dist ./ your-user@your-vps-ip:/var/www/gutfeelingtest/
```

---

## 5. Configure environment variables

```bash
cd /var/www/gutfeelingtest
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:
```
PORT=4000
JWT_SECRET=<generate a long random string — e.g. `openssl rand -hex 32`>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<pick a strong password>
CLIENT_ORIGIN=https://gutfeeling.uz
```

`client/.env` can stay as `VITE_API_BASE_URL=/api` — nginx will serve both
the frontend and API from the same domain, so no cross-origin URL is needed.

---

## 6. Install, seed, and build

```bash
npm install
npm run seed          # creates the subjects/quizzes/questions + admin user
npm run build          # builds server/dist and client/dist
```

---

## 7. Start the API with PM2

```bash
cd server
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup            # then copy/paste and run the command it prints
```

Check it's alive: `curl http://localhost:4000/api/health`

---

## 8. Configure nginx

Copy the provided template and point it at your build output:

```bash
sudo cp /var/www/gutfeelingtest/deploy/nginx.conf.example /etc/nginx/sites-available/gutfeeling.uz
sudo ln -s /etc/nginx/sites-available/gutfeeling.uz /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Then get a free TLS certificate (auto-renews every 90 days):

```bash
sudo certbot --nginx -d gutfeeling.uz -d www.gutfeeling.uz
```

Visit `https://gutfeeling.uz` — it should load the site.

---

## 9. Updating the site later

```bash
cd /var/www/gutfeelingtest
git pull                      # or re-upload via rsync
npm install
npm run build
pm2 restart gutfeelingtest-api
```

Your `server/data/*.json` files are untouched by this process — content and
leaderboards persist across updates as long as you don't delete that folder.

---

## 10. Back up your data

Since scores/leaderboards live in `server/data/*.json` on this one VPS, it's
worth periodically copying that folder somewhere else:

```bash
tar -czf backup-$(date +%F).tar.gz server/data
scp your-user@your-vps-ip:/var/www/gutfeelingtest/backup-*.tar.gz ./backups/
```

Consider putting this on a weekly cron job.
