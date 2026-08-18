# Deploy Guide — PHIVARA (VPS ผ่าน GitHub)

Payload CMS 3 + Next.js 15, Postgres, media เก็บ local disk, process คุมด้วย pm2 (fork mode). Guide นี้แบ่งเป็น 4 ส่วน: (1) เตรียม VPS ครั้งแรก, (2) deploy ครั้งแรกสุด (DB ว่าง), (2B) **deploy อัปเดตตามปกติ** (DB มีข้อมูลจริงอยู่แล้ว — ใช้บ่อยที่สุด), (3) auto-deploy ผ่าน GitHub Actions (ยังไม่ได้ตั้งจริง, เป็นแผนสำรอง), (4) ปัญหาที่เคยเจอจริงและวิธีแก้

Runbook นี้ปรับปรุงจากการ deploy จริงรอบ "เพิ่มภาษา" (2026-08-18) ซึ่งเจอปัญหาหลายจุดที่ guide เดิมไม่ครอบคลุม — ทุกจุดอธิบายไว้ใน Part 4

---

## ภาพรวม

```
git push origin master
      │
      ▼ (manual, ผ่าน SSH — ดู Part 2B)
VPS: backup DB → git pull → npm ci → schema check → migrate → backfill → build → pm2 restart → verify
```

GitHub Actions auto-deploy (Part 3) ยังไม่ได้ตั้งค่าจริง — ตอนนี้ deploy ทุกครั้งทำแบบ manual ผ่าน SSH เพราะขั้นตอน migrate จำเป็นต้องมีคนตรวจสอบก่อน/หลังทุกครั้ง (ดูเหตุผลใน Part 4)

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

### 1.4 Firewall — เปิดเฉพาะที่จำเป็น, ห้ามเปิด 5432 ออกสู่อินเทอร์เน็ต

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**อย่าเปิดพอร์ต 5432 (Postgres) ให้ "Anywhere" เด็ดขาด** — DB มีข้อมูลจริงของลูกค้า (Leads) เปิดตรงๆ ออกอินเทอร์เน็ตเสี่ยงเกินไป ถ้าต้องต่อ DB client จากเครื่องตัวเอง ใช้ **SSH tunnel** แทน (วิธีทำอยู่ใน Part 4)

---

## Part 2 — Deploy ครั้งแรกสุด (DB ว่างเปล่า, ไม่เคยมีข้อมูล)

ใช้ส่วนนี้เฉพาะตอนตั้ง production ใหม่จริงๆ ที่ DB ยังไม่มีอะไรเลย ถ้า DB มีข้อมูลอยู่แล้ว (กรณีปกติหลังจากนี้) ให้ข้ามไป **Part 2B**

```bash
# clone
git clone git@github.com:Jirakritt/phivara-project.git /var/www/phivara
cd /var/www/phivara

# .env — สร้างเองบน server, ห้าม commit เข้า git
nano .env
```

`.env` บน production ต้องมีครบ 6 ตัวนี้เสมอ (เช็คตรงกับโค้ดที่ import `process.env.*` จริง — ถ้าเพิ่มตัวแปรใหม่ในอนาคต ให้ `grep -rn "process.env\." src/ cms/` เทียบด้วย):
```
DATABASE_URI=postgresql://phivara:<รหัสผ่านที่ตั้งไว้>@localhost:5432/phivara_cms
PAYLOAD_SECRET=<generate ใหม่ — อย่าใช้ค่า dev เดิม>
PAYLOAD_CONFIG_PATH=cms/payload.config.ts
NEXT_PUBLIC_SERVER_URL=https://www.phivara.site   # โดเมนจริง

# Analytics — ไม่บังคับ เว้นว่างไว้ได้ถ้ายังไม่มี ID จริง (เว็บทำงานปกติ แค่ไม่ยิง tracking)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```
generate secret ใหม่: `openssl rand -base64 32`

**สำคัญ**: `NEXT_PUBLIC_*` ทุกตัวต้องมีค่าอยู่ **ก่อน** รัน `npm run build` เท่านั้น เพราะถูกฝังเข้า client bundle ตอน build — เพิ่มค่าเข้า `.env` หลัง build ไปแล้วจะไม่มีผลจนกว่าจะ build ใหม่

