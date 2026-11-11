# ISR และการ cache หน้าเว็บ (Next.js)

_เขียนเมื่อ พ.ย. 2569 หลังแก้ให้หน้าสาธารณะเป็น ISR จริง_

## ISR คืออะไร

**ISR = Incremental Static Regeneration** (สร้างหน้า static ใหม่ทีละส่วนเมื่อถึงเวลา) คือการเก็บหน้าเว็บสำเร็จรูปไว้ แล้วสร้างใหม่เบื้องหลังเป็นรอบ

| แบบ | วิธีทำงาน | ความเร็ว | ข้อมูลสด |
|---|---|---|---|
| Dynamic (SSR) | สร้างหน้าใหม่ทุกครั้งที่มีคนเข้า (ดึง DB, ประกอบ HTML) | ช้า (~4 วินาทีบน prod ก่อนแก้) | สดที่สุด |
| Static | สร้างครั้งเดียวตอน build | เร็วมาก | ไม่อัปเดตจนกว่าจะ build ใหม่ |
| **ISR** | สร้างไว้ล่วงหน้า แล้วสร้างใหม่เบื้องหลังทุกช่วงเวลาที่กำหนด | เร็วมาก | เก่าได้ไม่เกินช่วงที่ตั้ง |

## ทำงานอย่างไรกับเว็บเรา (`export const revalidate = 60`)

1. ตอน `next build` สร้างหน้า `/th` และ `/en` เก็บไว้ (`generateStaticParams` ใน `(public)/page.tsx`)
2. ผู้เข้าชมได้หน้าสำเร็จรูปทันที ไม่รอ DB (ทดสอบในเครื่อง 6-59 ms)
3. ถ้าหน้าที่เก็บไว้เก่าเกิน 60 วินาที คนถัดไปยังได้หน้าเก่าก่อน แต่ระบบสร้างหน้าใหม่เบื้องหลัง (`stale-while-revalidate`)
4. คนต่อๆ ไปได้หน้าใหม่

ตัวอย่าง: แก้ใน CMS ตอน 10:00:00 หน้าเว็บอาจยังเป็นของเก่าได้ถึงราว 10:01:00 ถ้าไม่มีอะไรสั่งอัปเดตทันที

## ผลกับงานของทีม

- แก้ใน CMS แล้วเห็นบนเว็บ: ช้าได้สูงสุดราว 1 นาที แต่ hook `revalidatePath` (เช่น Awards, Popup) สั่งสร้างใหม่ทันที จึงมักเห็นเร็วกว่านั้น
- Popup (`/api/popup/active`) ยังเป็น dynamic จึงเปิด/ปิดตามเวลาได้ตรง
- หน้าสมาชิก (login, profile ฯลฯ) ยังเป็น dynamic เพราะต้องรู้ว่าใครล็อกอิน
- ปรับความสดด้วยตัวเลข `revalidate`: 30 = สดขึ้นแต่โหลด DB มากขึ้น, 300 = เบาขึ้นแต่เก่าได้นานขึ้น (ตอนนี้ 60)

## เหตุการณ์ที่ ISR ไม่ทำงาน (พบ พ.ย. 2569)

อาการ: หน้าแรกบน production ตอบช้า TTFB ~3.7-4.1 วินาที ทุกครั้ง และ header เป็น `Cache-Control: private, no-cache, no-store` ทั้งที่ตั้ง `revalidate = 60` ไว้ (API และ `robots.txt` ตอบ 0.14 วินาที จึงไม่ใช่เซิร์ฟเวอร์ช้า)

สาเหตุ: มีโค้ดเรียก `headers()` / `draftMode()` (ซึ่งอ่าน cookie/header) ใน segment `[locale]` สองจุด
1. `(public)/layout.tsx` เรียก `draftMode()` ทุก request
2. `[locale]/not-found.tsx` อ่าน header `x-phivara-locale` ทั้งใน `generateMetadata` และตัว component

**กฎ: การเรียก dynamic API ที่ใดก็ตามใน route (layout, page, หรือ not-found.tsx) ทำให้ทั้ง route กลายเป็น dynamic ไม่ใช่แค่ตรงนั้น** แล้ว `revalidate` ถูกเพิกเฉย

วิธีแก้:
- `(public)/layout.tsx`: เรียก `draftMode()` เฉพาะเมื่อ locale ยังไม่ live (กรณีรีวิวภาษาที่ยังไม่เปิด)
- `not-found.tsx`: เลิกอ่าน header; title เป็นสองภาษา; เนื้อหา 404 เตรียมไว้ทุก locale ที่ live แล้ว `src/components/NotFoundByLocale.tsx` (client, `usePathname`) เลือกตาม URL
- เพิ่ม `generateStaticParams` ที่หน้าแรก (th/en)

## วิธีตรวจว่าหน้าเป็น ISR จริงไหม

1. หลัง `npx next build` ดูตาราง route: `●` = ISR/static (ดี), `ƒ` = dynamic (render สดทุกครั้ง)
   - หมายเหตุ: route ที่มี `[param]` แต่ไม่มี `generateStaticParams` จะโชว์ `ƒ` แม้ runtime เป็น ISR ให้ดู header จริงแทน
2. ตรวจ header ของหน้า (บน local หลัง `next start` หรือบน production):
   ```bash
   curl -sI https://www.phivaraphyathai.com/th | grep -i -E "cache-control|x-nextjs-cache"
   ```
   - ถูกต้อง: `Cache-Control: s-maxage=60, stale-while-revalidate=...` และ `x-nextjs-cache: HIT`
   - ผิด: `private, no-cache, no-store` แปลว่ามีอะไรทำให้เป็น dynamic
3. หาตัวการ: ชั่วคราวใส่ `export const dynamic = 'error'` + `generateStaticParams` ใน page แล้ว build ข้อความ error จะบอกว่า API ตัวไหน (`headers`, `cookies`) แล้วไล่ตัดโค้ดทีละส่วน (layout, not-found, component) ทดสอบทีละชั้น **อย่าลืมเอา `dynamic = 'error'` ออกก่อน commit**

## ข้อควรระวังเมื่อเขียนโค้ดต่อ

- อย่าใช้ `cookies()`, `headers()`, `draftMode()`, `searchParams` ใน layout/page/not-found ของหน้าสาธารณะ ถ้าจำเป็นต้องรู้ภาษาหรือ user ให้ใช้ params ของ route หรืออ่านฝั่ง client
- หน้าที่ต้อง dynamic จริง (สมาชิก, API) ปล่อยเป็น dynamic ได้ ไม่กระทบหน้าสาธารณะ
- ถ้าเพิ่มหน้าสาธารณะใหม่ ให้เช็ก header ตามข้อ 2 หลัง deploy ทุกครั้ง
