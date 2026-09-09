# PHIVARA — เว็บไซต์ + CMS

เว็บไซต์ PHIVARA Aesthetic & Longevity Center สร้างด้วย Next.js 15 + Payload CMS 3 (Postgres) รองรับหลายภาษา (ไทย/อังกฤษ เป็นหลัก)

เอกสารอื่นที่เกี่ยวข้อง:
- `PROJECT_STATUS.md` — สรุปว่าทำอะไรเสร็จแล้ว/เหลืออะไร
- `DEPLOY.md` — ขั้นตอน deploy ขึ้น production (VPS) แบบละเอียด, troubleshooting ที่เคยเจอจริง

README นี้ครอบคลุมเฉพาะ **การตั้งค่าเพื่อพัฒนาบนเครื่องตัวเอง (local)** เท่านั้น

---

## Stack

- **Next.js 15** (App Router) + React 19 — frontend, route group `[locale]` สำหรับ i18n
- **Payload CMS 3** (`@payloadcms/db-postgres`) — จัดการเนื้อหาทั้งหมดผ่าน `/admin`
- **Postgres** — database, migration เขียนมือไว้ใน `cms/migrations/*.ts`
- **pm2** (fork mode) + **nginx** — วิธี run บน production (ดู `DEPLOY.md`)

---

## สิ่งที่ "clone" มาแล้วจะไม่มี (ต้องเตรียมเอง)

1. **`.env`** — ไม่ได้ commit เข้า git (มี secret เช่น `DATABASE_URI`, `PAYLOAD_SECRET`) มีแค่ `.env.example` เป็น template
2. **`media/`** — ไฟล์รูปที่ถูกอัปโหลดผ่าน CMS จริงบน production ไม่ได้ commit เข้า git (เก็บบน local disk ของ VPS เท่านั้น — ดู `PROJECT_STATUS.md` ข้อที่ยังไม่เสร็จเรื่องย้ายไป cloud storage) เพราะงั้น local ใหม่จะไม่มีรูปจริงจนกว่าจะอัปโหลดเองผ่าน `/admin` หรือขอไฟล์จากทีม
3. **ฐานข้อมูลจริง** — Postgres เป็นคนละส่วนจาก git โดยสิ้นเชิง มี 2 ทางเลือก:
   - ขอ DB dump จริงจากทีม (ปลอดภัยกว่าถ้าเป็นข้อมูลลูกค้า/Leads ควร mask ก่อนแชร์)
   - หรือรัน `npm run seed` เพื่อสร้างข้อมูลตัวอย่าง (ไม่ใช่ข้อมูลจริง แต่พอให้เห็นโครงสร้าง/ทดสอบ UI ได้)

---

## เริ่มพัฒนา local

### 1. ติดตั้งพื้นฐาน

- Node.js ≥ 18.20.2 (production ใช้ Node 20 LTS — แนะนำใช้เวอร์ชันเดียวกัน)
- Postgres (ติดตั้ง local หรือใช้ instance ที่แชร์กับทีม)

### 2. Clone + ติดตั้ง dependencies

```bash
git clone git@github.com:Jirakritt/phivara-project.git
cd phivara-project
npm ci
```

### 3. ตั้งค่า environment variables

```bash
cp .env.example .env
```

แก้ `.env` อย่างน้อย 2 ตัวนี้ให้รันได้:

- `DATABASE_URI` — connection string ไปยัง Postgres ของตัวเอง เช่น `postgresql://user:password@localhost:5432/phivara_cms`
- `PAYLOAD_SECRET` — string สุ่มยาวๆ อะไรก็ได้ (`openssl rand -base64 32`)

ตัวแปรอื่น (analytics, email provider) ปล่อยว่างได้ตอน dev — ฟีเจอร์ที่พึ่งพาตัวแปรนั้นจะแค่ไม่ทำงาน ไม่ error

### 4. สร้าง schema ในฐานข้อมูล

```bash
npm run migrate
```

รัน migration ทั้งหมดใน `cms/migrations/` ตามลำดับ (มี 49 ไฟล์ ณ ตอนเขียน README นี้)

### 5. ใส่ข้อมูลตัวอย่าง (ถ้ายังไม่มี DB dump จริง)

```bash
npm run seed
```

มี seed ย่อยแยกเฉพาะบางส่วนด้วย เช่น `npm run seed:awards`, `npm run seed:footer` — ดูรายการทั้งหมดใน `package.json`'s scripts

### 6. รัน dev server

```bash
npm run dev
```

เปิด `http://localhost:3000` (frontend) และ `http://localhost:3000/admin` (CMS admin — ครั้งแรกจะให้สร้าง user แรกเอง)

---

## คำสั่งอื่นที่ใช้บ่อย

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `npm run build` | build production bundle |
| `npm run migrate:create` | สร้าง migration ใหม่หลังแก้ schema ใน `cms/collections/` หรือ `cms/globals/` |
| `npm run generate:types` | generate `payload-types.ts` ใหม่ตาม schema ปัจจุบัน |
| `npx tsc --noEmit -p .` | type-check ทั้งโปรเจกต์ (รันก่อน commit เสมอ) |

---

## โครงสร้างโปรเจกต์คร่าวๆ

```
src/
  app/[locale]/(public)/   หน้าเว็บฝั่งผู้ใช้ (program, doctor, article, branch, ...)
  app/(payload)/           แมานท์ Payload admin UI (/admin) + custom.scss theme
  components/              React components ที่ใช้ร่วมกันหลายหน้า
  lib/                     data-fetching helpers ต่อ collection (programsData.ts, articlesData.ts, ...)
cms/
  collections/             schema ของแต่ละ collection (Programs, Doctors, Articles, ...)
  globals/                 schema ของ global (HomeHero, Ecosystem, ...)
  migrations/              migration files (เขียนมือ ไม่ใช่ auto-generate)
  admin/components/        custom React components สำหรับ admin panel (Nav, Dashboard, ...)
  seed/                    สคริปต์ใส่ข้อมูลตัวอย่าง
public/
  css/, js/                static assets ฝั่ง frontend (ไม่ผ่าน bundler, โหลดตรงๆ)
```

---

## เมื่อพร้อม deploy จริง

ดู `DEPLOY.md` — มีขั้นตอนแบบละเอียดสำหรับ deploy ขึ้น VPS ทั้งครั้งแรกและครั้งถัดๆ ไป รวมถึง troubleshooting ปัญหาที่เคยเจอจริง (เช่น `pg_dump`/`pg_restore` error ที่เจอบ่อย)