```bash
npm ci
npm run build
npm run migrate      # สร้าง schema จริงใน production DB จาก cms/migrations (DB ว่าง รันได้ตรงๆ ไม่มีปัญหา)
npm run seed         # ถ้าต้องการ seed ข้อมูลตั้งต้น — ข้ามได้ถ้าจะกรอกเองผ่าน admin

pm2 start npm --name phivara -- start
pm2 save
pm2 startup          # ทำตามคำสั่งที่มันบอกให้รัน เพื่อให้ pm2 auto-start ตอน server reboot
```

### nginx reverse proxy + SSL

```nginx
# /etc/nginx/sites-available/phivara
server {
    listen 80;
    server_name phivara.site www.phivara.site;

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
sudo certbot --nginx -d phivara.site -d www.phivara.site
```

เช็คว่าเว็บขึ้นที่ `https://www.phivara.site` แล้ว → Part 2 เสร็จ ตั้งแต่นี้ไปทุก deploy ถัดไปให้ใช้ **Part 2B**

---

## Part 2B — Deploy อัปเดตตามปกติ (DB มีข้อมูลจริงอยู่แล้ว) ★ ใช้บ่อยที่สุด

ทำตามลำดับนี้ทุกครั้ง อย่าข้ามขั้นตอนไหน โดยเฉพาะ backup กับ schema check — ทั้งสองอย่างนี้คือสิ่งที่ช่วยจับปัญหาได้ก่อนพังจริง

### ขั้นที่ 1 — Local: ให้แน่ใจว่าโค้ด push ขึ้น git ครบแล้ว

```bash
npx tsc --noEmit        # ต้องไม่มี output ใดๆ (เงียบ = ผ่าน)
git status               # ต้อง clean หรือมีแต่สิ่งที่ตั้งใจจะ commit จริงๆ
```

เช็ค `git status` ให้ดี — ไฟล์ที่ควรอยู่ใน commit เสมอ: `cms/migrations/*` (ทุกไฟล์ที่ generate ใหม่), `cms/scripts/*` (backfill scripts), ไฟล์ src/cms ที่แก้จริง ไฟล์ที่**ไม่ควร**หลุดเข้า commit: `scratch_*`, ไฟล์ทดสอบชั่วคราวอื่นๆ, `tsconfig.tsbuildinfo` (ถ้าเห็นว่า track อยู่ ให้ `git rm --cached tsconfig.tsbuildinfo` ครั้งเดียวพอ เพราะอยู่ใน `.gitignore` แล้ว)

```bash
git add -A
git commit -m "..."
git push origin master
```

### ขั้นที่ 2 — Production: เตรียมตัวก่อนแตะอะไร

```bash
cd /var/www/phivara

# tag HEAD ปัจจุบันไว้เป็นจุด rollback ทุกครั้งก่อน deploy
git log --oneline -3
git tag pre-deploy-$(date +%Y%m%d-%H%M)

# เช็ค env vars ครบไหม (ดูรายการใน Part 2)
cat .env

# backup DB — ทำทุกครั้ง ไม่มีข้อยกเว้น
pg_dump "$DATABASE_URI" -F c -f phivara_prod_backup_$(date +%Y%m%d_%H%M%S).dump
pg_restore --list phivara_prod_backup_*.dump | head -20   # เช็คว่าไฟล์อ่านได้จริง ไม่ corrupt
```

แนะนำ copy ไฟล์ backup ออกจาก server ไปเก็บที่อื่นด้วย (download ลงเครื่อง หรือ upload cloud storage) อย่าพึ่ง disk เดียวกับ server

### ขั้นที่ 3 — ดู diff ก่อน pull จริง

```bash
git fetch origin
git diff HEAD..origin/master --stat
```
เช็คว่ารายชื่อไฟล์ตรงกับที่คาดไว้ ไม่มีอะไรแปลกปลอม โดยเฉพาะถ้า diff มี `cms/migrations/*.ts` ใหม่ ให้เปิดอ่านเนื้อหาไฟล์นั้นก่อน (ทาง local หรือ `cat` บน server หลัง pull) ว่าเป็น `ALTER TABLE ... ADD COLUMN` แบบ additive เท่านั้น ไม่มี `DROP`/เปลี่ยน type ข้อมูลเดิม — ถ้าเจอ `DROP`/`ALTER ... TYPE` ให้หยุดและตรวจสอบให้ละเอียดก่อน ห้ามรันต่อ

