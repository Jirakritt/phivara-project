# Deploy Guide — PHIVARA (VPS ผ่าน GitHub)

Payload CMS 3 + Next.js 15, Postgres, media เก็บ local disk. Guide นี้สมมติว่า deploy ไปยัง VPS ของตัวเอง (Ubuntu 22.04) และใช้ GitHub Actions push-to-deploy อัตโนมัติทุกครั้งที่ push เข้า `main`.

---

## ภาพรวม

```
git push origin main
      │
      ▼
GitHub Actions (.github/workflows/deploy.yml)
      │  SSH เข้า VPS
      ▼
VPS: git pull → npm ci → npm run build → npm run migrate → pm2 reload
```

---

## Part 1 — เตรียม VPS (ทำครั้งเดียว)

### 1.1 ติดตั้งพื้นฐาน

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Postgres
sudo apt-get install -y postgresql postgresql-contrib

# pm2 (process manager — คุม node process ให้รันตลอด + restart อัตโนมัติ)
sudo npm install -g pm2

# nginx (reverse proxy)
sudo apt-get install -y nginx
```

### 1.2 สร้าง database + user

```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE phivara_cms;
CREATE USER phivara WITH ENCRYPTED PASSWORD 'ตั้งรหัสผ่านที่แข็งแรงเอง';
GRANT ALL PRIVILEGES ON DATABASE phivara_cms TO phivara;
\q
```

### 1.3 สร้าง deploy key ให้ VPS ดึงโค้ดจาก GitHub ได้

```bash
ssh-keygen -t ed25519 -C "phivara-vps-deploy" -f ~/.ssh/phivara_deploy
cat ~/.ssh/phivara_deploy.pub
```
เอา public key ไปใส่ใน GitHub repo → **Settings → Deploy keys → Add deploy key** (ไม่ต้องติ๊ก write access)

---

## Part 2 — Deploy ครั้งแรก (manual)

```bash
# clone
git clone git@github.com:Jirakritt/phivara-project.git /var/www/phivara
cd /var/www/phivara

# .env — สร้างเองบน server, ห้าม commit เข้า git
nano .env
```

`.env` บน production:
```
DATABASE_URI=postgresql://phivara:<รหัสผ่านที่ตั้งไว้>@localhost:5432/phivara_cms
PAYLOAD_SECRET=<generate ใหม่ — อย่าใช้ค่า dev เดิม>
PAYLOAD_CONFIG_PATH=cms/payload.config.ts
NEXT_PUBLIC_SERVER_URL=https://phivara.com   # โดเมนจริง
```
generate secret ใหม่: `openssl rand -base64 32`

```bash
npm ci
npm run build
npm run migrate      # สร้าง schema จริงใน production DB จาก cms/migrations
npm run seed         # ถ้าต้องการ seed ข้อมูลตั้งต้น — ข้ามได้ถ้า DB มีข้อมูลแล้ว

pm2 start npm --name phivara -- start
pm2 save
pm2 startup          # ทำตามคำสั่งที่มันบอกให้รัน เพื่อให้ pm2 auto-start ตอน server reboot
```

### nginx reverse proxy + SSL

```nginx
# /etc/nginx/sites-available/phivara
server {
    listen 80;
    server_name phivara.com www.phivara.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/phivara /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d phivara.com -d www.phivara.com
```

เช็คว่าเว็บขึ้นที่ `https://phivara.com` แล้ว → Part 2 เสร็จ

---

## Part 3 — ตั้ง auto-deploy ผ่าน GitHub Actions

### 3.1 สร้าง deploy user ให้ Action ใช้ SSH เข้ามา (แยกจาก deploy key ข้อ 1.3)

```bash
ssh-keygen -t ed25519 -C "github-actions-phivara" -f ~/.ssh/gh_actions_deploy
cat ~/.ssh/gh_actions_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/gh_actions_deploy          # เก็บ private key นี้ไว้ — เอาไปใส่ GitHub secret ข้อ 3.2
```

### 3.2 ใส่ GitHub Secrets

Repo → **Settings → Secrets and variables → Actions** → New repository secret:

| Secret name | ค่า |
|---|---|
| `SSH_HOST` | IP หรือโดเมนของ VPS |
| `SSH_USER` | user ที่ใช้ SSH (เช่น `deploy` หรือ `root`) |
| `SSH_PRIVATE_KEY` | เนื้อหาทั้งหมดของ `~/.ssh/gh_actions_deploy` (private key จากข้อ 3.1) |
| `APP_PATH` | `/var/www/phivara` |

### 3.3 สร้างไฟล์ workflow

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: SSH deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ${{ secrets.APP_PATH }}
            git pull origin main
            npm ci
            npm run build
            npm run migrate
            pm2 reload phivara
```

Commit + push ไฟล์นี้เข้า `main` — ตั้งแต่ครั้งถัดไปที่ push โค้ด, GitHub จะ SSH เข้า VPS แล้ว build+migrate+restart ให้อัตโนมัติ

---

## เช็คก่อนใช้งานจริง

- [ ] `.env` บน VPS ใช้ค่า production จริงทั้งหมด (ไม่ใช่ localhost / dev secret)
- [ ] `cms/migrations/` ถูก commit เข้า git แล้ว (ดูข้อความก่อนหน้า)
- [ ] VPS มี disk พอสำหรับรูปที่ upload ผ่าน CMS ไปเรื่อยๆ (`media/` เก็บ local disk — ไม่ใช่ ephemeral เพราะเป็น VPS จริง แต่ควรมี backup/monitoring พื้นที่ disk ไว้ด้วย)
- [ ] ลบ/เปลี่ยนรหัส test accounts (`admin@admin.com`, `pt1@phyathai.com`, `pt2@phyathai.com`) ก่อนเปิดใช้งานจริง
- [ ] ตั้ง DB backup (เช่น `pg_dump` ผ่าน cron) — guide นี้ยังไม่ครอบคลุมส่วนนี้

---

## ทางเลือกอื่น (ถ้าไม่อยากใช้ GitHub Actions)

ถ้าไม่อยากให้ GitHub มี SSH key เข้า server ได้ ใช้วิธีนี้แทนได้:
- ตั้ง cron บน VPS ให้ `git pull` เองทุก N นาที แล้ว build ถ้ามีการเปลี่ยนแปลง หรือ
- ใช้ GitHub webhook ยิงมาที่ endpoint เล็กๆ บน VPS (เช่น `webhook` package) แทนที่จะให้ Action SSH เข้ามา

ข้อดีคือ private key ไม่ต้องออกจาก VPS เลย แต่ setup ซับซ้อนกว่า sample ข้างบนเล็กน้อย
