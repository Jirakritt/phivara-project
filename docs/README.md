# PHIVARA Documents Portal

> เปิดแบบอ่านง่ายในเบราว์เซอร์: ดับเบิลคลิก `docs/index.html` (สร้างใหม่ด้วย `python3 docs/build.py` หลังแก้เอกสาร)

หน้ารวมเอกสารของโปรเจกต์ เปิดดูที่นี่ก่อนเมื่อต้องการหาข้อมูล (อัปเดตทุกครั้งที่เพิ่มเอกสารใหม่)

## 1. เอกสารหลักในโค้ด (ไฟล์ Markdown)

| เอกสาร | ใช้เมื่อไร | ที่อยู่ |
|---|---|---|
| **CONTEXT.md** | อยากรู้บริบท การตัดสินใจ บทเรียน ฟีเจอร์ที่ทำแล้ว งานค้าง (เริ่มอ่านที่นี่) | `../CONTEXT.md` |
| **DEPLOY.md** | ก่อน/ระหว่าง deploy ขึ้น VPS, troubleshooting, nginx, migration | `../DEPLOY.md` |
| **README.md** | ตั้งค่า run ในเครื่อง (local) | `../README.md` |
| **PROJECT_STATUS.md** | สถานะงานช่วงต้นโครงการ (ล้าหลัง อ้าง CONTEXT.md เป็นหลัก) | `../PROJECT_STATUS.md` |

## 2. บันทึกและบทเรียน (โฟลเดอร์ docs/notes/ เพิ่มไฟล์ใหม่ได้เลย)

| เอกสาร | เรื่อง |
|---|---|
| [ISR และการ cache](notes/ISR-และการ-cache.md) | ISR คืออะไร, ทำไมหน้าแรกเคยช้า ~4 วินาที, วิธีตรวจว่าหน้าเป็น ISR จริง, ข้อควรระวัง |

## 3. เอกสารโครงการ/จัดซื้อ (ไฟล์ Word ใน `Project Documents/`)

| ไฟล์ | เรื่อง |
|---|---|
| `TOR_PHIVARA.docx` | TOR โครงการ |
| `TOR_VPS_PHIVARA.docx` | TOR จัดซื้อ VPS (RAM 16 GB, storage 200 GB+) |
| `vps-spec-phivara.docx` | สเปก VPS |
| `Proposal_PHIVARA.docx` | ข้อเสนอโครงการ |
| `PHIVARA_Scope_of_Work.docx` | ขอบเขตงาน |
| `DES-PHIVARA-2569-001_UXUI_Frontend.docx` | เอกสารออกแบบ UX/UI Frontend |
| `PHIVARA_เอกสารส่งมอบงาน.docx` | เอกสารส่งมอบงาน |

## 4. อื่นๆ

- `cms-manual/` และหน้า `/admin/manual`: คู่มือการใช้ CMS สำหรับเจ้าหน้าที่
- `phivara-design-html/`: ต้นแบบดีไซน์ HTML (รวม mockup popup เต็มจอ)
- `_archive/`: โค้ดเก่าที่เลิกใช้แล้ว (อ้างอิงเท่านั้น)

## หัวข้อใน CONTEXT.md ที่มักต้องเปิดดู

- 3: กฎ/บทเรียนที่ห้ามลืม
- 5B: SEO / Google Search Console
- 5C: Performance หน้าแรก
- 5D: ISR / การ cache (สรุป ลิงก์มาที่เอกสารด้านบน)
- 6: งานค้าง

## วิธีเพิ่มเอกสารใหม่

1. บันทึก/บทเรียน: สร้างไฟล์ `.md` ใน `docs/notes/` แล้วรัน `python3 docs/build.py` (หน้า Portal จะเพิ่มการ์ดให้อัตโนมัติ)
2. บริบท/การตัดสินใจสั้นๆ: เพิ่มหัวข้อใน `CONTEXT.md`
3. เอกสาร Word/PDF ที่ส่งให้ภายนอก: เก็บใน `Project Documents/` แล้วเพิ่มแถวในตารางหัวข้อ 3
