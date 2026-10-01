/* What's in my bag? Tap the bag, everything falls out (stop-motion style), tap anything to pick it up. */
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
list.innerHTML = ITEMS.map(it => `
    <li class="item" id="item-${it.id}" style="--l:${it.l}%; --t:${it.t}%; --w:${it.w}%; --r:${it.r}deg">
        <button type="button" data-item="${it.id}" aria-label="${it.name}" tabindex="-1">
            <span class="art">${it.art}</span><span class="tag">${it.name}</span>
        </button>
    </li>`).join('');

let isOpen = false, busy = false;
bagBtn.addEventListener('click', e => { if (!e.target.closest('.charm')) isOpen ? pickUp({ id: 'bag', name: 'my backpack', open: 'bag' }) : spill(); });

// out it all comes, one thing at a time, like stop motion
async function spill() {
    if (busy) return; busy = true;
    isOpen = true;
    bagArt.innerHTML = BAG.open;
    stage.classList.add('open');
    bagBtn.setAttribute('aria-expanded', 'true');
    bagBtn.setAttribute('aria-label', 'My backpack, now open');
    $('#bag-hint').textContent = '';
    const bagBox = bagBtn.getBoundingClientRect();
    for (const it of ITEMS) {
        const li = document.getElementById('item-' + it.id);
        li.classList.add('out');
        li.querySelector('button').tabIndex = 0;
        if (!reduce) {
            const box = li.getBoundingClientRect();
            const dx = phone() ? 0 : bagBox.left + bagBox.width / 2 - (box.left + box.width / 2);
            const dy = phone() ? -40 : bagBox.top + bagBox.height * .35 - (box.top + box.height / 2);
            const base = phone() ? '' : 'translate(-50%, -50%) ';
            li.animate([
                { transform: `${base}translate(${dx}px, ${dy}px) scale(.15) rotate(${it.r * 4}deg)`, opacity: 0 },
                { transform: `${base}translate(${dx * .45}px, ${dy * .45 - 60}px) scale(.8) rotate(${-it.r * 2}deg)`, opacity: 1, offset: .55 },
                { transform: `${base}rotate(${it.r}deg)`, opacity: 1 }
            ], { duration: 620, easing: 'steps(7, end)', fill: 'none' });
            await new Promise(r => setTimeout(r, 170));
        }
    }
    $('#after').hidden = false;
    busy = false;
}

// back in the bag
$('#repack').addEventListener('click', () => {
    if (busy) return;
    ITEMS.forEach(it => {
        const li = document.getElementById('item-' + it.id);
        li.classList.remove('out');
        li.querySelector('button').tabIndex = -1;
    });
    stage.classList.remove('open');
    bagArt.innerHTML = BAG.closed;
    bagBtn.setAttribute('aria-expanded', 'false');
    bagBtn.removeAttribute('aria-label');
    $('#bag-hint').textContent = 'tap to open ↓';
    $('#after').hidden = true;
    document.body.classList.remove('shades');
    isOpen = false;
    bagBtn.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
});

