/* What's in my bag? Every zipper is a pocket. Pull one and its things fall out (stop-motion style); tap anything to pick it up. */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s);
const stage = $('#stage'), bagBtn = $('#bag'), bagArt = $('#bag-art'), list = $('#items');
const sheet = $('#sheet'), sheetBody = $('#sheet-body'), sheetLabel = $('#sheet-label');
const phone = () => matchMedia('(max-width: 760px)').matches;

/* ---------- the bag, with my caramel frappuccino charm clipped on (Sitara lives in it) ---------- */
bagArt.innerHTML = BAG.closed;
const charm = document.createElement('span');
charm.className = 'charm';
charm.setAttribute('role', 'button');
charm.setAttribute('tabindex', '0');
charm.setAttribute('aria-label', 'My Bath & Body Works caramel frappuccino charm: Sitara lives in it. Ask her anything');
charm.innerHTML = BAG.charm;
bagBtn.appendChild(charm);
const openCharm = e => { e.stopPropagation(); e.preventDefault(); pickUp({ id: 'sitara', name: 'my caramel frappuccino charm', open: 'sitara' }); };
charm.addEventListener('click', openCharm);
charm.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openCharm(e); });

// my McCombs keychain, on the other side of the bag
const keychain = document.createElement('span');
keychain.className = 'charm mccombs';
keychain.setAttribute('role', 'button');
keychain.setAttribute('tabindex', '0');
keychain.setAttribute('aria-label', 'My McCombs keychain: why McCombs');
keychain.innerHTML = BAG.mccombs;
bagBtn.appendChild(keychain);
const openKeychain = e => { e.stopPropagation(); e.preventDefault(); pickUp({ id: 'mccombs', name: 'my mccombs keychain', open: 'mccombs' }); };
keychain.addEventListener('click', openKeychain);
keychain.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openKeychain(e); });

/* ---------- little stickers on the page ---------- */
const doodles = [
    ['<path d="M20 34 C4 22 4 8 14 6 C18 5 20 9 20 11 C20 9 22 5 26 6 C36 8 36 22 20 34Z" fill="#F4A7B9" stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"/>', 4, 6, 40],
    ['<path d="M20 2 l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#F8E7A9" stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"/>', 93, 8, 34],
    ['<circle cx="12" cy="28" r="7" fill="#C74634" stroke="#3A2626" stroke-width="2.5"/><circle cx="28" cy="28" r="7" fill="#C74634" stroke="#3A2626" stroke-width="2.5"/><path d="M12 21 Q16 6 24 4 M28 21 Q26 10 24 4" fill="none" stroke="#3A2626" stroke-width="2.5" stroke-linecap="round"/>', 2, 44, 38],
    ['<path d="M20 2 l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#D9C8F0" stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"/>', 30, 96, 26],
    ['<path d="M6 30 q6-20 14-8 q8-16 14 8" fill="none" stroke="#8E9A6E" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="10" r="6" fill="#F2C6C8" stroke="#3A2626" stroke-width="2.5"/>', 96, 88, 40]
];
$('.doodles').innerHTML = doodles.map(([d, l, t, w]) => `<svg viewBox="0 0 40 40" style="left:${l}%; top:${t}%; width:${w}px">${d}</svg>`).join('');

/* ---------- everything in the bag ---------- */
list.innerHTML = ITEMS.filter(it => it.zip !== 'side' && it.zip !== 'attached').map(it => `
    <li class="item" id="item-${it.id}" style="--l:${it.l}%; --t:${it.t}%; --w:${it.w}%; --r:${it.r}deg">
        <button type="button" data-item="${it.id}" aria-label="${it.name}" tabindex="-1">
            <span class="art">${it.art}</span><span class="tag">${it.name}</span>
        </button>
    </li>`).join('');

/* the frappuccino PocketBac and the McCombs strap are clipped to the front (fourth) zipper's pull, and ride along with it */
function hangCharms(pt) {
    const vb = bagArt.querySelector('svg').viewBox.baseVal;
    const x = (pt.x - vb.x) / vb.width * 100, y = (pt.y + 17 - vb.y) / vb.height * 100;
    const c = bagBtn.querySelector('.charm:not(.mccombs)'), m = bagBtn.querySelector('.charm.mccombs');
    if (c) { c.style.left = `${x - 9.5}%`; c.style.top = `${y - 1}%`; }
    if (m) { m.style.left = `${x - 8}%`; m.style.top = `${y - 1.5}%`; }
}
/* ---------- the zippers ---------- */
const svgNS = 'http://www.w3.org/2000/svg';
const zips = bagArt.querySelector('.zips');
const open = new Set();
BAG.pockets.forEach(pk => {
    const g = document.createElementNS(svgNS, 'g');
    g.innerHTML = `
        <path class="teeth" d="${pk.d}"/>
        <path class="gap" d="${pk.d}"/>
        <g class="pull" tabindex="0" role="button" aria-label="Unzip: ${pk.label}" aria-pressed="false">
            <rect x="-10" y="-5" width="20" height="32" rx="6"/><circle cx="0" cy="17" r="3.4"/>
        </g>`;
    zips.appendChild(g);
    const path = g.querySelector('.gap'), pull = g.querySelector('.pull'), len = path.getTotalLength();
    path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
    pk.el = { g, path, pull, len };
    place(pk, 0);
    const toggle = e => { e.stopPropagation(); open.has(pk.id) ? zipUp(pk) : unzip(pk); };
    // drag the pull yourself: it follows your finger along the zipper; let go past halfway and it finishes
    const samples = Array.from({ length: 81 }, (_, k) => path.getPointAtLength(len * k / 80));
    const tAt = e => {
        const pt = path.ownerSVGElement.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        const p = pt.matrixTransform(path.getScreenCTM().inverse());
        let best = 0, bd = Infinity;
        samples.forEach((q, k) => { const d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd) { bd = d; best = k; } });
        return best / 80;
    };
    let drag = null;
    pull.style.touchAction = 'none';
    pull.addEventListener('pointerdown', e => {
        e.stopPropagation(); e.preventDefault();
        drag = { start: open.has(pk.id) ? 1 : 0, t: open.has(pk.id) ? 1 : 0, moved: false };
        try { pull.setPointerCapture(e.pointerId); } catch {}
    });
    pull.addEventListener('pointermove', e => {
        if (!drag) return;
        const t = tAt(e);
        if (Math.abs(t - drag.start) > .04) drag.moved = true;
        if (drag.moved) { drag.t = t; place(pk, t); }
    });
    const release = e => {
        if (!drag) return;
        const d = drag; drag = null;
        if (!d.moved) return toggle(e);
        if (open.has(pk.id)) d.t < .6 ? zipUp(pk, d.t) : slide(pk, d.t, 1);
        else d.t > .4 ? unzip(pk, d.t) : slide(pk, d.t, 0);
    };
    pull.addEventListener('pointerup', release);
    pull.addEventListener('pointercancel', () => { if (drag) { const d = drag; drag = null; slide(pk, d.t, d.start); } });
    pull.addEventListener('click', e => e.stopPropagation());
    pull.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
    // tapping the pocket itself works too, not just the tiny pull
    path.addEventListener('click', toggle);
    g.querySelector('.teeth').addEventListener('click', toggle);
});
function place(pk, t) {
    const { path, pull, len } = pk.el;
    const pt = path.getPointAtLength(len * t);
    pull.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    if (pk.id === 'front') hangCharms(pt);
    path.style.strokeDashoffset = len * (1 - t);
}
function slide(pk, from, to) {
    // stop-motion steps on a plain timer (frame timers pause in background tabs, which stalled the queue)
    return new Promise(res => {
        if (reduce || from === to) { place(pk, to); return res(); }
        let step = 0; const steps = Math.max(2, Math.round(10 * Math.abs(to - from)));
        const timer = setInterval(() => {
            step++;
            place(pk, from + (to - from) * step / steps);
            if (step >= steps) { clearInterval(timer); res(); }
        }, 52);
    });
}


// the side pocket: my Stanley is always out
stage.classList.add('idle');
// the side pocket: my Stanley stands in the backpack's water bottle holder
const bottle = document.createElement('span');
bottle.className = 'bottle';
bottle.setAttribute('role', 'button');
bottle.setAttribute('tabindex', '0');
bottle.setAttribute('aria-label', 'My pink Stanley, in the backpack’s water bottle pocket');
bottle.innerHTML = ITEMS.find(i => i.id === 'stanley').art + '<span class="holder" aria-hidden="true"></span>';
bagBtn.appendChild(bottle);
// wrap the cap so it can open
const capRect = bottle.querySelector('svg rect[x="21"][y="6"]');
if (capRect) { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'lid'); capRect.replaceWith(g); g.appendChild(capRect); }
let sips = 0;
const openBottle = e => {
    e.stopPropagation(); e.preventDefault();
    const out = bottle.classList.contains('out');
    if (!out) { bottle.classList.add('out'); bottle.setAttribute('aria-label', 'My pink Stanley, out of the pocket. Tap the lid to open it, the bottle for my water tracker, the pocket to put it back'); return; }
    if (e.target.closest && e.target.closest('.lid')) {
        const lid = bottle.querySelector('.lid');
        if (bottle.classList.contains('lid-open')) {
            bottle.classList.remove('lid-open'); lid.classList.add('closing');
            setTimeout(() => lid.classList.remove('closing'), 650);
            toast('lid’s back on. no spills ♡');
        } else { lid.classList.remove('closing'); bottle.classList.add('lid-open'); sips++; toast(sips === 1 ? 'sip ♡ (one more than usual)' : `sip #${sips}. who even am i`); }
        return;
    }
    if (e.target.closest && e.target.closest('.holder')) { bsvg.style.transform = ''; bottle.classList.remove('out', 'lid-open', 'free'); bottle.querySelector('.lid').classList.remove('closing'); toast('back in its pocket'); return; }
    pickUp(ITEMS.find(i => i.id === 'stanley'));
};
// grab the Stanley: pull it out of the side pocket, set it down anywhere, drag it back over the pocket to put it away
let bdrag = null, bskip = false;
const bsvg = bottle.querySelector('svg');
bsvg.style.touchAction = 'none';
bsvg.addEventListener('pointerdown', e => {
    e.stopPropagation();
    const cur = (bsvg.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/) || [0, 0, 0]).slice(1).map(Number);
    bdrag = { x: e.clientX, y: e.clientY, ox: cur[0], oy: cur[1], moved: false };
    try { bsvg.setPointerCapture(e.pointerId); } catch {}
});
bsvg.addEventListener('pointermove', e => {
    if (!bdrag) return;
    const dx = e.clientX - bdrag.x, dy = e.clientY - bdrag.y;
    if (!bdrag.moved && Math.hypot(dx, dy) < 6) return;
    bdrag.moved = true;
    bottle.classList.add('free', 'dragging');
    const h = bsvg.getBoundingClientRect().height, lift = !bdrag.ox && !bdrag.oy && bottle.classList.contains('out') && !bottle.classList.contains('free') ? -h * .46 : 0;
    bsvg.style.transform = `translate(${bdrag.ox + dx}px, ${bdrag.oy + dy + lift}px)`;
});
const bdrop = () => {
    if (!bdrag) return;
    const d = bdrag; bdrag = null; bottle.classList.remove('dragging');
    if (!d.moved) return;
    bskip = true;
    const m = bsvg.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/), x = m ? +m[1] : 0, y = m ? +m[2] : 0;
    const h = bsvg.getBoundingClientRect().height;
    if (Math.abs(x) < 50 && y > -h * .75 && y < h * .3) {   // dropped over its pocket: slide back in
        bsvg.style.transform = ''; bottle.classList.remove('free', 'out', 'lid-open');
        toast('back in its pocket ♡');
    } else { bottle.classList.add('out'); toast('hydrated? we’ll see.'); }
};
bsvg.addEventListener('pointerup', bdrop);
bsvg.addEventListener('pointercancel', bdrop);
bottle.addEventListener('click', e => { if (bskip) { bskip = false; e.stopPropagation(); return; } openBottle(e); });
bottle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openBottle(e); });


/* ---------- live layout: whatever is out of the bag gets spread evenly around it, at real size ----------
   1 cm = 0.94% of the table width (the 32 cm backpack is 30%). Table is 106.4 cm wide; height grows if needed. */
