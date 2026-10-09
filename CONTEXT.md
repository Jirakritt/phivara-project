# PHIVARA — Context สำหรับคนที่เข้ามาทำงานต่อ (และ Claude)

_สรุปจาก session Cowork "Phivara-design-html understanding" (6 ส.ค. – 28 ก.ย. 2569) · เขียนเมื่อ 1 ต.ค. 2569_

เอกสารนี้เก็บ **บริบทและการตัดสินใจ** ที่ไม่อยู่ในโค้ดหรือ git history ส่วนเอกสารอื่น:
- `README.md` — setup local
- `DEPLOY.md` — runbook deploy + troubleshooting (**อ่าน Part 2B และ 4.1 ก่อน deploy ทุกครั้ง**)
- `PROJECT_STATUS.md` — สถานะงาน (อัปเดตล่าสุด 18 ส.ค. อาจเก่ากว่าเอกสารนี้)

> ⚠️ ห้ามใส่ secret/รหัสผ่านจริงในไฟล์นี้ — ค่า secret อยู่ใน `.env` เท่านั้น

---

## 1. ระบบคืออะไร

เว็บไซต์ + CMS ของ PHIVARA Aesthetic & Longevity Center (คลินิก/โรงพยาบาลความงาม หลายสาขา)

- **Stack:** Next.js 15 (App Router, route `[locale]`) + Payload CMS 3 + Postgres (`@payloadcms/db-postgres`)
- **ภาษา:** th/en เป็นหลัก; ja/zh/vi/ar มี dictionary (แปลด้วยเครื่อง ยังไม่ผ่านคนตรวจ) แต่เนื้อหา CMS ยังว่าง
- **Repo:** `git@github.com:Jirakritt/phivara-project.git` (branch `master`)
- **Production:** VPS, pm2 (process ชื่อ `phivara`, fork mode) + nginx, โค้ดอยู่ใต้ `/var/www/` (ยืนยัน path จริงบน VPS ก่อนใช้ — session เก่าใช้ `/var/www/phivara`, session ล่าสุดใช้ `/var/www/phivara-project`)
- **โดเมน:** ย้ายจาก `phivara.site` → **`www.phivaraphyathai.com`** เสร็จเมื่อ 28 ก.ย. 2569 (DNS, SSL, nginx, `NEXT_PUBLIC_SERVER_URL`, `EMAIL_FROM_ADDRESS` เรียบร้อย) `phivara.site` เลิกใช้แล้ว

### โครงสร้างหลัก
- `src/app/[locale]/(public)/…` — หน้าเว็บสาธารณะ; `(member)` — หน้าสมาชิก; `src/app/api/preview/` — preview ภาษาที่ยังไม่เปิด
- `src/lib/*Data.ts` — data fetching จาก Payload (เช่น `doctorsData.ts`, `programsData.ts`)
- `cms/collections/` — Articles, Awards, Branches, Doctors, Leads, Media, Members, MembershipTiers, Programs, Users
- `cms/globals/` — Footer, TopBar, HomeHero, Membership, MemberPrivileges, Ecosystem, PrivacyPolicy, LanguageSettings, EmailSettings, DoctorDisplaySettings
- `cms/migrations/` — migration ของ Payload (`.ts` + `.json` snapshot)
- `phivara-design-html/` — **mockup/ต้นแบบ HTML ที่อนุมัติแล้ว** ใช้เป็น reference ก่อน implement (เช่น `doctor_detail-multibranch.html`, `member-profile-v2.html`, `cms/edit-language-settings-v2.html`)
- `Project Documents/` — TOR, Proposal (theme ของบริษัท Codeworks), DES-PHIVARA-2569-001 (เอกสารยืนยัน UX/UI), Scope of Work, เอกสารส่งมอบงาน, spec VPS

---

## 2. ข้อจำกัดในการทำงานกับ Claude (สำคัญ)

- Claude **แก้ไฟล์ในโปรเจกต์ได้โดยตรง** แต่ **ไม่มีสิทธิ์เข้า SSH/VPS, production DB หรือ `git push`**
- งานฝั่ง server ทั้งหมด (git pull, migrate, build, pm2, backup, SQL) **ผู้ใช้รันเอง** แล้ววางผลลัพธ์ให้ Claude ตรวจ ทีละขั้น
- Claude ไม่เขียน `.env` จริง — บอกบรรทัดที่ต้องเพิ่มแทน (`.env.example` แก้ได้)
- ผู้ใช้ชอบให้ **ตรวจใน local ก่อน commit/deploy** และชอบ "วางแผน → confirm → ลงมือ" สำหรับงานใหญ่
- ตอบเป็นภาษาไทย

---

## 3. กฎ/บทเรียนที่ได้มาแบบเจ็บตัว (ห้ามลืม)