### ขั้นที่ 4 — Pull + install

```bash
git pull origin master
npm ci
```

### ขั้นที่ 5 — เช็ค schema *ก่อน* migrate (สำคัญมาก — อย่าข้าม)

ถ้า migration ใหม่แก้ตารางไหน ให้ดูโครงสร้างตารางนั้นก่อน เก็บผลไว้เทียบหลัง migrate ตัวอย่าง (ปรับชื่อ table/column ตาม migration จริงที่จะรัน):
```bash
psql "$DATABASE_URI" -c "\d ชื่อตารางที่จะถูกแก้"
```

### ขั้นที่ 6 — Migrate

```bash
npm run migrate
```

**ถ้าเจอ error ประเภท `relation "..." already exists`** — อย่าตกใจและอย่ารันซ้ำทันที นี่คือปัญหาที่เจอบ่อยเวลา DB เคยถูกสร้าง schema ผ่าน Payload dev-mode push มาก่อน (ทำให้ตารางมีอยู่จริงแล้วแต่ `payload_migrations` ไม่มี record) วิธีวินิจฉัยและแก้ไขแบบละเอียดอยู่ใน **Part 4 → "Migration ชนกับ schema ที่มีอยู่แล้ว"**

### ขั้นที่ 7 — เช็ค schema *หลัง* migrate

รันคำสั่งเดิมจากขั้นที่ 5 อีกครั้ง เทียบว่าตรงกับที่ migration ควรสร้าง/แก้จริง (column ใหม่ครบ, index/constraint ครบ)

### ขั้นที่ 8 — รัน backfill script (ถ้ามี)

ถ้า migration รอบนี้มาพร้อม backfill script (เช่น field ใหม่ที่ต้อง populate ค่าจาก field เก่า) รันตอนนี้:
```bash
npx tsx cms/scripts/ชื่อสคริปต์.ts
```
เช็คจำนวน record ที่ update ให้ตรงกับจำนวนจริงใน DB (`SELECT count(*) FROM ตาราง;`)

### ขั้นที่ 9 — Build + restart

```bash
npm run build              # ต้องจบด้วย "Compiled successfully" ไม่มี error สีแดง
pm2 list                   # เช็คชื่อ process (ปกติคือ "phivara")
pm2 restart phivara
pm2 logs phivara --lines 50 --nostream    # เช็ค log ทันทีหลัง restart ว่า "Ready in ...ms" ไม่มี error ตอน start
pm2 status
```

### ขั้นที่ 10 — Verify

```bash
curl -I http://localhost:3000          # เช็คในเครื่อง server เอง
curl -I https://www.phivara.site       # เช็คผ่าน nginx + โดเมนจริง
```

ทั้งสองควรได้ status ที่คาดไว้ (เช่น `307` redirect ไป `/th` ถ้าเข้า path ที่ไม่มี locale prefix) แล้วเปิดเบราว์เซอร์จริงเช็คหน้าเว็บสำคัญๆ อย่างน้อย: หน้าแรกในภาษาหลัก, หน้าที่เพิ่งแก้/เพิ่ม feature รอบนี้, หน้า 404 ในภาษาที่ไม่ใช่ th (`/en/xxx-ไม่มีจริง` และ URL ที่ผิด pattern ไปเลยเช่น `/en/xyz/xxx` — สองแบบนี้ใช้ไฟล์ 404 คนละตัวกัน ต้องเช็คทั้งคู่ ดู Part 4), เปิด VIP modal สักครั้ง

ปล่อย log ไว้ดูสัก 1-2 นาทีหลัง restart เผื่อมี error ใหม่ๆ โผล่มา (แยกจาก noise ปกติแบบ `Failed to find Server Action` ที่เกิดจาก browser tab เก่าที่ค้าง bundle เดิมอยู่ — อันนั้นหายเองเมื่อ user refresh)

---

## Part 3 — ตั้ง auto-deploy ผ่าน GitHub Actions (แผนสำรอง, ยังไม่ได้ตั้งจริง)