const CM = 0.94, TW = 100 / CM, BAG_CY = 75;
const sizeOf = it => {
    const w = it.w / CM, m = (it.art || '').match(/viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"/);
    const h = m ? w * (+m[4] / +m[3]) : w;
    const r = Math.abs(it.r || 0) * Math.PI / 180;   // rotated bounding box
    return { it, w: w * Math.cos(r) + h * Math.sin(r), h: w * Math.sin(r) + h * Math.cos(r) };
};
function shelf(list, x0, x1, y0, gap = 2.2) {
    // rows left to right, each row centered; returns placed items and the height used
    const rows = []; let row = [], rw = 0;
    for (const b of list) { if (row.length && rw + gap + b.w > x1 - x0) { rows.push(row); row = []; rw = 0; } rw += (row.length ? gap : 0) + b.w; row.push(b); }
    if (row.length) rows.push(row);
    let y = y0; const out = [];
    for (const r of rows) {
        const rh = Math.max(...r.map(b => b.h)), total = r.reduce((a, b) => a + b.w, 0) + gap * (r.length - 1);
        let x = x0 + (x1 - x0 - total) / 2;
        for (const b of r) { out.push({ ...b, cx: x + b.w / 2, cy: y + rh / 2 }); x += b.w + gap; }
        y += rh + gap;
    }
    return { out, used: y - y0 };
}
function relayout() {
    if (phone()) return;
    let items = ITEMS.filter(i => i.zip !== 'side' && i.zip !== 'attached' && open.has(i.zip)).map(sizeOf);
    // the binder and the Erin Condrens travel together: the notebooks sit stacked on the binder, like in my bag
    const bi = items.find(b => b.it.id === 'binder'), nb = items.find(b => b.it.id === 'notebooks');
    if (bi && nb) {
        items = items.filter(b => b !== bi && b !== nb);
        items.push({ it: { id: '__stack' }, w: bi.w * .62 + nb.w, h: Math.max(bi.h, nb.h) + 2, parts: [[bi, bi.w / 2, 0], [nb, bi.w * .62 + nb.w / 2, 2]] });
    }
    items.sort((a, b) => b.w * b.h - a.w * a.h);
    if (!items.length) { stage.style.aspectRatio = ''; bagBtn.style.top = ''; return; }
    const bands = {
        top: { x0: 2, x1: TW - 2, y0: 2, y1: 45, list: [], cap: (TW - 4) * 43 },
        left: { x0: 2, x1: 29, y0: 47, y1: 103, list: [], cap: 27 * 56 },
        right: { x0: 83, x1: TW - 2, y0: 47, y1: 103, list: [], cap: 21.4 * 56 },
        bottom: { x0: 2, x1: TW - 2, y0: 105, y1: 999, list: [], cap: (TW - 4) * 45 }
    };
    const used = k => bands[k].list.reduce((a, b) => a + b.w * b.h, 0) / bands[k].cap;
    for (const b of items) {
        const fits = Object.keys(bands).filter(k => b.w <= bands[k].x1 - bands[k].x0 && b.h <= bands[k].y1 - bands[k].y0);
        fits.sort((a, c) => used(a) - used(c));
        bands[fits[0] || 'bottom'].list.push(b);
    }
    // pack; anything that spills out of the top/left/right goes to the bottom
    const placed = [];
    for (const k of ['top', 'left', 'right']) {
        const B = bands[k];
        let res = shelf(B.list, B.x0, B.x1, B.y0);
        while (res.used > B.y1 - B.y0 + 2 && B.list.length) { bands.bottom.list.push(B.list.pop()); res = shelf(B.list, B.x0, B.x1, B.y0); }
        const dy = Math.max(0, (B.y1 - B.y0 - res.used) / 2);
        placed.push(...res.out.map(b => ({ ...b, cy: b.cy + dy })));
    }
    const bot = shelf(bands.bottom.list.sort((a, b) => b.h - a.h), bands.bottom.x0, bands.bottom.x1, bands.bottom.y0);
    placed.push(...bot.out);
    const H = Math.max(114, bands.bottom.list.length ? bands.bottom.y0 + bot.used + 4 : 105);
    stage.style.aspectRatio = `${TW} / ${H}`;
    bagBtn.style.top = `${BAG_CY / H * 100}%`;
    for (const b of [...placed]) if (b.parts) for (const [p, dx, dy] of b.parts) placed.push({ ...p, cx: b.cx - b.w / 2 + dx, cy: b.cy + dy / 2 });
    for (const b of placed) {
        const li = document.getElementById('item-' + b.it.id); if (!li) continue;
        li.style.setProperty('--l', `${b.cx * CM}%`);
        li.style.setProperty('--t', `${b.cy / H * 100}%`);
    }
}

let busy = Promise.resolve();
function unzip(pk, from = 0) {
    busy = busy.then(async () => {
        if (open.has(pk.id)) return;
        open.add(pk.id);
        stage.classList.remove('idle');
        pk.el.pull.setAttribute('aria-pressed', 'true');
        pk.el.pull.setAttribute('aria-label', `Zip up: ${pk.label}`);
        pk.el.g.classList.add('open');
        $('#bag-hint').textContent = '';
        await slide(pk, from, 1);
        relayout();
        const bagBox = bagBtn.getBoundingClientRect();
        for (const it of ITEMS.filter(i => i.zip === pk.id)) {
            const li = document.getElementById('item-' + it.id);
            li.classList.add('out');
            li.querySelector('button').tabIndex = 0;
            if (!reduce) {
                const box = li.getBoundingClientRect();
                const dx = phone() ? 0 : bagBox.left + bagBox.width / 2 - (box.left + box.width / 2);
                const dy = phone() ? -40 : bagBox.top + bagBox.height * .3 - (box.top + box.height / 2);
                const base = phone() ? '' : 'translate(-50%, -50%) ';
                li.animate([
                    { transform: `${base}translate(${dx}px, ${dy}px) scale(.15) rotate(${it.r * 4}deg)`, opacity: 0 },
                    { transform: `${base}translate(${dx * .45}px, ${dy * .45 - 60}px) scale(.8) rotate(${-it.r * 2}deg)`, opacity: 1, offset: .55 },
                    { transform: `${base}rotate(${it.r}deg)`, opacity: 1 }
                ], { duration: 620, easing: 'steps(7, end)' });
                await new Promise(r => setTimeout(r, 150));
            }
        }
        $('#after').hidden = false;
        syncAllBtn();
    });
    return busy;
}
function zipUp(pk, from = 1) {
    busy = busy.then(async () => {
        if (!open.has(pk.id)) return;
        ITEMS.filter(i => i.zip === pk.id).forEach(it => {
            const li = document.getElementById('item-' + it.id);
            li.classList.remove('out'); li.querySelector('button').tabIndex = -1;
        });
        await slide(pk, from, 0);
        open.delete(pk.id);
        relayout();
        pk.el.g.classList.remove('open');
        pk.el.pull.setAttribute('aria-pressed', 'false');
        pk.el.pull.setAttribute('aria-label', `Unzip: ${pk.label}`);
        syncAllBtn();
        if (!open.size) { $('#after').hidden = true; $('#bag-hint').textContent = 'pull a zipper ↓'; stage.classList.add('idle'); stage.style.aspectRatio = ''; bagBtn.style.top = ''; }
    });
    return busy;
}
// one button at the top: unzips everything, or once it's all out, packs it all back up
const allBtn = $('#unzip-all');
const syncAllBtn = () => { const all = BAG.pockets.every(pk => open.has(pk.id)); allBtn.textContent = all ? 'Pack it all back up' : 'Unzip everything'; allBtn.dataset.mode = all ? 'pack' : 'unzip'; };
allBtn.addEventListener('click', () => {
    if (allBtn.dataset.mode === 'pack') { $('#repack').click(); return; }
    $('#stage').scrollIntoView({ block: 'center', behavior: 'auto' }); BAG.pockets.forEach(pk => unzip(pk));
});
$('#repack').addEventListener('click', () => {
    BAG.pockets.forEach(pk => zipUp(pk));
    document.body.classList.remove('shades', 'cozy');
    bagBtn.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
});

list.addEventListener('click', e => {
    const part = e.target.closest('[data-part]');
    if (part) {
        if (part.dataset.part === 'mailbox') return toast('mailbox keys. mostly for packages i definitely needed 📦');
        if (part.dataset.part === 'pencil') return pickUp(ITEMS.find(i => i.id === 'pencil'));
        return pickUp(part.dataset.part === 'bmw' ? ITEMS.find(i => i.id === 'keys') : { id: 'apartment', name: 'my apartment fob', open: 'apartment' });
    }
    const b = e.target.closest('[data-item]');
    if (b) pickUp(ITEMS.find(i => i.id === b.dataset.item));
});


/* my hair things: two silk scrunchies, a wooden claw clip, a wide-tooth comb. Try each one on. */
function hairView(state) {
    return `
        <h2>My <em>hair</em> stuff</h2>
        <p class="note">two silk scrunchies and a wide-tooth comb. dark, long, and always done.</p>
        <p class="hair-hint hand" id="hair-hint"></p>
        <p class="comb-dots" id="comb-dots" aria-hidden="true"><i></i><i></i><i></i></p>
        <div class="hair-stage"><svg viewBox="0 0 220 330" class="hairdo" id="hairdo" data-state="${state}">
            <path d="M8 330 V300 C10 246 48 222 110 222 C172 222 210 246 212 300 V330Z" fill="#F3A9BB" stroke="#3A2626" stroke-width="3"/>
            <path d="M30 262 q12 8 22 30 M190 262 q-12 8 -22 30" fill="none" stroke="#D9849C" stroke-width="2"/>
            <path d="M92 190 h36 v40 q-18 10 -36 0z" fill="#C68E6A" stroke="#3A2626" stroke-width="2.5"/>
            <g class="h-down" transform="translate(0 -3) scale(1 1.12)">
                <path d="M110 20 C72 20 55 48 55 88 C55 112 51 128 45 146 C38 164 49 177 43 195 C37 213 47 227 41 245 C38 256 43 266 49 275 L55 268 L58 285 L66 271 L71 291 L80 275 L85 293 L94 277 L101 295 L110 279 L119 293 L126 277 L135 292 L141 274 L149 289 L154 270 L161 283 L166 268 L171 276 C178 266 183 256 179 244 C173 226 183 212 177 194 C171 176 181 164 175 146 C169 128 165 112 165 88 C165 48 148 20 110 20Z" fill="#4A2D1C" stroke="#2C1A10" stroke-width="2.5" stroke-linejoin="round"/>
                <g fill="none" stroke-linecap="round">
                    <path d="M110 22 V58" stroke="#7A4E2E" stroke-width="1.6" opacity=".8"/>
                    <path d="M100 26 C88 60 90 98 82 128 C74 158 90 178 80 206 C72 232 84 250 76 282" stroke="#6B4329" stroke-width="2.4"/>
                    <path d="M120 26 C132 62 130 98 138 126 C146 156 130 178 140 206 C148 232 136 252 144 284" stroke="#6B4329" stroke-width="2.4"/>
                    <path d="M88 34 C72 70 74 104 64 132 C56 158 70 178 60 204 C54 222 62 238 56 262" stroke="#5E3A24" stroke-width="2"/>
                    <path d="M132 34 C148 72 146 104 156 134 C164 160 150 180 160 206 C166 224 158 242 164 264" stroke="#5E3A24" stroke-width="2"/>
                    <path d="M108 60 C104 100 112 130 102 160 C94 186 110 208 100 236 C96 254 104 270 98 290" stroke="#6B4329" stroke-width="2"/>
                    <path d="M114 62 C120 100 112 132 122 160 C130 188 116 210 124 238 C128 256 120 272 126 288" stroke="#3E2418" stroke-width="2"/>
                    <path d="M84 110 C80 140 94 156 86 184 M138 112 C142 140 128 158 136 186 M70 150 C64 170 76 184 70 204" stroke="#8A5A34" stroke-width="1.8" opacity=".55"/>
                    <path d="M92 60 C86 96 94 124 86 150 M128 62 C134 98 126 126 134 152 M76 170 C70 190 80 204 74 224 M144 176 C150 196 140 210 146 232" stroke="#B9824B" stroke-width="3.2" opacity=".55"/>
                    <path d="M100 120 C96 140 104 156 98 176 M120 126 C124 146 116 162 122 182" stroke="#C9935A" stroke-width="2.2" opacity=".45"/>
                    <path d="M66 46 q-7 -7 -12 -4 M74 36 q-4 -8 -10 -8 M150 40 q8 -7 13 -4 M144 32 q5 -8 11 -7 M50 118 q-7 1 -10 -3 M170 150 q7 0 9 -6 M42 196 q-6 3 -9 -1 M178 214 q6 2 8 -3 M52 264 q-4 6 -2 12 M168 266 q4 6 2 11" stroke="#4A2D1C" stroke-width="1"/>
                </g></g>
            <g class="h-up"><ellipse cx="57" cy="112" rx="6" ry="10" fill="#C68E6A" stroke="#3A2626" stroke-width="2"/><ellipse cx="163" cy="112" rx="6" ry="10" fill="#C68E6A" stroke="#3A2626" stroke-width="2"/>
                <path d="M110 22 C68 22 54 54 56 96 C58 132 74 160 92 176 L128 176 C146 160 162 132 164 96 C166 54 152 22 110 22Z" fill="#4A2D1C" stroke="#2C1A10" stroke-width="2.5"/>
                <g fill="none" stroke-linecap="round"><path d="M72 60 C84 74 98 84 108 90 M148 60 C136 74 122 84 112 90 M110 26 V88 M62 104 C78 100 94 96 108 94 M158 104 C142 100 126 96 112 94 M70 150 C84 130 98 110 108 96 M150 150 C136 130 122 110 112 96" stroke="#6B4329" stroke-width="1.8"/>
                    <path d="M90 40 C98 60 104 76 108 88 M130 40 C122 60 116 76 112 88" stroke="#8A5A34" stroke-width="1.3" opacity=".6"/>
                    <path d="M66 52 q-7 -6 -11 -2 M154 52 q7 -6 11 -2" stroke="#4A2D1C" stroke-width="1"/></g></g>
            <g class="h-pony">
                <path d="M96 104 C82 128 92 150 80 174 C70 196 86 216 76 240 C70 256 80 272 72 290 C70 300 76 310 72 318 L80 312 C84 300 80 292 86 284 C94 270 86 254 94 240 Z" fill="#4A2D1C" stroke="#2C1A10" stroke-width="2" stroke-linejoin="round"/>
                <path d="M124 104 C138 128 128 152 140 176 C150 198 134 218 144 242 C150 258 140 274 148 292 C150 302 144 312 148 320 L140 314 C136 302 140 294 134 286 C126 272 134 256 126 242 Z" fill="#4A2D1C" stroke="#2C1A10" stroke-width="2" stroke-linejoin="round"/>
                <path d="M100 100 C90 126 104 148 94 172 C86 194 102 214 94 238 C88 256 100 272 94 290 C92 300 98 310 96 322 L104 312 C106 300 102 290 108 280 C114 266 104 252 110 238 C116 222 106 206 112 190 C118 174 108 156 114 140 C118 126 116 112 120 100Z" fill="#553420" stroke="#2C1A10" stroke-width="2" stroke-linejoin="round"/>
                <path d="M106 102 C118 128 106 150 118 172 C128 192 114 212 122 234 C128 252 118 270 124 288 C126 298 120 308 124 318 L116 312 C114 300 118 292 112 282 C106 268 116 252 108 238 Z" fill="#4A2D1C" stroke="#2C1A10" stroke-width="2" stroke-linejoin="round"/>
                <g fill="none" stroke-linecap="round"><path d="M88 150 C82 170 94 186 86 206 M132 156 C138 176 126 192 134 212 M100 200 C94 222 106 238 98 262 M120 206 C126 226 114 244 120 266" stroke="#8A5A34" stroke-width="1.6" opacity=".6"/>
                    <path d="M98 130 C92 146 100 160 94 176 M118 130 C124 148 116 162 122 178" stroke="#6B4329" stroke-width="1.4"/>
                    <path d="M74 236 q-8 2 -10 -4 M146 244 q8 2 10 -4 M80 290 q-6 4 -6 10 M142 296 q6 4 6 10 M96 322 q-2 5 1 8 M124 318 q3 5 0 8" stroke="#4A2D1C" stroke-width=".9"/></g>
                <g fill="none" stroke="#4A2D1C" stroke-width=".9" stroke-linecap="round"><path d="M58 100 q-4 -6 -2 -11 M162 100 q4 -6 2 -11 M62 124 q-5 2 -6 7 M158 124 q5 2 6 7 M96 176 q-2 6 1 10 M124 176 q2 6 -1 10 M86 26 q-3 -7 -9 -8 M134 26 q3 -7 9 -8"/></g>
                <g class="scr-on">${window.SCRUNCHIE(110, 96, 16, ...window.SCR_PINK)}</g></g>

            <g class="h-tangle" id="tangle" fill="none" stroke-linecap="round">
                <g class="t1"><path d="M56 60 q-4 -2.7 -8.2 -0.8 M165 69 q4 -3.8 8.5 -2.6 M55 78 q-4 -2.0 -9.3 -1.4 M166 87 q4 -2.7 10.0 -0.2 M54 96 q-4 -4.5 -7.9 0.8 M167 105 q4 -2.5 8.5 2.2 M53 114 q-4 -3.6 -9.0 1.0 M168 123 q4 -2.2 9.0 0.5 M52 132 q-4 -2.9 -6.1 2.2 M169 141 q4 -3.4 8.9 2.3 M51 150 q-4 -4.1 -9.7 -0.6 M170 159 q4 -4.4 7.8 2.6 M50 168 q-4 -4.6 -6.4 -2.2 M171 177 q4 -2.7 9.9 -0.4 M48 186 q-4 -3.9 -7.2 0.0 M172 195 q4 -3.2 7.4 0.5 M47 204 q-4 -3.8 -9.6 1.1 M173 213 q4 -4.8 9.4 2.9 M46 222 q-4 -4.0 -6.7 2.2 M174 231 q4 -4.9 9.6 0.4 M45 240 q-4 -4.1 -6.8 2.0 M175 249 q4 -3.7 7.1 -2.6 M44 258 q-4 -4.6 -10.0 -2.5 M176 267 q4 -4.4 7.6 -2.1 M43 276 q-4 -2.9 -9.1 2.2 M178 285 q4 -2.1 8.5 -2.7" stroke="#5E3A24" stroke-width="1"/><path d="M84 30 q-2 -6 -4.4 -7 M96 24 q-1 -6 -2.2 -7 M108 22 q0.5 -6 1.1 -7 M120 23 q1.5 -6 3.3 -7 M134 28 q2.5 -6 5.5 -7" stroke="#5E3A24" stroke-width="1"/></g>
                <g class="t2"><path d="M66 110 C90.5 120 89.0 133.0 99.0 139.0 S120 158 132 168" stroke="#8A5A34" stroke-width="1.5" opacity=".75"/><path d="M69 114 C92.5 124 91.0 137.0 101.0 143.0 S122 162 134 172" stroke="#6B4329" stroke-width="1.2" opacity=".7"/><path d="M150 118 C142.5 128 109.0 148.0 119.0 154.0 S76 180 88 190" stroke="#8A5A34" stroke-width="1.5" opacity=".75"/><path d="M153 122 C144.5 132 111.0 152.0 121.0 158.0 S78 184 90 194" stroke="#6B4329" stroke-width="1.2" opacity=".7"/><path d="M72 170 C97.0 180 96.0 197.0 106.0 203.0 S128 226 140 236" stroke="#8A5A34" stroke-width="1.5" opacity=".75"/><path d="M75 174 C99.0 184 98.0 201.0 108.0 207.0 S130 230 142 240" stroke="#6B4329" stroke-width="1.2" opacity=".7"/><path d="M146 180 C138.0 190 104.0 210.0 114.0 216.0 S70 242 82 252" stroke="#8A5A34" stroke-width="1.5" opacity=".75"/><path d="M149 184 C140.0 194 106.0 214.0 116.0 220.0 S72 246 84 256" stroke="#6B4329" stroke-width="1.2" opacity=".7"/><path d="M96 140 C117.5 150 113.0 167.0 123.0 173.0 S138 196 150 206" stroke="#8A5A34" stroke-width="1.5" opacity=".75"/><path d="M99 144 C119.5 154 115.0 171.0 125.0 177.0 S140 200 152 210" stroke="#6B4329" stroke-width="1.2" opacity=".7"/><path d="M120 210 C115.5 220 85.0 234.0 95.0 240.0 S58 260 70 270" stroke="#8A5A34" stroke-width="1.5" opacity=".75"/><path d="M123 214 C117.5 224 87.0 238.0 97.0 244.0 S60 264 72 274" stroke="#6B4329" stroke-width="1.2" opacity=".7"/></g>
                <g class="t3"><path d="M44 262 C40 276 46 288 40 300 M58 270 C54 286 62 296 56 312 M78 278 C74 294 82 304 76 318 M146 276 C150 292 142 302 148 316 M164 268 C170 282 162 294 168 306 M178 258 C184 272 178 284 184 296" stroke="#4A2D1C" stroke-width="3.4"/>
                    <path d="M52 296 q10 -6 20 2 M150 300 q10 -8 20 0" stroke="#6B4329" stroke-width="1.2"/></g></g>
            <g class="h-braid" id="braid"><ellipse cx="57" cy="112" rx="6" ry="10" fill="#C68E6A" stroke="#3A2626" stroke-width="2"/><ellipse cx="163" cy="112" rx="6" ry="10" fill="#C68E6A" stroke="#3A2626" stroke-width="2"/>
                <path d="M110 22 C68 22 54 54 56 96 C58 132 76 162 98 182 L122 182 C144 162 162 132 164 96 C166 54 152 22 110 22Z" fill="#4A2D1C" stroke="#2C1A10" stroke-width="2.5"/>
                <g fill="none" stroke-linecap="round"><path d="M110 23 V62" stroke="#7A4E2E" stroke-width="1.5"/>
                    <path d="M104 26 C90 70 94 130 108 182 M116 26 C130 70 126 130 112 182 M88 34 C70 80 80 140 106 182 M132 34 C150 80 140 140 114 182 M72 52 C58 100 76 150 104 182 M148 52 C162 100 144 150 116 182" stroke="#6B4329" stroke-width="2"/>
                    <path d="M96 40 C86 90 92 140 108 180 M124 40 C134 90 128 140 112 180" stroke="#8A5A34" stroke-width="1.4" opacity=".55"/>
                    <path d="M62 44 q-7 -6 -11 -2 M156 46 q7 -6 12 -3 M54 120 q-6 2 -9 -3 M166 124 q6 1 8 -4" stroke="#4A2D1C" stroke-width="1"/></g>
                <g class="loose" fill="none" stroke-linecap="round"><path d="M102 184 C94 214 108 236 98 262 C92 284 102 300 98 324" stroke="#4A2D1C" stroke-width="10"/><path d="M110 184 C116 214 102 238 112 264 C118 284 106 302 112 326" stroke="#553420" stroke-width="10"/><path d="M118 184 C128 212 116 236 124 260 C130 280 120 300 124 322" stroke="#4A2D1C" stroke-width="10"/></g>
                ${[46, 46, 45, 43, 41, 38, 34, 30, 25, 20, 15, 11].map((w, k) => { const y = 190 + k * 10.6, side = k % 2 ? 1 : -1, h = Math.max(6, 12.5 - k * .55); const fz = [[-w / 2 + 2, -2, -5, -3], [w / 2 - 3, 1, 5, -2], [-2, -h + 1, -2, -4]].slice(0, k % 3 + 1).map(([x, yy, dx, dy]) => `M${x} ${yy} l${dx} ${dy}`).join(' '); return `<g class="seg" data-k="${k}" transform="translate(${110 + side * (6.5 - k * .45)} ${y}) rotate(${side * -30})"><path d="M${-w / 2} 0 Q0 ${-h} ${w / 2} 0 Q0 ${h} ${-w / 2} 0Z" fill="#4A2D1C" stroke="#2C1A10" stroke-width="1.5"/><path d="M${-w / 2 + 4} -1 Q0 ${-h / 2 - 1} ${w / 2 - 4} -1 M${-w / 2 + 5} 2 Q0 ${-h / 4} ${w / 2 - 5} 2" fill="none" stroke="#6B4329" stroke-width="1.2"/><path d="M${-w / 2 + 6} -3 Q-2 ${-h / 2 - 2} ${w / 5} ${-h / 2}" fill="none" stroke="#B07E4A" stroke-width="1" opacity=".55"/><path d="${fz}" fill="none" stroke="#4A2D1C" stroke-width=".8" stroke-linecap="round"/></g>`; }).join('')}
                <path class="wisp" d="M92 196 q-9 5 -8 13 M128 206 q9 4 8 12 M96 232 q-8 4 -8 11 M124 250 q7 3 7 9 M56 104 q-5 -5 -3 -11 M164 104 q5 -5 3 -11 M60 126 q-5 3 -5 8 M160 126 q5 3 5 8 M100 178 q-3 6 0 10 M120 178 q3 6 0 10" fill="none" stroke="#4A2D1C" stroke-width=".9" stroke-linecap="round"/>
                <g class="braid-tie">${window.SCRUNCHIE(110, 312, 7, ...window.SCR_PINK)}</g>
                <path class="braid-end" d="M108 318 q-4 5 -1 10 M110 319 q2 5 -1 10 M112 318 q4 4 2 9" fill="none" stroke="#4A2D1C" stroke-width="2" stroke-linecap="round"/></g>
            <g class="h-comb"><g id="combdrag" transform="translate(0 40)"><g transform="rotate(-45 110 40)">${ITEMS.find(i => i.id === 'comb').art.replace('<svg viewBox="0 0 150 150">', '<svg x="50" y="-20" width="120" height="120" viewBox="0 0 150 150">')}</g></g></g>
            <g class="h-spark" fill="#F6DB94" stroke="#3A2626" stroke-width="1"><path d="M28 120 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z"/><path d="M192 170 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z"/></g>
        </svg></div>
        <div class="row hair-btns">
            <button class="btn" type="button" data-hair="pony" data-scr="pink">Pink scrunchie</button>
            <button class="btn" type="button" data-hair="pony" data-scr="brown">Brown scrunchie</button>
            <button class="btn" type="button" data-hair="comb">Comb it out</button>
            <button class="btn" type="button" data-hair="braid">Braid it</button>
        </div>`;
}
function hairAfter(state) {
    const svg = $('#hairdo'), hint = $('#hair-hint');
    const lines = { pony: 'ponytail. silk, so no creases ♡' };
    let passes = 0, twists = 0;
    const tangle = $('#tangle'), comb = $('#combdrag'), segs = [...svg.querySelectorAll('#braid .seg')];
    const set = (st, scr) => {
        if (scr) svg.querySelector('.scr-on').innerHTML = window.SCRUNCHIE(110, 96, 16, ...(scr === 'brown' ? window.SCR_BROWN : window.SCR_PINK));
        svg.dataset.state = st;
        sheetBody.querySelectorAll('[data-hair]').forEach(b => b.classList.toggle('solid', b.dataset.hair === st && (!scr || b.dataset.scr === scr)));
        $('#comb-dots').style.display = st === 'comb' ? 'flex' : 'none';
        if (st === 'comb') { passes = 0; tangle.style.opacity = ''; tangle.dataset.p = 0; svg.classList.remove('smooth'); $('#comb-dots').dataset.p = 0; comb.setAttribute('transform', 'translate(0 40)'); hint.textContent = 'tangled from sleep and humidity. drag the comb down through it ↓'; }
        else if (st === 'braid') { twists = 0; segs.forEach(g => g.classList.remove('on')); svg.classList.remove('braided'); hint.textContent = 'tap the hair to cross one strand over. keep going ↓'; }
        else hint.textContent = '';
    };
    // combing: drag the comb down through the hair; three good passes and the tangles are gone
    let drag = null;
    svg.style.touchAction = 'none';
    const yAt = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()).y; };
    svg.addEventListener('pointerdown', e => {
        if (svg.dataset.state === 'braid') {
            if (twists >= segs.length) return;
            segs[twists++].classList.add('on');
            if (twists === segs.length) { svg.classList.add('braided'); hint.textContent = 'braided ♡ tied off with the pink scrunchie'; toast('look at that braid ♡'); }
            else hint.textContent = `${twists} of ${segs.length}. ${twists % 2 ? 'right over the middle' : 'left over the middle'}…`;
            return;
        }
        if (svg.dataset.state !== 'comb') return;
        drag = { y0: yAt(e), last: yAt(e) }; try { svg.setPointerCapture(e.pointerId); } catch {}
    });
    svg.addEventListener('pointermove', e => {
        if (!drag) return;
        const y = Math.max(20, Math.min(250, yAt(e) - 20));
        comb.setAttribute('transform', `translate(0 ${y})`);
        if (y - drag.y0 > 140) { drag.y0 = 9999; passes = Math.min(3, passes + 1); tangle.dataset.p = passes; $('#comb-dots').dataset.p = passes;
            if (passes >= 3) { svg.classList.add('smooth'); hint.textContent = 'tangle-free ♡ wide teeth, no breakage'; toast('silky. no knots. we love to see it'); }
            else hint.textContent = passes === 1 ? 'frizz is calming down… keep going ↓' : 'sections are separating. one more for the ends ↓'; }
    });
    const up = () => { if (!drag) return; drag = null; comb.setAttribute('transform', 'translate(0 40)'); };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    sheetBody.querySelectorAll('[data-hair]').forEach(b => b.onclick = () => { set(b.dataset.hair, b.dataset.scr); if (lines[b.dataset.hair]) toast(lines[b.dataset.hair]); });
    set(state, state === 'pony' ? 'pink' : null);
}


