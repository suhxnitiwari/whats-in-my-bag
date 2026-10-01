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
    pull.addEventListener('click', toggle);
    pull.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
    // tapping the pocket itself works too, not just the tiny pull
    path.addEventListener('click', toggle);
    g.querySelector('.teeth').addEventListener('click', toggle);
});
function place(pk, t) {
    const { path, pull, len } = pk.el;
    const pt = path.getPointAtLength(len * t);
    pull.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    path.style.strokeDashoffset = len * (1 - t);
}
function slide(pk, from, to) {
    // ten stop-motion steps on a plain timer (frame timers pause in background tabs, which stalled the queue)
    return new Promise(res => {
        if (reduce) { place(pk, to); return res(); }
        let step = 0;
        const timer = setInterval(() => {
            step++;
            place(pk, from + (to - from) * step / 10);
            if (step >= 10) { clearInterval(timer); res(); }
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
    if (e.target.closest && e.target.closest('.holder')) { bottle.classList.remove('out', 'lid-open'); bottle.querySelector('.lid').classList.remove('closing'); toast('back in its pocket'); return; }
    pickUp(ITEMS.find(i => i.id === 'stanley'));
};
bottle.addEventListener('click', openBottle);
bottle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openBottle(e); });

let busy = Promise.resolve();
function unzip(pk) {
    busy = busy.then(async () => {
        if (open.has(pk.id)) return;
        open.add(pk.id);
        stage.classList.remove('idle');
        pk.el.pull.setAttribute('aria-pressed', 'true');
        pk.el.pull.setAttribute('aria-label', `Zip up: ${pk.label}`);
        pk.el.g.classList.add('open');
        $('#bag-hint').textContent = '';
        await slide(pk, 0, 1);
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
    });
    return busy;
}
function zipUp(pk) {
    busy = busy.then(async () => {
        if (!open.has(pk.id)) return;
        ITEMS.filter(i => i.zip === pk.id).forEach(it => {
            const li = document.getElementById('item-' + it.id);
            li.classList.remove('out'); li.querySelector('button').tabIndex = -1;
        });
        await slide(pk, 1, 0);
        open.delete(pk.id);
        pk.el.g.classList.remove('open');
        pk.el.pull.setAttribute('aria-pressed', 'false');
        pk.el.pull.setAttribute('aria-label', `Unzip: ${pk.label}`);
        if (!open.size) { $('#after').hidden = true; $('#bag-hint').textContent = 'pull a zipper ↓'; stage.classList.add('idle'); }
    });
    return busy;
}
$('#unzip-all').addEventListener('click', () => { $('#stage').scrollIntoView({ block: 'center', behavior: 'auto' }); BAG.pockets.forEach(pk => unzip(pk)); });
$('#repack').addEventListener('click', () => {
    BAG.pockets.forEach(pk => zipUp(pk));
    document.body.classList.remove('shades', 'cozy');
    bagBtn.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
});

list.addEventListener('click', e => {
    const part = e.target.closest('[data-part]');
    if (part) {
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
        <p class="note">two silk scrunchies, a wooden claw clip, a wide-tooth comb. dark, long, and always done.</p>
        <div class="hair-stage"><svg viewBox="0 0 200 300" class="hairdo" id="hairdo" data-state="${state}" style="--scr:#F2B8C6">
            <path d="M10 300 C12 236 56 212 100 212 C144 212 188 236 190 300Z" fill="#F4D3DA" stroke="#3A2626" stroke-width="3"/>
            <rect x="82" y="112" width="36" height="110" rx="14" fill="#C68E6A" stroke="#3A2626" stroke-width="2.5"/>
            <g class="h-down"><path d="M52 82 C50 26 150 26 148 82 C150 150 160 210 156 268 Q100 290 44 268 C40 210 50 150 52 82Z" fill="#2A1C1A" stroke="#3A2626" stroke-width="3"/>
                <path d="M78 60 C70 140 72 210 70 262 M100 50 C98 140 100 220 100 276 M122 60 C130 140 128 210 130 262" fill="none" stroke="#4A3430" stroke-width="2"/></g>
            <g class="h-up"><path d="M52 86 C50 26 150 26 148 86 C140 116 60 116 52 86Z" fill="#2A1C1A" stroke="#3A2626" stroke-width="3"/>
                <path d="M70 50 C84 70 92 88 100 100 M130 50 C116 70 108 88 100 100 M100 34 V100" fill="none" stroke="#4A3430" stroke-width="2"/></g>
            <g class="h-pony"><path d="M92 100 C80 150 84 210 100 262 C116 210 120 150 108 100Z" fill="#2A1C1A" stroke="#3A2626" stroke-width="3"/><path d="M100 110 C96 160 98 210 100 250" stroke="#4A3430" stroke-width="2" fill="none"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" fill="var(--scr)" stroke="#3A2626" stroke-width="3"/><path d="M84 100 q4 -6 8 0 t8 0 t8 0 t8 0" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/></g>
            <g class="h-claw"><path d="M100 98 C70 92 66 62 92 56 C120 50 132 78 112 92 C104 98 100 98 100 98Z" fill="#2A1C1A" stroke="#3A2626" stroke-width="3"/><path d="M84 48 q-8 -14 4 -22 M110 46 q8 -14 -2 -24" fill="none" stroke="#2A1C1A" stroke-width="7" stroke-linecap="round"/>
                <g transform="translate(58 46) scale(.95)">${ITEMS.find(i => i.id === 'clip').art.replace('<svg viewBox="0 0 90 80">', '<svg width="90" height="80" viewBox="0 0 90 80">')}</g></g>
            <g class="h-comb"><g class="combmove">${ITEMS.find(i => i.id === 'comb').art.replace('<svg viewBox="0 0 170 64">', '<svg x="18" y="0" width="164" height="62" viewBox="0 0 170 64">')}</g></g>
            <g class="h-spark" fill="#F6DB94" stroke="#3A2626" stroke-width="1"><path d="M30 120 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z"/><path d="M168 170 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z"/></g>
        </svg></div>
        <div class="row hair-btns">
            <button class="btn" type="button" data-hair="pony" data-scr="#F2B8C6">Pink scrunchie</button>
            <button class="btn" type="button" data-hair="pony" data-scr="#F1DEC2">Champagne scrunchie</button>
            <button class="btn" type="button" data-hair="claw">Claw clip</button>
            <button class="btn" type="button" data-hair="comb">Comb it out</button>
        </div>`;
}
function hairAfter(state) {
    const svg = $('#hairdo'), lines = { pony: 'ponytail. silk, so no creases ♡', claw: 'claw clip. effortless (it took four tries).', comb: 'wide-tooth comb. no knots, no breakage.' };
    const set = (st, scr) => {
        if (scr) svg.style.setProperty('--scr', scr);
        svg.dataset.state = '';
        requestAnimationFrame(() => { svg.dataset.state = st; });
        sheetBody.querySelectorAll('[data-hair]').forEach(b => b.classList.toggle('solid', b.dataset.hair === st && (!scr || b.dataset.scr === scr)));
    };
    sheetBody.querySelectorAll('[data-hair]').forEach(b => b.onclick = () => { set(b.dataset.hair, b.dataset.scr); toast(lines[b.dataset.hair]); });
    set(state, state === 'pony' ? '#F2B8C6' : null);
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
    romcom: () => `
        <h2>My <em>rom-com</em></h2>
        <p class="note">a paperback. it’s been in my backpack for three weeks. i keep saying i’ll read it.</p>
        <div class="rc-wrap"><div class="rc" id="rc"><div class="rc-page"><p class="hand">Chapter One</p><span></span><span></span><span></span><span></span><span></span></div><div class="rc-cover">${ITEMS.find(i => i.id === 'romcom').art}</div></div></div>
        <p class="rc-stats mono">days in my backpack: <b id="rc-days">21</b> · pages read: <b>0</b></p>
        <div class="row"><button class="btn solid" type="button" id="rc-read">Read it</button></div>`,
    hairpony: () => hairView('pony'),
    hairclaw: () => hairView('claw'),
    haircomb: () => hairView('comb'),

    bag: () => `
        <h2>My <em>backpack</em></h2>
        <p class="note">it goes everywhere with me. class, work, coffee, back to class.</p>
        <p>Everything I actually carry is on the table. Tap any of it. Or ask Sitara, the little charm hanging off the zipper.</p>`,

    makeup: () => `
        <div class="lipstick-big" id="lip">
            <svg viewBox="0 0 160 210" aria-label="Westman Atelier HydroBalm lipstick in Glögg, cap off">
                <g class="tube">
                    <rect x="22" y="96" width="46" height="108" rx="10" fill="#E8EFF6" stroke="#3A2626" stroke-width="3"/>
                    <rect x="27" y="74" width="36" height="28" rx="4" fill="#DCE6F0" stroke="#3A2626" stroke-width="3"/>
                    <path d="M31 74 V40 C31 26 59 18 59 32 V74Z" fill="#7A1E2E" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/>
                    <path d="M37 44 q6 -9 15 -13" fill="none" stroke="#B4475A" stroke-width="3" stroke-linecap="round"/>
                    <text x="45" y="170" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#9AA8B8" transform="rotate(-90 45 150)" letter-spacing="1.5">WESTMAN ATELIER</text>
                </g>
                <g class="cap">
                    <rect x="20" y="14" width="50" height="100" rx="10" fill="#EEF3F8" stroke="#3A2626" stroke-width="3"/>
                    <path d="M28 24 v60" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>
                </g>
            </svg>
        </div>
        <h2>Makeup: <em>loves &amp; skips</em></h2>
        <p class="note">all of it lives in my victoria’s secret makeup pouch</p>
        <div class="lists">
            <div class="love"><h3>always in my bag</h3><ul>
                <li><b>Westman Atelier HydroBalm Tinted Lipstick, Glögg.</b> Sheer black cherry. My favorite lipstick, period.</li>
                <li><b>Westman Atelier Baby Cheeks Blush Stick, Mimi.</b> Tawny beige. One swipe and done.</li>
                <li><b>Charlotte Tilbury Beautiful Skin Foundation, 6 Neutral.</b> My foundation.</li>
                <li><b>Hourglass Vanish Airbrush Concealer.</b> My favorite concealer. Full coverage, no creasing.</li>
                <li><b>Lancôme Lash Idôle mascara.</b> My favorite mascara. Lifts without the clumps.</li>
                <li><b>Morphe Along for the Glide brush set.</b> Six travel brushes, my favorites, full stop.</li>
                <li><span class="todo">add another love</span></li>
            </ul></div>
            <div class="skip"><h3>not for me</h3><ul>
                <li><span class="todo">add a skip</span></li>
                <li><span class="todo">add a skip</span></li>
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
        <div class="row"><button class="btn solid" type="button" id="see-makeup">All my makeup loves &amp; skips</button></div>`,

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
                <button type="button" class="mk brushes" data-mk="brushes" style="--h:255px; --x:63px; --a:21deg; --d:360ms" aria-label="Morphe Along for the Glide brush set"><svg viewBox="0 0 90 215"><g transform="rotate(-9 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M41 62 C38 44 42 26 45 18 C48 26 52 44 49 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(-5.5 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M38 62 C34 44 38 30 45 28 C52 30 56 44 52 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(-2 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M35 62 C27 42 33 20 45 18 C57 20 63 42 55 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(2 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M38 62 C33 46 37 30 45 29 C53 30 57 46 52 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(5.5 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><path d="M42 62 C41 52 42 44 45 40 C48 44 49 52 48 62Z" fill="#9C928C" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M45 24 v34" stroke="#B8AFA9" stroke-width="2" opacity=".7"/></g><g transform="rotate(9 45 210)"><rect x="39" y="60" width="12" height="150" rx="6" fill="#F2EFEA" stroke="#3A2626" stroke-width="2.2"/><rect x="38.5" y="58" width="13" height="16" rx="2" fill="#E8E4DE" stroke="#3A2626" stroke-width="2"/><rect x="43" y="22" width="4" height="40" rx="2" fill="#8A8079"/><path d="M38 26 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 30 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 34 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 38 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 42 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 46 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 50 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M39 54 h12" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/><path d="M38 58 h14" stroke="#8A8079" stroke-width="2" stroke-linecap="round"/></g></svg><span>brushes</span></button>
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
        <p class="pen-note" id="mk-note">pull the zipper</p>
        <div class="row" style="justify-content:center"><button class="btn" type="button" id="see-makeup2">My makeup loves &amp; skips</button></div>`,

    apartment: () => `
        <div class="fob" style="width:110px">${APT_FOB}</div>
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
        const order = ['id', 'dl', 'bofadebit', 'bofa', 'amexgold', 'amexblue'];
        const idx = k => CARDS.findIndex(c => c.kind === k);
        const slot = (k, n) => { const i = idx(k); return i < 0 ? '' : `<div class="vslot" style="--n:${n}">${cardHTML(CARDS[i], i)}<span class="pocket"></span></div>`; };
        return `
        <h2>My <em>wallet</em></h2>
        <p class="note">louis vuitton victorine. tap a card, or the zip pocket for cash.</p>
        <div class="vread" id="vread" aria-live="polite"></div>
        <div class="vw" id="vw">
            <button type="button" class="vw-closed" id="snap" aria-label="Open the wallet">${ITEMS.find(i => i.id === 'wallet').art}</button>
            <div class="vw-open" aria-hidden="true">
                <button type="button" class="vzip" id="vzip" aria-label="Zip pocket: unzip for cash" aria-pressed="false"><span class="zgap" aria-hidden="true"></span><span class="zpull" aria-hidden="true"></span><span class="cash" aria-hidden="true"><span class="note-bill" style="--i:0; --bg:#B9B4A8; --ink:#5E5A50"><b>₹500</b><i>भारत</i><em>₹500</em></span><span class="note-bill" style="--i:1; --bg:#EBC76A; --ink:#7A5A12"><b>₹200</b><i>भारत</i><em>₹200</em></span><span class="note-bill" style="--i:2; --bg:#B9A9DC; --ink:#4E3E80"><b>₹100</b><i>भारत</i><em>₹100</em></span><span class="note-bill" style="--i:3; --bg:#B7CFAE; --ink:#2F4A2A"><b>$20</b><i>USA</i><em>$20</em></span><span class="note-bill" style="--i:4; --bg:#CFDCC6; --ink:#3E5638"><b>$1</b><i>USA</i><em>$1</em></span></span></button>
                <div class="vpanel p1">${order.slice(0, 3).map(slot).join('')}</div>
                <div class="vgusset"></div>
                <div class="vpanel p2">${order.slice(3).map(slot).join('')}<span class="vstamp">SUHANI<br><small>AUSTIN</small></span></div>
                <div class="vflap"><span class="vsnap"></span></div>
            </div>
        </div>
        <div class="row" style="justify-content:center"><button class="btn" type="button" id="vclose">Close the wallet</button></div>
        <div class="card-detail" id="card-detail" aria-live="polite"><p class="hand" style="font-size:1.4rem; color:var(--plum); text-align:center">pick a card, any card</p></div>`;
    },

    mildliners: () => penView({
        title: 'My <em>Mildliner</em> pouch', note: 'the full 25-pack. every color is a class i took at ut austin.',
        list: PENS, front: ITEMS.find(i => i.id === 'pouch').art, pick: 'pick a highlighter, see the class',
        pen: c => `<svg viewBox="0 0 34 190"><rect x="5" y="30" width="24" height="132" rx="5" fill="#FFFDF9" stroke="#3A2626" stroke-width="3"/><rect x="5" y="4" width="24" height="32" rx="6" fill="${c}" stroke="#3A2626" stroke-width="3"/><rect x="5" y="158" width="24" height="28" rx="6" fill="${c}" stroke="#3A2626" stroke-width="3"/><path d="M11 50 h12 M11 142 h12" stroke="${c}" stroke-width="3"/></svg>`
    }),

    gelpens: () => penView({
        title: 'My <em>Paper Mate</em> pouch', note: 'paper mate inkjoy gel. pick a color and type. switch pens mid-sentence.',
        list: GELPENS, front: ITEMS.find(i => i.id === 'penpouch').art, pick: 'pick a pen',
        pen: c => `<svg viewBox="0 0 34 190"><rect x="7" y="16" width="20" height="150" rx="9" fill="${c}" stroke="#3A2626" stroke-width="3"/><rect x="9" y="22" width="5" height="120" rx="2.5" fill="#fff" opacity=".35"/><rect x="21" y="10" width="6" height="56" rx="3" fill="${c}" stroke="#3A2626" stroke-width="2.5"/><rect x="11" y="2" width="12" height="16" rx="4" fill="${c}" stroke="#3A2626" stroke-width="2.5"/><path d="M11 166 L17 186 L23 166Z" fill="#E8E2DC" stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    }),

    sunglasses: () => `
        <h2>How I <em>see</em> things</h2>
        <p class="note">black and gold, gray gradient lenses. put them on.</p>
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
                ['Starbucks App', 'starbucks'],
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
        <div class="compact" id="compact" style="position:relative; width:220px; height:220px; margin:0 auto 14px; perspective:700px">
            <div style="position:absolute; inset:0; border-radius:22%; border:3px solid var(--ink); background:#EDEFF2; overflow:hidden; box-shadow: inset 0 0 0 10px #141011">
                <img src="assets/img/me.jpg" alt="Me, in the mirror" style="width:100%; height:100%; object-fit:cover; opacity:.92; filter: saturate(.9)">
                <span style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,.55), transparent 45%)"></span>
            </div>
            <div id="lid" style="position:absolute; inset:0; border-radius:22%; border:3px solid var(--ink); background:#141011; transform-origin:50% 0; transition: transform 1s cubic-bezier(.2,.8,.2,1); display:grid; place-items:center">
                <span style="width:34%; aspect-ratio:1; border-radius:50%; border:5px solid #E9E4DF"></span>
            </div>
        </div>
        <h2>Mirror, mirror: <em>the real me</em></h2>
        <p class="note">my chanel double facettes. yes, the blair waldorf one. look who’s in it.</p>
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
        <h2>My Ralph Lauren <em>cable knit</em></h2>
        <p class="note">camel, cozy, always in my bag. i get cold easily.</p>
        <p>It’s 100 degrees in Austin and 62 in every single classroom. The sweater comes to class, the library and every restaurant with the AC turned all the way up.</p>
        <div class="row"><button class="btn solid" type="button" id="wear">Put it on</button></div>`,

    notebooks: () => `
        <h2>My <em>Erin Condren</em> notebooks</h2>
        <p class="note">two custom ones. yes, i still take notes by hand.</p>
        <div class="ec-pair">
            <div class="ec-one">
                ${window.EC(['#5E7486', '#F3EDE3', '#C2407A', '#F4C6D2'])}
                <div class="ec-page"><p class="hand ec-h">my classes</p><ul class="hand">
                    <li>Web App Development</li><li>Full-Stack Web App Development</li><li>Database Management</li>
                    <li>Problem Solving &amp; Programming</li><li>Strategic IT Management</li><li>Intro to IT Management</li>
                    <li>Intro to Data Science</li><li>Intro to Decision Science</li><li>Statistics for Business</li>
                </ul></div>
            </div>
            <div class="ec-one">
                ${window.EC(['#C2407A', '#F4C6D2', '#8A9AA6', '#F3EDE3'])}
                <div class="ec-page"><p class="hand ec-h">notebook no. 2</p><p><span class="todo">what’s in this one?</span></p></div>
            </div>
        </div>
        <div class="row"><a class="btn" href="https://suhanitiwari.com/home/study#coursework" target="_blank" rel="noopener">All my coursework ↗</a></div>`,

    binder: () => `
        <h2>My <em>pink binder</em></h2>
        <p class="note">case readings in the front, my own case studies in the back</p>
        <div class="binder-open">
            <div class="rings" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="bpages">${[
                ['owala', 'Owala Marathon Series', 'Brand strategy', 'assets/img/owala.jpg'],
                ['starbucks', 'Starbucks app strategy', 'Product strategy', 'assets/img/starbucks.jpg'],
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
        <div class="ipad-big"><div class="ipad-screen">
            <div class="ipad-home" id="ipad-home">
                <button type="button" class="papp" data-ip="pinterest"><span class="ic" style="background:#E60023"><svg viewBox="0 0 40 40"><path d="M20 9 c-8 0 -11 6 -9 10 c1 2 2 2 2 1 c-1 -3 1 -7 7 -7 c5 0 6 3 5 6 c-1 4 -3 5 -5 5 c-2 0 -2 -2 -1 -3 l1 -4 m0 0 l-3 12" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg></span>Pinterest</button>
                <button type="button" class="papp" data-ip="procreate"><span class="ic" style="background:#1B1B1F"><svg viewBox="0 0 40 40"><path d="M10 30 c6 -2 10 -10 18 -20 c2 -3 6 0 4 3 c-8 10 -12 16 -20 19z" fill="#F4A7B9"/><circle cx="11" cy="30" r="3" fill="#B9A3E8"/></svg></span>Procreate</button>
                <button type="button" class="papp" data-ip="made"><span class="ic folder-ic">${['#F4A7B9', '#8FD19E', '#F7D54A', '#B9A3E8'].map(c => `<i style="background:${c}"></i>`).join('')}</span>Made by me</button>
            </div>
            <div class="ipad-view" id="ipad-view" hidden></div>
        </div></div>`,

    phone: () => `
        <h2>My <em>phone</em></h2>
        <p class="note">iphone 18 pro max in its pink case. lives in the sunglasses pocket.</p>
        <div class="phone-big">
            <div class="screen" id="screen">
                <p class="clock mono" id="clock"></p>
                <div class="home" id="home">
                    <button type="button" class="papp" data-app="photos"><span class="ic ic-photos"><svg viewBox="0 0 40 40">${[0, 45, 90, 135, 180, 225, 270, 315].map((r, i) => `<ellipse cx="20" cy="11" rx="5" ry="9" fill="${['#F7D54A', '#F29B6B', '#E84393', '#B9A3E8', '#2E86DE', '#18A39A', '#27AE60', '#C7E3A1'][i]}" opacity=".85" transform="rotate(${r} 20 20)"/>`).join('')}</svg></span>Photos</button>
                    <button type="button" class="papp" data-app="instagram"><span class="ic ic-ig"><svg viewBox="0 0 40 40"><rect x="9" y="9" width="22" height="22" rx="7" fill="none" stroke="#fff" stroke-width="3"/><circle cx="20" cy="20" r="5.5" fill="none" stroke="#fff" stroke-width="3"/><circle cx="26.5" cy="13.5" r="1.6" fill="#fff"/></svg></span>Instagram</button>
                    <button type="button" class="papp" data-app="linkedin"><span class="ic ic-li"><svg viewBox="0 0 40 40"><rect x="10" y="15" width="20" height="14" rx="2" fill="none" stroke="#fff" stroke-width="3"/><path d="M16 15 v-3 h8 v3" fill="none" stroke="#fff" stroke-width="3"/></svg></span>LinkedIn</button>
                    <button type="button" class="papp" data-app="spotify"><span class="ic ic-sp"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="#111"/><path d="M13 16 q8 -3 15 1 M14 21 q6 -2 12 1 M15 25.5 q5 -1.5 9 .5" fill="none" stroke="#1ED760" stroke-width="2.4" stroke-linecap="round"/></svg></span>Spotify</button>
                    <button type="button" class="papp" data-app="youtube"><span class="ic ic-yt"><svg viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="16" rx="5" fill="#fff"/><path d="M18 16 v8 l7 -4z" fill="#E62117"/></svg></span>YouTube</button>
                    <button type="button" class="papp" data-app="netflix"><span class="ic ic-nf"><svg viewBox="0 0 40 40"><path d="M14 9 v22 M14 9 l12 22 M26 9 v22" fill="none" stroke="#E50914" stroke-width="4" stroke-linejoin="round"/></svg></span>Netflix</button>
                    <button type="button" class="papp" data-app="prime"><span class="ic ic-pv"><svg viewBox="0 0 40 40"><text x="20" y="20" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="9" fill="#fff">prime</text><path d="M11 25 q9 5 18 0" fill="none" stroke="#1FA8E0" stroke-width="2" stroke-linecap="round"/></svg></span>Prime</button>
                    <button type="button" class="papp" data-app="calendar"><span class="ic ic-cal"><svg viewBox="0 0 40 40"><rect x="7" y="8" width="26" height="25" rx="3" fill="#fff"/><path d="M7 14 h26" stroke="#1A73E8" stroke-width="4"/><text x="20" y="29" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="11" fill="#1A73E8">${new Date().getDate()}</text></svg></span>Calendar</button>
                    <button type="button" class="papp" data-app="duolingo"><span class="ic ic-duo"><svg viewBox="0 0 40 40"><ellipse cx="20" cy="23" rx="12" ry="11" fill="#fff"/><circle cx="15.5" cy="21" r="4" fill="#fff" stroke="#3C3C3C" stroke-width="1"/><circle cx="24.5" cy="21" r="4" fill="#fff" stroke="#3C3C3C" stroke-width="1"/><circle cx="16" cy="21.5" r="2" fill="#3C3C3C"/><circle cx="24" cy="21.5" r="2" fill="#3C3C3C"/><path d="M18 26 l2 2.5 2 -2.5z" fill="#FFC800"/></svg></span>Duolingo</button>
                </div>
                <div class="app-view" id="app-view" hidden></div>
            </div>
        </div>`,

    passport: () => `
        <h2>My <em>passport</em> <span class="mono" style="font-size:.7rem; color:var(--muted)">United States of America</span></h2>
        <p class="note">six countries so far. the domestic trips live in my itineraries.</p>
        <div class="stamps">${[
            ['Thailand', '2010', '#C2185B', 'circle', '<path d="M0 -14 L-10 8 h20 Z M-4 -4 h8 M-6 2 h12" fill="none"/><path d="M0 -20 v6"/>'],
            ['Malaysia', '2010', '#1F6FD1', 'rect', '<path d="M-8 12 V-8 l2 -6 2 6 V12 M4 12 V-8 l2 -6 2 6 V12 M-4 -2 h8"/>'],
            ['Switzerland', '2016', '#D63031', 'oval', '<path d="M-16 10 L-6 -8 L0 2 L6 -10 L16 10Z" fill="none"/><path d="M-3 -2 h6 M0 -5 v6"/>'],
            ['France', '2016', '#2E4A7A', 'rect', '<path d="M0 -16 L-8 12 M0 -16 L8 12 M-5 2 h10 M-7 8 h14"/>'],
            ['Italy', '2016', '#18A39A', 'circle', '<rect x="-5" y="-14" width="10" height="26" rx="2" transform="rotate(5)" fill="none"/><path d="M-5 -6 h10 M-5 2 h10" transform="rotate(5)"/>'],
            ['Mexico', '2020', '#F0592B', 'oval', '<path d="M0 12 V-12 M0 -2 h-7 v-6 M0 4 h7 v-8" fill="none"/>']
        ].map(([n, yr, c, shape, icon], i) => `<span class="stamp real" style="--r:${[-8, 6, -3, 9, -6, 4][i]}deg; --c:${c}">
            <svg viewBox="0 0 120 92" aria-label="${n}, ${yr}">
                ${shape === 'circle' ? '<circle cx="60" cy="46" r="40"/><circle cx="60" cy="46" r="34"/>' : shape === 'oval' ? '<ellipse cx="60" cy="46" rx="54" ry="38"/><ellipse cx="60" cy="46" rx="48" ry="32"/>' : '<rect x="8" y="8" width="104" height="76" rx="6"/><rect x="14" y="14" width="92" height="64" rx="4"/>'}
                <g transform="translate(60 ${shape === 'rect' ? 40 : 42}) scale(.85)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
                <text x="60" y="${shape === 'rect' ? 72 : 66}" text-anchor="middle" style="font-size:${n.length > 8 ? 9 : 10.5}px">${n.toUpperCase()}</text>
                <text x="60" y="${shape === 'rect' ? 24 : 27}" text-anchor="middle" class="small yr">${yr}</text>
            </svg></span>`).join('')}</div>
        <div class="row"><a class="btn" href="https://suhanitiwari.com/home/make#traveling" target="_blank" rel="noopener">My itineraries (Chicago, New York) ↗</a></div>`,

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
            <div class="pouch-front">${front}</div>
        </div>
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

function cardHTML(c, i) {
    if (c.kind === 'bofadebit') return `
        <button class="card bofadebit" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <span class="bofa-top"><span class="chip"></span><svg class="tap" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7 q4 5 0 10 M12 5 q6 7 0 14 M16 3 q8 9 0 18" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span>
            <span class="bofa-bank">BANK OF AMERICA</span>
            <span class="foot"><span>SUHANI TIWARI</span><span class="visa"><b>VISA</b> Debit</span></span>
        </button>`;
    if (c.kind === 'amexgold') return `
        <button class="card amexgold" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <svg class="facet" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path d="M30 60 L62 4 L100 30 Z" fill="#fff" opacity=".22"/><path d="M62 4 L100 30 L70 26 Z" fill="#fff" opacity=".35"/><path d="M30 60 L70 26 L100 30 Z" fill="#8A6A2A" opacity=".18"/></svg>
            <span class="amex-top"><span class="amex-word">AMERICAN EXPRESS</span><span class="sky">SKYMILES</span></span>
            <span class="chip"></span>
            <span class="foot"><span>SUHANI TIWARI</span><span>MEMBER ♡</span></span>
        </button>`;
    if (c.kind === 'amexblue') return `
        <button class="card amexblue" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <span class="amex-top"><span></span><span class="amex-word big">AMERICAN<br>EXPRESS</span></span>
            <span class="amex-mid"><span class="chip"></span><span class="ribbon">MEMBER SINCE <b>♡</b></span></span>
            <span class="foot"><span>SUHANI TIWARI</span><svg viewBox="0 0 24 24" style="width:9%" aria-hidden="true"><path d="M8 7 q4 5 0 10 M12 5 q6 7 0 14 M16 3 q8 9 0 18" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span>
        </button>`;
    if (c.kind === 'bofa') return `
        <button class="card bofa" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <span class="bofa-top"><span class="chip"></span><svg class="tap" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7 q4 5 0 10 M12 5 q6 7 0 14 M16 3 q8 9 0 18" fill="none" stroke="#5E6670" stroke-width="1.8" stroke-linecap="round"/></svg></span>
            <span class="bofa-bank">BANK OF AMERICA</span>
            <span class="foot"><span>SUHANI TIWARI</span><span class="visa"><b>VISA</b> Signature</span></span>
        </button>`;
    if (c.kind === 'dl') return `
        <button class="card dl" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title} (a joke one)">
            <span class="dl-head"><span class="dl-state">Texas<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 l4.6 10.4 11.2 1 -8.5 7.4 2.6 11 -9.9 -5.9 -9.9 5.9 2.6 -11 -8.5 -7.4 11.2 -1z" fill="#F4A7B9" stroke="#3A2626" stroke-width="2"/></svg></span><span class="t">Driver license</span></span>
            <span class="dl-body">
                <span class="dl-photo"><img src="assets/img/me.jpg" alt=""><span class="dl-sig">Suhani Tiwari</span></span>
                <span class="dl-fields">
                    <span><i>name</i> Suhani Tiwari</span>
                    <span><i>dob</i> a lady never tells</span>
                    <span><i>hgt</i> 5′6″</span>
                    <span><i>weight</i> don’t ask</span>
                    <span><i>eyes</i> dreamy</span>
                    <span><i>hair</i> dark, long, and always done</span>
                    <span><i>address</i> wouldn’t you wanna knowwww</span>
                    <span><i>class</i> C (for cute)</span>
                </span>
            </span>
        </button>`;
    if (c.kind === 'id') return `
        <button class="card id" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <span class="ut-left">
                <span class="ut-word">TEXAS</span>
                <span class="ut-sub">The University of Texas at Austin</span>
                <span class="ut-name">SUHANI TIWARI</span>
                <span class="ut-role">STUDENT</span>
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
    romcom: () => {
        let days = 21;
        $('#rc-read').onclick = () => {
            const rc = $('#rc'); if (rc.classList.contains('open')) return;
            rc.classList.add('open'); $('#rc-read').disabled = true;
            setTimeout(() => { rc.classList.remove('open'); $('#rc-read').disabled = false; $('#rc-days').textContent = ++days; toast(days === 22 ? 'tomorrow. definitely tomorrow ♡' : 'okay… tomorrow. for real this time.'); }, reduce ? 300 : 1800);
        };
    },
    hairpony: () => hairAfter('pony'),
    hairclaw: () => hairAfter('claw'),
    haircomb: () => hairAfter('comb'),

    makeup: () => setTimeout(() => $('#lip') && $('#lip').classList.add('off'), 350),
    phone: () => {
        const d = new Date();
        $('#clock').textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
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
        $('#mpull').onclick = toggle;
        bag.querySelector('.mbag-front svg').onclick = () => { if (!bag.classList.contains('open')) toggle(); };
        bag.querySelectorAll('.mk').forEach(b => b.onclick = () => {
            if (b.dataset.mk === 'foundation') {
                b.classList.remove('squeeze'); void b.offsetWidth; b.classList.add('squeeze');
                const sw = $('#swatch'); sw.classList.remove('on'); void sw.offsetWidth; sw.classList.add('on');
                $('#swatch-label').textContent = '6 Neutral. my shade ♡';
                return;
            }
            if (b.dataset.mk === 'brushes' || b.dataset.mk === 'concealer' || b.dataset.mk === 'foundation') return pickUp({ id: 'makeup', name: { brushes: 'morphe brushes', concealer: 'hourglass vanish concealer', foundation: 'charlotte tilbury beautiful skin, 6n' }[b.dataset.mk], open: 'makeup' });
            pickUp(ITEMS.find(i => i.id === b.dataset.mk));
        });
        $('#see-makeup2').onclick = () => pickUp({ id: 'makeup', name: 'my makeup', open: 'makeup' });
    },
    ipad: () => {
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
        const open = () => { if ($('#vclose')) $('#vclose').textContent = 'Close the wallet'; vw.classList.add('open'); vw.querySelector('.vw-open').removeAttribute('aria-hidden'); $('#snap').tabIndex = -1; };
        // closing, like the real trifold: left side folds in, then the flap folds over, then it snaps
        const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
        let closing = false;
        const close = async () => {
            if (closing || !vw.classList.contains('open')) return;
            closing = true;
            vw.classList.remove('cash-out');
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
        $('#snap').onclick = open;
        // the zipper: the pull slides down, the teeth open, then the cash comes out (and the reverse)
        let zipping = false;
        $('#vzip').onclick = async () => {
            if (zipping) return; zipping = true;
            const z = $('#vzip');
            if (!vw.classList.contains('zip-open')) {
                vw.classList.add('zip-open'); z.setAttribute('aria-pressed', 'true'); z.setAttribute('aria-label', 'Zip pocket: zip it back up');
                await new Promise(r => setTimeout(r, reduce ? 0 : 480));
                vw.classList.add('cash-out'); toast('rupees for home, dollars for here ♡');
            } else {
                vw.classList.remove('cash-out');
                await new Promise(r => setTimeout(r, reduce ? 0 : 420));
                vw.classList.remove('zip-open'); z.setAttribute('aria-pressed', 'false'); z.setAttribute('aria-label', 'Zip pocket: unzip for cash');
            }
            zipping = false;
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
            card.closest('.vslot').style.zIndex = 30;
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

    mirror: () => setTimeout(() => { const lid = $('#lid'); if (lid) lid.style.transform = 'rotateX(170deg)'; }, reduce ? 0 : 450),

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
    setTimeout(() => { pens.classList.add('open'); note.textContent = pens.dataset.pick; }, reduce ? 0 : 400);
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