### Deploy
1. **ลำดับบน production: `pull` → `migrate` → `build` → `pm2 reload`** — ต้อง migrate *ก่อน* build เพราะ `next build` prerender หน้า (เช่น `/sitemap.xml`) โดยยิง DB จริง ถ้า schema ยังไม่มีจะ build พัง (เคยพลาดครั้งหนึ่ง กู้ได้โดยไม่เสียข้อมูล)
2. **Backup DB ทุกครั้งก่อน migrate** และ tag git HEAD เป็นจุด rollback — `pg_dump` ต้องดึง URI จาก `.env` ตรงๆ (`$DATABASE_URI` ไม่ได้ export ใน shell):
   `pg_dump --format=custom "$(grep '^DATABASE_URI=' .env | cut -d '=' -f2-)" > backup.dump`
3. **ใช้ `npx payload migrate` ตรงๆ ใน terminal ที่โต้ตอบได้** — `npm run migrate` จะเงียบ (no-op) ถ้า Payload ถามยืนยัน ("data loss will occur…") ซึ่งเป็นคำเตือนทั่วไปเพราะเคยใช้ dev-push กับ DB นั้น ให้อ่าน SQL ใน migration ว่าเป็น additive จริงก่อนตอบ yes
4. **`payload migrate:create` เทียบกับ snapshot journal ของ migration เก่า ไม่ได้ introspect DB จริง** — ถ้า DB เคยถูก dev-push (`next dev` push mode สร้างแถว `dev`, batch -1) จะเจอ error "already exists" ให้ตรวจ schema จริงก่อน แล้วค่อย reconcile `payload_migrations` ด้วย INSERT ตาม `DEPLOY.md` Part 4.1 (ห้ามเดา)
5. สร้าง migration ต้องทำบนเครื่อง Mac ของผู้ใช้ที่ DB local ถูก sync แล้ว (sandbox ของ Claude รัน `tsx`/esbuild ไม่ได้ — platform ไม่ตรง และต่อ DB ไม่ได้)
6. ถ้าแก้ไฟล์ generated บน server เพี้ยน ให้ `git checkout -- <file>` กู้ อย่า hand-patch

### Payload
- `update()` validate **ทั้ง document** ทุกครั้ง → script ที่แก้ field เดียวอาจ FAILED เพราะคำแปลที่ยังไม่ครบใน field อื่น (เห็นตอน backfill หมอ 143 รายการ — ไม่ block และไม่ได้เกิดจากโค้ดใหม่)
- field แบบ hasMany relationship ครั้งแรกของ collection จะสร้างตาราง `<collection>_rels` ใหม่ (+ ตาราง `_v_` สำหรับ drafts)
- Unpublish ผ่านเมนูใน admin เคยไม่ทำงาน → ใช้ REST: `PATCH /api/doctors/<id>` body `{"_status":"draft"}`

### CSS
- เว็บโหลด **3 stylesheet** (`main.css`, `main_gpt.css`, `site-shell.css`) โดย `site-shell.css` โหลดท้ายสุดและชนะ — แก้ `main.css` อย่างเดียวอาจไม่มีผล
- `site-shell.css` มี reset บังคับ `font-size` ขั้นต่ำของ `p/a/strong`; ถ้าต้องการขนาดเฉพาะให้ใส่ class `phivara-type-size-override` (มีใช้อยู่แล้วที่ `program/[slug]/page.tsx`)
- ผู้ใช้ทำ pass ปรับ font-size ทั้งเว็บเป็น ≥16px เพื่ออ่านง่าย (commit ช่วง 22–23 ก.ย.) — งานใหม่ควรคง baseline นี้

---

## 4. ฟีเจอร์หลักที่ทำแล้ว (สรุป)