⚠️ **คำเตือนก่อนตั้งจริง**: workflow ตัวอย่างด้านล่างรัน `npm run migrate` อัตโนมัติทุกครั้งที่ push โดยไม่มีคนตรวจสอบก่อน — จากประสบการณ์ deploy จริงที่เจอ (Part 4) migrate อาจ fail แบบที่ต้อง diagnose ด้วยมือ (schema ชนกับของเดิม) การ automate ส่วนนี้เต็มรูปแบบมีความเสี่ยง **แนะนำให้ auto-deploy แค่ build+restart อัตโนมัติ ส่วน migrate ให้ยังคงรันด้วยมือผ่าน Part 2B เสมอ** จนกว่าจะมี staging environment แยกไว้ซ้อม migration ก่อนทุกครั้ง

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

### 3.3 สร้างไฟล์ workflow (เวอร์ชันปลอดภัย — ไม่ auto-migrate)

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to VPS

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: SSH deploy (build + restart only — migrate ทำด้วยมือผ่าน Part 2B)
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ${{ secrets.APP_PATH }}
            git pull origin master
            npm ci
            npm run build
            pm2 restart phivara
```

ถ้า commit รอบไหนมี migration ใหม่ ให้ SSH เข้าไปรัน `npm run migrate` (พร้อม backup + schema check ตาม Part 2B) **ด้วยมือก่อน** ค่อย push เพื่อให้ Action build+restart ตาม

---

## Part 4 — ปัญหาที่เคยเจอจริง และวิธีแก้

### 4.1 Migration ชนกับ schema ที่มีอยู่แล้ว (`relation "..." already exists`)

**อาการ**: `npm run migrate` ขึ้น prompt เตือนก่อนว่า *"It looks like you've run Payload in dev mode, meaning you've dynamically pushed changes to your database. If you'd like to run migrations, data loss will occur. Would you like to proceed?"* แล้วพอตอบ yes ก็ error ว่า `relation "ชื่อตาราง" already exists`

**สาเหตุ**: DB นี้เคยถูกสร้าง/แก้ schema ผ่าน Payload dev-mode auto-push (ตอนรัน `npm run dev` มันจะ sync schema อัตโนมัติ) มาก่อนที่จะมีการใช้ migration file อย่างเป็นทางการ ทำให้ตาราง/column นั้นมีอยู่จริงใน DB แล้ว แต่ตาราง `payload_migrations` (ตัวบันทึกว่า migration ไหนรันไปแล้ว) ไม่มี record ของ migration file ที่ตรงกับมัน — Payload จะมี row พิเศษชื่อ `dev` (column `batch = -1`) บันทึกไว้ว่าช่วงเวลานั้นเคยมีการ push เกิดขึ้น แต่ไม่ได้ mark migration file ที่ชื่อตรงกันว่า applied

**วิธีวินิจฉัย (ห้ามเดา ต้องเช็คจริงทุกครั้ง)**:
```bash
# 1. ดู migration ที่บันทึกว่า applied แล้ว
psql "$DATABASE_URI" -c "SELECT * FROM payload_migrations ORDER BY id;"

# 2. เช็คว่าตาราง/ข้อมูลที่ error พูดถึง ยังอยู่ครบ ไม่ได้หายไป
psql "$DATABASE_URI" -c "SELECT count(*) FROM ชื่อตารางที่ error;"

# 3. เช็คว่าเว็บเดิม (ที่ยังไม่ restart) ยังตอบสนองปกติ ไม่กระทบ
curl -I http://localhost:3000

