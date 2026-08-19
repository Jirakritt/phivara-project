# PHIVARA — สถานะโปรเจกต์

_อัปเดตล่าสุด: 18 สิงหาคม 2569_

เอกสารนี้สรุปว่าทำอะไรไปแล้วบ้าง และยังเหลืออะไรที่ต้องทำต่อ — อัปเดตทุกครั้งที่มีงานใหญ่เสร็จ ใช้เป็นจุดเช็คสถานะร่วมกันแทนการไล่ดู chat ย้อนหลัง

สำหรับขั้นตอน deploy แบบละเอียด (คำสั่ง, troubleshooting) ดูที่ `DEPLOY.md`

---

## เสร็จแล้ว

### ระบบหลายภาษา (i18n) — deploy ขึ้น production แล้ว
- แปลทุกหน้าเว็บ (ไทย + อังกฤษ) รวมส่วนที่เคย hardcode ไว้ใน `main.js`
- ระบบ fallback locale + strict per-locale filtering (ไม่โชว์เนื้อหาที่ยังไม่แปล)
- แก้หน้า 404 ให้แปลภาษาถูกต้องทั้ง 2 กรณี (`[locale]/not-found.tsx` และ `global-not-found.tsx`)
- แก้ bug list/bullet ในบทความจาก CMS ที่เคยหายตอน render บนหน้าเว็บ
- Deploy ครั้งแรกของฟีเจอร์นี้ขึ้น production สำเร็จ (2026-08-18) พร้อมแก้ปัญหา migration bookkeeping ที่ชนกับ schema เดิม

### หน้านโยบายความเป็นส่วนตัว — ทำให้แก้ไขผ่าน CMS ได้
- ย้ายจาก hardcode ในโค้ด → Payload Global เดียว เป็น rich text ต่อภาษา (พิมพ์/แก้หัวข้อ, ย่อหน้า, list ได้อิสระ)
- Seed เนื้อหาเดิม (ไทย/อังกฤษ) เข้า CMS แล้ว แก้ไขได้จาก `/admin/globals/privacy-policy`
- Deploy ขึ้น production แล้ว

### หน้าจัดการภาษา (Language Management) — ปรับ UX ใหม่
- จาก checkbox list ยาวต้อง scroll เยอะ → card grid พร้อม toggle switch, sort อัตโนมัติตามสถานะ, accessibility (aria-label, keyboard)
- Deploy ขึ้น production แล้ว

---

## ยังไม่เสร็จ / ต้องทำต่อ

- [ ] เนื้อหาภาษา ja/zh/vi/ar (bio หมอ, บทความ, โปรแกรม, สาขา) ยังไม่มี — เปิด "เผยแพร่บนหน้าเว็บ" จากหน้า Language Management ได้แล้ว แต่ถ้ายังไม่มีเนื้อหาจริง หน้า listing ของภาษานั้นจะว่างเปล่า
- [ ] Privacy Policy ยังมี placeholder ทางกฎหมาย ([ชื่อนิติบุคคล], [ที่อยู่], [DPO contact], [ระยะเวลาเก็บข้อมูล] ฯลฯ) — แก้ไขได้จาก `/admin` แล้ว รอทีมกฎหมายกรอกข้อมูลจริงก่อนเปิดใช้งานจริงจัง
- [ ] Analytics ยังไม่ผูก — `NEXT_PUBLIC_GA4_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` ว่างอยู่ใน production `.env`
- [ ] DB backup ยังทำมือก่อน deploy แต่ละครั้งเท่านั้น — ยังไม่มี automated schedule (เช่น cron รายวัน)
- [ ] Media (รูปภาพที่ upload ผ่าน CMS) เก็บบน local disk ของ VPS — ควรมี monitoring พื้นที่ disk และแผนย้ายไป cloud storage (S3-compatible) ในระยะยาว
- [ ] ลบ/เปลี่ยนรหัส test accounts ก่อนเปิดใช้งานจริงเต็มรูปแบบ
- [ ] GitHub Actions auto-deploy ยังไม่ได้ตั้งจริง (มีตัวอย่าง workflow ใน `DEPLOY.md` Part 3 แล้ว แต่ตั้งใจให้ `migrate` ยังคงทำด้วยมือเสมอ)

---

## เอกสารที่เกี่ยวข้อง

- `DEPLOY.md` — ขั้นตอน deploy แบบละเอียด, troubleshooting ที่เคยเจอจริง, checklist ก่อนใช้งานจริง
- `phivara-design-html/cms/` — mockup หน้า admin ที่รีวิวกันไว้ก่อน implement จริง (เช่น `edit-language-settings-v2.html`)