| ฟีเจอร์ | สถานะ | หมายเหตุ |
|---|---|---|
| i18n + fallback/strict per-locale filtering | production | locale ที่ไม่ `publiclyLive` → 404 ที่ `(public)/layout.tsx` (ไม่ใช่ middleware) |
| Privacy Policy แก้ผ่าน CMS | production | Global เดียว rich text ต่อภาษา; ยังมี placeholder ทางกฎหมายรอทีมกฎหมาย |
| Language Management (card grid) | production | `/admin` |
| Membership (tier, privilege, profile, สมัคร/ยืนยันอีเมล/ลืมรหัส) | production | ต้นแบบ `phivara-design-html/member-*.html`; อีเมลผ่าน Gmail API หรือ Microsoft Graph เลือกที่ CMS > Email Settings |
| Program price variants + LINE OA ต่อสาขา | production | LINE กลางแก้ได้ที่ Footer > Social Links (`lineId`, `line`) มี fallback hardcode กันลิงก์ตาย |
| TopBar LINE เป็นลิงก์จริง, `?booking=open` เปิด popup จอง (สำหรับ LINE Rich Menu) | production | |
| GTM (ลำดับก่อน GA4/Meta Pixel โดยตรง) | โค้ดพร้อม | ID ใน production `.env` ยังว่าง |
| Popup วันพิเศษหน้าแรก | commit แล้ว ยังไม่ deploy | collection `popups` (`cms/collections/Popups.ts`) ตั้งรูป/วัน-เวลาเริ่ม-สิ้นสุด/สวิตช์เปิดปิด/ช่วงแสดงซ้ำ (ค่าเริ่มต้น 15 นาที); เสิร์ฟผ่าน `/api/popup/active` (คิดเวลาตอน request เพราะหน้าแรกเป็น ISR 60s); จำรอบแสดงใน localStorage `phivara_popup` (key = popup id + รูป → เปลี่ยนรูปแสดงทันที); แบนเนอร์คุกกี้รอจนปิด popup (`__PHIVARA_POPUP_GATE__`); migration `20261007_150536_popups` (เพิ่มตารางอย่างเดียว) — deploy ตามลำดับ pull → `npx payload migrate` → build → reload |
| โหมดขาว-ดำ (Grayscale) | commit แล้ว ยังไม่ deploy | global `grayscale-mode` (`cms/globals/GrayscaleMode.ts`, admin เท่านั้นที่แก้ได้): สวิตช์ + ระดับ 0–100% ทีละ 10% + เริ่ม/หยุดแสดง (ไม่บังคับ); ใส่ `html{filter:grayscale(N%)}` ผ่าน `src/lib/grayscaleMode.ts` ใน `[locale]/layout.tsx` และ `global-not-found.tsx` (ไม่แตะ /admin); บันทึกแล้ว `revalidatePath('/', 'layout')` ล้างแคชทันที ส่วนเปลี่ยนตามเวลาอัตโนมัติช้าได้ ≤1 นาที (ISR หน้าแรก); migration `20261008_031314_grayscale` (เพิ่มอย่างเดียว) |
| Splash เต็มจอ (โหมดของ Popup) | commit แล้ว ยังไม่ deploy | `popups.displayMode` = modal (เดิม) หรือ fullscreen; fullscreen ใช้ `image` เป็นรูปเดสก์ท็อป 16:9 + `imageMobile` 9:16 (บังคับ) + `buttonLabel` (แยกภาษา) + `linkUrl` (ว่างหรือหน้าปัจจุบัน = ปุ่มแค่ปิด); `<picture>` เลือกรูปด้วย `(max-width:768px),(orientation:portrait)`; มีปุ่ม × เล็กกับ ESC ไม่ปิดเมื่อคลิกพื้นหลัง; ออกแบบรูปให้เนื้อหาอยู่กรอบกลาง 4:3 (เดสก์ท็อป) และเว้นข้างมือถือ ~12% เพราะ cover ตัดขอบ; migration `20261009_025241_popup_fullscreen` (เพิ่มอย่างเดียว); mockup: `phivara-design-html/popup-fullscreen-mockup.html` |
| Preview ภาษาที่ยังไม่เปิด (Draft Mode + `PREVIEW_SECRET`) | commit แล้ว (`89eca42`, `dc73c02`) | ลิงก์ `/api/preview?secret=…&redirect=/ja`; ปุ่มสร้างลิงก์อยู่ใน Language Management; ตรวจว่าตั้ง `PREVIEW_SECRET` ใน production `.env` แล้วหรือยัง |
| **Doctor multi-branch CR** | deploy production แล้ว 22 ก.ย. | ดูหัวข้อ 5 |
| เอกสาร TOR / Proposal / DES-PHIVARA-2569-001 / Scope / ส่งมอบ | เสร็จ | Proposal ใช้ theme บริษัท Codeworks (ต่างจาก TOR) |
| Slide deck "WHY-PHIVARA" | ถูกลบออกจาก workspace แล้ว | ผู้ใช้ไม่ต้องการแล้ว |

---

## 5. Doctor multi-branch CR (รายละเอียด)

**เป้าหมาย:** หมอ 1 คน = 1 record ใน CMS ใช้ได้หลายสาขา (เดิมสร้าง record ซ้ำต่อสาขา แล้ว merge หน้า `/doctor` ด้วยการเทียบชื่อตรงตัว)