# 4. เปิดไฟล์ migration ที่ fail (เช่น cms/migrations/xxxxx.ts) อ่าน up() ทั้งหมด
#    แล้วเทียบทีละ column/table กับโครงสร้างจริงใน DB
psql "$DATABASE_URI" -c "\d ชื่อตารางในไฟล์ migration"
```

ถ้าโครงสร้างตรงกัน 100% (ทุก column, index, constraint) และมีข้อมูลอยู่ครบ (ไม่ใช่ตารางว่างเปล่าผิดปกติ) — **แปลว่าไม่มีข้อมูลสูญหาย เป็นแค่ bookkeeping ไม่ตรงกัน** วิธีแก้คือ mark migration นั้นว่า applied โดยไม่ต้องรัน SQL ซ้ำ:

```bash
psql "$DATABASE_URI" -c "INSERT INTO payload_migrations (name, batch, updated_at, created_at) VALUES ('ชื่อ_migration_ที่_fail', <batch_ถัดไปจากที่มีอยู่>, now(), now());"
```

แล้วรัน `npm run migrate` ใหม่ — รอบนี้จะ skip migration ที่ mark ไปแล้ว และรันแค่ migration ใหม่จริงๆ ที่ยังไม่เคย apply

**ถ้าโครงสร้างไม่ตรงกัน** (มี column ขาด/เกิน จากที่ migration ควรสร้าง) — **ห้าม** mark เป็น applied เด็ดขาด ต้อง restore จาก backup แล้วพิจารณาเขียน migration แก้ไขเฉพาะส่วนต่างที่ขาดแทน

### 4.2 vim swap file ค้าง ทำให้แก้ `.env` ไม่ได้

**อาการ**: เปิด `vi .env` แล้วเจอ `E325: ATTENTION — Found a swap file`

**สาเหตุที่พบจริง**: เปิด `vi .env` แล้วกด Ctrl+Z (suspend) แทนการ `:wq`/`:q` ออกให้ถูกวิธี หลายรอบติดกัน ทำให้มี process ค้างสถานะ `Tl` (stopped) หลายตัวพร้อมกัน แต่ละตัวสร้าง swap file คนละนามสกุล (`.swp`, `.swo`, `.swn`, ...)

**วิธีแก้**:
```bash
# หา process vi ที่ค้างอยู่ทั้งหมด
ps aux | grep '[v]i .env'

# เช็คให้ชัวร์ว่า status เป็น T (stopped) ไม่ใช่ R (running) ก่อน kill
kill -9 <PID ทั้งหมดที่เจอ>

# ลบ swap file ที่เหลือค้าง
rm -f /var/www/phivara/.env.sw?

# ดูค่าแบบปลอดภัย ไม่สร้าง swap file ซ้ำ
cat .env
```
ถ้าแค่จะ "ดู" ค่าใน `.env` ใช้ `cat`/`less` แทน `vi` ไปเลยจะปลอดภัยกว่า ไม่มีความเสี่ยงเรื่อง swap file ตั้งแต่แรก

### 4.3 ต่อ DB client จากเครื่องตัวเองไม่ได้ / ไม่อยากเปิดพอร์ต 5432 ออกอินเทอร์เน็ต

**อย่าเปิด `ufw allow 5432` แบบ "Anywhere"** เพราะ DB มีข้อมูลจริง ให้ใช้ SSH tunnel แทน:

```bash
# รันบนเครื่อง local (ไม่ใช่ server)
ssh -L 5432:localhost:5432 root@<IP_SERVER>
```
เปิด terminal นี้ค้างไว้ตลอดเวลาที่ใช้ DB client แล้วตั้งค่าใน DB client:
- Host: `localhost`
- Port: `5432` (ใช้พอร์ตอื่นฝั่ง local ได้ถ้าเครื่องมี Postgres local ชนกันอยู่แล้ว เช่น `ssh -L 5433:localhost:5432 ...`)
- Username/Password/Database เหมือนเดิม

สะดวกขึ้นได้ด้วยการเพิ่ม entry ใน `~/.ssh/config`:
```
Host phivara-tunnel
    HostName <IP_SERVER>
    User root
    LocalForward 5432 localhost:5432