/* my Medici regulars card lives in the wallet's zip pocket: a vanilla latte a day, buy 10 & get 1 free */
const mediciStamps = () => { try { const n = parseInt(localStorage.getItem('medici-stamps'), 10); return Number.isFinite(n) ? n : 1; } catch { return 1; } };
const saveStamps = n => { try { localStorage.setItem('medici-stamps', String(n)); } catch {} };
function mediciHTML(n) {
    const arch = k => `<span class="m-slot${k < n ? ' on' : ''}"><svg viewBox="0 0 30 34" aria-hidden="true"><path d="M3 32 V15 a12 12 0 0 1 24 0 V32Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 26 v-9 l5 6 5 -6 v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>${k < n ? '<i>♡</i>' : ''}</span>`;
    return `<span class="medici-card"><span class="m-top"><span>REGULARS CARD</span><b>MEDICI</b><span>HAVE ONE ON US</span></span>
        <span class="m-grid">${Array.from({ length: 10 }, (_, k) => arch(k)).join('')}</span>
        <span class="m-band">BUY 10 DRINKS &amp; GET 1 FREE</span></span>`;
}


/* live weather (Open-Meteo: free, no API key, CORS-friendly). Austin, TX. */
let clockTimer = null, wxCache = null;
const WX = c => c === 0 ? ['☀️', 'clear'] : c <= 2 ? ['🌤️', 'mostly sunny'] : c === 3 ? ['☁️', 'cloudy'] : c <= 48 ? ['🌫️', 'foggy'] : c <= 57 ? ['🌦️', 'drizzle'] : c <= 67 ? ['🌧️', 'rain'] : c <= 77 ? ['❄️', 'snow'] : c <= 82 ? ['🌦️', 'showers'] : ['⛈️', 'storms'];
async function loadWeather() {
    if (wxCache && Date.now() - wxCache.at < 600000) return wxCache;
    try {
        const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=1');
        if (!r.ok) throw 0;
        const j = await r.json();
        let [icon, label] = WX(j.current.weather_code);
        if (!j.current.is_day && j.current.weather_code <= 1) icon = '🌙';
        wxCache = { at: Date.now(), icon, label, temp: Math.round(j.current.temperature_2m), hi: Math.round(j.daily.temperature_2m_max[0]), lo: Math.round(j.daily.temperature_2m_min[0]) };
        return wxCache;
    } catch { return null; }
}


/* fairy-gold glitter: a burst of sparkles from a point, drifting down across the whole screen */
function fairyDust(x, y) {
    if (reduce) return;
    const cv = document.createElement('canvas'), d = devicePixelRatio || 1;
    cv.style.cssText = 'position:fixed; inset:0; width:100vw; height:100vh; pointer-events:none; z-index:2147483647';
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    (sheet.open ? sheet : document.body).appendChild(cv);
    const ctx = cv.getContext('2d'); ctx.scale(d, d);
    const cols = ['#F6D365', '#FFE9A8', '#E7B44A', '#FFF6D5', '#F2C14E', '#FFD98A'];
    const ps = Array.from({ length: 170 }, () => {
        const a = -Math.PI / 2 - .9 + (Math.random() - .5) * 2.6, v = 3 + Math.random() * 9;
        return { x, y, vx: Math.cos(a) * v * (Math.random() < .5 ? 1 : 1.4), vy: Math.sin(a) * v, s: .8 + Math.random() * 2.6, c: cols[(Math.random() * cols.length) | 0], star: Math.random() < .35, life: 0, max: 90 + Math.random() * 70, tw: Math.random() * 6 };
    });
    const star = (p, r) => { ctx.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? r * .35 : r * 1.6, an = k * Math.PI / 4; ctx.lineTo(p.x + Math.cos(an) * rr, p.y + Math.sin(an) * rr); } ctx.closePath(); ctx.fill(); };
    let f = 0;
    const step = () => {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        let alive = 0;
        for (const p of ps) {
            if (p.life > p.max) continue; alive++;
            p.life++; p.vx *= .97; p.vy = p.vy * .97 + .09; p.x += p.vx; p.y += p.vy;
            const a = Math.max(0, 1 - p.life / p.max) * (.6 + .4 * Math.sin(p.tw + p.life * .3));
            ctx.globalAlpha = a; ctx.fillStyle = p.c; ctx.shadowColor = '#FFE9A8'; ctx.shadowBlur = 6;
            if (p.star) star(p, p.s); else { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); }
        }
        if (alive && ++f < 400) requestAnimationFrame(step); else cv.remove();
    };
    requestAnimationFrame(step);
}

/* ---------- picking something up ---------- */
function pickUp(it) {
    sheetLabel.textContent = it.name;
    sheetBody.innerHTML = typeof it.open === 'function' ? it.open() : (VIEWS[it.open] || (() => ''))();
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
    (AFTER[it.open] || (() => {}))();
}
sheet.addEventListener('click', e => {
    if (e.target === sheet || e.target.closest('[data-close]')) sheet.close();
});