- Schema (`cms/collections/Doctors.ts`): `branches` (hasMany), `mainBranch` (ต้องอยู่ใน `branches`, กำหนดตำแหน่ง featured), `scheduleByBranch` (array `{branch, rows[]}`); field เดิม `branch`/`schedule` ยังเก็บไว้เพื่อ backward compat
- Listing (`src/lib/doctorsData.ts`, `/doctor/page.tsx`): ตัวเลือก expand เลือกสาขาแสดง **เฉพาะ** กลุ่มที่ยังเป็นหลาย record ซ้ำ (`needsBranchPicker` = จำนวน `recordSlug` ที่ต่างกัน > 1); หมอ record เดียวหลายสาขาลิงก์เข้าโปรไฟล์ตรง
- โปรไฟล์ (`/doctor/[slug]`): badge ต่อสาขาใน hero, ตารางเวลาแบบ tab ต่อสาขา (`public/js/doctor-appointment-form.js` → `initScheduleBranchTabs`), dropdown จองแสดงเฉพาะสาขาของหมอ
- Migration: `cms/migrations/20260922_101544.ts` (commit `6a228bb`) · backfill: `cms/scripts/backfillDoctorBranches.ts` (production: set `branches/mainBranch` 12/12, `scheduleByBranch` 11/12)

**ค้างอยู่ของ CR นี้**
- [ ] ตรวจหมอคนอื่นที่ยังมี record ซ้ำชื่อเดียวกัน (เช็คแล้วเฉพาะ นพ.ดุลยณัฐ อรัญยะปาล)
- [ ] **merge หมอซ้ำบน production** — การ merge ที่ทำไปแล้วทำบน local DB เท่านั้น (เก็บ record ศรีราชา, ปิด/unpublish พญาไท 1, 2)
- [ ] กรอก `scheduleByBranch` ของสาขาพญาไท 1/2 ด้วยข้อมูลจริง (Claude จงใจไม่แต่งข้อมูลเอง)
- [ ] (nice-to-have) SEO slug + 301 redirect
- [ ] (ภายหลัง) ลบ field `branch`/`schedule` เดิม และเลิกใช้ `groupDoctorsByName()` เมื่อ merge ครบ

---

## 6. งานค้าง / ข้อควรทำต่อ

**จาก `PROJECT_STATUS.md` (ยังจริงอยู่ ณ ตอนนี้ ยกเว้นที่ระบุ)**
- [ ] เนื้อหา ja/zh/vi/ar (CMS ว่าง; dictionary เป็น machine translation ยังไม่ผ่านเจ้าของภาษา — ใช้ระบบ preview ให้เจ้าของภาษาตรวจก่อนเปิด)
- [ ] Privacy Policy placeholder ทางกฎหมาย
- [ ] ผูก Analytics (GTM/GA4/Meta Pixel ใน production `.env`)
- [ ] DB backup อัตโนมัติ (ตอนนี้ทำมือก่อน deploy เท่านั้น)
- [ ] Media อยู่บน disk ของ VPS — ต้อง monitor พื้นที่/วางแผนย้าย S3-compatible
- [ ] ลบ/เปลี่ยนรหัส test accounts (มี member ทดสอบตอน QA สมัครสมาชิก)
- [ ] GitHub Actions auto-deploy (ตั้งใจให้ `migrate` ทำมือเสมอ)

**พบระหว่างทำงาน**
- [ ] `RegisterForm.tsx` / `memberAuthClient.ts` (`parseError()`) แสดง error ดิบของ Payload เช่น "The following field is invalid: email" เมื่ออีเมลซ้ำ — ควรแปลงเป็นข้อความไทย/อังกฤษที่เข้าใจง่าย
- [ ] เมื่อย้ายโดเมน: ตรวจ cert เดิม `phivara.site` (certbot ยัง auto-renew อยู่) และถ้าต้องการ 301 redirect `phivara.site` → โดเมนใหม่ ต้องเพิ่ม server block ใหม่ใน nginx (ผู้ใช้ถามขั้นตอนไว้เฉยๆ ยังไม่ได้ทำ — ถ้าทำ ต้องใช้ cert เดิมที่ `/etc/letsencrypt/live/phivara.site/`)
- [ ] อัปเดตค่าที่ hardcode ชื่อโดเมนเก่า (ถ้ามี) เช่น ใน `DEPLOY.md`, sitemap/robots, ข้อความอีเมล และ `webFetchAllowedUrls` — ควร `grep -r "phivara.site"` ตรวจ
- [ ] `PROJECT_STATUS.md` ล้าหลัง — ควรอัปเดตให้ตรงกับตารางหัวข้อ 4

---

## 7. ข้อมูลอ้างอิงเร็ว

- Admin: `/admin` (Payload)
- Migration status: `npx payload migrate:status` (อ่านอย่างเดียว ใช้เช็คก่อน/หลัง deploy)
- Type check: `npx tsc --noEmit`
- Deploy นับจากที่ push แล้ว: ดู `DEPLOY.md` Part 2B ขั้นที่ 1–10
