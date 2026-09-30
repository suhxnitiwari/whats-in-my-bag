/* What's in my bag? Tap the bag, everything falls out (stop-motion style), tap anything to pick it up. */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s);
const stage = $('#stage'), bagBtn = $('#bag'), bagArt = $('#bag-art'), list = $('#items');
const sheet = $('#sheet'), sheetBody = $('#sheet-body'), sheetLabel = $('#sheet-label');
const phone = () => matchMedia('(max-width: 760px)').matches;

/* ---------- the bag, with Sitara hanging off it as a charm ---------- */
bagArt.innerHTML = BAG.closed;
const charm = document.createElement('span');
charm.className = 'charm';
charm.setAttribute('role', 'button');
charm.setAttribute('tabindex', '0');
charm.setAttribute('aria-label', 'Sitara, my bag charm: ask her anything');
charm.innerHTML = '<img src="assets/img/sitara.jpg" alt="">';
bagBtn.appendChild(charm);
const openCharm = e => { e.stopPropagation(); e.preventDefault(); pickUp({ id: 'sitara', name: 'sitara, my bag charm', open: 'sitara' }); };
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

    pouch: () => `
        <h2>My <em>pencil pouch</em></h2>
        <p class="note">a whole lotta stationery. every pen is a tool i actually use.</p>
        <div class="pouch-scene">
            <div class="pens" id="pens">${PENS.map((p, i) => `
                <button class="pen" type="button" style="--i:${i}; --mid:${(PENS.length - 1) / 2}" data-pen="${i}" aria-label="${p.name}">
                    <svg viewBox="0 0 34 190"><rect x="3" y="20" width="28" height="150" rx="6" fill="${p.c}" stroke="#3A2626" stroke-width="3"/><rect x="3" y="4" width="28" height="22" rx="6" fill="#3A2626"/><path d="M8 170 L17 188 L26 170Z" fill="#F7E3C8" stroke="#3A2626" stroke-width="3" stroke-linejoin="round"/></svg>
                    <span class="lbl">${p.name}</span>
                </button>`).join('')}</div>
            <div class="pouch-front">${ITEMS.find(i => i.id === 'pouch').art}</div>
        </div>
        <p class="pen-note" id="pen-note" aria-live="polite">unzipping…</p>`,

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
        <p class="note">the stickers are load-bearing. here’s what’s on it.</p>
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
        <h2>My <em>notebooks</em></h2>
        <p class="note">one for every class. yes, i still take notes by hand.</p>
        <div class="folders">${[
            ['Web App Development', '#F2C6C8'], ['Full-Stack Web Apps', '#CFE3F3'], ['Database Management', '#CDE6D0'],
            ['Problem Solving & Programming', '#F8E7A9'], ['Strategic IT Management', '#D9C8F0'], ['Intro to Data Science', '#F4A7B9'],
            ['Decision Science', '#DDE2CF'], ['Statistics for Business', '#F2C6C8']
        ].map(([n, c]) => `<span class="folder" style="--c:${c}; cursor:default"><span class="f" style="display:grid; place-items:center"><span class="hand" style="font-size:1.3rem; text-align:center; padding:8px; line-height:1.05">${n}</span></span></span>`).join('')}</div>
        <div class="row"><a class="btn" href="https://suhanitiwari.com/home/study#coursework" target="_blank" rel="noopener">All my coursework ↗</a></div>`,

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

    pouch: () => {
        const pens = $('#pens'), note = $('#pen-note');
        setTimeout(() => { pens.classList.add('open'); note.textContent = 'pick a pen'; }, reduce ? 0 : 400);
        pens.onclick = e => {
            const b = e.target.closest('[data-pen]'); if (!b) return;
            const p = PENS[+b.dataset.pen];
            note.innerHTML = `<b style="font-family:var(--mono); font-size:.8rem; letter-spacing:.08em">${p.name.toUpperCase()}</b> · ${p.note}`;
        };
    },

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
        say('Hi! I’m Sitara ✦ I live on Suhani’s bag. Ask me anything about her.');
        $('#chips').onclick = async e => {
            const b = e.target.closest('[data-q]'); if (!b) return;
            await say(b.textContent, true);
            await new Promise(r => setTimeout(r, 350));
            say(answers[+b.dataset.q]);
        };
    }
};

/* ---------- little helpers ---------- */
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