```
แล้วพิมพ์แค่ `ssh phivara-tunnel`

ถ้าเคยเปิด `ufw allow from <IP> to any port 5432` ไว้ชั่วคราวตอนแก้ปัญหาเฉพาะหน้า อย่าลืมปิดทีหลัง:
```bash
sudo ufw status numbered
sudo ufw delete <เลข rule>
```

### 4.4 หน้า 404 มี 2 ไฟล์คนละตัว ต้องเช็คทั้งคู่เวลา verify

- `src/app/[locale]/not-found.tsx` — ใช้เมื่อ URL ตรงกับ route ที่มีจริง แต่ข้อมูลไม่มี (เช่น `/en/doctor/สลัก-ไม่มีจริง` — route `[locale]/(public)/doctor/[slug]` match แต่โค้ดเรียก `notFound()` เอง)
- `src/app/global-not-found.tsx` — ใช้เมื่อ URL ไม่ตรงกับ route pattern ใดๆ เลย (เช่น `/en/xyz/xxx` ที่ไม่มี directory `xyz` อยู่จริง)

ทั้งสองไฟล์อ่าน locale จาก header `x-phivara-locale` ที่ `src/middleware.ts` ตั้งไว้ (เช็คจาก segment แรกของ path ว่าเป็น locale code ที่ถูกต้องไหม) — ถ้าแก้ไฟล์ใดไฟล์หนึ่งเรื่อง locale แล้วลืมอีกไฟล์ จะเจออาการ "404 บาง pattern แปลถูก บาง pattern ไม่แปล" แบบที่เคยเกิดขึ้นจริง ต้องทดสอบทั้ง 2 รูปแบบ URL คู่กันเสมอ

### 4.5 `tsc` ใช้ไม่ได้ตรงๆ

`npx tsc --noEmit` ไม่ใช่ `tsc --noEmit` เฉยๆ — `typescript` เป็นแค่ devDependency ในโปรเจกต์ ไม่ได้ติดตั้งแบบ global

### 4.6 `tsconfig.tsbuildinfo` โผล่ใน `git status` ทั้งที่อยู่ใน `.gitignore`

เกิดจากไฟล์นี้เคย commit เข้า git ไปแล้วก่อนที่จะเพิ่ม `.gitignore` rule — `.gitignore` กัน "ไฟล์ใหม่" เท่านั้น ไม่ทำให้ไฟล์ที่ track อยู่แล้วเลิก track อัตโนมัติ แก้ครั้งเดียวจบด้วย `git rm --cached tsconfig.tsbuildinfo` แล้ว commit

---

## เช็คก่อนใช้งานจริง

- [ ] `.env` บน VPS ใช้ค่า production จริงทั้งหมด (ไม่ใช่ localhost / dev secret) — เช็คครบ 6 ตัวแปรตาม Part 2
- [ ] `cms/migrations/` ทุกไฟล์ที่ generate ในเครื่อง dev ถูก commit เข้า git แล้วก่อน deploy ทุกครั้ง (`git status` เช็คอย่าให้มี migration ตกหล่น)
- [ ] Firewall ไม่เปิดพอร์ต 5432 ให้ "Anywhere" — ใช้ SSH tunnel เท่านั้น (Part 4.3)
- [ ] VPS มี disk พอสำหรับรูปที่ upload ผ่าน CMS ไปเรื่อยๆ (`media/` เก็บ local disk) — ควรมี monitoring พื้นที่ disk และแผนย้ายไป cloud storage (S3-compatible) ในอนาคต
- [ ] ลบ/เปลี่ยนรหัส test accounts ก่อนเปิดใช้งานจริง
- [ ] ตั้ง DB backup อัตโนมัติ (เช่น `pg_dump` ผ่าน cron รายวัน) — ตอนนี้ backup ยังทำมือก่อน deploy แต่ละครั้งเท่านั้น ไม่มี schedule ประจำ
- [ ] เนื้อหา CMS ภาษา ja/zh/vi/ar (bio หมอ, บทความ, โปรแกรม, สาขา) ยังไม่ได้กรอก — ก่อนเปิดภาษาเหล่านี้ publiclyLive ควรมีเนื้อหาจริงก่อน ไม่งั้นหน้า listing จะว่างเปล่า (ตาม strict per-locale filtering)
- [ ] หน้า `/privacy-policy` ยังมี placeholder ทางกฎหมายที่ไม่ได้กรอกจริง ([ชื่อนิติบุคคล], [ที่อยู่], [DPO contact] ฯลฯ) — ควรให้ที่ปรึกษากฎหมายตรวจก่อนเก็บข้อมูล lead จริงจังต่อเนื่อง
- [ ] `NEXT_PUBLIC_GA4_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` ยังว่าง — เติมถ้าต้องการเก็บ analytics จริง (ต้องเติมก่อน build เสมอ)

---

## ทางเลือกอื่น (ถ้าไม่อยากใช้ GitHub Actions)

ถ้าไม่อยากให้ GitHub มี SSH key เข้า server ได้ ใช้วิธีนี้แทนได้:
- ตั้ง cron บน VPS ให้ `git pull` เองทุก N นาที แล้ว build ถ้ามีการเปลี่ยนแปลง (ไม่รวม migrate — ยังควรทำด้วยมือ) หรือ
- ใช้ GitHub webhook ยิงมาที่ endpoint เล็กๆ บน VPS (เช่น `webhook` package) แทนที่จะให้ Action SSH เข้ามา

ข้อดีคือ private key ไม่ต้องออกจาก VPS เลย แต่ setup ซับซ้อนกว่า sample ข้างบนเล็กน้อย
