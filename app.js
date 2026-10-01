/* What's in my bag? Every zipper is a pocket. Pull one and its things fall out (stop-motion style); tap anything to pick it up. */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s);
const stage = $('#stage'), bagBtn = $('#bag'), bagArt = $('#bag-art'), list = $('#items');
const sheet = $('#sheet'), sheetBody = $('#sheet-body'), sheetLabel = $('#sheet-label');
const phone = () => matchMedia('(max-width: 760px)').matches;
const moved = {};   // things you've dragged somewhere else on the table
const stowed = new Set();   // things you've put back in their pocket (the pocket stays open)

/* ---------- the line under the title changes every 5 seconds ---------- */
const LEDES = [
    'I carry my whole life in this backpack.',
    'Pull the zipper. Everything falls out.',
    'Chargers at the very bottom. Always one knot.',
    'A rom-com, a journal and way too much skincare.',
    'Basically a résumé you can unzip.'
];
{
    const lede = document.getElementById('lede');
    let li = 0;
    if (lede) setInterval(() => {
        li = (li + 1) % LEDES.length;
        if (reduce) { lede.textContent = LEDES[li]; return; }
        lede.classList.add('swap');
        setTimeout(() => { lede.textContent = LEDES[li]; lede.classList.remove('swap'); }, 350);
    }, 5000);
}

/* ---------- the bag, with my caramel frappuccino charm clipped on (my hand sanitizer lives in it) ---------- */
bagArt.innerHTML = BAG.closed;
const charm = document.createElement('span');
charm.className = 'charm';
charm.setAttribute('role', 'button');
charm.setAttribute('tabindex', '0');
charm.setAttribute('aria-label', 'My Bath & Body Works caramel frappuccino charm, with my hand sanitizer inside');
charm.innerHTML = BAG.charm;
bagBtn.appendChild(charm);
const openCharm = e => { e.stopPropagation(); e.preventDefault(); pickUp({ id: 'sanitizer', name: 'my caramel frappuccino charm', open: 'sanitizer' }); };
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
    if (!out) {
        // one tap: up out of the side pocket, then set down on the floor next to the bag
        bottle.classList.add('out'); bottle.setAttribute('aria-label', 'My pink Stanley, out of the pocket. Tap the lid to open it, the bottle for my water tracker, the pocket to put it back');
        setTimeout(() => { bottle.classList.add('free'); bsvg.style.transform = `translate(${Math.round(bsvg.getBoundingClientRect().width * 1.1)}px, 0px)`; }, reduce ? 0 : 420);
        toast('out she comes. tap the lid for a sip, drag her back to put her away.');
        return;
    }
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
    let items = ITEMS.filter(i => i.zip !== 'side' && i.zip !== 'attached' && open.has(i.zip) && !stowed.has(i.id)).map(sizeOf);
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
    for (const b of placed) {
        const li = document.getElementById('item-' + b.it.id); if (!li) continue;
        li.style.setProperty('--l', `${b.cx * CM}%`);
        li.style.setProperty('--t', `${b.cy / H * 100}%`);
        if (moved[b.it.id]) { li.style.setProperty('--l', moved[b.it.id][0] + '%'); li.style.setProperty('--t', moved[b.it.id][1] + '%'); }
    }
}

// rearrange the table however you like: drag anything that's out; a tap still picks it up
{
    let d = null, skip = false, zTop = 40;
    list.addEventListener('pointerdown', e => {
        const li = e.target.closest('.item.out'); if (!li || phone() || e.button) return;
        d = { li, x: e.clientX, y: e.clientY, on: false, id: li.id.slice(5) };
    });
    const overBag = e => { const r = bagBtn.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; };
    let hinted = false;
    addEventListener('pointermove', e => {
        if (!d) return;
        const dx = e.clientX - d.x, dy = e.clientY - d.y;
        if (!d.on && Math.hypot(dx, dy) < 7) return;
        if (!d.on) { d.on = true; d.li.classList.add('dragging'); d.li.style.zIndex = ++zTop; }
        d.li.style.translate = `${dx}px ${dy}px`;
        bagBtn.classList.toggle('drop-here', overBag(e));
    });
    addEventListener('pointerup', e => {
        if (!d) return;
        const { li, on, id } = d; d = null;
        bagBtn.classList.remove('drop-here');
        if (!on) return;
        if (overBag(e)) { skip = true; return stow(id); }
        if (!hinted) { hinted = true; setTimeout(() => toast('drop anything on the backpack to put it back in its pocket'), 400); }
        const r = stage.getBoundingClientRect(), [tx, ty] = (li.style.translate || '0px 0px').split(' ').map(parseFloat);
        const l = parseFloat(li.style.getPropertyValue('--l')) + tx / r.width * 100, t = parseFloat(li.style.getPropertyValue('--t')) + (ty || 0) / r.height * 100;
        li.style.translate = ''; li.classList.remove('dragging');
        li.style.setProperty('--l', l + '%'); li.style.setProperty('--t', t + '%');
        moved[id] = [l, t]; skip = true;
    });
    list.addEventListener('click', e => { if (skip) { skip = false; e.stopPropagation(); e.preventDefault(); } }, true);
}

function stow(id) {
    const it = ITEMS.find(i => i.id === id), pk = BAG.pockets.find(p => p.id === it.zip), li = document.getElementById('item-' + id);
    if (!pk || !li) return;
    stowed.add(id); delete moved[id];
    const done = () => {
        li.style.translate = ''; li.classList.remove('out', 'dragging'); li.querySelector('button').tabIndex = -1;
        relayout();
        const left = ITEMS.filter(i => i.zip === pk.id && !stowed.has(i.id));
        if (!left.length) { toast(`all back in ${POCKET_NAME[pk.id]}. zipped ♡`); zipUp(pk); }
        else toast(`back in ${POCKET_NAME[pk.id]} ♡`);
    };
    if (reduce) return done();
    // aim for the middle of that pocket's zipper
    const { path, len } = pk.el, p = path.getPointAtLength(len / 2), m = path.getScreenCTM();
    const tx = m.a * p.x + m.c * p.y + m.e, ty = m.b * p.x + m.d * p.y + m.f, box = li.getBoundingClientRect();
    const dx = tx - (box.left + box.width / 2), dy = ty - (box.top + box.height / 2), base = phone() ? '' : 'translate(-50%, -50%) ';
    li.animate([
        { transform: `${base}rotate(${it.r}deg)`, opacity: 1 },
        { transform: `${base}translate(${dx * .6}px, ${dy * .6 - 30}px) scale(.6) rotate(${it.r * 3}deg)`, opacity: 1, offset: .6 },
        { transform: `${base}translate(${dx}px, ${dy}px) scale(.1) rotate(${it.r * 4}deg)`, opacity: 0 }
    ], { duration: 480, easing: 'steps(6, end)' }).finished.then(done, done);
}

let busy = Promise.resolve();
function unzip(pk, from = 0) {
    busy = busy.then(async () => {
        if (open.has(pk.id)) return;
        open.add(pk.id);
        ITEMS.forEach(i => { if (i.zip === pk.id) stowed.delete(i.id); });
        stage.classList.remove('idle');
        pk.el.pull.setAttribute('aria-pressed', 'true');
        pk.el.pull.setAttribute('aria-label', `Zip up: ${pk.label}`);
        pk.el.g.classList.add('open');
        $('#bag-hint').textContent = '';
        await slide(pk, from, 1);
        relayout();
        if (!dumping()) toast(POCKET_SAY[pk.id] || '');
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
        if (BAG.pockets.every(p => open.has(p.id))) bagBtn.classList.remove('tip');
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
        ITEMS.forEach(i => { if (i.zip === pk.id) stowed.delete(i.id); });
        relayout();
        pk.el.g.classList.remove('open');
        pk.el.pull.setAttribute('aria-pressed', 'false');
        pk.el.pull.setAttribute('aria-label', `Unzip: ${pk.label}`);
        syncAllBtn();
        if (!open.size) { $('#after').hidden = true; $('#bag-hint').textContent = 'pull me →'; stage.classList.add('idle'); stage.style.aspectRatio = ''; bagBtn.style.top = ''; }
    });
    return busy;
}
// one button at the top: unzips everything, or once it's all out, packs it all back up
const allBtn = $('#unzip-all');
const syncAllBtn = () => {
    const all = BAG.pockets.every(pk => open.has(pk.id));
    allBtn.hidden = !open.size && !all;
    allBtn.textContent = all ? 'put my life back together →' : 'fine. dump the whole thing →';
    allBtn.dataset.mode = all ? 'pack' : 'dump';
};
allBtn.addEventListener('click', () => {
    if (allBtn.dataset.mode === 'pack') { $('#repack').click(); return; }
    $('#stage').scrollIntoView({ block: 'center', behavior: 'auto' });
    // the whole bag tips over and everything spills out
    bagBtn.classList.remove('tip'); void bagBtn.offsetWidth; bagBtn.classList.add('tip');
    toast('okay. everything. you asked for this.');
    setTimeout(() => { BAG.pockets.forEach(pk => unzip(pk)); }, reduce ? 0 : 650);
});
$('#repack').addEventListener('click', () => {
    BAG.pockets.forEach(pk => zipUp(pk));
    document.body.classList.remove('shades', 'cozy');
    bagBtn.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
});

list.addEventListener('click', e => {
    const part = e.target.closest('[data-part]');
    if (part) {
        if (part.dataset.part === 'mailbox') return pickUp({ id: 'mailbox', name: 'my mailbox key', open: 'mailbox' });
        if (part.dataset.part === 'pencil') return pickUp(ITEMS.find(i => i.id === 'pencil'));
        return pickUp(part.dataset.part === 'bmw' ? ITEMS.find(i => i.id === 'keys') : { id: 'apartment', name: 'my apartment fob', open: 'apartment' });
    }
    const b = e.target.closest('[data-item]');
    if (b) pickUp(ITEMS.find(i => i.id === b.dataset.item));
});


/* gift cards = store credit from every online order i didn't return in time */
const GIFTCARDS = [
    { id: 'aritzia', name: 'Aritzia', front: '<span class="gc-word">ARITZIA</span>', why: 'an online order. return window: missed.', bal: 'enough for one (1) sweater', last: '0731' },
    { id: 'chanel', name: 'Chanel', front: '<span class="gc-word">CHANEL</span><span class="gc-sub">BEAUTY</span>', why: 'a return, mailed one day late.', bal: 'a lipstick, maybe two', last: '1910' },
    { id: 'sephora', name: 'Sephora', front: '<span class="gc-stripes"></span><span class="gc-word">SEPHORA</span>', why: 'the box sat by my door for 31 days.', bal: 'a mystery, honestly', last: '1969' }
];



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


/* ---------- snooping: progress, pocket personalities, objects that say something together ---------- */
const POCKET_SAY = {
    devices: 'the if-i-lost-it-i’d-cry pocket.',
    main: 'the “i might need this” pocket. (i always do.)',
    shades: 'the pocket for things i grab all day, things i don’t want to deal with, and a mirror. i’m very self-reflective.',
    front: 'the girl pocket.'
};
const dumping = () => bagBtn.classList.contains('tip');
const SNOOPABLE = ITEMS.filter(i => i.zip !== 'makeup' && i.zip !== 'attached').map(i => i.id);
const snooped = new Set();
const COMBOS = [
    [['laptop', 'headphones'], 'laptop + headphones: do not disturb.'],
    [['ticket', 'keys'], 'a speeding ticket and the car keys. we don’t talk about it.'],
    [['todo', 'journal'], 'an overdue to-do list hiding behind a journal about believing in herself. iconic.'],
    [['bear', 'padfolio'], 'a teddy bear next to the résumés. she contains multitudes.'],
    [['backup-lip', 'makeup-pouch'], 'a mac lipstick in the makeup bag AND a westman backup in the grab-it pocket. priorities.'],
    [['bear', 'cards'], 'T.D. and a stack of her little sister’s cards. okay, now you know her soft spot.'],
    [['laptop', 'padfolio', 'nb1'], 'laptop, padfolio, notebooks. she will work anywhere.'],
    [['makeup-pouch', 'mirror', 'scrunchies'], 'makeup, mirror, scrunchies: the getting-my-life-together kit.'],
    [['wallet', 'laptop'], 'a medici card and a laptop. apparently cafés are offices now.'],
    [['passport', 'wallet'], 'a passport with six countries in it. she’s always halfway somewhere.'],
    [['romcom', 'journal'], 'one book she’s not reading, one journal she always writes in.'],
    [['keys', 'stanley'], 'car keys and a full stanley. she is not coming back for hours.']
];
const saidCombo = new Set();
function snoop(id) {
    if (!SNOOPABLE.includes(id) || snooped.has(id)) return;
    snooped.add(id);
    const el = $('#snoop'); el.hidden = false;
    el.textContent = `${snooped.size} / ${SNOOPABLE.length} things snooped`;
    for (const [ids, line] of COMBOS) if (!saidCombo.has(line) && ids.every(x => snooped.has(x))) { saidCombo.add(line); setTimeout(() => toast(line), 1400); break; }
    if (snooped.size === SNOOPABLE.length) { el.textContent = '100% snooped'; $('#ending').hidden = false; }
}


/* things opened from inside the makeup pouch get a way back to it (already unzipped) */
function backToPouch() {
    sheetBody.insertAdjacentHTML('afterbegin', '<button type="button" class="back-desk mono" id="back-pouch">‹ back to my makeup bag</button>');
    $('#back-pouch').onclick = () => {
        pickUp(ITEMS.find(i => i.id === 'makeup-pouch'));
        const bag = $('#mbag'); if (bag && !bag.classList.contains('open')) $('#mpull').click();
    };
}

/* ---------- picking something up ---------- */
// going from one thing to another (a sticker, an app, a link) stacks the new page on top.
// the page underneath is kept exactly as it was, so "back" lands you right where you left off
const navStack = [];
let curItem = null;
const WEB_OK = /^https:\/\/(suhxnitiwari\.github\.io|listening-history\.onrender\.com)\//;
function goTo(it) {
    if (sheet.open && curItem) {
        const frag = document.createDocumentFragment(); frag.append(...sheetBody.childNodes);
        navStack.push({ it: curItem, frag, label: sheetLabel.textContent, top: sheet.scrollTop });
    }
    pickUp(it);
    const prev = navStack[navStack.length - 1]; if (!prev) return;
    sheetBody.insertAdjacentHTML('afterbegin', `<button type="button" class="nav-back mono" id="nav-back">‹ back to ${prev.label}</button>`);
    $('#nav-back').onclick = goBack;
    sheetBody.classList.remove('nav-in', 'nav-out'); void sheetBody.offsetWidth; sheetBody.classList.add('nav-in');
}
function goBack() {
    const p = navStack.pop(); if (!p) return;
    curItem = p.it; sheetLabel.textContent = p.label;
    sheetBody.replaceChildren(p.frag);
    sheet.scrollTop = p.top;
    if (p.it.open === 'phone') AFTER.phone();   // restart the live clock
    sheetBody.classList.remove('nav-in', 'nav-out'); void sheetBody.offsetWidth; sheetBody.classList.add('nav-out');
}
// one of my own sites: open it right here, inside the bag
const openWeb = (href, title) => goTo({ id: 'web', name: title || new URL(href).hostname, open: () => `<div class="web"><div class="web-bar mono"><span>🔒 ${href.replace(/^https:\/\//, '').replace(/\/$/, '')}</span><a href="${href}" target="_blank" rel="noopener">new tab ↗</a></div><iframe src="${href}" title="${(title || '').replace(/"/g, '')}" loading="lazy"></iframe></div>` });
sheetBody.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.closest('.web-bar') || !WEB_OK.test(a.href)) return;
    e.preventDefault();
    openWeb(a.href, (a.querySelector('b') || a).textContent.trim().slice(0, 60));
});
sheet.addEventListener('close', () => { navStack.length = 0; curItem = null; });

function pickUp(it) {
    curItem = it;
    snoop(it.id);
    sheetLabel.textContent = it.name;
    sheetBody.innerHTML = typeof it.open === 'function' ? it.open() : (VIEWS[it.open] || (() => ''))();
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
    (AFTER[typeof it.open === 'function' ? it.id : it.open] || (() => {}))();
}
sheet.addEventListener('click', e => {
    if (e.target === sheet || e.target.closest('[data-close]')) sheet.close();
});

/* ---------- what each thing shows you ---------- */
// the sunglasses view: the same moment, before and after the lenses.
// .rom pieces only exist through the glasses; .meh pieces only exist without them
const RZ_K = 'stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"';
const RZ_SPARK = pts => pts.map(([x, y, s]) => `<path class="tw" style="animation-delay:${(x * 7 % 13) / 10}s" d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z" fill="#FFF6D8"/>`).join('');
const RZ_LIGHTS = (y, n) => `<path d="M-5 ${y} Q100 ${y + 26} 200 ${y + 4} T405 ${y + 6}" fill="none" stroke="#5A3A2E" stroke-width="1.5"/>` +
    Array.from({ length: n }, (_, i) => { const x = 10 + i * (390 / n); const yy = y + 12 + Math.sin(i * 1.3) * 7; return `<circle class="tw" style="animation-delay:${i % 5 * .3}s" cx="${x}" cy="${yy}" r="4.5" fill="#FFE08A"/><circle cx="${x}" cy="${yy}" r="10" fill="#FFE08A" opacity=".25"/>`; }).join('');
const RZ_HEARTS = pts => pts.map(([x, y, s]) => `<path class="fl" d="M${x} ${y + s} C${x - 2 * s} ${y - s * .2} ${x - s} ${y - 1.6 * s} ${x} ${y - .5 * s} C${x + s} ${y - 1.6 * s} ${x + 2 * s} ${y - s * .2} ${x} ${y + s}Z" fill="#F4A6BE"/>`).join('');

