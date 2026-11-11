#!/usr/bin/env python3
"""PHIVARA Documents Portal builder: docs/index.html + docs/html/*.html.
Run:  python3 docs/build.py   then open docs/index.html in a browser.
Add a note: drop a .md file in docs/notes/ (first "# heading" = title) and re-run.
Core docs (root .md files) are listed in PAGES below."""
import hashlib, html, os, re, markdown
from urllib.parse import quote

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'docs', 'html')
os.makedirs(OUT, exist_ok=True)
for _f in os.listdir(OUT):  # clean stale pages
    if _f.endswith('.html'):
        os.remove(os.path.join(OUT, _f))

CSS = """
:root{--bg:#fbfaf8;--fg:#1f1d1a;--mut:#6b665f;--line:#e4dfd7;--card:#fff;--acc:#8a6a2f;--code:#f1ede6}
@media (prefers-color-scheme:dark){:root{--bg:#161512;--fg:#ece8e1;--mut:#9d978d;--line:#34312b;--card:#1f1d19;--acc:#d3b36a;--code:#26231e}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.7 -apple-system,'Sarabun','Noto Sans Thai',system-ui,sans-serif}
.wrap{max-width:860px;margin:0 auto;padding:24px 16px 64px}
a{color:var(--acc)}h1{font-size:1.7rem;margin:.2em 0 .4em}h2{margin-top:2em;padding-top:.6em;border-top:1px solid var(--line);font-size:1.3rem}h3{font-size:1.1rem}
code{background:var(--code);padding:.1em .35em;border-radius:4px;font-size:.9em}
pre{background:var(--code);padding:12px 14px;border-radius:8px;overflow:auto}pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%;display:block;overflow-x:auto}th,td{border:1px solid var(--line);padding:6px 10px;text-align:left;vertical-align:top}th{background:var(--code)}
blockquote{margin:1em 0;padding:.2em 1em;border-left:3px solid var(--acc);color:var(--mut)}
.nav{font-size:.9rem;margin-bottom:12px}.mut{color:var(--mut)}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.card{display:block;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px;text-decoration:none;color:var(--fg)}
.card:hover{border-color:var(--acc)}.card b{display:block;color:var(--acc)}.card span{font-size:.9rem;color:var(--mut)}
.tag{font-size:.72rem;border:1px solid var(--line);border-radius:99px;padding:0 8px;margin-left:6px;color:var(--mut)}
"""

def page(title, body, nav=True):
    n = '<div class="nav"><a href="../index.html">← Documents Portal</a></div>' if nav else ''
    return f"""<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title><style>{CSS}</style></head><body><div class="wrap">{n}{body}</div></body></html>"""

# (md path relative to ROOT, output name, title, description)
PAGES = [
  ('CONTEXT.md', 'context', 'CONTEXT.md', 'บริบท การตัดสินใจ บทเรียน ฟีเจอร์ที่ทำแล้ว งานค้าง (เริ่มอ่านที่นี่)'),
  ('DEPLOY.md', 'deploy', 'DEPLOY.md', 'ขั้นตอน deploy ขึ้น VPS, nginx, migration, troubleshooting'),
  ('README.md', 'readme', 'README.md', 'ตั้งค่า run ในเครื่อง (local)'),
  ('PROJECT_STATUS.md', 'project-status', 'PROJECT_STATUS.md', 'สถานะงานช่วงต้นโครงการ (ล้าหลัง ยึด CONTEXT.md เป็นหลัก)'),
]
md = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc', 'sane_lists'])
for src, name, title, _ in PAGES:
    p = os.path.join(ROOT, src)
    if not os.path.exists(p):
        continue
    md.reset()
    body = md.convert(open(p, encoding='utf-8').read())
    # links to other known docs -> their html versions
    for s2, n2, _, _ in PAGES:
        body = body.replace(f'href="{os.path.basename(s2)}"', f'href="{n2}.html"')
    open(os.path.join(OUT, name + '.html'), 'w', encoding='utf-8').write(page(title, body))

def card(href, title, desc, tag=''):
    t = f'<span class="tag">{tag}</span>' if tag else ''
    return f'<a class="card" href="{href}"><b>{html.escape(title)}{t}</b><span>{html.escape(desc)}</span></a>'