list.addEventListener('click', e => {
    const b = e.target.closest('[data-item]');
    if (b) pickUp(ITEMS.find(i => i.id === b.dataset.item));
});

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
    bag: () => `
        <h2>My <em>backpack</em></h2>
        <p class="note">it goes everywhere with me. class, work, coffee, back to class.</p>
        <p>Everything I actually carry is on the table. Tap any of it. Or ask Sitara, the little charm hanging off the zipper.</p>`,

    makeup: () => `
        <div class="lipstick-big" id="lip">${ITEMS.find(i => i.id === 'lipstick').art.replace('<rect x="18" y="60"', '<g class="cap"><rect x="18" y="60"').replace('<path d="M22 60', '</g><path d="M22 60')}</div>
        <h2>Makeup: <em>loves &amp; skips</em></h2>
        <p class="note">all of it lives in my victoria’s secret makeup pouch</p>
        <div class="lists">
            <div class="love"><h3>always in my bag</h3><ul>
                <li><b>Westman Atelier HydroBalm Tinted Lipstick, Glögg.</b> Sheer black cherry. My favorite lipstick, period.</li>
                <li><b>Lancôme Lash Idôle mascara.</b> My favorite mascara. Lifts without the clumps.</li>
                <li><b>Morphe brushes.</b> My favorite brushes, full stop.</li>
                <li><span class="todo">add another love</span></li>
            </ul></div>
            <div class="skip"><h3>not for me</h3><ul>
                <li><span class="todo">add a skip</span></li>
                <li><span class="todo">add a skip</span></li>
            </ul></div>
        </div>`,

    sketchbook: () => `
        <div class="spread" id="spread">
            <div class="l"><img id="art-img" src="" alt=""></div>
            <div class="r"><h3 id="art-title"></h3><p id="art-note"></p><p class="mono" id="art-num" style="color:var(--muted)"></p></div>
        </div>
        <div class="row" style="justify-content:space-between"><button class="btn" type="button" id="art-prev">← previous page</button><button class="btn solid" type="button" id="art-next">next page →</button></div>`,

    wallet: () => `
        <h2>My <em>wallet</em></h2>
        <p class="note">tap the gold snap. everything important is in here.</p>
        <div class="wallet-scene">
            <div class="wallet" id="wallet">
                <div class="body"><span class="inside-name">SUHANI</span></div>
                <div class="cards">${CARDS.map((c, i) => cardHTML(c, i)).join('')}</div>
                <div class="flap"></div>
                <span class="name">SUHANI</span>
                <button class="snap" type="button" id="snap" aria-label="Open the wallet"></button>
            </div>
        </div>
        <div class="card-detail" id="card-detail" aria-live="polite"><p class="hand" style="font-size:1.4rem; color:var(--plum); text-align:center">pick a card, any card</p></div>`,

    mildliners: () => penView({
        title: 'My <em>Mildliner</em> pouch', note: 'a whole pouch just for highlighters. each one is a tool i actually use.',
        list: PENS, front: ITEMS.find(i => i.id === 'pouch').art, pick: 'pick a highlighter',
        pen: c => `<svg viewBox="0 0 34 190"><rect x="5" y="30" width="24" height="132" rx="5" fill="#FFFDF9" stroke="#3A2626" stroke-width="3"/><rect x="5" y="4" width="24" height="32" rx="6" fill="${c}" stroke="#3A2626" stroke-width="3"/><rect x="5" y="158" width="24" height="28" rx="6" fill="${c}" stroke="#3A2626" stroke-width="3"/><path d="M11 50 h12 M11 142 h12" stroke="${c}" stroke-width="3"/></svg>`
    }),

    gelpens: () => penView({
        title: 'My <em>Paper Mate</em> pouch', note: 'my gel pens. each one is one of my top five CliftonStrengths.',
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
        <div class="fob" id="fob">${ITEMS.find(i => i.id === 'keys').art}</div>
        <h2>My BMW keys</h2>
        <p class="note">full disclosure: i am not a good driver. whoops.</p>
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
        <h2>My <em>laptop</em></h2>
        <p class="note">the stickers are load-bearing. tap one.</p>
        <div class="lid-wrap">${LID(true)}<p class="stk-label hand" id="stk-label" aria-live="polite">every sticker opens something</p></div>
        <p class="mono" style="color:var(--plum); margin:22px 0 10px">Or open a folder</p>
        <div class="folders">${PROJECTS.map(p => `
            <a class="folder" href="${p.href}" target="_blank" rel="noopener" style="--c:${p.c}">
                <span class="f"><img src="${p.img}" alt=""></span>
                <b>${p.name}</b><small>${p.tag}</small>
            </a>`).join('')}</div>`,

    mirror: () => `
        <div class="compact" id="compact" style="position:relative; width:220px; height:220px; margin:0 auto 14px; perspective:700px">
            <div style="position:absolute; inset:0; border-radius:50%; border:3px solid var(--ink); background:#EDEFF2; overflow:hidden; box-shadow: inset 0 0 0 10px #141011">
                <img src="assets/img/me.jpg" alt="Me, in the mirror" style="width:100%; height:100%; object-fit:cover; opacity:.92; filter: saturate(.9)">
                <span style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,.55), transparent 45%)"></span>
            </div>
            <div id="lid" style="position:absolute; inset:0; border-radius:50%; border:3px solid var(--ink); background:#141011; transform-origin:50% 0; transition: transform 1s cubic-bezier(.2,.8,.2,1); display:grid; place-items:center">
                <span style="width:34%; aspect-ratio:1; border-radius:50%; border:5px solid #E9E4DF"></span>
            </div>
        </div>
        <h2>Mirror, mirror: <em>the real me</em></h2>
        <p class="note">my chanel double-facet mirror. look who’s in it.</p>
        <p>I’m Suhani. I study Management Information Systems and Psychology at UT Austin’s McCombs School of Business. I study why people choose what they choose, then build what they’d choose.</p>
        <p>I’m also a published children’s book author, the founder of two Girls Who Code chapters, and a digital artist who paints about growing up between two worlds.</p>
        <div class="row"><a class="btn solid" href="https://suhanitiwari.com" target="_blank" rel="noopener">My portfolio ↗</a></div>`,

    stanley: () => `
        <h2>My pink <em>Stanley</em></h2>
        <p class="note">the all day slim bottle, in the bow print. do i drink enough water? no.</p>
        <p class="mono" style="color:var(--plum); margin:18px 0 8px">Today’s water, honestly</p>
        <div class="cups" id="cups" style="display:flex; gap:8px; flex-wrap:wrap">${Array.from({ length: 8 }, (_, i) => `<span class="cup${i < 2 ? ' full' : ''}" style="width:34px; height:44px; border:2.5px solid var(--ink); border-radius:4px 4px 10px 10px; background:${i < 2 ? 'var(--pink)' : 'var(--paper)'}; transition:background .4s"></span>`).join('')}</div>
        <p class="hand" id="cup-note" style="font-size:1.4rem; color:var(--plum); margin:10px 0 0">2 of 8. we’re working on it.</p>
        <div class="row"><button class="btn solid" type="button" id="sip">Take a sip for me</button></div>`,

    sweater: () => `
        <h2>My <em>cable knit</em></h2>
        <p class="note">brown, cozy, always in my bag. i get cold easily.</p>
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
            <div class="pens" id="pens" data-pick="${pick}">${list.map((p, i) => `
                <button class="pen" type="button" style="--i:${i}; --mid:${(list.length - 1) / 2}" data-pen="${i}" aria-label="${p.name}">
                    ${pen(p.c)}<span class="lbl">${p.name}</span>
                </button>`).join('')}</div>
            <div class="pouch-front">${front}</div>
        </div>
        <p class="pen-note" id="pen-note" aria-live="polite">unzipping…</p>`;
}

function cardHTML(c, i) {
    if (c.kind === 'id') return `
        <button class="card id" type="button" style="--i:${i}; z-index:${10 - i}" data-card="${i}" aria-label="${c.title}">
            <span class="band"><span>The University of Texas at Austin</span></span>
            <span class="who"><img src="assets/img/me.jpg" alt=""><span><span class="big" style="display:block">${c.big}</span><span class="t">Student · McCombs</span></span></span>
            <span class="foot"><span>MIS + PSYCHOLOGY</span><span>CLASS OF 2027</span></span>
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
    makeup: () => setTimeout(() => $('#lip') && $('#lip').classList.add('off'), 350),

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
        const w = $('#wallet'), detail = $('#card-detail');
        const open = () => { w.classList.add('open'); $('#snap').setAttribute('aria-label', 'Wallet is open'); };
        $('#snap').onclick = open;
        w.querySelector('.flap').onclick = open;
        w.querySelectorAll('.card').forEach(card => card.onclick = () => {
            if (!w.classList.contains('open')) return open();
            const c = CARDS[+card.dataset.card];
            w.querySelectorAll('.card').forEach(x => x.classList.toggle('picked', x === card));
            detail.innerHTML = `<p class="mono" style="margin:0 0 4px; color:var(--muted)">${c.title}</p><h3>${c.kind === 'id' ? c.sub : c.big}</h3><p class="m">${c.metric}</p><p>${c.body}</p>`;
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
        say('Hi! I’m Sitara ✦ I live in Suhani’s caramel frappuccino charm (whipped cream included). Ask me anything about her.');
        $('#chips').onclick = async e => {
            const b = e.target.closest('[data-q]'); if (!b) return;
            await say(b.textContent, true);
            await new Promise(r => setTimeout(r, 350));
            say(answers[+b.dataset.q]);
        };
    }
};

/* ---------- little helpers ---------- */
function pensAfter(list) {
    const pens = $('#pens'), note = $('#pen-note');
    setTimeout(() => { pens.classList.add('open'); note.textContent = pens.dataset.pick; }, reduce ? 0 : 400);
    pens.onclick = e => {
        const b = e.target.closest('[data-pen]'); if (!b) return;
        const p = list[+b.dataset.pen];
        note.innerHTML = `<b style="font-family:var(--mono); font-size:.8rem; letter-spacing:.08em">${p.name.toUpperCase()}</b> · ${p.note}`;
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