const ROMANCE = [
    {
        plain: 'a walk to class. it’s already hot. i’m already late.',
        rom: 'soft light on the forty acres. main character walks to her lecture.',
        svg: `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
            <defs><linearGradient id="rzS1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3A9C0"/><stop offset=".6" stop-color="#FFCFA0"/><stop offset="1" stop-color="#FFEBC8"/></linearGradient>
            <radialGradient id="rzG"><stop offset="0" stop-color="#FFF4D6"/><stop offset="1" stop-color="#FFF4D6" stop-opacity="0"/></radialGradient></defs>
            <rect width="400" height="240" fill="#C8CFD3"/>
            <g class="rom"><rect width="400" height="240" fill="url(#rzS1)"/><circle cx="310" cy="120" r="110" fill="url(#rzG)"/><circle cx="310" cy="128" r="24" fill="#FFE6B0"/></g>
            <g class="meh"><path d="M60 50 q20 -14 40 0 q16 -10 30 4 h-70z M250 38 q18 -12 34 0 q14 -8 26 4 h-60z" fill="#B5BCC0"/></g>
            <rect x="40" y="128" width="120" height="64" fill="#D6CDC2" ${RZ_K}/><rect x="248" y="134" width="124" height="58" fill="#D6CDC2" ${RZ_K}/>
            ${[60, 85, 110, 135].map(x => `<rect x="${x}" y="142" width="12" height="18" fill="#A9A29A"/>`).join('')}${[268, 293, 318, 343].map(x => `<rect x="${x}" y="146" width="12" height="18" fill="#A9A29A"/>`).join('')}
            <g fill="#C9BFB4" ${RZ_K}><rect x="180" y="62" width="40" height="130"/><rect x="185" y="38" width="30" height="26"/><path d="M188 38 L200 18 L212 38Z"/></g>
            <g class="rom"><rect x="185" y="38" width="30" height="26" fill="#FFAD4D" ${RZ_K}/><circle cx="200" cy="51" r="24" fill="#FFAD4D" opacity=".3"/>
            ${[60, 85, 110, 135].map(x => `<rect x="${x}" y="142" width="12" height="18" fill="#FFD98A"/>`).join('')}${[268, 293, 318, 343].map(x => `<rect x="${x}" y="146" width="12" height="18" fill="#FFD98A"/>`).join('')}</g>
            <g ${RZ_K}><circle cx="22" cy="150" r="30" fill="#8FA08A"/><circle cx="384" cy="152" r="28" fill="#8FA08A"/></g>
            <g class="rom">${[[10, 128], [30, 140], [12, 162], [372, 136], [392, 150], [380, 168]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#F8B4CB" stroke="#fff" stroke-width="1.5"/>`).join('')}</g>
            <rect y="190" width="400" height="50" fill="#BBB4AC"/><path d="M150 240 L190 190 H210 L250 240Z" fill="#D9D2CA"/>
            <g class="meh"><path d="M120 214 q4 -6 8 0 q4 6 8 0 M268 222 q4 -6 8 0 q4 6 8 0" fill="none" stroke="#9A938C" stroke-width="2"/><text x="350" y="40" font-family="JetBrains Mono" font-size="16" fill="#7A7470">98°</text></g>
            <g class="rom"><path d="M70 70 q6 -6 12 0 q6 -6 12 0 M110 54 q5 -5 10 0 q5 -5 10 0 M250 76 q5 -5 10 0 q5 -5 10 0" fill="none" stroke="#5A3A2E" stroke-width="2"/>${RZ_SPARK([[150, 100, 6], [240, 60, 5], [350, 90, 7], [60, 110, 5], [280, 200, 6], [110, 205, 5]])}</g>
        </svg>`
    },
    {
        plain: 'hour four in the library. my coffee is cold.',
        rom: 'dark academia era. warm lamp, fresh coffee, big plans.',
        svg: `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
            <rect width="400" height="240" fill="#CFCBC6"/>
            <g class="rom"><rect width="400" height="240" fill="#5B3A36"/><circle cx="96" cy="120" r="130" fill="#FFB86B" opacity=".35"/></g>
            <rect x="250" y="26" width="110" height="96" fill="#B9C3CA" ${RZ_K}/><path d="M305 26 V122 M250 74 H360" ${RZ_K}/>
            <g class="rom"><rect x="250" y="26" width="110" height="96" fill="#2C2A4A" ${RZ_K}/><path d="M305 26 V122 M250 74 H360" ${RZ_K}/><path d="M330 40 a12 12 0 1 0 10 18 a9 9 0 1 1 -10 -18z" fill="#FFF1C2"/>${RZ_SPARK([[268, 44, 3], [286, 96, 3], [344, 100, 3], [318, 60, 2.5]])}</g>
            <g class="rom">${RZ_LIGHTS(4, 12)}</g>
            <rect y="170" width="400" height="70" fill="#A88F7A" ${RZ_K}/>
            <g ${RZ_K}><path d="M70 170 L96 82 M96 82 L130 100" fill="none"/><path d="M118 92 L148 110 L132 128 L104 110Z" fill="#9E9893"/><rect x="56" y="164" width="40" height="8" rx="2" fill="#9E9893"/></g>
            <g class="rom"><path d="M126 120 L80 170 H200 Z" fill="#FFD98A" opacity=".45"/><path d="M118 92 L148 110 L132 128 L104 110Z" fill="#C9A15A" ${RZ_K}/></g>
            <g ${RZ_K}><path d="M170 168 L186 120 H286 L270 168Z" fill="#B8B4B0"/><rect x="160" y="166" width="140" height="8" rx="3" fill="#9E9893"/></g>
            <g class="rom"><path d="M190 124 H280 L266 162 H176Z" fill="#F6C7D4"/></g>
            <g ${RZ_K}><path d="M318 140 h34 l-4 30 h-26z" fill="#E9E4DE"/><path d="M352 146 q12 2 0 14" fill="none"/></g>
            <g class="meh"><path d="M324 148 h26" stroke="#7A6458" stroke-width="3"/></g>
            <g class="rom"><path d="M326 132 q-6 -10 2 -18 q6 -8 0 -16 M340 132 q-6 -10 2 -18 q6 -8 0 -16" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".85"/></g>
            <g ${RZ_K}><rect x="20" y="150" width="34" height="20" fill="#B7AFA8"/><rect x="24" y="132" width="30" height="18" fill="#A39C95"/></g>
            <g class="rom"><rect x="20" y="150" width="34" height="20" fill="#8E3B4F" ${RZ_K}/><rect x="24" y="132" width="30" height="18" fill="#2F4A3A" ${RZ_K}/><path d="M370 170 v-24 M370 146 q-10 -6 -6 -16 q10 4 6 16 M370 154 q10 -6 14 -2 q-6 8 -14 2" fill="#F4A6BE" stroke="#3A2626" stroke-width="2"/></g>
        </svg>`
    },
    {
        plain: 'traffic. again.',
        rom: 'a sunset drive. windows down, playlist up, tail lights like fairy lights.',
        svg: `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
            <defs><linearGradient id="rzS3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E5A9B"/><stop offset=".45" stop-color="#F28CA6"/><stop offset=".8" stop-color="#FFC08A"/></linearGradient></defs>
            <rect width="400" height="240" fill="#C4C8CB"/>
            <g class="rom"><rect width="400" height="240" fill="url(#rzS3)"/><circle cx="200" cy="128" r="34" fill="#FFD9A0"/><circle cx="200" cy="128" r="60" fill="#FFD9A0" opacity=".25"/></g>
            <path d="M0 128 L60 110 L120 122 L190 104 L260 120 L330 108 L400 124 V140 H0Z" fill="#9EA3A6"/>
            <g class="rom"><path d="M0 128 L60 110 L120 122 L190 104 L260 120 L330 108 L400 124 V140 H0Z" fill="#6B4A6E"/></g>
            <path d="M0 140 H400 V240 H0Z" fill="#8E8E8E"/><path d="M196 140 L180 240 M204 140 L220 240" stroke="#D8D8D8" stroke-width="3" stroke-dasharray="14 12"/>
            ${[[90, 160, 1], [230, 150, .8], [300, 172, 1.1]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-30" y="-10" width="60" height="28" rx="6" fill="#A7A9AB" ${RZ_K}/><rect x="-24" y="-24" width="48" height="16" rx="5" fill="#B9BBBD" ${RZ_K}/><rect x="-26" y="0" width="10" height="6" rx="2" fill="#B5554E"/><rect x="16" y="0" width="10" height="6" rx="2" fill="#B5554E"/></g>`).join('')}
            <g class="rom">${[[90, 160, 1], [230, 150, .8], [300, 172, 1.1]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-21" cy="3" r="12" fill="#FF6B7A" opacity=".35"/><circle cx="21" cy="3" r="12" fill="#FF6B7A" opacity=".35"/><circle cx="-21" cy="3" r="4" fill="#FFE2E6"/><circle cx="21" cy="3" r="4" fill="#FFE2E6"/></g>`).join('')}
            <path class="fl" d="M330 60 v-22 l16 -4 v22 M330 60 a5 4 0 1 1 -1 -1 M346 56 a5 4 0 1 1 -1 -1 M60 70 v-18 l12 -3 v18 M60 70 a4 3 0 1 1 -1 -1 M72 67 a4 3 0 1 1 -1 -1" fill="none" stroke="#fff" stroke-width="2.5"/>${RZ_SPARK([[120, 40, 4], [280, 30, 5], [370, 90, 4], [30, 30, 4]])}</g>
            <path d="M-10 250 Q200 196 410 250Z" fill="#3A2E2E"/><path d="M120 240 a80 60 0 0 1 160 0" fill="none" stroke="#2A2222" stroke-width="16"/>
            <g class="meh"><text x="16" y="34" font-family="JetBrains Mono" font-size="13" fill="#5E6164">ETA +27 min</text></g>
        </svg>`
    },
    {
        plain: 'it’s raining and i’m in white shoes.',
        rom: 'rain on campus. this is the last scene of a rom-com.',
        svg: `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
            <defs><linearGradient id="rzS4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C7B6DE"/><stop offset="1" stop-color="#F7C9D6"/></linearGradient></defs>
            <rect width="400" height="240" fill="#A9AEB2"/>
            <g class="rom"><rect width="400" height="240" fill="url(#rzS4)"/></g>
            <g ${RZ_K}><rect x="20" y="96" width="110" height="100" fill="#B3ACA5"/><rect x="290" y="88" width="100" height="108" fill="#B3ACA5"/></g>
            <g class="rom">${[[36, 112], [70, 112], [104, 112], [36, 150], [70, 150], [104, 150], [306, 104], [342, 104], [306, 142], [342, 142]].map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="20" fill="#FFE3A3"/>`).join('')}</g>
            <rect y="196" width="400" height="44" fill="#8F969A"/>
            <g class="rom"><ellipse cx="200" cy="222" rx="90" ry="10" fill="#E8B9CF" opacity=".7"/><path d="M200 230 l-26 -4 h52z" fill="#F4A6BE" opacity=".5"/></g>
            <g ${RZ_K}><path d="M150 128 a50 34 0 0 1 100 0 q-12 -8 -25 0 q-12 -8 -25 0 q-12 -8 -25 0 q-12 -8 -25 0z" fill="#7C8287"/><path d="M200 128 v58 q0 10 -9 8" fill="none"/></g>
            <g class="rom"><path d="M150 128 a50 34 0 0 1 100 0 q-12 -8 -25 0 q-12 -8 -25 0 q-12 -8 -25 0 q-12 -8 -25 0z" fill="#F08FAE" ${RZ_K}/>${RZ_HEARTS([[170, 104, 4], [222, 100, 4], [196, 92, 3]])}</g>
            <g ${RZ_K}><rect x="186" y="186" width="28" height="12" rx="5" fill="#F4F2EE"/></g>
            <g class="meh"><path d="M188 194 q6 -4 10 0 q4 4 10 -1" fill="none" stroke="#6E5A48" stroke-width="2"/></g>
            ${Array.from({ length: 34 }, (_, i) => { const x = (i * 53) % 400, y = (i * 37) % 200; return `<path d="M${x} ${y} l-6 14" stroke="#E8ECEF" stroke-width="2" stroke-linecap="round" class="meh"/>`; }).join('')}
            <g class="rom">${RZ_SPARK(Array.from({ length: 16 }, (_, i) => [(i * 53) % 400, (i * 37) % 190 + 6, 3.5]))}</g>
        </svg>`
    }
];

// every app on my phone and ipad answers one question about me
const APP_Q = {
    photos: 'what does she photograph?', instagram: 'how does she show up?', linkedin: 'what does she do professionally?', spotify: 'what does she listen to?',
    youtube: 'what does she watch to grow?', netflix: 'what does she watch?', prime: 'what does she watch?', calendar: 'what does her life look like?',
    duolingo: 'what is she learning?', contacts: 'do you want to know her?', notes: 'what is she thinking about?',
    maps: 'where does she go?', messages: 'who matters to her?', gmail: 'what’s waiting on her?', camera: 'what catches her eye?',
    clock: 'where is she headed next?', wallet: 'what does she carry?', findmy: 'where’s all her stuff?', settings: 'how is she wired?',
    pinterest: 'what does she want her world to look like?', procreate: 'what does she make?', safari: 'what is she curious about?',
    chatgpt: 'what rabbit hole is she in right now?', github: 'what is she building?', canvas: 'what is she studying?'
};
const addQ = (view, k) => {
    if (!APP_Q[k] || view.querySelector('.appq')) return;
    const p = document.createElement('p'); p.className = 'appq hand'; p.textContent = APP_Q[k];
    const b = view.querySelector('.back'); b ? b.after(p) : view.prepend(p);
};
const GH = 'https://suhxnitiwari.github.io/';
const POCKET_NAME = { devices: 'the if-i-lost-it-i’d-cry pocket', main: 'the big pocket', shades: 'the sunglasses pocket', front: 'the front pocket', side: 'the side pocket', makeup: 'the makeup bag', attached: 'tucked into something else' };
const grab = id => { const it = ITEMS.find(i => i.id === id); if (it) goTo(it); };

const MORE_APPS = {
    maps: {
        html: () => {
            const pins = [
                ['mccombs', 'McCombs', 30, 34, '#BF5700', 'where i study MIS and psychology. hook ’em 🤘'],
                ['medici', 'Medici', 52, 46, '#7A4B2E', 'vanilla latte. every day. ten stamps, one free.'],
                ['home', 'Home', 74, 30, '#2E6FB7', 'nice try. that one stays private 🏠'],
                ['curb', 'the curb', 64, 68, '#D93025', 'it came out of nowhere. i will not be taking questions.'],
                ['sat', 'Saturdays', 22, 70, '#1E8E3E', 'i built an app that plans the best day around austin.', GH + 'saturday-in-austin/'],
                ['next', '???', 86, 78, '#8E24AA', 'wherever the boarding pass says. (it says “???”.)']
            ];
            return `<div class="mp">
                <div class="mp-search">🔍 <span>Search Maps</span></div>
                <div class="mp-map"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="#EEF0E8"/><path d="M-5 58 C20 50 35 62 55 56 S85 48 105 54 V62 C85 56 70 66 55 64 S20 58 -5 66Z" fill="#AFD3EE"/><rect x="14" y="20" width="26" height="24" rx="2" fill="#D9EBC9"/><rect x="66" y="74" width="20" height="18" rx="2" fill="#D9EBC9"/><path d="M0 40 H100 M0 82 H100 M42 0 V100 M78 0 V100 M8 0 L30 100" stroke="#fff" stroke-width="3"/><path d="M0 40 H100 M42 0 V100" stroke="#F6D785" stroke-width="1.6"/></svg>
                    ${pins.map(([k, n, x, y, c]) => `<button type="button" class="mp-pin" data-pin="${k}" style="left:${x}%;top:${y}%;--c:${c}"><i></i><span>${n}</span></button>`).join('')}
                </div>
                <div class="mp-card" id="mp-card"><b>tap a pin</b><span>these are the places i actually go.</span></div>
            </div>`;
        },
        after: v => {
            const pins = { mccombs: ['McCombs School of Business', 'where i study MIS and psychology. hook ’em 🤘'], medici: ['Medici Roasting', 'vanilla latte. every day. ten stamps, one free.'], home: ['Home', 'nice try. that one stays private 🏠'], curb: ['the curb', 'it came out of nowhere. i will not be taking questions.'], sat: ['Saturdays', 'i built an app that plans the best day around austin.', GH + 'saturday-in-austin/'], next: ['???', 'wherever the boarding pass says. (it says “???”.)'] };
            v.querySelectorAll('.mp-pin').forEach(p => p.onclick = () => {
                const [t, d, href] = pins[p.dataset.pin];
                v.querySelectorAll('.mp-pin').forEach(x => x.classList.toggle('on', x === p));
                $('#mp-card').innerHTML = `<b>${t}</b><span>${d}</span>${href ? `<a href="${href}" target="_blank" rel="noopener">Directions ↗</a>` : ''}`;
            });
        }
    },
    messages: {
        html: () => `<div class="msg">
            <p class="msg-h">Messages</p>
            <button type="button" class="msg-row" data-who="amaira"><span class="msg-av" style="background:#F4A6BE">A</span><span><b>Amaira ♡</b><small class="blur">sister stuff sister stuff sister stuff</small></span></button>
            <button type="button" class="msg-row" data-who="mom"><span class="msg-av" style="background:#B9A3E8">M</span><span><b>Mom</b><small class="blur">mom stuff mom stuff mom stuff mom</small></span></button>
            <button type="button" class="msg-row" data-who="you"><span class="msg-av" style="background:#34C759">+</span><span><b>you?</b><small>new message</small></span></button>
            <div class="msg-open" id="msg-open" hidden></div>
            <a class="msg-world" href="${GH}suhani-world/" target="_blank" rel="noopener">the people and places that made me ↗</a>
        </div>`,
        after: v => v.querySelectorAll('.msg-row').forEach(r => r.onclick = () => {
            const o = $('#msg-open'), w = r.dataset.who;
            if (w === 'you') { $('#back').click(); sheetBody.querySelector('[data-app="contacts"]').click(); return; }
            o.hidden = false;
            o.innerHTML = w === 'amaira'
                ? `<p>this chat is just for us ♡</p><button type="button" class="msg-btn" data-go="cards">see the cards she made me →</button>`
                : `<p>this chat is just for us ♡</p>`;
            o.querySelector('[data-go]') && (o.querySelector('[data-go]').onclick = () => grab('cards'));
        })
    },
    gmail: {
        html: () => `<div class="gm">
            <div class="gm-search">☰ <span>Search in mail</span></div>
            ${[['Primary', '99+', '#1A73E8'], ['UT Austin', '99+', '#BF5700'], ['Promotions', '99+', '#1E8E3E', 'sephora, aritzia, chanel. the gift card brands, back for more.'], ['Applications', '✦', '#8E24AA']].map(([n, c, col, sub]) => `<div class="gm-row"><span class="gm-dot" style="background:${col}"></span><span><b>${n}</b>${sub ? `<small>${sub}</small>` : ''}</span><em>${c}</em></div>`).join('')}
            <button type="button" class="gm-btn" id="gm-read">Mark all as read</button>
            <a class="gm-compose" href="mailto:suhanitiwari@utexas.edu?subject=${encodeURIComponent('hi from your bag ♡')}">✎ Compose</a>
        </div>`,
        after: () => { $('#gm-read').onclick = () => toast('no.'); }
    },
    camera: {
        html: () => `<div class="cam"><div class="cam-vf"><img id="cam-img" src="assets/img/cafe.jpg" alt=""><span class="cam-grid"></span><span class="cam-flash" id="cam-flash"></span></div>
            <p class="cam-modes mono"><span>VIDEO</span><b>PHOTO</b><span>PORTRAIT</span></p>
            <div class="cam-bar"><img class="cam-thumb" id="cam-thumb" src="assets/img/me.jpg" alt=""><button type="button" class="cam-shutter" id="cam-shutter" aria-label="Take a photo"></button><span></span></div></div>`,
        after: () => {
            const shots = ['cafe', 'chicago', 'book', 'nyc', 'owala', 'saturday', 'gwc', 'listening'];
            let i = 0;
            $('#cam-shutter').onclick = () => {
                const f = $('#cam-flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
                $('#cam-thumb').src = $('#cam-img').src;
                i = (i + 1) % shots.length; $('#cam-img').src = `assets/img/${shots[i]}.jpg`;
                toast(['another one for the camera roll.', 'this one’s going on the story.', 'okay one more.', 'perfect. (taking five more.)'][i % 4]);
            };
        }
    },
    clock: {
        html: () => `<div class="clk">
            <p class="clk-h">World Clock</p>
            <div class="clk-row"><span><small>Today</small><b>Austin</b></span><em id="clk-atx"></em></div>
            <div class="clk-row"><span><small>wherever the boarding pass says</small><b>???</b></span><em>--:--</em></div>
            <p class="clk-h">Alarms</p>
            <div class="clk-row"><span><b class="todo">what time do you actually wake up?</b></span></div>
        </div>`,
        after: () => { const t = () => { const e = $('#clk-atx'); if (e) { e.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' }); setTimeout(t, 15000); } }; t(); }
    },
    wallet: {
        html: () => `<div class="wl">
            <p class="wl-h">Wallet</p>
            <button type="button" class="wl-pass" data-go="passport" style="--c:#1F3B73"><b>Boarding Pass</b><span>AUS → ???</span></button>
            <button type="button" class="wl-pass" data-go="wallet" style="--c:#6B4026"><b>Medici</b><span>10 stamps = 1 free vanilla latte</span></button>
            <button type="button" class="wl-pass" data-go="giftcards" style="--c:#C0577A"><b>Gift Cards</b><span>aritzia · chanel · sephora · balance: a mystery</span></button>
            <p class="wl-fine">no real card numbers live here. nice try ♡</p>
        </div>`,
        after: v => v.querySelectorAll('[data-go]').forEach(b => b.onclick = () => grab(b.dataset.go))
    },
    findmy: {
        html: () => `<div class="fm">
            <p class="fm-h">Items</p>
            ${['keys', 'headphones', 'ipad', 'stanley', 'passport', 'mirror', 'bear'].map(id => ITEMS.find(i => i.id === id)).filter(Boolean).map(it => `<div class="fm-row"><span class="fm-art">${it.art}</span><span><b>${it.name.replace(/^my /, '')}</b><small>${POCKET_NAME[it.zip] || 'somewhere in the bag'}</small></span><button type="button" data-find="${it.id}">Find</button></div>`).join('')}
        </div>`,
        after: v => v.querySelectorAll('[data-find]').forEach(b => b.onclick = () => {
            if (b.dataset.find === 'keys') toast('*jingle jingle* found them. they were in the sunglasses pocket. again.');
            setTimeout(() => grab(b.dataset.find), b.dataset.find === 'keys' ? 900 : 0);
        })
    },
    settings: {
        html: () => {
            const rows = [
                ['shades', 'Romanticize everything', document.body.classList.contains('shades'), ''],
                ['glogg', 'Backup lipstick (Glögg)', true, 'non-negotiable.'],
                ['latte', 'Vanilla latte, daily', true, 'medici already knows.'],
                ['mirror', 'Self-reflection', true, 'always on. there’s a mirror in the sunglasses pocket for a reason.'],
                ['todo', 'To-do list reminders', false, 'it’s overdue anyway.'],
                ['curb', 'Curb detection', false, 'it came out of nowhere.']
            ];
            return `<div class="st"><p class="st-h">Settings</p>
                <div class="st-me"><img src="assets/img/me.jpg" alt=""><span><b>Suhani Tiwari</b><small>Pisces sun · Gemini moon · Taurus rising</small></span></div>
                ${rows.map(([k, n, on, say]) => `<label class="st-row"><span>${n}</span><input type="checkbox" data-st="${k}" data-say="${say}" ${on ? 'checked' : ''}><i></i></label>`).join('')}
            </div>`;
        },
        after: v => v.querySelectorAll('[data-st]').forEach(c => c.onchange = () => {
            const k = c.dataset.st;
            if (k === 'shades') { document.body.classList.toggle('shades', c.checked); toast(c.checked ? 'see? it was always this pretty.' : 'ew. reality.'); return; }
            if (k === 'glogg' || k === 'latte' || k === 'mirror') c.checked = true;
            toast(c.dataset.say);
        })
    },
    safari: {
        html: () => {
            const tabs = [
                ['what’s my color season?', GH + 'hue-are-you/', '#E8B4C8'],
                ['is this ingredient actually clean?', 'https://github.com/suhxnitiwari/label-tea', '#F3D6A4'],
                ['what do i need on the final?', GH + 'survival-odds/', '#BFD7EA'],
                ['what does my birth chart mean?', GH + 'astrology-results/', '#CBB8E8'],
                ['best saturday in austin?', GH + 'saturday-in-austin/', '#BFE3C6'],
                ['what did i listen to for four years?', 'https://listening-history.onrender.com', '#A8E6B8'],
                ['can a period app actually be private?', GH + 'cadence-period-tracker/', '#F6C1C1'],
                ['vogue: in the bag', 'https://www.vogue.com/video/series/in-the-bag', '#E6E2DC']
            ];
            return `<div class="sf"><p class="sf-h"><b>37 Tabs</b><button type="button" id="sf-close">Close All</button></p>
                <div class="sf-grid">${tabs.map(([t, u, c]) => `<a class="sf-tab" href="${u}" target="_blank" rel="noopener"><span class="sf-prev" style="background:${c}"></span><b>${t}</b><small>${u.replace(/^https:\/\//, '').replace(/\/$/, '')}</small></a>`).join('')}</div>
                <p class="sf-fine">+29 more. every question turns into a tab. some turn into whole websites.</p></div>`;
        },
        after: () => { $('#sf-close').onclick = () => toast('close all 37 tabs? absolutely not.'); }
    },
    chatgpt: {
        html: () => `<div class="gpt"><div class="gpt-log" id="gpt-log"><p class="gpt-hi">What’s on your mind today?</p></div>
            <div class="gpt-chips">${['what does my birth chart say about me?', 'is the curb legally at fault?', 'how many lipsticks is too many?', 'romanticize my monday'].map(q => `<button type="button" data-q="${q}">${q}</button>`).join('')}</div>
            <form class="gpt-in" id="gpt-in"><input placeholder="Ask anything" aria-label="Ask anything"><button aria-label="Send">↑</button></form></div>`,
        after: () => {
            const A = {
                'what does my birth chart say about me?': `pisces sun, gemini moon, taurus rising. you’ve asked me this 47 times. you built <a href="${GH}suhani-celestial/" target="_blank" rel="noopener">two</a> <a href="${GH}astrology-results/" target="_blank" rel="noopener">websites</a> about it.`,
                'is the curb legally at fault?': 'legally? no. emotionally? absolutely.',
                'how many lipsticks is too many?': 'you have a backup for your backup. you’re fine.',
                'romanticize my monday': 'soft light, a warm vanilla latte, a playlist that knows you. you’re the main character. go.'
            };
            const log = $('#gpt-log');
            const ask = q => {
                log.insertAdjacentHTML('beforeend', `<p class="gpt-me">${q.replace(/</g, '&lt;')}</p><p class="gpt-ai">${A[q] || 'she’s 47 questions deep into her birth chart right now. try again later ♡'}</p>`);
                log.scrollTop = log.scrollHeight;
            };
            sheetBody.querySelectorAll('[data-q]').forEach(b => b.onclick = () => ask(b.dataset.q));
            $('#gpt-in').onsubmit = e => { e.preventDefault(); const i = e.target.querySelector('input'); if (i.value.trim()) ask(i.value.trim()); i.value = ''; };
        }
    },
    github: {
        html: () => `<div class="gh"><div class="gh-me"><img src="assets/img/me.jpg" alt=""><span><b>suhxnitiwari</b><small>building things where technology meets people</small></span><a href="https://github.com/suhxnitiwari" target="_blank" rel="noopener">Profile ↗</a></div>
            <div class="gh-list" id="gh-list"><p class="gh-wait mono">loading what i’m building…</p></div></div>`,
        after: () => {
            fetch('https://api.github.com/users/suhxnitiwari/repos?sort=pushed&per_page=12').then(r => r.ok ? r.json() : Promise.reject()).then(rs => {
                const el = $('#gh-list'); if (!el) return;
                el.innerHTML = rs.filter(r => !r.fork && r.description).map(r => `<a class="gh-repo" href="${r.homepage || r.html_url}" target="_blank" rel="noopener"><b>${r.name}</b><span>${r.description.replace(/</g, '&lt;')}</span><small>${r.language ? `● ${r.language} · ` : ''}updated ${new Date(r.pushed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></a>`).join('');
            }).catch(() => { const el = $('#gh-list'); if (el) el.innerHTML = '<a class="gh-repo" href="https://github.com/suhxnitiwari" target="_blank" rel="noopener"><b>see everything on github ↗</b></a>'; });
        }
    },
    canvas: {
        html: () => `<div class="cv"><p class="cv-h">Dashboard</p>
            <div class="cv-cards"><div class="cv-card" style="--c:#BF5700"><span></span><b>MIS</b><small>McCombs School of Business</small></div><div class="cv-card" style="--c:#6E4BA8"><span></span><b>Psychology</b><small>why people choose what they choose</small></div></div>
            <div class="cv-btns"><button type="button" id="cv-grades">Grades</button><button type="button" id="cv-todo">To Do</button></div>
            <a class="cv-link" href="${GH}survival-odds/" target="_blank" rel="noopener">i built an app to survive the semester ↗</a></div>`,
        after: () => { $('#cv-grades').onclick = () => toast('nice try. those stay in the bag.'); $('#cv-todo').onclick = () => grab('todo'); }
    }
};
const openMoreApp = (k, view, home, back, backSel) => {
    const app = MORE_APPS[k]; if (!app) return false;
    view.classList.remove('procreate');
    view.innerHTML = back + app.html();
    addQ(view, k);
    home.hidden = true; view.hidden = false;
    $(backSel).onclick = () => { view.hidden = true; home.hidden = false; };
    app.after && app.after(view);
    return true;
};

// my laptop desktop, folder by folder. files open on top of the laptop, so "back" lands in the same window
const PHOTOS = ['cafe', 'me', 'book', 'gwc', 'chicago', 'nyc', 'owala', 'listening', 'saturday'];
const FOLDERS = [
    ['Job Applications', [
        ['Résumé.pdf', 'view', 'padfolio', '#E8453C'],
        ['roles i’m going for.txt', 'note', 'product marketing manager\nproduct manager\nbrand strategist\ntechnology consultant\nmanagement consultant\nUI/UX designer\n\n→ work where technology meets people\n\ndream companies:\nnetflix ☆ spotify ☆ duolingo', '#8E8E93'],
        ['Acacia Advisors', 'view', 'acacia', '#2E6FB7'],
        ['LinkedIn', 'link', 'https://www.linkedin.com/in/suhxnitiwari/', '#0A66C2']
    ]],
    ['Personal Projects', [
        ['Listening History', 'web', 'https://listening-history.onrender.com/', 'img:listening'],
        ['Saturday in Austin', 'view', 'saturday', 'img:saturday'],
        ['Girls Can Be Engineers, Too!', 'view', 'book', 'img:book'],
        ['Hue Are You', 'web', GH + 'hue-are-you/', '#E8B4C8'],
        ['Survival Odds', 'web', GH + 'survival-odds/', '#BFD7EA'],
        ['Cadence', 'web', GH + 'cadence-period-tracker/', '#F6C1C1'],
        ['Charted', 'web', GH + 'astrology-results/', '#CBB8E8'],
        ['Suhani Celestial', 'web', GH + 'suhani-celestial/', '#B9A3E8'],
        ['Suhani World', 'web', GH + 'suhani-world/', '#BFE3C6'],
        ['Label Tea', 'link', 'https://github.com/suhxnitiwari/label-tea', '#F3D6A4'],
        ['What’s in my bag', 'self', '', '#F2C6C8'],
        ['suhanitiwari.com', 'link', 'https://suhanitiwari.com', '#76344E']
    ]],
    ['Photographs', PHOTOS.map(f => [f + '.jpg', 'photo', f, 'img:' + f])],
    ['MIS', [
        ['RideFlow', 'link', 'https://suhanitiwari.com/home/work#mp-rideflow', '#1A73E8'],
        ['Bevo Taco Checkout', 'link', 'https://github.com/suhxnitiwari/Bevo_Taco-Checkout', '#BF5700'],
        ['My portfolio (ASP.NET)', 'link', 'https://github.com/suhxnitiwari/suhanitiwari-portfolio', '#76344E']
    ]],
    ['MKT', [
        ['Owala Marathon Series', 'view', 'owala', 'img:owala'],
        ['FuelFlow', 'view', 'fuelflow', 'img:fuelflow']
    ]],
    ['PSY', []],
    ['EDP', []]
];
const fileIcon = (n, ic) => ic.startsWith('img:')
    ? `<img src="assets/img/${ic.slice(4)}.jpg" alt="">`
    : `<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M4 2 h22 l10 10 v34 h-32z" fill="#fff" stroke="#C9C6C2" stroke-width="1.5"/><path d="M26 2 v10 h10" fill="#EEE" stroke="#C9C6C2" stroke-width="1.5"/><rect x="4" y="30" width="32" height="10" fill="${ic}"/><text x="20" y="38" text-anchor="middle" font-size="7" font-family="system-ui" font-weight="700" fill="#fff">${(n.match(/\.(\w+)$/) || [, 'APP'])[1].toUpperCase()}</text></svg>`;

// my skincare: what each one is, what it does when you tap it, its short label
const SKIN = window.SKIN;
const SKIN_INFO = {
    dropper: ['Westman Atelier Eye Activator Serum', 'one drop under each eye. the dropper comes up pink.', 'eye activator'],
    pinkpump: ['Westman Atelier Skin Activator Serum', 'one pump. twelve actives, all over my face.', 'skin activator'],
    goldpump: ['Westman Atelier Suprême C Serum', 'one pump. vitamin c, gel-oil.', 'suprême c'],
    patches: ['under-eye gel patches', 'under my eyes. cool, squishy, instant “i slept” energy.', 'eye patches'],
    lamer: ['La Mer The Eye Concentrate', 'lid off, a tap with the little wand.', 'la mer'],
    sisley: ['Sisley Supremÿa La Nuit', 'the gold lid comes off. night cream.', 'sisley'],
    lash: ['Grande Cosmetics GrandeLASH-MD Lash Enhancing Serum', 'one swipe along my lash line.', 'grandelash'],
    laneige: ['Laneige Lip Sleeping Mask', 'lip moisturizer. glossy and a little browny pink.', 'laneige'],
    mask: ['Olivia von Halle Audrey Aspen Eye Mask', 'lights out.', 'eye mask']
};
// my night routine, in order. patches go on clean, dry skin first and come off before the rest
const ROUTINE = ['patches', 'pinkpump', 'dropper', 'lash', 'goldpump', 'laneige', 'lamer', 'sisley', 'mask'];
// what each one does when it lands on me
const SKIN_FX = {
    dropper: [null, 'eye activator on. a drop under each eye, patted in.'], pinkpump: [null, 'skin activator serum on. patted in.'], goldpump: [null, 'suprême c on. vitamin c, patted in.'],
    lamer: [null, 'la mer under both eyes, with the little spoon. as it should be.'], sisley: [null, 'sisley on. night cream, all over.'],
    lash: ['lashes', 'grandelash on. lashes, but more.'],
    laneige: ['lips', 'laneige on. glossy, browny pink lips ♡'], patches: ['patches', 'under-eye patches on. cool and squishy. tap them on my face to peel them off.'],
    mask: [null, 'eye mask on. goodnight ✨']
};
// amaira's cards, redrawn: her words, her spelling, her colors
const KM = 'font-family="Kalam, Caveat, cursive"';
const letters = (str, x, y, size, colors, gap) => [...str].map((ch, k) => `<text x="${x + k * gap}" y="${y}" ${KM} font-weight="700" font-size="${size}" fill="${colors[k % colors.length]}">${ch}</text>`).join('');
const stick = (x, y, s, extra = '') => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#6E6A68" stroke-width="1.6" stroke-linecap="round"><path d="M-12 -40 q-4 30 -2 52 M12 -40 q4 30 2 52"/><circle cx="0" cy="-30" r="12" fill="#fff"/><circle cx="-4" cy="-32" r="2.6"/><circle cx="4" cy="-32" r="2.6"/><path d="M-4 -24 q4 3 8 0"/><path d="M-8 -16 h16 v30 h-16z" fill="#fff"/><path d="M-4 14 v30 M4 14 v30 M-8 44 h6 M2 44 h6"/>${extra}</g>`;
const DIGI_CARDS = {
    welcome: `<svg viewBox="0 0 420 300" role="img" aria-label="Welcome back Didi card: a cup that says I love you, and the two of us">
        <rect x="4" y="4" width="412" height="292" rx="4" fill="#FFFFFF" stroke="#D8D2CA" stroke-width="2"/><path d="M210 6 V294" stroke="#E6E0D8" stroke-width="2"/>
        ${letters('Welcome', 20, 62, 40, ['#A24FB8', '#7C6BD6', '#4FA0D8', '#D96AA8'], 27)}
        ${letters('Back', 22, 118, 46, ['#F2A3BE', '#56B8C8'], 30)}
        ${letters('DIDI!!!', 26, 168, 34, ['#8E3FAE', '#5C7CD6', '#F28DB4', '#56B8C8', '#3A2626', '#3A2626', '#3A2626'], 22)}
        <g transform="translate(52 196) rotate(-14)"><path d="M0 0 h78 l-10 92 h-58z" fill="#F57E86" stroke="#3A2626" stroke-width="2.2"/><rect x="-6" y="-14" width="90" height="16" rx="5" fill="#fff" stroke="#3A2626" stroke-width="2.2"/><path d="M6 -12 v12 M18 -12 v12 M30 -12 v12 M42 -12 v12 M54 -12 v12 M66 -12 v12" stroke="#F57E86" stroke-width="2"/>
            <text x="12" y="30" ${KM} font-size="18" font-weight="700" fill="#3A2626">I</text><path d="M30 22 c-6 -8 4 -14 8 -6 c4 -8 14 -2 8 6 l-8 8z" fill="#8E1E2E"/><text x="54" y="30" ${KM} font-size="18" font-weight="700" fill="#3A2626">U</text>
            <rect x="6" y="38" width="66" height="22" fill="#fff"/><path d="M10 44 h56 M10 50 h50 M10 56 h44" stroke="#3A2626" stroke-width="1.2"/><text x="24" y="84" ${KM} font-size="16" font-weight="700" fill="#3A2626">Didi</text></g>
        <text x="238" y="58" ${KM} font-size="38" font-weight="700" fill="#F2A3BE">I</text><path d="M268 40 c-12 -16 8 -28 16 -12 c8 -16 28 -4 16 12 l-16 18z" fill="#F28DA4"/><text x="318" y="58" ${KM} font-size="38" font-weight="700" fill="#F2A3BE">U</text>
        ${stick(286, 194, 1.25, '<rect x="-24" y="2" width="12" height="14" fill="#fff"/><text x="-23" y="13" font-size="4" font-family="Kalam">lulu</text><rect x="14" y="0" width="14" height="16" fill="#fff"/><text x="14.5" y="10" font-size="4" font-family="Kalam">Aritzia</text>')}
        ${stick(366, 230, .9, '<path d="M-18 -4 h6 l-1 8 h-4z" fill="#fff"/><path d="M-10 14 l-6 24 h28 l-6 -24" fill="#fff"/>')}
        <ellipse cx="334" cy="112" rx="26" ry="13" fill="#fff" stroke="#6E6A68" stroke-width="1.4"/><text x="334" y="116" text-anchor="middle" ${KM} font-size="10" fill="#6E6A68">obviously</text>
        <ellipse cx="380" cy="160" rx="26" ry="18" fill="#fff" stroke="#6E6A68" stroke-width="1.4"/><text x="380" y="157" text-anchor="middle" ${KM} font-size="8" fill="#6E6A68">I’ll hold</text><text x="380" y="167" text-anchor="middle" ${KM} font-size="8" fill="#6E6A68">ur coffee</text></svg>`,
    ut: `<svg viewBox="0 0 300 420" role="img" aria-label="Amaira wants to go to UT Austin and be a business woman">
        <path d="M150 10 C60 10 14 70 14 150 C14 210 60 252 90 300 H210 C240 252 286 210 286 150 C286 70 240 10 150 10Z" fill="#FFFFFF" stroke="#3A2626" stroke-width="2.4"/>
        <clipPath id="kc-bal"><path d="M150 10 C60 10 14 70 14 150 C14 210 60 252 90 300 H210 C240 252 286 210 286 150 C286 70 240 10 150 10Z"/></clipPath>
        <g clip-path="url(#kc-bal)"><rect x="0" y="134" width="300" height="170" fill="#9CC6E4" opacity=".7"/>${Array.from({ length: 22 }, (_, k) => `<path d="M0 ${140 + k * 7} q75 -4 150 0 t150 0" stroke="#7FB2DA" stroke-width="1" fill="none" opacity=".6"/>`).join('')}
            <rect x="0" y="82" width="300" height="5" fill="#F2B6C9"/></g>
        <text x="64" y="64" ${KM} font-size="26" fill="#E8A65A">UT Austin</text><path d="M232 44 c-16 -20 10 -34 20 -14 c10 -20 36 -6 20 14 l-20 22z" fill="#F0A64E" opacity=".85"/>
        <path d="M14 92 H286 M14 132 H286" stroke="#3A2626" stroke-width="1.6"/><text x="70" y="124" ${KM} font-size="34" fill="#2E2A2C">Amaira</text><path d="M126 96 c-3 -4 2 -7 4 -3 c2 -4 7 -1 4 3 l-4 4z" fill="#2E2A2C"/>
        <g transform="translate(150 196)"><path d="M-14 -26 q-14 14 -10 40 M14 -26 q14 14 10 40" stroke="#B9967A" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="0" cy="-22" r="12" fill="#F4E4D8" stroke="#3A2626" stroke-width="1.4"/><path d="M-5 -16 q5 6 10 0" fill="#C0272D"/>
            <rect x="-10" y="-8" width="20" height="24" fill="#DDEFD8" stroke="#3A2626" stroke-width="1.2"/><path d="M-14 16 h28 l6 18 h-40z" fill="#2E2A2C"/><path d="M-6 20 l4 6 M4 22 l4 8" stroke="#6FAE7A" stroke-width="3"/><path d="M-6 34 v18 M6 34 v18" stroke="#3A2626" stroke-width="2"/><ellipse cx="-7" cy="54" rx="5" ry="3" fill="#6FAE7A"/><ellipse cx="7" cy="54" rx="5" ry="3" fill="#6FAE7A"/></g>
        <path d="M84 300 h132 l-8 112 h-116z" fill="#E9D7C8" stroke="#3A2626" stroke-width="2"/>${[318, 346, 374, 400].map(y => `<path d="M94 ${y + 4} h112" stroke="#2E2A2C" stroke-width="1"/>`).join('')}
        <text x="150" y="316" text-anchor="middle" ${KM} font-size="14" fill="#2E2A2C">bussiness women</text>
        <text x="150" y="344" text-anchor="middle" ${KM} font-size="13" fill="#2E2A2C">I want to go</text><text x="150" y="372" text-anchor="middle" ${KM} font-size="13" fill="#2E2A2C">to UT Austin and</text>
        <text x="150" y="398" text-anchor="middle" ${KM} font-size="12" fill="#2E2A2C">I want to be a bussiness women</text></svg>`,
    sisters: `<svg viewBox="0 0 420 380" role="img" aria-label="Amaira and Suhani forever, two sisters in pink dresses">
        <rect x="4" y="4" width="412" height="372" rx="4" fill="#FFFFFF" stroke="#D8D2CA" stroke-width="2"/>
        <text x="40" y="70" ${KM} font-weight="700" font-size="40" fill="#5A2C7E" letter-spacing="3">AMAIRA</text><text x="300" y="92" ${KM} font-weight="700" font-size="40" fill="#5A2C7E">Suhani</text>
        <path d="M236 30 c-30 30 -16 70 -6 82 c20 -14 40 -46 30 -80z" fill="#E8A3B4" stroke="#7A2350" stroke-width="3"/><path d="M296 30 c-14 -22 18 -34 26 -12 c10 -22 42 -8 26 14 l-26 30z" fill="#1F2E8F"/><path d="M176 90 c-6 -10 6 -16 10 -6 c4 -10 16 -4 10 6 l-10 12z" fill="#3B3F9E"/>
        <path d="M14 152 C60 140 80 110 110 124 C140 140 160 108 200 112 C240 116 260 140 300 128 C340 116 380 150 406 140" fill="none" stroke="#A8784E" stroke-width="2"/>
        <path d="M30 184 c-10 -14 6 -22 12 -10 c6 -12 22 -4 12 10 l-12 14z" fill="#B9DDF0" stroke="#5A2C7E" stroke-width="2"/><text x="14" y="232" ${KM} font-size="15" fill="#7A2350">forever</text>
        ${[[150, 150], [290, 140]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-22 6 q-8 40 -4 74 M22 6 q8 40 4 74" stroke="#9A6B44" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="24" rx="16" ry="22" fill="#E9C9A6" stroke="#9A6B44" stroke-width="2"/><circle cx="-6" cy="22" r="2.4" fill="#3A2626"/><circle cx="6" cy="22" r="2.4" fill="#3A2626"/><path d="M-4 34 q4 3 8 0" stroke="#C0272D" stroke-width="1.6" fill="none"/>
            <path d="M-8 50 L-70 222 H70 L8 50Z" fill="#F7C7D3" stroke="#E79AB0" stroke-width="2"/>${Array.from({ length: 10 }, (_, k) => `<path d="M${-60 + k * 13} 214 l${18 - k * 2} -150" stroke="#F2AFC2" stroke-width="1" opacity=".7"/>`).join('')}</g>`).join('')}
        <path d="M212 268 c-6 -10 6 -16 10 -6 c4 -10 16 -4 10 6 l-10 12z" fill="#7A2350"/>
        <g fill="none" stroke="#F2AFC2" stroke-width="2">${[[140, 108], [380, 220]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8"/><circle cx="${x + 12}" cy="${y}" r="8"/><circle cx="${x + 6}" cy="${y - 10}" r="8"/><circle cx="${x + 6}" cy="${y + 10}" r="8"/>`).join('')}</g>
        <text x="50" y="300" ${KM} font-size="40" fill="#56B8A8">A</text><text x="364" y="330" ${KM} font-size="40" fill="#56B8A8">S</text></svg>`,
    sparkle: `<svg viewBox="0 0 440 320" role="img" aria-label="Dear Suhini, you are best sister ever and make eyes sparkle">
        <g transform="rotate(-6 110 160)"><rect x="10" y="20" width="200" height="290" rx="4" fill="#F4E8C8" stroke="#D8C8A0" stroke-width="2"/>
            ${[[40, 80, '#F2A3BE'], [150, 60, '#F6C64E'], [80, 200, '#E58FA4'], [170, 240, '#F2A3BE'], [30, 290, '#F6C64E'], [140, 150, '#7FC4B8']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="22" fill="${c}" opacity=".7"/><circle cx="${x}" cy="${y}" r="10" fill="#fff" opacity=".5"/>`).join('')}
            <rect x="26" y="40" width="160" height="250" rx="3" fill="#F28DB4"/>
            ${[[50, 70, '#5BC0A0'], [140, 90, '#5A2C7E'], [90, 230, '#2E5AAE'], [160, 200, '#E8C34E'], [56, 150, '#6E6A68']].map(([x, y, c]) => `<path d="M${x} ${y - 8} l2.4 5.6 6 .6 -4.6 4 1.4 6 -5.2 -3.2 -5.2 3.2 1.4 -6 -4.6 -4 6 -.6z" fill="${c}"/>`).join('')}
            <path d="M70 130 c-28 -30 10 -54 36 -26 c26 -28 64 -4 36 26 l-36 40z" fill="none" stroke="#C0272D" stroke-width="3"/><text x="106" y="128" text-anchor="middle" ${KM} font-size="13" fill="#7A2350">Suhani &amp;</text><text x="106" y="144" text-anchor="middle" ${KM} font-size="13" fill="#7A2350">Amaira ♡</text>
            <path d="M84 250 c-10 -12 6 -20 12 -8 c6 -12 22 -4 12 8 l-12 14z" fill="#3B3F9E"/></g>
        <rect x="216" y="12" width="214" height="298" rx="3" fill="#F7F9F6" stroke="#D8D2CA" stroke-width="2"/>
        <g ${KM} fill="#8A8A8A"><text x="232" y="48" font-size="22">Dear Suhini</text><text x="232" y="92" font-size="36">You are</text><text x="236" y="136" font-size="32">best sister</text><text x="238" y="176" font-size="32">ever. and</text><text x="246" y="216" font-size="32">make</text><text x="244" y="256" font-size="32">“eyes</text><text x="244" y="296" font-size="32">Sparkle”</text></g></svg>`
};

// you deserve each other opens into every rom-com i’ll never shut up about. one book per chapter
const ROMCOMS = [["the-hating-game","The Hating Game","Sally Thorne","Lucy and Joshua are executive assistants who share an office and can’t stand each other. Then they both go for the same promotion, and the games get complicated."],["the-unhoneymooners","The Unhoneymooners","Christina Lauren","Everyone at her twin sister’s wedding gets food poisoning except Olive and the groom’s grumpy brother Ethan. So they take the free Maui honeymoon, pretending to be newlyweds."],["people-we-meet-on-vacation","People We Meet on Vacation","Emily Henry","Best friends Poppy and Alex took a trip together every summer, until two years ago. Poppy talks him into one more vacation to fix whatever broke."],["you-deserve-each-other","You Deserve Each Other","Sarah Hogle","Naomi and Nicholas are engaged and secretly miserable. Neither wants to be the one to call it off, so each tries to make the other quit first."],["the-spanish-love-deception","The Spanish Love Deception","Elena Armas","Catalina needs a date to her sister’s wedding in Spain, and the only volunteer is Aaron, the coworker she can’t stand."],["by-a-thread","By a Thread","Lucy Score","Ally needs a steady paycheck. Dominic is the moody heir of a fashion empire. Working together at Label magazine is chaos from day one."],["the-devil-you-know","The Devil You Know","Elizabeth O’Roark","A slow burn with the one man she’s been warned about, who turns out to be exactly who she needed."],["the-ex-talk","The Ex Talk","Rachel Lynn Solomon","Public radio producer Shay and her rival Dominic get pushed to cohost a show about relationships as exes. They’ve never actually dated."],["funny-story","Funny Story","Emily Henry","Daphne’s fiancé leaves her for his best friend, so she moves in with Miles, the best friend’s ex. Then they start pretending to date."],["the-american-roommate-experiment","The American Roommate Experiment","Elena Armas","Rosie’s ceiling caves in, and she ends up sharing her apartment with Lucas, her best friend’s cousin, who’s in New York for a few weeks."],["the-worst-best-man","The Worst Best Man","Mia Sosa","Wedding planner Carolina was left at the altar. Years later she has to work with Max, the best man who talked his brother out of marrying her."],["the-love-hypothesis","The Love Hypothesis","Ali Hazelwood","To prove she’s moved on, PhD student Olive kisses the first man she sees: young, intimidating professor Adam Carlsen."]];
// onward opens onto the rest of my business shelf
const BIZBOOKS = [["onward", "Onward", "Howard Schultz", "How Howard Schultz came back as Starbucks CEO in 2008 to save a company that had grown too fast and lost its way, by going back to the coffee and the experience in the store."], ["the-design-of-everyday-things", "The Design of Everyday Things", "Don Norman", "Why some doors, stoves and gadgets confuse us, and how good design makes the right action obvious: affordances, signifiers, feedback, and designing for real people."], ["inspired", "Inspired", "Marty Cagan", "How the best tech companies find products customers love: empowered product teams, fast experiments, and falling in love with the problem instead of the solution."], ["creative-confidence", "Creative Confidence", "Tom Kelley & David Kelley", "The founders of IDEO and the Stanford d.school on why everyone is creative, and how design thinking gets you past the fear of failing so you actually act on ideas."], ["the-innovators-dilemma", "The Innovator’s Dilemma", "Clayton Christensen", "Why great companies doing everything right still get disrupted: listening to their best customers makes them ignore cheaper, simpler technologies that later take over."], ["competing-against-luck", "Competing Against Luck", "Clayton Christensen", "Jobs to be done: people don’t buy products, they “hire” them to make progress in their lives. Understand the job and innovation stops being a matter of luck."], ["shoe-dog", "Shoe Dog", "Phil Knight", "Phil Knight’s memoir: from selling Japanese running shoes out of his car to building Nike, near-bankruptcies and all."], ["creativity-inc", "Creativity, Inc.", "Ed Catmull", "Pixar’s co-founder on building a culture where creative people do their best work: candor, the Braintrust, and protecting new ideas while they’re still “ugly babies.”"], ["alchemy", "Alchemy", "Rory Sutherland", "Rory Sutherland on why people aren’t purely rational, and why the most powerful ideas in business and marketing often look illogical at first."], ["the-choice-factory", "The Choice Factory", "Richard Shotton", "Twenty-five behavioral biases that shape what we buy, from social proof to the pratfall effect, each with an experiment and how marketers can use it."], ["decoded", "Decoded", "Phil Barden", "The science behind why we buy: how the brain’s fast, intuitive “autopilot” makes most purchase decisions, and how brands can speak to it."], ["influence", "Influence", "Robert Cialdini", "The principles of persuasion: reciprocity, commitment, social proof, liking, authority, scarcity and unity, and how to spot them working on you."]];
// procreate on my ipad: my ap portfolio and my published book, as stacks
const AP_ART = [["Image 1", "Sketch: traditionalism versus modernism. Thought of essential questions, sketched the woman, decided on the color scheme."], ["Image 2", "Background pattern mirrored on the salwar kameez illustrates how culture is an inherent part of us."], ["Image 3", "Sketch: embracing cultural identity. Essential questions, sketch, colorblocked the rose, decided on the color scheme."], ["Image 4", "Airbrushing two contrasting colors to show how different ideas blend to create an integrated sense of self."], ["Image 5", "Sketch: decided on her pose, sketched my piece, decided the background and the pattern on the blouse."], ["Image 6", "Bold paint strokes in the background to showcase cultural identity."], ["Image 7", "Symmetrical mandala design in the background, continued color blocking on skin."], ["Image 8", "Sketch: used a tripod to take a picture holding scissors and cutting my hair, to show support for Mahsa Amini."], ["Image 9", "Continued use of red to show what a powerful force culture plays in our identity."], ["Image 10", "Navigating Indian-American identity: continued to creatively showcase my Indian-American heritage."], ["Image 11", "Colorblocked skin and bow, added shadows on the cube to give it form, drew two faces of the cube."], ["Image 12", "Embracing Indian heritage: designed a pattern and repeated it on the sleeve and dupatta, drew the jewelry."], ["Image 13", "Repeated the pattern on the sleeve and dupatta to show how ingrained culture is in our identities."], ["Image 14", "Sketch: coexistence of both my worlds. Sketched the flowers, especially the two roses, facing opposite directions."], ["Image 15", "Vibrant flag colors on a bold background capture the essence of Indian-American cultural identity."]];
// my mailbox, flooded with cards from amaira
const MAIL_CARDS = [["assets/mail/amaira-9970.jpg", "“Two Starbucks Girls.” us, at starbucks. obviously."], ["assets/mail/amaira-9971.jpg", "“Two Littl Grils Walking on the Street.” spelling: hers."], ["assets/mail/amaira-9972.jpg", "“I’ll love you! I love you! your the sweets sister ever! I’ll miss you!”"], ["assets/mail/amaira-9973.jpg", "a hot cocoa with an S on it. for me."], ["assets/mail/amaira-9974.jpg", "the two of us, hugging. “this love is just…” she ran out of room."], ["assets/mail/amaira-9975.jpg", "“Happy Valentine’s Day.”"], ["assets/mail/amaira-9976.jpg", "“Girl boss. To: the best sister ever, Didi. From: Amaira. xoxo, Amaripop. I am lucky to have you.”"], ["assets/mail/amaira-9978.jpg", "“Thinking a latte about you.”"], ["assets/mail/amaira-9979.jpg", "a sparkly latte cup, tucked inside a card."], ["assets/mail/amaira-9980.jpg", "“Dear didi, I hope you have a nice time in college. your the sweetest sister ever! I’ll love you forever.”"], ["assets/mail/amaira-9981.jpg", "“Happy Bithday Didi!” with a heart that says suhani & amaira."], ["assets/mail/amaira-9982.jpg", "“Merry Christmas and Happy New Year!! To: Didi From: Amaira.”"], ["assets/mail/amaira-9983.jpg", "“I Love You.”"]];
// an open book: left page is the cover, drawn; right page is the chapter and its synopsis
const bookHTML = (cover, say) => `
        <svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="drawn" x="0" y="0" width="100%" height="100%"><feColorMatrix type="saturate" values=".9"/><feComponentTransfer><feFuncR type="discrete" tableValues="0 .2 .4 .6 .8 1"/><feFuncG type="discrete" tableValues="0 .2 .4 .6 .8 1"/><feFuncB type="discrete" tableValues="0 .2 .4 .6 .8 1"/></feComponentTransfer><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></svg>
        <div class="bk" id="bk">
            <button type="button" class="bk-closed" id="bk-closed" aria-label="Open the book">${cover}</button>
            <div class="bk-open" aria-live="polite">
                <div class="bk-page bk-l"><div class="bk-art"><img id="bk-img" alt=""></div><span class="bk-pg l mono" id="bk-pl"></span></div>
                <div class="bk-page bk-r"><p class="bk-ch" id="bk-ch"></p><h3 id="bk-t"></h3><p class="bk-a" id="bk-a"></p><p class="bk-s" id="bk-s"></p><span class="bk-pg r mono" id="bk-pr"></span></div>
                <div class="bk-leaf" id="bk-leaf"></div>
            </div>
        </div>
        <p class="hand rcx-say">${say}</p>
        <div class="row" style="justify-content:center"><button class="btn" type="button" id="rcx-prev" hidden>‹ last chapter</button><button class="btn solid" type="button" id="rc-read">Open it</button></div>`;
const WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
// a book you open, where every chapter is another book: [cover file, title, author, synopsis]
// the synopsis fills the whole right page: start big, shrink until it fits
function fitSyn() {
    const syn = $('#bk-s'); if (!syn) return;
    const pg = syn.parentElement;
    let size = phone() ? 17 : 30;
    syn.style.fontSize = size + 'px';
    while (size > 12 && pg.scrollHeight > pg.clientHeight + 1) { size -= .5; syn.style.fontSize = size + 'px'; }
}
addEventListener('resize', () => { if ($('#bk.open')) fitSyn(); });
function chapterBook(list, bye) {
    const bk = $('#bk'), btn = $('#rc-read'), leaf = $('#bk-leaf');
    let ch = -1;
    const fill = () => {
        const [f, t, au, syn] = list[ch];
        $('#bk-img').src = `assets/covers/${f}.jpg`; $('#bk-img').alt = `${t}, drawn`;
        $('#bk-ch').textContent = `Chapter ${WORDS[ch] || ch + 1}`; $('#bk-t').textContent = t; $('#bk-a').textContent = au; $('#bk-s').textContent = syn;
        // real page numbers: even on the left, odd on the right
        $('#bk-pl').textContent = 2 * (ch + 1); $('#bk-pr').textContent = 2 * (ch + 1) + 1;
        requestAnimationFrame(fitSyn);
        $('#rcx-prev').hidden = ch === 0;
        btn.textContent = ch === list.length - 1 ? 'Close it' : 'next chapter ›';
    };
    const turn = dir => { leaf.className = 'bk-leaf ' + (dir > 0 ? 'fwd' : 'back'); void leaf.offsetWidth; leaf.classList.add('go'); setTimeout(fill, reduce ? 0 : 280); };
    const next = () => {
        if (!bk.classList.contains('open')) { bk.classList.add('open'); ch = 0; return fill(); }
        if (ch === list.length - 1) { bk.classList.remove('open'); ch = -1; $('#rcx-prev').hidden = true; btn.textContent = 'Open it'; return toast(bye); }
        ch++; turn(1);
    };
    btn.onclick = next; $('#bk-closed').onclick = next;
    $('#rcx-prev').onclick = () => { if (ch > 0) { ch--; turn(-1); } };
}
const VIEWS = {
    jewelry: () => `
        <h2>My little <em>jewelry box</em></h2>
        <p class="note">three necklaces, always with me. tap the box, then pick one up.</p>
        <div class="jw" id="jw">
            <div class="jw-lid" aria-hidden="true"></div>
            <div class="jw-base">${[['evil', 'Swarovski Symbolic evil eye necklace', 'a moon, infinity, a clover, the evil eye, a pearl, a blue drop and a horseshoe. every lucky charm at once.'], ['tx', 'Kendra Scott Elisa necklace, TX', 'texas, in gold, on ivory.'], ['teal', 'Kendra Scott Elisa necklace, Dark Teal Green Illusion', 'the dark teal one.']].map(([k, n, d]) => `<button type="button" class="jw-slot" data-j="${k}" data-n="${n}" data-d="${d}" aria-label="${n}">${JEWELS[k]}</button>`).join('')}</div>
        </div>
        <p class="hand jw-say" id="jw-say">tap the box to open it</p>`,
    onward: () => `
        <h2><em>Onward</em></h2>
        <p class="note">howard schultz. how starbucks fought for its life without losing its soul. open it: every chapter is another book behind the business.</p>
        ${bookHTML(ITEMS.find(i => i.id === 'onward').art, 'how things work: the books behind how i think about products, brands and people.')}`,
    mailbox: () => `
        <h2>My <em>mailbox</em></h2>
        <p class="note">one gold key. it’s mostly packages i definitely needed. but every time i open it, it’s flooded with cards from my little sister.</p>
        <div class="mbx" id="mbx">
            <svg viewBox="0 0 220 180" aria-hidden="true">
                <rect x="10" y="10" width="200" height="160" rx="6" fill="#C9CCD2" stroke="#3A2626" stroke-width="3"/>
                <rect x="30" y="30" width="160" height="120" rx="3" fill="#2E2A2C" stroke="#3A2626" stroke-width="2"/>
                <g class="mbx-env"><rect x="55" y="70" width="110" height="64" rx="3" fill="#FFFDF7" stroke="#3A2626" stroke-width="2"/><path d="M55 72 L110 108 L165 72" fill="none" stroke="#3A2626" stroke-width="2"/><text x="110" y="128" text-anchor="middle" font-family="Kalam" font-size="10" fill="#76344E">to didi ♡</text></g>
                <g class="mbx-door"><rect x="30" y="30" width="160" height="120" rx="3" fill="#B9BCC2" stroke="#3A2626" stroke-width="2.4"/><rect x="40" y="40" width="140" height="18" rx="2" fill="#A7AAB1"/><text x="110" y="53" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#5E6168" letter-spacing="2">MAIL</text>
                    <g class="mbx-lock"><circle cx="164" cy="96" r="10" fill="#E2C47A" stroke="#3A2626" stroke-width="2"/><rect x="162.5" y="89" width="3" height="11" rx="1.2" fill="#3A2626"/></g>
                    <g class="mbx-key"><g class="mbx-key-turn"><path d="M164 93.5 h26 v-3 h5 v3 h4 v5 h-35z" fill="#E7C24E" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"/><path d="M170 98.5 v4 h3 v-3 h3 v4 h3 v-5" fill="#E7C24E" stroke="#3A2626" stroke-width="1.4" stroke-linejoin="round"/><rect x="198" y="84" width="22" height="24" rx="6" fill="#E7C24E" stroke="#3A2626" stroke-width="2"/><circle cx="209" cy="96" r="4" fill="#B9BCC2" stroke="#3A2626" stroke-width="1.4"/></g></g></g>
            </svg>
        </div>
        <div class="mf" id="mf" aria-live="polite">${MAIL_CARDS.map(([src], k) => `<button type="button" class="mf-card" data-mf="${k}" style="--k:${k}; --r:${[-14, 9, -4, 16, -9, 5, -18, 12, -2, 7, -11, 15, -6][k]}deg; --x:${[-150, 120, -40, 170, -110, 30, -180, 80, -70, 150, 10, -130, 60][k]}px; --y:${[10, 26, 4, 40, 52, 18, 70, 64, 88, 92, 46, 110, 120][k]}px" aria-label="A card from Amaira"><img src="${src}" alt="" loading="lazy"></button>`).join('')}</div>
        <div class="mf-view" id="mf-view" hidden><button type="button" class="mf-x" id="mf-x" aria-label="Put it back">×</button><img id="mf-img" alt="A card my little sister made me"><p class="hand" id="mf-cap"></p><div class="row" style="justify-content:center"><button class="btn" type="button" id="mf-prev">‹</button><span class="mono" id="mf-n"></span><button class="btn solid" type="button" id="mf-next">next card ›</button></div></div>
        <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="mbx-key">Turn the key</button></div>
        <div class="lc" id="lc" hidden>
            <div class="lc-paper">
                <span class="lc-holes" aria-hidden="true"><i></i><i></i><i></i></span>
                <p class="lc-name">Amaira</p>
                <h3 class="lc-title">My Lucky Charm</h3>
                <p class="lc-body">My lucky charm is my sister. It makes me feel lucky because she is in my life. When i’m nervous or scared she helps me by comforting me. She became speical once I learned how to open my eyes. She helps me by givving me hugs when i’m sad. I feel lucky when i’m with her. She makes me feel speical by trying her best to make me happy. That is why my lucky charm is my super awsome sister.</p>
                <svg class="lc-draw" viewBox="0 0 200 170" aria-label="Amaira's drawing: a cup that says I love you, a heart, and Didi"><g fill="none" stroke="#7A7472" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M70 40 q30 -30 60 0 q8 30 -4 50 M70 40 q-8 30 4 50" opacity=".35"/><path d="M60 168 q4 -40 40 -46 q36 6 40 46" opacity=".35"/>
                    <path d="M58 64 h84 l-6 14 h-72z"/><path d="M64 78 l10 84 h52 l10 -84"/><path d="M84 112 c-10 -12 2 -22 16 -10 c14 -12 26 -2 16 10 l-16 16z"/></g>
                    <text x="100" y="75" text-anchor="middle" font-family="Kalam" font-size="13" fill="#5E5856">I ♡ U</text>
                    <text x="100" y="152" text-anchor="middle" font-family="Kalam" font-size="13" fill="#5E5856">DiDi</text></svg>
            </div>
            <p class="hand lc-say">my little sister wrote this. it lives with me now.</p>
        </div>`,
    skinbag: () => `
        <h2>My <em>skincare</em> pouch</h2>
        <p class="note">another victoria’s secret pouch, just for skincare. here’s everything in it ↓</p>
        <div class="skin-layout">
        <div class="skin-left">
        <div class="mbag skin" id="mbag">
            <div class="mbag-inside" aria-live="polite">
                ${[['patches', 112, -182, -38, 0, -34], ['pinkpump', 160, -128, -27, 0, -6], ['dropper', 126, -88, -18, 0, 0], ['lash', 132, -48, -9, 0, 0], ['goldpump', 160, -6, 0, 0, 0], ['laneige', 58, 38, 9, 0, -40], ['lamer', 62, 76, 18, 0, -40], ['sisley', 82, 116, 27, 0, -40], ['mask', 196, 184, 26, 0, -30]].map(([k, h, x, a, d, rise]) => `<button type="button" class="mk" data-sk="${k}" style="--h:${h}px; --x:${x}px; --a:${a}deg; --d:${d}ms; --rise:${rise}px" aria-label="${SKIN_INFO[k][0]}: drag it onto me, or tap">${SKIN[k]}<span>${SKIN_INFO[k][2]}</span></button>`).join('')}
            </div>
            <div class="mbag-front">
                <svg viewBox="0 0 300 170" aria-hidden="true"><defs><pattern id="vsk2" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#FFF5F3"/><rect width="11" height="22" fill="#F6D3DB"/></pattern></defs>
                    <path d="M14 34 C14 14 286 14 286 34 L274 154 C272 166 28 166 26 154Z" fill="url(#vsk2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/>
                    <path class="mzip" d="M28 34 H272" stroke="#3A2626" stroke-width="3" stroke-dasharray="6 6"/>
                    <path class="mgap" d="M28 34 H272" stroke="#2A1E22" stroke-width="10" stroke-linecap="round"/>
                    <text x="150" y="112" text-anchor="middle" font-family="Bodoni Moda" font-size="20" letter-spacing="5" fill="#C98A9C">SKINCARE</text>
                </svg>
                <button type="button" class="mpull" id="mpull" aria-label="Unzip the skincare pouch"><span></span></button>
            </div>
        </div>
        <div class="swatch" id="swatch" aria-live="polite"><svg viewBox="0 0 260 60" aria-hidden="true"><path id="swipe" d="M18 34 C60 14 110 46 150 28 S220 18 242 30" fill="none" stroke="#D2A27E" stroke-width="16" stroke-linecap="round"/></svg><span class="hand" id="swatch-label"></span></div>
        <p class="swatch-more"><button type="button" class="link" id="swatch-more" hidden></button></p>
        <p class="pen-note" id="mk-note">pull the zipper</p>
        <h3 class="routine-h">my night routine</h3>
        <p class="routine-sub hand" id="routine-next">step 1: ${SKIN_INFO[ROUTINE[0]][2]}. tap them in the pouch</p>
            <ol class="routine" id="routine">${ROUTINE.map(k => `<li data-step="${k}">${SKIN_INFO[k][0]}</li>`).join('')}</ol>
        </div>
        <div class="skin-right">
            <div class="face" id="face">
                <img src="assets/img/me-skin.jpg" alt="Me, no makeup, ready for my skincare"><img class="face-patched" src="assets/img/me-skin-patches.jpg" alt="" aria-hidden="true"><img class="face-lamer" src="assets/img/me-skin-lamer.jpg" alt="" aria-hidden="true"><img class="face-closed" src="assets/img/me-skin-closed.jpg" alt="" aria-hidden="true"><img class="face-mask" src="assets/img/me-skin-mask.jpg" alt="" aria-hidden="true">
                <svg viewBox="0 0 900 719" aria-hidden="true"><defs>
                        <filter id="fx-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
                        <filter id="fx-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>
                        <linearGradient id="lidL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9786A"/><stop offset="1" stop-color="#B98676"/></linearGradient>
                        <linearGradient id="lidR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6957F"/><stop offset="1" stop-color="#D2A390"/></linearGradient>
                        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6D873"/><stop offset=".45" stop-color="#D8A82A"/><stop offset=".7" stop-color="#F3D06A"/><stop offset="1" stop-color="#C9961E"/></linearGradient>
                </defs>
                        <g class="fx" data-fx="lashes"><image href="assets/img/me-lash-l.png" x="248" y="278" width="100" height="70"/><image href="assets/img/me-lash-r.png" x="372" y="272" width="120" height="76"/></g>
                        <g class="fx" data-fx="lips"><image href="assets/img/me-lips-laneige.png" x="296" y="436" width="128" height="92"/></g>
                                                <g class="fx" data-fx="patches" transform="translate(0 10)">
                            <path d="M272 340 C290 336 310 336 324 338 C326 360 318 380 298 381 C282 382 272 366 272 340Z" fill="#FFE4DE" fill-opacity=".38" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>
                            <path d="M383 346 C420 340 470 325 500 318 C516 318 518 345 510 362 C500 384 470 396 440 397 C405 398 382 380 383 346Z" fill="#FFE4DE" fill-opacity=".38" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>
                            <path d="M492 330 q8 6 6 18 M418 384 q14 4 26 2 M282 350 q2 14 10 22" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/></g>
                </svg>
                <span class="face-hint hand" id="face-hint">drop products here ↓</span>
                <button type="button" class="lm-spoon" id="lm-spoon" hidden aria-label="La Mer's little applicator: drag it under my eyes"><svg viewBox="0 0 20 96" aria-hidden="true"><defs><linearGradient id="lmsp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6E4C40"/><stop offset=".4" stop-color="#E9D5CA"/><stop offset="1" stop-color="#3A231C"/></linearGradient></defs><path d="M10 18 L10 92" stroke="#3A2626" stroke-width="6" stroke-linecap="round"/><path d="M10 18 L10 92" stroke="#5E7E2C" stroke-width="3.6" stroke-linecap="round"/><ellipse cx="10" cy="10" rx="7" ry="9" fill="url(#lmsp)" stroke="#3A2626" stroke-width="1.6"/></svg></button>
            </div>
        </div>
        </div>`,
    chargers: () => `
        <h2>My <em>chargers</em></h2>
        <p class="note">macbook, iphone, headphones. always at the very bottom of my bag. always one knot.</p>
        <svg class="chg-svg" id="chg-svg" viewBox="20 20 360 360" role="img" aria-label="Three tangled chargers. Drag a plug to pull its cable free, starting with whichever one is on top"></svg>
        <p class="hand chg-note" id="chg-note">drag a plug out. the one on top comes free first.</p>
        <div class="row" style="justify-content:center"><button class="btn" type="button" id="chg-reset">Throw them back in the bag</button></div>`,
    backuplip: () => {
        return `
        <h2>the <em>backup</em> lipstick: westman atelier</h2>
        <p class="note">dry lips, always. so there’s always an extra one in here. lipstick is my favorite makeup product, full stop.</p>
        <div class="lipwrap">
            <div class="lip-slot"><button type="button" class="lip-stick" id="lip-stick" aria-label="My Westman Glögg lipstick: pick it up and drag it across my lips">${ITEMS.find(i => i.id === 'backup-lip').art}</button></div>
            <svg class="lipface" id="lipface" viewBox="0 0 300 160" role="img" aria-label="My lips. Drag across them to put the lipstick on me">
                <defs><mask id="lip-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="160"><filter id="lip-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.5"/></filter><g id="lip-paint" filter="url(#lip-soft)"></g></mask></defs>
                <rect width="300" height="160" rx="18" fill="#E9B998"/>
                <path d="M0 150 Q150 172 300 150 V160 H0Z" fill="#DCA98A"/>
                <defs><filter id="glogg" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".6 0 0 0 0  0 .36 0 0 0  0 0 .36 0 0  0 0 0 1 0"/></filter></defs>
                <g class="lp-natural"><image href="assets/img/lips.png" x="30" y="25" width="240" height="110"/></g>
                <g class="lp-color" mask="url(#lip-mask)"><image href="assets/img/lips.png" x="30" y="25" width="240" height="110" filter="url(#glogg)"/></g>
                <g class="lp-happy"><image href="assets/img/lips.png" x="30" y="25" width="240" height="110" filter="url(#glogg)"/></g>
            </svg>
        </div>
        <p class="hand lip-say" id="lip-say">pick up the lipstick and put it on me ↔</p>
        <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="bl-go">Swipe it on for me</button></div>`;
    },
    cards: () => `
        <h2><em>amaira’s</em> cards</h2>
        <p class="note">my little sister makes me cards. i keep them. all of them. they live in my backpack.</p>
        <div class="kc" id="kc"></div>
        <div class="row" style="justify-content:center"><button class="btn" type="button" id="kc-prev">‹</button><span class="hand" id="kc-n" style="align-self:center; color:var(--plum); min-width:4em; text-align:center"></span><button class="btn solid" type="button" id="kc-next">next card ›</button></div>
        <p class="note" id="kc-note" style="text-align:center"></p>`,
    bear: () => `
        <h2>this is <em>T.D.</em></h2>
        <div class="big-obj">${ITEMS.find(i => i.id === 'bear').art}</div>
        <p class="note">like teddy duncan from good luck charlie. he was the first gift i ever bought my little sister, amaira. now he rides around austin in my backpack.</p>
        <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="hug">Give him a hug</button></div>`,
    todo: () => `
        <h2>an <em>overdue</em> to-do list</h2>
        <div class="crumple" id="crumple"><div class="cr-ball">${ITEMS.find(i => i.id === 'todo').art}</div><div class="cr-flat">${ITEMS.find(i => i.id === 'todo').flat}</div></div>
        <p class="note" id="cr-note" style="text-align:center">crumpled up in the don’t-want-to-deal-with-it pocket. tap to smooth it out.</p>`,
    ticket: () => `
        <h2>a <em>speeding ticket</em></h2>
        <button type="button" class="tk" id="tk" aria-label="My speeding ticket: tap to flip it over">
            <span class="tk-f">${ITEMS.find(i => i.id === 'ticket').art}</span>
            <span class="tk-b"><svg viewBox="0 0 220 150" aria-hidden="true"><rect x="4" y="4" width="212" height="142" rx="3" fill="#F7F3EA" stroke="#3A2626" stroke-width="3"/><path d="M14 22 h192" stroke="#C9C1B2" stroke-width="1.2"/>
                <text x="16" y="18" font-family="Instrument Sans" font-weight="700" font-size="9" letter-spacing="1.4" fill="#2C4E95">PAYMENT</text>
                <text x="16" y="44" font-family="Instrument Sans" font-size="8" fill="#3A2626">FINE + COURT COSTS</text>
                <text x="204" y="44" text-anchor="end" font-family="JetBrains Mono" font-size="9" fill="#3A2626">$350.00</text>
                <path d="M16 54 h188" stroke="#C9C1B2" stroke-width="1" stroke-dasharray="3 3"/>
                <text x="16" y="72" font-family="Instrument Sans" font-weight="700" font-size="11" fill="#3A2626">TOTAL DUE</text>
                <text x="204" y="74" text-anchor="end" font-family="Bodoni Moda" font-weight="600" font-size="22" fill="#3A2626">$350</text>
                <g transform="translate(110 112) rotate(-10)"><rect x="-48" y="-18" width="96" height="36" rx="5" fill="none" stroke="#C0272D" stroke-width="3.5"/><text x="0" y="9" text-anchor="middle" font-family="Instrument Sans" font-weight="800" font-size="24" letter-spacing="3" fill="#C0272D" opacity=".9">PAID</text></g>
                <text x="16" y="140" font-family="Caveat" font-size="12" fill="#8E2A24">ouch.</text></svg></span>
        </button>
        <p class="hand tk-say" id="tk-say">tap it to flip it over</p>
        <p class="note">see also: my car keys, right next to it in the don’t-want-to-deal-with-it pocket. and the curb. the curb knows what it did.</p>`,
    giftcards: () => `
        <h2>some <em>gift cards</em> <span class="mono" style="font-size:.7rem; color:var(--muted)">(store credit, technically)</span></h2>
        <p class="note">i online shop. i mean to return things. then the return window closes while the box sits by my door, and i get store credit instead. tap a card to flip it.</p>
        <div class="gcs" id="gcs">${GIFTCARDS.map((g, k) => `
            <button type="button" class="gc gc-${g.id}" style="--k:${k}" data-gc="${k}" aria-label="${g.name} card: tap to flip it over">
                <span class="gc-face gc-front">${g.front}<span class="gc-chip-txt">GIFT CARD</span></span>
                <span class="gc-face gc-back">
                    <span class="gc-stripe"></span>
                    <span class="gc-bk"><b>${g.name.toUpperCase()} · MERCHANDISE CREDIT</b>
                        <small>issued for: ${g.why}</small>
                        <span class="gc-scratch" data-scratch><span class="gc-bal">balance: ${g.bal}</span><span class="gc-foil">scratch for balance ✦</span></span>
                        <span class="gc-bar"></span><small class="mono">•••• •••• •••• ${g.last}</small></span>
                </span>
            </button>`).join('')}</div>
        <p class="hand gc-tally" id="gc-tally">3 cards. 0 returns made on time.</p>`,
    pads: () => `
        <h2><em>pads</em></h2>
        <div class="big-obj" style="max-width:220px">${ITEMS.find(i => i.id === 'pads').art}</div>
        <p class="note">obviously. and yes, you can have one. just don’t give it back to me.</p>
        <div class="pad-note">
            <p>hey girl ♡</p>
            <p>if you’re on your period right now, take one. take two. i hope you’re taking care of yourself: drink some water, eat something warm, rest if you can, and be a little extra nice to you today.</p>
            <p>you deserve to feel better. i hope you do ♡</p>
            <p class="pad-sig">— suhani</p>
        </div>
        <p class="pad-more">i care about this so much i built an app for it: <a href="https://suhxnitiwari.github.io/cadence-period-tracker/" target="_blank" rel="noopener">Cadence ↗</a>, a free, private period app for your first one and every one after.</p>`,

    brushes: () => `
        <h2>My <em>Morphe</em> brushes</h2>
        <p class="note">m241 angled bronzer, m242 cream bronzer, m132 angled concealer, and the eye want it all 7-piece set.</p>
        <div class="mbrs" id="mbrs"><button type="button" class="mbr" data-br="0" style="--i:0" aria-label="Morphe M241 Angled Powder Bronzer"><svg viewBox="-24 -50 48 230"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-15.0 0 C-15.0 -21.0 -6.0 -42.0 4.5 -42.0 C15.0 -35.699999999999996 15.0 -12.6 15.0 0Z"/></g><path d="M-8.25 0 H8.25 L6.3 26 H-6.3Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-6.3 26 H6.3 L5.04 150 Q0 156 -5.04 150Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-2.5 32 V140" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 93) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>M241 Angled Powder Bronzer</span></button><button type="button" class="mbr" data-br="1" style="--i:1" aria-label="Morphe M242 Slanted Cream & Liquid Bronzer"><svg viewBox="-24 -50 48 230"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-14.0 0 V-19.599999999999998 C-14.0 -41.16 14.0 -41.16 14.0 -19.599999999999998 V0Z"/></g><path d="M-7.700000000000001 0 H7.700000000000001 L5.88 26 H-5.88Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-5.88 26 H5.88 L4.704 150 Q0 156 -4.704 150Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-2.4 32 V140" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 93) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>M242 Slanted Cream & Liquid Bronzer</span></button><button type="button" class="mbr" data-br="2" style="--i:2" aria-label="Morphe M132 Angled Concealer"><svg viewBox="-24 -50 48 230"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-8.0 0 V-12.32 L8.0 -22.4 V0Z"/></g><path d="M-4.4 0 H4.4 L3.36 26 H-3.36Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.36 26 H3.36 L2.688 150 Q0 156 -2.688 150Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.3 32 V140" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 93) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>M132 Angled Concealer</span></button><button type="button" class="mbr" data-br="3" style="--i:3" aria-label="Morphe Eye Tapered Blender"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-7.0 0 C-7.0 -11.759999999999998 -1.4000000000000001 -21.56 0 -22.539999999999996 C1.4000000000000001 -21.56 7.0 -11.759999999999998 7.0 0Z"/></g><path d="M-3.8500000000000005 0 H3.8500000000000005 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Tapered Blender</span></button><button type="button" class="mbr" data-br="4" style="--i:4" aria-label="Morphe Eye Pointed Crease"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-6.0 0 C-6.0 -10.079999999999998 -1.2000000000000002 -18.479999999999997 0 -19.319999999999997 C1.2000000000000002 -18.479999999999997 6.0 -10.079999999999998 6.0 0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Pointed Crease</span></button><button type="button" class="mbr" data-br="5" style="--i:5" aria-label="Morphe Eye Dome Shader"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-6.0 0 V-8.399999999999999 C-6.0 -17.639999999999997 6.0 -17.639999999999997 6.0 -8.399999999999999 V0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Dome Shader</span></button><button type="button" class="mbr" data-br="6" style="--i:6" aria-label="Morphe Eye Pencil"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-4.5 0 C-4.5 -7.56 -0.9 -13.860000000000001 0 -14.489999999999998 C0.9 -13.860000000000001 4.5 -7.56 4.5 0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Pencil</span></button><button type="button" class="mbr" data-br="7" style="--i:7" aria-label="Morphe Eye Flat Shader"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-5.5 0 V-10.779999999999998 Q0 -16.169999999999998 5.5 -10.779999999999998 V0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Flat Shader</span></button><button type="button" class="mbr" data-br="8" style="--i:8" aria-label="Morphe Eye Small Detail"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-4.0 0 V-6.72 Q0 -10.08 4.0 -6.72 V0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text></svg><span>Small Detail</span></button><button type="button" class="mbr" data-br="9" style="--i:9" aria-label="Morphe Eye Angled Liner + Spoolie"><svg viewBox="-24 -50 48 216"><g fill="#8B8580" stroke="#3A2626" stroke-width="1.6" stroke-linejoin="round"><path d="M-5.0 0 V-5.6000000000000005 L5.0 -12.6 V0Z"/></g><path d="M-3.5 0 H3.5 L3.0 26 H-3.0Z" fill="#ECEAE6" stroke="#3A2626" stroke-width="1.6"/><path d="M-3.0 26 H3.0 L2.4000000000000004 136 Q0 142 -2.4000000000000004 136Z" fill="#F4F2EE" stroke="#3A2626" stroke-width="1.6"/><path d="M-1.2 32 V126" stroke="#fff" stroke-width="1.6"/><text transform="translate(2 84) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="5" letter-spacing="1" fill="#4A4448" text-anchor="middle">MORPHE</text><g transform="translate(0 150)"><path d="M0 0 v14" stroke="#7A7470" stroke-width="1.4"/><path d="M-4 4 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 6 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 8 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 10 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 12 h8" stroke="#8A8480" stroke-width="1.2"/><path d="M-4 14 h8" stroke="#8A8480" stroke-width="1.2"/></g></svg><span>Angled Liner + Spoolie</span></button></div>
        <p class="hand mbr-note" id="mbr-note">tap a brush</p>`,

    journal: () => `
        <h2><em>her greatest power is believing in herself</em></h2>
        <p class="note">my pink journal. small, always on me, for the ideas that show up at the worst times.</p>
        <div class="jb" id="jb">
            <div class="jb-page"><span class="jb-date" aria-hidden="true">DATE&nbsp;&nbsp;/&nbsp;&nbsp;/</span><div class="jb-lines" contenteditable="true" spellcheck="false" aria-label="Write an idea"></div></div>
            <div class="jb-cover" id="jb-cover">
                <div class="jb-front" role="button" tabindex="0" aria-label="Open the journal">${ITEMS.find(i => i.id === 'journal').art}<span class="jb-corner" aria-hidden="true">open it ←</span></div>
                <div class="jb-back" aria-label="Close the journal"></div>
            </div>
        </div>
        <p class="hand" id="jb-hint" style="text-align:center; color:var(--plum); margin:8px 0 0">tap the cover to open it</p>`,
    perfume: () => `
        <h2>My <em>personality</em>, in a bottle</h2>
        <p class="note">philosophy amazing grace ballet rose. it says “grace lets you move to your own rhythm” right on the label. that’s just me.</p>
        <div class="pf-bottle" id="pf-bottle">${ITEMS.find(i => i.id === 'perfume').art}</div>
        <p class="hand pf-hint" id="pf-hint">pull the cap off, then spritz to get to know me ✨</p>
        <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="spritz">Take the cap off</button></div>
        <div class="notes3 pf-me">${[
            ['top', 'first impression', 'lychee · cassie flower', 'bright, a little sweet, and talking to you before the elevator doors close.'],
            ['heart', 'once you know me', 'dewy peony · jasmine petals · rose absolute', 'soft, a hopeless romantic, pink about everything.'],
            ['base', 'what stays', 'ambrette seeds · palisandre wood · ballet pink musk', 'warm and steady. still in the room after i’ve left it.']
        ].map(([k, when, n, me]) => `<div data-layer="${k}"><b>${k} · ${when}</b><span>${n}</span><em class="hand">${me}</em></div>`).join('')}</div>`,
    boarding: () => `
        <h2>My <em>boarding pass</em></h2>
        <p class="note">tucked inside my passport. destination: wherever’s next.</p>
        <div class="bp-gate" id="bp-gate"><div class="bp-big">${ITEMS.find(i => i.id === 'boarding').art}</div><span class="bp-laser" aria-hidden="true"></span><span class="bp-stamp" aria-hidden="true">BOARDED ✓</span></div>
        <div class="row"><button class="btn solid" type="button" id="bp-scan">Scan it</button> <span class="bp-light" id="bp-light" aria-hidden="true"></span></div>
        <p class="hand bp-where">where it’s taken me so far:</p>
        <div class="row"><a class="btn" href="https://suhanitiwari.com/home/make#traveling" target="_blank" rel="noopener">My itineraries (Chicago, New York) ↗</a></div>`,
    padfolio: () => `
        <h2>My <em>McCombs</em> padfolio</h2>
        <p class="note">my résumé on the left, my notes on the right, a baby pink pen in the middle. ready for anything.</p>
        <div class="pf">
            <div class="pf-left">
                <div class="pf-stack" aria-hidden="true"><span></span><span></span></div>
                <div class="pf-resume" id="pf-resume" role="button" tabindex="0" aria-label="My résumé: tap to pull it out"><img src="assets/img/resume.png" alt="My résumé"><span class="pf-take">pull it out ↑</span><a class="pf-open" href="https://suhanitiwari.com/resume" target="_blank" rel="noopener">open the full résumé ↗</a></div>
                <div class="bc" id="bc" role="button" tabindex="0" aria-label="My business card: tap to flip it"><span class="bc-in">
                    <span class="bc-f"><b>Suhani Tiwari</b><i>MIS + Psychology · UT Austin</i><em>product · brand · technology</em><span class="bc-heart">♡</span></span>
                    <span class="bc-b"><a href="https://suhanitiwari.com" target="_blank" rel="noopener">suhanitiwari.com ↗</a><a href="https://www.linkedin.com/in/suhxnitiwari" target="_blank" rel="noopener">linkedin.com/in/suhxnitiwari ↗</a><a href="https://www.instagram.com/hifromhani/" target="_blank" rel="noopener">instagram @hifromhani ↗</a><a href="mailto:suhanitiwari@utexas.edu">suhanitiwari@utexas.edu ✉</a><em>let’s get coffee ☕</em></span>
                </span></div>
                <button type="button" class="pf-pen" id="pf-pen" aria-label="My baby pink pen: pick it up to write on the legal pad"><svg viewBox="0 0 30 150">
                    <path d="M15 8 c-6 -7 -13 -4 -10 1 c2 3 7 2 10 -1 c3 3 8 4 10 1 c3 -5 -4 -8 -10 -1z" fill="#F7A8C0" stroke="#3A2626" stroke-width="1.2"/><circle cx="15" cy="8" r="2" fill="#E57A9E" stroke="#3A2626" stroke-width="1"/>
                    <rect x="10" y="10" width="10" height="8" rx="2" fill="#FBD3DF" stroke="#3A2626" stroke-width="1.2"/>
                    <rect x="9" y="17" width="12" height="86" rx="5" fill="#F9C4D3" stroke="#3A2626" stroke-width="1.4"/>
                    <path d="M20 20 h3 v40 l-2.5 3 h-.5z" fill="#F3B0C4" stroke="#3A2626" stroke-width="1"/><path d="M21.5 52 c-1.6 -1.6 -3.6 0 -1.4 2.2 l1.4 1.4 1.4 -1.4 c2.2 -2.2 .2 -3.8 -1.4 -2.2z" fill="#E0568F"/>
                    <rect x="9" y="102" width="12" height="22" rx="2" fill="#F7D9E2" stroke="#3A2626" stroke-width="1.2"/><path d="M10 106 h10 M10 110 h10 M10 114 h10 M10 118 h10" stroke="#E7A9BC" stroke-width="1"/>
                    <path d="M9 124 L15 140 L21 124Z" fill="#F9C4D3" stroke="#3A2626" stroke-width="1.2"/><path d="M15 140 v5" stroke="#8A8A90" stroke-width="1.2"/>
                    <path d="M12 24 v74" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></svg></button>
            </div>
            <div class="pf-right"><div class="pf-pad" id="pf-pad">
                <div class="pf-sheet" style="--z:9"><div class="pf-legal" aria-label="My legal pad: the roles I'm going for">
                <p>roles i’m going for:</p>
                <p>♡ product marketing manager</p>
                <p>♡ product manager</p>
                <p>♡ brand strategist</p>
                <p>♡ technology consultant</p>
                <p>♡ management consultant</p>
                <p>♡ UI/UX designer</p>
                <p class="pf-u">→ work where technology meets people</p>
                <p style="margin-top:14px">dream companies:</p>
                <p>☆ netflix ☆ spotify ☆ duolingo</p>
                </div><canvas class="pf-ink" aria-hidden="true"></canvas></div>
                ${[8, 7, 6, 5, 4, 3].map(z => `<div class="pf-sheet" style="--z:${z}"><div class="pf-legal"></div><canvas class="pf-ink" aria-hidden="true"></canvas></div>`).join('')}
                <button type="button" class="pf-curl" id="pf-next" aria-label="Flip this page up to the next one">flip ↑</button>
                <button type="button" class="pf-prev mono" id="pf-prev" hidden>↓ last page</button>
            </div></div>
        </div>`,
    cap: () => `
        <h2>My <em>cap</em></h2>
        <p class="note">a cap is a must.</p>
        <div class="capfit" id="capfit"><img src="assets/img/me.jpg" alt="Me, in my blue coat"><button type="button" class="capfit-cap" id="capfit-cap" aria-label="My brown NY cap: tap to put it on me">${ITEMS.find(i => i.id === 'cap').art}</button></div>
        <p>Brown, with the NY stitched tone on tone. Goes with everything, especially the Chanel sunglasses. Bad hair day, sunny day, running-late day.</p>
        <div class="row"><button class="btn solid" type="button" id="cap-on">Put it on me</button></div>`,
    romcom: () => `
        <h2><em>You Deserve Each Other</em></h2>
        <p class="note">sarah hogle. one of the rom-coms i’ll never shut up about. open it: every chapter is another one.</p>
        ${bookHTML(ITEMS.find(i => i.id === 'romcom').art, 'enemies to lovers, fake dating, happy endings: i know how every one ends and still can’t put them down.')}`,
    hairpony: () => `
        <h2>My silk <em>scrunchies</em></h2>
        <p class="note">two of them, pink and brown.</p>
        <div class="solo">${ITEMS.find(i => i.id === 'scrunchies').art}</div>`,
    haircomb: () => `
        <h2>My <em>wide-tooth</em> comb</h2>
        <p class="note">wide teeth, for long hair. drag it down through my hair.</p>
        <div class="hair" id="hair">
            <img src="assets/img/me-hair-before.jpg" alt="My hair before combing: frizzy">
            <img class="hair-after" id="hair-after" src="assets/img/me-hair-after.jpg" alt="My hair after combing: smooth waves">
            <button type="button" class="hair-comb" id="hair-comb" aria-label="Comb my hair: drag down, or press to comb it all the way">${ITEMS.find(i => i.id === 'comb').art}</button>
            <img class="hair-braid" src="assets/img/me-hair-braid.jpg" alt="My hair in one long braid" aria-hidden="true">
            <span class="hair-tag mono" id="hair-tag">before</span>
        </div>
        <p class="pen-note" id="hair-note">before → after, one comb.</p>
        <div class="row" style="justify-content:center"><button type="button" class="btn solid" id="hair-braid" hidden>now braid it</button></div>`,

    bag: () => `
        <h2>My <em>backpack</em></h2>
        <p class="note">it goes everywhere with me. class, work, coffee, back to class.</p>
        <p>Everything I actually carry is on the table. Tap any of it.</p>`,

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
                <li><b>MAC Sleek Satin lipstick, Espresso Yourself.</b> In the makeup bag.</li>
                <li><b>Westman Atelier lipstick, Glögg.</b> My favorite lipstick, period. The backup lives in the grab-it pocket.</li>
                <li><b>Westman Atelier Baby Cheeks Blush Stick, Mimi.</b> Tawny beige. One swipe and done.</li>
                <li><b>Westman Atelier Face Trace Cream Contour Stick, Biscuit.</b> Cool beige coffee. My contour.</li>
                <li><b>Estée Lauder Futurist Aqua Brilliance Watery Glow Primer.</b> My primer. Goes on before the foundation.</li>
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
`,

    makeupbag: () => `
        <h2>My <em>makeup pouch</em></h2>
        <p class="note">victoria’s secret, pink stripes. unzip it.</p>
        <div class="mbag" id="mbag">
            <div class="mbag-inside" aria-live="polite">
                <button type="button" class="mk" data-mk="lipliner" style="--h:250px; --rise:-34px; --x:-152px; --a:-36deg; --d:0ms" aria-label="Make Up For Ever Artist Color Pencil lip liner, 600 Anywhere Caffeine">${ITEMS.find(i => i.id === 'lipliner').art}<span>lip liner</span></button>
                <button type="button" class="mk" data-mk="lipstick" style="--h:150px; --rise:-34px; --x:-114px; --a:-27deg; --d:45ms" aria-label="MAC Sleek Satin lipstick, Espresso Yourself">${ITEMS.find(i => i.id === 'lipstick').art}<span>lipstick</span></button>
                <button type="button" class="mk" data-mk="mascara" style="--h:238px; --x:0px; --a:0deg; --d:180ms" aria-label="Lancôme Lash Idôle mascara">${ITEMS.find(i => i.id === 'mascara').art}<span>mascara</span></button>
                <button type="button" class="mk" data-mk="primer" style="--h:238px; --x:38px; --a:9deg; --d:225ms" aria-label="Estée Lauder Futurist Aqua Brilliance Watery Glow Primer">${ITEMS.find(i => i.id === 'primer').art}<span>primer</span></button>
                <button type="button" class="mk" data-mk="foundation" style="--h:238px; --x:76px; --a:18deg; --d:270ms" aria-label="Charlotte Tilbury Beautiful Skin Foundation, 6 Neutral">${ITEMS.find(i => i.id === 'foundation').art}<span>foundation</span></button>
                <button type="button" class="mk" data-mk="concealer" style="--h:187px; --x:152px; --a:36deg; --d:450ms" aria-label="Hourglass Vanish Airbrush Concealer">${ITEMS.find(i => i.id === 'concealer').art}<span>concealer</span></button>
                <button type="button" class="mk" data-mk="blush" style="--h:172px; --rise:-34px; --x:-76px; --a:-18deg; --d:90ms" aria-label="Westman Atelier Baby Cheeks blush stick, Mimi">${ITEMS.find(i => i.id === 'blush').art}<span>blush</span></button>
                <button type="button" class="mk" data-mk="contour" style="--h:172px; --rise:-34px; --x:-38px; --a:-9deg; --d:135ms" aria-label="Westman Atelier Face Trace Cream Contour Stick, Biscuit">${ITEMS.find(i => i.id === 'contour').art}<span>contour</span></button>
                <button type="button" class="mk brushes" data-mk="brushes" style="--h:255px; --x:114px; --a:27deg; --d:360ms" aria-label="My Morphe brushes"><svg viewBox="0 0 90 215"><g transform="rotate(-9 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M41 62 C38 44 42 26 45 18 C48 26 52 44 49 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(-5.5 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M38 62 C34 44 38 30 45 28 C52 30 56 44 52 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(-2 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M35 62 C27 42 33 20 45 18 C57 20 63 42 55 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(2 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M38 62 C33 46 37 30 45 29 C53 30 57 46 52 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(5.5 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M42 62 C41 52 42 44 45 40 C48 44 49 52 48 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(9 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><rect x="43" y="22" width="4" height="40" rx="2" fill="#8A8079"/><path d="M38 26 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 30 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 34 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 38 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 42 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 46 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 50 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 54 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 58 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/></g></svg><span>brushes</span></button>
            </div>
            <div class="mbag-front">
                <svg viewBox="0 0 300 170" aria-hidden="true"><defs><pattern id="vs2" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#F7C9D6"/><rect width="11" height="22" fill="#F29BB6"/></pattern></defs>
                    <path d="M14 34 C14 14 286 14 286 34 L274 154 C272 166 28 166 26 154Z" fill="url(#vs2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/>
                    <path class="mzip" d="M28 34 H272" stroke="#3A2626" stroke-width="3" stroke-dasharray="6 6"/>
                    <path class="mgap" d="M28 34 H272" stroke="#2A1E22" stroke-width="10" stroke-linecap="round"/>
                    <text x="150" y="112" text-anchor="middle" font-family="Bodoni Moda" font-size="20" letter-spacing="5" fill="#7E2246">MAKEUP</text>
                </svg>
                <button type="button" class="mpull" id="mpull" aria-label="Unzip the makeup pouch"><span></span></button>
            </div>
        </div>
        <div class="swatch" id="swatch" aria-live="polite"><svg viewBox="0 0 260 60" aria-hidden="true"><path id="swipe" d="M18 34 C60 14 110 46 150 28 S220 18 242 30" fill="none" stroke="#D2A27E" stroke-width="16" stroke-linecap="round"/></svg><span class="hand" id="swatch-label"></span></div>
        <p class="swatch-more"><button type="button" class="link" id="swatch-more" hidden>take a closer look ↗</button></p>
        <p class="pen-note" id="mk-note">pull the zipper</p>
        <h3 class="routine-h">bibbidi bobbidi boo</h3>
        <div class="bbb" id="bbb">
            <div class="bbb-photo">
                <img src="assets/img/me-makeup-before.jpg" alt="Me before makeup">
                <img class="bbb-after" src="assets/img/me-makeup-after.jpg" alt="Me after makeup: Westman blush, MAC Espresso Yourself, Lash Idôle" aria-hidden="true">
                <span class="bbb-tag mono" id="bbb-tag">before</span>
                <div class="bbb-dust" id="bbb-dust" aria-hidden="true"></div>
            </div>
            <div class="bbb-btns"><button type="button" class="btn solid bbb-wand" id="bbb-wand"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 L14 10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M17 3 l1.1 2.9 2.9 1.1 -2.9 1.1 -1.1 2.9 -1.1 -2.9 -2.9 -1.1 2.9 -1.1Z" fill="currentColor"/></svg><span id="bbb-word">bibbidi bobbidi boo</span></button>
            <button type="button" class="btn bbb-zoom" id="bbb-zoom" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 L14 10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M17 3 l1.1 2.9 2.9 1.1 -2.9 1.1 -1.1 2.9 -1.1 -2.9 -2.9 -1.1 2.9 -1.1Z" fill="currentColor"/></svg><span id="bbb-zword">zoom in</span></button></div>
            <p class="bbb-cap hand" aria-live="polite">pretty both ways, right?</p>
        </div>
`,

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
                    ['₹500', '#B9B4A8', '#4E4A40'], ['₹200', '#EBC76A', '#6A4A08'], ['₹100', '#B9A9DC', '#3E2E70'], ['$100', '#D8E2D2', '#24401F'], ['$100', '#D8E2D2', '#24401F'], ['$100', '#D8E2D2', '#24401F'], ['$100', '#D8E2D2', '#24401F'], ['$100', '#D8E2D2', '#24401F']
                ].map(([d, bg, ink], k) => `<span class="bill${d === '$100' ? ' usd100' : ''}" style="--k:${k}; --bg:${bg}; --ink:${ink}"><b>${d}</b><i>${d[0] === '₹' ? 'भारतीय रिज़र्व बैंक' : 'THE UNITED STATES OF AMERICA'}</i></span>`).join('')}</button>
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
        title: 'My <em>Paper Mate</em> pouch', note: '20 paper mate inkjoy gel pens and 5 bic mechanical pencils, sharing one pouch. drag the zipper slowly. pick one up and draw.',
        list: GELPENS_AND_PENCILS, front: ITEMS.find(i => i.id === 'penpouch').art, pick: 'pick a pen or a pencil, then draw on the page ↓',
        pen: (c, p) => p && p.pencil ? PENCIL_SVG(c) : `<svg viewBox="0 0 34 190"><rect x="7" y="16" width="20" height="150" rx="9" fill="${c}" stroke="#3A2626" stroke-width="3"/><rect x="9" y="22" width="5" height="120" rx="2.5" fill="#fff" opacity=".35"/><rect x="21" y="10" width="6" height="56" rx="3" fill="${c}" stroke="#3A2626" stroke-width="2.5"/><rect x="11" y="2" width="12" height="16" rx="4" fill="${c}" stroke="#3A2626" stroke-width="2.5"/><path d="M11 166 L17 186 L23 166Z" fill="#E8E2DC" stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    }),

    readers: () => `
        <h2>My <em>reading</em> glasses</h2>
        <p class="note">black frames, little gold bees on the corners. for reading, and for screens at 2am.</p>
        <div class="rg-big"><img src="assets/img/reading-glasses.png" alt="My black reading glasses with gold bees on the corners"></div>
        <p class="rg-text" id="rg-text">if you can read this, you’re wearing my glasses. hi ♡ the rom-com is still on chapter one, the to-do list is still overdue, and i still think i’ll get to both tonight.</p>
        <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="rg-on" aria-pressed="false">Put them on</button></div>`,
    sunglasses: () => `
        <h2>How I <em>see</em> things</h2>
        <p class="note">chanel square sunglasses. black and beige, brown gradient lenses. they don't block the sun, they fix the plot.</p>
        <div class="rz" id="rz">
            <div class="rz-scene rz-base">${ROMANCE[0].svg}</div>
            <div class="rz-rig" id="rz-rig" aria-hidden="true">
                <div class="rz-lens"><div class="rz-scene">${ROMANCE[0].svg}</div></div><span class="rz-bridge"></span><div class="rz-lens"><div class="rz-scene">${ROMANCE[0].svg}</div></div>
            </div>
            <span class="rz-hint hand" id="rz-hint">drag my sunglasses around ↔</span>
        </div>
        <div class="rz-caps">
            <p class="rz-cap plain" id="rz-plain">${ROMANCE[0].plain}</p>
            <p class="rz-cap rom hand" id="rz-rom">${ROMANCE[0].rom}</p>
        </div>
        <p>I romanticize everything. A cold coffee, a traffic jam, a rainy walk to class in the wrong shoes. Nothing about the day actually changes. I just pick the version worth looking at.</p>
        <div class="row"><button class="btn solid" type="button" id="shades">Put them on</button> <button class="btn" type="button" id="rz-next">another moment →</button></div>
        <p class="shades-note" id="shades-note"></p>`,

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
        <div class="mbp" id="mbp" hidden><div class="mbp-screen" id="mbp-screen"><div class="desktop" id="desktop">
            <div class="menubar mono"><span></span><span id="lap-clock"></span></div>
            <div class="dfolders">${FOLDERS.map(([n], i) => `<button type="button" class="dfolder" data-f="${i}">
                <svg viewBox="0 0 100 78" aria-hidden="true"><path d="M4 12 a6 6 0 0 1 6 -6 h26 l8 8 h46 a6 6 0 0 1 6 6 v4 H4z" fill="#4E9BE0"/><rect x="4" y="18" width="92" height="56" rx="7" fill="#7EC4F5"/><rect x="4" y="18" width="92" height="56" rx="7" fill="none" stroke="#5FA9E6" stroke-width="1.2"/><path d="M8 66 h84 M8 69 h84" stroke="#6BB4EC" stroke-width="1"/></svg>
                <span>${n}</span></button>`).join('')}</div>
            <div class="fwin" id="fwin" hidden>
                <div class="fwin-bar"><span class="fwin-tl"><button type="button" id="fwin-x" aria-label="Close this window"></button><i></i><i></i></span><b id="fwin-title"></b></div>
                <div class="fwin-body"><nav class="fwin-side">${FOLDERS.map(([n], i) => `<button type="button" data-side="${i}">${n}</button>`).join('')}</nav><div class="fwin-main" id="fwin-main"></div></div>
            </div>
            <div class="dock" aria-label="Apps on my laptop"><button type="button" class="dock-app" data-say="everything lives in a folder. allegedly." aria-label="Finder" title="Finder"><span style="background:#5AA9F0"><svg viewBox="0 0 40 40"><path d="M14 10 h12 v20 h-12z" fill="#fff" opacity=".9"/><path d="M20 10 v20" stroke="#2B6CB0" stroke-width="1.6"/><circle cx="16.5" cy="17" r="1.2" fill="#2B6CB0"/><circle cx="23.5" cy="17" r="1.2" fill="#2B6CB0"/><path d="M15 24 q5 3 10 0" fill="none" stroke="#2B6CB0" stroke-width="1.4"/></svg></span><i>Finder</i></button><button type="button" class="dock-app" data-say="37 tabs open. all of them important." aria-label="Chrome" title="Chrome"><span style="background:#ffffff"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="11" fill="#E8453C"/><path d="M20 20 L31 20 A11 11 0 0 1 14.5 29.5Z" fill="#F7C344"/><path d="M20 20 L14.5 29.5 A11 11 0 0 1 9 20 A11 11 0 0 1 14.5 10.5Z" fill="#34A853"/><circle cx="20" cy="20" r="5" fill="#4285F4" stroke="#fff" stroke-width="2"/></svg></span><i>Chrome</i></button><button type="button" class="dock-app" data-say="screenshots of things i’ll “look at later.”" aria-label="Photos" title="Photos"><span style="background:#ffffff"><svg viewBox="0 0 40 40"><g opacity=".9"><ellipse cx="20" cy="13" rx="4" ry="7" fill="#F7C344"/><ellipse cx="27" cy="20" rx="7" ry="4" fill="#E8453C"/><ellipse cx="20" cy="27" rx="4" ry="7" fill="#4285F4"/><ellipse cx="13" cy="20" rx="7" ry="4" fill="#34A853"/></g></svg></span><i>Photos</i></button><button type="button" class="dock-app" data-say="color-coded. every hour. yes, really." aria-label="Calendar" title="Calendar"><span style="background:#ffffff"><svg viewBox="0 0 40 40"><rect x="9" y="9" width="22" height="22" rx="3" fill="#fff" stroke="#ddd"/><text x="20" y="15.5" text-anchor="middle" font-size="5" fill="#E8453C" font-family="system-ui">WED</text><text x="20" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="#222" font-family="system-ui">30</text></svg></span><i>Calendar</i></button><button type="button" class="dock-app" data-say="ideas at 2 a.m." aria-label="Notes" title="Notes"><span style="background:#FFD54F"><svg viewBox="0 0 40 40"><rect x="10" y="9" width="20" height="22" rx="3" fill="#fff"/><path d="M13 16 h14 M13 21 h14 M13 26 h9" stroke="#ccc" stroke-width="1.6"/></svg></span><i>Notes</i></button><button type="button" class="dock-app" data-say="where every case study deck is born." aria-label="Keynote" title="Keynote"><span style="background:#3D8BF0"><svg viewBox="0 0 40 40"><path d="M13 28 h14 M20 28 v-5" stroke="#fff" stroke-width="2"/><rect x="11" y="11" width="18" height="12" rx="2" fill="#fff"/></svg></span><i>Keynote</i></button><button type="button" class="dock-app" data-say="where this website was built." aria-label="VS Code" title="VS Code"><span style="background:#2A7FD4"><svg viewBox="0 0 40 40"><path d="M27 10 L15 20 L27 30 Z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><path d="M15 20 L11 17 M15 20 L11 23" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg></span><i>VS Code</i></button><button type="button" class="dock-app" data-say="git push. pray." aria-label="Terminal" title="Terminal"><span style="background:#1E1E1E"><svg viewBox="0 0 40 40"><path d="M12 15 l5 5 -5 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M19 26 h9" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg></span><i>Terminal</i></button><button type="button" class="dock-app" data-say="mostly amaira. and my mom. mostly amaira." aria-label="Messages" title="Messages"><span style="background:#34C759"><svg viewBox="0 0 40 40"><path d="M10 19 c0 -6 5 -9 10 -9 s10 3 10 9 -5 9 -10 9 c-1.5 0 -3 -.3 -4.2 -.8 L11 30 l1.4 -4 C11 24 10 21.6 10 19z" fill="#fff"/></svg></span><i>Messages</i></button><button type="button" class="dock-app" data-say="the one helping me build this bag." aria-label="Claude" title="Claude"><span style="background:#D97757"><svg viewBox="0 0 40 40"><g stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M20 20 L29.0 20.0"/><path d="M20 20 L27.8 24.5"/><path d="M20 20 L24.5 27.8"/><path d="M20 20 L20.0 29.0"/><path d="M20 20 L15.5 27.8"/><path d="M20 20 L12.2 24.5"/><path d="M20 20 L11.0 20.0"/><path d="M20 20 L12.2 15.5"/><path d="M20 20 L15.5 12.2"/><path d="M20 20 L20.0 11.0"/><path d="M20 20 L24.5 12.2"/><path d="M20 20 L27.8 15.5"/></g></svg></span><i>Claude</i></button><button type="button" class="dock-app" data-say="inbox zero is a myth." aria-label="Mail" title="Mail"><span style="background:#3D8BF0"><svg viewBox="0 0 40 40"><rect x="9" y="12" width="22" height="16" rx="2" fill="#fff"/><path d="M9 13 L20 22 L31 13" fill="none" stroke="#3D8BF0" stroke-width="1.8"/></svg></span><i>Mail</i></button></div>
        </div></div><div class="mbp-base"><span class="mbp-notch"></span></div></div>
        <div class="row" style="justify-content:center; margin-top:14px"><button class="btn" type="button" id="lap-close" hidden>Close the laptop</button></div>`,

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
        <p class="note">chanel miroir double facettes: a regular mirror in the lid, a magnifying one below. yes, the blair waldorf one. it lives in my sunglasses pocket, because i’m a very self-reflective person.</p>
        <p>I’m Suhani. I study Management Information Systems and Psychology at UT Austin’s McCombs School of Business. I study why people choose what they choose, then build what they’d choose.</p>
        <p>I’m also a published children’s book author, the founder of two Girls Who Code chapters, and a digital artist who paints about growing up between two worlds.</p>
        <div class="row"><a class="btn solid" href="https://suhanitiwari.com" target="_blank" rel="noopener">My portfolio ↗</a></div>
        <p class="hand" style="font-size:1.5rem; color:var(--plum); margin:16px 0 0">you know you love me. xoxo ♡</p>`,

    stanley: () => `
        <h2>My pink <em>Stanley</em></h2>
        <p class="note">the all day slim bottle, in the bow print. do i drink enough water? no.</p>
        <div class="stan-big" id="stan-big" role="button" tabindex="0" aria-label="My Stanley: tap the lid to unscrew it">${ITEMS.find(i => i.id === 'stanley').art.replace(/(<rect x="21" y="6"[^>]*\/>)/, '<g class="lid">$1</g>')}</div>
        <p class="hand stan-say" id="stan-say">tap the lid to take it off</p>
        <p class="mono" style="color:var(--plum); margin:18px 0 8px">Today’s water, honestly</p>
        <div class="cups" id="cups" style="display:flex; gap:8px; flex-wrap:wrap">${Array.from({ length: 8 }, (_, i) => `<span class="cup${i < 2 ? ' full' : ''}" style="width:34px; height:44px; border:2.5px solid var(--ink); border-radius:4px 4px 10px 10px; background:${i < 2 ? 'var(--pink)' : 'var(--paper)'}; transition:background .4s"></span>`).join('')}</div>
        <p class="hand" id="cup-note" style="font-size:1.4rem; color:var(--plum); margin:10px 0 0">2 of 8. we’re working on it.</p>
        <div class="row"><button class="btn solid" type="button" id="sip">Take a sip for me</button></div>`,

    sweater: () => `
        <h2>My pink Ralph Lauren <em>cable knit</em></h2>
        <p class="note">pink, cable knit, always in my bag. i get cold easily.</p>
        <svg class="sw2" id="sw" data-f="3" viewBox="0 0 360 300" role="button" tabindex="0" aria-label="My pink cable knit V-neck sweater. Tap to fold or unfold it, one step at a time">
            <defs><pattern id="cable2" width="40" height="28" patternUnits="userSpaceOnUse"><rect width="40" height="28" fill="#F3A9BB"/><path d="M6 0 C14 7 14 7 6 14 C14 21 14 21 6 28 M14 0 C6 7 6 7 14 14 C6 21 6 21 14 28" fill="none" stroke="#D9849C" stroke-width="2.6"/><path d="M30 0 L38 14 L30 28 M30 0 L22 14 L30 28" fill="none" stroke="#DE8CA2" stroke-width="2.2"/><path d="M19 0 v28" stroke="#E395A9" stroke-width="1.6" stroke-dasharray="2 2"/></pattern>
                <pattern id="rib2" width="6" height="10" patternUnits="userSpaceOnUse"><rect width="6" height="10" fill="#E996AB"/><path d="M3 0 v10" stroke="#D27C93" stroke-width="2"/></pattern></defs>
            <!-- sleeves and the bottom sit behind the front, so they fold under it, not over it -->
            <g class="sl sl-l"><path d="M100 46 L100 126 L66 244 L36 236 L76 54 Q86 42 100 46 Z" fill="url(#cable2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/><path d="M66 244 L36 236 L30 258 L60 266 Z" fill="url(#rib2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round" stroke-width="2.4"/></g>
            <g class="sl sl-r"><path d="M260 46 L260 126 L294 244 L324 236 L284 54 Q274 42 260 46 Z" fill="url(#cable2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/><path d="M294 244 L324 236 L330 258 L300 266 Z" fill="url(#rib2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round" stroke-width="2.4"/></g>
            <g class="bot"><path d="M100 164 V254 H260 V164" fill="url(#cable2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/><rect x="100" y="250" width="160" height="24" rx="3" fill="url(#rib2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round" stroke-width="2.4"/></g>
            <path class="top" d="M100 170 L100 46 Q100 30 116 28 L150 22 L180 72 L210 22 L244 28 Q260 30 260 46 L260 170" fill="url(#cable2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/>
            <path d="M150 22 L180 72 L210 22 L200 20 L180 56 L160 20 Z" fill="url(#rib2)" stroke="#3A2626" stroke-width="3" stroke-linejoin="round" stroke-width="2"/>
            <path d="M162 20 L180 54 L198 20 Z" fill="#FBEFF2"/>
            <path class="sw-edge" d="M100 170 H260" stroke="#3A2626" stroke-width="3" stroke-linecap="round"/>
            <path d="M214 50 q3 -5 8 -5 l3 -3 2 1 -2 2 q2 2 1 5 M216 50 v3 M223 50 v3" fill="none" stroke="#2C3E7A" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <p class="hand sw-hint" id="sw-hint">folded. tap it three times to unfold ↓</p>
        <p>It’s 100 degrees in Austin and 62 in every single classroom. The sweater comes to class, the library and every restaurant with the AC turned all the way up.</p>
        <div class="row"><button class="btn" type="button" id="sw-fold">Unfold it</button><button class="btn solid" type="button" id="wear">Put it on</button></div>`,

    nb1: () => `
        <h2>My <em>Erin Condren</em> notebook</h2>
        <p class="note">the blue one. my classes live here. yes, i still take notes by hand.</p>
        <div class="ecb-row"><div class="ecb" data-ecb>
                <div class="ecb-page ec-page"><p class="hand ec-h">my classes</p><ul class="hand">
                    <li>Web App Development</li><li>Full-Stack Web App Development</li><li>Database Management</li>
                    <li>Problem Solving &amp; Programming</li><li>Strategic IT Management</li><li>Intro to IT Management</li>
                    <li>Intro to Data Science</li><li>Intro to Decision Science</li><li>Statistics for Business</li>
                </ul></div>
                <div class="ecb-cover"><div class="ecb-front">${window.EC([['#5B83C0', '#F4E6EE'], ['#FBEFF3', '#D64F8C'], ['#D44E8C', '#F4C9DA'], ['#FBEFF3', '#5B83C0']])}</div><div class="ecb-back"></div></div></div>
        <p class="hand" style="text-align:center; color:var(--plum); margin:6px 0 10px">tap it to open. tap again to close.</p>`,
    nb2: () => `
        <h2>My <em>Erin Condren</em> notebook</h2>
        <p class="note">the pink one.</p>
        <div class="ecb-row"><div class="ecb" data-ecb>
                <div class="ecb-page ec-page"><p class="hand ec-h">notebook no. 2</p><p><span class="todo">what’s in this one?</span></p></div>
                <div class="ecb-cover"><div class="ecb-front">${window.EC([['#E0568F', '#F7D5E2'], ['#FBE6EC', '#8DA0C2'], ['#8EA2C4', '#EEF1F8'], ['#FBE6EC', '#E0568F']])}</div><div class="ecb-back"></div></div>
            </div>
        </div>
        <p class="hand" style="text-align:center; color:var(--plum); margin:6px 0 10px">tap it to open. tap again to close.</p>`,

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
        <p class="note">where i go to wonder, study and make things. every app answers a question about me.</p>
        <div class="ipad-flat">
            <span class="ipad-pencil" aria-hidden="true"></span>
        <div class="ipad-big"><div class="ipad-screen">
            <div class="ipad-home" id="ipad-home">
                <button type="button" class="papp" data-ip="pinterest"><span class="ic" style="background:#E60023"><svg viewBox="0 0 40 40"><path d="M20 9 c-8 0 -11 6 -9 10 c1 2 2 2 2 1 c-1 -3 1 -7 7 -7 c5 0 6 3 5 6 c-1 4 -3 5 -5 5 c-2 0 -2 -2 -1 -3 l1 -4 m0 0 l-3 12" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg></span>Pinterest</button>
                <button type="button" class="papp" data-ip="procreate"><span class="ic" style="background:#1B1B1F"><svg viewBox="0 0 40 40"><path d="M10 30 c6 -2 10 -10 18 -20 c2 -3 6 0 4 3 c-8 10 -12 16 -20 19z" fill="#F4A7B9"/><circle cx="11" cy="30" r="3" fill="#B9A3E8"/></svg></span>Procreate</button>
                <button type="button" class="papp" data-ip="safari"><span class="ic" style="background:#FFFFFF"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="#2F8CF0"/><circle cx="20" cy="20" r="11" fill="none" stroke="#fff" stroke-width=".8" stroke-dasharray="1 2.1"/><path d="M27 13 L22 22 L13 27 L18 18Z" fill="#fff"/><path d="M27 13 L22 22 L18 18Z" fill="#E8453C"/></svg></span>Safari</button>
                <button type="button" class="papp" data-ip="chatgpt"><span class="ic" style="background:#FFFFFF"><svg viewBox="0 0 40 40"><g fill="none" stroke="#111" stroke-width="2.2"><ellipse cx="20" cy="15.5" rx="4.6" ry="7.4" transform="rotate(0 20 20)"/><ellipse cx="20" cy="15.5" rx="4.6" ry="7.4" transform="rotate(60 20 20)"/><ellipse cx="20" cy="15.5" rx="4.6" ry="7.4" transform="rotate(120 20 20)"/><ellipse cx="20" cy="15.5" rx="4.6" ry="7.4" transform="rotate(180 20 20)"/><ellipse cx="20" cy="15.5" rx="4.6" ry="7.4" transform="rotate(240 20 20)"/><ellipse cx="20" cy="15.5" rx="4.6" ry="7.4" transform="rotate(300 20 20)"/></g></svg></span>ChatGPT</button>
                <button type="button" class="papp" data-ip="github"><span class="ic" style="background:#1B1F24"><svg viewBox="0 0 40 40"><path d="M20 8 a12 12 0 0 0 -3.8 23.4 c.6 .1 .8 -.3 .8 -.6 v-2.2 c-3.3 .7 -4 -1.4 -4 -1.4 -.6 -1.4 -1.3 -1.8 -1.3 -1.8 -1.1 -.7 .1 -.7 .1 -.7 1.2 .1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1 -.8 .4 -1.3 .8 -1.6 -2.7 -.3 -5.5 -1.3 -5.5 -5.9 0 -1.3 .5 -2.4 1.2 -3.2 -.1 -.3 -.5 -1.5 .1 -3.2 0 0 1 -.3 3.3 1.2 a11.5 11.5 0 0 1 6 0 c2.3 -1.5 3.3 -1.2 3.3 -1.2 .7 1.7 .2 2.9 .1 3.2 .8 .8 1.2 1.9 1.2 3.2 0 4.6 -2.8 5.6 -5.5 5.9 .4 .4 .8 1.1 .8 2.2 v3.3 c0 .3 .2 .7 .8 .6 A12 12 0 0 0 20 8z" fill="#fff"/></svg></span>GitHub</button>
                <button type="button" class="papp" data-ip="canvas"><span class="ic" style="background:#E72429"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="6" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="31.0" cy="20.0" r="1.8" fill="#fff"/><circle cx="27.8" cy="27.8" r="1.8" fill="#fff"/><circle cx="20.0" cy="31.0" r="1.8" fill="#fff"/><circle cx="12.2" cy="27.8" r="1.8" fill="#fff"/><circle cx="9.0" cy="20.0" r="1.8" fill="#fff"/><circle cx="12.2" cy="12.2" r="1.8" fill="#fff"/><circle cx="20.0" cy="9.0" r="1.8" fill="#fff"/><circle cx="27.8" cy="12.2" r="1.8" fill="#fff"/></svg></span>Canvas</button>
            </div>
            <div class="ipad-view" id="ipad-view" hidden></div>
        </div></div>
        </div>`,

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
                    <button type="button" class="papp" data-app="notes"><span class="ic ic-notes"><svg viewBox="0 0 40 40"><rect x="7" y="7" width="26" height="26" rx="4" fill="#fff"/><rect x="7" y="7" width="26" height="8" rx="4" fill="#F7C744"/><rect x="7" y="11" width="26" height="4" fill="#F7C744"/><path d="M12 21 h16 M12 26 h16 M12 31 h10" stroke="#C9C6BE" stroke-width="1.6"/></svg></span>Notes</button>
                    <button type="button" class="papp" data-app="maps"><span class="ic" style="background:#FFFFFF"><svg viewBox="0 0 40 40"><rect x="5" y="5" width="30" height="30" rx="4" fill="#E6F1DC"/><path d="M5 24 L35 14" stroke="#F6D785" stroke-width="4"/><path d="M18 5 L24 35" stroke="#fff" stroke-width="3"/><path d="M27 9 c-4 0 -6 3 -6 6 c0 4 6 10 6 10 s6 -6 6 -10 c0 -3 -2 -6 -6 -6z" fill="#E8453C"/><circle cx="27" cy="15" r="2" fill="#fff"/></svg></span>Maps</button>
                    <button type="button" class="papp" data-app="messages"><span class="ic" style="background:#34C759"><svg viewBox="0 0 40 40"><path d="M8 19 c0 -6 5.5 -9.5 12 -9.5 s12 3.5 12 9.5 -5.5 9.5 -12 9.5 c-1.6 0 -3.1 -.2 -4.5 -.7 L9.5 31 l1.6 -4.6 C9 24.6 8 22 8 19z" fill="#fff"/></svg></span>Messages</button>
                    <button type="button" class="papp" data-app="camera"><span class="ic" style="background:#D9D9DC"><svg viewBox="0 0 40 40"><rect x="7" y="13" width="26" height="17" rx="4" fill="#3A383C"/><rect x="14" y="10" width="9" height="4" rx="1.5" fill="#3A383C"/><circle cx="20" cy="21.5" r="6" fill="#5B5960" stroke="#E8E8EA" stroke-width="2"/><circle cx="28.5" cy="16.5" r="1.3" fill="#F5C542"/></svg></span>Camera</button>
                    <button type="button" class="papp" data-app="clock"><span class="ic" style="background:#111111"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="#fff"/><path d="M20 11 V20 L26 23" stroke="#111" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M20 20 L13 14" stroke="#F29B38" stroke-width="1.3"/><circle cx="20" cy="20" r="1.6" fill="#F29B38"/></svg></span>Clock</button>
                    <button type="button" class="papp" data-app="gmail"><span class="ic" style="background:#FFFFFF"><svg viewBox="0 0 40 40"><path d="M8 13 v15 h5 V18 l7 5.5 7 -5.5 v10 h5 V13 l-3 -2 -9 7 -9 -7z" fill="#EA4335"/><path d="M8 13 v15 h5 V18z" fill="#4285F4"/><path d="M27 18 v10 h5 V13z" fill="#34A853"/><path d="M29 11 l3 2 v0 l-5 4z" fill="#FBBC04"/></svg></span>Gmail</button>
                    <button type="button" class="papp" data-app="wallet"><span class="ic" style="background:#111111"><svg viewBox="0 0 40 40"><rect x="8" y="10" width="24" height="7" rx="2" fill="#4285F4"/><rect x="8" y="14" width="24" height="7" rx="2" fill="#F7C344"/><rect x="8" y="18" width="24" height="7" rx="2" fill="#34A853"/><path d="M7 22 h26 v8 a3 3 0 0 1 -3 3 h-20 a3 3 0 0 1 -3 -3z" fill="#E9E5DE"/></svg></span>Wallet</button>
                    <button type="button" class="papp" data-app="findmy"><span class="ic" style="background:#2BB24C"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="none" stroke="#fff" stroke-width="2"/><circle cx="20" cy="20" r="7" fill="none" stroke="#fff" stroke-width="2"/><circle cx="20" cy="20" r="2.6" fill="#fff"/></svg></span>Find My</button>
                    <button type="button" class="papp" data-app="settings"><span class="ic" style="background:#8E8E93"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="11" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="3.4 2.4"/><circle cx="20" cy="20" r="7.5" fill="#8E8E93" stroke="#fff" stroke-width="2.4"/><circle cx="20" cy="20" r="2.5" fill="#fff"/></svg></span>Settings</button>
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
            [`<div class="pb-page pb-cover">${ITEMS.find(i => i.id === 'passport').cover}</div>`,
             `<div class="pb-page pb-plain"><div class="pb-rot"><div class="pp-page pp-sign-l"><span class="pp-guil"></span><span class="pp-endorse">Endorsements</span><span class="pp-ghost"><img src="assets/img/me.jpg" alt=""></span><span class="pp-sig">Suhani Tiwari</span><span class="pp-sigline">SIGNATURE OF BEARER</span></div></div></div>`],
            [`<div class="pb-page pb-plain"><div class="pb-rot"><div class="pp-page pp-data"><span class="pp-guil"></span>
                <span class="pp-hd"><span class="pp-word">PASSPORT<small>PASSEPORT / PASAPORTE</small></span><b class="pp-us">THE UNITED STATES OF AMERICA</b></span>
                <span class="pp-usa">USA</span><span class="pp-photo"><img src="assets/img/me.jpg" alt=""></span>
                <span class="pp-fields"><span><i>Type</i> <b>window seat. non-negotiable.</b></span><span><i>Passport No.</i> <b>nice try ♡</b></span><span><i>Surname</i> <b>TIWARI</b></span><span><i>Given names</i> <b>SUHANI M</b></span><span><i>Nationality</i> <b>UNITED STATES OF AMERICA</b></span><span><i>Date of birth</i> <b>a lady never tells</b></span><span><i>Issued by</i> <b>my wanderlust</b></span><span><i>Countries</i> <b>6, and that’s rookie numbers</b></span><span><i>Expires</i> <b>never. never stop traveling.</b></span></span>
                <span class="pp-trail">✈ · · · · · · · never stop traveling</span></div></div></div>`,
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
        <button type="button" class="pb-tucked" id="pb-tucked" aria-label="The boarding pass tucked inside my passport: pull it out">${ITEMS.find(i => i.id === 'boarding').art}<span class="hand">tucked inside: a boarding pass. pull it out ↗</span></button>`;
    },

    sanitizer: () => `
        <h2>Cozy Vanilla <em>Almond</em></h2>
        <p class="note">the hand sanitizer that lives in my caramel frappuccino charm. go ahead, squirt some.</p>
        <div class="sani" id="sani">
            <button type="button" class="sani-charm" id="sani-charm" aria-label="Squeeze the hand sanitizer">${BAG.charm}</button>
            <svg class="sani-hand" viewBox="0 0 300 170" aria-hidden="true"><defs><linearGradient id="sani-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8D3BC"/><stop offset=".6" stop-color="#EDB496"/><stop offset="1" stop-color="#E2A083"/></linearGradient><radialGradient id="sani-cup" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FBE3D4"/><stop offset="1" stop-color="#FBE3D4" stop-opacity="0"/></radialGradient></defs><path d="M0 120 C30 104 60 92 90 84 C100 80 110 76 122 76 C140 76 156 80 170 82 C182 80 192 74 200 70 C206 67 212 70 208 76 C200 86 186 92 176 96 C196 92 220 82 244 72 C250 69 256 70 254 76 C240 90 220 102 200 110 C224 104 248 94 266 88 C272 86 276 90 271 95 C254 108 232 118 206 122 C228 120 248 114 262 110 C268 109 270 114 265 117 C248 126 228 132 204 134 C220 134 236 132 246 131 C251 131 251 136 247 138 C232 144 212 146 194 146 C170 150 146 150 128 146 C110 142 98 140 86 142 C60 148 30 160 10 170 L0 170 Z" fill="url(#sani-skin)" stroke="#D39A80" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="156" cy="104" rx="44" ry="15" fill="url(#sani-cup)"/><path d="M200 110 C190 113 182 114 174 113 M206 122 C196 124 186 124 178 122 M204 134 C194 136 184 136 176 134 M176 96 C168 100 160 101 150 100" fill="none" stroke="#D39A80" stroke-width="1.2" stroke-linecap="round" opacity=".8"/><g fill="#F7C6CB" stroke="#E3A3AA" stroke-width=".8"><ellipse cx="249" cy="73.5" rx="4.6" ry="2.6" transform="rotate(-28 249 73.5)"/><ellipse cx="268" cy="90.5" rx="4.4" ry="2.5" transform="rotate(-22 268 90.5)"/><ellipse cx="264" cy="112.5" rx="4" ry="2.4" transform="rotate(-16 264 112.5)"/><ellipse cx="246" cy="134" rx="3.4" ry="2.2" transform="rotate(-10 246 134)"/><ellipse cx="205" cy="71.5" rx="3.4" ry="2.2" transform="rotate(-34 205 71.5)"/></g><ellipse id="sani-pool" cx="156" cy="104" rx="0" ry="0" fill="#EAF6FF" stroke="#B9D6EC" stroke-width="1.5" opacity=".9"/><ellipse id="sani-shine" cx="150" cy="101" rx="0" ry="0" fill="#fff"/></svg>
        </div>
        <div class="row" style="justify-content:center"><button class="btn solid" type="button" id="sani-go">Squirt some</button><button class="btn" type="button" id="sani-rub" hidden>Rub it in</button></div>`
};

function penView({ title, note, list, front, pen, pick }) {
    return `
        <h2>${title}</h2>
        <p class="note">${note}</p>
        <div class="pouch-scene">
            <div class="pens${list.length > 12 ? ' many' : ''}" id="pens" data-pick="${pick}" style="--step:${Math.min(11, 150 / Math.max(1, list.length - 1))}deg">${list.map((p, i) => `
                <button class="pen" type="button" style="--i:${i}; --mid:${(list.length - 1) / 2}" data-pen="${i}" aria-label="${p.name}">
                    ${pen(p.c, p)}<span class="lbl">${p.name}</span>
                </button>`).join('')}</div>
            <div class="pouch-front${list === PENS ? ' tele-front' : ' cc-front'}" id="pouch-front">${front}</div>
        </div>
        ${list === GELPENS_AND_PENCILS ? '<div class="row" style="justify-content:center; margin-top:4px"><button class="btn" type="button" id="cc-btn">Unzip it</button></div>' : ''}
        ${list === PENS ? '<div class="row" style="justify-content:center; margin-top:4px"><button class="btn" type="button" id="tele-btn">Push it down</button></div>' : ''}
        <p class="pen-note" id="pen-note" aria-live="polite">unzipping…</p>
        ${list === GELPENS_AND_PENCILS ? `<div class="desk">
            <div class="desk-tools">
                <button type="button" class="dtool" data-tool="eraser" aria-label="My Tombow MONO eraser: erases pencil only">${MONO_SVG}<span>mono eraser</span></button>
                <button type="button" class="dtool" data-tool="whiteout" aria-label="My pink Alopuxi correction tape: covers pen">${WHITEOUT_SVG}<span>correction tape</span></button>
                <button type="button" class="desk-erase btn" id="desk-erase" hidden>Erase</button>
                <button type="button" class="desk-clear" id="desk-clear">new page</button>
            </div>
            <div class="pad desk-pad" id="desk-pad"><canvas id="ink-canvas" aria-hidden="true"></canvas><canvas id="graphite-canvas" aria-label="Notebook page: draw with the pen or pencil you picked"></canvas><span class="pad-hint" id="desk-hint">pick a pen or pencil, then draw here…</span></div>
            <p class="mono desk-now" id="desk-now">holding: nothing yet</p>
        </div>` : ''}`;
}


/* my four bank cards are vertical designs, so they sit sideways in the wallet slots, like the real ones.
   Names and colors match mine; no numbers, no logos. */
const VC_CHIP = (x, y) => `<rect x="${x}" y="${y}" width="10" height="8" rx="1.6" fill="#E3C46E" stroke="#8A6A2A" stroke-width=".5"/><path d="M${x} ${y + 4} h10 M${x + 5} ${y} v8" stroke="#A88A3E" stroke-width=".4"/>`;
const VC_TAP = (x, y, c) => `<path d="M${x} ${y} q2 2.5 0 5 M${x + 2} ${y - 1} q3 3.5 0 7 M${x + 4} ${y - 2} q4 4.5 0 9" fill="none" stroke="${c}" stroke-width=".8" stroke-linecap="round"/>`;
const BOFA_FLAG = (x, y, c, w = 1) => `<g transform="translate(${x} ${y}) scale(${w})" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"><path d="M0 6 l5 -6 h9"/><path d="M3 9 l5 -6 h9"/><path d="M6 12 l5 -6 h9"/></g>`;
const VCARD = {
    amexblue: `<svg viewBox="0 0 54 86" preserveAspectRatio="none"><defs><linearGradient id="vab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1650C0"/><stop offset=".5" stop-color="#2A7BE0"/><stop offset="1" stop-color="#174CB6"/></linearGradient><radialGradient id="vabm" cx=".45" cy=".45" r=".6"><stop offset="0" stop-color="#7DB8F2"/><stop offset="1" stop-color="#2F7FDC"/></radialGradient></defs>
        <rect width="54" height="86" fill="url(#vab)"/>
        <circle cx="25" cy="42" r="27" fill="url(#vabm)" opacity=".85"/><circle cx="25" cy="42" r="27" fill="none" stroke="#BFE0FB" stroke-width=".5" opacity=".8"/><circle cx="25" cy="42" r="24" fill="none" stroke="#BFE0FB" stroke-width=".3" opacity=".6"/>
        <g fill="#1F63C9" opacity=".8"><path d="M10 64 c-1 -10 2 -18 9 -21 c0 -9 7 -16 16 -15 c4 0 7 2 9 5 c-4 -1 -7 0 -8 2 c4 1 6 4 5 8 c-2 -2 -4 -2 -6 -1 c2 3 2 6 0 9 c3 1 4 4 2 7 c-3 -1 -5 0 -6 2 c-2 3 -4 4 -7 4z"/><path d="M22 30 c2 -7 9 -11 17 -9 c-6 1 -10 4 -12 8z"/></g>
        <path d="M17 45 c3 -1 6 0 7 2 M18 50 c2 0 4 1 5 3" fill="none" stroke="#9CCBF7" stroke-width=".6" opacity=".7"/>
        ${VC_CHIP(32, 9)}<text transform="translate(8 9) rotate(90)" font-family="Instrument Sans" font-size="3.8" fill="#EAF3FF" letter-spacing=".5">SUHANI TIWARI</text>
        <text transform="translate(48 50) rotate(90)" font-family="Instrument Sans" font-weight="800" font-size="4.4" fill="#fff" letter-spacing=".3">AMERICAN</text><text transform="translate(43 50) rotate(90)" font-family="Instrument Sans" font-weight="800" font-size="4.4" fill="#fff" letter-spacing=".55">EXPRESS</text>
        <text x="8" y="80" font-family="Instrument Sans" font-size="3" fill="#EAF3FF">25</text>${VC_TAP(30, 76, '#EAF3FF')}</svg>`,
    amexgold: `<svg viewBox="0 0 54 86" preserveAspectRatio="none"><defs><linearGradient id="vag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B9953F"/><stop offset=".45" stop-color="#E6CC7E"/><stop offset="1" stop-color="#AE8833"/></linearGradient></defs>
        <rect width="54" height="86" fill="url(#vag)"/><path d="M0 0 H34 L0 52Z" fill="#fff" opacity=".2"/><path d="M34 0 H54 V28 L10 86 H0 V52Z" fill="#8A6A2A" opacity=".1"/>
        ${VC_CHIP(33, 13)}<text transform="translate(8 6) rotate(90)" font-family="Instrument Sans" font-size="3.8" fill="#3A2C10" letter-spacing=".5">SUHANI TIWARI</text>
        <text transform="translate(47 30) rotate(90)" font-family="Instrument Sans" font-weight="800" font-size="4.4" fill="#2A200C" letter-spacing=".3">AMERICAN EXPRESS</text>
        <path d="M41 30 l3 -4.5 3 4.5z" fill="#C0272D" transform="translate(-2 0)"/><text transform="translate(41 33) rotate(90)" font-family="Instrument Sans" font-weight="700" font-size="3.2" fill="#2A200C">DELTA</text>
        <text transform="translate(41 47) rotate(90)" font-family="Instrument Sans" font-size="5" fill="#2A200C" letter-spacing=".8">SKYMILES</text>
        <text x="8" y="80" font-family="Instrument Sans" font-size="3" fill="#3A2C10">25</text>${VC_TAP(28, 76, '#3A2C10')}</svg>`,
    bofa: `<svg viewBox="0 0 54 86" preserveAspectRatio="none"><defs><linearGradient id="vbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A6AAB1"/><stop offset=".5" stop-color="#E4E6EA"/><stop offset="1" stop-color="#9A9EA6"/></linearGradient></defs>
        <rect width="54" height="86" fill="url(#vbg)"/><path d="M0 34 L54 14 V26 L0 46Z" fill="#fff" opacity=".22"/><path d="M54 30 L20 86 H40 L54 62Z" fill="#7E838B" opacity=".28"/><path d="M0 60 L28 86 H12 L0 74Z" fill="#fff" opacity=".18"/>
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
        <button class="card dl tx" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <svg class="tx-bg" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M8 2 h22 v26 l18 6 l14 -4 l10 4 v22 l-4 10 l-10 6 l-12 14 l-6 16 l-10 -2 l-10 -14 l-6 -12 l-8 -6 l-6 6 l-10 -6 l-6 -10 l4 -6 h10 Z" transform="translate(70 18) scale(.95)" fill="#F4B9C3" opacity=".55"/>
                <path d="M0 70 q40 -10 80 6 t80 -4 V100 H0Z" fill="#C9D3F0" opacity=".45"/>
                <g fill="none" stroke="#9FB0E0" stroke-width=".35" opacity=".6"><path d="M0 20 q40 10 80 0 t80 0"/><path d="M0 26 q40 10 80 0 t80 0"/><path d="M0 32 q40 10 80 0 t80 0"/></g>
            </svg>
            <svg class="tx-seal" viewBox="0 0 90 110" aria-hidden="true"><path d="M8 2 h22 v26 l18 6 l14 -4 l10 4 v22 l-4 10 l-10 6 l-12 14 l-6 16 l-10 -2 l-10 -14 l-6 -12 l-8 -6 l-6 6 l-10 -6 l-6 -10 l4 -6 h10 Z" fill="none" stroke="#D9B45A" stroke-width="2.5"/><circle cx="40" cy="44" r="13" fill="#E6C66E" stroke="#C99A3A" stroke-width="1.5"/><path d="M40 35 l2.6 6 6.4 .5 -4.9 4.2 1.5 6.3 -5.6 -3.4 -5.6 3.4 1.5 -6.3 -4.9 -4.2 6.4 -.5z" fill="#FFF7DF"/></svg>
            <span class="tx-head">
                <span class="tx-flag" aria-hidden="true"><b>★</b><i></i><i></i></span>
                <span class="tx-word">Texas<small>USA</small></span>
                <span class="tx-kind">DRIVER LICENSE</span>
            </span>
            <span class="tx-banner">UNDER 21</span>
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
    readers: () => {
        // everything's a blur until the glasses go on
        const t = $('#rg-text'), btn = $('#rg-on');
        btn.onclick = () => {
            const on = t.classList.toggle('sharp');
            btn.textContent = on ? 'Take them off' : 'Put them on';
            btn.setAttribute('aria-pressed', on);
            sheetBody.querySelector('.rg-big').classList.toggle('worn', on);
        };
    },
    haircomb: () => {
        // drag the comb down: everything above it is combed, everything below is still frizz.
        // the comb only goes one way: combed hair never frizzes back up
        const hair = $('#hair'), comb = $('#hair-comb');
        let done = false, drag = false, combed = 0;
        const set = f => {
            f = Math.max(combed, Math.max(0, Math.min(1, f)));
            if (f > .97) f = 1;
            combed = f;
            hair.style.setProperty('--comb', f);
            $('#hair-tag').textContent = f > .97 ? 'after' : f < .03 ? 'before' : 'combing…';
            if (f > .97 && !done) { done = true; $('#hair-note').textContent = 'see? smooth. the comb stays in the bag.'; $('#hair-braid').hidden = false; }
        };
        const at = e => { const r = hair.getBoundingClientRect(); return (e.clientY - r.top) / r.height; };
        hair.style.touchAction = 'none';
        hair.addEventListener('pointerdown', e => { if (hair.classList.contains('braided')) return; drag = true; hair.classList.add('dragging'); try { hair.setPointerCapture(e.pointerId); } catch {} set(at(e)); });
        hair.addEventListener('pointermove', e => { if (drag) set(at(e)); });
        const end = () => { drag = false; hair.classList.remove('dragging'); };
        hair.addEventListener('pointerup', end); hair.addEventListener('pointercancel', end);
        comb.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); set((+hair.style.getPropertyValue('--comb') || 0) + (e.key === 'ArrowDown' ? .1 : -.1)); } };
        comb.onclick = e => { if (e.detail) return; set(1); };
        // combed out, then one long braid for bed. while it's braided the comb stays put.
        $('#hair-braid').onclick = () => {
            const on = hair.classList.toggle('braided');
            $('#hair-tag').textContent = on ? 'braided' : 'after';
            $('#hair-braid').textContent = on ? 'take it down' : 'now braid it';
            $('#hair-note').textContent = on ? 'one long braid for bed.' : 'see? smooth. the comb stays in the bag.';
            hair.querySelector('.hair-braid').setAttribute('aria-hidden', !on);
        };
        set(0);
    },
    headphones: () => {
        // drag my headphones onto me while i study; tap me to take them back off
        const study = $('#study'), hp = $('#study-hp'), say = $('#study-say');
        const on = () => {
            study.classList.add('on'); hp.style.visibility = 'hidden';
            say.textContent = 'noise cancelling: on. do not disturb 🎧';
            const r = study.getBoundingClientRect(); fairyDust(r.left + r.width * .62, r.top + r.height * .25);
            toast('locked in. tap me to take them off.');
        };
        const off = () => { if (!study.classList.contains('on')) return; study.classList.remove('on'); hp.style.visibility = ''; say.textContent = 'headphones off. what did i miss?'; };
        study.onclick = off;
        let g = null, sx = 0, sy = 0, skip = false;
        const over = e => { const r = study.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; };
        hp.addEventListener('pointerdown', e => { e.preventDefault(); sx = e.clientX; sy = e.clientY; g = 'armed'; try { hp.setPointerCapture(e.pointerId); } catch {} });
        hp.addEventListener('pointermove', e => {
            if (!g) return;
            if (g === 'armed') {
                if (Math.hypot(e.clientX - sx, e.clientY - sy) < 6) return;
                g = document.createElement('div'); g.className = 'sk-ghost'; g.style.width = '110px'; g.innerHTML = hp.innerHTML; sheet.appendChild(g); hp.classList.add('held');
            }
            g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px';
            study.classList.toggle('target', over(e));
        });
        const up = e => {
            if (!g) return;
            const was = g; g = null; study.classList.remove('target'); hp.classList.remove('held');
            if (was === 'armed') return;
            was.remove(); skip = true;
            if (over(e)) on(); else say.textContent = 'on my head, please. not the table.';
        };
        hp.addEventListener('pointerup', up); hp.addEventListener('pointercancel', up);
        // a plain tap (or the keyboard) works too
        hp.addEventListener('click', () => { if (skip) { skip = false; return; } on(); });
    },
    jewelry: () => {
        const jw = $('#jw'), say = $('#jw-say');
        jw.addEventListener('click', e => {
            if (!jw.classList.contains('open')) { jw.classList.add('open'); say.textContent = 'pick one up'; return; }
            const slot = e.target.closest('[data-j]'); if (!slot) return;
            const up = !slot.classList.contains('up');
            jw.querySelectorAll('.jw-slot').forEach(x => x.classList.remove('up'));
            if (up) slot.classList.add('up');
            say.textContent = up ? `${slot.dataset.n}. ${slot.dataset.d}` : 'pick one up';
        });
    },
    mailbox: () => {
        const mbx = $('#mbx'), btn = $('#mbx-key');
        btn.onclick = () => {
            if (!mbx.classList.contains('open')) {
                // the gold key slides into the lock, turns, then the door swings open
                mbx.classList.add('insert');
                setTimeout(() => mbx.classList.add('turn'), reduce ? 0 : 650);
                setTimeout(() => { mbx.classList.add('open'); btn.textContent = 'Open the letter'; toast('click. no packages. just… a flood of cards from amaira ♡'); }, reduce ? 0 : 1250);
                setTimeout(() => $('#mf').classList.add('out'), reduce ? 0 : 1550);
            } else if ($('#lc').hidden) {
                $('#lc').hidden = false; mbx.classList.add('taken'); btn.textContent = 'Put it back';
                $('#lc').scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
            } else {
                $('#lc').hidden = true; mbx.classList.remove('taken', 'open', 'turn', 'insert'); $('#mf').classList.remove('out'); $('#mf-view').hidden = true; btn.textContent = 'Turn the key';
            }
        };
        mbx.onclick = () => btn.click();
        // tap a card in the pile to read it
        let at = 0;
        const show = k => { at = (k + MAIL_CARDS.length) % MAIL_CARDS.length; $('#mf-img').src = MAIL_CARDS[at][0]; $('#mf-cap').textContent = MAIL_CARDS[at][1]; $('#mf-n').textContent = `${at + 1} / ${MAIL_CARDS.length}`; $('#mf-view').hidden = false; };
        sheetBody.querySelectorAll('[data-mf]').forEach(c => c.onclick = () => { show(+c.dataset.mf); $('#mf-view').scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); });
        $('#mf-next').onclick = () => show(at + 1); $('#mf-prev').onclick = () => show(at - 1);
        $('#mf-x').onclick = () => { $('#mf-view').hidden = true; };
    },
    skinbag: () => {
        AFTER.makeupbag();
        // my face sticks just under the sheet's title bar (which wraps to two lines on a phone)
        sheetBody.style.setProperty('--bar-h', document.querySelector('.sheet-bar').offsetHeight + 'px');
        setTimeout(() => { const bag = $('#mbag'); if (bag && !bag.classList.contains('open')) $('#mpull').click(); }, reduce ? 0 : 350);
        setTimeout(() => sheetBody.querySelector('#routine li') && sheetBody.querySelector('#routine li').classList.add('now'), 0);
        $('#mpull').setAttribute('aria-label', 'Unzip the skincare pouch');
        const face = $('#face'), applied = new Set();
        let patchesOn = false;
        // everything comes out of the pouch, lined up in the order i put it on; the next step glows
        const stage = () => {
            const n = ROUTINE.findIndex(r => !applied.has(r));
            sheetBody.querySelectorAll('.mk[data-sk]').forEach(b => {
                const i = ROUTINE.indexOf(b.dataset.sk);
                b.classList.toggle('next', i === n && !patchesOn);
            });
        };
        const refresh = () => {
            const N = ROUTINE.length, nx = ROUTINE.find(r => !applied.has(r));
            $('#face-hint').textContent = patchesOn ? 'tap the patches to peel them off ↑' : applied.size >= N ? 'routine done ♡' : `${applied.size} of ${N} done`;
            sheetBody.querySelectorAll('#routine li').forEach(li => { li.classList.toggle('done', applied.has(li.dataset.step) && !(li.dataset.step === 'patches' && patchesOn)); li.classList.toggle('now', patchesOn ? li.dataset.step === 'patches' : li.dataset.step === nx); });
            $('#routine-next').textContent = patchesOn ? 'patches off before the rest. tap them on my face'
                : nx ? `step ${ROUTINE.indexOf(nx) + 1}: ${SKIN_INFO[nx][2]}. tap it in the pouch` : 'night routine done. goodnight ♡';
            stage();
        };
        stage();
        const apply = k => {
            const [fx, line] = SKIN_FX[k];
            // the patches come back off before anything else goes on
            if (k === 'patches' && patchesOn) {
                patchesOn = false; face.querySelector('[data-fx="patches"]').classList.remove('on'); face.classList.remove('patched');
                refresh();
                return toast(`patches off. glowing. now step 2: ${SKIN_INFO[ROUTINE[1]][2]}.`);
            }
            if (patchesOn) return toast('patches off first, babe. tap them on my face.');
            // in order, please
            const next = ROUTINE.find(r => !applied.has(r));
            if (applied.has(k)) return toast('already on ♡');
            if (k !== next) return toast(`not yet, babe. step ${ROUTINE.indexOf(next) + 1} is ${SKIN_INFO[next][2]}.`);
            applied.add(k);
            // only laneige (lips), grandelash (lashes) and the patches change how i look. everything else just sinks in
            if (fx) face.querySelector(`[data-fx="${fx}"]`).classList.add('on');
            else { const r = face.getBoundingClientRect(); fairyDust(r.left + r.width * .42, r.top + r.height * .52); }
            if (k === 'patches') { patchesOn = true; face.classList.add('patched'); }
            if (k === 'lamer') face.classList.add('lamer');   // under-eyes brighter after la mer
            if (k === 'mask') face.classList.add('masked');   // and the eye mask goes on last
            face.classList.remove('pop'); void face.offsetWidth; face.classList.add('pop');
            refresh();
            toast(line);
            // last step done: lights out
            if (applied.size === ROUTINE.length) { clearTimeout(face.zzz); face.zzz = setTimeout(() => toast('and… i’m out. goodnight 💤'), reduce ? 0 : 1800); }
        };
        // la mer goes on with its little spoon, under my eyes only
        const spoon = $('#lm-spoon'), touched = new Set();
        const UNDER = [[300, 352, 46, 24, 'l'], [436, 350, 50, 24, 'r']];
        let honeyAt = 0;
        const spoonTime = b => {
            const next = ROUTINE.find(r => !applied.has(r));
            if (next !== 'lamer') return toast(`not yet, babe. step ${ROUTINE.indexOf(next) + 1} is ${SKIN_INFO[next][2]}.`);
            touched.clear();
            b.classList.add('use');
            spoon.hidden = false;
            toast('use the little spoon. smooth it under my eyes only ↓');
            $('#face-hint').textContent = 'pick up the spoon ↘';
        };
        const zone = (cx, cy) => {
            const r = face.getBoundingClientRect(); if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
            const x = (cx - r.left) / r.width * 900, y = (cy - r.top) / r.height * 719;
            const u = UNDER.find(([ux, uy, rx, ry]) => ((x - ux) / rx) ** 2 + ((y - uy) / ry) ** 2 <= 1);
            if (u) return u[4];
            return (x > 230 && x < 540 && y > 170 && y < 600) ? 'face' : 'off';
        };
        let sp = null;
        spoon.addEventListener('pointerdown', e => {
            e.preventDefault(); try { spoon.setPointerCapture(e.pointerId); } catch {}
            sp = document.createElement('div'); sp.className = 'sk-ghost lm-ghost'; sp.innerHTML = spoon.innerHTML; sheet.appendChild(sp);
            spoon.classList.add('held'); sp.style.left = e.clientX + 'px'; sp.style.top = e.clientY + 'px';
        });
        spoon.addEventListener('pointermove', e => {
            if (!sp) return;
            sp.style.left = e.clientX + 'px'; sp.style.top = e.clientY + 'px';
            const z = zone(e.clientX, e.clientY);
            if (z === 'l' || z === 'r') {
                if (!touched.has(z)) { touched.add(z); fairyDust(e.clientX, e.clientY); toast(touched.size < 2 ? 'mmm. now the other eye.' : 'both eyes. perfect ♡'); }
            } else if (z === 'face' && Date.now() - honeyAt > 2500) { honeyAt = Date.now(); toast('honey, we don’t waste expensive products here. under the eyes only.'); }
        });
        const spoonUp = () => {
            if (!sp) return; sp.remove(); sp = null; spoon.classList.remove('held');
            if (touched.size === 2 && !applied.has('lamer')) { apply('lamer'); spoon.hidden = true; }
            else if (touched.size === 1) $('#face-hint').textContent = 'one eye done. the other one ↘';
        };
        spoon.addEventListener('pointerup', spoonUp); spoon.addEventListener('pointercancel', spoonUp);
        // tap the patches on my face to peel them off; my eyes open again
        const pg = face.querySelector('[data-fx="patches"]');
        pg.addEventListener('click', () => {
            if (!patchesOn || pg.classList.contains('peel')) return;
            pg.classList.add('peel');
            setTimeout(() => { pg.classList.remove('peel'); apply('patches'); }, reduce ? 0 : 450);
        });
        // pick a product up out of the pouch and drop it on my face
        let drag = null;
        sheetBody.querySelectorAll('.mk[data-sk]').forEach(b => {
            b.addEventListener('pointerdown', e => {
                if (!$('#mbag').classList.contains('open')) return;
                drag = { b, x: e.clientX, y: e.clientY, ghost: null };
                try { b.setPointerCapture(e.pointerId); } catch {}
            });
            b.addEventListener('pointermove', e => {
                if (!drag || drag.b !== b) return;
                if (!drag.ghost) {
                    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
                    drag.ghost = document.createElement('div'); drag.ghost.className = 'sk-ghost'; drag.ghost.innerHTML = SKIN[b.dataset.sk];
                    drag.ghost.style.width = Math.min(90, b.querySelector('svg').getBoundingClientRect().width) + 'px';
                    sheet.appendChild(drag.ghost);
                }
                drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
                const r = face.getBoundingClientRect(); face.classList.toggle('target', e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom);
            });
            const end = e => {
                if (!drag || drag.b !== b) return;
                const d = drag; drag = null; face.classList.remove('target');
                if (!d.ghost) return;
                d.ghost.remove(); b.dataset.skip = '1';
                const r = face.getBoundingClientRect();
                if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) { if (b.dataset.sk === 'lamer') spoonTime(b); else apply(b.dataset.sk); }
            };
            b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
        });
        sheetBody.querySelectorAll('.mk[data-sk]').forEach(b => b.onclick = () => {
            if (b.dataset.skip) { delete b.dataset.skip; return; }
            if (b.dataset.sk === 'lamer') { if (!applied.has('lamer')) return spoonTime(b); }
            else apply(b.dataset.sk);
            const k = b.dataset.sk, used = b.classList.toggle('use');
            b.classList.remove('squeeze'); void b.offsetWidth; b.classList.add('squeeze');
            const lbl = $('#swatch-label'), sw = $('#swatch');
            $('#swipe').setAttribute('stroke', { dropper: '#F7D3DD', pinkpump: '#FBEDE6', goldpump: '#E8C9A8', patches: '#E2B23A', lamer: '#F1E9DD', sisley: '#F7E6E2', mask: '#EFE6D2' }[k]);
            $('#swipe').setAttribute('stroke-width', 16);
            lbl.textContent = `${SKIN_INFO[k][0]} · ${used ? SKIN_INFO[k][1] : 'back on.'}`; lbl.style.color = 'var(--plum)';
            sw.classList.remove('on'); void sw.offsetWidth; sw.classList.add('on');
        });
    },
    chargers: () => {
        const svg = $('#chg-svg'), CH = window.CHARGERS, note = $('#chg-note');
        // the knot: headphone cable on top, then the iphone one, the macbook brick at the very bottom
        const order = ['head', 'phone', 'mac'];
        const t = { mac: 0, phone: 0, head: 0 }, free = new Set();
        const draw = () => {
            const by = id => CH.list.find(c => c.id === id);
            // drawing order: freed cables stay in their lanes, the knot is drawn bottom to top
            svg.innerHTML = [...order].reverse().map(id => CH.cable(by(id), t[id], free.has(id) ? 'class="chg done"' : '')).join('') +
                CH.list.map(c => { const P = CH.at(c, t[c.id]), e = P[CH.N - 1]; return `<circle class="chg-grab" data-grab="${c.id}" cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="20"/>` + (free.has(c.id) ? `<text class="chg-lbl" x="${c.flat[0][0] - 6}" y="${c.lane - 26}">${c.name} ✓</text>` : ''); }).join('');
        };
        const blockedBy = id => order.slice(0, order.indexOf(id)).find(o => !free.has(o));
        const tween = (id, to, done) => { const from = t[id], t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / 380); t[id] = from + (to - from) * (1 - Math.pow(1 - k, 3)); draw(); if (k < 1) requestAnimationFrame(step); else done && done(); }; requestAnimationFrame(step); };
        const pt = e => { const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; return [vb.x + (e.clientX - r.left) / r.width * vb.width, vb.y + (e.clientY - r.top) / r.height * vb.height]; };
        let drag = null;
        svg.addEventListener('pointerdown', e => {
            const g = e.target.closest('[data-grab]'); if (!g) return;
            const id = g.dataset.grab; if (free.has(id)) return;
            e.preventDefault(); try { svg.setPointerCapture(e.pointerId); } catch {}
            drag = { id, start: pt(e), stuck: blockedBy(id) };
            const c = CH.list.find(x => x.id === id);
            note.textContent = drag.stuck ? `the ${c.name} is stuck under the ${CH.list.find(x => x.id === drag.stuck).name}.` : `pulling the ${c.name}…`;
        });
        svg.addEventListener('pointermove', e => {
            if (!drag) return;
            const p = pt(e), d = Math.hypot(p[0] - drag.start[0], p[1] - drag.start[1]);
            t[drag.id] = drag.stuck ? Math.min(.08, d / 900) : Math.min(1, d / 170);
            draw();
        });
        const up = () => {
            if (!drag) return;
            const { id, stuck } = drag; drag = null;
            if (stuck) { svg.classList.remove('nope'); void svg.getBoundingClientRect(); svg.classList.add('nope'); toast('it won’t budge. something’s on top of it.'); return tween(id, 0); }
            if (t[id] > .55) tween(id, 1, () => {
                free.add(id); draw();
                const left = order.filter(o => !free.has(o));
                note.textContent = left.length ? 'one down. keep going.' : 'all three, untangled. it’ll be a knot again by tuesday.';
                if (!left.length) toast('untangled! put that on my résumé.');
            });
            else tween(id, 0);
        };
        svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
        $('#chg-reset').onclick = () => { free.clear(); order.forEach(id => tween(id, 0)); note.textContent = 'back in the bag. and… they’re knotted again.'; };
        draw();
    },
    backuplip: () => {
        const face = $('#lipface'), paint = $('#lip-paint'), say = $('#lip-say'), NS = 'http://www.w3.org/2000/svg';
        // sample points inside my lips so we know how much is covered
        // sample points on my lips (wherever the lip image isn't transparent) so we know how much is covered
        const pts = [];
        const img = new Image(); img.src = 'assets/img/lips.png';
        img.onload = () => {
            const c = document.createElement('canvas'); c.width = 240; c.height = 110; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 240, 110);
            const d = x.getImageData(0, 0, 240, 110).data;
            for (let X = 4; X < 240; X += 8) for (let Y = 3; Y < 110; Y += 6) if (d[(Y * 240 + X) * 4 + 3] > 140) pts.push([X + 30, Y + 25, false]);
        };
        let done = false;
        const dab = (x, y) => {
            const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 15); c.setAttribute('fill', '#fff'); paint.appendChild(c);
            pts.forEach(p => { if (!p[2] && (p[0] - x) ** 2 + (p[1] - y) ** 2 < 225) p[2] = true; });
            const k = pts.filter(p => p[2]).length / pts.length;
            if (!done) say.textContent = k < .3 ? 'keep going…' : k < .65 ? 'ooh. a little more ♡' : k < .85 ? 'almost, get the corners' : say.textContent;
            if (!done && k >= .85) { done = true; face.classList.add('happy'); say.textContent = 'glögg on. thank you ♡'; toast('glögg. instant mood ♡'); $('#bl-go').textContent = 'Wipe it off'; }
        };
        const toSvg = e => { const r = face.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 300, (e.clientY - r.top) / r.height * 160]; };
        // pick up the lipstick: its bullet tip follows you, and it only paints where the tip touches my lips
        const stick = $('#lip-stick'), wrap = stick.closest('.lipwrap');
        let held = false, last = null;
        stick.style.touchAction = 'none'; face.style.touchAction = 'none';
        const onLips = e => { const r = face.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; };
        const follow = e => {
            const w = stick.offsetParent.getBoundingClientRect();
            stick.style.left = (e.clientX - w.left - stick.offsetWidth / 2) + 'px';
            stick.style.top = (e.clientY - w.top - stick.offsetHeight * .03) + 'px';
        };
        stick.addEventListener('pointerdown', e => {
            e.preventDefault(); held = true; stick.classList.add('held'); follow(e); last = null;
            try { stick.setPointerCapture(e.pointerId); } catch {}
            say.textContent = done ? say.textContent : 'now swipe it across my lips ↔';
        });
        stick.addEventListener('pointermove', e => {
            if (!held) return; follow(e);
            if (!onLips(e)) { last = null; return; }
            const p = toSvg(e);
            if (!last) { dab(...p); last = p; return; }
            const n = Math.ceil(Math.hypot(p[0] - last[0], p[1] - last[1]) / 6);
            for (let k = 1; k <= n; k++) dab(last[0] + (p[0] - last[0]) * k / n, last[1] + (p[1] - last[1]) * k / n);
            last = p;
        });
        const drop = () => { if (!held) return; held = false; last = null; stick.classList.remove('held'); stick.style.left = ''; stick.style.top = ''; };
        stick.addEventListener('pointerup', drop); stick.addEventListener('pointercancel', drop);
        face.addEventListener('pointerdown', () => { if (!held) toast('pick up the lipstick first ←'); });
        // or let the button do it: two swipes, upper lip then lower
        $('#bl-go').onclick = () => {
            if (done) { paint.innerHTML = ''; pts.forEach(p => p[2] = false); done = false; face.classList.remove('happy'); say.textContent = 'wiped off. dry again. put it back on me ↔'; $('#bl-go').textContent = 'Swipe it on for me'; return; }
            const path = [...Array(23)].map((_, k) => [40 + k * 10, 62 + Math.sin(k / 3) * 3]).concat([...Array(23)].map((_, k) => [260 - k * 10, 96 + Math.sin(k / 3) * 4]), [...Array(14)].map((_, k) => [80 + k * 11, 116]), [...Array(10)].map((_, k) => [90 + k * 13, 50]));
            path.forEach(([x, y], k) => setTimeout(() => { dab(x, y); if (k === path.length - 1) $('#bl-go').textContent = 'Wipe it off'; }, reduce ? 0 : k * 22));
        };
    },
    todo: () => { const c = $('#crumple'); c.onclick = () => { const o = c.classList.toggle('open'); $('#cr-note').textContent = o ? 'tucked away so it can’t make eye contact with me. (tap to crumple it back up.)' : 'crumpled up in the don’t-want-to-deal-with-it pocket. tap to smooth it out.'; }; },
    cards: () => {
        const C = [
            ['svg:welcome', '', '“welcome back didi!!!” with a cup that says “i ♡ u” and two little us, one of us holding my aritzia bag. obviously.'],
            ['svg:ut', '', 'she wants to go to UT Austin and be a “bussiness women.” she’s already got the hookup.'],
            ['svg:sisters', '', 'amaira ♡ suhani, forever. matching pink dresses, obviously.'],
            ['svg:sparkle', '', '“you are the best sister ever and make eyes sparkle.” her words. i’m keeping it forever.'],
['Happy Bithday Didi!','#F6C6D3','a birthday card. spelling: hers. didi means big sister.'],['I love you! you\'re the sweetest sister ever! I\'ll miss you!','#FFFDF8','she wrote “i’ll miss you.” enough said.'],['Two Starbucks Girls','#FBF6EA','us. at starbucks. she drew the cups very accurately.'],['Two Little Girls Walking on the Street','#EAF4EC','a house, two girls, a walk. peak art.'],['Merry Christmas and Happy New Year!','#FCE8E5','a christmas card with a gingerbread friend.'],['Girl boss','#EEF0FB','she thinks i run the world. i\'m not correcting her.']];
        let i = 0;
        const draw = () => {
            const [t, bg, n] = C[i];
            if (t.startsWith('svg:')) { $('#kc').innerHTML = `<div class="kc-card kc-real kc-dig">${DIGI_CARDS[t.slice(4)]}</div>`; $('#kc-n').textContent = `${i + 1} / ${C.length}`; $('#kc-note').textContent = n; $('#kc').firstChild.classList.add('in'); return; }
            if (t.startsWith('img:')) { $('#kc').innerHTML = `<div class="kc-card kc-real"><img src="${t.slice(4)}" alt="A drawing my little sister made me"></div>`; $('#kc-n').textContent = `${i + 1} / ${C.length}`; $('#kc-note').textContent = n; $('#kc').firstChild.classList.add('in'); return; }
            $('#kc').innerHTML = `<div class="kc-card" style="background:${bg}"><p class="kc-t">${t}</p><svg viewBox="0 0 160 70" aria-hidden="true"><path d="M30 60 c-14 -16 8 -30 16 -14 c8 -16 30 -2 16 14 l-16 14z" fill="#E0457E" opacity=".85"/><g fill="none" stroke="#7A4E2E" stroke-width="2.4" stroke-linecap="round"><circle cx="104" cy="22" r="8" fill="#F2D2B8"/><path d="M104 30 v20 M104 36 l-10 8 M104 36 l10 8 M104 50 l-7 14 M104 50 l7 14"/><circle cx="134" cy="28" r="6" fill="#F2D2B8"/><path d="M134 34 v16 M134 40 l-8 6 M134 40 l8 6 M134 50 l-6 12 M134 50 l6 12"/></g><path d="M96 16 q8 -10 16 0 M128 23 q6 -8 12 0" stroke="#5A3A26" stroke-width="3" fill="none"/></svg><p class="kc-from">— amaira</p></div>`;
            $('#kc-n').textContent = `${i + 1} / ${C.length}`; $('#kc-note').textContent = n;
            $('#kc').firstChild.classList.add('in');
        };
        $('#kc-next').onclick = () => { i = (i + 1) % C.length; draw(); };
        $('#kc-prev').onclick = () => { i = (i + C.length - 1) % C.length; draw(); };
        draw();
    },
    bear: () => { const b = sheetBody.querySelector('.big-obj'); $('#hug').onclick = () => { b.classList.remove('hugged'); void b.offsetWidth; b.classList.add('hugged'); toast('he says thank you ♡'); }; },
    brushes: () => {
        const D = [['M241','Angled Powder Bronzer','bronzer, swept on the cheekbones'],['M242','Slanted Cream & Liquid Bronzer','cream bronzer, buffed in'],['M132','Angled Concealer','concealer, under the eyes'],['Eye','Tapered Blender','blending the crease'],['Eye','Pointed Crease','cutting the crease'],['Eye','Dome Shader','packing on shadow'],['Eye','Pencil','smudging along the lash line'],['Eye','Flat Shader','lid color'],['Eye','Small Detail','inner corners'],['Eye','Angled Liner + Spoolie','brows and liner']], note = $('#mbr-note');
        sheetBody.querySelectorAll('.mbr').forEach(b => b.onclick = () => {
            sheetBody.querySelectorAll('.mbr').forEach(x => x.classList.toggle('up', x === b && !x.classList.contains('up')));
            const [c, n, u] = D[+b.dataset.br];
            note.innerHTML = b.classList.contains('up') ? `<b>${c === 'Eye' ? 'Eye Want It All' : 'Morphe ' + c}</b> · ${n}<br><small>for ${u}</small>` : 'tap a brush';
        });
    },
    nb1: () => { sheetBody.querySelectorAll('[data-ecb]').forEach(b => b.onclick = () => b.classList.toggle('open')); },
    nb2: () => { sheetBody.querySelectorAll('[data-ecb]').forEach(b => b.onclick = () => b.classList.toggle('open')); },
    journal: () => {
        // a small bound journal (the notepad is the one in my mccombs padfolio): the cover opens like a book
        const jb = $('#jb'), front = jb.querySelector('.jb-front'), hint = $('#jb-hint');
        const open = () => { jb.classList.add('open'); hint.textContent = 'write anything. tap the inside cover to close it (nothing is saved).'; };
        const close = () => { jb.classList.remove('open'); hint.textContent = 'tap the cover to open it'; };
        front.onclick = open;
        front.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
        jb.querySelector('.jb-back').onclick = close;
    },
    perfume: () => {
        let n = 0;
        const bottle = $('#pf-bottle'), act = bottle.querySelector('.pact'), btn = $('#spritz'), hint = $('#pf-hint');
        const capOff = () => { bottle.classList.add('capoff'); btn.textContent = 'Spritz'; hint.textContent = 'now press the nozzle. each spritz is a layer of me ✨'; };
        const spritz = () => {
            if (!bottle.classList.contains('capoff')) return capOff();
            // five sprays, max. then she cuts you off
            if (n >= 5) { bottle.classList.remove('nope'); void bottle.offsetWidth; bottle.classList.add('nope'); hint.textContent = 'cut off. five is the limit ♡'; return toast('girl, i know this perfume is amazing, but don’t let people smell you from a mile away.'); }
            act.style.transition = 'transform .12s'; act.style.transform = 'translateY(3px)';
            setTimeout(() => { act.style.transform = ''; }, 170);
            const r = bottle.getBoundingClientRect();
            fairyDust(r.left + r.width * .44, r.top + r.height * .17);
            n++;
            // each spritz goes one layer deeper: first impression, then who i am, then what stays
            const layers = sheetBody.querySelectorAll('.pf-me [data-layer]'), L = layers[Math.min(n, 3) - 1];
            if (n <= 3) { L.classList.add('on'); hint.textContent = n < 3 ? 'spritz again, go a little deeper ✨' : 'that’s me. all of it ♡'; }
            toast(n === 1 ? 'first impression: sweet ✨' : n === 2 ? 'the heart of it ♡' : n === 3 ? 'and this part lingers' : n === 4 ? 'okay that’s enough, it’s a small elevator' : 'that’s five. last one. i mean it.');
        };
        btn.onclick = spritz;
        bottle.onclick = e => { if (e.target.closest('.pcap') && bottle.classList.contains('capoff')) { bottle.classList.remove('capoff'); btn.textContent = 'Take the cap off'; hint.textContent = 'cap’s back on ♡'; return; } spritz(); };
        bottle.style.cursor = 'pointer';
    },
    boarding: () => {
        const gate = $('#bp-gate'), dest = [...gate.querySelectorAll('text')].filter(t => t.textContent.trim() === '???');
        let busy = false;
        const beep = () => { try { const a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), g = a.createGain(); o.frequency.value = 1320; g.gain.value = .06; o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .14); } catch {} };
        $('#bp-scan').onclick = () => {
            if (busy) return; busy = true;
            gate.classList.remove('scanned'); $('#bp-light').className = 'bp-light';
            gate.classList.add('scanning');
            setTimeout(() => {
                gate.classList.remove('scanning'); gate.classList.add('scanned'); $('#bp-light').className = 'bp-light ok'; beep();
                // the destination flips like a departures board, then lands where it always does
                const codes = ['PAR', 'TYO', 'NYC', 'LIS', 'SEL', 'BCN', 'CPT', '???'];
                codes.forEach((c, i) => setTimeout(() => { dest.forEach(t => t.textContent = c); if (i === codes.length - 1) { busy = false; toast('beep. you’re boarded. destination: wherever’s next ✈'); } }, 140 * (i + 1)));
            }, reduce ? 0 : 1300);
        };
    },
    padfolio: () => {
        // the pink pen: pick it up, write on the legal pad, flip the page up for a fresh one
        const pfx = sheetBody.querySelector('.pf'), pad = $('#pf-pad'), sheets = [...pad.querySelectorAll('.pf-sheet')];
        let at = 0, held = false, last = null;
        const topSheet = () => sheets[at];
        const fit = c => { if (c.width) return; const r = c.getBoundingClientRect(), d = devicePixelRatio || 1; c.width = r.width * d; c.height = r.height * d; const x = c.getContext('2d'); x.scale(d, d); x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#C2386E'; x.lineWidth = 2.2; };
        $('#pf-pen').onclick = () => {
            held = !held; pfx.classList.toggle('pen-held', held);
            $('#pf-pen').setAttribute('aria-label', held ? 'Put my pen back' : 'My baby pink pen: pick it up to write on the legal pad');
            toast(held ? 'pen in hand. write me something ♡' : 'pen’s back in its loop.');
        };
        sheets.forEach(sh => {
            const c = sh.querySelector('.pf-ink');
            const pt = e => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
            c.addEventListener('pointerdown', e => { if (!held) return; e.preventDefault(); fit(c); try { c.setPointerCapture(e.pointerId); } catch {} last = pt(e); const x = c.getContext('2d'); x.beginPath(); x.arc(last.x, last.y, 1.1, 0, 7); x.fillStyle = '#C2386E'; x.fill(); });
            c.addEventListener('pointermove', e => { if (!last) return; const p = pt(e), x = c.getContext('2d'); x.beginPath(); x.moveTo(last.x, last.y); x.lineTo(p.x, p.y); x.stroke(); last = p; });
            const stop = () => { last = null; }; c.addEventListener('pointerup', stop); c.addEventListener('pointercancel', stop);
        });
        const show = () => { sheets.forEach((sh, i) => sh.classList.toggle('up', i < at)); $('#pf-prev').hidden = at === 0; $('#pf-next').hidden = at === sheets.length - 1; };
        $('#pf-next').onclick = () => { if (at < sheets.length - 1) { at++; show(); if (at === 1) toast('fresh page. the pen’s right there →'); } };
        $('#pf-prev').onclick = () => { if (at > 0) { at--; show(); } };
        // or grab the bottom of the page and flip it up
        let fy = null;
        pad.addEventListener('pointerdown', e => { if (held || e.target.closest('button')) return; const r = pad.getBoundingClientRect(); if (e.clientY > r.bottom - r.height * .3) fy = e.clientY; });
        pad.addEventListener('pointermove', e => { if (fy !== null && fy - e.clientY > 40) { fy = null; $('#pf-next').click(); } });
        pad.addEventListener('pointerup', () => { fy = null; });
        show();
        const pf = sheetBody.querySelector('.pf'), res = $('#pf-resume');
        const pull = e => { if (e.target.closest('.pf-open')) return; const out = pf.classList.toggle('res-out'); res.setAttribute('aria-label', out ? 'My résumé: tap to tuck it back in' : 'My résumé: tap to pull it out'); res.querySelector('.pf-take').textContent = out ? 'tuck it back ↓' : 'pull it out ↑'; if (out) toast('take one. seriously ♡'); };
        res.onclick = pull; res.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pull(e); } };
        const bc = $('#bc'); const flip = e => { if (e.target.closest('a')) return; const f = bc.classList.toggle('flip'); if (f) toast('tap a link ♡'); }; bc.onclick = flip; bc.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(e); } }; },
    cap: () => {
        let on = false;
        const fit = $('#capfit');
        const flip = () => {
            on = !on; fit.classList.toggle('on', on);
            $('#cap-on').textContent = on ? 'Take it off, it’s hot' : 'Put it on me';
            $('#capfit-cap').setAttribute('aria-label', on ? 'My brown NY cap: tap to take it off' : 'My brown NY cap: tap to put it on me');
            toast(on ? 'cap on. bad hair day? never heard of her.' : 'off. it’s hot. literally.');
        };
        $('#cap-on').onclick = flip; $('#capfit-cap').onclick = flip;
    },
    passport: () => {
        $('#pb-tucked').onclick = () => goTo(ITEMS.find(i => i.id === 'boarding'));
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
    romcom: () => chapterBook(ROMCOMS, 'the end. (i’ll start another one tonight.)'),
    onward: () => chapterBook(BIZBOOKS, 'the end. back on the shelf ♡'),

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
            if (openMoreApp(b.dataset.app, view, home, back, '#back')) return;
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
                // my favorites page: shows on netflix, the romance movies on prime
                const SHOWS = [['gossip-girl', 'Gossip Girl', '2007–2012'], ['jane-the-virgin', 'Jane the Virgin', '2014–2019'], ['modern-family', 'Modern Family', '2009–2020'], ['friends', 'Friends', '1994–2004'], ['desperate-housewives', 'Desperate Housewives', '2004–2012']];
                const MOVIES = [['yeh-jawaani-hai-deewani', 'Yeh Jawaani Hai Deewani', '2013'], ['how-to-lose-a-guy-in-10-days', 'How to Lose a Guy in 10 Days', '2003'], ['jab-we-met', 'Jab We Met', '2007'], ['voicemails-for-isabelle', 'Voicemails for Isabelle', '2026'], ['tu-jhoothi-main-makkaar', 'Tu Jhoothi Main Makkaar', '2023'], ['rocky-aur-rani-kii-prem-kahaani', 'Rocky Aur Rani Kii Prem Kahaani', '2023'], ['student-of-the-year', 'Student of the Year', '2012']];
                const list = nf ? SHOWS : MOVIES;
                view.innerHTML = back + `
                    <div class="stream ${nf ? 'nf' : 'pv'}">
                        <p class="stream-h">${nf ? 'Shows I rewatch on repeat' : 'Romance movies I’m in love with'}</p>
                        <p class="stream-sub">${nf ? 'for sad days, lazy days, and the days i feel like a hopeless couch-potato blob. these always make me a little happier.' : 'for nights when i’m feeling a little delusional, hopelessly romantic, and in need of a happy ending.'}</p>
                        <div class="posters">${list.map(([f, t, y]) => `<figure><img src="assets/posters/${f}.jpg" alt="${t}"><figcaption><b>${t}</b><small>${y}</small></figcaption></figure>`).join('')}</div>
                        <a class="stream-more" href="https://suhanitiwari.com/home/favorites" target="_blank" rel="noopener">all my favorites ↗</a>
                    </div>`;
            } else if (b.dataset.app === 'youtube') {
                // my comfort TED talks, same categories as my favorites page
                const vids = [
                    ["Psychology", "Change Your Mindset, Change the Game", "Alia Crum, TEDx", "0tqq66zwa7g", "change-your-mindset"],
                    ["Psychology", "You Aren’t at the Mercy of Your Emotions: Your Brain Creates Them", "Lisa Feldman Barrett, TED", "0gks6ceq4eQ", "your-brain-creates-emotions"],
                    ["Learning", "How to Make Learning as Addictive as Social Media", "Luis von Ahn, TED", "P6FORpg0KVo", "learning-as-addictive"],
                    ["Learning", "Education Reimagined: Student-Led Learning", "Catlin Tucker, TEDx", "NTHBdIeV-8o", "student-led-learning"],
                    ["Learning", "Creativity in the Classroom (in 5 Minutes or Less!)", "Catherine Thimmesh, TEDx", "nASvIgSOCxw", "creativity-in-the-classroom"],
                    ["Learning", "How to Design a Library That Makes Kids Want to Read", "Michael Bierut, TED", "YsA_JTeHJ6A", "library-kids-want-to-read"],
                    ["Learning", "Every Kid Needs a Champion", "Rita Pierson, TED", "SFnMTHhKdkw", "every-kid-needs-a-champion"],
                    ["Learning", "The Child-Driven Education", "Sugata Mitra, TED", "nsKPvQCMATw", "child-driven-education"],
                    ["Learning", "Do Schools Kill Creativity?", "Sir Ken Robinson, TED", "iG9CE55wbtY", "schools-kill-creativity"],
                    ["Creativity", "Your Elusive Creative Genius", "Elizabeth Gilbert, TED", "86x-u-tz0MA", "elusive-creative-genius"],
                    ["Creativity", "4 Lessons in Creativity", "Julie Burstein, TED", "sY0Pf_pfqCI", "lessons-in-creativity"],
                    ["Creativity", "Tales of Creativity and Play", "Tim Brown, TED", "RjwUn-aA0VY", "creativity-and-play"],
                    ["Creativity", "Designers, Think Big!", "Tim Brown, TED", "UAinLaT42xY", "designers-think-big"],
                    ["Creativity", "Success, Failure and the Drive to Keep Creating", "Elizabeth Gilbert, TED", "_waBFUg_oT8", "drive-to-keep-creating"],
                    ["Becoming", "The Power of Believing That You Can Improve", "Carol Dweck, TED", "_X0mgOOSpLU", "power-of-believing"],
                    ["Becoming", "Grit: The Power of Passion and Perseverance", "Angela Lee Duckworth, TED", "H14bBuluwB8", "grit"],
                    ["Becoming", "How Every Child Can Thrive by Five", "Molly Wright, TED", "aISXCw0Pi94", "thrive-by-five"],
                    ["Life & People", "What Makes a Good Life?", "Robert Waldinger, TED", "8KkKuTCFvzI", "what-makes-a-good-life"],
                    ["Life & People", "There’s More to Life Than Being Happy", "Emily Esfahani Smith, TED", "y9Trdafp83U", "more-to-life-than-being-happy"],
                    ["Ideas & Brands", "How Airbnb Designs for Trust", "Joe Gebbia, Airbnb co-founder, TED", "16cM-RFid9U", "airbnb-designs-for-trust"],
                    ["Ideas & Brands", "How to Build the Future in Four Steps", "Jason Kilar, Hulu founding CEO, TEDx", "EMiJMod9vsk", "build-the-future"],
                    ["Ideas & Brands", "How to Connect While Apart", "Eric Yuan, Zoom founder, TED", "01qATwnoD_E", "connect-while-apart"],
                    ["Ideas & Brands", "Choice, Happiness and Spaghetti Sauce", "Malcolm Gladwell, TED", "iIiAAhUeR6Y", "spaghetti-sauce"],
                    ["Ideas & Brands", "How to Make Choosing Easier", "Sheena Iyengar, TED", "1pq5jnM1C-A", "choosing-easier"],
                    ["Ideas & Brands", "How to Get Your Ideas to Spread", "Seth Godin, TED", "xBIVlM435Zg", "ideas-to-spread"],
                    ["Ideas & Brands", "The Paradox of Choice", "Barry Schwartz, TED", "VO6XEQIsCoM", "paradox-of-choice"]
                ];
                const render = f => {
                    view.querySelector('.yt-feed').innerHTML = (f === 'all' || f === 'grwm' ? `<a class="yt-row" href="https://www.youtube.com/results?search_query=get+ready+with+me" target="_blank" rel="noopener"><span class="yt-thumb grwm">GRWM ♡</span><span><b>get ready with me</b><small>a whole genre, honestly</small></span></a>` : '') +
                        vids.filter(v => f === 'all' || v[0] === f).map(v => `<a class="yt-row" href="https://www.youtube.com/watch?v=${v[3]}" target="_blank" rel="noopener"><img class="yt-thumb" src="assets/videos/${v[4]}.jpg" alt=""><span><b>${v[1]}</b><small>${v[2]}</small></span></a>`).join('');
                    view.querySelectorAll('.yt-chips button').forEach(c => c.classList.toggle('on', c.dataset.f === f));
                };
                view.innerHTML = back + `<div class="yt"><p class="yt-logo"><span>▶</span> YouTube</p><p class="yt-why">some people have comfort shows. i have comfort TED talks.</p>
                    <div class="yt-chips">${[['all', 'All'], ['grwm', 'GRWM'], ['Psychology', 'Psychology'], ['Learning', 'Learning'], ['Creativity', 'Creativity'], ['Becoming', 'Becoming'], ['Life & People', 'Life & People'], ['Ideas & Brands', 'Ideas & Brands']].map(([k, l]) => `<button type="button" data-f="${k}">${l}</button>`).join('')}</div>
                    <div class="yt-feed"></div></div>`;
                view.querySelectorAll('.yt-chips button').forEach(c => c.onclick = () => render(c.dataset.f));
                render('all');
            } else if (b.dataset.app === 'notes') {
                const NOTES = [
                    ['roles i’m going for', 'product marketing manager\nproduct manager\nbrand strategist\ntechnology consultant\nmanagement consultant\nUI/UX designer\n\n→ work where technology meets people\n\ndream companies:\nnetflix ☆ spotify ☆ duolingo'],
                    ['medici', 'vanilla latte. every day.\nbuy 10, get 1 free.'],
                    ['gift card balances', 'aritzia: ?\nchanel: ?\nsephora: ?\n(a mystery)'],
                    ['in my backpack rn', 'T.D. ♡\namaira’s cards\na speeding ticket (we don’t talk about it)\nan overdue to-do list']
                ];
                const list = () => {
                    view.innerHTML = back + `<div class="nt"><p class="nt-h">Notes</p>${NOTES.map(([t, b], i) => `<button type="button" class="nt-row" data-n="${i}"><b>${t}</b><span>${b.split('\n')[0]}</span></button>`).join('')}<button type="button" class="nt-new" id="nt-new">✎ new note</button></div>`;
                    $('#back').onclick = () => { view.hidden = true; home.hidden = false; };
                    view.querySelectorAll('[data-n]').forEach(r => r.onclick = () => openNote(+r.dataset.n));
                    $('#nt-new').onclick = () => openNote(-1);
                };
                const openNote = i => {
                    const [t, b] = i < 0 ? ['', ''] : NOTES[i];
                    view.innerHTML = `<button type="button" class="back mono" id="nt-back">‹ notes</button><div class="nt-page"><p class="nt-title" ${i < 0 ? 'contenteditable="true" data-ph="title"' : ''}>${t}</p><div class="nt-body" ${i < 0 ? 'contenteditable="true" data-ph="leave me a note (it isn’t saved)"' : ''}>${b.replace(/\n/g, '<br>')}</div></div>`;
                    $('#nt-back').onclick = list;
                    if (i < 0) view.querySelector('.nt-title').focus();
                };
                list(); addQ(view, 'notes'); view.hidden = false; home.hidden = true; return;
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
            addQ(view, b.dataset.app);
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
        const gap = bag.querySelector('.mgap'), mks = [...bag.querySelectorAll('.mk')];
        // while you drag, the zipper opens exactly as far as you've pulled, and each thing pops up once its spot is unzipped
        const scrub = f => {
            if (gap) { gap.style.transition = 'none'; gap.style.strokeDashoffset = 244 * (1 - f); }
            const byX = [...mks].sort((a, b) => (parseFloat(getComputedStyle(a).getPropertyValue('--x')) || 0) - (parseFloat(getComputedStyle(b).getPropertyValue('--x')) || 0));
            byX.forEach((m, k) => m.classList.toggle('peek', f > (k + .5) / byX.length));
        };
        mp.addEventListener('pointerdown', e => { mdrag = { x: e.clientX, moved: false, f: bag.classList.contains('open') ? 1 : 0 }; try { mp.setPointerCapture(e.pointerId); } catch {} });
        mp.addEventListener('pointermove', e => {
            if (!mdrag) return;
            const r = bag.querySelector('.mbag-front').getBoundingClientRect();
            const f = Math.max(0, Math.min(1, (e.clientX - r.left - r.width * .06) / (r.width * .84)));
            if (Math.abs(e.clientX - mdrag.x) > 6) mdrag.moved = true;
            if (!mdrag.moved) return;
            if (!bag.classList.contains('scrub')) { bag.classList.add('scrub'); bag.classList.remove('open'); }
            mdrag.f = f; mp.style.transition = 'none'; mp.style.left = `calc(6% + ${f} * (84% - 22px))`; scrub(f);
        });
        mp.addEventListener('pointerup', () => {
            if (!mdrag) return;
            const d = mdrag; mdrag = null; if (!d.moved) return;
            mskip = true; mp.style.transition = ''; mp.style.left = '';
            bag.classList.remove('scrub'); mks.forEach(m => m.classList.remove('peek')); if (gap) { gap.style.transition = ''; gap.style.strokeDashoffset = ''; }
            if ((d.f > .5) !== bag.classList.contains('open')) toggle();
        });
        bag.querySelector('.mbag-front svg').onclick = () => { if (!bag.classList.contains('open')) toggle(); };
        bag.querySelectorAll('.mk').forEach(b => b.onclick = () => {
            // tap one: it swipes on in its real shade, and its name gets written underneath in that shade
            const SH = {
                lipliner: ['#A3655B', 'Make Up For Ever Artist Color Pencil · 600 Anywhere Caffeine', null],
                lipstick: ['#6E3A2E', 'MAC Sleek Satin · Espresso Yourself', 'lipstick'],
                blush: ['#C98E86', 'Westman Atelier · Baby Cheeks, Mimi', 'blush'],
                contour: ['#9A7462', 'Westman Atelier · Face Trace, Biscuit', null],
                mascara: ['#141214', 'Lancôme Lash Idôle · black', 'mascara'],
                concealer: ['#D9B48F', 'Hourglass Vanish concealer', null],
                primer: ['#E3C3BA', 'Estée Lauder Futurist Aqua Brilliance · watery glow', null],
                foundation: ['#C8966F', 'Charlotte Tilbury Beautiful Skin · 6 Neutral', null]
            }[b.dataset.mk];
            if (!SH) { pickUp({ id: 'brushes', name: 'my morphe brushes', open: 'brushes' }); return backToPouch(); }
            b.classList.remove('squeeze'); void b.offsetWidth; b.classList.add('squeeze');
            const sw = $('#swatch'), lbl = $('#swatch-label');
            $('#swipe').setAttribute('stroke', SH[0]);
            $('#swipe').setAttribute('stroke-width', b.dataset.mk === 'mascara' ? 6 : 16);
            lbl.textContent = SH[1]; lbl.style.color = SH[0];
            sw.classList.remove('on'); void sw.offsetWidth; sw.classList.add('on');
            const more = $('#swatch-more');
            if (SH[2] && ITEMS.find(i => i.id === SH[2]).open !== 'makeup') { more.hidden = false; more.onclick = () => { pickUp(ITEMS.find(i => i.id === SH[2])); backToPouch(); }; } else more.hidden = true;
        });
        // bibbidi bobbidi boo: a wave of the wand, a burst of sparkles, and everything in the pouch is on. wave again to take it off.
        const bbb = $('#bbb'), dust = $('#bbb-dust');
        // the second wand zooms in on my face so you can actually see the makeup, then back out
        if (bbb) $('#bbb-zoom').onclick = () => {
            const z = bbb.classList.toggle('zoom');
            $('#bbb-zword').textContent = z ? 'zoom out' : 'zoom in';
            $('#bbb-zoom').setAttribute('aria-pressed', z);
        };
        if (bbb) $('#bbb-wand').onclick = () => {
            const on = bbb.classList.toggle('after');
            $('#bbb-tag').textContent = on ? 'after' : 'before';
            $('#bbb-word').textContent = on ? 'and back again' : 'bibbidi bobbidi boo';
            bbb.querySelector('.bbb-after').setAttribute('aria-hidden', !on);
            bbb.querySelector('.bbb-photo img').setAttribute('aria-hidden', on);
            dust.innerHTML = Array.from({ length: 26 }, () => {
                const a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 45;
                return `<i style="--x:${Math.cos(a) * r}%; --y:${Math.sin(a) * r}%; --s:${.5 + Math.random()}; --d:${Math.random() * 250}ms"></i>`;
            }).join('');
            bbb.classList.remove('poof'); void bbb.offsetWidth; bbb.classList.add('poof');
        };
    },
    ipad: () => {
        const view = $('#ipad-view'), home = $('#ipad-home');
        const back = '<button type="button" class="back mono" id="ip-back">‹ home</button>';
        sheetBody.querySelectorAll('[data-ip]').forEach(b => b.onclick = () => {
            const k = b.dataset.ip;
            if (openMoreApp(k, view, home, back, '#ip-back')) return;
            if (k === 'pinterest') {
                const pins = ['art/embracing-cultural-identity', 'img/cake-solar-system', 'img/cafe', 'art/braid', 'posters/gossip-girl', 'img/nyc', 'img/cupcakes', 'art/coexistence-of-both-my-worlds', 'img/chicago', 'art/packing-home', 'img/cake-lego', 'art/vanity'];
                view.innerHTML = back + `<div class="pin-head"><img src="assets/img/me.jpg" alt=""><span><b>Suhani</b><small>@suhxnitiwarii</small></span><a class="pin-btn" href="https://in.pinterest.com/suhxnitiwarii/" target="_blank" rel="noopener">Open my Pinterest</a></div><div class="pins">${pins.map(f => `<img src="assets/${f}.jpg" alt="">`).join('')}</div>`;
            } else if (k === 'procreate') {
                const STACKS = [
                    { name: 'Paintings', items: ART.map(([t, d, f]) => [`assets/art/${f}.jpg`, t, d]) },
                    { name: 'AP 2-D Art & Design', sub: 'my AP portfolio. sustained investigation: growing up between two worlds.', items: AP_ART.map(([t, d], n) => [`assets/ap/ap-${String(n + 1).padStart(2, '0')}.jpg`, t, d]) },
                    { name: 'Girls Can Be Engineers, Too!', sub: 'i wrote it, illustrated it and published it. here’s a sneak peek. the rest is on amazon.', link: 'https://a.co/d/9PAHLVL', items: [['assets/book/pg-01.jpg', 'the cover', ''], ['assets/book/pg-02.jpg', 'table of contents', ''], ['assets/book/pg-06.jpg', 'meet amaira, the sky explorer', 'want the other six engineers? the whole book is on amazon.']] }
                ];
                const gallery = () => {
                    view.innerHTML = back + `<p class="ip-title dark">Gallery</p><div class="stacks">${STACKS.map((st, n) => `<button type="button" class="stack" data-stack="${n}"><span class="stack-pile">${st.items.slice(0, 3).map(([src]) => `<img src="${src}" alt="">`).join('')}</span><b>${st.name}</b><small>${n === 2 ? 'sneak peek' : st.items.length + ' artworks'}</small></button>`).join('')}</div>`;
                    view.querySelectorAll('[data-stack]').forEach(x => x.onclick = () => openStack(+x.dataset.stack));
                    $('#ip-back').onclick = () => { view.hidden = true; home.hidden = false; view.classList.remove('procreate'); };
                };
                const openStack = n => {
                    const st = STACKS[n];
                    view.innerHTML = `<button type="button" class="back mono" id="ip-back">‹ Gallery</button><p class="ip-title dark">${st.name}</p>${st.sub ? `<p class="stack-sub">${st.sub}${st.link ? ` <a href="${st.link}" target="_blank" rel="noopener">see it on amazon ↗</a>` : ''}</p>` : ''}<div class="canvases">${st.items.map(([src, t], j) => `<button type="button" class="canvas" data-c="${j}"><img src="${src}" alt="" loading="lazy"><span>${t}</span></button>`).join('')}</div>`;
                    view.scrollTop = 0;
                    $('#ip-back').onclick = gallery;
                    view.querySelectorAll('[data-c]').forEach(c => c.onclick = () => openCanvas(n, +c.dataset.c));
                };
                const openCanvas = (n, j) => {
                    const st = STACKS[n], [src, t, d] = st.items[j];
                    view.innerHTML = `<button type="button" class="back mono" id="ip-back">‹ ${st.name}</button><div class="pc-full"><img src="${src}" alt="${t}"><div class="pc-nav"><button type="button" data-d="-1" aria-label="Previous">‹</button><span><b>${t}</b>${d ? `<small>${d}</small>` : ''}</span><button type="button" data-d="1" aria-label="Next">›</button></div></div>`;
                    $('#ip-back').onclick = () => openStack(n);
                    view.querySelectorAll('[data-d]').forEach(x => x.onclick = () => openCanvas(n, (j + +x.dataset.d + st.items.length) % st.items.length));
                };
                gallery(); view.classList.add('procreate'); home.hidden = true; view.hidden = false; addQ(view, k);
                return;
            }
            if (k !== 'procreate') view.classList.remove('procreate');
            addQ(view, k);
            home.hidden = true; view.hidden = false;
            $('#ip-back').onclick = () => { view.hidden = true; home.hidden = false; view.classList.remove('procreate'); };
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
            vw.classList.remove('fold-right'); setTimeout(() => vw.classList.remove('flap-back'), reduce ? 0 : 380); await wait(700);
            vw.classList.remove('fold-left'); setTimeout(() => vw.classList.remove('p1-back'), reduce ? 0 : 380); await wait(650);
            vw.classList.add('settled');
            opening = false;
        };
        const close = async () => {
            if (closing || !vw.classList.contains('open')) return;
            closing = true;
            vw.classList.remove('cash-out', 'medici-out', 'bills-out', 'settled');
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
                vw.classList.remove('cash-out', 'medici-out');
                if (/medici/i.test(detail.textContent)) detail.innerHTML = '<p class="hand" style="font-size:1.4rem; color:var(--plum); text-align:center">pick a card, any card</p>';
                await new Promise(r => setTimeout(r, reduce ? 0 : 420));
                vw.classList.remove('zip-open'); z.setAttribute('aria-pressed', 'false'); z.setAttribute('aria-label', 'Zip pocket: unzip it');
            }
            zipping = false;
        };
        // the bill compartment, behind the flap: rupees for home, dollars for here
        $('#vbills').onclick = () => {
            const out = vw.classList.toggle('bills-out');
            $('#vbills').setAttribute('aria-pressed', out); $('#vbills').setAttribute('aria-label', out ? 'Bill compartment: tuck the cash back in' : 'Bill compartment: take the cash out');
            toast(out ? 'rupees for home, five hundreds for here. don’t get any ideas ♡' : 'cash tucked away');
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
        vw.querySelectorAll('.vslot .card').forEach(card => {
            let d = null; card.style.touchAction = 'none';
            card.addEventListener('pointerdown', e => { d = { y: e.clientY, h: card.offsetHeight, moved: false }; try { card.setPointerCapture(e.pointerId); } catch {} });
            card.addEventListener('pointermove', e => {
                if (!d) return; const dy = Math.min(0, e.clientY - d.y);
                if (Math.abs(dy) > 6) d.moved = true; if (!d.moved) return;
                card.style.transition = 'none'; card.style.transform = `translateY(calc(-36% + ${Math.max(dy, -d.h * 1.3)}px))`;
            });
            card.addEventListener('pointerup', e => {
                if (!d) return; const moved = d.moved, far = d.y - e.clientY > d.h * .5; d = null; card.style.transition = '';
                if (!moved) return;
                if (far && !card.classList.contains('picked')) card.click(); else if (!far && !card.classList.contains('picked')) card.style.transform = ''; else card.style.transform = `translateY(calc(-36% - ${card.dataset.lift || 0}px))`;
                card.dataset.skip = '1';   // ignore the click the browser fires right after a drag
            });
        });
        vw.querySelectorAll('.vslot .card').forEach(card => card.onclick = () => {
            if (card.dataset.skip) { delete card.dataset.skip; return; }
            const was = card.classList.contains('picked');
            tuck();
            if (was) { vw.classList.remove('has-pick'); vw.style.marginTop = ''; return; }
            const c = CARDS[+card.dataset.card];
            vw.classList.add('has-pick');
            card.classList.add('picked');
            // the whole card comes out of its slot and floats above the wallet
            requestAnimationFrame(() => {
                const cr = card.getBoundingClientRect(), wr = vw.getBoundingClientRect();
                const vert = card.classList.contains('vert');
                // vertical cards (all the bank cards) turn upright once they're out of the slot
                const extra = vert ? (card.offsetWidth - card.offsetHeight) / 2 : 0;
                const lift = cr.bottom - wr.top + 12 + extra;   // clear the top of the wallet completely
                card.style.transition = 'none';
                card.style.transform = `translateY(calc(-36% - ${lift}px))`;
                const over = card.getBoundingClientRect().bottom - (vw.getBoundingClientRect().top - 12);
                const fixed = over > 0 ? lift + over : lift;
                card.style.transform = 'translateY(-36%)'; void card.offsetWidth; card.style.transition = '';
                card.style.transform = `translateY(calc(-36% - ${fixed}px))`;
                card.dataset.lift = fixed;
            });
            vw.style.marginTop = `${Math.round((card.classList.contains('vert') ? card.offsetWidth : card.offsetHeight) * 1.15)}px`;
            detail.innerHTML = `<p class="mono" style="margin:0 0 4px; color:var(--muted)">${c.title}</p><h3>${c.kind === 'id' ? c.sub : c.big}</h3><p class="m">${c.metric}</p><p>${c.body}</p>`;
            if (c.go) { detail.insertAdjacentHTML('beforeend', `<button class="btn solid" type="button" id="card-go">Open my passport</button>`); $('#card-go').onclick = () => pickUp(ITEMS.find(x => x.id === c.go)); }
        });
        if (!reduce) setTimeout(open, 700); else open();
    },

    binder: () => {
        sheetBody.querySelectorAll('.bpage').forEach(b => b.onclick = () => pickUp({ id: b.dataset.case, name: 'from my binder', open: b.dataset.case }));
    },

    mildliners: () => pensAfter(PENS),
    gelpens: () => pensAfter(GELPENS_AND_PENCILS),

    sunglasses: () => {
        const rz = $('#rz'), rig = $('#rz-rig');
        let k = 0, x = .5, y = .45;
        // each lens holds a full copy of the scene, shifted so it lines up with the one behind it
        const place = () => {
            const W = rz.clientWidth, H = rz.clientHeight;
            const rw = rig.offsetWidth, rh = rig.offsetHeight;
            const lx = Math.max(0, Math.min(W - rw, x * W - rw / 2)), ly = Math.max(0, Math.min(H - rh, y * H - rh / 2));
            rig.style.transform = `translate(${lx}px, ${ly}px)`;
            rig.querySelectorAll('.rz-lens').forEach(l => {
                const sc = l.firstElementChild;
                sc.style.width = W + 'px'; sc.style.height = H + 'px';
                sc.style.left = -(lx + l.offsetLeft + l.clientLeft) + 'px';
                sc.style.top = -(ly + l.offsetTop + l.clientTop) + 'px';
            });
        };
        const show = () => {
            const m = ROMANCE[k];
            rz.querySelectorAll('.rz-scene').forEach(sc => sc.innerHTML = m.svg);
            $('#rz-plain').textContent = m.plain; $('#rz-rom').textContent = m.rom;
        };
        rz.addEventListener('pointerdown', e => {
            if (rz.classList.contains('on')) return;
            rz.setPointerCapture(e.pointerId); rz.classList.add('peek');
            $('#rz-hint').hidden = true;
            const move = ev => { const r = rz.getBoundingClientRect(); x = (ev.clientX - r.left) / r.width; y = (ev.clientY - r.top) / r.height; place(); };
            move(e);
            rz.onpointermove = move;
            rz.onpointerup = rz.onpointercancel = () => { rz.onpointermove = null; };
        });
        new ResizeObserver(place).observe(rz);
        place();
        $('#shades').onclick = () => {
            const on = rz.classList.toggle('on');
            document.body.classList.toggle('shades', on);
            $('#shades').textContent = on ? 'Take them off' : 'Put them on';
            $('#shades-note').textContent = on ? 'see? it was always this pretty.' : 'ew. reality.';
            if (on) { const r = rz.getBoundingClientRect(); fairyDust(r.left + r.width / 2, r.top + r.height / 3); }
        };
        $('#rz-next').onclick = () => {
            k = (k + 1) % ROMANCE.length;
            rz.classList.add('swap');
            setTimeout(() => { show(); place(); rz.classList.remove('swap'); }, 220);
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
        const big = $('#stan-big'), lid = big.querySelector('.lid');
        const flipLid = () => {
            if (big.classList.contains('lid-open')) {
                big.classList.remove('lid-open'); lid.classList.add('closing'); setTimeout(() => lid.classList.remove('closing'), 850);
                $('#stan-say').textContent = 'lid’s back on. no spills ♡';
            } else { lid.classList.remove('closing'); big.classList.add('lid-open'); $('#stan-say').textContent = 'lid’s off. now take a sip for me ↓'; }
        };
        big.onclick = flipLid; big.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipLid(); } };
        $('#sip').onclick = () => {
            if (!big.classList.contains('lid-open')) return toast('lid’s still on. tap it first.');
            if (n >= 8) return toast('fully hydrated. screenshot this, it won’t happen again.');
            const cups = document.querySelectorAll('#cups .cup');
            cups[n].style.background = 'var(--pink)'; n++;
            $('#cup-note').textContent = n >= 8 ? '8 of 8?? who am i.' : `${n} of 8. thank you for your service.`;
        };
    },

    ticket: () => {
        const tk = $('#tk');
        tk.onclick = () => { const f = tk.classList.toggle('flip'); $('#tk-say').textContent = f ? '$350. three hundred and fifty dollars. for going “a little too excited.”' : 'tap it to flip it over'; if (f) toast('$350. i could’ve bought a lot of lipstick.'); };
    },
    giftcards: () => {
        const flipped = new Set();
        sheetBody.querySelectorAll('.gc').forEach(c => c.onclick = e => {
            const s = e.target.closest('[data-scratch]');
            if (s && c.classList.contains('flip')) { s.classList.add('done'); toast(GIFTCARDS[+c.dataset.gc].bal + ' ✨'); return; }
            const on = c.classList.toggle('flip');
            sheetBody.querySelectorAll('.gc').forEach(o => o !== c && o.classList.remove('up'));
            c.classList.toggle('up', on);
            if (on) flipped.add(c.dataset.gc);
            $('#gc-tally').textContent = flipped.size === 3 ? 'all three. all from returns i forgot about. no regrets ♡' : `3 cards. 0 returns made on time.`;
        });
    },
    sweater: () => {
        const sw = $('#sw');
        // three taps to fold (left sleeve, right sleeve, bottom up), three taps to unfold
        const HINT = ['flat. tap it to fold the left sleeve in', 'tap again: right sleeve', 'one more: fold the bottom up', 'folded. tap it three times to unfold ↓'];
        let dir = -1;
        const step = () => {
            let f = +sw.dataset.f;
            if (f === 3) dir = -1; else if (f === 0) dir = 1;
            f += dir; sw.dataset.f = f;
            $('#sw-hint').textContent = f === 0 ? 'unfolded. tap three times to fold it back up' : f === 3 ? 'folded ♡ (marie kondo would be proud)' : dir > 0 ? HINT[f] : `${f} more to go…`;
            $('#sw-fold').textContent = dir > 0 && f < 3 || f === 0 ? 'Fold it' : 'Unfold it';
        };
        sw.onclick = step;
        sw.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step(); } };
        $('#sw-fold').onclick = step;
        $('#wear').onclick = () => {
            const on = document.body.classList.toggle('cozy');
            $('#wear').textContent = on ? 'Take it off' : 'Put it on';
            toast(on ? 'ahh. so much better.' : 'brr. okay, it’s back in the bag.');
        };
    },

    laptop: () => {
        const mbp = $('#mbp'), wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
        let busyLap = false;
        const showDesk = async on => {
            if (busyLap) return; busyLap = true;
            if (on) {
                $('#lap-closed').hidden = true; mbp.hidden = false; mbp.classList.remove('open'); void mbp.offsetWidth;
                mbp.classList.add('open'); $('#lap-close').hidden = false;
                await wait(1100);
            } else {
                mbp.classList.remove('open'); $('#lap-close').hidden = true;
                await wait(900);
                mbp.hidden = true; $('#lap-closed').hidden = false;
            }
            busyLap = false;
            $('#lap-note').textContent = on ? 'my desktop. open a folder, any folder.' : 'the stickers are load-bearing. tap one, or open it up.';
            if (on) $('#lap-clock').textContent = new Date().toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });
        };
        $('#lap-open').onclick = () => showDesk(true);
        window.__openLap = () => showDesk(true);
        $('#lap-close').onclick = () => showDesk(false);
        // finder: a window on the desktop with every folder in the sidebar
        const fwin = $('#fwin'), fmain = $('#fwin-main');
        const openFolder = i => {
            const [name, files] = FOLDERS[i];
            fwin.hidden = false; $('#fwin-title').textContent = name;
            fwin.querySelectorAll('[data-side]').forEach(b => b.classList.toggle('on', +b.dataset.side === i));
            fmain.innerHTML = files.length
                ? `<div class="fgrid">${files.map(([n, , , ic], j) => `<button type="button" class="ffile" data-file="${j}">${fileIcon(n, ic)}<span>${n}</span></button>`).join('')}</div><p class="fcount mono">${files.length} items</p>`
                : '<p class="fempty">This folder is empty.<br><span class="hand">(for now.)</span></p>';
            fmain.querySelectorAll('[data-file]').forEach(b => b.onclick = () => {
                const [n, kind, t] = files[+b.dataset.file];
                if (kind === 'view') goTo(ITEMS.find(x => x.id === t) || { id: t, name: n, open: t });
                else if (kind === 'web') openWeb(t, n);
                else if (kind === 'link') window.open(t, '_blank', 'noopener');
                else if (kind === 'self') toast('you’re already in it ♡');
                else if (kind === 'note') {
                    fmain.innerHTML = `<button type="button" class="fback mono">‹ ${name}</button><div class="ftext"><b>${n}</b><pre>${t}</pre></div>`;
                    fmain.querySelector('.fback').onclick = () => openFolder(i);
                } else if (kind === 'photo') {
                    let k = PHOTOS.indexOf(t);
                    const show = () => { fmain.innerHTML = `<div class="fql"><button type="button" class="fback mono">‹ ${name}</button><img src="assets/img/${PHOTOS[k]}.jpg" alt=""><div class="fql-nav"><button type="button" data-d="-1" aria-label="Previous">‹</button><span class="mono">${PHOTOS[k]}.jpg</span><button type="button" data-d="1" aria-label="Next">›</button></div></div>`;
                        fmain.querySelector('.fback').onclick = () => openFolder(i);
                        fmain.querySelectorAll('[data-d]').forEach(d => d.onclick = () => { k = (k + +d.dataset.d + PHOTOS.length) % PHOTOS.length; show(); }); };
                    show();
                }
            });
        };
        sheetBody.querySelectorAll('.dfolder').forEach(f => f.ondblclick = f.onclick = () => openFolder(+f.dataset.f));
        fwin.querySelectorAll('[data-side]').forEach(b => b.onclick = () => openFolder(+b.dataset.side));
        $('#fwin-x').onclick = () => { fwin.hidden = true; };
        sheetBody.querySelectorAll('.dock-app').forEach(a => a.onclick = () => {
            a.classList.remove('bounce'); void a.offsetWidth; a.classList.add('bounce');
            const app = a.getAttribute('aria-label');
            if (app === 'Finder') return openFolder(1);
            if (app === 'Photos') return openFolder(2);
            if (app === 'Notes') { openFolder(0); fmain.querySelector('[data-file="1"]').click(); return; }
            toast(a.dataset.say);
        });
        const label = $('#stk-label');
        sheetBody.querySelectorAll('.stk').forEach(g => {
            const k = STICKERS.find(x => x.id === g.dataset.sticker);
            const go = () => {
                if (k.href) return WEB_OK.test(k.href) ? openWeb(k.href, k.label.split(' → ')[1]) : window.open(k.href, '_blank', 'noopener');
                const it = ITEMS.find(i => i.id === k.go);
                goTo(it || { id: k.go, name: k.label.split(' → ')[1], open: k.go });
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

    sanitizer: () => {
        // the sanitizer inside my charm: squeeze, a glob drops into your hand, rub it in
        let globs = 0;
        const squirt = () => {
            const charm = $('#sani-charm'), hand = sheetBody.querySelector('.sani-hand'), sani = $('#sani');
            if (globs >= 4) return toast('your hands are clean. like, medically clean. stop.');
            charm.classList.remove('squeeze'); void charm.offsetWidth; charm.classList.add('squeeze');
            const c = charm.getBoundingClientRect(), h = hand.getBoundingClientRect(), b = sani.getBoundingClientRect();
            const drop = document.createElement('span'); drop.className = 'sani-drop';
            drop.style.left = (c.left + c.width * .49 - b.left) + 'px'; drop.style.top = (c.top + c.height * .93 - b.top) + 'px';
            drop.style.setProperty('--fall', (h.top + h.height * .61 - (c.top + c.height * .93)) + 'px');
            sani.appendChild(drop);
            setTimeout(() => {
                drop.remove(); globs++;
                const pool = $('#sani-pool'), shine = $('#sani-shine');
                pool.setAttribute('rx', 10 + globs * 7); pool.setAttribute('ry', 4 + globs * 2.2); shine.setAttribute('rx', 2 + globs); shine.setAttribute('ry', 1 + globs * .5);
                $('#sani-rub').hidden = false;
                toast(['squish. cozy vanilla almond ✨', 'a little more never hurt', 'okay that’s a generous amount', 'that’s a puddle. rub it in.'][globs - 1]);
            }, reduce ? 0 : 520);
        };
        $('#sani-go').onclick = squirt; $('#sani-charm').onclick = squirt;
        $('#sani-rub').onclick = () => {
            const hand = sheetBody.querySelector('.sani-hand');
            hand.classList.remove('rub'); void hand.getBoundingClientRect(); hand.classList.add('rub');
            setTimeout(() => {
                $('#sani-pool').setAttribute('rx', 0); $('#sani-pool').setAttribute('ry', 0); $('#sani-shine').setAttribute('rx', 0); $('#sani-shine').setAttribute('ry', 0);
                const r = hand.getBoundingClientRect(); fairyDust(r.left + r.width / 2, r.top + r.height / 2);
                globs = 0; $('#sani-rub').hidden = true; toast('clean hands, smelling like a vanilla latte ♡');
            }, reduce ? 0 : 900);
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
/* the pouch: 20 gel pens + 5 BIC mechanical pencils, a zipper you can drag, and a notebook page */
const GELPENS_AND_PENCILS = [...GELPENS, ...[['Pencil · Blue', '#5DA9E9'], ['Pencil · Pink', '#F28DB2'], ['Pencil · Purple', '#A98BE0'], ['Pencil · Green', '#6CCB8C'], ['Pencil · Orange', '#F5A25D']].map(([name, c]) => ({ name, c, pencil: true }))];
const PENCIL_SVG = c => `<svg viewBox="0 0 34 190"><rect x="8" y="20" width="18" height="138" rx="3" fill="${c}" opacity=".85" stroke="#3A2626" stroke-width="3"/><rect x="11" y="26" width="4" height="124" rx="2" fill="#fff" opacity=".45"/><rect x="9" y="4" width="16" height="18" rx="3" fill="#F7F3EE" stroke="#3A2626" stroke-width="2.5"/><rect x="23" y="22" width="4" height="50" rx="2" fill="#fff" stroke="#3A2626" stroke-width="2"/><path d="M8 158 L17 182 L26 158Z" fill="#E4E4E2" stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"/><path d="M16 178 h2 v8 h-2z" fill="#555"/></svg>`;
// Tombow MONO: white body, the blue / white / black sleeve
const MONO_SVG = `<svg viewBox="0 0 120 52" aria-hidden="true"><rect x="4" y="8" width="112" height="36" rx="5" fill="#FBFBF9" stroke="#3A2626" stroke-width="2.4"/><rect x="30" y="8" width="70" height="36" fill="#1D4E9E"/><rect x="30" y="20" width="70" height="12" fill="#fff"/><rect x="30" y="32" width="70" height="12" fill="#151517"/><rect x="30" y="8" width="70" height="36" fill="none" stroke="#3A2626" stroke-width="2"/><text x="65" y="29.6" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="800" font-size="9" letter-spacing="1.5" fill="#151517">MONO</text></svg>`;
// my Alopuxi correction tape: pen-length pink body, a clear pink reel head, a metal tip
const WHITEOUT_SVG = `<svg viewBox="0 0 200 60" aria-hidden="true"><path d="M3 26 h14 v8 h-14z" fill="#D9DBE0" stroke="#3A2626" stroke-width="1.6"/><path d="M5 28 h10 M5 32 h10" stroke="#9EA2AA" stroke-width="1"/><rect x="16" y="19" width="118" height="22" rx="6" fill="#F4A9C4" stroke="#3A2626" stroke-width="2"/><rect x="16" y="19" width="10" height="22" rx="3" fill="#E893B3" stroke="#3A2626" stroke-width="1.4"/><path d="M30 24 h96" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".5"/><text x="74" y="35" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="8" fill="#fff" letter-spacing=".6">Alopuxi</text><circle cx="162" cy="30" r="27" fill="#F28DB4" fill-opacity=".72" stroke="#3A2626" stroke-width="2"/><circle cx="162" cy="30" r="19" fill="none" stroke="#fff" stroke-width="1.2" opacity=".6"/><circle cx="162" cy="30" r="11" fill="#EE7DA8" stroke="#C0507E" stroke-width="1.4"/><circle cx="162" cy="30" r="4" fill="#fff" stroke="#C0507E" stroke-width="1.2"/><path d="M162 22 v-3 M170 30 h3 M162 38 v3 M154 30 h-3" stroke="#C0507E" stroke-width="1.4"/><circle cx="140" cy="30" r="2.4" fill="#F7C4D8" stroke="#3A2626" stroke-width="1"/></svg>`;
function zipperPouch(pf, pens, btn, note) {
    const pull = pf.querySelector('.cc-pull'), svg = pf.querySelector('svg'), list = [...pens.querySelectorAll('.pen')], N = list.length;
    const TRACK = 176, CLOSED_X = 201;   // the pull travels from x=201 (zipped) to x=25 (open) in the pouch art
    let p = 0, anim = 0;
    pens.classList.add('zipdrive');
    const set = v => {
        p = Math.max(0, Math.min(1, v));
        pull.style.transform = `translateX(${-TRACK * p}px)`;
        pf.classList.toggle('unzipped', p > .02);
        // pens come out one at a time, from the end the zipper opens first
        list.forEach((el, i) => el.classList.toggle('out', p * (N + 1) > N - i));
        btn.textContent = p > .5 ? 'Zip it' : 'Unzip it';
        note.textContent = p === 0 ? 'zipped. 20 pens and 5 pencils in there' : p < 1 ? `${list.filter(el => el.classList.contains('out')).length} out…` : pens.dataset.pick;
    };
    const tween = (to, ms) => {
        cancelAnimationFrame(anim); const from = p, t0 = performance.now();
        const step = t => { const k = Math.min(1, (t - t0) / ms), e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; set(from + (to - from) * e); if (k < 1) anim = requestAnimationFrame(step); };
        anim = requestAnimationFrame(step);
    };
    // the button: a slow unzip so you see the fan, a quick zip shut
    btn.onclick = () => p > .5 ? tween(0, reduce ? 0 : 450) : tween(1, reduce ? 0 : 2200);
    // or grab the pull and drag it yourself, as slowly as you like
    let drag = null;
    pf.style.cursor = 'grab'; pf.style.touchAction = 'none';
    pf.addEventListener('pointerdown', e => { cancelAnimationFrame(anim); drag = { x: e.clientX, p0: p, moved: false }; pf.style.cursor = 'grabbing'; try { pf.setPointerCapture(e.pointerId); } catch {} });
    pf.addEventListener('pointermove', e => {
        if (!drag) return;
        const scale = svg.getBoundingClientRect().width / 240, dx = e.clientX - drag.x;
        if (Math.abs(dx) > 4) drag.moved = true;
        if (drag.moved) set(drag.p0 - dx / scale / TRACK);
    });
    const up = () => { if (!drag) return; const { moved } = drag; drag = null; pf.style.cursor = 'grab'; if (!moved) btn.click(); };
    pf.addEventListener('pointerup', up); pf.addEventListener('pointercancel', up);
    set(0);
}
// the notebook page: ink and whiteout live on one layer, graphite on another, so the MONO only ever erases pencil
function setupDesk() {
    const ink = $('#ink-canvas'), gr = $('#graphite-canvas'), hint = $('#desk-hint'), now = $('#desk-now'), erase = $('#desk-erase');
    const ix = ink.getContext('2d'), gx = gr.getContext('2d');
    const size = () => { const r = gr.getBoundingClientRect(), d = devicePixelRatio || 1; [[ink, ix], [gr, gx]].forEach(([c, x]) => { c.width = r.width * d; c.height = r.height * d; x.setTransform(d, 0, 0, d, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; }); };
    size();
    let tool = null, last = null, warned = false;
    const dot = (c, r) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${r * 2 + 4}' height='${r * 2 + 4}'><circle cx='${r + 2}' cy='${r + 2}' r='${r}' fill='${c}' stroke='%233A2626' stroke-width='1'/></svg>`).replace(/%253A/g, '%3A')}") ${r + 2} ${r + 2}, crosshair`;
    const label = t => t.kind === 'eraser' ? 'my tombow mono eraser' : t.kind === 'whiteout' ? 'my pink correction tape' : t.name.toLowerCase() + (t.kind === 'pen' ? ' gel pen' : '');
    const setTool = t => {
        tool = t;
        // the eraser and the whiteout leave the tray and become your cursor
        const ERASER_CUR = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='48' height='26'><g transform='rotate(-18 24 13)'><rect x='4' y='6' width='40' height='14' rx='2.5' fill='#FBFBF9' stroke='#3A2626' stroke-width='1.6'/><rect x='13' y='6' width='26' height='14' fill='#1D4E9E'/><rect x='13' y='11' width='26' height='4' fill='#fff'/><rect x='13' y='15' width='26' height='5' fill='#111'/></g></svg>`)}") 8 18, crosshair`;
        const WHITEOUT_CUR = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='48' height='26'><g transform='rotate(-24 24 13)'><rect x='1' y='11' width='5' height='4' fill='#D9DBE0' stroke='#3A2626' stroke-width='1'/><rect x='6' y='9' width='26' height='8' rx='2.5' fill='#F4A9C4' stroke='#3A2626' stroke-width='1.2'/><circle cx='38' cy='13' r='8' fill='#F28DB4' fill-opacity='.8' stroke='#3A2626' stroke-width='1.2'/><circle cx='38' cy='13' r='3' fill='#fff'/></g></svg>`)}") 4 18, crosshair`;
        gr.style.cursor = t.kind === 'eraser' ? ERASER_CUR : t.kind === 'whiteout' ? WHITEOUT_CUR : dot(t.c, 2.5);
        sheetBody.querySelectorAll('.dtool').forEach(b => b.classList.toggle('on', b.dataset.tool === t.kind));
        sheetBody.querySelectorAll('.pen').forEach(b => b.classList.toggle('held', (t.kind === 'pen' || t.kind === 'pencil') && GELPENS_AND_PENCILS[+b.dataset.pen].name === t.name));
        erase.hidden = t.kind !== 'pencil';
        now.textContent = `holding: ${label(t)}`;
    };
    $('#pens').desk = { hold: p => setTool({ kind: p.pencil ? 'pencil' : 'pen', c: p.c, name: p.name }) };
    sheetBody.querySelectorAll('.dtool').forEach(b => b.onclick = () => { setTool({ kind: b.dataset.tool }); toast(b.dataset.tool === 'eraser' ? 'got the eraser. scrub away the pencil.' : 'correction tape in hand. it covers pen.'); });
    erase.onclick = () => setTool({ kind: 'eraser' });
    $('#desk-clear').onclick = () => { ix.clearRect(0, 0, ink.width, ink.height); gx.clearRect(0, 0, gr.width, gr.height); hint.hidden = false; toast('fresh page ♡'); };
    const pt = e => { const b = gr.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    const stroke = (a, b) => {
        const k = tool.kind;
        if (k === 'pen') { ix.globalCompositeOperation = 'source-over'; ix.strokeStyle = tool.c; ix.lineWidth = 2.4; ix.beginPath(); ix.moveTo(a.x, a.y); ix.lineTo(b.x, b.y); ix.stroke(); }
        if (k === 'pencil') { gx.globalCompositeOperation = 'source-over'; gx.strokeStyle = tool.c; gx.globalAlpha = .75; gx.lineWidth = 1.6; gx.beginPath(); gx.moveTo(a.x, a.y); gx.lineTo(b.x, b.y); gx.stroke(); gx.globalAlpha = 1; }
        if (k === 'eraser') { gx.globalCompositeOperation = 'destination-out'; gx.lineWidth = 22; gx.beginPath(); gx.moveTo(a.x, a.y); gx.lineTo(b.x, b.y); gx.stroke(); gx.globalCompositeOperation = 'source-over'; }
        if (k === 'whiteout') {
            // whiteout paints over the ink (you can write on top of it again) and covers pencil too
            ix.globalCompositeOperation = 'source-over'; ix.strokeStyle = '#FFFFFF'; ix.lineWidth = 12; ix.beginPath(); ix.moveTo(a.x, a.y); ix.lineTo(b.x, b.y); ix.stroke();
            gx.globalCompositeOperation = 'destination-out'; gx.lineWidth = 12; gx.beginPath(); gx.moveTo(a.x, a.y); gx.lineTo(b.x, b.y); gx.stroke(); gx.globalCompositeOperation = 'source-over';
        }
    };
    gr.addEventListener('pointerdown', e => {
        if (!tool) { toast('pick up a pen or a pencil first ↑'); return; }
        e.preventDefault(); try { gr.setPointerCapture(e.pointerId); } catch {}
        last = pt(e); hint.hidden = true; stroke(last, { x: last.x + .1, y: last.y + .1 });
        if (tool.kind === 'eraser' && !warned && ix.getImageData(0, 0, ink.width, ink.height).data.some((v, i) => i % 4 === 3 && v)) { warned = true; toast('erasers don’t do pen. that’s a whiteout job.'); }
    });
    gr.addEventListener('pointermove', e => { if (!last) return; const p = pt(e); stroke(last, p); last = p; });
    const stop = () => { last = null; };
    gr.addEventListener('pointerup', stop); gr.addEventListener('pointercancel', stop);
}

function pensAfter(list) {
    const pens = $('#pens'), note = $('#pen-note');
    const tele = $('#tele-btn'), pf = $('#pouch-front');
    const setTele = up => { pf.classList.toggle('down', up); pens.classList.toggle('open', up); if (tele) tele.textContent = up ? 'Pull it back up' : 'Push it down'; note.textContent = up ? pens.dataset.pick : 'zipped and standing tall'; };
    if (tele) {
        tele.onclick = () => setTele(!pens.classList.contains('open'));
        // or slide the white sleeve down (and back up) yourself, as slowly as you like
        const sleeve = pf.querySelector('.tele-sleeve'), svgT = pf.querySelector('svg');
        let drag = null, skip = false;
        pf.style.cursor = 'grab'; pf.style.touchAction = 'none';
        pf.addEventListener('pointerdown', e => { drag = { y: e.clientY, from: pens.classList.contains('open') ? 66 : 0, moved: false }; try { pf.setPointerCapture(e.pointerId); } catch {} });
        pf.addEventListener('pointermove', e => {
            if (!drag) return;
            const k = 120 / svgT.getBoundingClientRect().width, v = Math.max(0, Math.min(66, drag.from + (e.clientY - drag.y) * k));
            if (Math.abs(e.clientY - drag.y) > 3) drag.moved = true;
            if (!drag.moved) return;
            drag.v = v; sleeve.style.transition = 'none'; sleeve.style.transform = `translateY(${v}px)`;
            pens.classList.toggle('open', v > 33);
        });
        const end = () => {
            if (!drag) return; const d = drag; drag = null;
            sleeve.style.transition = ''; sleeve.style.transform = '';
            if (!d.moved) return setTele(!pens.classList.contains('open'));
            skip = true; setTele(d.v > 33);
        };
        pf.addEventListener('pointerup', end); pf.addEventListener('pointercancel', end);
        pf.addEventListener('click', e => { if (skip) { skip = false; e.stopPropagation(); } });
    }
    const cc = $('#cc-btn');
    if (cc) zipperPouch(pf, pens, cc, note);
    setTimeout(() => { if (tele) setTele(true); else if (cc) cc.click(); else { pens.classList.add('open'); note.textContent = pens.dataset.pick; } }, reduce ? 0 : 500);
    if (cc) setupDesk(list);
    pens.onclick = e => {
        const b = e.target.closest('[data-pen]'); if (!b) return;
        const p = list[+b.dataset.pen];
        // highlighters tell you which tool they are; gel pens just write in their color
        note.innerHTML = p.full
            ? `<span class="hl-line"><span class="hl" style="--hl:${p.c}">${p.full}</span></span><span class="hl-sub mono">${p.subject}${p.name.startsWith('MIS') ? ' · ' + p.name : ''} · UT Austin</span>`
            : p.note
            ? `<b style="font-family:var(--mono); font-size:.8rem; letter-spacing:.08em">${p.name.toUpperCase()}</b> · ${p.note}`
            : `writing in <span style="color:${p.c}; font-size:1.7rem">${p.name.toLowerCase()}</span>`;
        if (p.pencil) note.innerHTML = `<b style="font-family:var(--mono); font-size:.8rem; letter-spacing:.08em">${p.name.toUpperCase()}</b> · pencil. it erases.`;
        if (!p.note && !p.full && pens.desk) pens.desk.hold(p);
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
    // an open sheet sits in the browser's top layer, so the toast has to live inside it to be seen
    const host = sheet.open ? sheet : document.body;
    if (t.parentNode !== host) host.appendChild(t);
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2400);
}
$('#put-back').addEventListener('click', () => { $('#ending').hidden = true; $('#repack').click(); toast('everything back where it belongs. mostly.'); });

// scrolled right past the bag without opening a single pocket? she noticed
{
    const SASS = ['um. the bag is up there. you just scrolled past my whole life ↑', 'nothing down here but a copyright. the good stuff is in the bag ↑', 'okay, so we’re just not going to open it? bold.'];
    let said = 0, cool = 0;
    addEventListener('scroll', () => {
        if (said >= SASS.length || Date.now() < cool || document.querySelector('.item.out') || sheet.open) return;
        const b = bagBtn.getBoundingClientRect();
        if (b.bottom < innerHeight * .35) { toast(SASS[said++]); cool = Date.now() + 9000; }
    }, { passive: true });
}

// heading for the tab bar with my stuff still all over the table? excuse me
{
    const BYE = ['leaving already? my stuff is EVERYWHERE. you’re just going to leave it like that?', 'wow. you went through my bag and you’re not even putting it back?', 'fine. leave. i’ll clean it up. i always do.'];
    let n = 0, cool = 0;
    document.addEventListener('mouseout', e => {
        if (e.relatedTarget || e.clientY > 8 || n >= BYE.length || Date.now() < cool) return;
        if (!document.querySelector('.item.out')) return;
        toast(BYE[n++]); cool = Date.now() + 12000;
    });
}

// "pull me" sits next to the first zipper's pull, and actually pulls it
$('#bag-hint').addEventListener('click', e => { e.stopPropagation(); unzip(BAG.pockets[0]); });
// the makeup list page is gone: anything that pointed at it opens the pouch
VIEWS.makeup = VIEWS.makeupbag; AFTER.makeup = AFTER.makeupbag;
})();