/* ---------- what each thing shows you ---------- */
const VIEWS = {
    brushes: () => `
        <h2>My <em>Morphe</em> brushes</h2>
        <p class="note">m241 angled bronzer, m242 cream bronzer, m132 angled concealer, and the eye want it all 7-piece set.</p>
        <div class="mbrs" id="mbrs"><button type="button" class="mbr" data-br="0" style="--i:0" aria-label="Morphe M241 Angled Powder Bronzer"><svg viewBox="-24 -50 48 230"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-15.0 0 C-15.0 -21.0 -6.0 -42.0 4.5 -42.0 C15.0 -35.699999999999996 15.0 -12.6 15.0 0Z"/></g><path d="M-8.25 0 H8.25 L6.3 26 H-6.3Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-6.3 26 H6.3 L5.04 150 Q0 156 -5.04 150Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-2.5 32 V140" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 93) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>M241 Angled Powder Bronzer</span></button><button type="button" class="mbr" data-br="1" style="--i:1" aria-label="Morphe M242 Slanted Cream & Liquid Bronzer"><svg viewBox="-24 -50 48 230"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-14.0 0 V-19.599999999999998 C-14.0 -41.16 14.0 -41.16 14.0 -19.599999999999998 V0Z"/></g><path d="M-7.700000000000001 0 H7.700000000000001 L5.88 26 H-5.88Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-5.88 26 H5.88 L4.704 150 Q0 156 -4.704 150Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-2.4 32 V140" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 93) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>M242 Slanted Cream & Liquid Bronzer</span></button><button type="button" class="mbr" data-br="2" style="--i:2" aria-label="Morphe M132 Angled Concealer"><svg viewBox="-24 -50 48 230"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-8.0 0 V-12.32 L8.0 -22.4 V0Z"/></g><path d="M-4.4 0 H4.4 L3.36 26 H-3.36Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.36 26 H3.36 L2.688 150 Q0 156 -2.688 150Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.3 32 V140" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 93) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>M132 Angled Concealer</span></button><button type="button" class="mbr" data-br="3" style="--i:3" aria-label="Morphe Eye Tapered Blender"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-7.0 0 C-7.0 -11.759999999999998 -1.4000000000000001 -21.56 0 -22.539999999999996 C1.4000000000000001 -21.56 7.0 -11.759999999999998 7.0 0Z"/></g><path d="M-3.8500000000000005 0 H3.8500000000000005 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Tapered Blender</span></button><button type="button" class="mbr" data-br="4" style="--i:4" aria-label="Morphe Eye Pointed Crease"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-6.0 0 C-6.0 -10.079999999999998 -1.2000000000000002 -18.479999999999997 0 -19.319999999999997 C1.2000000000000002 -18.479999999999997 6.0 -10.079999999999998 6.0 0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Pointed Crease</span></button><button type="button" class="mbr" data-br="5" style="--i:5" aria-label="Morphe Eye Dome Shader"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-6.0 0 V-8.399999999999999 C-6.0 -17.639999999999997 6.0 -17.639999999999997 6.0 -8.399999999999999 V0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Dome Shader</span></button><button type="button" class="mbr" data-br="6" style="--i:6" aria-label="Morphe Eye Pencil"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-4.5 0 C-4.5 -7.56 -0.9 -13.860000000000001 0 -14.489999999999998 C0.9 -13.860000000000001 4.5 -7.56 4.5 0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Pencil</span></button><button type="button" class="mbr" data-br="7" style="--i:7" aria-label="Morphe Eye Flat Shader"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-5.5 0 V-10.779999999999998 Q0 -16.169999999999998 5.5 -10.779999999999998 V0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Flat Shader</span></button><button type="button" class="mbr" data-br="8" style="--i:8" aria-label="Morphe Eye Small Detail"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-4.0 0 V-6.72 Q0 -10.08 4.0 -6.72 V0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Small Detail</span></button><button type="button" class="mbr" data-br="9" style="--i:9" aria-label="Morphe Eye Angled Liner + Spoolie"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-5.0 0 V-5.6000000000000005 L5.0 -12.6 V0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text><g transform="translate(0 150)"><path d="M0 0 v14" stroke="#7A7470" stroke-width="1.4"/><path d="M-4 4 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 6 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 8 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 10 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 12 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 14 h8" stroke="#8A8480" stroke-width="1.2"/></g></svg><span>Angled Liner + Spoolie</span></button></div>
        <p class="hand mbr-note" id="mbr-note">tap a brush</p>`,

    journal: () => `
        <h2><em>her greatest power is believing in herself</em></h2>
        <p class="note">my pink journal. small, always on me, for the ideas that show up at the worst times.</p>
        <div class="jb" id="jb">
            <div class="jb-page jb-right"><div class="jb-lines" contenteditable="true" spellcheck="false" aria-label="Right page: leave an idea"></div></div>
            <div class="jb-cover" id="jb-cover">
                <div class="jb-front">${ITEMS.find(i => i.id === 'journal').art}<span class="jb-corner" aria-hidden="true">open ↘</span></div>
                <div class="jb-back jb-page"><div class="jb-lines" contenteditable="true" spellcheck="false" aria-label="Left page: leave an idea"></div></div>
            </div>
        </div>
        <p class="hand" id="jb-hint" style="text-align:center; color:var(--plum); margin:8px 0 0">tap the bottom-right corner to open it</p>`,
    perfume: () => `
        <h2>My <em>perfume</em></h2>
        <p class="note">philosophy amazing grace ballet rose, eau de parfum. front pocket, always.</p>
        <div class="pf-bottle" id="pf-bottle">${ITEMS.find(i => i.id === 'perfume').art}</div>
        <p class="hand pf-hint" id="pf-hint">pull the cap off ✨</p>
        <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="spritz">Take the cap off</button></div>
        <div class="notes3"><div><b>top</b><span>lychee · cassie flower</span></div><div><b>heart</b><span>dewy peony · jasmine petals · rose absolute</span></div><div><b>base</b><span>ambrette seeds · palisandre wood · ballet pink musk</span></div></div>`,
    boarding: () => `
        <h2>My <em>boarding pass</em></h2>
        <p class="note">front pocket, next to my passport. destination: wherever’s next.</p>
        <div class="bp-big">${ITEMS.find(i => i.id === 'boarding').art}</div>
        <div class="row"><button class="btn solid" type="button" id="bp-scan">Scan it</button></div>`,
    padfolio: () => `
        <h2>My <em>McCombs</em> padfolio</h2>
        <p class="note">my résumé on the left, my notes on the right, a baby pink pen in the middle. ready for anything.</p>
        <div class="pf">
            <div class="pf-left">
                <div class="pf-stack" aria-hidden="true"><span></span><span></span></div>
                <div class="pf-resume" id="pf-resume" role="button" tabindex="0" aria-label="My résumé: tap to pull it out"><img src="assets/img/resume.png" alt="My résumé"><span class="pf-take">pull it out ↑</span><a class="pf-open" href="https://suhanitiwari.com/resume" target="_blank" rel="noopener">open the full résumé ↗</a></div>
                <div class="bc" id="bc" role="button" tabindex="0" aria-label="My business card: tap to flip it"><span class="bc-in">
                    <span class="bc-f"><b>Suhani Tiwari</b><i>MIS + Psychology · UT Austin</i><em>product · brand · technology</em><span class="bc-heart">♡</span></span>
                    <span class="bc-b"><a href="https://suhanitiwari.com" target="_blank" rel="noopener">suhanitiwari.com ↗</a><a href="https://www.linkedin.com/in/suhxnitiwari" target="_blank" rel="noopener">linkedin.com/in/suhxnitiwari ↗</a><a href="mailto:suhanitiwari@utexas.edu">suhanitiwari@utexas.edu ✉</a><em>let’s get coffee ☕</em></span>
                </span></div>
                <span class="pf-pen" aria-hidden="true"><svg viewBox="0 0 30 150">
                    <path d="M15 8 c-6 -7 -13 -4 -10 1 c2 3 7 2 10 -1 c3 3 8 4 10 1 c3 -5 -4 -8 -10 -1z" fill="#F7A8C0" stroke="#3A2626" stroke-width="1.2"/><circle cx="15" cy="8" r="2" fill="#E57A9E" stroke="#3A2626" stroke-width="1"/>
                    <rect x="10" y="10" width="10" height="8" rx="2" fill="#FBD3DF" stroke="#3A2626" stroke-width="1.2"/>
                    <rect x="9" y="17" width="12" height="86" rx="5" fill="#F9C4D3" stroke="#3A2626" stroke-width="1.4"/>
                    <path d="M20 20 h3 v40 l-2.5 3 h-.5z" fill="#F3B0C4" stroke="#3A2626" stroke-width="1"/><path d="M21.5 52 c-1.6 -1.6 -3.6 0 -1.4 2.2 l1.4 1.4 1.4 -1.4 c2.2 -2.2 .2 -3.8 -1.4 -2.2z" fill="#E0568F"/>
                    <rect x="9" y="102" width="12" height="22" rx="2" fill="#F7D9E2" stroke="#3A2626" stroke-width="1.2"/><path d="M10 106 h10 M10 110 h10 M10 114 h10 M10 118 h10" stroke="#E7A9BC" stroke-width="1"/>
                    <path d="M9 124 L15 140 L21 124Z" fill="#F9C4D3" stroke="#3A2626" stroke-width="1.2"/><path d="M15 140 v5" stroke="#8A8A90" stroke-width="1.2"/>
                    <path d="M12 24 v74" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></svg></span>
            </div>
            <div class="pf-right"><div class="pf-legal" aria-label="My legal pad: the roles I'm going for">
                <p>roles i’m going for:</p>
                <p>♡ product marketing manager</p>
                <p>♡ product manager</p>
                <p>♡ brand strategist</p>
                <p>♡ technology consultant</p>
                <p class="pf-u">→ work where technology meets people</p>
            </div></div>
        </div>`,
    cap: () => `
        <h2>My <em>cap</em></h2>
        <p class="note">a cap is a must.</p>
        <p>Brown, with the NY stitched tone on tone. Goes with everything, especially the Chanel sunglasses. Bad hair day, sunny day, running-late day.</p>
        <div class="row"><button class="btn solid" type="button" id="cap-on">Put it on</button></div>`,
    romcom: () => `
        <h2><em>You Deserve Each Other</em></h2>
        <p class="note">sarah hogle. a paperback rom-com. it’s been in my backpack for three weeks. i keep saying i’ll read it.</p>
        <div class="rc-wrap"><div class="rc" id="rc">${[0,1,2,3,4,5].map(k => `<span class="rc-leaf" style="--k:${k}"></span>`).join('')}<div class="rc-page"><p class="hand">Chapter One</p><span></span><span></span><span></span><span></span><span></span></div><div class="rc-cover">${ITEMS.find(i => i.id === 'romcom').art}</div></div></div>
        <p class="rc-stats mono">days in my backpack: <b id="rc-days">21</b> · pages read: <b>0</b></p>
        <div class="row"><button class="btn solid" type="button" id="rc-read">Read it</button></div>`,
    hairpony: () => hairView('pony'),
    haircomb: () => hairView('comb'),

    bag: () => `
        <h2>My <em>backpack</em></h2>
        <p class="note">it goes everywhere with me. class, work, coffee, back to class.</p>
        <p>Everything I actually carry is on the table. Tap any of it. Or ask Sitara, the little charm hanging off the zipper.</p>`,

    makeup: () => `
        <div class="lipstick-big" id="lip">
            <svg viewBox="0 0 160 210" aria-label="Westman Atelier lipstick in Glögg">
                <g class="tube">
                    <rect x="20" y="108" width="54" height="96" rx="7" fill="#F7F7F5" stroke="#3A2626" stroke-width="3"/>
                    <path d="M28 116 v80" stroke="#E2E2DF" stroke-width="5" stroke-linecap="round"/>
                    <rect x="24" y="98" width="46" height="13" rx="4" fill="#EEEEEB" stroke="#3A2626" stroke-width="2.5"/>
                    <rect x="30" y="74" width="34" height="27" rx="3" fill="#F7F7F5" stroke="#3A2626" stroke-width="2.5"/>
                    <path d="M33 75 V48 C33 38 43 36 47 41 L61 58 V75Z" fill="#8E2A24" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/>
                    <path d="M37 50 q3 -6 8 -7" fill="none" stroke="#C45A4E" stroke-width="3" stroke-linecap="round"/>
                    <text x="47" y="168" text-anchor="middle" font-family="Instrument Sans" font-size="7" fill="#A9A9A6" transform="rotate(-90 47 156)" letter-spacing="1.6">WESTMAN ATELIER</text>
                </g>
                <g class="cap">
                    <rect x="20" y="38" width="54" height="64" rx="6" fill="#F7F7F5" stroke="#3A2626" stroke-width="3"/>
                    <path d="M20 46 q27 -6 54 0" fill="none" stroke="#E2E2DF" stroke-width="2"/>
                    <path d="M28 52 v40" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
                </g>
            </svg>
        </div>
        <h2>My <em>makeup</em></h2>
        <p class="note">all of it lives in my victoria’s secret makeup pouch</p>
        <div class="lists">
            <div class="love"><h3>always in my bag</h3><ul>
                <li><b>Westman Atelier lipstick, Glögg.</b> My favorite lipstick, period.</li>
                <li><b>Westman Atelier Baby Cheeks Blush Stick, Mimi.</b> Tawny beige. One swipe and done.</li>
                <li><b>Charlotte Tilbury Beautiful Skin Foundation, 6 Neutral.</b> My foundation.</li>
                <li><b>Hourglass Vanish Airbrush Concealer.</b> My favorite concealer. Full coverage, no creasing.</li>
                <li><b>Lancôme Lash Idôle mascara.</b> My favorite mascara. Lifts without the clumps.</li>
                <li><b>Morphe brushes.</b> M241 angled bronzer, M242 cream bronzer, M132 angled concealer, and the Eye Want It All 7-piece set.</li>
                <li><span class="todo">add another love</span></li>
            </ul></div>
            
        </div>`,

    mascara: () => `
        <div class="mascara-big" id="masc">
            <svg viewBox="0 -160 200 420" aria-label="Lancôme Lash Idôle mascara, wand out">
                <g class="wand">
                    <rect x="84" y="6" width="32" height="104" rx="5" fill="#E8C3B4" stroke="#3A2626" stroke-width="3"/>
                    <rect x="90" y="14" width="20" height="88" rx="3" fill="#1E1414"/>
                    <path d="M100 110 V170" stroke="#3A2626" stroke-width="4"/>
                    <g stroke="#1E1414" stroke-width="2.4" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => `<path d="M${92 - (i % 2) * 2} ${176 + i * 6} h${16 + (i % 2) * 4}"/>`).join('')}</g>
                    <rect x="96" y="172" width="8" height="74" rx="4" fill="#1E1414"/>
                </g>
                <g class="tube">
                    <rect x="84" y="112" width="32" height="140" rx="5" fill="#E8C3B4" stroke="#3A2626" stroke-width="3"/>
                    <rect x="90" y="120" width="20" height="124" rx="3" fill="#1E1414"/>
                    <text x="100" y="196" text-anchor="middle" font-family="Bodoni Moda" font-size="13" fill="#E8C3B4" transform="rotate(-90 100 186)" letter-spacing="1.5">IDÔLE</text>
                </g>
            </svg>
        </div>
        <h2>Lancôme <em>Lash Idôle</em></h2>
        <p class="note">my favorite mascara. lifts without the clumps.</p>
        <p>It lives in my Victoria’s Secret makeup pouch, right next to the Westman Glögg and my Morphe brushes.</p>
        <div class="row"><button class="btn solid" type="button" id="see-makeup">All my makeup</button></div>`,

    makeupbag: () => `
        <h2>My <em>makeup pouch</em></h2>
        <p class="note">victoria’s secret, pink stripes. unzip it.</p>
        <div class="mbag" id="mbag">
            <div class="mbag-inside" aria-live="polite">
                <button type="button" class="mk" data-mk="lipstick" style="--h:150px; --rise:-34px; --x:-105px; --a:-34deg; --d:0ms" aria-label="Westman Atelier lipstick, Glögg">${ITEMS.find(i => i.id === 'lipstick').art}<span>lipstick</span></button>
                <button type="button" class="mk" data-mk="mascara" style="--h:238px; --x:-21px; --a:-7deg; --d:180ms" aria-label="Lancôme Lash Idôle mascara">${ITEMS.find(i => i.id === 'mascara').art}<span>mascara</span></button>
                <button type="button" class="mk" data-mk="foundation" style="--h:238px; --x:21px; --a:7deg; --d:270ms" aria-label="Charlotte Tilbury Beautiful Skin Foundation, 6 Neutral">${ITEMS.find(i => i.id === 'foundation').art}<span>foundation</span></button>
                <button type="button" class="mk" data-mk="concealer" style="--h:187px; --x:105px; --a:34deg; --d:450ms" aria-label="Hourglass Vanish Airbrush Concealer">${ITEMS.find(i => i.id === 'concealer').art}<span>concealer</span></button>
                <button type="button" class="mk" data-mk="blush" style="--h:172px; --rise:-34px; --x:-63px; --a:-21deg; --d:90ms" aria-label="Westman Atelier Baby Cheeks blush stick, Mimi">${ITEMS.find(i => i.id === 'blush').art}<span>blush</span></button>
                <button type="button" class="mk brushes" data-mk="brushes" style="--h:255px; --x:63px; --a:21deg; --d:360ms" aria-label="My Morphe brushes"><svg viewBox="0 0 90 215"><g transform="rotate(-9 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M41 62 C38 44 42 26 45 18 C48 26 52 44 49 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(-5.5 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M38 62 C34 44 38 30 45 28 C52 30 56 44 52 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(-2 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M35 62 C27 42 33 20 45 18 C57 20 63 42 55 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(2 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M38 62 C33 46 37 30 45 29 C53 30 57 46 52 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(5.5 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M42 62 C41 52 42 44 45 40 C48 44 49 52 48 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(9 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><rect x="43" y="22" width="4" height="40" rx="2" fill="#8A8079"/><path d="M38 26 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 30 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 34 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 38 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 42 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 46 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 50 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 54 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 58 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/></g></svg><span>brushes</span></button>
            </div>
            <div class="mbag-front">
                <svg viewBox="0 0 300 170" aria-hidden="true"><defs><pattern id="vs2" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#F7C9D6"/><rect width="11" height="22" fill="#F29BB6"/></pattern></defs>
                    <path d="M14 34 C14 14 286 14 286 34 L274 154 C272 166 28 166 26 154Z" fill="url(#vs2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/>
                    <path class="mzip" d="M28 34 H272" stroke="#3A2626" stroke-width="3" stroke-dasharray="6 6"/>
                    <path class="mgap" d="M28 34 H272" stroke="#2A1E22" stroke-width="10" stroke-linecap="round"/>
                </svg>
                <button type="button" class="mpull" id="mpull" aria-label="Unzip the makeup pouch"><span></span></button>
            </div>
        </div>
        <div class="swatch" id="swatch" aria-live="polite"><svg viewBox="0 0 260 60" aria-hidden="true"><path id="swipe" d="M18 34 C60 14 110 46 150 28 S220 18 242 30" fill="none" stroke="#D2A27E" stroke-width="16" stroke-linecap="round"/></svg><span class="hand" id="swatch-label"></span></div>
        <p class="swatch-more"><button type="button" class="link" id="swatch-more" hidden>take a closer look ↗</button></p>
        <p class="pen-note" id="mk-note">pull the zipper</p>
        <div class="row" style="justify-content:center"><button class="btn" type="button" id="see-makeup2">All my makeup</button></div>`,

    apartment: () => `
        <div class="fob" style="width:110px">${SALTO_FOB}</div>
        <h2>My <em>apartment</em> fob</h2>
        <p class="note">this one i can handle.</p>
        <p>Address: wouldn’t you wanna knowwww.</p>
        <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="beep">Tap it on the reader</button></div>`,

    pencil: () => `
        <h2>My <em>Apple Pencil</em> Pro</h2>
        <p class="note">it lives on my ipad. go ahead, draw something.</p>
        <div class="swatches" id="swatches">${['#1B1B1F', '#E63F7A', '#7B4FD1', '#1F6FD1', '#18A39A', '#F0592B', '#F7D54A'].map((c, i) => `<button type="button" style="background:${c}" data-ink="${c}" aria-label="Color ${c}"${i === 0 ? ' class="on"' : ''}></button>`).join('')}</div>
        <div class="pad procreate-pad"><canvas id="pad-canvas" aria-label="Canvas: draw with my Apple Pencil"></canvas><span class="pad-hint" id="pad-hint">draw anything…</span><button type="button" class="pad-clear mono" id="pad-clear">clear</button></div>`,

    sketchbook: () => `
        <div class="spread" id="spread">
            <div class="l"><img id="art-img" src="" alt=""></div>
            <div class="r"><h3 id="art-title"></h3><p id="art-note"></p><p class="mono" id="art-num" style="color:var(--muted)"></p></div>
        </div>
        <div class="row" style="justify-content:space-between"><button class="btn" type="button" id="art-prev">← previous page</button><button class="btn solid" type="button" id="art-next">next page →</button></div>`,

    wallet: () => {
        // left panel and center panel, three slots each, like the real Victorine
        const order = ['dl', 'amexgold', 'id', 'bofa', 'amexblue', 'bofadebit'];   // as they really sit: license + Delta gold on the left, BofA silver up top in the middle
        const idx = k => CARDS.findIndex(c => c.kind === k);
        const slot = (k, n) => { const i = idx(k); return i < 0 ? '' : `<div class="vslot" style="--n:${n}">${cardHTML(CARDS[i], i)}<span class="pocket"></span></div>`; };
        return `
        <h2>My <em>wallet</em></h2>
        <p class="note">louis vuitton victorine. tap a card, or unzip the zip pocket.</p>
        <div class="vread" id="vread" aria-live="polite"></div>
        <div class="vw" id="vw">
            <button type="button" class="vw-closed" id="snap" aria-label="Open the wallet">${ITEMS.find(i => i.id === 'wallet').art}</button>
            <div class="vw-open" aria-hidden="true">
                <button type="button" class="vzip" id="vzip" aria-label="Zip pocket: unzip it" aria-pressed="false"><span class="zgap" aria-hidden="true"></span><span class="zpull" aria-hidden="true"></span></button>
                <div class="vpanel p1">${order.slice(0, 3).map(slot).join('')}</div>
                <div class="vgusset"></div>
                <div class="vpanel p2">${order.slice(3).map(slot).join('')}<span class="vstamp">SUHANI<br><small>LOUIS VUITTON<br>PARIS<br>made in Italy</small></span></div>
                <div class="vflap"><span class="vsnap"></span></div>
                <button type="button" class="vbills" id="vbills" aria-label="Bill compartment: take the cash out" aria-pressed="false">${[
                    ['₹500', '#B9B4A8', '#4E4A40'], ['₹200', '#EBC76A', '#6A4A08'], ['₹100', '#B9A9DC', '#3E2E70'], ['$20', '#B7CFAE', '#24401F'], ['$1', '#CFDCC6', '#33502D']
                ].map(([d, bg, ink], k) => `<span class="bill" style="--k:${k}; --bg:${bg}; --ink:${ink}"><b>${d}</b><i>${d[0] === '₹' ? 'भारतीय रिज़र्व बैंक' : 'THE UNITED STATES OF AMERICA'}</i></span>`).join('')}</button>
            </div>
            <button type="button" class="medici-peek" id="medici" aria-label="My Medici regulars card">${mediciHTML(mediciStamps())}</button>
        </div>
        <div class="row" style="justify-content:center"><button class="btn" type="button" id="vclose">Close the wallet</button></div>
        <div class="card-detail" id="card-detail" aria-live="polite"><p class="hand" style="font-size:1.4rem; color:var(--plum); text-align:center">pick a card, any card</p></div>`;
    },

    mildliners: () => penView({
        title: 'My <em>Mildliner</em> pouch', note: 'the full 25-pack. every color is a class i took at ut austin.',
        list: PENS, front: ITEMS.find(i => i.id === 'pouch').front, pick: 'pick a highlighter, see the class',
        pen: c => `<svg viewBox="0 0 34 190"><rect x="9" y="44" width="16" height="112" rx="2" fill="#F7F7F4" stroke="#3A2626" stroke-width="1.8"/><rect x="11" y="46" width="3" height="108" fill="#fff" opacity=".9"/><path d="M8 4 Q8 2 10 2 H24 Q26 2 26 4 V46 H8Z" fill="${c}" stroke="#3A2626" stroke-width="1.8"/><rect x="10" y="4" width="4" height="40" fill="#fff" opacity=".35"/><path d="M8 40 H26" stroke="#3A2626" stroke-width="1" opacity=".35"/><path d="M8 154 H26 V180 Q26 184 22 184 H12 Q8 184 8 180Z" fill="${c}" stroke="#3A2626" stroke-width="1.8"/><path d="M8 162 H26" stroke="#3A2626" stroke-width="1" opacity=".35"/><text x="17" y="62" font-family="Instrument Sans" font-size="5.6" font-weight="600" letter-spacing="1.4" fill="#8A8A8E" transform="rotate(90 17 62)">MILDLINER</text><text x="17" y="118" font-family="Instrument Sans" font-size="4.4" font-weight="800" letter-spacing=".8" fill="#3A3A3E" transform="rotate(90 17 118)">ZEBRA</text><rect x="13" y="140" width="8" height="6" rx="1" fill="${c}" opacity=".9"/></svg>`
    }),

    gelpens: () => penView({
        title: 'My <em>Paper Mate</em> pouch', note: 'paper mate inkjoy gel. pick a color and type. switch pens mid-sentence.',
        list: GELPENS, front: ITEMS.find(i => i.id === 'penpouch').art, pick: 'pick a pen',
        pen: c => `<svg viewBox="0 0 34 190"><rect x="7" y="16" width="20" height="150" rx="9" fill="${c}" stroke="#3A2626" stroke-width="3"/><rect x="9" y="22" width="5" height="120" rx="2.5" fill="#fff" opacity=".35"/><rect x="21" y="10" width="6" height="56" rx="3" fill="${c}" stroke="#3A2626" stroke-width="2.5"/><rect x="11" y="2" width="12" height="16" rx="4" fill="${c}" stroke="#3A2626" stroke-width="2.5"/><path d="M11 166 L17 186 L23 166Z" fill="#E8E2DC" stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    }),

    sunglasses: () => `
        <h2>How I <em>see</em> things</h2>
        <p class="note">chanel square sunglasses. black and beige, brown gradient lenses, gold CC on the arms. put them on.</p>
        <div class="sg-big">${ITEMS.find(i => i.id === 'sunglasses').art}</div>
        <p>Everything I look at, I look at the same way: why would someone choose this? That’s the lens behind my psychology classes, my MIS projects and every marketing deck I’ve made.</p>
        <div class="row"><button class="btn solid" type="button" id="shades">${document.body.classList.contains('shades') ? 'Take them off' : 'Put them on'}</button></div>
        <p class="shades-note" id="shades-note">${document.body.classList.contains('shades') ? 'ooh, very mysterious.' : ''}</p>`,

    keys: () => `
        <div class="fob" id="fob">${BMW_FOB}</div>
        <h2>My BMW keys</h2>
        <p class="note" style="font-size:1.8rem">whoops, i’m just a girl 🎀</p>
        <p class="note" style="margin-top:-12px">(it’s the curb’s fault. it came out of nowhere.)</p>
        <div class="fob-btns">
            <button class="btn" type="button" data-fob="lock">🔒 Lock</button>
            <button class="btn" type="button" data-fob="unlock">🔓 Unlock</button>
            <button class="btn" type="button" data-fob="trunk">Trunk</button>
            <button class="btn solid" type="button" data-fob="panic">Panic</button>
        </div>
        <div class="record"><p class="mono" style="margin:0 0 6px; color:var(--plum)">My driving record, honestly</p><ul>
            <li>Parallel parking: working on it</li>
            <li>Sense of direction: that’s what Maps is for</li>
            <li>Confidence: unmatched</li>
            <li>Skill: <span class="hand" style="font-size:1.3rem">whoops</span></li>
        </ul></div>`,

    laptop: () => `
        <h2>My <em>MacBook Pro</em> <span class="mono" style="font-size:.7rem; color:var(--muted)">14-inch, silver</span></h2>
        <p class="note" id="lap-note">the stickers are load-bearing. tap one, or open it up.</p>
        <div class="lap-closed" id="lap-closed">
            <div class="lid-wrap">${LID(true)}<p class="stk-label hand" id="stk-label" aria-live="polite">every sticker opens something</p></div>
            <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="lap-open">Open the laptop</button></div>
        </div>
        <div class="desktop" id="desktop" hidden>
            <div class="menubar mono"><span></span><span id="lap-clock"></span></div>
            <div class="dfolders">${[
                ['Listening History', 'https://listening-history.onrender.com/'],
                ['Saturday in Austin', 'saturday'],
                ['RideFlow', 'https://suhanitiwari.com/home/work#mp-rideflow'],
                ['Owala Marathon', 'owala'],
                ['FuelFlow', 'fuelflow'],
                ['Girls Can Be Engineers', 'book'],
                ['Acacia Advisors', 'acacia'],
                ['suhanitiwari.com', 'https://suhanitiwari.com']
            ].map(([n, go]) => `<button type="button" class="dfolder" data-go="${go}">
                <svg viewBox="0 0 100 78" aria-hidden="true"><path d="M4 12 a6 6 0 0 1 6 -6 h26 l8 8 h46 a6 6 0 0 1 6 6 v4 H4z" fill="#4E9BE0"/><rect x="4" y="18" width="92" height="56" rx="7" fill="#7EC4F5"/><rect x="4" y="18" width="92" height="56" rx="7" fill="none" stroke="#5FA9E6" stroke-width="1.2"/><path d="M8 66 h84 M8 69 h84" stroke="#6BB4EC" stroke-width="1"/></svg>
                <span>${n}</span></button>`).join('')}</div>
            <div class="row" style="justify-content:center; margin-top:14px"><button class="btn" type="button" id="lap-close">Close the laptop</button></div>
        </div>`,

    mirror: () => `
        <div class="compact" id="compact" style="position:relative; width:200px; height:200px; margin:214px auto 14px; perspective:700px">
            <p class="cp-hint hand">drag the lid up or down</p>
            <div class="cp-base"><div class="cp-glass mag"><img src="assets/img/me.jpg" alt="Me, magnified"><span class="cp-shine"></span></div><span class="cp-tag">×2</span></div>
            <div id="lid" class="cp-lid">
                <div class="cp-out"><svg viewBox="-20 -20 40 40" aria-hidden="true"><g fill="none" stroke-linecap="butt"><circle cx="0" cy="0" r="17" fill="#0B0A0B" stroke="#C9CDD2" stroke-width="2.2"/><circle cx="0" cy="0" r="14.6" fill="none" stroke="#5A5D62" stroke-width=".8"/><path d="M-1.2 -6.8 A7.6 7.6 0 1 0 -1.2 6.8" stroke="#F4F2EE" stroke-width="2.4"/><path d="M1.2 -6.8 A7.6 7.6 0 1 1 1.2 6.8" stroke="#F4F2EE" stroke-width="2.4"/></g></svg></div>
                <div class="cp-in"><div class="cp-glass"><img src="assets/img/me.jpg" alt="Me, in the mirror"><span class="cp-shine"></span></div></div>
            </div>
        </div>
        <h2>Mirror, mirror: <em>the real me</em></h2>
        <p class="note">chanel miroir double facettes: a regular mirror in the lid, a magnifying one below. yes, the blair waldorf one.</p>
        <p>I’m Suhani. I study Management Information Systems and Psychology at UT Austin’s McCombs School of Business. I study why people choose what they choose, then build what they’d choose.</p>
        <p>I’m also a published children’s book author, the founder of two Girls Who Code chapters, and a digital artist who paints about growing up between two worlds.</p>
        <div class="row"><a class="btn solid" href="https://suhanitiwari.com" target="_blank" rel="noopener">My portfolio ↗</a></div>
        <p class="hand" style="font-size:1.5rem; color:var(--plum); margin:16px 0 0">you know you love me. xoxo ♡</p>`,

    stanley: () => `
        <h2>My pink <em>Stanley</em></h2>
        <p class="note">the all day slim bottle, in the bow print. do i drink enough water? no.</p>
        <p class="mono" style="color:var(--plum); margin:18px 0 8px">Today’s water, honestly</p>
        <div class="cups" id="cups" style="display:flex; gap:8px; flex-wrap:wrap">${Array.from({ length: 8 }, (_, i) => `<span class="cup${i < 2 ? ' full' : ''}" style="width:34px; height:44px; border:2.5px solid var(--ink); border-radius:4px 4px 10px 10px; background:${i < 2 ? 'var(--pink)' : 'var(--paper)'}; transition:background .4s"></span>`).join('')}</div>
        <p class="hand" id="cup-note" style="font-size:1.4rem; color:var(--plum); margin:10px 0 0">2 of 8. we’re working on it.</p>
        <div class="row"><button class="btn solid" type="button" id="sip">Take a sip for me</button></div>`,

    sweater: () => `
        <h2>My pink Ralph Lauren <em>cable knit</em></h2>
        <p class="note">pink, cable knit, always in my bag. i get cold easily.</p>
        <svg class="sw2 folded" id="sw" viewBox="0 0 360 300" role="img" aria-label="My pink cable knit V-neck sweater">
            <defs><pattern id="cable2" width="40" height="28" patternUnits="userSpaceOnUse"><rect width="40" height="28" fill="#F3A9BB"/><path d="M6 0 C14 7 14 7 6 14 C14 21 14 21 6 28 M14 0 C6 7 6 7 14 14 C6 21 6 21 14 28" fill="none" stroke="#D9849C" stroke-width="2.6"/><path d="M30 0 L38 14 L30 28 M30 0 L22 14 L30 28" fill="none" stroke="#DE8CA2" stroke-width="2.2"/><path d="M19 0 v28" stroke="#E395A9" stroke-width="1.6" stroke-dasharray="2 2"/></pattern>
                <pattern id="rib2" width="6" height="10" patternUnits="userSpaceOnUse"><rect width="6" height="10" fill="#E996AB"/><path d="M3 0 v10" stroke="#D27C93" stroke-width="2"/></pattern></defs>
            <path class="top" d="M100 170 L100 46 Q100 30 116 28 L150 22 L180 72 L210 22 L244 28 Q260 30 260 46 L260 170" fill="url(#cable2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/>
            <path d="M150 22 L180 72 L210 22 L200 20 L180 56 L160 20 Z" fill="url(#rib2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round" stroke-width="2"/>
            <path d="M162 20 L180 54 L198 20 Z" fill="#FBEFF2"/>
            <path d="M214 50 q3 -5 8 -5 l3 -3 2 1 -2 2 q2 2 1 5 M216 50 v3 M223 50 v3" fill="none" stroke="#2C3E7A" stroke-width="1.4" stroke-linecap="round"/>
            <g class="sl sl-l"><path d="M100 46 L100 126 L66 244 L36 236 L76 54 Q86 42 100 46 Z" fill="url(#cable2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/><path d="M66 244 L36 236 L30 258 L60 266 Z" fill="url(#rib2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round" stroke-width="2.4"/></g>
            <g class="sl sl-r"><path d="M260 46 L260 126 L294 244 L324 236 L284 54 Q274 42 260 46 Z" fill="url(#cable2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/><path d="M294 244 L324 236 L330 258 L300 266 Z" fill="url(#rib2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round" stroke-width="2.4"/></g>
            <g class="bot"><path d="M100 164 V254 H260 V164" fill="url(#cable2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/><rect x="100" y="250" width="160" height="24" rx="3" fill="url(#rib2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round" stroke-width="2.4"/></g>
        </svg>
        <p>It’s 100 degrees in Austin and 62 in every single classroom. The sweater comes to class, the library and every restaurant with the AC turned all the way up.</p>
        <div class="row"><button class="btn" type="button" id="sw-fold">Unfold it</button><button class="btn solid" type="button" id="wear">Put it on</button></div>`,

    notebooks: () => `
        <h2>My <em>Erin Condren</em> notebooks</h2>
        <p class="note">two custom ones. yes, i still take notes by hand.</p>
        <div class="ecb-row">
            <div class="ecb" data-ecb>
                <div class="ecb-page ec-page"><p class="hand ec-h">my classes</p><ul class="hand">
                    <li>Web App Development</li><li>Full-Stack Web App Development</li><li>Database Management</li>
                    <li>Problem Solving &amp; Programming</li><li>Strategic IT Management</li><li>Intro to IT Management</li>
                    <li>Intro to Data Science</li><li>Intro to Decision Science</li><li>Statistics for Business</li>
                </ul></div>
                <div class="ecb-cover"><div class="ecb-front">${window.EC([['#5B83C0', '#F4E6EE'], ['#FBEFF3', '#D64F8C'], ['#D44E8C', '#F4C9DA'], ['#FBEFF3', '#5B83C0']])}</div><div class="ecb-back"></div></div>
            </div>
            <div class="ecb" data-ecb>
                <div class="ecb-page ec-page"><p class="hand ec-h">notebook no. 2</p><p><span class="todo">what’s in this one?</span></p></div>
                <div class="ecb-cover"><div class="ecb-front">${window.EC([['#E0568F', '#F7D5E2'], ['#FBE6EC', '#8DA0C2'], ['#8EA2C4', '#EEF1F8'], ['#FBE6EC', '#E0568F']])}</div><div class="ecb-back"></div></div>
            </div>
        </div>
        <p class="hand" style="text-align:center; color:var(--plum); margin:6px 0 10px">tap a notebook to open it. tap again to close.</p>
        <div class="row"><a class="btn" href="https://suhanitiwari.com/home/study#coursework" target="_blank" rel="noopener">All my coursework ↗</a></div>`,

    binder: () => `
        <h2>My <em>pink binder</em></h2>
        <p class="note">case readings in the front, my own case studies in the back</p>
        <div class="binder-open">
            <div class="rings" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="bpages">${[
                ['owala', 'Owala Marathon Series', 'Brand strategy', 'assets/img/owala.jpg'],
                ['fuelflow', 'FuelFlow', 'Service concept', 'assets/img/fuelflow.jpg'],
                ['acacia', 'Acacia Advisors', 'Go-to-market', '']
            ].map(([k, n, t, img], i) => `<button type="button" class="bpage" data-case="${k}" style="--i:${i}">
                    <span class="holes" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span class="mono" style="color:var(--plum)">Case ${i + 1} · ${t}</span>
                    <b>${n}</b>${img ? `<img src="${img}" alt="">` : '<span class="bignum">+20%</span>'}
                </button>`).join('')}</div>
        </div>`,

    fuelflow: () => `
        <h2><em>FuelFlow</em></h2>
        <p class="note">feeding a campus between classes, without the line</p>
        <div class="stats"><div><b>60 sec</b><span>checkout</span></div><div><b>10g+</b><span>protein meals</span></div><div><b>≤ $12.50</b><span>every meal</span></div></div>
        <div class="shot"><img src="assets/img/fuelflow.jpg" alt="FuelFlow station concept inside McCombs"></div>
        <p>Smart nutrition stations in 6 to 8 academic buildings. My concept render puts one inside McCombs.</p>`,

    acacia: () => `
        <h2><em>Acacia Advisors</em></h2>
        <p class="note">making AI and cloud services make sense to the people buying them</p>
        <div class="stats"><div><b>+20%</b><span>website traffic</span></div><div><b>+27%</b><span>LinkedIn visits</span></div><div><b>$1M</b><span>Azure AI go-to-market</span></div></div>
        <p>Market research and competitive analysis across client engagements, then the messaging and pricing story for a manufacturing AI product.</p>`,

    book: () => `
        <h2>Girls Can Be Engineers, <em>Too!</em></h2>
        <p class="note">i wrote it and illustrated it. seven real women engineers.</p>
        <div class="stats"><div><b>#1</b><span>New Release in STEM Education</span></div><div><b>1,000</b><span>copies in month one</span></div><div><b>$4,194</b><span>donated to DFW libraries</span></div></div>
        <div class="shot"><img src="assets/img/book.jpg" alt="A young reader holding my book"></div>`,

    owala: () => `
        <h2>The Owala <em>Marathon Series</em></h2>
        <p class="note">runners don’t keep water bottles. they keep proof.</p>
        <div class="shot"><img src="assets/img/owala.jpg" alt="Austin Marathon Owala bottles"></div>
        <p>A collectible race-edition bottle for 8 cities, each with the city, the date and your finish time.</p>`,

    starbucks: () => `
        <h2>The Starbucks app, <em>reimagined</em></h2>
        <p class="note">recommending your drink before you know you want it</p>
        <div class="shot" style="background:var(--mint); padding:20px"><img src="assets/img/starbucks.jpg" alt="My Starbucks app prototype" style="max-width:380px; margin:0 auto; border-radius:14px"></div>
        <p>“Set the vibe” AI recommendations, with a roadmap ranked by RICE scoring.</p>`,

    saturday: () => `
        <h2>Saturday <em>in Austin</em></h2>
        <p class="note">can an algorithm plan a saturday you’d actually want?</p>
        <div class="stats"><div><b>208</b><span>Austin places</span></div><div><b>14</b><span>neighborhoods</span></div><div><b>10</b><span>Saturday moods</span></div></div>
        <div class="shot"><img src="assets/img/saturday.jpg" alt="Saturday in Austin"></div>
        <div class="row"><a class="btn solid" href="https://suhxnitiwari.github.io/saturday-in-austin/" target="_blank" rel="noopener">Plan my Saturday ↗</a></div>`,

    mccombs: () => `
        <h2>Why <em>McCombs</em></h2>
        <p class="note">it’s on my backpack, so it goes everywhere i go</p>
        <div class="stats"><div><b>MIS</b><span>BBA, Management Information Systems</span></div><div><b>+ Psych</b><span>BA in Psychology, alongside it</span></div><div><b>’27</b><span>Class of 2027</span></div></div>
        <p>Minors in Marketing and Educational Psychology. Scott Hemsell Memorial Scholarship and the Gerald and Linda Ridgely Endowed Presidential Scholarship (2026 to 2027), and University Honors.</p>
        <div class="row"><a class="btn solid" href="https://suhanitiwari.com/home/study#mccombs" target="_blank" rel="noopener">Why McCombs ↗</a></div>`,

    ipad: () => `
        <h2>My <em>iPad</em></h2>
        <p class="note">mostly pinterest and procreate, honestly</p>
        <div class="mk-wrap" id="mk-wrap">
          <div class="mk-stage" id="mk-stage">
            <div class="mk-lid" id="mk-lid">
              <div class="mk-back"><span class="mk-cam"></span><span class="mk-pencil-b"></span></div>
              <div class="mk-front">
                <span class="mk-pencil" aria-hidden="true"></span>
        <div class="ipad-big"><div class="ipad-screen">
            <div class="ipad-home" id="ipad-home">
                <button type="button" class="papp" data-ip="pinterest"><span class="ic" style="background:#E60023"><svg viewBox="0 0 40 40"><path d="M20 9 c-8 0 -11 6 -9 10 c1 2 2 2 2 1 c-1 -3 1 -7 7 -7 c5 0 6 3 5 6 c-1 4 -3 5 -5 5 c-2 0 -2 -2 -1 -3 l1 -4 m0 0 l-3 12" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg></span>Pinterest</button>
                <button type="button" class="papp" data-ip="procreate"><span class="ic" style="background:#1B1B1F"><svg viewBox="0 0 40 40"><path d="M10 30 c6 -2 10 -10 18 -20 c2 -3 6 0 4 3 c-8 10 -12 16 -20 19z" fill="#F4A7B9"/><circle cx="11" cy="30" r="3" fill="#B9A3E8"/></svg></span>Procreate</button>
                <button type="button" class="papp" data-ip="made"><span class="ic folder-ic">${['#F4A7B9', '#8FD19E', '#F7D54A', '#B9A3E8'].map(c => `<i style="background:${c}"></i>`).join('')}</span>Made by me</button>
            </div>
            <div class="ipad-view" id="ipad-view" hidden></div>
        </div></div>
              </div>
            </div>
            <div class="mk-base"><div class="mk-keys"><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 2"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 2"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 2"></i><i style="grid-column:span 3"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 3"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 2"></i><i style="grid-column:span 6"></i><i style="grid-column:span 2"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i><i style="grid-column:span 1"></i></div><div class="mk-pad"></div></div>
          </div>
        </div>
        <div class="row" style="justify-content:center"><button class="btn" type="button" id="mk-toggle">Close it</button></div>`,

    phone: () => `
        <h2>My <em>phone</em></h2>
        <p class="note">iphone 18 pro max in its pink case. lives in the sunglasses pocket.</p>
        <div class="phone-big">
            <div class="screen" id="screen">
                <p class="clock mono" id="clock"></p>
                <p class="pdate" id="pdate"></p>
                <div class="wx" id="wx" aria-live="polite"><span class="wx-ic">⛅</span><span class="wx-t">--°</span><span class="wx-d">Austin · checking the sky…</span></div>
                <div class="home" id="home">
                    <button type="button" class="papp" data-app="photos"><span class="ic ic-photos"><svg viewBox="0 0 40 40">${[0, 45, 90, 135, 180, 225, 270, 315].map((r, i) => `<ellipse cx="20" cy="11" rx="5" ry="9" fill="${['#F7D54A', '#F29B6B', '#E84393', '#B9A3E8', '#2E86DE', '#18A39A', '#27AE60', '#C7E3A1'][i]}" opacity=".85" transform="rotate(${r} 20 20)"/>`).join('')}</svg></span>Photos</button>
                    <button type="button" class="papp" data-app="instagram"><span class="ic ic-ig"><svg viewBox="0 0 40 40"><rect x="9" y="9" width="22" height="22" rx="7" fill="none" stroke="#fff" stroke-width="3"/><circle cx="20" cy="20" r="5.5" fill="none" stroke="#fff" stroke-width="3"/><circle cx="26.5" cy="13.5" r="1.6" fill="#fff"/></svg></span>Instagram</button>
                    <button type="button" class="papp" data-app="linkedin"><span class="ic ic-li"><svg viewBox="0 0 40 40"><rect x="10" y="15" width="20" height="14" rx="2" fill="none" stroke="#fff" stroke-width="3"/><path d="M16 15 v-3 h8 v3" fill="none" stroke="#fff" stroke-width="3"/></svg></span>LinkedIn</button>
                    <button type="button" class="papp" data-app="spotify"><span class="ic ic-sp"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="#111"/><path d="M13 16 q8 -3 15 1 M14 21 q6 -2 12 1 M15 25.5 q5 -1.5 9 .5" fill="none" stroke="#1ED760" stroke-width="2.4" stroke-linecap="round"/></svg></span>Spotify</button>
                    <button type="button" class="papp" data-app="youtube"><span class="ic ic-yt"><svg viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="16" rx="5" fill="#fff"/><path d="M18 16 v8 l7 -4z" fill="#E62117"/></svg></span>YouTube</button>
                    <button type="button" class="papp" data-app="netflix"><span class="ic ic-nf"><svg viewBox="0 0 40 40"><path d="M14 9 v22 M14 9 l12 22 M26 9 v22" fill="none" stroke="#E50914" stroke-width="4" stroke-linejoin="round"/></svg></span>Netflix</button>
                    <button type="button" class="papp" data-app="prime"><span class="ic ic-pv"><svg viewBox="0 0 40 40"><text x="20" y="20" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="9" fill="#fff">prime</text><path d="M11 25 q9 5 18 0" fill="none" stroke="#1FA8E0" stroke-width="2" stroke-linecap="round"/></svg></span>Prime</button>
                    <button type="button" class="papp" data-app="calendar"><span class="ic ic-gcal"><svg viewBox="0 0 40 40"><rect x="5" y="5" width="30" height="30" rx="4" fill="#fff"/><path d="M8 8 h24 v20" fill="none" stroke="#4285F4" stroke-width="4"/><path d="M32 28 l-6 6 h-18" fill="none" stroke="#34A853" stroke-width="4"/><path d="M8 34 v-26" fill="none" stroke="#FBBC04" stroke-width="4"/><path d="M26 34 l6 -6 h-6z" fill="#EA4335"/><text x="20" y="25.5" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#4285F4" id="gcal-day">${new Date().toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/Chicago' })}</text></svg></span><span class="plabel">Google Calendar</span></button>
                    <button type="button" class="papp" data-app="duolingo"><span class="ic ic-duo"><svg viewBox="0 0 40 40"><ellipse cx="20" cy="23" rx="12" ry="11" fill="#fff"/><circle cx="15.5" cy="21" r="4" fill="#fff" stroke="#3C3C3C" stroke-width="1"/><circle cx="24.5" cy="21" r="4" fill="#fff" stroke="#3C3C3C" stroke-width="1"/><circle cx="16" cy="21.5" r="2" fill="#3C3C3C"/><circle cx="24" cy="21.5" r="2" fill="#3C3C3C"/><path d="M18 26 l2 2.5 2 -2.5z" fill="#FFC800"/></svg></span>Duolingo</button>
                    <button type="button" class="papp" data-app="contacts"><span class="ic ic-ct"><svg viewBox="0 0 40 40"><circle cx="20" cy="16" r="6" fill="#fff"/><path d="M9 31 c1 -7 6 -10 11 -10 s10 3 11 10z" fill="#fff"/></svg></span>Contacts</button>
                </div>
                <div class="app-view" id="app-view" hidden></div>
            </div>
        </div>`,

    passport: () => {
        const STAMP = [
            ['Thailand', '2010', '#C2185B', 'circle', '<path d="M0 -14 L-10 8 h20 Z M-4 -4 h8 M-6 2 h12" fill="none"/><path d="M0 -20 v6"/>'],
            ['Malaysia', '2010', '#1F6FD1', 'rect', '<path d="M-8 12 V-8 l2 -6 2 6 V12 M4 12 V-8 l2 -6 2 6 V12 M-4 -2 h8"/>'],
            ['Switzerland', '2016', '#D63031', 'oval', '<path d="M-16 10 L-6 -8 L0 2 L6 -10 L16 10Z" fill="none"/><path d="M-3 -2 h6 M0 -5 v6"/>'],
            ['France', '2016', '#2E4A7A', 'rect', '<path d="M0 -16 L-8 12 M0 -16 L8 12 M-5 2 h10 M-7 8 h14"/>'],
            ['Italy', '2016', '#18A39A', 'circle', '<rect x="-5" y="-14" width="10" height="26" rx="2" transform="rotate(5)" fill="none"/><path d="M-5 -6 h10 M-5 2 h10" transform="rotate(5)"/>'],
            ['Mexico', '2020', '#F0592B', 'oval', '<path d="M0 12 V-12 M0 -2 h-7 v-6 M0 4 h7 v-8" fill="none"/>']
        ];
        const stamp = (i, x, y, rot) => { const [n, yr, c, shape, icon] = STAMP[i]; return `<span class="stamp real" style="--r:${rot}deg; --c:${c}; left:${x}%; top:${y}%">
            <svg viewBox="0 0 120 92" aria-label="${n}, ${yr}">
                ${shape === 'circle' ? '<circle cx="60" cy="46" r="40"/><circle cx="60" cy="46" r="34"/>' : shape === 'oval' ? '<ellipse cx="60" cy="46" rx="54" ry="38"/><ellipse cx="60" cy="46" rx="48" ry="32"/>' : '<rect x="8" y="8" width="104" height="76" rx="6"/><rect x="14" y="14" width="92" height="64" rx="4"/>'}
                <g transform="translate(60 ${shape === 'rect' ? 40 : 42}) scale(.85)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
                <text x="60" y="${shape === 'rect' ? 72 : 66}" text-anchor="middle" style="font-size:${n.length > 8 ? 9 : 10.5}px">${n.toUpperCase()}</text>
                <text x="60" y="${shape === 'rect' ? 24 : 27}" text-anchor="middle" class="small yr">${yr}</text>
            </svg></span>`; };
        const visa = (num, scene, inner) => `<div class="pb-page visa scene-${scene}"><span class="pb-visas">Visas</span>${inner}<span class="pb-num">${num}</span></div>`;
        // each leaf is a sheet of paper: a front (right-hand page) and a back (left-hand page once it's turned)
        const leaves = [
            [`<div class="pb-page pb-cover">${ITEMS.find(i => i.id === 'passport').art}</div>`,
             `<div class="pb-page pb-plain"><div class="pb-rot"><div class="pp-page pp-sign-l"><span class="pp-guil"></span><span class="pp-endorse">Endorsements</span><span class="pp-ghost"><img src="assets/img/me.jpg" alt=""></span><span class="pp-sig">Suhani Tiwari</span><span class="pp-sigline">SIGNATURE OF BEARER</span></div></div></div>`],
            [`<div class="pb-page pb-plain"><div class="pb-rot"><div class="pp-page pp-data"><span class="pp-guil"></span>
                <span class="pp-hd"><span class="pp-word">PASSPORT<small>PASSEPORT / PASAPORTE</small></span><b class="pp-us">THE UNITED STATES OF AMERICA</b></span>
                <span class="pp-usa">USA</span><span class="pp-photo"><img src="assets/img/me.jpg" alt=""></span>
                <span class="pp-fields"><span><i>Type</i> <b>carry-on only</b></span><span><i>Passport No.</i> <b>NO PEEKING ♡</b></span><span><i>Surname</i> <b>TIWARI</b></span><span><i>Given names</i> <b>SUHANI M</b></span><span><i>Nationality</i> <b>UNITED STATES OF AMERICA</b></span><span><i>Date of birth</i> <b>a lady never tells</b></span><span><i>Countries</i> <b>6 and counting</b></span><span><i>Expires</i> <b>never stop going</b></span></span>
                <span class="pp-trail">✈ · · · · · · · · · · · · · next stop: ?</span></div></div></div>`,
             visa(2, 'waves', stamp(0, 8, 22, -8) + stamp(1, 40, 56, 6))],
            [visa(3, 'waves', '<span class="pb-note">2010 · thailand & malaysia</span>'),
             visa(4, 'peaks', stamp(2, 12, 18, -3) + stamp(3, 34, 58, 9))],
            [visa(5, 'peaks', stamp(4, 18, 30, -6) + '<span class="pb-note">2016 · europe</span>'),
             visa(6, 'sun', stamp(5, 22, 34, 4))],
            [visa(7, 'sun', '<span class="pb-note">2020 · mexico. next stop: ?</span>'),
             `<div class="pb-page pb-back"></div>`]
        ];
        return `
        <h2>My <em>passport</em> <span class="mono" style="font-size:.7rem; color:var(--muted)">United States of America</span></h2>
        <p class="note">six countries so far. tap the cover, then flip through it like a book.</p>
        <div class="pb-wrap"><div class="pb" id="pb" data-at="0" style="--n:${leaves.length}">${leaves.map(([f, bk], i) => `
            <div class="pb-leaf" style="--i:${i}" data-leaf="${i}"><div class="pb-face pb-front">${f}</div><div class="pb-face pb-backface">${bk}</div></div>`).join('')}
        </div></div>
        <div class="row pb-ctrl"><button class="btn" type="button" id="pb-prev" aria-label="Previous page">‹ back</button><span class="hand" id="pb-where">tap the cover</span><button class="btn solid" type="button" id="pb-next" aria-label="Next page">open ›</button></div>
        <div class="row"><a class="btn" href="https://suhanitiwari.com/home/make#traveling" target="_blank" rel="noopener">My itineraries (Chicago, New York) ↗</a></div>`;
    },

    sitara: () => `
        <h2>Hi, I’m <em>Sitara</em></h2>
        <p class="note">suhani’s AI guide, and the charm on her bag</p>
        <div class="chat" id="chat" aria-live="polite"></div>
        <div class="row" id="chips">
            <button class="btn" type="button" data-q="0">What does she actually do?</button>
            <button class="btn" type="button" data-q="1">Why a backpack?</button>
            <button class="btn" type="button" data-q="2">Is she a good driver?</button>
        </div>`
};

function penView({ title, note, list, front, pen, pick }) {
    return `
        <h2>${title}</h2>
        <p class="note">${note}</p>
        <div class="pouch-scene">
            <div class="pens${list.length > 12 ? ' many' : ''}" id="pens" data-pick="${pick}" style="--step:${Math.min(11, 150 / Math.max(1, list.length - 1))}deg">${list.map((p, i) => `
                <button class="pen" type="button" style="--i:${i}; --mid:${(list.length - 1) / 2}" data-pen="${i}" aria-label="${p.name}">
                    ${pen(p.c)}<span class="lbl">${p.name}</span>
                </button>`).join('')}</div>
            <div class="pouch-front${list === PENS ? ' tele-front' : ' cc-front'}" id="pouch-front">${front}</div>
        </div>
        ${list === GELPENS ? '<div class="row" style="justify-content:center; margin-top:4px"><button class="btn" type="button" id="cc-btn">Unzip it</button></div>' : ''}
        ${list === PENS ? '<div class="row" style="justify-content:center; margin-top:4px"><button class="btn" type="button" id="tele-btn">Push it down</button></div>' : ''}
        <p class="pen-note" id="pen-note" aria-live="polite">unzipping…</p>
        ${list === GELPENS ? `<div class="pad"><div id="pad-text" class="pad-text" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Notepad: type in the pen color you picked" data-placeholder="pick a pen, then type anything…"></div></div>` : ''}
        ${list === GELPENS ? `<div class="in-pencil">
            <div class="pencil-top"><span class="pencils" aria-hidden="true">${['#7FC6E8', '#F4A7B9', '#B9A3E8', '#8FD19E'].map(c => `<i style="background:${c}"></i>`).join('')}</span>
            <div><p class="mono" style="margin:0 0 4px; color:var(--plum)">Plus my BIC Xtra-Smooth mechanical pencils</p>
            <p style="margin:0">For anything still in draft, so it’s all erasable. <b>In pencil right now:</b> <span class="todo">what are you working on?</span></p></div></div>
            <div class="sketch-tools"><button type="button" class="on" data-tool="pencil">✏️ pencil</button><button type="button" data-tool="eraser">◻︎ eraser</button><button type="button" data-tool="clear">clear</button></div>
            <div class="pad pencil-pad"><canvas id="pencil-canvas" aria-label="Sketch pad: draw in pencil, then erase"></canvas><span class="pad-hint" id="pencil-hint">sketch something, then erase it…</span></div>
        </div>` : ''}`;
}


/* my four bank cards are vertical designs, so they sit sideways in the wallet slots, like the real ones.
   Names and colors match mine; no numbers, no logos. */
const VC_CHIP = (x, y) => `<rect x="${x}" y="${y}" width="10" height="8" rx="1.6" fill="#E3C46E" stroke="#8A6A2A" stroke-width=".5"/><path d="M${x} ${y + 4} h10 M${x + 5} ${y} v8" stroke="#A88A3E" stroke-width=".4"/>`;
const VC_TAP = (x, y, c) => `<path d="M${x} ${y} q2 2.5 0 5 M${x + 2} ${y - 1} q3 3.5 0 7 M${x + 4} ${y - 2} q4 4.5 0 9" fill="none" stroke="${c}" stroke-width=".8" stroke-linecap="round"/>`;
const BOFA_FLAG = (x, y, c, w = 1) => `<g transform="translate(${x} ${y}) scale(${w})" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"><path d="M0 6 l5 -6 h9"/><path d="M3 9 l5 -6 h9"/><path d="M6 12 l5 -6 h9"/></g>`;
const VCARD = {
    amexblue: `<svg viewBox="0 0 54 86" preserveAspectRatio="none"><defs><linearGradient id="vab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1857C4"/><stop offset=".5" stop-color="#2E80E3"/><stop offset="1" stop-color="#1A55BE"/></linearGradient><radialGradient id="vabm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9CCBF7"/><stop offset="1" stop-color="#5FA2EC"/></radialGradient></defs>
        <rect width="54" height="86" fill="url(#vab)"/>
        <circle cx="24" cy="44" r="18" fill="url(#vabm)" opacity=".9"/><circle cx="24" cy="44" r="18" fill="none" stroke="#CFE5FB" stroke-width=".6"/>
        <g fill="#2E80E3" opacity=".75"><path d="M17 56 c0 -8 3 -13 8 -14 c2 -4 7 -6 10 -2 c-3 0 -4 2 -4 4 c3 2 3 7 0 10 c2 2 1 4 -1 4z"/><path d="M24 42 c-1 -8 4 -14 12 -13 c-4 2 -6 5 -6 8 z"/><path d="M27 33 c3 -6 9 -8 13 -6 c-5 1 -8 3 -10 7z"/></g>
        ${VC_CHIP(32, 9)}<text transform="translate(8 9) rotate(90)" font-family="Instrument Sans" font-size="3.8" fill="#EAF3FF" letter-spacing=".5">SUHANI TIWARI</text>
        <rect x="38.5" y="44" width="11" height="36" fill="none" stroke="#fff" stroke-width=".5" opacity=".7"/>
        <text transform="translate(46.5 46) rotate(90)" font-family="Instrument Sans" font-weight="800" font-size="4.6" fill="#fff" letter-spacing=".2">AMERICAN</text><text transform="translate(41.5 48) rotate(90)" font-family="Instrument Sans" font-weight="800" font-size="4.6" fill="#fff" letter-spacing=".4">EXPRESS</text>
        <text x="8" y="80" font-family="Instrument Sans" font-size="3" fill="#EAF3FF">25</text>${VC_TAP(28, 76, '#EAF3FF')}</svg>`,
    amexgold: `<svg viewBox="0 0 54 86" preserveAspectRatio="none"><defs><linearGradient id="vag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B9953F"/><stop offset=".45" stop-color="#E6CC7E"/><stop offset="1" stop-color="#AE8833"/></linearGradient></defs>
        <rect width="54" height="86" fill="url(#vag)"/><path d="M0 0 H34 L0 52Z" fill="#fff" opacity=".2"/><path d="M34 0 H54 V28 L10 86 H0 V52Z" fill="#8A6A2A" opacity=".1"/>
        ${VC_CHIP(33, 13)}<text transform="translate(8 6) rotate(90)" font-family="Instrument Sans" font-size="3.8" fill="#3A2C10" letter-spacing=".5">SUHANI TIWARI</text>
        <text transform="translate(47 30) rotate(90)" font-family="Instrument Sans" font-weight="800" font-size="4.4" fill="#2A200C" letter-spacing=".3">AMERICAN EXPRESS</text>
        <path d="M41 30 l3 -4.5 3 4.5z" fill="#C0272D" transform="translate(-2 0)"/><text transform="translate(41 33) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="3.2" fill="#2A200C">DELTA</text>
        <text transform="translate(41 47) rotate(90)" font-family="Instrument Sans" font-size="5" fill="#2A200C" letter-spacing=".8">SKYMILES</text>
        <text x="8" y="80" font-family="Instrument Sans" font-size="3" fill="#3A2C10">25</text>${VC_TAP(28, 76, '#3A2C10')}</svg>`,
    bofa: `<svg viewBox="0 0 54 86" preserveAspectRatio="none"><defs><linearGradient id="vbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A6AAB1"/><stop offset=".5" stop-color="#E4E6EA"/><stop offset="1" stop-color="#9A9EA6"/></linearGradient></defs>
        <rect width="54" height="86" fill="url(#vbg)"/><path d="M0 34 L54 14 V26 L0 46Z" fill="#fff" opacity=".22"/>
        ${VC_CHIP(32, 12)}<circle cx="11" cy="9" r="3" fill="none" stroke="#5E646C" stroke-width=".6"/><path d="M9.6 9 h2.8 M11 7.6 v2.8" stroke="#5E646C" stroke-width=".5"/>
        ${BOFA_FLAG(16, 24, '#4A4F57', 1.1)}
        <text transform="translate(20 40) rotate(90)" font-family="Instrument Sans" font-weight="600" font-size="3" fill="#33373D" letter-spacing=".9">BANK OF AMERICA</text>
        <text transform="translate(44 62) rotate(90)" font-family="Instrument Sans" font-weight="800" font-style="italic" font-size="6" fill="#1A1F71">VISA</text><text transform="translate(39 62) rotate(90)" font-family="Instrument Sans" font-style="italic" font-size="2.6" fill="#33373D">Signature</text>
        ${VC_TAP(10, 76, '#33373D')}</svg>`,
    bofadebit: `<svg viewBox="0 0 54 86" preserveAspectRatio="none"><defs><linearGradient id="vbr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C21F2B"/><stop offset=".5" stop-color="#E2403C"/><stop offset="1" stop-color="#B51C27"/></linearGradient></defs>
        <rect width="54" height="86" fill="url(#vbr)"/><path d="M54 0 L0 60 V40 L36 0Z" fill="#fff" opacity=".07"/>
        ${VC_CHIP(22, 11)}${VC_TAP(36, 13, '#fff')}
        ${BOFA_FLAG(18, 32, '#fff', 1.05)}
        <text x="27" y="52" text-anchor="middle" font-family="Instrument Sans" font-weight="600" font-size="3.6" fill="#fff" letter-spacing=".8">BANK OF AMERICA</text>
        <text x="46" y="66" text-anchor="end" font-family="Instrument Sans" font-weight="600" font-size="4.6" fill="#fff">debit</text>
        <circle cx="38" cy="76" r="4.4" fill="#EB001B"/><circle cx="44" cy="76" r="4.4" fill="#F79E1B" opacity=".9"/><path d="M41 72.6 a4.4 4.4 0 0 1 0 6.8 a4.4 4.4 0 0 1 0 -6.8z" fill="#FF5F00"/>
        <path d="M8 74 l2 -3 2 3 M13 75 l-1 3 -3 0 M7 76 l1 3 h3" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/></svg>`
};

function cardHTML(c, i) {
    if (VCARD[c.kind]) return `
        <button class="card vert ${c.kind}" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <span class="vface">${VCARD[c.kind]}</span>
        </button>`;
    if (c.kind === 'dl') return `
        <button class="card dl tx" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title} (a joke one)">
            <svg class="tx-bg" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M8 2 h22 v26 l18 6 l14 -4 l10 4 v22 l-4 10 l-10 6 l-12 14 l-6 16 l-10 -2 l-10 -14 l-6 -12 l-8 -6 l-6 6 l-10 -6 l-6 -10 l4 -6 h10 Z" transform="translate(70 18) scale(.95)" fill="#F4B9C3" opacity=".55"/>
                <path d="M0 70 q40 -10 80 6 t80 -4 V100 H0Z" fill="#C9D3F0" opacity=".45"/>
                <g fill="none" stroke="#9FB0E0" stroke-width=".35" opacity=".6"><path d="M0 20 q40 10 80 0 t80 0"/><path d="M0 26 q40 10 80 0 t80 0"/><path d="M0 32 q40 10 80 0 t80 0"/></g>
            </svg>
            <svg class="tx-seal" viewBox="0 0 90 110" aria-hidden="true"><path d="M8 2 h22 v26 l18 6 l14 -4 l10 4 v22 l-4 10 l-10 6 l-12 14 l-6 16 l-10 -2 l-10 -14 l-6 -12 l-8 -6 l-6 6 l-10 -6 l-6 -10 l4 -6 h10 Z" fill="none" stroke="#D9B45A" stroke-width="2.5"/><circle cx="40" cy="44" r="13" fill="#E6C66E" stroke="#C99A3A" stroke-width="1.5"/><path d="M40 35 l2.6 6 6.4 .5 -4.9 4.2 1.5 6.3 -5.6 -3.4 -5.6 3.4 1.5 -6.3 -4.9 -4.2 6.4 -.5z" fill="#FFF7DF"/></svg>
            <span class="tx-head">
                <span class="tx-flag" aria-hidden="true"><b>★</b><i></i><i></i></span>
                <span class="tx-word">Texas<small>USA</small></span>
                <span class="tx-kind">LEARNER<br>DRIVER LICENSE</span>
            </span>
            <span class="tx-banner">STILL LEARNING ♡</span>
            <span class="tx-photo"><img src="assets/img/me.jpg" alt=""><span class="tx-sig">Suhani Tiwari</span></span>
            <span class="tx-fields">
                <span><i>4d. DL:</i> <b>OOPS-143</b></span>
                <span><i>9. Class:</i> <b>C</b> (for cute)</span>
                <span><i>3. DOB:</i> <b>a lady never tells</b></span>
                <span><i>4b. Exp:</i> <b>my patience, daily</b></span>
                <span><i>4a. Iss:</i> <b>a very forgiving DMV</b></span>
                <span><i>9a. End:</i> <b>NONE, YET</b></span>
            </span>
            <span class="tx-who">
                <span><i>1.</i> <b>TIWARI</b></span>
                <span><i>2.</i> <b>SUHANI M</b></span>
                <span><i>8.</i> <b>wouldn’t you wanna knowwww</b></span>
            </span>
            <span class="tx-foot">
                <span><i>16. Hgt:</i> <b>5′-06″</b></span>
                <span><i>18. Eyes:</i> <b>DREAMY</b></span>
                <span><i>Hair:</i> <b>dark, long, always done</b></span>
                <span><i>Wgt:</i> <b>don’t ask</b></span>
            </span>
        </button>`;
    if (c.kind === 'id') return `
        <button class="card id" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <span class="ut-left">
                <span class="ut-word">TEXAS</span>
                <span class="ut-sub">The University of Texas at Austin</span>
                <span class="ut-name">SUHANI M TIWARI</span>
                <span class="ut-role">STUDENT</span>
                <span class="ut-num">•••••• ••••••••••</span>
            </span>
            <span class="ut-photo"><img src="assets/img/me.jpg" alt=""></span>
            <span class="ut-bars" aria-hidden="true"></span>
        </button>`;
    return `
        <button class="card" type="button" style="--i:${i}; z-index:${10 - i}; background:${c.color}; color:${c.text}" data-card="${i}" aria-label="${c.title}">
            <span style="display:flex; justify-content:space-between; align-items:center"><span class="t">${c.title}</span><span class="chip"></span></span>
            <span class="big">${c.big}</span>
            <span class="foot"><span>SUHANI TIWARI</span><span>${c.tag}</span></span>
        </button>`;
}

/* ---------- what happens right after something opens ---------- */
const AFTER = {
    brushes: () => {
        const D = [['M241','Angled Powder Bronzer','bronzer, swept on the cheekbones'],['M242','Slanted Cream & Liquid Bronzer','cream bronzer, buffed in'],['M132','Angled Concealer','concealer, under the eyes'],['Eye','Tapered Blender','blending the crease'],['Eye','Pointed Crease','cutting the crease'],['Eye','Dome Shader','packing on shadow'],['Eye','Pencil','smudging along the lash line'],['Eye','Flat Shader','lid color'],['Eye','Small Detail','inner corners'],['Eye','Angled Liner + Spoolie','brows and liner']], note = $('#mbr-note');
        sheetBody.querySelectorAll('.mbr').forEach(b => b.onclick = () => {
            sheetBody.querySelectorAll('.mbr').forEach(x => x.classList.toggle('up', x === b && !x.classList.contains('up')));
            const [c, n, u] = D[+b.dataset.br];
            note.innerHTML = b.classList.contains('up') ? `<b>${c === 'Eye' ? 'Eye Want It All' : 'Morphe ' + c}</b> · ${n}<br><small>for ${u}</small>` : 'tap a brush';
        });
    },
    notebooks: () => { sheetBody.querySelectorAll('[data-ecb]').forEach(b => b.onclick = () => b.classList.toggle('open')); },
    journal: () => {
        const jb = $('#jb'), cover = $('#jb-cover'), hint = $('#jb-hint');
        cover.querySelector('.jb-front').onclick = e => {
            const r = cover.getBoundingClientRect();
            if (e.clientX < r.left + r.width * .45 || e.clientY < r.top + r.height * .5) { hint.textContent = 'grab the bottom-right corner ↘'; return; }
            jb.classList.add('open'); hint.textContent = 'write on either page. tap the spine to close it (nothing is saved).';
        };
        jb.addEventListener('click', e => { if (jb.classList.contains('open') && e.target === jb) { jb.classList.remove('open'); hint.textContent = 'tap the bottom-right corner to open it'; } });
    },
    perfume: () => {
        let n = 0;
        const bottle = $('#pf-bottle'), act = bottle.querySelector('.pact'), btn = $('#spritz'), hint = $('#pf-hint');
        const capOff = () => { bottle.classList.add('capoff'); btn.textContent = 'Spritz'; hint.textContent = 'now press the nozzle ✨'; };
        const spritz = () => {
            if (!bottle.classList.contains('capoff')) return capOff();
            act.style.transition = 'transform .12s'; act.style.transform = 'translateY(3px)';
            setTimeout(() => { act.style.transform = ''; }, 170);
            const r = bottle.getBoundingClientRect();
            fairyDust(r.left + r.width * .44, r.top + r.height * .17);
            n++; toast(n === 1 ? 'ballet rose ♡ and a little fairy dust' : n < 4 ? 'one more. for good luck ✨' : 'okay that’s enough, it’s a small elevator');
        };
        btn.onclick = spritz;
        bottle.onclick = e => { if (e.target.closest('.pcap') && bottle.classList.contains('capoff')) { bottle.classList.remove('capoff'); btn.textContent = 'Take the cap off'; hint.textContent = 'cap’s back on ♡'; return; } spritz(); };
        bottle.style.cursor = 'pointer';
    },
    boarding: () => { $('#bp-scan').onclick = () => toast('beep. boarding group: whenever i get there ✈'); },
    padfolio: () => {
        const pf = sheetBody.querySelector('.pf'), res = $('#pf-resume');
        const pull = e => { if (e.target.closest('.pf-open')) return; const out = pf.classList.toggle('res-out'); res.setAttribute('aria-label', out ? 'My résumé: tap to tuck it back in' : 'My résumé: tap to pull it out'); res.querySelector('.pf-take').textContent = out ? 'tuck it back ↓' : 'pull it out ↑'; if (out) toast('take one. seriously ♡'); };
        res.onclick = pull; res.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pull(e); } };
        const bc = $('#bc'); const flip = e => { if (e.target.closest('a')) return; const f = bc.classList.toggle('flip'); if (f) toast('tap a link ♡'); }; bc.onclick = flip; bc.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(e); } }; },
    cap: () => { let on = false; $('#cap-on').onclick = () => { on = !on; $('#cap-on').textContent = on ? 'Take it off' : 'Put it on'; toast(on ? 'bad hair day? never heard of her.' : 'okay, hair’s actually done today ♡'); }; },
    passport: () => {
        const pb = $('#pb'), leaves = [...pb.querySelectorAll('.pb-leaf')], n = leaves.length;
        let at = 0;   // how many leaves have been turned
        const where = ['tap the cover', 'signature + my info', 'pages 2–3', 'pages 4–5', 'pages 6–7', 'the back cover'];
        const draw = () => {
            leaves.forEach((l, i) => { l.classList.toggle('turned', i < at); l.style.zIndex = i < at ? i + 1 : n - i + 1; });
            pb.dataset.at = at; pb.classList.toggle('open', at > 0 && at < n); pb.classList.toggle('back', at === n);
            $('#pb-where').textContent = where[at] || '';
            $('#pb-prev').disabled = at === 0; $('#pb-next').disabled = at === n;
            $('#pb-next').textContent = at === 0 ? 'open ›' : at === n - 1 ? 'close ›' : 'next page ›';
            $('#pb-next').disabled = false; if (at === n) $('#pb-next').textContent = 'flip it back over';
        };
        const go = d => { const k = Math.max(0, Math.min(n, at + d)); if (k === at) return; at = k; draw(); if (at === 1 && d > 0) toast('ugh, the photo. okay fine, look.'); };
        $('#pb-next').onclick = () => { if (at === n) { at = 0; draw(); return; } go(1); }; $('#pb-prev').onclick = () => go(-1);
        leaves.forEach((l, i) => l.onclick = () => { if (at === n) { at = 0; draw(); toast('closed. safe and sound ✈'); return; } go(i < at ? -1 : 1); });
        pb.tabIndex = 0; pb.onkeydown = e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
        draw();
    },
    romcom: () => {
        let days = 21;
        const rc = $('#rc'), btn = $('#rc-read');
        const toggle = () => {
            const open = rc.classList.toggle('open');
            btn.textContent = open ? 'Close it' : 'Read it';
            if (!open) { $('#rc-days').textContent = ++days; toast(days === 22 ? 'tomorrow. definitely tomorrow ♡' : 'okay… tomorrow. for real this time.'); }
            else toast('chapter one. we’ve met before.');
        };
        btn.onclick = toggle; rc.onclick = toggle; rc.style.cursor = 'pointer';
    },
    hairpony: () => hairAfter('pony'),
    haircomb: () => hairAfter('comb'),

    makeup: () => setTimeout(() => $('#lip') && $('#lip').classList.add('off'), 350),
    phone: () => {
        const d = new Date();
        // live: Austin time and date (it's my phone), ticking while the phone is open
        const tick = () => {
            const c = $('#clock'); if (!c) return clearInterval(clockTimer);
            const now = new Date();
            c.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' });
            $('#pdate').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Chicago' });
        };
        clearInterval(clockTimer); tick(); clockTimer = setInterval(tick, 1000);
        // live weather for Austin from Open-Meteo (free, no key), refreshed at most every 10 minutes
        loadWeather().then(w => {
            const el = $('#wx'); if (!el) return;
            if (!w) { el.querySelector('.wx-d').textContent = 'Austin · weather’s shy right now'; return; }
            el.querySelector('.wx-ic').textContent = w.icon;
            el.querySelector('.wx-t').textContent = `${w.temp}°`;
            el.querySelector('.wx-d').textContent = `Austin · ${w.label} · H ${w.hi}° L ${w.lo}°`;
        });
        const view = $('#app-view'), home = $('#home');
        const back = '<button type="button" class="back mono" id="back">‹ home</button>';
        sheetBody.querySelectorAll('[data-app]').forEach(b => b.onclick = () => {
            if (b.dataset.app === 'photos') {
                view.innerHTML = back + '<p class="mono apptitle">Recents</p><div class="grid">' +
                    ['cafe', 'me', 'book', 'gwc', 'chicago', 'nyc', 'owala', 'listening', 'saturday'].map(f => `<img src="assets/img/${f}.jpg" alt="">`).join('') + '</div>';
            } else if (b.dataset.app === 'spotify') {
                view.innerHTML = back + `
                    <div class="sp">
                        <p class="sp-h">Wrapped could never</p>
                        <div class="sp-card"><b>182K</b><span>plays since 2022, cleaned into a SQL warehouse</span></div>
                        <div class="sp-card"><b>21 days</b><span>in a row on one song (SQL found it)</span></div>
                        <a class="sp-btn" href="https://listening-history.onrender.com/" target="_blank" rel="noopener">Open Listening History</a>
                        <a class="sp-btn ghost" href="https://suhanitiwari.com/home/favorites#listen" target="_blank" rel="noopener">My music universe</a>
                    </div>`;
            } else if (b.dataset.app === 'netflix' || b.dataset.app === 'prime') {
                const nf = b.dataset.app === 'netflix';
                const list = nf ? ['bridgerton', 'ginny-and-georgia', 'mismatched', 'masaba-masaba', 'gilmore-girls'] : ['call-me-bae', 'mind-the-malhotras', 'off-campus'];
                view.innerHTML = back + `
                    <div class="stream ${nf ? 'nf' : 'pv'}">
                        <p class="stream-h">${nf ? 'Continue watching for Suhani' : 'Keep watching'}</p>
                        <div class="posters">${list.map(f => `<img src="assets/posters/${f}.jpg" alt="${f.replace(/-/g, ' ')}">`).join('')}</div>
                    </div>`;
            } else if (b.dataset.app === 'youtube') {
                const vids = [
                    ['ted', 'Your Elusive Creative Genius', 'Elizabeth Gilbert · TED', '86x-u-tz0MA', 'elusive-creative-genius'],
                    ['ted', 'Do Schools Kill Creativity?', 'Sir Ken Robinson · TED', 'iG9CE55wbtY', 'schools-kill-creativity'],
                    ['ted', 'Every Kid Needs a Champion', 'Rita Pierson · TED', 'SFnMTHhKdkw', 'every-kid-needs-a-champion'],
                    ['ted', 'How to Make Learning as Addictive as Social Media', 'Luis von Ahn · TED', 'P6FORpg0KVo', 'learning-as-addictive'],
                    ['self', 'Change Your Mindset, Change the Game', 'Alia Crum · TEDx', '0tqq66zwa7g', 'change-your-mindset'],
                    ['self', 'You Aren’t at the Mercy of Your Emotions', 'Lisa Feldman Barrett · TED', '0gks6ceq4eQ', 'your-brain-creates-emotions']
                ];
                const render = f => {
                    view.querySelector('.yt-feed').innerHTML = (f === 'all' || f === 'grwm' ? `<a class="yt-row" href="https://www.youtube.com/results?search_query=get+ready+with+me" target="_blank" rel="noopener"><span class="yt-thumb grwm">GRWM ♡</span><span><b>get ready with me</b><small>a whole genre, honestly</small></span></a>` : '') +
                        vids.filter(v => f === 'all' || v[0] === f).map(v => `<a class="yt-row" href="https://www.youtube.com/watch?v=${v[3]}" target="_blank" rel="noopener"><img class="yt-thumb" src="assets/videos/${v[4]}.jpg" alt=""><span><b>${v[1]}</b><small>${v[2]}</small></span></a>`).join('');
                    view.querySelectorAll('.yt-chips button').forEach(c => c.classList.toggle('on', c.dataset.f === f));
                };
                view.innerHTML = back + `<div class="yt"><p class="yt-logo"><span>▶</span> YouTube</p>
                    <div class="yt-chips">${[['all', 'All'], ['grwm', 'GRWM'], ['ted', 'TED Talks'], ['self', 'Self-improvement']].map(([k, l]) => `<button type="button" data-f="${k}">${l}</button>`).join('')}</div>
                    <div class="yt-feed"></div></div>`;
                view.querySelectorAll('.yt-chips button').forEach(c => c.onclick = () => render(c.dataset.f));
                render('all');
            } else if (b.dataset.app === 'contacts') {
                view.innerHTML = back + `
                    <div class="ct">
                        <div class="ct-me"><img src="assets/img/me.jpg" alt=""><b>Suhani Tiwari</b><span>MIS + Psychology · UT Austin</span></div>
                        <p class="ct-ask">do you wanna connect with me? ♡<br><small>go ahead, add your name and number.</small></p>
                        <form class="ct-form" id="ct-form">
                            <label>Name<input name="name" required autocomplete="name" placeholder="first and last"></label>
                            <label>Phone<input name="phone" type="tel" required autocomplete="tel" placeholder="(512) 555-0123"></label>
                            <label>How we met <span>(optional)</span><input name="met" placeholder="coffee chat? class? career fair?"></label>
                            <button class="ct-add" type="submit">Add + send to Suhani</button>
                        </form>
                        <p class="ct-fine">this opens your email so it comes straight to me. nothing’s saved on this site.</p>
                        <button type="button" class="ct-save" id="ct-save">or save me to your contacts ↓</button>
                    </div>`;
                $('#ct-form').onsubmit = ev => {
                    ev.preventDefault();
                    const f = new FormData(ev.target), name = (f.get('name') || '').trim(), phone = (f.get('phone') || '').trim(), met = (f.get('met') || '').trim();
                    const body = `Hi Suhani! Let's connect.\n\nName: ${name}\nPhone: ${phone}${met ? `\nHow we met: ${met}` : ''}\n\n(sent from your bag ♡)`;
                    location.href = `mailto:suhanitiwari@utexas.edu?subject=${encodeURIComponent(`let's connect ♡ ${name}`)}&body=${encodeURIComponent(body)}`;
                    toast('yay! your email app should pop up ♡');
                };
                $('#ct-save').onclick = () => {
                    const vcf = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Tiwari;Suhani;;;', 'FN:Suhani Tiwari', 'ORG:The University of Texas at Austin', 'TITLE:MIS + Psychology', 'EMAIL;TYPE=INTERNET:suhanitiwari@utexas.edu', 'URL:https://suhanitiwari.com', 'URL:https://www.linkedin.com/in/suhxnitiwari', 'END:VCARD'].join('\r\n');
                    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([vcf], { type: 'text/vcard' })); a.download = 'Suhani-Tiwari.vcf'; a.click();
                    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
                    toast('saved. now you have no excuse ♡');
                };
            } else if (b.dataset.app === 'duolingo') {
                view.innerHTML = back + `
                    <div class="duo">
                        <p class="duo-streak">🔥 <span class="todo">streak?</span></p>
                        <p class="duo-h">learning <span class="todo">which language?</span></p>
                        <div class="duo-path">${[1, 2, 3, 4, 5].map((n, i) => `<span class="duo-node${i < 2 ? ' done' : i === 2 ? ' now' : ''}" style="margin-left:${[0, 30, 46, 30, 0][i]}px">${i < 2 ? '★' : i === 2 ? '▶' : '🔒'}</span>`).join('')}</div>
                    </div>`;
            } else if (b.dataset.app === 'calendar') {
                const d = new Date();
                const ev = [['9:30', 'class at McCombs', '#1A73E8'], ['12:00', 'coffee run ☕', '#E67C73'], ['1:00', 'study, mildliners out', '#8E24AA'], ['5:30', 'pilates', '#33B679'], ['7:00', 'plan saturday', '#F6BF26']];
                view.innerHTML = back + `
                    <div class="gcal">
                        <p class="gcal-h"><b>${d.toLocaleDateString([], { weekday: 'long' })}</b><span>${d.toLocaleDateString([], { month: 'long', day: 'numeric' })}</span></p>
                        <p class="gcal-sub">a typical day, roughly</p>
                        ${ev.map(([t, n, c]) => `<div class="gcal-ev"><span class="t">${t}</span><span class="e" style="background:${c}">${n}</span></div>`).join('')}
                    </div>`;
            } else if (b.dataset.app === 'linkedin') {
                view.innerHTML = back + `
                    <div class="li">
                        <div class="li-banner"></div>
                        <img class="li-photo" src="assets/img/me.jpg" alt="">
                        <p class="li-name">Suhani Tiwari</p>
                        <p class="li-head">MIS + Psychology @ UT Austin McCombs · Prev. Oracle, Acacia Advisors, Outlier</p>
                        <p class="li-loc">Austin, Texas</p>
                        <p class="li-url">linkedin.com/in/suhxnitiwari</p>
                        <a class="li-btn" href="https://www.linkedin.com/in/suhxnitiwari/" target="_blank" rel="noopener">View on LinkedIn</a>
                    </div>`;
            } else {
                view.innerHTML = back + `
                    <div class="ig">
                        <p class="ig-handle">hifromhani</p>
                        <div class="ig-top"><img src="assets/img/me.jpg" alt=""><span class="ig-name">hi from hani</span></div>
                        <a class="ig-btn" href="https://www.instagram.com/hifromhani/" target="_blank" rel="noopener">Open in Instagram</a>
                        <div class="ig-grid">${['cafe', 'chicago', 'book', 'nyc', 'gwc', 'me'].map(f => `<img src="assets/img/${f}.jpg" alt="">`).join('')}</div>
                    </div>`;
            }
            home.hidden = true; view.hidden = false;
            $('#back').onclick = () => { view.hidden = true; home.hidden = false; };
        });
    },

    makeupbag: () => {
        const bag = $('#mbag'), note = $('#mk-note');
        const toggle = () => {
            const open = bag.classList.toggle('open');
            $('#mpull').setAttribute('aria-label', open ? 'Zip the makeup pouch' : 'Unzip the makeup pouch');
            note.textContent = open ? 'tap anything' : 'pull the zipper';
        };
        $('#mpull').onclick = () => { if (mskip) { mskip = false; return; } toggle(); };
        let mdrag = null, mskip = false;
        const mp = $('#mpull'); mp.style.touchAction = 'none';
        mp.addEventListener('pointerdown', e => { mdrag = { x: e.clientX, moved: false, f: bag.classList.contains('open') ? 1 : 0 }; try { mp.setPointerCapture(e.pointerId); } catch {} });
        mp.addEventListener('pointermove', e => {
            if (!mdrag) return;
            const r = bag.querySelector('.mbag-front').getBoundingClientRect();
            const f = Math.max(0, Math.min(1, (e.clientX - r.left - r.width * .06) / (r.width * .84)));
            if (Math.abs(e.clientX - mdrag.x) > 6) mdrag.moved = true;
            if (!mdrag.moved) return;
            mdrag.f = f; mp.style.transition = 'none'; mp.style.left = `calc(6% + ${f} * (84% - 22px))`;
        });
        mp.addEventListener('pointerup', () => {
            if (!mdrag) return;
            const d = mdrag; mdrag = null; if (!d.moved) return;
            mskip = true; mp.style.transition = ''; mp.style.left = '';
            if ((d.f > .5) !== bag.classList.contains('open')) toggle();
        });
        bag.querySelector('.mbag-front svg').onclick = () => { if (!bag.classList.contains('open')) toggle(); };
        bag.querySelectorAll('.mk').forEach(b => b.onclick = () => {
            // tap one: it swipes on in its real shade, and its name gets written underneath in that shade
            const SH = {
                lipstick: ['#8E2A24', 'Westman Atelier · Glögg', 'lipstick'],
                blush: ['#C98E86', 'Westman Atelier · Baby Cheeks, Mimi', 'blush'],
                mascara: ['#141214', 'Lancôme Lash Idôle · black', 'mascara'],
                concealer: ['#D9B48F', 'Hourglass Vanish concealer', null],
                foundation: ['#C8966F', 'Charlotte Tilbury Beautiful Skin · 6 Neutral', null]
            }[b.dataset.mk];
            if (!SH) return pickUp({ id: 'brushes', name: 'my morphe brushes', open: 'brushes' });
            b.classList.remove('squeeze'); void b.offsetWidth; b.classList.add('squeeze');
            const sw = $('#swatch'), lbl = $('#swatch-label');
            $('#swipe').setAttribute('stroke', SH[0]);
            $('#swipe').setAttribute('stroke-width', b.dataset.mk === 'mascara' ? 6 : 16);
            lbl.textContent = SH[1]; lbl.style.color = SH[0];
            sw.classList.remove('on'); void sw.offsetWidth; sw.classList.add('on');
            const more = $('#swatch-more');
            if (SH[2]) { more.hidden = false; more.onclick = () => pickUp(ITEMS.find(i => i.id === SH[2])); } else more.hidden = true;
        });
        $('#see-makeup2').onclick = () => pickUp({ id: 'makeup', name: 'my makeup', open: 'makeup' });
    },
    ipad: () => {
        const wrap = $('#mk-wrap'), btn = $('#mk-toggle');
        const setOpen = o => { wrap.classList.toggle('open', o); btn.textContent = o ? 'Close it' : 'Open it'; };
        btn.onclick = () => { const o = !wrap.classList.contains('open'); setOpen(o); toast(o ? 'click. it floats ♡' : 'closed, pencil still clinging on'); };
        setTimeout(() => setOpen(true), reduce ? 0 : 450);
        const view = $('#ipad-view'), home = $('#ipad-home');
        const back = '<button type="button" class="back mono" id="ip-back">‹ home</button>';
        sheetBody.querySelectorAll('[data-ip]').forEach(b => b.onclick = () => {
            const k = b.dataset.ip;
            if (k === 'pinterest') {
                const pins = ['art/embracing-cultural-identity', 'img/cake-solar-system', 'img/cafe', 'art/braid', 'posters/gossip-girl', 'img/nyc', 'img/cupcakes', 'art/coexistence-of-both-my-worlds', 'img/chicago', 'art/packing-home', 'img/cake-lego', 'art/vanity'];
                view.innerHTML = back + `<div class="pin-head"><img src="assets/img/me.jpg" alt=""><span><b>Suhani</b><small>@suhxnitiwarii</small></span><a class="pin-btn" href="https://in.pinterest.com/suhxnitiwarii/" target="_blank" rel="noopener">Open my Pinterest</a></div><div class="pins">${pins.map(f => `<img src="assets/${f}.jpg" alt="">`).join('')}</div>`;
            } else if (k === 'procreate') {
                view.innerHTML = back + `<p class="ip-title dark">Gallery</p><div class="canvases">${ART.map(([t, , f], i) => `<button type="button" class="canvas" data-page="${i}"><img src="assets/art/${f}.jpg" alt=""><span>${t}</span></button>`).join('')}</div>`;
                view.classList.add('procreate');
            } else {
                view.innerHTML = back + `<p class="ip-title">made by me</p><div class="apps">${[
                    ['Listening History', 'LH', '#F4A7B9', 'https://listening-history.onrender.com/'],
                    ['Saturday in Austin', 'SA', '#8FD19E', 'https://suhxnitiwari.github.io/saturday-in-austin/'],
                    ['suhanitiwari.com', 'ST', '#F7D54A', 'https://suhanitiwari.com'],
                    ['What’s in my bag?', '👜', '#B9A3E8', 'https://github.com/suhxnitiwari/whats-in-my-bag']
                ].map(([n, t, c, h]) => `<a class="app" href="${h}" target="_blank" rel="noopener"><span class="icon" style="background:${c}">${t}</span><span>${n}</span></a>`).join('')}</div>`;
            }
            if (k !== 'procreate') view.classList.remove('procreate');
            home.hidden = true; view.hidden = false;
            $('#ip-back').onclick = () => { view.hidden = true; home.hidden = false; view.classList.remove('procreate'); };
            view.querySelectorAll('.canvas').forEach(c => c.onclick = () => pickUp(ITEMS.find(i => i.id === 'sketchbook')));
        });
    },
    pencil: () => {
        ink = '#1B1B1F';
        setupPad();
        $('#swatches').onclick = e => {
            const b = e.target.closest('[data-ink]'); if (!b) return;
            ink = b.dataset.ink;
            $('#swatches').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
        };
    },
    apartment: () => { $('#beep').onclick = () => toast('beep. door’s open. welcome home ♡'); },
    mascara: () => {
        setTimeout(() => $('#masc') && $('#masc').classList.add('out'), reduce ? 0 : 350);
        $('#see-makeup').onclick = () => pickUp({ id: 'makeup', name: 'my makeup pouch', open: 'makeup' });
    },

    sketchbook: () => {
        let page = 0;
        const show = i => {
            page = (i + ART.length) % ART.length;
            const [t, n, f] = ART[page];
            $('#art-img').src = `assets/art/${f}.jpg`; $('#art-img').alt = t;
            $('#art-title').textContent = t;
            $('#art-note').textContent = n || 'digital painting, from the portfolio that won a VASE award.';
            $('#art-num').textContent = `page ${page + 1} of ${ART.length}`;
            const sp = $('#spread'); sp.classList.remove('flip'); void sp.offsetWidth; sp.classList.add('flip');
        };
        $('#art-prev').onclick = () => show(page - 1);
        $('#art-next').onclick = () => show(page + 1);
        sheet.onkeydown = e => { if (!$('#spread')) return; if (e.key === 'ArrowRight') show(page + 1); if (e.key === 'ArrowLeft') show(page - 1); };
        show(0);
    },

    wallet: () => {
        const vw = $('#vw'), detail = $('#card-detail'), read = $('#vread');
        // closing, like the real trifold: left side folds in, then the flap folds over, then it snaps
        const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
        let closing = false, opening = false;
        // opening is the same thing backwards: unsnap, the flap swings out to the right, then the front panel swings open to the left
        const open = async () => {
            if (opening || closing || vw.classList.contains('open')) return;
            opening = true;
            if ($('#vclose')) $('#vclose').textContent = 'Close the wallet';
            vw.classList.add('no-anim', 'open', 'fold-left', 'fold-right', 'p1-back', 'flap-back');
            void vw.offsetWidth; vw.classList.remove('no-anim');
            vw.querySelector('.vw-open').removeAttribute('aria-hidden'); $('#snap').tabIndex = -1;
            await wait(120);
            vw.classList.remove('fold-right'); setTimeout(() => vw.classList.remove('flap-back'), reduce ? 0 : 300); await wait(700);
            vw.classList.remove('fold-left'); setTimeout(() => vw.classList.remove('p1-back'), reduce ? 0 : 300); await wait(650);
            opening = false;
        };
        const close = async () => {
            if (closing || !vw.classList.contains('open')) return;
            closing = true;
            vw.classList.remove('cash-out', 'medici-out', 'bills-out');
            vw.querySelectorAll('.vslot .card.picked').forEach(x => { x.classList.remove('picked'); x.style.transform = ''; x.closest('.vslot').style.zIndex = ''; });
            vw.classList.remove('has-pick');
            vw.classList.remove('zip-open');
            vw.classList.add('fold-left'); setTimeout(() => vw.classList.add('p1-back'), reduce ? 0 : 300); await wait(650);
            vw.classList.add('fold-right'); setTimeout(() => vw.classList.add('flap-back'), reduce ? 0 : 300); await wait(650);
            vw.classList.add('no-anim');
            vw.classList.remove('open', 'fold-left', 'fold-right', 'p1-back', 'flap-back');
            vw.querySelector('.vw-open').setAttribute('aria-hidden', 'true');
            $('#snap').tabIndex = 0;
            void vw.offsetWidth; vw.classList.remove('no-anim');
            $('#vclose').textContent = 'Open the wallet';
            vw.classList.add('snapped'); toast('snap ♡'); await wait(500); vw.classList.remove('snapped');
            closing = false;
        };
        $('#vclose').onclick = () => vw.classList.contains('open') ? close() : open();
        vw.querySelector('.vsnap').onclick = close;
        // tapping the bottom-left of the open wallet (below the card slots) starts closing it, like folding it with your hand
        vw.querySelector('.p1').addEventListener('click', e => {
            if (e.target.closest('.card')) return;
            const r = vw.querySelector('.p1').getBoundingClientRect();
            if (e.clientY > r.top + r.height * .45) close();
        });
        $('#snap').onclick = open;
        // the zipper: the pull slides down, the teeth open, then the cash comes out (and the reverse)
        let zipping = false, zdrag = null, zskip = false;
        const zp = $('#vzip');
        zp.style.touchAction = 'none';
        zp.addEventListener('pointerdown', e => { zdrag = { y: e.clientY, moved: false, f: vw.classList.contains('zip-open') ? 1 : 0 }; try { zp.setPointerCapture(e.pointerId); } catch {} });
        zp.addEventListener('pointermove', e => {
            if (!zdrag) return;
            const r = zp.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
            if (Math.abs(e.clientY - zdrag.y) > 6) zdrag.moved = true;
            if (!zdrag.moved) return;
            zdrag.f = f;
            zp.querySelector('.zgap').style.cssText = `height:${f * 82}%; transition:none`;
            zp.querySelector('.zpull').style.cssText = `top:${6 + f * 78}%; transition:none`;
        });
        zp.addEventListener('pointerup', () => {
            if (!zdrag) return;
            const d = zdrag; zdrag = null;
            if (!d.moved) return;
            zskip = true;
            zp.querySelector('.zgap').style.cssText = ''; zp.querySelector('.zpull').style.cssText = '';
            const want = d.f > .5, is = vw.classList.contains('zip-open');
            if (want !== is) zp.onclick(); else zskip = false;
        });
        $('#vzip').onclick = async () => {
            if (zskip) zskip = false;
            if (zipping) return; zipping = true;
            const z = $('#vzip');
            if (!vw.classList.contains('zip-open')) {
                vw.classList.add('zip-open'); z.setAttribute('aria-pressed', 'true'); z.setAttribute('aria-label', 'Zip pocket: zip it back up');
                await new Promise(r => setTimeout(r, reduce ? 0 : 480));
                vw.classList.add('cash-out'); toast('my medici card ♡ a vanilla latte a day');
            } else {
                vw.classList.remove('cash-out');
                await new Promise(r => setTimeout(r, reduce ? 0 : 420));
                vw.classList.remove('zip-open'); z.setAttribute('aria-pressed', 'false'); z.setAttribute('aria-label', 'Zip pocket: unzip it');
            }
            zipping = false;
        };
        // the bill compartment, behind the flap: rupees for home, dollars for here
        $('#vbills').onclick = () => {
            const out = vw.classList.toggle('bills-out');
            $('#vbills').setAttribute('aria-pressed', out); $('#vbills').setAttribute('aria-label', out ? 'Bill compartment: tuck the cash back in' : 'Bill compartment: take the cash out');
            toast(out ? 'rupees for home, dollars for here ♡' : 'cash tucked away');
        };
        // the Medici card comes out with the cash. Tap it for a vanilla latte stamp.
        $('#medici').onclick = () => {
            if (vw.classList.contains('medici-out')) {
                vw.classList.remove('medici-out');
                detail.innerHTML = '<p class="hand" style="font-size:1.4rem; color:var(--plum); text-align:center">pick a card, any card</p>';
                toast('back in the zip pocket ♡'); return;
            }
            vw.classList.add('medici-out');
            const draw = () => {
                const n = mediciStamps();
                detail.innerHTML = `<p class="mono" style="margin:0 0 4px; color:var(--muted)">Medici regulars card</p><h3>One vanilla latte, every day</h3>
                    <div class="medici-big">${mediciHTML(n)}</div>
                    <p class="m">${n}/10 stamps · ${10 - n} more until a free one</p>
                    <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="latte">Get my vanilla latte ☕</button></div>`;
                $('#latte').onclick = () => {
                    let k = mediciStamps() + 1;
                    if (k >= 10) { saveStamps(10); draw(); toast('10/10! the next vanilla latte is on medici ♡'); saveStamps(0); setTimeout(() => { draw(); }, 1600); }
                    else { saveStamps(k); draw(); toast(['stamped ♡', 'same order as yesterday', 'they know my name by now', 'vanilla latte, obviously'][k % 4]); }
                    $('#medici').innerHTML = mediciHTML(mediciStamps());
                };
            };
            draw(); detail.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
        };
        // tap a card: it slides straight up out of its slot, like pulling it out with a thumb. Tap again to tuck it back.
        const tuck = () => vw.querySelectorAll('.vslot .card.picked').forEach(x => { x.classList.remove('picked'); x.style.transform = ''; x.closest('.vslot').style.zIndex = ''; });
        vw.querySelectorAll('.vslot .card').forEach(card => card.onclick = () => {
            const was = card.classList.contains('picked');
            tuck();
            if (was) { vw.classList.remove('has-pick'); return; }
            const c = CARDS[+card.dataset.card];
            vw.classList.add('has-pick');
            card.classList.add('picked');
            // same orientation, same size: it just slides straight up, still tucked into its slot at the bottom
            card.style.transform = 'translateY(-88%)';
            detail.innerHTML = `<p class="mono" style="margin:0 0 4px; color:var(--muted)">${c.title}</p><h3>${c.kind === 'id' ? c.sub : c.big}</h3><p class="m">${c.metric}</p><p>${c.body}</p>`;
            if (c.go) { detail.insertAdjacentHTML('beforeend', `<button class="btn solid" type="button" id="card-go">Open my passport</button>`); $('#card-go').onclick = () => pickUp(ITEMS.find(x => x.id === c.go)); }
        });
        if (!reduce) setTimeout(open, 700); else open();
    },

    binder: () => {
        sheetBody.querySelectorAll('.bpage').forEach(b => b.onclick = () => pickUp({ id: b.dataset.case, name: 'from my binder', open: b.dataset.case }));
    },

    mildliners: () => pensAfter(PENS),
    gelpens: () => pensAfter(GELPENS),

    sunglasses: () => {
        $('#shades').onclick = () => {
            const on = document.body.classList.toggle('shades');
            $('#shades').textContent = on ? 'Take them off' : 'Put them on';
            $('#shades-note').textContent = on ? 'ooh, very mysterious.' : 'and we’re back.';
        };
    },

    keys: () => {
        const lines = {
            lock: 'locked. probably. let me press it again.',
            unlock: 'unlocked… now which car was it?',
            trunk: 'the trunk is open. i did not mean to do that.',
            panic: 'beep beep beep. sorry, Austin.'
        };
        sheetBody.querySelector('.fob-btns').onclick = e => {
            const b = e.target.closest('[data-fob]'); if (!b) return;
            toast(lines[b.dataset.fob]);
            if (b.dataset.fob === 'panic' && !reduce) { const f = $('#fob'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
        };
    },

    stanley: () => {
        let n = 2;
        $('#sip').onclick = () => {
            if (n >= 8) return toast('fully hydrated. screenshot this, it won’t happen again.');
            const cups = document.querySelectorAll('#cups .cup');
            cups[n].style.background = 'var(--pink)'; n++;
            $('#cup-note').textContent = n >= 8 ? '8 of 8?? who am i.' : `${n} of 8. thank you for your service.`;
        };
    },

    sweater: () => {
        const sw = $('#sw');
        $('#sw-fold').onclick = () => { const f = sw.classList.toggle('folded'); $('#sw-fold').textContent = f ? 'Unfold it' : 'Fold it'; };
        $('#wear').onclick = () => {
            const on = document.body.classList.toggle('cozy');
            $('#wear').textContent = on ? 'Take it off' : 'Put it on';
            toast(on ? 'ahh. so much better.' : 'brr. okay, it’s back in the bag.');
        };
    },

    laptop: () => {
        const showDesk = on => {
            $('#lap-closed').hidden = on; $('#desktop').hidden = !on;
            $('#lap-note').textContent = on ? 'my desktop. every folder is a project.' : 'the stickers are load-bearing. tap one, or open it up.';
            if (on) $('#lap-clock').textContent = new Date().toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });
        };
        $('#lap-open').onclick = () => showDesk(true);
        $('#lap-close').onclick = () => showDesk(false);
        sheetBody.querySelectorAll('.dfolder').forEach(f => f.onclick = () => {
            const go = f.dataset.go;
            if (go.startsWith('http')) window.open(go, '_blank', 'noopener');
            else pickUp({ id: go, name: 'from my laptop', open: go });
        });
        const label = $('#stk-label');
        sheetBody.querySelectorAll('.stk').forEach(g => {
            const k = STICKERS.find(x => x.id === g.dataset.sticker);
            const go = () => {
                if (k.href) return window.open(k.href, '_blank', 'noopener');
                const it = ITEMS.find(i => i.id === k.go);
                pickUp(it || { id: k.go, name: k.label.split(' → ')[1], open: k.go });
            };
            g.addEventListener('mouseenter', () => label.textContent = k.label);
            g.addEventListener('focus', () => label.textContent = k.label);
            g.addEventListener('click', go);
            g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
        });
    },

    mirror: () => {
        const lid = $('#lid'), cp = $('#compact');
        let ang = 0, drag = null;
        const setAng = (a, anim) => { ang = Math.max(0, Math.min(170, a)); lid.style.transition = anim ? 'transform .9s cubic-bezier(.2,.8,.2,1)' : 'none'; lid.style.transform = `rotateX(${ang}deg)`; };
        setTimeout(() => setAng(170, true), reduce ? 0 : 450);
        cp.style.touchAction = 'none';
        cp.addEventListener('pointerdown', e => { drag = { y: e.clientY, a: ang }; try { cp.setPointerCapture(e.pointerId); } catch {} });
        cp.addEventListener('pointermove', e => { if (drag) setAng(drag.a + (drag.y - e.clientY) * .9); });
        const up = () => { if (!drag) return; drag = null; if (ang < 12) { setAng(0, true); toast('snap. closed.'); } else if (ang > 160) setAng(170, true); };
        cp.addEventListener('pointerup', up); cp.addEventListener('pointercancel', up);
    },

    sitara: () => {
        const chat = $('#chat');
        const answers = [
            'She studies why people choose what they choose, then builds around it. MIS and Psychology at UT Austin, with internships at Oracle, Acacia Advisors and Outlier.',
            'Because she carries her whole life around in it. Laptop, sketchbook, the Westman lipstick. It felt more honest than a résumé.',
            'She asked me to tell you the truth: no. Whoops. But she is very good at everything that doesn’t involve reversing.'
        ];
        const say = (text, me) => {
            const row = document.createElement('div');
            row.className = 'msg' + (me ? ' me' : '');
            row.innerHTML = me ? '<div class="b"></div>' : '<img src="assets/img/sitara.jpg" alt=""><div class="b"></div>';
            chat.appendChild(row);
            const b = row.querySelector('.b');
            if (me || reduce) { b.textContent = text; return Promise.resolve(); }
            return type(b, text);
        };
        say('Hi! I’m Sitara ✦ I live in Suhani’s caramel frappuccino charm, right next to her Cozy Vanilla Almond hand sanitizer. Ask me anything about her.');
        $('#chips').onclick = async e => {
            const b = e.target.closest('[data-q]'); if (!b) return;
            await say(b.textContent, true);
            await new Promise(r => setTimeout(r, 350));
            say(answers[+b.dataset.q]);
        };
    }
};

/* ---------- little helpers ---------- */
let ink = '#E63F7A';
function setupPad() {
    const cv = $('#pad-canvas'); if (!cv) return;
    const ctx = cv.getContext('2d'), hint = $('#pad-hint');
    const size = () => {
        const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1;
        const saved = cv.width ? ctx.getImageData(0, 0, cv.width, cv.height) : null;
        cv.width = r.width * d; cv.height = r.height * d;
        ctx.scale(d, d); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (saved) ctx.putImageData(saved, 0, 0);
    };
    size();
    let drawing = false, last = null;
    const pt = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    cv.addEventListener('pointerdown', e => {
        e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {}
        drawing = true; last = pt(e); hint.hidden = true;
        ctx.strokeStyle = ink; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(last.x, last.y, 1.3, 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill();
    });
    cv.addEventListener('pointermove', e => {
        if (!drawing) return;
        const p = pt(e), mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        last = p;
    });
    const stop = () => { drawing = false; };
    cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
    $('#pad-clear').onclick = () => { ctx.clearRect(0, 0, cv.width, cv.height); hint.hidden = false; };
}
// the BIC pencils: draw in graphite, erase with the pink end
function setupPencil() {
    const cv = $('#pencil-canvas'); if (!cv) return;
    const ctx = cv.getContext('2d'), hint = $('#pencil-hint');
    const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1;
    cv.width = r.width * d; cv.height = r.height * d; ctx.scale(d, d); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    let tool = 'pencil', drawing = false, last = null;
    const pt = e => { const b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    cv.addEventListener('pointerdown', e => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {} drawing = true; last = pt(e); hint.hidden = true; });
    cv.addEventListener('pointermove', e => {
        if (!drawing) return;
        const p = pt(e);
        ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        ctx.strokeStyle = 'rgba(70, 70, 72, .82)'; ctx.lineWidth = tool === 'eraser' ? 16 : 1.8;
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p;
    });
    const stop = () => { drawing = false; };
    cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
    sheetBody.querySelector('.sketch-tools').onclick = e => {
        const b = e.target.closest('[data-tool]'); if (!b) return;
        if (b.dataset.tool === 'clear') { ctx.clearRect(0, 0, cv.width, cv.height); hint.hidden = false; return; }
        tool = b.dataset.tool;
        sheetBody.querySelectorAll('.sketch-tools [data-tool]').forEach(x => x.classList.toggle('on', x === b));
        cv.style.cursor = tool === 'eraser' ? 'cell' : 'crosshair';
    };
}
function pensAfter(list) {
    const pens = $('#pens'), note = $('#pen-note');
    setupPencil();
    const tele = $('#tele-btn'), pf = $('#pouch-front');
    const setTele = up => { pf.classList.toggle('down', up); pens.classList.toggle('open', up); if (tele) tele.textContent = up ? 'Pull it back up' : 'Push it down'; note.textContent = up ? pens.dataset.pick : 'zipped and standing tall'; };
    if (tele) { tele.onclick = () => setTele(!pens.classList.contains('open')); pf.onclick = () => setTele(!pens.classList.contains('open')); pf.style.cursor = 'pointer'; }
    const cc = $('#cc-btn');
    const setZip = o => { pf.classList.toggle('unzipped', o); pens.classList.toggle('open', o); cc.textContent = o ? 'Zip it' : 'Unzip it'; note.textContent = o ? pens.dataset.pick : 'zipped. three compartments of pens in there'; };
    if (cc) { cc.onclick = () => setZip(!pens.classList.contains('open')); pf.onclick = () => setZip(!pens.classList.contains('open')); pf.style.cursor = 'pointer'; }
    setTimeout(() => { if (tele) setTele(true); else if (cc) setZip(true); else { pens.classList.add('open'); note.textContent = pens.dataset.pick; } }, reduce ? 0 : 500);
    pens.onclick = e => {
        const b = e.target.closest('[data-pen]'); if (!b) return;
        const p = list[+b.dataset.pen];
        // highlighters tell you which tool they are; gel pens just write in their color
        note.innerHTML = p.full
            ? `<span class="hl-line"><span class="hl" style="--hl:${p.c}">${p.full}</span></span><span class="hl-sub mono">${p.subject}${p.name.startsWith('MIS') ? ' · ' + p.name : ''} · UT Austin</span>`
            : p.note
            ? `<b style="font-family:var(--mono); font-size:.8rem; letter-spacing:.08em">${p.name.toUpperCase()}</b> · ${p.note}`
            : `writing in <span style="color:${p.c}; font-size:1.7rem">${p.name.toLowerCase()}</span>`;
        if (!p.note && !p.full) {
            ink = p.c;
            const t = $('#pad-text');
            if (t) { t.focus(); document.execCommand('styleWithCSS', false, true); document.execCommand('foreColor', false, p.c); t.style.caretColor = p.c; }
        }
    };
}

function type(el, text, speed = 24) {
    return new Promise(res => {
        el.classList.add('caret');
        let i = 0;
        const step = () => {
            el.textContent = text.slice(0, ++i);
            if (i < text.length) setTimeout(step, speed + (/[.,!?]/.test(text[i - 1]) ? 160 : Math.random() * 28));
            else { el.classList.remove('caret'); res(); }
        };
        step();
    });
}
let toastTimer;
function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2400);
}
})();