# ---- notes: every docs/notes/*.md is picked up automatically ----
NOTES_DIR = os.path.join(ROOT, 'docs', 'notes')
os.makedirs(NOTES_DIR, exist_ok=True)
notes = []
for fn in sorted(os.listdir(NOTES_DIR)):
    if not fn.lower().endswith('.md'):
        continue
    text = open(os.path.join(NOTES_DIR, fn), encoding='utf-8').read()
    lines = [l.strip() for l in text.splitlines()]
    title = next((l[2:].strip() for l in lines if l.startswith('# ')), os.path.splitext(fn)[0])
    desc = next((l for l in lines if l and not l.startswith(('#', '_', '>', '|', '-', '`'))), '')
    name = 'note-' + re.sub(r'[^0-9A-Za-z]+', '-', os.path.splitext(fn)[0]).strip('-').lower()
    if name == 'note-':  # non-ASCII filename: stable short hash
        name = 'note-' + hashlib.md5(fn.encode()).hexdigest()[:8]
    md.reset()
    open(os.path.join(OUT, name + '.html'), 'w', encoding='utf-8').write(page(title, md.convert(text)))
    mtime = os.path.getmtime(os.path.join(NOTES_DIR, fn))
    notes.append((mtime, name, title, re.sub(r'[*_`]', '', desc)[:140]))
notes.sort(reverse=True)  # newest first
import datetime
notes_cards = ''.join(card(f'html/{n}.html', t, d, datetime.date.fromtimestamp(m).strftime('%d/%m/%y')) for m, n, t, d in notes) \
    or '<p class="mut">ยังไม่มีบันทึก</p>'

def link_file(rel):  # relative to docs/
    return quote(rel)

docs_cards = ''.join(card(f'html/{n}.html', t, d) for s, n, t, d in PAGES if os.path.exists(os.path.join(ROOT, s)))

word = [
 ('TOR_PHIVARA.docx', 'TOR โครงการ'), ('TOR_VPS_PHIVARA.docx', 'TOR จัดซื้อ VPS (RAM 16 GB, storage 200 GB+)'),
 ('vps-spec-phivara.docx', 'สเปก VPS'), ('Proposal_PHIVARA.docx', 'ข้อเสนอโครงการ'),
 ('PHIVARA_Scope_of_Work.docx', 'ขอบเขตงาน'), ('DES-PHIVARA-2569-001_UXUI_Frontend.docx', 'เอกสารออกแบบ UX/UI Frontend'),
 ('PHIVARA_เอกสารส่งมอบงาน.docx', 'เอกสารส่งมอบงาน'),
]
word_cards = ''.join(card('../' + link_file('Project Documents/' + f), f, d, 'Word') for f, d in word
                     if os.path.exists(os.path.join(ROOT, 'Project Documents', f)))

other = []
if os.path.isdir(os.path.join(ROOT, 'cms-manual')):
    other.append(card('../cms-manual/', 'คู่มือ CMS (cms-manual/)', 'คู่มือใช้งาน CMS สำหรับเจ้าหน้าที่ (เปิดจริงที่ /admin/manual)'))
if os.path.isdir(os.path.join(ROOT, 'phivara-design-html')):
    other.append(card('../phivara-design-html/', 'ต้นแบบดีไซน์ HTML', 'phivara-design-html/ (เฉพาะเครื่องนี้ ไม่อยู่ใน git)', 'local'))
    if os.path.exists(os.path.join(ROOT, 'phivara-design-html', 'popup-fullscreen-mockup.html')):
        other.append(card('../phivara-design-html/popup-fullscreen-mockup.html', 'Mockup popup เต็มจอ', 'ตัวอย่างหน้าจอ splash เต็มจอ', 'local'))

body = f"""<h1>PHIVARA Documents Portal</h1>
<p class="mut">ศูนย์รวมเอกสารและบันทึกของโปรเจกต์ สร้างจากไฟล์ใน repo ด้วย <code>python3 docs/build.py</code> (รันใหม่ทุกครั้งที่แก้เอกสาร)</p>
<h2>เอกสารหลัก</h2><div class="grid">{docs_cards}</div>
<h2>บันทึกและบทเรียน (Notes)</h2><p class="mut">เรียงใหม่สุดก่อน · เพิ่มได้โดยวางไฟล์ .md ใน <code>docs/notes/</code></p><div class="grid">{notes_cards}</div>
<h2>เอกสารโครงการ / จัดซื้อ (Word)</h2><div class="grid">{word_cards}</div>
<h2>อื่นๆ</h2><div class="grid">{''.join(other)}</div>
<h2>เพิ่มบันทึก / เอกสารใหม่</h2>
<ul><li><b>บันทึกทั่วไป</b>: สร้างไฟล์ <code>.md</code> ใน <code>docs/notes/</code> (หัวข้อบรรทัดแรก <code># ชื่อเรื่อง</code> จะเป็นชื่อการ์ด) แล้วรัน <code>python3 docs/build.py</code></li><li><b>เอกสาร Word/PDF</b>: เก็บใน <code>Project Documents/</code> แล้วเพิ่มชื่อไฟล์ในรายการ <code>word</code> ของ <code>docs/build.py</code></li></ul>"""
open(os.path.join(ROOT, 'docs', 'index.html'), 'w', encoding='utf-8').write(page('PHIVARA Documents Portal', body, nav=False))
print('built', len(PAGES), 'pages')
