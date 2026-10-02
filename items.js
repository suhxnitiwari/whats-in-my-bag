/* Everything in my bag. Each thing has:
   id, name (the hover tag), where it lands once it falls out (l, t, w, r: left/top/width as % of the table, rotation),
   art (a doodle for now; swap in a photo of the real thing any time with  art: '<img src="assets/img/....png" alt="">'),
   and open(), what you see when you pick it up. */

const INK = '#3A2626';
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

window.BAG = {
    /* my real backpack: black Samsonite, red accents. Four zippers, back to front:
       devices (laptop + iPad), main (notebooks, pens, makeup), the sunglasses pocket up top, the front pocket */
    pockets: [
        { id: 'devices', label: 'laptop, ipad, headphones, wallet & passport', d: 'M52 104 C52 40 248 40 248 104' },
        { id: 'main', label: 'notebooks, pens & makeup', d: 'M66 124 C66 68 234 68 234 124' },
        { id: 'shades', label: 'sunglasses pocket', d: 'M96 148 C110 132 190 132 204 148' },
        { id: 'front', label: 'makeup, skincare, hair & the little things', d: 'M80 196 C84 176 216 176 220 196' }
    ],
    closed: `<svg viewBox="0 0 300 350" aria-hidden="true" class="bag-svg">
        <path d="M118 46 C118 12 182 12 182 46" fill="none" ${S} stroke-width="14"/>
        <path d="M118 46 C118 12 182 12 182 46" fill="none" stroke="#35323A" stroke-width="7" stroke-linecap="round"/>
        <rect x="36" y="40" width="228" height="298" rx="58" fill="#1C1A1E" ${S}/>
        <path d="M48 120 C48 60 252 60 252 120 L252 330 L48 330Z" fill="#232126"/>
        <path d="M80 150 C80 120 220 120 220 150 L220 176 L80 176Z" fill="#2B292E" ${S} stroke-width="2.5"/>
        <rect x="134" y="152" width="32" height="8" rx="2.5" fill="#B9BCC2" ${S} stroke-width="1.5"/>
        <path d="M98 156 l10 10 M202 156 l-10 10" stroke="#D23B3B" stroke-width="4" stroke-linecap="round"/>
        <rect x="70" y="182" width="160" height="140" rx="38" fill="#2B292E" ${S}/>
        <rect x="140" y="198" width="20" height="112" rx="8" fill="#3A373E" ${S} stroke-width="2.5"/>
        <path d="M140 228 h20 M140 292 h20" stroke="#D23B3B" stroke-width="4"/>
        <g class="zips"></g>
    </svg>`,
    /* my McCombs keychain (a stand-in drawing until I swap in a photo of the real one) */
    /* my McCombs keychain: a burnt-orange woven strap (black on the back), on a silver carabiner */
    mccombs: `<svg viewBox="0 0 50 160" aria-hidden="true">
        <path d="M18 4 h12 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 h-12 a8 8 0 0 1 -8 -8 v-18 a8 8 0 0 1 8 -8z" fill="none" stroke="#B9BCC2" stroke-width="4"/>
        <path d="M18 4 h12 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 h-12 a8 8 0 0 1 -8 -8 v-18 a8 8 0 0 1 8 -8z" fill="none" stroke="#3A2626" stroke-width="1.2"/>
        <path d="M12 12 l10 14" stroke="#D8DBDF" stroke-width="3" stroke-linecap="round"/>
        <path d="M17 36 h18 l1 8 H16z" fill="#C9CDD2" stroke="#3A2626" stroke-width="1.5"/>
        <path d="M13 44 h26 v108 l-3 -2 -3 2 -3 -2 -3 2 -3 -2 -3 2 -3 -2 -2 2z" fill="#1A1718" stroke="#3A2626" stroke-width="2"/>
        <path d="M17 44 h22 v108 h-22z" fill="#C2661C" stroke="#3A2626" stroke-width="2"/>
        <path d="M17 44 l3 4 3 -3 3 4 3 -3 3 4 3 -3 4 3" fill="none" stroke="#8E4510" stroke-width="1.2" opacity=".7"/>
        <g transform="translate(31 56) rotate(90)" fill="#FFF7EE">
            <text x="0" y="0" font-family="Bodoni Moda, serif" font-size="11" letter-spacing=".3">TEXAS McCombs</text>
            <text x="2" y="6.5" font-family="Instrument Sans, sans-serif" font-size="3.4" opacity=".9">The University of Texas at Austin</text>
            <text x="2" y="10.5" font-family="Instrument Sans, sans-serif" font-size="3.4" opacity=".9">McCombs School of Business</text>
        </g>
        <path d="M20 50 v96" stroke="#fff" stroke-width="1.4" opacity=".18"/>
    </svg>`,
    /* my bag charm: a Bath & Body Works caramel frappuccino PocketBac holder (whipped cream, smiles back),
       with a White Barn Cozy Vanilla Almond hand sanitizer inside, gold cap poking out the bottom */
    charm: `<svg viewBox="0 0 90 120" aria-hidden="true">
        <circle cx="45" cy="8" r="7" fill="none" stroke="#B9BCC2" stroke-width="4"/>
        <path d="M45 15 v10" stroke="#B9BCC2" stroke-width="4"/>
        <path d="M18 44 C14 26 32 20 40 26 C46 16 64 18 66 30 C78 30 80 44 70 48 Z" fill="#FFF8EE" ${S} stroke-width="2.5"/>
        <path d="M22 40 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 10 0" fill="none" stroke="#C98A3E" stroke-width="3.4" stroke-linecap="round"/>
        <rect x="52" y="22" width="14" height="12" rx="2" fill="#F2C572" ${S} stroke-width="2" transform="rotate(12 59 28)"/>
        <rect x="18" y="46" width="52" height="50" rx="10" fill="#F4F2F0" ${S} stroke-width="2.5"/>
        <path d="M70 56 q16 0 16 14 q0 14 -16 14" fill="none" ${S} stroke-width="5"/>
        <path d="M70 56 q16 0 16 14 q0 14 -16 14" fill="none" stroke="#F4F2F0" stroke-width="2"/>
        <circle cx="34" cy="66" r="2.6" fill="${INK}"/><circle cx="54" cy="66" r="2.6" fill="${INK}"/>
        <path d="M36 76 q8 7 16 0" fill="none" ${S} stroke-width="2.5"/>
        <rect x="22" y="80" width="44" height="18" rx="4" fill="#E2A257" opacity=".55"/><g fill="#5B3A20" opacity=".6"><circle cx="30" cy="88" r="1.3"/><circle cx="44" cy="84" r="1.1"/><circle cx="56" cy="90" r="1.3"/><circle cx="38" cy="93" r="1"/></g><path d="M20 96 h48 v8 c0 8 -8 12 -24 12 c-16 0 -24 -4 -24 -12z" fill="#C8994E" ${S} stroke-width="2.5"/><path d="M28 100 q8 -3 16 0" fill="none" stroke="#F1D49A" stroke-width="2" stroke-linecap="round"/>
    </svg>`
};

/* a satin scrunchie: puffy ruffles around a hole, with a sheen on each ruffle */
window.SCRUNCHIE = (cx, cy, r, c, dark, light) => {
    const n = 9, out = [];
    for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + (k % 2 ? .12 : 0), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, deg = a * 180 / Math.PI + 90, rr = r * (k % 2 ? .62 : .7);
        out.push(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})"><ellipse rx="${(rr * 1.05).toFixed(1)}" ry="${(rr * .82).toFixed(1)}" fill="${c}" stroke="#3A2626" stroke-width="2"/><path d="M${(-rr * .6).toFixed(1)} ${(-rr * .25).toFixed(1)} q${(rr * .5).toFixed(1)} ${(-rr * .55).toFixed(1)} ${(rr * 1.1).toFixed(1)} ${(-rr * .1).toFixed(1)}" fill="none" stroke="${light}" stroke-width="${(rr * .28).toFixed(1)}" stroke-linecap="round" opacity=".85"/><path d="M${(-rr * .2).toFixed(1)} ${(rr * .2).toFixed(1)} q${(rr * .2).toFixed(1)} ${(rr * .35).toFixed(1)} ${(rr * .55).toFixed(1)} ${(rr * .3).toFixed(1)}" fill="none" stroke="${dark}" stroke-width="1.6" stroke-linecap="round"/></g>`);
    }
    return out.join('') + `<circle cx="${cx}" cy="${cy}" r="${(r * .42).toFixed(1)}" fill="#FAF1EF" stroke="${dark}" stroke-width="1.5"/>`;
};
window.SCR_PINK = ['#F6B3B5', '#D98A8E', '#FFE3E2'];
window.SCR_BROWN = ['#B26B55', '#7E4535', '#E2A891'];

/* my three chargers, always knotted together at the very bottom of the bag.
   each cable is a list of points; t = 0 is the knot, t = 1 is laid out straight */
window.CHARGERS = (() => {
    const C = [
        { id: 'mac', name: 'macbook charger', col: '#F4F3F0', lane: 345 },
        { id: 'phone', name: 'iphone charger', col: '#E6E4E1', lane: 300 },
        { id: 'head', name: 'headphone charger', col: '#EFE6D6', lane: 258 }
    ];
    const N = 13;
    C.forEach((c, k) => {
        c.knot = Array.from({ length: N }, (_, i) => {
            if (i === 0) return [[120, 230, 300][k], [70, 250, 90][k]];
            if (i === N - 1) return [[300, 90, 130][k], [235, 205, 60][k]];
            const a = k * 2.1 + i * 1.75, r = 22 + 34 * Math.abs(Math.sin(i * 1.27 + k * 1.9));
            return [200 + r * Math.cos(a), 150 + r * .8 * Math.sin(a)];
        });
        c.flat = Array.from({ length: N }, (_, i) => [60 + i * (290 / (N - 1)), c.lane + Math.sin(i * 1.1 + k) * 6]);
    });
    const at = (c, t) => c.knot.map((p, i) => [p[0] + (c.flat[i][0] - p[0]) * t, p[1] + (c.flat[i][1] - p[1]) * t]);
    const smooth = P => P.reduce((d, p, i) => {
        if (!i) return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
        const a = P[i - 2] || P[i - 1], b = P[i - 1], n = P[i + 1] || p;
        return d + ` C${(b[0] + (p[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (p[1] - a[1]) / 6).toFixed(1)} ${(p[0] - (n[0] - b[0]) / 6).toFixed(1)} ${(p[1] - (n[1] - b[1]) / 6).toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    }, '');
    const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    // the plug you pull (usb-c), and what's on the other end
    const plug = (p, q) => `<g transform="translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${ang(q, p).toFixed(1)})"><rect x="-2" y="-6" width="18" height="12" rx="3" fill="#FAFAF8" stroke="#3A2626" stroke-width="2"/><rect x="16" y="-3.5" width="8" height="7" rx="1.5" fill="#C9CCD2" stroke="#3A2626" stroke-width="1.4"/></g>`;
    const tail = (c, p, q) => c.id === 'mac'
        ? `<g transform="translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${ang(q, p).toFixed(1)})"><rect x="-34" y="-20" width="38" height="40" rx="8" fill="#FBFBF9" stroke="#3A2626" stroke-width="2.2"/><circle cx="-15" cy="0" r="4" fill="#E2E2DE"/><rect x="-44" y="-8" width="10" height="4" fill="#C9CCD2" stroke="#3A2626" stroke-width="1"/><rect x="-44" y="4" width="10" height="4" fill="#C9CCD2" stroke="#3A2626" stroke-width="1"/></g>`
        : c.id === 'phone'
            ? `<g transform="translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${ang(q, p).toFixed(1)})"><rect x="-24" y="-13" width="26" height="26" rx="6" fill="#FBFBF9" stroke="#3A2626" stroke-width="2.2"/><rect x="-32" y="-7" width="8" height="3.5" fill="#C9CCD2" stroke="#3A2626" stroke-width="1"/><rect x="-32" y="3.5" width="8" height="3.5" fill="#C9CCD2" stroke="#3A2626" stroke-width="1"/></g>`
            : plug(p, q);
    const cable = (c, t, extra = '') => {
        const P = at(c, t), d = smooth(P);
        return `<g class="chg" data-c="${c.id}" ${extra}><path d="${d}" fill="none" stroke="#3A2626" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c.col}" stroke-width="5.5" stroke-linecap="round"/>${tail(c, P[0], P[1])}${plug(P[N - 1], P[N - 2])}</g>`;
    };
    return { list: C, at, cable, N };
})();

/* my skincare, drawn from the real packaging. the .top group is whatever comes off or presses down */
const GOLDG = id => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D9C9A0"/><stop offset=".35" stop-color="#F6EDD6"/><stop offset=".55" stop-color="#EADCB8"/><stop offset="1" stop-color="#C9B58A"/></linearGradient>`;
const SILVG = id => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E9198"/><stop offset=".4" stop-color="#F2F3F5"/><stop offset=".7" stop-color="#B9BCC2"/><stop offset="1" stop-color="#7C8087"/></linearGradient>`;
const WA = (x, y, c) => `<text transform="translate(${x} ${y}) rotate(-90)" font-family="Instrument Sans" font-size="5.2" letter-spacing="1.4" fill="${c}">WESTMAN ATELIER</text>`;
window.SKIN = {
    dropper: `<svg viewBox="0 0 60 170"><defs>${GOLDG('skg1')}</defs>
        <rect x="10" y="52" width="40" height="114" rx="4" fill="url(#skg1)" stroke="#3A2626" stroke-width="2.4"/><rect x="27" y="52" width="6" height="114" fill="#8C7A4E" opacity=".75"/>${WA(22, 150, '#F7E3E6')}
        <g class="top"><rect x="10" y="20" width="40" height="34" rx="4" fill="url(#skg1)" stroke="#3A2626" stroke-width="2.4"/><rect x="16" y="6" width="28" height="16" rx="4" fill="url(#skg1)" stroke="#3A2626" stroke-width="2.4"/><rect x="27" y="6" width="6" height="48" fill="#8C7A4E" opacity=".75"/>
            <rect x="26" y="54" width="8" height="58" rx="3" fill="#F6E6EA" opacity=".85" stroke="#B9AFB4" stroke-width="1"/><rect x="27" y="80" width="6" height="30" rx="2" fill="#F4C9D3" opacity=".9"/><circle cx="30" cy="114" r="3.2" fill="#F8E4EA" stroke="#B9AFB4" stroke-width="1"/></g>
        <circle class="dab" cx="30" cy="124" r="4.5" fill="#F7D3DD"/></svg>`,
    pinkpump: `<svg viewBox="0 0 60 190"><defs>${SILVG('sks1')}</defs>
        <rect x="9" y="48" width="42" height="138" rx="5" fill="#F7E6E6" stroke="#3A2626" stroke-width="2.4"/><path d="M14 54 v124" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>${WA(33, 150, '#C9B9B9')}
        <rect x="14" y="42" width="32" height="7" rx="2" fill="#E2C47A" stroke="#3A2626" stroke-width="1.6"/>
        <g class="top"><rect x="16" y="14" width="28" height="30" rx="3" fill="url(#sks1)" stroke="#3A2626" stroke-width="2.2"/><rect x="42" y="18" width="7" height="8" rx="2" fill="#F4F4F6" stroke="#3A2626" stroke-width="1.4"/></g>
        <ellipse class="dab" cx="54" cy="24" rx="5" ry="3.5" fill="#FBF3EE"/></svg>`,
    goldpump: `<svg viewBox="0 0 60 190"><defs>${GOLDG('skg2')}${SILVG('sks2')}</defs>
        <rect x="9" y="48" width="42" height="138" rx="5" fill="url(#skg2)" stroke="#3A2626" stroke-width="2.4"/><rect x="27" y="48" width="6" height="138" fill="#8C7A4E" opacity=".7"/>${WA(22, 150, '#6E5A2E')}
        <rect x="14" y="42" width="32" height="7" rx="2" fill="#FBFBFB" stroke="#3A2626" stroke-width="1.6"/>
        <g class="top"><rect x="16" y="14" width="28" height="30" rx="3" fill="url(#sks2)" stroke="#3A2626" stroke-width="2.2"/><rect x="42" y="18" width="7" height="8" rx="2" fill="#F4F4F6" stroke="#3A2626" stroke-width="1.4"/></g>
        <ellipse class="dab" cx="54" cy="24" rx="5" ry="3.5" fill="#E8C9A8"/></svg>`,
    patches: `<svg viewBox="0 0 90 120"><defs><linearGradient id="skgp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE9E4"/><stop offset=".5" stop-color="#F7CFC8"/><stop offset="1" stop-color="#FFE3DD"/></linearGradient></defs>
        <rect x="6" y="6" width="78" height="110" rx="6" fill="#FFF6F4" stroke="#3A2626" stroke-width="2.4"/><path d="M6 20 h78" stroke="#3A2626" stroke-width="1.6" stroke-dasharray="3 3"/>
        <g class="top"><path d="M42 34 C34 38 22 38 12 32 C6 44 10 62 24 66 C36 68 44 54 42 34Z" fill="url(#skgp)" fill-opacity=".85" stroke="#D9A39A" stroke-width="1.4"/><path d="M48 34 C56 38 68 38 78 32 C84 44 80 62 66 66 C54 68 46 54 48 34Z" fill="url(#skgp)" fill-opacity=".85" stroke="#D9A39A" stroke-width="1.4"/>
            <path d="M16 40 q0 12 8 18 M74 40 q0 12 -8 18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/></g>
        <text x="45" y="92" text-anchor="middle" font-family="Bodoni Moda" font-size="8.5" fill="#B0716A" letter-spacing="1">UNDER-EYE</text><text x="45" y="104" text-anchor="middle" font-family="Instrument Sans" font-size="6" fill="#B0716A" letter-spacing="1.2">GEL PATCHES</text></svg>`,
    lamer: `<svg viewBox="0 0 110 100"><defs><linearGradient id="sklm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2F4A1E"/><stop offset=".45" stop-color="#5C7A34"/><stop offset="1" stop-color="#26401A"/></linearGradient><linearGradient id="sklc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6E4C40"/><stop offset=".35" stop-color="#E9D5CA"/><stop offset=".7" stop-color="#4A2F28"/><stop offset="1" stop-color="#2E1C18"/></linearGradient></defs>
        <path d="M14 92 L22 22" stroke="#3A2626" stroke-width="7" stroke-linecap="round"/><path d="M14 92 L22 22" stroke="#5E7E2C" stroke-width="4" stroke-linecap="round"/><ellipse cx="23" cy="16" rx="6" ry="8" fill="url(#sklc)" stroke="#3A2626" stroke-width="1.8"/>
        <rect x="30" y="52" width="74" height="44" rx="7" fill="url(#sklm)" stroke="#3A2626" stroke-width="2.4"/>
        <path d="M42 66 q14 -6 28 -2 q10 -3 22 1 l-2 10 q-14 -3 -24 1 q-14 2 -24 -2z" fill="#E8D7BE"/><text x="67" y="74" text-anchor="middle" font-family="Bodoni Moda" font-size="10" fill="#2F5A2A" letter-spacing=".6">LA MER</text>
        <text x="67" y="86" text-anchor="middle" font-family="Instrument Sans" font-size="4.2" fill="#E8D7BE" letter-spacing=".6">THE EYE CONCENTRATE</text>
        <g class="top"><path d="M30 54 v-14 q0 -10 10 -10 h54 q10 0 10 10 v14z" fill="url(#sklc)" stroke="#3A2626" stroke-width="2.4"/><path d="M32 46 h70" stroke="#C9AEA2" stroke-width="1.2" opacity=".7"/></g>
        <ellipse class="dab" cx="67" cy="54" rx="28" ry="4" fill="#F4EEE4"/></svg>`,
    lash: `<svg viewBox="0 0 50 200"><defs><linearGradient id="skgl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A9782E"/><stop offset=".3" stop-color="#E9C077"/><stop offset=".55" stop-color="#C8954A"/><stop offset=".8" stop-color="#E6BC72"/><stop offset="1" stop-color="#9E6E28"/></linearGradient></defs>
        <g class="top"><path d="M25 70 v60" stroke="#1A1A1A" stroke-width="2.4"/><path d="M25 128 v16" stroke="#C98A2E" stroke-width="2.6" stroke-linecap="round"/><rect x="11" y="6" width="28" height="62" rx="3" fill="url(#skgl)" stroke="#3A2626" stroke-width="2.2"/>${Array.from({ length: 10 }, (_, k) => `<path d="M${13 + k * 2.6} 8 v58" stroke="#fff" stroke-width=".4" opacity=".25"/>`).join('')}</g>
        <rect x="9" y="66" width="32" height="128" rx="3" fill="url(#skgl)" stroke="#3A2626" stroke-width="2.2"/><rect x="9" y="66" width="32" height="5" fill="#1A1A1A"/>${Array.from({ length: 11 }, (_, k) => `<path d="M${11 + k * 2.6} 72 v120" stroke="#fff" stroke-width=".4" opacity=".25"/>`).join('')}
        <text transform="translate(29 186) rotate(-90)" font-family="Instrument Sans" font-size="9.5" fill="#2A1E12"><tspan>Grande</tspan><tspan font-weight="800">LASH-MD</tspan></text><text transform="translate(36 186) rotate(-90)" font-family="Instrument Sans" font-size="4.6" fill="#2A1E12">Lash Enhancing Serum</text></svg>`,
    laneige: `<svg viewBox="0 0 80 70"><defs><linearGradient id="sklz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E5A1B6"/><stop offset=".45" stop-color="#F7CFDA"/><stop offset="1" stop-color="#D98CA4"/></linearGradient></defs>
        <path d="M8 36 h64 v22 q0 8 -8 8 h-48 q-8 0 -8 -8z" fill="#F4C7D3" fill-opacity=".85" stroke="#3A2626" stroke-width="2.2"/><path d="M14 44 h52 v12 q0 4 -4 4 h-44 q-4 0 -4 -4z" fill="#D9557A" opacity=".55"/>
        <g class="top"><rect x="6" y="14" width="68" height="24" rx="5" fill="url(#sklz)" stroke="#3A2626" stroke-width="2.2"/><text x="40" y="30" text-anchor="middle" font-family="Instrument Sans" font-weight="600" font-size="8" letter-spacing="2.4" fill="#fff">LANEIGE</text></g>
        <ellipse class="dab" cx="40" cy="36" rx="22" ry="3" fill="#E77A9A"/></svg>`,
    sisley: `<svg viewBox="0 0 110 100"><defs><linearGradient id="sksy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B08A3E"/><stop offset=".3" stop-color="#F1DCA0"/><stop offset=".55" stop-color="#C9A55A"/><stop offset=".8" stop-color="#EBD08E"/><stop offset="1" stop-color="#A5803A"/></linearGradient></defs>
        <path d="M10 46 h90 l-4 40 q-1 8 -9 8 h-64 q-8 0 -9 -8z" fill="#F6E4E4" stroke="#3A2626" stroke-width="2.4"/><path d="M14 74 l10 20 M30 78 l6 16 M80 78 l-6 16 M96 74 l-10 20 M14 74 h82" stroke="#E2CACA" stroke-width="1.4" fill="none"/>
        <text x="55" y="62" text-anchor="middle" font-family="Bodoni Moda" font-size="9.5" fill="#9A7414" letter-spacing=".8">SUPREMŸA</text><text x="55" y="71" text-anchor="middle" font-family="Bodoni Moda" font-size="5.2" fill="#9A7414" letter-spacing=".6">LA NUIT</text>
        <g class="top"><rect x="8" y="22" width="94" height="26" rx="3" fill="url(#sksy)" stroke="#3A2626" stroke-width="2.4"/>${Array.from({ length: 9 }, (_, k) => `<path d="M10 ${25 + k * 2.6} h90" stroke="#fff" stroke-width=".5" opacity=".35"/>`).join('')}</g>
        <ellipse class="dab" cx="55" cy="47" rx="40" ry="4" fill="#FBF1EE"/></svg>`,
    // standing the long way up: it's a full-size eye mask, the biggest thing in the pouch
    mask: `<svg viewBox="0 0 80 130"><defs><linearGradient id="skmk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF7EC"/><stop offset="1" stop-color="#EAE1CC"/></linearGradient></defs><g transform="translate(80 0) rotate(90)">
        <path d="M22 26 C34 6 96 6 108 26" fill="none" stroke="#EFE6D2" stroke-width="7" stroke-linecap="round"/><path d="M22 26 C34 6 96 6 108 26" fill="none" stroke="#D8CCB2" stroke-width="7" stroke-dasharray="2 3" stroke-linecap="round"/>
        <path d="M10 40 C10 22 40 20 65 26 C90 20 120 22 120 40 C120 60 100 72 84 70 C76 69 70 60 65 58 C60 60 54 69 46 70 C30 72 10 60 10 40Z" fill="url(#skmk)" stroke="#3A2626" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M15 40 C15 26 40 25 65 30 C90 25 115 26 115 40 C115 56 99 66 85 65 C77 64 71 56 65 54 C59 56 53 64 45 65 C31 66 15 56 15 40Z" fill="none" stroke="#D9CDB4" stroke-width="1.6"/>
        <path d="M30 36 q8 -4 18 -2" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g></svg>`
};

/* my jewelry: drawn from the real pieces */
const CHAIN = (d, beads) => `<path d="${d}" fill="none" stroke="#C99A3A" stroke-width="2.2"/><path d="${d}" fill="none" stroke="#F3D58A" stroke-width="1" stroke-dasharray="2 2.4"/>${beads || ''}`;
const ELISA = (stone, inner) => `<g transform="translate(120 150)"><path d="M-30 0 L-22 -15 H22 L30 0 L22 15 H-22Z" fill="#E9C46A" stroke="#9C7420" stroke-width="1.6"/><path d="M-30 0 L-22 -15 H22 L30 0 L22 15 H-22Z" fill="none" stroke="#FFF1C2" stroke-width=".8" stroke-dasharray="1 1.6" transform="scale(.93)"/>
    <path d="M-25 0 L-18 -11 H18 L25 0 L18 11 H-18Z" fill="${stone}" stroke="#9C7420" stroke-width="1"/>${inner}
    <path d="M-20 -11 l3 3 M20 -11 l-3 3 M-20 11 l3 -3 M20 11 l-3 -3" stroke="#E9C46A" stroke-width="2"/></g>`;
window.JEWELS = {
    evil: `<svg viewBox="0 0 240 210">${CHAIN('M14 10 C24 150 216 150 226 10')}
        ${[[42, 98, 'moon'], [62, 122, 'inf'], [88, 138, 'clover'], [120, 144, 'eye'], [152, 138, 'pearl'], [178, 122, 'drop'], [198, 98, 'shoe']].map(([x, y, k]) => `<g transform="translate(${x} ${y + 12})">${{
            moon: '<path d="M-7 -8 a10 10 0 1 0 10 14 a8 8 0 1 1 -10 -14z" fill="#1E2A6E" stroke="#C99A3A" stroke-width="1.2"/><circle cx="-4" cy="2" r="1" fill="#8FB0F0"/><circle cx="0" cy="6" r="1" fill="#8FB0F0"/>',
            inf: '<path d="M-10 0 c0 -6 8 -6 10 0 c2 6 10 6 10 0 c0 -6 -8 -6 -10 0 c-2 6 -10 6 -10 0z" fill="none" stroke="#E2B24A" stroke-width="3"/>',
            clover: '<g fill="#F2F4F8" stroke="#C99A3A" stroke-width="1"><circle cx="-5" cy="-5" r="6"/><circle cx="5" cy="-5" r="6"/><circle cx="-5" cy="5" r="6"/><circle cx="5" cy="5" r="6"/></g><circle r="4" fill="#2C4A9E"/>',
            eye: '<ellipse rx="16" ry="9" fill="#F2F4F8" stroke="#C99A3A" stroke-width="1.4"/><circle r="6" fill="#3B6FD8"/><circle r="3" fill="#0E1A44"/><circle cx="-1.5" cy="-1.5" r="1" fill="#fff"/>',
            pearl: '<circle r="6.5" fill="#FBF8F0" stroke="#D8D0C0" stroke-width="1"/><circle cx="-2" cy="-2" r="2" fill="#fff"/>',
            drop: '<path d="M0 -10 C6 -2 8 4 0 10 C-8 4 -6 -2 0 -10Z" fill="#2B3E8C" stroke="#C99A3A" stroke-width="1"/><path d="M-2 -2 l2 -4" stroke="#8FB0F0" stroke-width="1"/>',
            shoe: '<path d="M-8 8 V-2 a8 8 0 0 1 16 0 V8" fill="none" stroke="#F2F4F8" stroke-width="5"/><path d="M-8 8 V-2 a8 8 0 0 1 16 0 V8" fill="none" stroke="#C99A3A" stroke-width="1" stroke-dasharray="1.5 2"/>'
        }[k]}</g><path d="M${x} ${y} v${12 - 9}" stroke="#C99A3A" stroke-width="1.2"/>`).join('')}
        <circle cx="14" cy="10" r="4" fill="#E2B24A"/></svg>`,
    tx: `<svg viewBox="0 0 240 190">${CHAIN('M20 8 C26 130 92 140 96 150 M144 150 C148 140 214 130 220 8', [[[20, 8], [26, 130], [92, 140], [96, 150]], [[220, 8], [214, 130], [148, 140], [144, 150]]].map(P => Array.from({ length: 9 }, (_, k) => { const t = (k + 1) / 10, u = 1 - t, x = u ** 3 * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t ** 3 * P[3][0], y = u ** 3 * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t ** 3 * P[3][1]; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.7" fill="#E9C46A" stroke="#B88A2C" stroke-width=".5"/>`; }).join('')).join(''))}
        ${ELISA('#F5EEE2', '<path d="M-18 -11 L18 11 M18 -11 L-18 11" stroke="#fff" stroke-width=".6" opacity=".5"/><text x="0" y="6" text-anchor="middle" font-family="Bodoni Moda, serif" font-weight="600" font-size="15" fill="#C99A3A" letter-spacing="1">TX</text>')}</svg>`,
    teal: `<svg viewBox="0 0 240 190">${CHAIN('M20 8 C26 130 92 140 96 150 M144 150 C148 140 214 130 220 8')}
        ${ELISA('#0F5A5C', '<path d="M-18 -11 L-4 0 L-18 11 M18 -11 L4 0 L18 11 M-4 0 H4" stroke="#3FA3A0" stroke-width="1.2" fill="none" opacity=".8"/><path d="M-10 -8 l8 6" stroke="#9FE0D8" stroke-width="1.6" opacity=".7"/>')}</svg>`
};

const ITEMS_HP_ART = () => window.ITEMS.find(i => i.id === 'headphones').art;
window.ITEMS = [
    {
        id: 'headphones', name: 'my airpods max', zip: 'devices', l: 67.7, t: 8.2, w: 16.0, r: -8,
        art: `<svg viewBox="0 0 160 184"><defs>
            <pattern id="mesh" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#EFE6D6"/><circle cx="2.5" cy="2.5" r=".9" fill="#DDD0B8"/></pattern>
            <linearGradient id="cup" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3EADB"/><stop offset=".55" stop-color="#E2D4BC"/><stop offset="1" stop-color="#CDBB9E"/></linearGradient></defs>
            <path d="M24 92 V60 C24 22 50 8 80 8 C110 8 136 22 136 60 V92" fill="none" stroke="#C9CDD3" stroke-width="5"/>
            <path d="M24 92 V60 C24 22 50 8 80 8 C110 8 136 22 136 60 V92" fill="none" stroke="#3A2626" stroke-width="1.4"/>
            <path d="M34 58 C34 30 54 18 80 18 C106 18 126 30 126 58 C126 64 118 64 116 58 C114 40 100 32 80 32 C60 32 46 40 44 58 C42 64 34 64 34 58Z" fill="url(#mesh)" ${S} stroke-width="2.5"/>
            <rect x="18" y="84" width="12" height="16" rx="3" fill="#D6D9DE" stroke="#3A2626" stroke-width="2"/><rect x="130" y="84" width="12" height="16" rx="3" fill="#D6D9DE" stroke="#3A2626" stroke-width="2"/>
            <rect x="4" y="96" width="70" height="82" rx="24" fill="url(#cup)" ${S}/><rect x="11" y="103" width="56" height="68" rx="18" fill="none" stroke="#FBF5EA" stroke-width="2.5"/>
            <rect x="86" y="96" width="70" height="82" rx="24" fill="url(#cup)" ${S}/><rect x="93" y="103" width="56" height="68" rx="18" fill="none" stroke="#FBF5EA" stroke-width="2.5"/>
            <circle cx="144" cy="106" r="4" fill="#E9E2D3" stroke="#3A2626" stroke-width="1.5"/><rect x="128" y="96" width="9" height="3.5" rx="1.5" fill="#E9E2D3" stroke="#3A2626" stroke-width="1"/></svg>`,
        open: () => `
            <h2>What I’m <em>listening</em> to</h2>
            <p class="note">four years of my spotify, turned into a database i can ask anything</p>
            <div class="study-wrap">
                <div class="study" id="study">
                    <img src="assets/img/me-study.jpg" alt="Me studying in a booth, writing in my notebook between two laptops">
                    <img class="study-on" src="assets/img/me-study-headphones.jpg" alt="" aria-hidden="true">
                    <span class="study-hint hand" id="study-hint">drop them on me ↓</span>
                </div>
                <button type="button" class="study-hp" id="study-hp" aria-label="Put my headphones on me">${ITEMS_HP_ART()}</button>
            </div>
            <p class="hand study-say" id="study-say">i’m studying. drag my headphones onto me.</p>
            <div class="ari"><button type="button" class="btn solid" id="ari-play" aria-pressed="false">♪ play a little ariana</button><p class="mono ari-now" id="ari-now" aria-live="polite"></p></div>
            <div class="row"><a class="btn solid" href="https://listening-history.onrender.com/" target="_blank" rel="noopener">Open Listening History ↗</a><a class="btn" href="https://github.com/suhxnitiwari/listening-history" target="_blank" rel="noopener">Code ↗</a></div>`
    },
    {
        id: 'sketchbook', name: 'my strathmore mixed media sketchbook', zip: 'main', l: 60.2, t: 81.3, w: 26.2, r: 3,
        art: `<svg viewBox="0 0 280 356"><rect x="18" y="4" width="258" height="348" rx="3" fill="#F6C5D2" ${S}/><path d="M4 14 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="11" width="7" height="6" fill="#1C1A1C"/><path d="M4 26 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="23" width="7" height="6" fill="#1C1A1C"/><path d="M4 38 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="35" width="7" height="6" fill="#1C1A1C"/><path d="M4 50 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="47" width="7" height="6" fill="#1C1A1C"/><path d="M4 62 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="59" width="7" height="6" fill="#1C1A1C"/><path d="M4 74 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="71" width="7" height="6" fill="#1C1A1C"/><path d="M4 86 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="83" width="7" height="6" fill="#1C1A1C"/><path d="M4 98 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="95" width="7" height="6" fill="#1C1A1C"/><path d="M4 110 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="107" width="7" height="6" fill="#1C1A1C"/><path d="M4 122 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="119" width="7" height="6" fill="#1C1A1C"/><path d="M4 134 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="131" width="7" height="6" fill="#1C1A1C"/><path d="M4 146 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="143" width="7" height="6" fill="#1C1A1C"/><path d="M4 158 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="155" width="7" height="6" fill="#1C1A1C"/><path d="M4 170 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="167" width="7" height="6" fill="#1C1A1C"/><path d="M4 182 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="179" width="7" height="6" fill="#1C1A1C"/><path d="M4 194 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="191" width="7" height="6" fill="#1C1A1C"/><path d="M4 206 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="203" width="7" height="6" fill="#1C1A1C"/><path d="M4 218 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="215" width="7" height="6" fill="#1C1A1C"/><path d="M4 230 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="227" width="7" height="6" fill="#1C1A1C"/><path d="M4 242 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="239" width="7" height="6" fill="#1C1A1C"/><path d="M4 254 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="251" width="7" height="6" fill="#1C1A1C"/><path d="M4 266 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="263" width="7" height="6" fill="#1C1A1C"/><path d="M4 278 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="275" width="7" height="6" fill="#1C1A1C"/><path d="M4 290 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="287" width="7" height="6" fill="#1C1A1C"/><path d="M4 302 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="299" width="7" height="6" fill="#1C1A1C"/><path d="M4 314 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="311" width="7" height="6" fill="#1C1A1C"/><path d="M4 326 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="323" width="7" height="6" fill="#1C1A1C"/><path d="M4 338 q12 -5 22 0" fill="none" stroke="#9EA3AA" stroke-width="2.4"/><rect x="26" y="335" width="7" height="6" fill="#1C1A1C"/>
            <rect x="40" y="4" width="236" height="348" fill="none"/>
            <g font-family="Instrument Sans" font-size="4" fill="#5A3A44"><text x="62" y="18">11 in. x 14 in. Actual Sheet Size when torn at micro-perforation.</text><text x="62" y="24">27,9 x 35,6 cm</text><text x="214" y="18">Made in the U.S.A.</text></g>
            <g font-family="Instrument Sans" font-weight="700" font-size="5.6" fill="#3A2630"><text x="96" y="38">300 Series | Better</text><text x="154" y="38">Série 300 | Mieux</text><text x="206" y="38">Serie 300 | Mejor</text></g>
            <rect x="94" y="44" width="136" height="136" fill="#F4EFE7" stroke="#6A2A4A" stroke-width="2.4"/>
            <g transform="translate(162 120)">
                <path d="M-46 56 V-30 Q-46 -50 -30 -54 L-20 -56" fill="none" stroke="#B9B2AA" stroke-width="1.4"/><path d="M40 56 V-40 M30 56 V-30" stroke="#C9C2BA" stroke-width="1.2"/>
                <path d="M-14 56 C-24 40 -20 18 -8 10 C-4 6 4 6 8 10 C20 18 24 40 14 56Z" fill="#E6E3DE" stroke="#8C8680" stroke-width="1.3"/>
                <g stroke="#3E7A44" stroke-width="1.6" fill="none"><path d="M0 10 C-8 -10 -20 -26 -28 -36"/><path d="M0 10 C2 -10 0 -30 -4 -46"/><path d="M0 10 C10 -8 20 -22 30 -30"/><path d="M0 10 C6 -6 14 -36 16 -48"/></g>
                <g fill="#7FB46E"><path d="M-12 -6 q-14 -2 -18 -14 q12 2 18 14z"/><path d="M8 -4 q14 -6 22 -2 q-10 8 -22 2z"/><path d="M-2 -20 q-10 -10 -8 -22 q8 10 8 22z"/></g>
                <g fill="#F08A3C" stroke="#C4602A" stroke-width=".8"><path d="M-34 -38 q2 -10 8 -8 q4 -6 8 0 q4 4 -2 12 q-8 4 -14 -4z"/><path d="M-10 -48 q2 -10 8 -8 q4 -6 8 0 q4 4 -2 12 q-8 4 -14 -4z"/><path d="M24 -34 q2 -10 8 -8 q4 -6 8 0 q4 4 -2 12 q-8 4 -14 -4z"/><path d="M10 -52 q2 -10 8 -8 q4 -6 8 0 q4 4 -2 12 q-8 4 -14 -4z"/></g>
                <path d="M40 56 C34 48 34 38 44 34 C54 38 52 50 46 56Z" fill="#B9C76A" stroke="#7D8A3E" stroke-width="1"/></g>
            <g transform="translate(70 196)"><circle r="6" fill="none" stroke="#6A2A4A" stroke-width="1.6"/><path d="M-2 -4 q6 2 0 4 q-6 2 2 4" fill="none" stroke="#6A2A4A" stroke-width="1.4"/></g>
            <text x="80" y="200" font-family="Georgia, serif" font-size="16" fill="#6A2A4A">Strathmore</text>
            <text x="58" y="244" font-family="Georgia, serif" font-size="38" fill="#B0285F" letter-spacing="-1" textLength="206" lengthAdjust="spacingAndGlyphs">Mixed Media</text>
            <g font-family="Instrument Sans" fill="#8A3A5E"><text x="60" y="262" font-size="8">Mixed media paper <tspan font-size="6">vellum surface</tspan></text><text x="60" y="272" font-size="8">Papier pour techniques mixtes <tspan font-size="6">fini vélin</tspan></text><text x="60" y="282" font-size="8">Papel para técnicas mixtas <tspan font-size="6">superficie vitela</tspan></text></g>
            <g font-family="Instrument Sans" font-size="4" fill="#5A3A44"><text x="60" y="292">Acid free. Medium weight. For mixed media sketches - wet and dry media.</text><text x="60" y="298">Sans acide. Grammage moyen. Pour les esquisses avec techniques mixtes.</text></g>
            <text x="60" y="320" font-family="Instrument Sans" font-size="14" fill="#2A2224">40 sheets, feuilles, hojas</text>
            <text x="60" y="330" font-family="Instrument Sans" font-size="4.2" fill="#5A3A44">11 in. x 14 in. (27,9 x 35,6 cm)   117 lb. (190 g/m²)</text>
            <rect x="232" y="288" width="36" height="28" fill="#fff"/><rect x="236.0" y="292" width="2" height="20" fill="#2A2224"/><rect x="238.2" y="292" width="1.2" height="20" fill="#2A2224"/><rect x="240.4" y="292" width="1.2" height="20" fill="#2A2224"/><rect x="242.6" y="292" width="2" height="20" fill="#2A2224"/><rect x="244.8" y="292" width="1.2" height="20" fill="#2A2224"/><rect x="247.0" y="292" width="1.2" height="20" fill="#2A2224"/><rect x="249.2" y="292" width="2" height="20" fill="#2A2224"/><rect x="251.4" y="292" width="1.2" height="20" fill="#2A2224"/><rect x="253.6" y="292" width="1.2" height="20" fill="#2A2224"/><rect x="255.8" y="292" width="2" height="20" fill="#2A2224"/><rect x="258.0" y="292" width="1.2" height="20" fill="#2A2224"/><rect x="260.2" y="292" width="1.2" height="20" fill="#2A2224"/><rect x="262.4" y="292" width="2" height="20" fill="#2A2224"/><rect x="264.6" y="292" width="1.2" height="20" fill="#2A2224"/></svg>`,
        open: 'sketchbook'
    },
    {
        id: 'lipstick', name: 'mac sleek satin, espresso yourself', zip: 'makeup', l: 62.5, t: 86, w: 3.8, r: 16,
        art: `<svg viewBox="0 0 70 150"><rect x="13" y="64" width="44" height="82" rx="3" fill="#141214" ${S}/><path d="M18 72 v66" stroke="#3A383C" stroke-width="3" stroke-linecap="round"/>
            <rect x="15" y="56" width="40" height="10" rx="2" fill="#2A282C" ${S} stroke-width="2.2"/><rect x="21" y="36" width="28" height="22" rx="2" fill="#1E1C20" ${S} stroke-width="2.2"/>
            <path d="M23 37 V16 C23 8 31 6 35 10 L47 24 V37Z" fill="#6E3A2E" ${S} stroke-width="2.4"/><path d="M27 18 q3 -5 7 -5" fill="none" stroke="#9A5E4E" stroke-width="2.4" stroke-linecap="round"/>
            <text x="35" y="112" text-anchor="middle" font-family="Instrument Sans" font-weight="800" font-size="9" letter-spacing="1.6" fill="#F2F0EC" transform="rotate(-90 35 106)">M·A·C</text></svg>`,
        open: 'makeup'
    },
    {
        // make up for ever artist color pencil in 600 anywhere caffeine, a warm caramel nude. the shade is perfect for me.
        id: 'lipliner', name: 'make up for ever artist color pencil, 600 anywhere caffeine', zip: 'makeup', l: 0, t: 0, w: 2.6, r: 0,
        art: `<svg viewBox="0 0 40 220"><path d="M12 40 L20 6 L28 40Z" fill="#E9BE8E" ${S} stroke-width="2.2"/><path d="M17 19 L20 6 L23 19Z" fill="#A3655B" stroke="#3A2626" stroke-width="1.8" stroke-linejoin="round"/>
            <rect x="11" y="40" width="18" height="110" rx="2" fill="#E2B07E" ${S} stroke-width="2.2"/><path d="M15 44 v102" stroke="#F0CDA4" stroke-width="2.4" stroke-linecap="round"/>
            <text x="20" y="96" text-anchor="middle" font-family="Instrument Sans" font-weight="800" font-size="6.4" letter-spacing=".6" fill="#2A2224" transform="rotate(-90 20 96)">MAKE UP FOR EVER</text>
            <rect x="11" y="150" width="18" height="66" rx="3" fill="#A3655B" ${S} stroke-width="2.2"/><path d="M15 154 v58" stroke="#BE8378" stroke-width="2.4" stroke-linecap="round"/></svg>`,
        open: 'makeup'
    },
    {
        id: 'blush', name: 'westman atelier baby cheeks, mimi', zip: 'makeup', l: 0, t: 0, w: 4, r: 0,
        art: `<svg viewBox="0 0 80 200"><rect x="12" y="84" width="56" height="110" rx="6" fill="#E3DFD8" ${S}/><text x="40" y="160" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#B9B3AA" transform="rotate(-90 40 140)" letter-spacing="1.6">WESTMAN ATELIER</text><rect x="14" y="76" width="52" height="9" fill="#D9A441" ${S} stroke-width="2"/><path d="M18 38 H62 V77 H18Z" fill="#C9CDD3" ${S}/><path d="M28 40 V75" stroke="#fff" stroke-width="5" opacity=".7"/><path d="M48 40 V75" stroke="#8A9099" stroke-width="2" opacity=".5"/><path d="M22 38 V22 C22 12 58 12 58 22 V38Z" fill="#C9908C" ${S}/><ellipse cx="40" cy="18" rx="15" ry="5" fill="#D7A3A0" opacity=".7"/></svg>`,
        open: 'makeup'
    },
    {
        // same stick as the baby cheeks blush, in black: westman atelier face trace, biscuit (cool beige coffee)
        id: 'contour', name: 'westman atelier face trace, biscuit', zip: 'makeup', l: 0, t: 0, w: 4, r: 0,
        art: `<svg viewBox="0 0 80 200"><rect x="12" y="84" width="56" height="110" rx="6" fill="#1C1A1A" ${S}/><path d="M20 90 V188" stroke="#3A3636" stroke-width="4" opacity=".8"/><text x="40" y="160" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#8E8884" transform="rotate(-90 40 140)" letter-spacing="1.6">WESTMAN ATELIER</text><rect x="14" y="76" width="52" height="9" fill="#D9A441" ${S} stroke-width="2"/><path d="M18 38 H62 V77 H18Z" fill="#C9CDD3" ${S}/><path d="M28 40 V75" stroke="#fff" stroke-width="5" opacity=".7"/><path d="M48 40 V75" stroke="#8A9099" stroke-width="2" opacity=".5"/><path d="M22 38 V22 C22 12 58 12 58 22 V38Z" fill="#9A7462" ${S}/><ellipse cx="40" cy="18" rx="15" ry="5" fill="#B08A78" opacity=".7"/></svg>`,
        open: 'makeup'
    },
    {
        id: 'concealer', name: 'hourglass vanish concealer', zip: 'makeup', l: 0, t: 0, w: 3, r: 0,
        art: `<svg viewBox="0 0 60 210"><rect x="14" y="4" width="32" height="62" rx="4" fill="#8A5650" ${S}/><path d="M20 10 V60" stroke="#B88078" stroke-width="4" opacity=".7"/><rect x="14" y="64" width="32" height="140" rx="5" fill="#F4F2F0" ${S}/><rect x="19" y="70" width="22" height="128" rx="3" fill="#E6C3A3"/><path d="M23 76 V192" stroke="#fff" stroke-width="3" opacity=".5"/><text x="30" y="180" text-anchor="middle" font-family="Instrument Sans" font-weight="600" font-size="8" fill="#B88A6A" transform="rotate(-90 30 160)" letter-spacing="1.5">HOURGLASS</text></svg>`,
        open: 'makeup'
    },
    {
        // same size as the charlotte tilbury tube: black crimped top, blush tube, gold cap
        id: 'primer', name: 'estée lauder futurist aqua brilliance primer', zip: 'makeup', l: 0, t: 0, w: 4, r: 0,
        art: `<svg viewBox="0 0 80 220"><defs><linearGradient id="ptube" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#EEDDD8"/><stop offset=".5" stop-color="#FBF2EF"/><stop offset="1" stop-color="#E4CFC9"/></linearGradient><linearGradient id="pgold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8913E"/><stop offset=".45" stop-color="#F3DC94"/><stop offset="1" stop-color="#A57E2E"/></linearGradient></defs>
            <path d="M8 6 H72 V12 L70 28 H10 L8 12 Z" fill="#141212" ${S} stroke-width="2"/><path d="M14 9 L22 25" stroke="#4A4646" stroke-width="2" stroke-linecap="round"/>
            <path d="M10 28 H70 L62 168 H18 Z" fill="url(#ptube)" ${S}/>
            <path d="M10.4 33 H69.6" stroke="#C9A24E" stroke-width="2.4"/>
            <text x="40" y="50" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="8" fill="#2A2222" letter-spacing=".6">ESTĒE</text>
            <text x="40" y="59" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="8" fill="#2A2222" letter-spacing=".6">LAUDER</text>
            <path d="M24 63 H56" stroke="#C9A24E" stroke-width="1"/>
            <text x="40" y="74" text-anchor="middle" font-family="Bodoni Moda" font-size="6.5" fill="#2A2222">Futurist</text>
            <text x="40" y="82" text-anchor="middle" font-family="Bodoni Moda" font-size="6.5" fill="#2A2222">Aqua Brilliance</text>
            <text x="40" y="90" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="4.6" fill="#4A3E3E">Watery Glow Primer</text>
            <rect x="18" y="166" width="44" height="48" rx="3" fill="url(#pgold)" ${S}/><path d="M24 170 v40" stroke="#FFF3CF" stroke-width="2" opacity=".7"/>
        </svg>`,
        open: 'makeup'
    },
    {
        id: 'foundation', name: 'charlotte tilbury beautiful skin, 6n', zip: 'makeup', l: 0, t: 0, w: 4, r: 0,
        art: `<svg viewBox="0 0 80 220"><defs><linearGradient id="ctube" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F3DCCB"/><stop offset=".5" stop-color="#FBEDE2"/><stop offset="1" stop-color="#E8C8B2"/></linearGradient><linearGradient id="rg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C98F72"/><stop offset=".45" stop-color="#F0C5AC"/><stop offset="1" stop-color="#B57A5E"/></linearGradient></defs>
            <rect x="8" y="6" width="64" height="14" rx="2" fill="#1E1414" ${S} stroke-width="2"/><path d="M12 10 h56 M12 15 h56" stroke="#4A3A3A" stroke-width="1"/>
            <path d="M10 20 H70 L62 168 H18 Z" fill="url(#ctube)" ${S}/>
            <text x="40" y="42" text-anchor="middle" font-family="Bodoni Moda" font-size="6" fill="#7A4A3A" letter-spacing=".8">CHARLOTTE’S</text>
            <text x="40" y="56" text-anchor="middle" font-family="Bodoni Moda" font-size="11" fill="#7A4A3A">BEAUTIFUL</text>
            <text x="40" y="69" text-anchor="middle" font-family="Bodoni Moda" font-size="11" fill="#7A4A3A">SKIN</text>
            <text x="40" y="80" text-anchor="middle" font-family="Bodoni Moda" font-size="5.5" fill="#7A4A3A" letter-spacing=".8">FOUNDATION</text>
            <path d="M40 100 l8 14 -8 14 -8 -14z" fill="#5A2E2A" stroke="#C98F72" stroke-width="1.2"/>
            <rect x="26" y="138" width="28" height="12" rx="6" fill="#D2A27E" stroke="#3A2626" stroke-width="1.2"/><text x="40" y="147" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#3A2626">6N</text>
            <rect x="18" y="166" width="44" height="48" rx="4" fill="url(#rg)" ${S}/>
        </svg>`,
        open: 'makeup'
    },
    {
        id: 'mascara', name: 'lancôme lash idôle', zip: 'makeup', l: 68, t: 85, w: 3.4, r: -14,
        art: `<svg viewBox="0 0 50 230"><rect x="8" y="10" width="34" height="210" rx="6" fill="#E8C3B4" ${S}/><rect x="14" y="18" width="22" height="84" rx="3" fill="#1E1414"/><rect x="14" y="120" width="22" height="92" rx="3" fill="#1E1414"/><path d="M8 110 H42" ${S}/><text x="25" y="165" text-anchor="middle" font-family="Bodoni Moda" font-size="11" fill="#E8C3B4" transform="rotate(-90 25 165)" letter-spacing="1">IDÔLE</text><text x="25" y="60" text-anchor="middle" font-family="Bodoni Moda" font-size="7" fill="#E8C3B4" transform="rotate(-90 25 60)" letter-spacing="1">LANCÔME</text></svg>`,
        open: 'mascara'
    },
    {
        id: 'wallet', name: 'my wallet', zip: 'devices', l: 79.0, t: 36.2, w: 9.0, r: -6,
        art: `<svg viewBox="0 0 100 140"><defs>
            <!-- my victorine, from the real one: big monogram canvas, the pointed envelope flap across the right with its gold snap, and the fuchsia ribbon poking out the bottom -->
            <g id="lvf4"><path d="M0 -4.6 Q1.1 -1.1 4.6 0 Q1.1 1.1 0 4.6 Q-1.1 1.1 -4.6 0 Q-1.1 -1.1 0 -4.6Z"/><circle r="1.1" fill="#3F2718"/></g>
            <g id="lvqd"><path d="M0 -5.4 L5.4 0 L0 5.4 L-5.4 0Z"/><g fill="#3F2718"><circle cx="0" cy="-1.5" r="1.25"/><circle cx="1.5" cy="0" r="1.25"/><circle cx="0" cy="1.5" r="1.25"/><circle cx="-1.5" cy="0" r="1.25"/></g></g>
            <g id="lvci"><circle r="4.6"/><g fill="#3F2718"><circle cx="0" cy="-1.7" r="1.3"/><circle cx="1.7" cy="0" r="1.3"/><circle cx="0" cy="1.7" r="1.3"/><circle cx="-1.7" cy="0" r="1.3"/></g></g>
            <g id="lvlv"><path d="M-3.6 -5.4 h2 l-2.2 9 h4.4 l-.4 1.6 h-6.6z"/><path d="M-1 -5.4 h1.9 l1.6 7.4 l4 -7.4 h1.8 l-6.2 11 z"/></g>
            <pattern id="mono2" width="42" height="42" patternUnits="userSpaceOnUse"><rect width="42" height="42" fill="#3F2718"/><g fill="#A9793A"><use href="#lvlv" x="10" y="11"/><use href="#lvf4" x="31" y="11"/><use href="#lvqd" x="31" y="32"/><use href="#lvci" x="10" y="32"/></g></pattern>
            <pattern id="mono3" href="#mono2" patternTransform="translate(17 9)"/>
            <pattern id="grain" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".45" fill="#000" opacity=".18"/><circle cx="2.4" cy="2.2" r=".35" fill="#fff" opacity=".06"/></pattern>
            <linearGradient id="vsheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
            <radialGradient id="vsnapg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FBE7A6"/><stop offset=".55" stop-color="#D9AE52"/><stop offset="1" stop-color="#8E6A24"/></radialGradient></defs>
            <path d="M79 118 l-2.4 20 l3 -2.6 l2.4 2.8 l1.6 -20z" fill="#B42E5C" stroke="#3A1420" stroke-width=".7" stroke-linejoin="round"/>
            <rect x="3" y="3" width="94" height="119" rx="3.5" fill="url(#mono2)" stroke="#24150D" stroke-width="2.2"/>
            <rect x="3" y="3" width="94" height="119" rx="3.5" fill="url(#grain)"/><rect x="3" y="3" width="94" height="119" rx="3.5" fill="url(#vsheen)"/>
            <rect x="4.6" y="4.6" width="90.8" height="115.8" rx="2.4" fill="none" stroke="#7A3A28" stroke-width=".6" opacity=".7"/>
            <path d="M60 3 H93.5 Q97 3 97 6.5 V118.5 Q97 122 93.5 122 H66 L38.5 64.5 Q37.4 62.5 38.6 60.4Z" fill="#000" opacity=".28" transform="translate(-1.6 1.4)"/>
            <path d="M60 3 H93.5 Q97 3 97 6.5 V118.5 Q97 122 93.5 122 H66 L38.5 64.5 Q37.4 62.5 38.6 60.4Z" fill="url(#mono3)" stroke="#24150D" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M60 3 H93.5 Q97 3 97 6.5 V118.5 Q97 122 93.5 122 H66 L38.5 64.5 Q37.4 62.5 38.6 60.4Z" fill="url(#grain)"/>
            <path d="M60.6 5 L40.6 60.8 Q39.8 62.5 40.6 64.2 L66.6 120" fill="none" stroke="#7A3A28" stroke-width=".6" opacity=".7"/>
            <circle cx="44.5" cy="62.4" r="3.9" fill="url(#vsnapg)" stroke="#5E4416" stroke-width=".8"/><circle cx="43.4" cy="61.2" r="1.1" fill="#FFF6D6" opacity=".85"/></svg>`,
        open: 'wallet'
    },
    {
        id: 'pouch', name: 'my mildliner pouch', zip: 'main', l: 75.2, t: 62.9, w: 10.9, r: -8,
        art: `<svg viewBox="0 0 120 200"><g transform="translate(30 58) rotate(-12)"><rect x="-5" y="0" width="10" height="44" rx="3" fill="#FFFDF9" stroke="#3A2626" stroke-width="1.6"/><rect x="-5" y="-12" width="10" height="14" rx="3.5" fill="#C9B6E8" stroke="#3A2626" stroke-width="1.6"/></g><g transform="translate(42 50) rotate(-6)"><rect x="-5" y="0" width="10" height="44" rx="3" fill="#FFFDF9" stroke="#3A2626" stroke-width="1.6"/><rect x="-5" y="-12" width="10" height="14" rx="3.5" fill="#F4A7B9" stroke="#3A2626" stroke-width="1.6"/></g><g transform="translate(54 46) rotate(-2)"><rect x="-5" y="0" width="10" height="44" rx="3" fill="#FFFDF9" stroke="#3A2626" stroke-width="1.6"/><rect x="-5" y="-12" width="10" height="14" rx="3.5" fill="#9AD0E6" stroke="#3A2626" stroke-width="1.6"/></g><g transform="translate(66 46) rotate(2)"><rect x="-5" y="0" width="10" height="44" rx="3" fill="#FFFDF9" stroke="#3A2626" stroke-width="1.6"/><rect x="-5" y="-12" width="10" height="14" rx="3.5" fill="#F6D98A" stroke="#3A2626" stroke-width="1.6"/></g><g transform="translate(78 50) rotate(6)"><rect x="-5" y="0" width="10" height="44" rx="3" fill="#FFFDF9" stroke="#3A2626" stroke-width="1.6"/><rect x="-5" y="-12" width="10" height="14" rx="3.5" fill="#A8DDB5" stroke="#3A2626" stroke-width="1.6"/></g><g transform="translate(90 58) rotate(12)"><rect x="-5" y="0" width="10" height="44" rx="3" fill="#FFFDF9" stroke="#3A2626" stroke-width="1.6"/><rect x="-5" y="-12" width="10" height="14" rx="3.5" fill="#F5B48A" stroke="#3A2626" stroke-width="1.6"/></g><g class="tele-base"><path d="M12 116 q-4 6 0 12 M108 116 q4 6 0 12" fill="none" stroke="#E79AB0" stroke-width="3" stroke-linecap="round"/><rect x="16" y="108" width="88" height="86" rx="10" fill="#F2B8C8" stroke="#3A2626" stroke-width="2.5"/><path d="M22 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M26 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M30 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M34 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M38 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M42 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M46 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M50 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M54 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M58 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M62 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M66 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M70 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M74 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M78 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M82 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M86 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M90 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M94 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M98 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M102 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M18 186 H102" stroke="#E7A2B6" stroke-width="3" stroke-dasharray="1.5 1.5"/></g><g class="tele-sleeve" transform="translate(0 66)"><rect x="12" y="40" width="96" height="76" rx="7" fill="#FBF6F4" stroke="#3A2626" stroke-width="2.5"/><path d="M18 50 H102 M18 108 H102" stroke="#D9CFCB" stroke-width="1" stroke-dasharray="2 2"/><path d="M20 58 v42" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="12" y="30" width="96" height="13" rx="5" fill="#F2B8C8" stroke="#3A2626" stroke-width="2"/><path d="M16 36.5 H104" stroke="#E08AA4" stroke-width="2.4" stroke-dasharray="1.6 1.6"/><path d="M104 33 q8 -4 10 4 l-3 6" fill="#F2B8C8" stroke="#3A2626" stroke-width="1.6"/></g></svg>`,
        front: `<svg viewBox="0 0 120 200" class="tele"><g class="tele-base"><path d="M12 116 q-4 6 0 12 M108 116 q4 6 0 12" fill="none" stroke="#E79AB0" stroke-width="3" stroke-linecap="round"/><rect x="16" y="108" width="88" height="86" rx="10" fill="#F2B8C8" stroke="#3A2626" stroke-width="2.5"/><path d="M22 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M26 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M30 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M34 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M38 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M42 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M46 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M50 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M54 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M58 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M62 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M66 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M70 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M74 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M78 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M82 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M86 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M90 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M94 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M98 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M102 114 V190" stroke="#E7A2B6" stroke-width="1.2"/><path d="M18 186 H102" stroke="#E7A2B6" stroke-width="3" stroke-dasharray="1.5 1.5"/></g><g class="tele-sleeve"><rect x="12" y="40" width="96" height="76" rx="7" fill="#FBF6F4" stroke="#3A2626" stroke-width="2.5"/><path d="M18 50 H102 M18 108 H102" stroke="#D9CFCB" stroke-width="1" stroke-dasharray="2 2"/><path d="M20 58 v42" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="12" y="30" width="96" height="13" rx="5" fill="#F2B8C8" stroke="#3A2626" stroke-width="2"/><path d="M16 36.5 H104" stroke="#E08AA4" stroke-width="2.4" stroke-dasharray="1.6 1.6"/><path d="M104 33 q8 -4 10 4 l-3 6" fill="#F2B8C8" stroke="#3A2626" stroke-width="1.6"/></g></svg>`,
        open: 'mildliners'
    },
    {
        id: 'penpouch', name: 'my cicimelon pen pouch', zip: 'main', l: 89.3, t: 61.5, w: 23.2, r: 2,
        art: `<svg viewBox="0 0 240 104"><path d="M14 30 C14 22 20 18 28 18 H212 C220 18 226 22 226 30 V84 C226 94 218 100 206 100 H34 C22 100 14 94 14 84Z" fill="#F2C3C8" ${S} stroke-width="2.5"/>
            <path d="M14 46 H226" stroke="#3A2626" stroke-width="2"/><path d="M16 46 H224" stroke="#D9A7AE" stroke-width="5" stroke-dasharray="1.6 1.6"/>
            <path d="M14 40 C14 30 20 24 30 24 H210 C220 24 226 30 226 40" fill="none" stroke="#E7AFB6" stroke-width="1.2" stroke-dasharray="3 2"/>
            <g class="cc-pull"><rect x="196" y="40" width="10" height="12" rx="2" fill="#D8DADE" stroke="#3A2626" stroke-width="1.4"/><circle cx="201" cy="58" r="5" fill="none" stroke="#C9CDD3" stroke-width="2.4"/></g>
            <rect x="150" y="70" width="44" height="16" rx="2" fill="#FFFDF9" stroke="#CDB4B9" stroke-width="1"/><text x="172" y="80.8" text-anchor="middle" font-family="Instrument Sans" font-size="6" letter-spacing=".6" fill="#8E6A72">CICIMELON</text>
            <path d="M26 58 q60 -4 120 -2" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/></svg>`,
        open: 'gelpens'

    },
    {
        id: 'sunglasses', name: 'my chanel sunglasses', zip: 'shades', l: 84.6, t: 3.8, w: 13.2, r: -6,
        art: `<img src="assets/img/sunglasses.png" alt="" draggable="false" style="display:block; width:100%; height:auto">`,
        open: 'sunglasses'
    },
    {
        // black frames with the little gold bees on the corners
        id: 'readers', name: 'my reading glasses', zip: 'shades', l: 0, t: 0, w: 12.5, r: 4,
        art: `<img src="assets/img/reading-glasses.png" alt="" draggable="false" style="display:block; width:100%; height:auto">`,
        open: 'readers'
    },
    {
        id: 'jewelry', name: 'my little jewelry box', zip: 'shades', l: 0, t: 0, w: 23.2, r: -5,
        art: `<svg viewBox="0 0 120 84"><defs><pattern id="jwq" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#F4C3CF"/><path d="M0 0 H10 M0 0 V10" stroke="#E7A9B9" stroke-width="1"/></pattern></defs>
            <rect x="6" y="10" width="108" height="68" rx="12" fill="url(#jwq)" ${S}/><path d="M6 46 H114" ${S} stroke-width="2"/><path d="M14 16 h92" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>
            <rect x="50" y="38" width="20" height="16" rx="4" fill="#E2B24A" ${S} stroke-width="2"/><circle cx="60" cy="46" r="2.4" fill="#9C7420"/></svg>`,
        open: 'jewelry'
    },
    {
        id: 'keys', name: 'my keys', zip: 'shades', l: 93.0, t: 14.4, w: 11.7, r: 4,
        get art() { return window.KEYRING(false); },
        open: 'keys'
    },
    {
        id: 'mirror', name: 'my chanel miroir double facettes', zip: 'shades', l: 24.4, t: 55.4, w: 7.5, r: 0,
        art: `<svg viewBox="0 0 120 120"><defs><linearGradient id="lacq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A383B"/><stop offset=".35" stop-color="#0E0D0F"/><stop offset="1" stop-color="#1B1A1D"/></linearGradient></defs>
            <path d="M18 6 C40 3 80 3 102 6 C112 8 116 14 116 24 C118 48 118 72 116 96 C116 106 112 112 102 114 C80 117 40 117 18 114 C8 112 4 106 4 96 C2 72 2 48 4 24 C4 14 8 8 18 6Z" fill="url(#lacq)" ${S}/>
            <path d="M14 22 C26 12 50 10 70 12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".22"/><path d="M8 60 C8 40 10 28 18 18" fill="none" stroke="#fff" stroke-width="1.6" opacity=".14"/>
            <g transform="translate(60 60)"><g fill="none" stroke-linecap="butt"><circle cx="0" cy="0" r="17" fill="#0B0A0B" stroke="#C9CDD2" stroke-width="2.2"/><circle cx="0" cy="0" r="14.6" fill="none" stroke="#5A5D62" stroke-width=".8"/><path d="M-1.2 -6.8 A7.6 7.6 0 1 0 -1.2 6.8" stroke="#F4F2EE" stroke-width="2.4"/><path d="M1.2 -6.8 A7.6 7.6 0 1 1 1.2 6.8" stroke="#F4F2EE" stroke-width="2.4"/></g></g></svg>`,
        open: 'mirror'
    },
    {
        id: 'skin-pouch', name: 'my victoria’s secret skincare pouch', zip: 'front', l: 0, t: 0, w: 19, r: 3,
        get art() { return `<svg viewBox="0 0 200 130"><defs><pattern id="vsk" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#FFF5F3"/><rect width="8" height="16" fill="#F6D3DB"/></pattern></defs><path d="M14 40 C14 22 186 22 186 40 L178 116 C176 124 24 124 22 116Z" fill="url(#vsk)" ${S}/><path d="M22 40 H178" ${S} stroke-dasharray="5 5"/><rect x="164" y="30" width="18" height="16" rx="4" fill="#D9A441" ${S} stroke-width="2.5"/><path d="M173 46 v16" ${S} stroke-width="2.5"/><circle cx="173" cy="66" r="5" fill="#fff" ${S} stroke-width="2"/><text x="100" y="90" text-anchor="middle" font-family="Bodoni Moda" font-size="13" letter-spacing="3" fill="#C98A9C">SKINCARE</text></svg>`; },
        open: 'skinbag'
    },
    {
        id: 'makeup-pouch', name: 'my victoria’s secret makeup pouch', zip: 'front', l: 86.5, t: 49.9, w: 20.7, r: -4,
        art: `<svg viewBox="0 0 200 130"><defs><pattern id="vs" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(0)"><rect width="16" height="16" fill="#F7C9D6"/><rect width="8" height="16" fill="#F29BB6"/></pattern></defs><path d="M14 40 C14 22 186 22 186 40 L178 116 C176 124 24 124 22 116Z" fill="url(#vs)" ${S}/><path d="M22 40 H178" ${S} stroke-dasharray="5 5"/><rect x="164" y="30" width="18" height="16" rx="4" fill="#D9A441" ${S} stroke-width="2.5"/><path d="M173 46 v16" ${S} stroke-width="2.5"/><circle cx="173" cy="66" r="5" fill="#fff" ${S} stroke-width="2"/><rect x="40" y="4" width="10" height="42" rx="3" fill="#E8EFF6" ${S} stroke-width="2" transform="rotate(-8 45 25)"/><path d="M68 44 V14 q8 -14 16 0 V44Z" fill="#3A2626" ${S} stroke-width="2"/><circle cx="76" cy="10" r="9" fill="#F2D7C8" ${S} stroke-width="2"/><text x="100" y="90" text-anchor="middle" font-family="Bodoni Moda" font-size="13" letter-spacing="3" fill="#7E2246">MAKEUP</text></svg>`,
        open: 'makeupbag'
    },
    {
        id: 'stanley', name: 'my pink stanley', zip: 'side', l: 69, t: 47, w: 6, r: 3,
        art: `<svg viewBox="0 0 64 240"><defs>
            <pattern id="bowprint" width="32" height="44" patternUnits="userSpaceOnUse">
                <rect width="32" height="44" fill="#FFFCFB"/>
                <g fill="none" stroke="#F3AFC2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 14 C10 6 4 8 6 13 C8 17 14 16 16 14 C18 16 24 17 26 13 C28 8 22 6 16 14Z"/>
                    <path d="M16 14 C14 20 11 25 9 29 M16 14 C18 20 21 25 23 29"/>
                </g>
                <g fill="#F6BFD0"><circle cx="4" cy="34" r="1.8"/><circle cx="7" cy="36" r="1.3"/><circle cx="28" cy="38" r="1.8"/><circle cx="25" cy="40" r="1.2"/><circle cx="16" cy="40" r="1.4"/><circle cx="30" cy="4" r="1.5"/><circle cx="2" cy="4" r="1.3"/></g>
                <path d="M2 30 q4 4 8 2 M24 34 q4 4 8 2" fill="none" stroke="#F6BFD0" stroke-width="1"/>
            </pattern></defs>
            <path d="M18 36 C18 50 6 54 6 70 V228 Q6 236 14 236 H50 Q58 236 58 228 V70 C58 54 46 50 46 36Z" fill="#F7D3DC" ${S}/>
            <rect x="7.5" y="112" width="49" height="110" fill="url(#bowprint)"/><path d="M7.5 112 H56.5 M7.5 222 H56.5" stroke="#E9B4C3" stroke-width="1"/>
            <rect x="15" y="146" width="34" height="22" rx="2" fill="#FFFCFB" opacity=".9"/><text x="32" y="158" text-anchor="middle" font-family="Instrument Sans" font-weight="800" font-size="8" letter-spacing=".6" fill="#B07A2E">STANLEY</text><text x="32" y="165" text-anchor="middle" font-family="Instrument Sans" font-size="3.6" letter-spacing=".3" fill="#C98AA0">LOVESHACKFANCY</text>
            <rect x="18" y="31" width="28" height="6" fill="#D9A441" ${S} stroke-width="2"/>
            <g class="lid"><path d="M17 31 V12 Q17 4 25 4 H39 Q47 4 47 12 V31Z" fill="#F7D3DC" ${S}/><path d="M22 9 q6 -2 12 0" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></g>
            <path d="M11 76 v140" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>
        </svg>`,
        open: 'stanley'
    },
    {
        id: 'sweater', name: 'my pink ralph lauren cable knit', zip: 'main', l: 15.0, t: 41.7, w: 28.2, r: -4,
        art: `<svg viewBox="0 0 240 170"><defs>
            <pattern id="rib" width="6" height="10" patternUnits="userSpaceOnUse"><rect width="6" height="10" fill="#E996AB"/><path d="M3 0 v10" stroke="#D27C93" stroke-width="2"/></pattern>
            <pattern id="cable" width="40" height="28" patternUnits="userSpaceOnUse"><rect width="40" height="28" fill="#F3A9BB"/>
                <path d="M6 0 C14 7 14 7 6 14 C14 21 14 21 6 28 M14 0 C6 7 6 7 14 14 C6 21 6 21 14 28" fill="none" stroke="#D9849C" stroke-width="2.6"/>
                <path d="M30 0 L38 14 L30 28 M30 0 L22 14 L30 28" fill="none" stroke="#DE8CA2" stroke-width="2.2"/>
                <path d="M19 0 v28" stroke="#E395A9" stroke-width="1.6" stroke-dasharray="2 2"/>
            </pattern></defs>
            <path d="M8 60 C4 90 6 130 14 150 L36 150 L40 64Z" fill="url(#cable)" ${S} stroke-width="2.5"/>
            <rect x="26" y="34" width="200" height="124" rx="16" fill="url(#cable)" ${S}/>
            <rect x="26" y="138" width="200" height="20" rx="8" fill="url(#rib)" ${S} stroke-width="2.5"/>
            <path d="M90 34 L126 84 L162 34Z" fill="url(#rib)" ${S} stroke-width="2.5"/>
            <path d="M102 34 L126 68 L150 34Z" fill="#C56C86" ${S} stroke-width="2"/>
            <rect x="118" y="36" width="16" height="6" rx="1.5" fill="#F4EFE6" stroke="#3A2626" stroke-width="1"/>
            <path d="M40 46 q40 -8 80 -6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".14"/>
        </svg>`,
        open: 'sweater'
    },
    {
        id: 'nb1', name: 'my erin condren notebook (blue)', zip: 'main', l: 0, t: 0, w: 20.7, r: -4,
        get art() { return window.EC([['#5B83C0', '#F4E6EE'], ['#FBEFF3', '#D64F8C'], ['#D44E8C', '#F4C9DA'], ['#FBEFF3', '#5B83C0']]); },
        open: 'nb1'
    },
    {
        id: 'nb2', name: 'my erin condren notebook (pink)', zip: 'main', l: 0, t: 0, w: 20.7, r: 5,
        get art() { return window.EC([['#E0568F', '#F7D5E2'], ['#FBE6EC', '#8DA0C2'], ['#8EA2C4', '#EEF1F8'], ['#FBE6EC', '#E0568F']]); },
        open: 'nb2'
    },
    {
        id: 'romcom', name: 'you deserve each other', zip: 'main', l: 9.4, t: 58.8, w: 12.5, r: -7,
        art: `<svg viewBox="0 0 120 180"><rect x="2" y="2" width="116" height="176" rx="2" fill="#B5215E" ${S}/>
            <g font-family="Kalam, Caveat, cursive" fill="#F6EBDD"><text x="11" y="11" font-size="4.6">“The perfect dose of</text><text x="11" y="16.5" font-size="4.6">sweet, hilarious <tspan font-style="italic">joy</tspan>.”</text><text x="12" y="22" font-size="4.2">–CHRISTINA LAUREN</text></g>
            <g fill="#F6EBDD" stroke="#E9D9C6" stroke-width=".4"><rect x="60" y="2" width="9" height="23" rx="1"/><rect x="88" y="2" width="9" height="26" rx="1"/></g>
            <path d="M61.5 5 h6 M61.5 8 h6 M61.5 11 h6 M61.5 14 h6 M61.5 17 h6 M61.5 20 h6 M89.5 5 h6 M89.5 8 h6 M89.5 11 h6 M89.5 14 h6 M89.5 17 h6 M89.5 20 h6 M89.5 23 h6" stroke="#B5215E" stroke-width="1.3"/>
            <path d="M71 26 C71 10 73 4 79 4 C86 4 87 10 86 26Z" fill="#7A3A22"/><ellipse cx="79" cy="13" rx="4.6" ry="5.6" fill="#F2CDB8"/><path d="M74.2 11 q4.8 -6 9.6 0 q-1 -4 -4.8 -4.4 q-4 .4 -4.8 4.4z" fill="#7A3A22"/><path d="M77.2 15.6 q1.8 1.2 3.4 0" stroke="#D0435E" stroke-width=".9" fill="none"/>
            <path d="M71 31 C71 22 75 20 79 20 C84 20 88 22 88 31Z" fill="#4C3A9A"/><path d="M76.5 20.5 L79 25 L81.5 20.5" fill="#F2CDB8"/><circle cx="79" cy="25.6" r=".7" fill="#E7B44A"/>
            <path d="M74 26 C66 27 58 29 50 28.5" stroke="#F2CDB8" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M50 28.5 l-3 -1.6 M50 28.5 l-3.4 .2 M50 28.5 l-2.8 1.8" stroke="#F2CDB8" stroke-width="1" stroke-linecap="round"/>
            <rect x="61" y="29" width="28" height="4" rx="1" fill="#F6EBDD"/>
            <g transform="translate(55 47) rotate(14)"><path d="M0 -12 v-4 M-1.5 -16 l1.5 -2 1.5 2" stroke="#2E7D4F" stroke-width="1.1" fill="none"/><rect x="-1.6" y="-12" width="3.2" height="4" fill="#F6EBDD"/>
                <path d="M-8 -2 q-4 -4 -2 -7 M8 -3 q4 -3 3 -7 M-6 6 q-5 1 -6 4 M6 6 q5 2 5 5" stroke="#2E7D4F" stroke-width="2.4" stroke-linecap="round" fill="none"/>
                <g fill="#FBF3F1" stroke="#E8C9CF" stroke-width=".5"><circle cx="-4" cy="-4" r="3.4"/><circle cx="3" cy="-5" r="3.2"/><circle cx="0" cy="1" r="3.6"/><circle cx="-6" cy="3" r="2.6"/><circle cx="6" cy="2" r="2.8"/><circle cx="2" cy="7" r="2.2"/></g>
                <g fill="#fff"><circle cx="-8" cy="8" r="1"/><circle cx="8" cy="9" r=".9"/><circle cx="-2" cy="11" r=".8"/></g></g>
            <g fill="#fff"><circle cx="52" cy="66" r=".8"/><circle cx="57" cy="70" r=".7"/><circle cx="50" cy="73" r=".6"/></g><path d="M48 68 q2 -2 3 1 M56 75 q2 -1 2 2" stroke="#2E7D4F" stroke-width="1" fill="none"/>
            <text x="8" y="41" font-family="Kalam, Caveat, cursive" font-size="7" fill="#F6EBDD">a novel</text>
            <g font-family="Kalam, Caveat, cursive" font-weight="400" text-anchor="middle">
                <text x="58" y="56" font-size="21" fill="#A8D8CB" transform="scale(1 1.32)" letter-spacing="1">YOU</text>
                <text x="52" y="73.5" font-size="18.5" fill="#F6EBDD" transform="scale(1 1.32)" letter-spacing=".6">DESERVE</text>
                <text x="56" y="91" font-size="20" fill="#A8D8CB" transform="scale(1 1.32)" letter-spacing="1">EACH</text>
                <text x="55" y="108.5" font-size="20" fill="#F6EBDD" transform="scale(1 1.32)" letter-spacing="1">OTHER</text>
                <text x="66" y="171" font-size="14" fill="#A8D8CB">Sarah Hogle</text></g>
            <g><path d="M5 104 q2 -9 9 -9 q8 0 8 8 q-3 -3 -8 -3 q-6 0 -9 4z" fill="#5A2A12"/><ellipse cx="13.5" cy="105" rx="5.6" ry="6.8" fill="#E9B79C"/><path d="M8 103 q5.5 -6 11 0 q-2 -4 -5.5 -4 q-3.6 0 -5.5 4z" fill="#5A2A12"/>
                <circle cx="11.2" cy="104.6" r="2" fill="none" stroke="#B8823C" stroke-width=".7"/><circle cx="16.2" cy="104.6" r="2" fill="none" stroke="#B8823C" stroke-width=".7"/><path d="M13.2 104.6 h1" stroke="#B8823C" stroke-width=".6"/><path d="M12 109 q1.5 1 3 0" stroke="#A8574A" stroke-width=".8" fill="none"/>
                <path d="M10 111 h7 v4 h-7z" fill="#E9B79C"/><path d="M2 118 C4 114 9 113 13.5 113 C18 113 23 114 25 118 L27 152 H0 V122Z" fill="#2F3A68"/><path d="M8.5 114.5 h10 l-1.5 37 h-7z" fill="#FBF7F2"/>
                <path d="M2 131 C8 128 16 128 25 131 L25 137 C16 134 8 134 2 137Z" fill="#26315A" stroke="#1E2748" stroke-width=".6"/><path d="M4 133 C10 131 16 133 22 135" stroke="#1E2748" stroke-width=".6" fill="none"/>
                <path d="M3 152 h10.5 v26 h-10z M14 152 h10.5 l-.5 26 h-10z" fill="#6B3A22"/></g></svg>`,
        open: 'romcom'
    },
    {
        id: 'scrunchies', name: 'my silk scrunchies', zip: 'front', l: 34.3, t: 21.2, w: 16.9, r: 0,
        get art() { return `<svg viewBox="0 0 150 90">${window.SCRUNCHIE(48, 46, 25, ...window.SCR_BROWN)}${window.SCRUNCHIE(102, 42, 25, ...window.SCR_PINK)}</svg>`; },
        open: 'hairpony'
    },
    {
        id: 'comb', name: 'my wide-tooth comb', zip: 'front', l: 54.5, t: 20.5, w: 15.5, r: 0,
        art: `<svg viewBox="0 0 150 150"><defs><linearGradient id="cw2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E5A2A"/><stop offset=".5" stop-color="#76461F"/><stop offset="1" stop-color="#5E3617"/></linearGradient></defs>
            <g fill="none"><path d="M34.5 27.5 L14.5 47.5" stroke="#2E1B0E" stroke-width="5.6" stroke-linecap="round"/><path d="M41 34 L21 54" stroke="#2E1B0E" stroke-width="5.6" stroke-linecap="round"/><path d="M47.5 39.5 L27.5 59.5" stroke="#2E1B0E" stroke-width="5.6" stroke-linecap="round"/><path d="M53.5 45.5 L33.5 65.5" stroke="#2E1B0E" stroke-width="5.6" stroke-linecap="round"/><path d="M59.5 52 L39.5 72" stroke="#2E1B0E" stroke-width="5.6" stroke-linecap="round"/><path d="M65.5 58 L45.5 78" stroke="#2E1B0E" stroke-width="5.6" stroke-linecap="round"/><path d="M71.5 64.5 L51.5 84.5" stroke="#2E1B0E" stroke-width="5.6" stroke-linecap="round"/><path d="M77.5 70.5 L57.5 90.5" stroke="#2E1B0E" stroke-width="5.6" stroke-linecap="round"/><path d="M82 84 L66 98" stroke="#2E1B0E" stroke-width="8" stroke-linecap="round"/><path d="M34.5 27.5 L14.5 47.5" stroke="url(#cw2)" stroke-width="3.6" stroke-linecap="round"/><path d="M30.5 30.5 L17.5 43.5" stroke="#A06A36" stroke-width=".6" stroke-linecap="round" opacity=".6"/><path d="M41 34 L21 54" stroke="url(#cw2)" stroke-width="3.6" stroke-linecap="round"/><path d="M37 37 L24 50" stroke="#A06A36" stroke-width=".6" stroke-linecap="round" opacity=".6"/><path d="M47.5 39.5 L27.5 59.5" stroke="url(#cw2)" stroke-width="3.6" stroke-linecap="round"/><path d="M43.5 42.5 L30.5 55.5" stroke="#A06A36" stroke-width=".6" stroke-linecap="round" opacity=".6"/><path d="M53.5 45.5 L33.5 65.5" stroke="url(#cw2)" stroke-width="3.6" stroke-linecap="round"/><path d="M49.5 48.5 L36.5 61.5" stroke="#A06A36" stroke-width=".6" stroke-linecap="round" opacity=".6"/><path d="M59.5 52 L39.5 72" stroke="url(#cw2)" stroke-width="3.6" stroke-linecap="round"/><path d="M55.5 55 L42.5 68" stroke="#A06A36" stroke-width=".6" stroke-linecap="round" opacity=".6"/><path d="M65.5 58 L45.5 78" stroke="url(#cw2)" stroke-width="3.6" stroke-linecap="round"/><path d="M61.5 61 L48.5 74" stroke="#A06A36" stroke-width=".6" stroke-linecap="round" opacity=".6"/><path d="M71.5 64.5 L51.5 84.5" stroke="url(#cw2)" stroke-width="3.6" stroke-linecap="round"/><path d="M67.5 67.5 L54.5 80.5" stroke="#A06A36" stroke-width=".6" stroke-linecap="round" opacity=".6"/><path d="M77.5 70.5 L57.5 90.5" stroke="url(#cw2)" stroke-width="3.6" stroke-linecap="round"/><path d="M73.5 73.5 L60.5 86.5" stroke="#A06A36" stroke-width=".6" stroke-linecap="round" opacity=".6"/><path d="M82 84 L66 98" stroke="url(#cw2)" stroke-width="6" stroke-linecap="round"/></g>
            <path d="M6 45 C4 38 10 28 21 17 L31 25 C23 31 15 38 10 46 C9 48 7 48 6 45Z" fill="url(#cw2)" stroke="#2E1B0E" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M21 17 C30 13 41 15 51 23 C65 35 80 51 94 67 C108 81 122 95 132 110 C140 123 140 138 132 141 C124 144 118 134 112 124 C105 112 97 102 90 96 C87 93 85 91 84 88 C70 72 50 48 30 26Z" fill="url(#cw2)" stroke="#2E1B0E" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M28 20 C40 20 52 30 64 42 C80 58 98 76 116 98 C126 110 132 122 134 132" fill="none" stroke="#A9733E" stroke-width="1" opacity=".7"/>
            <path d="M36 28 C50 40 66 56 82 74 M100 90 C110 100 118 112 124 126 M104 80 C114 92 124 104 130 118" fill="none" stroke="#4E2C12" stroke-width=".7" opacity=".55"/>
            <path d="M26 18 q14 -3 26 8" fill="none" stroke="#C99560" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></svg>`,
        open: 'haircomb'
    },
    {
        id: 'cap', name: 'my brown ny cap', zip: 'main', l: 13.2, t: 25.3, w: 24.4, r: -6,
        art: `<svg viewBox="0 0 200 150"><defs><linearGradient id="capg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A5A49"/><stop offset=".65" stop-color="#6E4F3F"/><stop offset="1" stop-color="#5F4334"/></linearGradient></defs>
            <path d="M36 104 C26 56 62 16 112 16 C160 16 192 52 188 102 C160 94 120 92 84 94 C66 95 50 99 36 104Z" fill="url(#capg2)" ${S}/>
            <path d="M112 17 C104 40 100 68 100 93 M112 17 C138 30 156 58 162 96 M112 17 C82 26 58 52 50 98" fill="none" stroke="#5A3E30" stroke-width="1.6"/>
            <circle cx="112" cy="16" r="4.6" fill="#6E4F3F" stroke="#3A2626" stroke-width="2"/><circle cx="76" cy="44" r="1.5" fill="#4A3226"/><circle cx="148" cy="40" r="1.5" fill="#4A3226"/>
            <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="34" fill="#6E4F3F" stroke="#3E2A20" stroke-width="1.6"><text x="82" y="76" transform="rotate(-4 100 64)">N</text><text x="101" y="82" transform="rotate(-4 100 64)">Y</text></g>
            <text x="172" y="88" font-family="Instrument Sans" font-weight="700" font-size="8" fill="#4A3226" transform="rotate(-10 172 88)">47</text>
            <path d="M36 104 C66 94 130 92 188 102 C182 118 152 128 112 134 C72 140 30 142 10 132 C14 120 24 110 36 104Z" fill="#6A4C3C" ${S}/>
            <path d="M28 124 C70 116 130 108 176 106 M38 130 C80 122 132 114 170 112" fill="none" stroke="#59402F" stroke-width="1.3" stroke-dasharray="4 3"/>
            <path d="M58 30 q24 -12 52 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".18"/></svg>`,
        open: 'cap'
    },
    {
        id: 'padfolio', name: 'my mccombs padfolio', zip: 'main', l: 83.7, t: 82.7, w: 23.9, r: -3,
        art: `<svg viewBox="0 0 120 156"><rect x="4" y="4" width="112" height="148" rx="9" fill="#1D1D21" ${S}/>
            <rect x="9" y="9" width="102" height="138" rx="6" fill="none" stroke="#3B3B42" stroke-width="1.3" stroke-dasharray="2.5 2"/>
            <path d="M116 14 V142" stroke="#45454D" stroke-width="2.5" stroke-dasharray="1.5 1.5"/>
            <path d="M88 10 C80 50 80 106 90 146" fill="none" stroke="#0E0E11" stroke-width="2"/><path d="M90 10 C82 50 82 106 92 146" fill="none" stroke="#34343B" stroke-width="1"/>
            <g transform="translate(58 78) rotate(90)" text-anchor="middle" font-family="Bodoni Moda, Georgia, serif" fill="#121215" stroke="#2C2C33" stroke-width=".35">
                <text y="-3" font-size="6.4">The University of Texas at Austin</text><text y="7" font-size="8.6">McCombs School of Business</text></g>
            <path d="M14 18 q20 -6 40 -4" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".08"/></svg>`,
        open: 'padfolio'
    },
    {
        id: 'boarding', name: 'my boarding pass', zip: 'devices', l: 50.8, t: 28.7, w: 18.8, r: 4,
        art: `<svg viewBox="0 0 200 80"><path d="M6 4 H194 V30 a6 6 0 0 0 0 12 V76 H6 V42 a6 6 0 0 0 0 -12Z" fill="#FFFDF8" ${S} stroke-width="2.5"/>
            <rect x="6" y="4" width="188" height="16" fill="#F4A7B9" stroke="#3A2626" stroke-width="2"/><text x="14" y="15.5" font-family="Instrument Sans" font-weight="600" font-size="8" fill="#3A2626" letter-spacing="1.5">BOARDING PASS</text>
            <path d="M146 20 V76" stroke="#3A2626" stroke-width="1.5" stroke-dasharray="3 3"/>
            <g font-family="Instrument Sans" fill="#3A2626"><text x="14" y="32" font-size="5">PASSENGER</text><text x="14" y="40" font-size="7.5" font-weight="600">SUHANI TIWARI</text>
                <text x="14" y="58" font-size="16" font-weight="700">AUS</text><text x="62" y="56" font-size="11">✈</text><text x="84" y="58" font-size="16" font-weight="700">???</text>
                <text x="14" y="70" font-size="5">SEAT window, obviously</text><text x="84" y="70" font-size="5">GATE sprinting</text>
                <text x="152" y="32" font-size="5">TO</text><text x="152" y="44" font-size="11" font-weight="700">???</text><text x="152" y="56" font-size="5">GROUP whenever</text></g>
            <g fill="#3A2626">${[0,3,5,9,11,14,18,20,23,27,29,32].map((x, k) => `<rect x="${152 + x}" y="61" width="${k % 3 ? 1.2 : 2.2}" height="10"/>`).join('')}</g></svg>`,
        open: 'boarding'
    },
    {
        id: 'perfume', name: 'my perfume', zip: 'front', l: 40, t: 71.1, w: 8.5, r: -4,
        art: `<svg viewBox="0 0 120 160"><defs><linearGradient id="chrome2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8B9198"/><stop offset=".22" stop-color="#E9ECEF"/><stop offset=".42" stop-color="#FFFFFF"/><stop offset=".62" stop-color="#B9BEC4"/><stop offset="1" stop-color="#7E848B"/></linearGradient>
                <linearGradient id="juice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBDCD7"/><stop offset=".75" stop-color="#F8CFC8"/><stop offset="1" stop-color="#F6BFA0"/></linearGradient></defs>
            <g class="pspray"><rect x="47" y="34" width="26" height="12" rx="2" fill="url(#chrome2)" stroke="#3A2626" stroke-width="1.6"/><g class="pact"><rect x="51" y="22" width="18" height="13" rx="2" fill="url(#chrome2)" stroke="#3A2626" stroke-width="1.6"/><circle cx="55" cy="28" r="1.4" fill="#4A4F55"/></g></g>
            <rect x="10" y="44" width="100" height="112" rx="9" fill="#FBF3F2" stroke="#3A2626" stroke-width="2.4"/>
            <rect x="16" y="50" width="88" height="100" rx="5" fill="url(#juice)"/>
            <path d="M16 56 h88" stroke="#fff" stroke-width="1.4" opacity=".6"/><path d="M14 52 v96 M106 52 v96" stroke="#fff" stroke-width="2" opacity=".75"/>
            <rect x="30" y="66" width="60" height="72" fill="#F5B9B1" stroke="#CDD1D6" stroke-width="2.6"/><rect x="33" y="69" width="54" height="66" fill="none" stroke="#fff" stroke-width=".5" opacity=".6"/>
            <g text-anchor="middle" fill="#2E2426"><text x="62" y="80" font-family="Bodoni Moda, Georgia, serif" font-size="6.4">amazing</text><text x="60" y="94" font-family="Bodoni Moda, Georgia, serif" font-weight="700" font-size="17">grace</text><text x="64" y="102" font-family="Bodoni Moda, Georgia, serif" font-style="italic" font-size="6.6">ballet rose</text>
                <text x="60" y="111" font-family="Georgia, serif" font-size="3.6"><tspan font-weight="700">philosophy:</tspan> grace lets you move</text><text x="60" y="115.5" font-family="Georgia, serif" font-size="3.6">to your own rhythm.</text>
                <text x="60" y="124" font-family="Georgia, serif" font-weight="700" font-size="4.4">eau de parfum</text><text x="60" y="132.5" font-family="Georgia, serif" font-size="6.4">philosophy</text></g>
            <g class="pcap"><rect x="41" y="2" width="38" height="44" rx="3" fill="url(#chrome2)" stroke="#3A2626" stroke-width="2"/><path d="M50 6 v36" stroke="#fff" stroke-width="3" opacity=".9"/><path d="M71 6 v36" stroke="#6E747B" stroke-width="1.5" opacity=".6"/><ellipse cx="60" cy="3.5" rx="18" ry="1.6" fill="#F4F6F8" opacity=".7"/></g></svg>`,
        open: 'perfume'
    },
    {
        id: 'journal', name: 'my “believing in herself” journal', zip: 'main', l: 0, t: 0, w: 12.5, r: 5,
        art: `<svg viewBox="0 0 125 176" preserveAspectRatio="none" style="aspect-ratio: 2 / 3"><path d="M14 3 q-6 -2 -10 6" fill="none" stroke="#C2306A" stroke-width="2.4"/>
            <rect x="3" y="3" width="119" height="170" rx="6" fill="#E0457E" ${S}/><path d="M6 6 v164" stroke="#C9356C" stroke-width="2"/>
            <g font-family="Caveat, cursive" fill="#FFF6F2" text-anchor="middle"><text x="62" y="40" font-size="20">her</text><text x="60" y="60" font-size="20">greatest</text><text x="62" y="80" font-size="20">power is</text><text x="62" y="101" font-size="22">believing</text><text x="58" y="120" font-size="18">in</text></g>
            <text x="62" y="141" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="22" fill="#D9AE52">herself</text><path d="M30 146 q34 -2 70 -10" fill="none" stroke="#D9AE52" stroke-width="1.4"/><path d="M98 128 c-1.4 -1.6 -3.4 .2 -1.6 2 l1.6 1.4 1.6 -1.4 c1.8 -1.8 -.2 -3.6 -1.6 -2z" fill="#D9AE52"/></svg>`,
        open: 'journal'
    },
    {
        id: 'bear', name: 'T.D., my teddy bear', zip: 'main', l: 0, t: 0, w: 19, r: -6,
        art: `<svg viewBox="-8 -4 216 230">
            <!-- T.D., from the real one: shaggy honey-gold fur that sticks out everywhere, little beige felt ears, beige muzzle and foot pads, a brown felt bow -->
            <ellipse cx="62" cy="36" rx="13" ry="14" fill="#DCCDB8" stroke="#3A2626" stroke-width="3.5"/><ellipse cx="140" cy="34" rx="13" ry="14" fill="#DCCDB8" stroke="#3A2626" stroke-width="3.5"/>
            <path d="M43.6 152.6Q41.3 160.5 38.8 166.8M40.4 152.6Q37.2 164.2 36.7 169.8M36.3 151.9Q30 158.2 26 167.6M34.8 151.5Q30.7 158.1 27.8 160.4M31.9 150.3Q21.4 154.6 17 162.4M28.5 148.3Q21.5 148.5 15.6 153.9M26.9 146.8Q18.2 152.6 14.5 160.3M24.9 144.2Q17 148.3 12.2 157.1M24.5 143.5Q17.9 149.1 10.7 155.4M23.5 140.9Q17.2 143.7 9.3 151M23.1 138.1Q20.1 142.1 11.5 142.4M23.3 135.9Q14.2 140.9 6.4 141.7M24.2 133Q18.2 129.5 15.6 128.8M25.7 130.6Q17.1 127.8 13.6 129.9M27.2 128.9Q21.6 126.4 17.5 124.5M30 126.7Q27.3 121.5 20.2 120.1M31 126.1Q25.1 118.8 22.3 115.3M34.9 124.4Q31.2 123.1 22.2 117.1M37.6 123.8Q30.5 123.4 28.9 117.4M39.8 123.5Q38 119.3 32.3 113.9M43.1 123.4Q40.7 117.4 43.5 114.7M46.8 123.9Q46.7 120.1 49.3 111.3M49 124.4Q48.9 118 49.5 116.9M51.7 125.5Q52.2 120.3 57.2 116.7M55.5 127.7Q62.9 123.9 68 119.1M56.4 128.5Q60.9 126.3 60.4 121.7M176.9 138.4Q186.5 143.9 193.7 145.9M176.5 141.1Q184.8 147 188.3 148.4M176 142.6Q182.7 150 188.5 155.9M174.8 144.8Q178 151.4 186.4 156.4M172.2 147.6Q175.8 157.9 180.7 165.3M170.7 148.9Q170.3 157.7 174.9 163.5M169.2 149.8Q171.1 158.7 176.2 165.3M165.6 151.4Q163.4 156.8 164.1 168.1M163.1 152.1Q163.5 163.1 167.9 169.2M159.2 152.6Q155.4 160.5 153.6 166.4M145.4 127.1Q141.6 125.6 135.9 120.5M148.5 125.3Q142.2 120.8 136.2 120.1M149.4 125Q144.3 119.1 143 116M153 123.9Q150.4 120.3 146.3 113.6M156.2 123.4Q154 119.9 156.7 111.1M160.1 123.5Q160.2 121.8 158.9 115.2M162.4 123.8Q166.6 121.3 167.3 113.6M165.5 124.6Q166.8 120.9 165.3 113.3M168.6 125.9Q172.5 123.1 171.6 114.4M171.6 127.8Q176.1 127.4 182.8 122.1M173.4 129.5Q176.2 125.8 179.6 121.5M174.9 131.5Q180.9 125 183.1 123.7M176.1 133.8Q182.9 130.2 186.3 130.9M176.5 135Q185.6 137.1 190.7 136.9" fill="none" stroke="#3A2626" stroke-width="4.6" stroke-linecap="round"/><path d="M43.6 152.6Q41.3 160.5 38.8 166.8M40.4 152.6Q37.2 164.2 36.7 169.8M36.3 151.9Q30 158.2 26 167.6M34.8 151.5Q30.7 158.1 27.8 160.4M31.9 150.3Q21.4 154.6 17 162.4M28.5 148.3Q21.5 148.5 15.6 153.9M26.9 146.8Q18.2 152.6 14.5 160.3M24.9 144.2Q17 148.3 12.2 157.1M24.5 143.5Q17.9 149.1 10.7 155.4M23.5 140.9Q17.2 143.7 9.3 151M23.1 138.1Q20.1 142.1 11.5 142.4M23.3 135.9Q14.2 140.9 6.4 141.7M24.2 133Q18.2 129.5 15.6 128.8M25.7 130.6Q17.1 127.8 13.6 129.9M27.2 128.9Q21.6 126.4 17.5 124.5M30 126.7Q27.3 121.5 20.2 120.1M31 126.1Q25.1 118.8 22.3 115.3M34.9 124.4Q31.2 123.1 22.2 117.1M37.6 123.8Q30.5 123.4 28.9 117.4M39.8 123.5Q38 119.3 32.3 113.9M43.1 123.4Q40.7 117.4 43.5 114.7M46.8 123.9Q46.7 120.1 49.3 111.3M49 124.4Q48.9 118 49.5 116.9M51.7 125.5Q52.2 120.3 57.2 116.7M55.5 127.7Q62.9 123.9 68 119.1M56.4 128.5Q60.9 126.3 60.4 121.7M176.9 138.4Q186.5 143.9 193.7 145.9M176.5 141.1Q184.8 147 188.3 148.4M176 142.6Q182.7 150 188.5 155.9M174.8 144.8Q178 151.4 186.4 156.4M172.2 147.6Q175.8 157.9 180.7 165.3M170.7 148.9Q170.3 157.7 174.9 163.5M169.2 149.8Q171.1 158.7 176.2 165.3M165.6 151.4Q163.4 156.8 164.1 168.1M163.1 152.1Q163.5 163.1 167.9 169.2M159.2 152.6Q155.4 160.5 153.6 166.4M145.4 127.1Q141.6 125.6 135.9 120.5M148.5 125.3Q142.2 120.8 136.2 120.1M149.4 125Q144.3 119.1 143 116M153 123.9Q150.4 120.3 146.3 113.6M156.2 123.4Q154 119.9 156.7 111.1M160.1 123.5Q160.2 121.8 158.9 115.2M162.4 123.8Q166.6 121.3 167.3 113.6M165.5 124.6Q166.8 120.9 165.3 113.3M168.6 125.9Q172.5 123.1 171.6 114.4M171.6 127.8Q176.1 127.4 182.8 122.1M173.4 129.5Q176.2 125.8 179.6 121.5M174.9 131.5Q180.9 125 183.1 123.7M176.1 133.8Q182.9 130.2 186.3 130.9M176.5 135Q185.6 137.1 190.7 136.9" fill="none" stroke="#D7A35F" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="42" cy="138" rx="22" ry="17" fill="#CF9852"/><ellipse cx="158" cy="138" rx="22" ry="17" fill="#CF9852"/>
            <path d="M149.8 160.2Q156.1 162.8 167.4 168.7M149.7 161Q159.1 164 166.7 166.8M149.1 165.4Q158.1 169.8 168.5 169.9M148.2 168.5Q158.4 173.3 162.9 177.8M147.8 169.7Q155.7 174 163.6 177.1M147.8 169.9Q157.9 177.3 169.2 181M145.4 175.1Q150.6 181.7 161 187.8M144.3 177Q150.4 186.5 159.2 196.2M139.4 183.3Q142.3 194.2 149.7 201.8M129.7 191.1Q133.9 199.7 141.6 207.9M125.3 193.6Q129.5 200.3 133.3 211.1M123.4 194.4Q126.3 207 128.8 215.3M118.1 196.5Q123.7 209.6 126.5 218.9M113.1 197.8Q117.7 205.2 117.2 216M109.2 198.6Q110.5 211.7 114.9 222.2M110.1 198.4Q109 208.1 108.9 214.2M107.4 198.8Q103.7 206.5 105.8 217.8M100.6 199.3Q93.8 209.9 91.5 220.4M96.7 199.2Q91.9 206.2 90.9 218.3M97.1 199.2Q95.7 207.3 94.1 214.6M93.4 198.9Q94.6 210.5 91.6 216.1M85.5 197.5Q86.6 205.3 82.4 213.6M83.1 196.8Q79.3 204.9 75.3 213.8M80.8 196.1Q78.6 200.6 72.4 208.9M78.4 195.2Q71.3 203.2 67.8 215.3M70.6 191.4Q63.1 197.4 54.1 204.6M63.1 185.8Q53.2 193.8 44.3 197M60.4 183.1Q52.6 187.6 41.7 193.2M55.6 176.8Q49.8 184.3 38.6 189.9M54.8 175.5Q45.4 179.4 35.6 184.6M52.2 169.8Q43.8 175.2 32.3 174.9M52.9 171.6Q41.7 173.7 33.3 177M51.8 168.7Q41.4 170.6 35.9 175.4M50.3 161.7Q43.4 164.2 30.9 165.9M50.1 158.4Q37.7 158.8 30.4 157.9M50.1 156.7Q40.7 155.7 35.4 155.1M50.1 156.8Q38 160 31.2 157.8M50.5 152.6Q40.2 151.2 31.5 152.4M51.4 148.7Q43 148.4 32 150.5M51.3 149Q41 152.2 34.8 152.3M52.9 144.4Q40.2 144.6 32.8 138.9M55.6 139.2Q48.8 135.9 42.9 132.8M57.4 136.6Q52.5 135.4 42.3 131.5M57.6 136.3Q49.3 129 39.7 126.4M60.1 133.2Q48.9 131.7 43.2 129.8M60.4 132.9Q52.8 127.5 45.7 124.9M64.5 129Q58.5 127 52.1 118.9M68.7 125.9Q58 124.5 51.9 118.4M70.6 124.6Q61.9 121.1 56 115.4M72.4 123.6Q68.1 115.8 60.7 111.7M131.5 126Q136.5 121.8 138.8 115.3M132.4 126.6Q137.9 120.5 140.7 116M134.3 128Q143.4 124.7 147.4 116.1M139.8 133.1Q146.4 128.8 155.5 126.6M140 133.3Q148.4 129.5 159.9 127.4M141.9 135.6Q148 129.5 155.5 127.2M144.2 138.9Q155.5 135.9 162.8 132.1M144.7 139.8Q153.5 135.8 164.9 137.6M146.9 144Q158.8 143.1 165.1 140.5M148.4 148.1Q157.7 144.8 163.6 146.4M148.2 147.4Q156.1 149.4 168.9 149.9M149.1 150.5Q158 149.3 170 151.5M149.8 156.4Q158.7 157.9 168.9 161.4" fill="none" stroke="#3A2626" stroke-width="4.6" stroke-linecap="round"/><path d="M149.8 160.2Q156.1 162.8 167.4 168.7M149.7 161Q159.1 164 166.7 166.8M149.1 165.4Q158.1 169.8 168.5 169.9M148.2 168.5Q158.4 173.3 162.9 177.8M147.8 169.7Q155.7 174 163.6 177.1M147.8 169.9Q157.9 177.3 169.2 181M145.4 175.1Q150.6 181.7 161 187.8M144.3 177Q150.4 186.5 159.2 196.2M139.4 183.3Q142.3 194.2 149.7 201.8M129.7 191.1Q133.9 199.7 141.6 207.9M125.3 193.6Q129.5 200.3 133.3 211.1M123.4 194.4Q126.3 207 128.8 215.3M118.1 196.5Q123.7 209.6 126.5 218.9M113.1 197.8Q117.7 205.2 117.2 216M109.2 198.6Q110.5 211.7 114.9 222.2M110.1 198.4Q109 208.1 108.9 214.2M107.4 198.8Q103.7 206.5 105.8 217.8M100.6 199.3Q93.8 209.9 91.5 220.4M96.7 199.2Q91.9 206.2 90.9 218.3M97.1 199.2Q95.7 207.3 94.1 214.6M93.4 198.9Q94.6 210.5 91.6 216.1M85.5 197.5Q86.6 205.3 82.4 213.6M83.1 196.8Q79.3 204.9 75.3 213.8M80.8 196.1Q78.6 200.6 72.4 208.9M78.4 195.2Q71.3 203.2 67.8 215.3M70.6 191.4Q63.1 197.4 54.1 204.6M63.1 185.8Q53.2 193.8 44.3 197M60.4 183.1Q52.6 187.6 41.7 193.2M55.6 176.8Q49.8 184.3 38.6 189.9M54.8 175.5Q45.4 179.4 35.6 184.6M52.2 169.8Q43.8 175.2 32.3 174.9M52.9 171.6Q41.7 173.7 33.3 177M51.8 168.7Q41.4 170.6 35.9 175.4M50.3 161.7Q43.4 164.2 30.9 165.9M50.1 158.4Q37.7 158.8 30.4 157.9M50.1 156.7Q40.7 155.7 35.4 155.1M50.1 156.8Q38 160 31.2 157.8M50.5 152.6Q40.2 151.2 31.5 152.4M51.4 148.7Q43 148.4 32 150.5M51.3 149Q41 152.2 34.8 152.3M52.9 144.4Q40.2 144.6 32.8 138.9M55.6 139.2Q48.8 135.9 42.9 132.8M57.4 136.6Q52.5 135.4 42.3 131.5M57.6 136.3Q49.3 129 39.7 126.4M60.1 133.2Q48.9 131.7 43.2 129.8M60.4 132.9Q52.8 127.5 45.7 124.9M64.5 129Q58.5 127 52.1 118.9M68.7 125.9Q58 124.5 51.9 118.4M70.6 124.6Q61.9 121.1 56 115.4M72.4 123.6Q68.1 115.8 60.7 111.7M131.5 126Q136.5 121.8 138.8 115.3M132.4 126.6Q137.9 120.5 140.7 116M134.3 128Q143.4 124.7 147.4 116.1M139.8 133.1Q146.4 128.8 155.5 126.6M140 133.3Q148.4 129.5 159.9 127.4M141.9 135.6Q148 129.5 155.5 127.2M144.2 138.9Q155.5 135.9 162.8 132.1M144.7 139.8Q153.5 135.8 164.9 137.6M146.9 144Q158.8 143.1 165.1 140.5M148.4 148.1Q157.7 144.8 163.6 146.4M148.2 147.4Q156.1 149.4 168.9 149.9M149.1 150.5Q158 149.3 170 151.5M149.8 156.4Q158.7 157.9 168.9 161.4" fill="none" stroke="#D7A35F" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="100" cy="158" rx="58" ry="48" fill="#CF9852"/>
            <path d="M86.3 185.3Q97.1 189.8 102.4 189.9M86.2 188.2Q93.4 187.5 101.5 188.2M85.8 190.5Q92.6 191.3 99.4 194.8M84.9 193.4Q89.2 198.5 97.5 201.5M83.5 196.2Q88 197.7 93.5 203.3M81.2 199.2Q87.7 203.9 91.8 214.4M79.5 200.9Q84.4 203.3 90.4 211M76.9 202.9Q79.4 209.5 84 219.1M75.4 203.8Q76.4 209.9 76.6 218.8M71.1 205.6Q72.8 215.2 73.2 219.3M68.9 206.1Q68.3 215.2 64.5 222.7M65.2 206.6Q63.4 216.7 64.3 222.8M61.5 206.5Q55 210.9 54 219.6M59.4 206.2Q60.5 211.4 55.8 220.9M57.3 205.7Q52.2 208.7 50.4 217.7M53.6 204.3Q50.5 212.5 47.6 219M51 202.8Q47.3 212.3 39.6 216.1M49.1 201.4Q42 206.4 37.2 208.9M46.3 198.6Q40.6 199.5 31 204.4M44.7 196.5Q37.2 199.2 31.3 204.6M43.2 193.7Q35.2 197.6 30.2 203.6M42.7 192.3Q33.8 194.8 30.1 202.5M42 189.8Q34.5 196.5 27.5 199.9M41.6 186Q38.2 182.9 30.2 185.2M41.8 183.8Q34.2 184.3 27.9 182.1M42.3 181Q33.2 183.7 26 183.3M43.9 177Q35.5 176.5 28.1 173.5M45.1 175Q36.2 170.5 31.8 167.5M46.9 172.7Q38.3 172.2 35.5 170.7M49.6 170.2Q42.6 168 33.2 166.7M51.4 169Q51.5 161.4 45.6 159.2M54.2 167.4Q48.5 166.6 45.4 163M84.5 177.7Q87.1 172.3 95.1 172.1M85.8 181.4Q89.3 179 96.6 176.9M86.3 184.4Q92.2 186 98.2 188.6M158.3 186.8Q165.2 187.1 171.4 185.5M158.1 189.1Q165.8 196.2 169.2 197.3M157.6 191.4Q163.2 194.4 172.7 203M156.8 193.5Q161.7 196.7 168.2 196.9M155.4 196.3Q160.7 202.2 169.5 202.5M154.1 198.1Q160 206.8 162.4 212.7M151.5 200.9Q156 213.2 157.4 219.7M149.8 202.3Q156 210.1 159.8 220.9M145.3 204.8Q144.9 210.1 147.7 216.8M143.8 205.3Q142.5 215.3 142.8 223.6M140.9 206.1Q138.4 210.7 137.9 220.1M138 206.6Q140.4 216.5 139.9 226M134 206.6Q131.9 212.6 134.1 220.4M131.6 206.2Q129.2 210.9 127.9 217.7M128.4 205.4Q128 214.8 123.1 226.3M125.1 204Q120.1 210.6 116 211.7M123.7 203.3Q116.5 207.4 113.1 214.2M120.4 200.8Q112.1 208.2 107.7 217.3M117.9 198.1Q111.8 202.3 107.2 204.8M117.3 197.3Q112 200.8 102.4 202.8M115.5 194.2Q111.4 201.2 103.3 205.8M114.5 191.7Q106.2 193.8 99.2 199.2M113.8 188.6Q103.4 191.4 98.7 192.8M113.6 186.1Q108.6 185 98.3 188M113.8 183.3Q103.9 183.9 96.1 181.6M114.9 179.3Q106.7 180 103.1 174.8M115.5 177.8Q111.2 178.2 105.1 173.3M117.4 174.6Q112.8 169.8 102.3 170.1M146 167.5Q151.7 158.7 152.5 155.1M149.9 169.9Q155.8 167.4 157.1 162.3M150.7 170.4Q151.7 164.2 158.5 159.9M153 172.6Q157.8 168.9 161.4 162.8M154.6 174.6Q159.4 170.4 164.6 170.7M156.1 176.9Q163.4 173 172.4 172.7M157.9 181.6Q165.1 181.5 173.9 183.7M158.1 183Q163.5 185.4 169.9 184.1" fill="none" stroke="#3A2626" stroke-width="4.6" stroke-linecap="round"/><path d="M86.3 185.3Q97.1 189.8 102.4 189.9M86.2 188.2Q93.4 187.5 101.5 188.2M85.8 190.5Q92.6 191.3 99.4 194.8M84.9 193.4Q89.2 198.5 97.5 201.5M83.5 196.2Q88 197.7 93.5 203.3M81.2 199.2Q87.7 203.9 91.8 214.4M79.5 200.9Q84.4 203.3 90.4 211M76.9 202.9Q79.4 209.5 84 219.1M75.4 203.8Q76.4 209.9 76.6 218.8M71.1 205.6Q72.8 215.2 73.2 219.3M68.9 206.1Q68.3 215.2 64.5 222.7M65.2 206.6Q63.4 216.7 64.3 222.8M61.5 206.5Q55 210.9 54 219.6M59.4 206.2Q60.5 211.4 55.8 220.9M57.3 205.7Q52.2 208.7 50.4 217.7M53.6 204.3Q50.5 212.5 47.6 219M51 202.8Q47.3 212.3 39.6 216.1M49.1 201.4Q42 206.4 37.2 208.9M46.3 198.6Q40.6 199.5 31 204.4M44.7 196.5Q37.2 199.2 31.3 204.6M43.2 193.7Q35.2 197.6 30.2 203.6M42.7 192.3Q33.8 194.8 30.1 202.5M42 189.8Q34.5 196.5 27.5 199.9M41.6 186Q38.2 182.9 30.2 185.2M41.8 183.8Q34.2 184.3 27.9 182.1M42.3 181Q33.2 183.7 26 183.3M43.9 177Q35.5 176.5 28.1 173.5M45.1 175Q36.2 170.5 31.8 167.5M46.9 172.7Q38.3 172.2 35.5 170.7M49.6 170.2Q42.6 168 33.2 166.7M51.4 169Q51.5 161.4 45.6 159.2M54.2 167.4Q48.5 166.6 45.4 163M84.5 177.7Q87.1 172.3 95.1 172.1M85.8 181.4Q89.3 179 96.6 176.9M86.3 184.4Q92.2 186 98.2 188.6M158.3 186.8Q165.2 187.1 171.4 185.5M158.1 189.1Q165.8 196.2 169.2 197.3M157.6 191.4Q163.2 194.4 172.7 203M156.8 193.5Q161.7 196.7 168.2 196.9M155.4 196.3Q160.7 202.2 169.5 202.5M154.1 198.1Q160 206.8 162.4 212.7M151.5 200.9Q156 213.2 157.4 219.7M149.8 202.3Q156 210.1 159.8 220.9M145.3 204.8Q144.9 210.1 147.7 216.8M143.8 205.3Q142.5 215.3 142.8 223.6M140.9 206.1Q138.4 210.7 137.9 220.1M138 206.6Q140.4 216.5 139.9 226M134 206.6Q131.9 212.6 134.1 220.4M131.6 206.2Q129.2 210.9 127.9 217.7M128.4 205.4Q128 214.8 123.1 226.3M125.1 204Q120.1 210.6 116 211.7M123.7 203.3Q116.5 207.4 113.1 214.2M120.4 200.8Q112.1 208.2 107.7 217.3M117.9 198.1Q111.8 202.3 107.2 204.8M117.3 197.3Q112 200.8 102.4 202.8M115.5 194.2Q111.4 201.2 103.3 205.8M114.5 191.7Q106.2 193.8 99.2 199.2M113.8 188.6Q103.4 191.4 98.7 192.8M113.6 186.1Q108.6 185 98.3 188M113.8 183.3Q103.9 183.9 96.1 181.6M114.9 179.3Q106.7 180 103.1 174.8M115.5 177.8Q111.2 178.2 105.1 173.3M117.4 174.6Q112.8 169.8 102.3 170.1M146 167.5Q151.7 158.7 152.5 155.1M149.9 169.9Q155.8 167.4 157.1 162.3M150.7 170.4Q151.7 164.2 158.5 159.9M153 172.6Q157.8 168.9 161.4 162.8M154.6 174.6Q159.4 170.4 164.6 170.7M156.1 176.9Q163.4 173 172.4 172.7M157.9 181.6Q165.1 181.5 173.9 183.7M158.1 183Q163.5 185.4 169.9 184.1" fill="none" stroke="#D7A35F" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="64" cy="186" rx="26" ry="24" fill="#CF9852"/><ellipse cx="136" cy="186" rx="26" ry="24" fill="#CF9852"/>
            <path d="M148.1 82.5Q159.2 86.2 169.9 87.3M148 83.5Q162 86.8 172.1 88.2M147.6 86.6Q160.5 95.5 168.6 99M147.4 87.7Q158.9 92.1 166.7 97.4M147.2 88.9Q158.1 92.2 163.1 97M147 89.8Q154.4 95.7 164.3 95.9M146.5 91.6Q156.6 95.2 164.9 95.5M145.6 94.4Q153.8 100.6 161 102M145 95.9Q151.4 97.3 161.2 101.9M142.3 101.3Q150.2 105.7 161.8 112.6M142.6 100.8Q153.2 109.2 163.1 113.9M140.5 104.3Q148.6 111.2 151.8 120M138.8 106.5Q146.3 113.8 157.1 126.5M135.7 110Q144.2 119.8 152.3 129.4M136.6 109Q142.4 117.8 151.4 132.4M134.2 111.5Q140 121.5 143.2 130.3M133.7 112Q138.3 121.3 145.7 126.3M130.2 114.8Q131.2 126.4 135 137.6M129.9 115Q140.5 126 147.1 132.9M124.6 118.4Q130.2 123.9 133.3 134.3M124.2 118.7Q125.8 131.5 126.3 140.1M122.9 119.4Q129.9 129.1 131.9 143.7M117.9 121.5Q120 129 121.8 140.6M115.5 122.4Q115.7 131.2 120.9 142.3M115.1 122.5Q119 132.4 120.7 147.1M113.1 123Q113.5 134.5 110.1 144.1M112.8 123.1Q111.2 134 112.8 144.2M107.8 124.1Q108 130.4 104.6 140.1M104.4 124.5Q104.8 133.6 104.7 145M103.5 124.6Q100.3 133.3 100.1 145.6M98.7 124.7Q95.3 135.2 91.2 142.9M98.5 124.7Q97.1 135.5 100.1 151.2M93.9 124.4Q92.5 139 92.2 149.5M91.9 124.1Q88.6 130.9 89.4 142.2M90.5 123.8Q86 131.4 82.4 138.8M86.7 123Q79.4 132.3 73.4 143.6M85.6 122.7Q83.9 133.7 79.8 139M81.2 121.2Q72.1 130.4 68.7 141.7M81.2 121.2Q77.4 133.1 74.9 144.8M76.7 119.1Q67 131 61.4 139.7M73.9 117.6Q68 125.3 62 137.4M72.7 116.9Q65.6 129.7 55.9 138.6M73.1 117.1Q62.5 124.6 55.6 137.2M70.9 115.6Q61.7 126 54.7 131.3M68.4 113.7Q65.6 121.1 57.1 132.8M64.3 110.1Q56.2 115.8 47.3 124.4M62.7 108.3Q52 112.2 40 120.6M61.4 106.8Q51.5 111.2 44.6 114.8M59.9 104.8Q49.7 107.1 44.5 115.1M60.6 105.8Q50 109.1 37.4 114.7M57.8 101.6Q48.5 110.5 38.1 115.8M58.4 102.6Q48.5 107 42.8 112.8M55.8 97.8Q46.2 102.3 39.5 105.9M55.4 96.9Q47.8 102.5 38.1 112.5M53.4 91.5Q42.6 96.3 32.8 99.7M53.2 90.6Q41.9 95.7 30.8 95M52.5 87.5Q40.6 92.2 29.5 96.1M52.1 84.8Q41.5 89.6 31.6 89.5M52.2 85.6Q46.5 88 36 87.6M51.9 81.8Q41.3 82.9 29.7 89.1M51.9 82Q41.3 81.2 32 85.7M52 76.6Q40.7 78.6 31.7 81.8M52 76.7Q47 76.6 36.5 74.5M52.8 71.1Q42 70.7 34.5 67.4M53 70.4Q43.1 71.2 29.6 76.6M53.5 68.2Q40.3 70.6 30.1 75.3M53.9 67.1Q48.5 64 39.4 62.2M54.7 64.7Q41.7 68.8 34.4 68M55.6 62.8Q50.2 58.6 39.1 54.7M56.3 61.1Q51.3 55.4 41.5 53.4M59.3 56.1Q48.9 55.6 42.4 50.6M61.2 53.5Q52.2 52 46.9 45.9M59.6 55.7Q51.6 54.5 45.9 48.5M64 50.3Q55.1 51 43.9 46.3M64 50.3Q55.7 49 49.8 45.2M64.7 49.6Q58.3 48.5 49.8 44M67.2 47.2Q61.5 38.7 54.6 33.5M68.8 45.9Q59.5 39.9 52.9 32.3M69.8 45.2Q60.8 39.6 51.4 33.7M71.6 43.9Q62 41.1 55.4 34.7M73.9 42.4Q67.6 34.8 64.3 29.8M78.4 40Q78.2 30.6 72.1 26.7M80.2 39.2Q76.1 32.4 66.8 25.7M81 38.9Q75.6 32.4 71.8 24M86.7 37Q84.6 30.7 78.3 22.2M87.6 36.8Q82.2 27.7 73.4 22.7M90.6 36.1Q89 31.1 84.2 22.7M94.1 35.6Q90.1 29 89.4 21.5M95 35.5Q94.8 29.4 92 22.3M99.6 35.3Q94 28.9 94.1 22.5M99.6 35.3Q98.5 25.3 93.9 20.5M104.9 35.5Q106.3 25.4 104.3 18.5M103 35.4Q98.9 29.5 97 22.2M107.7 35.9Q105.8 30.3 109 20.9M108.1 35.9Q107.9 30.9 105.3 21.9M114.1 37.2Q114.3 28.8 116.1 23.9M117.4 38.3Q121 34.7 121.3 25.3M115.3 37.6Q115.8 28.4 121.8 22.3M121.6 40Q122.8 32.9 126.4 26.7M119.7 39.2Q125.5 35.1 128.1 28.2M122.7 40.6Q124.6 33.5 129.7 27M128.3 43.8Q134.9 37.5 135.8 29.8M126.1 42.4Q128.4 34.8 136.1 29.1M131.2 45.9Q140.5 38.4 145.2 31.3M131.8 46.4Q139.2 36.8 143.2 30.5M133.4 47.8Q137 40.7 144.6 37.2M134.7 49Q139.8 45.4 145.5 35.9M138.1 52.6Q144 42.7 151.3 38M139.6 54.6Q143.1 47.3 152.4 43.9M139.6 54.6Q149.6 50.7 157 49.7M141.3 57Q148.4 56.8 157.2 53.4M143.5 60.8Q150.1 53.6 158.9 47.8M143 59.8Q153.9 54.8 161.5 49.5M144 61.8Q148.9 55.6 159.3 53.5M146 66.7Q152.8 64.7 160.5 62.1M145.9 66.6Q156.9 64.1 165.1 59.6M146.6 68.9Q156 66.1 162.7 64.5M147.5 72.4Q157.1 69.1 169.1 67.7M147.7 73.8Q155.7 72.2 162.1 69.8M148.2 79.3Q161.3 82 172.4 79.7" fill="none" stroke="#3A2626" stroke-width="4.6" stroke-linecap="round"/><path d="M148.1 82.5Q159.2 86.2 169.9 87.3M148 83.5Q162 86.8 172.1 88.2M147.6 86.6Q160.5 95.5 168.6 99M147.4 87.7Q158.9 92.1 166.7 97.4M147.2 88.9Q158.1 92.2 163.1 97M147 89.8Q154.4 95.7 164.3 95.9M146.5 91.6Q156.6 95.2 164.9 95.5M145.6 94.4Q153.8 100.6 161 102M145 95.9Q151.4 97.3 161.2 101.9M142.3 101.3Q150.2 105.7 161.8 112.6M142.6 100.8Q153.2 109.2 163.1 113.9M140.5 104.3Q148.6 111.2 151.8 120M138.8 106.5Q146.3 113.8 157.1 126.5M135.7 110Q144.2 119.8 152.3 129.4M136.6 109Q142.4 117.8 151.4 132.4M134.2 111.5Q140 121.5 143.2 130.3M133.7 112Q138.3 121.3 145.7 126.3M130.2 114.8Q131.2 126.4 135 137.6M129.9 115Q140.5 126 147.1 132.9M124.6 118.4Q130.2 123.9 133.3 134.3M124.2 118.7Q125.8 131.5 126.3 140.1M122.9 119.4Q129.9 129.1 131.9 143.7M117.9 121.5Q120 129 121.8 140.6M115.5 122.4Q115.7 131.2 120.9 142.3M115.1 122.5Q119 132.4 120.7 147.1M113.1 123Q113.5 134.5 110.1 144.1M112.8 123.1Q111.2 134 112.8 144.2M107.8 124.1Q108 130.4 104.6 140.1M104.4 124.5Q104.8 133.6 104.7 145M103.5 124.6Q100.3 133.3 100.1 145.6M98.7 124.7Q95.3 135.2 91.2 142.9M98.5 124.7Q97.1 135.5 100.1 151.2M93.9 124.4Q92.5 139 92.2 149.5M91.9 124.1Q88.6 130.9 89.4 142.2M90.5 123.8Q86 131.4 82.4 138.8M86.7 123Q79.4 132.3 73.4 143.6M85.6 122.7Q83.9 133.7 79.8 139M81.2 121.2Q72.1 130.4 68.7 141.7M81.2 121.2Q77.4 133.1 74.9 144.8M76.7 119.1Q67 131 61.4 139.7M73.9 117.6Q68 125.3 62 137.4M72.7 116.9Q65.6 129.7 55.9 138.6M73.1 117.1Q62.5 124.6 55.6 137.2M70.9 115.6Q61.7 126 54.7 131.3M68.4 113.7Q65.6 121.1 57.1 132.8M64.3 110.1Q56.2 115.8 47.3 124.4M62.7 108.3Q52 112.2 40 120.6M61.4 106.8Q51.5 111.2 44.6 114.8M59.9 104.8Q49.7 107.1 44.5 115.1M60.6 105.8Q50 109.1 37.4 114.7M57.8 101.6Q48.5 110.5 38.1 115.8M58.4 102.6Q48.5 107 42.8 112.8M55.8 97.8Q46.2 102.3 39.5 105.9M55.4 96.9Q47.8 102.5 38.1 112.5M53.4 91.5Q42.6 96.3 32.8 99.7M53.2 90.6Q41.9 95.7 30.8 95M52.5 87.5Q40.6 92.2 29.5 96.1M52.1 84.8Q41.5 89.6 31.6 89.5M52.2 85.6Q46.5 88 36 87.6M51.9 81.8Q41.3 82.9 29.7 89.1M51.9 82Q41.3 81.2 32 85.7M52 76.6Q40.7 78.6 31.7 81.8M52 76.7Q47 76.6 36.5 74.5M52.8 71.1Q42 70.7 34.5 67.4M53 70.4Q43.1 71.2 29.6 76.6M53.5 68.2Q40.3 70.6 30.1 75.3M53.9 67.1Q48.5 64 39.4 62.2M54.7 64.7Q41.7 68.8 34.4 68M55.6 62.8Q50.2 58.6 39.1 54.7M56.3 61.1Q51.3 55.4 41.5 53.4M59.3 56.1Q48.9 55.6 42.4 50.6M61.2 53.5Q52.2 52 46.9 45.9M59.6 55.7Q51.6 54.5 45.9 48.5M64 50.3Q55.1 51 43.9 46.3M64 50.3Q55.7 49 49.8 45.2M64.7 49.6Q58.3 48.5 49.8 44M67.2 47.2Q61.5 38.7 54.6 33.5M68.8 45.9Q59.5 39.9 52.9 32.3M69.8 45.2Q60.8 39.6 51.4 33.7M71.6 43.9Q62 41.1 55.4 34.7M73.9 42.4Q67.6 34.8 64.3 29.8M78.4 40Q78.2 30.6 72.1 26.7M80.2 39.2Q76.1 32.4 66.8 25.7M81 38.9Q75.6 32.4 71.8 24M86.7 37Q84.6 30.7 78.3 22.2M87.6 36.8Q82.2 27.7 73.4 22.7M90.6 36.1Q89 31.1 84.2 22.7M94.1 35.6Q90.1 29 89.4 21.5M95 35.5Q94.8 29.4 92 22.3M99.6 35.3Q94 28.9 94.1 22.5M99.6 35.3Q98.5 25.3 93.9 20.5M104.9 35.5Q106.3 25.4 104.3 18.5M103 35.4Q98.9 29.5 97 22.2M107.7 35.9Q105.8 30.3 109 20.9M108.1 35.9Q107.9 30.9 105.3 21.9M114.1 37.2Q114.3 28.8 116.1 23.9M117.4 38.3Q121 34.7 121.3 25.3M115.3 37.6Q115.8 28.4 121.8 22.3M121.6 40Q122.8 32.9 126.4 26.7M119.7 39.2Q125.5 35.1 128.1 28.2M122.7 40.6Q124.6 33.5 129.7 27M128.3 43.8Q134.9 37.5 135.8 29.8M126.1 42.4Q128.4 34.8 136.1 29.1M131.2 45.9Q140.5 38.4 145.2 31.3M131.8 46.4Q139.2 36.8 143.2 30.5M133.4 47.8Q137 40.7 144.6 37.2M134.7 49Q139.8 45.4 145.5 35.9M138.1 52.6Q144 42.7 151.3 38M139.6 54.6Q143.1 47.3 152.4 43.9M139.6 54.6Q149.6 50.7 157 49.7M141.3 57Q148.4 56.8 157.2 53.4M143.5 60.8Q150.1 53.6 158.9 47.8M143 59.8Q153.9 54.8 161.5 49.5M144 61.8Q148.9 55.6 159.3 53.5M146 66.7Q152.8 64.7 160.5 62.1M145.9 66.6Q156.9 64.1 165.1 59.6M146.6 68.9Q156 66.1 162.7 64.5M147.5 72.4Q157.1 69.1 169.1 67.7M147.7 73.8Q155.7 72.2 162.1 69.8M148.2 79.3Q161.3 82 172.4 79.7" fill="none" stroke="#D7A35F" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="100" cy="80" rx="56" ry="52" fill="#CF9852"/>
            <path d="M70.3 88.2Q66.9 95.1 65.6 98.4M91.1 63.5Q97.1 63.2 102.2 62.4M136.8 95.6Q136.9 101 141.3 106.7M125.9 108.7Q127.3 112.7 133.5 113.1M68.4 75Q72.2 69.2 72.6 67.3M80.8 78.9Q86.2 74.5 87.2 69.5M50.9 82.9Q46 83.2 43.9 87.6M72.2 56.1Q78 54.1 80.2 53.1M126.5 71.5Q133.1 73.4 135.4 79.4M106.7 123.9Q109.2 129.2 111.2 131.1M138.3 65.3Q144.5 66.7 145.9 69.8M78.3 116.1Q80.8 121 82.5 125.4M129.7 88.6Q131.4 93.6 131.2 100M74.5 57.6Q78.1 51.8 78 49.3M107.4 64.3Q110.6 63.8 117.8 58.9M99.9 48.5Q104.1 46.5 108.4 48.6M137.3 70.4Q138.9 72.6 145.2 72.1M73.1 82.4Q68.9 86 67.8 92.3M87.4 42.1Q91.9 43.3 98 41.6M142.8 103.6Q141.9 106 142.2 112.2M147.5 80.4Q151.8 79.7 155.5 81.1M68.6 111.1Q66.2 113.9 64.1 119.9M76.3 45.8Q80.3 42.9 83.4 43.5M114.8 76.1Q119.1 76 123.6 74.4M76.5 115.5Q73.6 117.8 73.7 123M112.4 122.7Q107.7 127.9 107.5 131.3M115.6 79.2Q116.9 79.1 123 82.4M81.3 57Q82.5 56 88.2 51.4M129.4 85.7Q134.7 89.3 136 95.3M92.4 39.1Q99.6 34.2 102.9 33.8M57.4 59.6Q58.2 53.6 58.9 48.5M142.5 75.3Q150.2 78.7 153.2 79.3M129.8 55Q132.7 58.9 136.6 57.8M62.7 93Q56.8 95.6 52.9 95M60.6 60.4Q64.8 56.6 71.4 56M97.1 60.6Q102.2 58.6 106.6 55.4M69.4 65.9Q67.8 61.8 70.8 55.7M76.4 86.4Q73 88.8 72.1 93.3M133.2 92.5Q138.2 95.9 139.5 96M60.6 68.5Q63.1 68.2 64.9 63.4M118.2 130.6Q121.6 129.7 126.6 124.2M107.3 146.8Q111.6 147.1 113.7 150.7M114.8 146.8Q116.4 149.2 122.3 151.7M100 183.5Q98 188.3 99.2 190.9M55.1 137.5Q53.8 134.9 55.6 130.9M86.5 178Q87.7 180.7 84.9 188.1M127.9 193.1Q133 199 133.5 200.9M114.9 136.9Q118.1 135.5 124.3 134.7M125.1 132.3Q132 135.1 135.3 133.6M126.8 164.9Q127.4 168.1 132.5 175.2M144.5 163.2Q149.2 169.7 152.1 171.4M112.4 175.5Q109.2 180.2 108.1 185.3M120.6 124.5Q124.8 123.6 127.9 120M66.8 152.8Q70.7 149.3 70.2 147.5M79.2 179.5Q72 181.9 69.5 184.3M122.8 179.8Q122.5 181.1 126.3 185.6M89.2 172.2Q87.7 177.1 87.6 180.6M85.9 121.2Q90 114.8 90.3 112.4M116.1 187Q116.2 187.9 120 193M129.9 172Q134.3 174.3 137 180M92.9 154.7Q96.7 150.8 97.8 148.7M138.9 146.5Q146.7 144.4 149.8 145.5M125.5 184.5Q127.7 187.6 130.2 191.9M36.2 131.6Q39 126.3 38.5 122.3M32.9 135.2Q38.9 131.4 41.8 131.8M41.6 133.8Q42.9 130.7 46.3 129.6M49.7 136.7Q53.7 140.9 57.6 141.9M32 143.9Q31.6 147.7 32 151.9M51.5 137.1Q54.6 140.3 57.6 145.8M171.3 136.7Q176.5 137.4 180 137.6M165.4 141.6Q168 149.8 167.5 153.2M153.4 130.3Q155.5 128.7 159.6 128.2M151.4 130.7Q157.5 129.8 161.7 128M149.3 141.6Q149.3 148.7 145.3 150.8M167.7 144.9Q172.1 147.9 175.7 151.9M74.5 173.2Q80.7 174 84.7 177.4M74.1 172.7Q77.1 171.2 82.3 169.2M45.6 189.3Q42.9 193.3 44.4 198M60.1 168.6Q66.7 169.2 69.7 169.3M69.7 173.6Q72.1 171.5 77.9 166.8M138.7 173.3Q143.7 172.5 144.8 167.2M149.9 175.8Q155.4 177.1 158.5 176.2M118.5 179.1Q119 174.2 123.4 169M141.3 175Q147.1 177.1 150 176.3M136.5 170.5Q137.4 164.2 142.2 162.4" fill="none" stroke="#B9803F" stroke-width="1.6" stroke-linecap="round"/><path d="M89.8 75.5Q92.2 71.6 96.1 65.7M119.3 53.5Q124.6 51.9 126 52.9M96.5 65.6Q100.8 64.2 103.4 61.8M62.7 95.5Q57.4 100.3 54.5 102M101.4 58.6Q104.6 57 108.7 59.8M116 116.2Q117.4 117.3 123.1 120.9M97.4 65.3Q98.9 64.8 104.9 60.9M85.3 59.3Q88.6 57 93.6 54.7M105.8 124.4Q107.6 128.7 105 130.5M57.2 61.3Q57.9 61 62.4 57.5M62.6 88.9Q59.7 92 60.1 96.6M145.9 75.4Q150.3 75.3 152.2 79.2M131.8 50.7Q136.8 47.5 140.6 48M104.2 54.4Q105.5 52.3 110.6 50.5M70.1 75.1Q73.4 70 72.3 64.9M102.4 36Q106 34.5 109.3 34.3M136.9 99.6Q141 105 142.4 107.3M72.4 77.8Q74 75.8 78.2 72.3M71.4 50.7Q74.4 45.2 78.7 41.2M59.9 102.3Q54.6 104 52.9 103.9M129.4 82.8Q128.5 83.9 130.5 89.2M129.4 69.7Q131.1 69.8 136.1 67.7M143 88.4Q146.6 90.2 150.6 93.7M101.6 67.4Q102.7 63.9 106.2 59.7M100.4 72.3Q106.1 71.1 111.9 70.1M135.2 59.5Q138.6 59 146.7 58.4M113.8 41Q118.7 43.2 119.9 42.6M79.4 56.4Q81.9 53.9 82.6 47M90.4 70.3Q94.3 64.3 93.6 62M74.5 102.8Q72.8 106.1 68.5 108M52.2 68.7Q55.7 67.4 54.8 62.6M94.7 60.8Q97.8 61 102.9 58.5M69.3 108.1Q65.4 114.2 63 118.2M131.4 61.8Q134.9 65.8 140.6 69.1M136.8 67.5Q141 65.4 144.9 68.1M67.7 101.2Q66.4 102.2 61.3 106.1M63.2 64.9Q67.9 64.5 68.8 60.3M63.8 56.4Q66.9 53.1 71.9 50.3M121.5 80Q125.2 81.9 128.9 84M101.7 60.2Q108.4 59.5 110.3 63M105.1 142.3Q107.5 140.9 114.8 142.3M79.3 134.9Q83.4 134.7 86.2 133.3M69.5 137.8Q76.7 136.9 79.1 134.3M80.3 124.2Q83.8 121.6 90.5 118.9M143.7 146.6Q148.5 146.5 149.9 145.4M145 166.4Q151.1 167.1 152.8 171.4M63.5 147.8Q66.2 147.5 72.7 142.4M58.7 148.8Q61.8 143.7 62.2 143M106.6 142.6Q106 139.4 110.5 138M121.5 124.6Q125.3 127.9 132 130.1M112 189.1Q114.4 193.3 115 195.1M72.6 167.7Q67.2 169.2 66.4 174.4M97.7 144.3Q100.1 143.4 103.5 146.7M144.8 156.4Q150.1 157.7 151.6 156.5M112 155.2Q116.2 156.9 123.3 157.1M78.8 126.2Q83.1 124.3 89 123.3M56.9 177.5Q54.7 181.2 49.7 183.9M86.8 171.7Q84.5 177.1 86.3 179.6M65.4 137.9Q68.4 132.2 69.1 131.2M142.7 165.1Q146 166.1 153.4 166.5M133.5 189.2Q134.4 188.9 139.8 192.1M120.4 120.2Q123.5 118.6 126.3 116.2M147.6 155.5Q150.3 156.2 155.7 155.5M51.2 150.9Q53.8 147.5 61.1 146M33.3 136Q36.1 135.3 41.8 130.5M37.6 140.2Q37.5 142.3 35.6 146M41.7 132.7Q47.7 134.6 50.7 133.2M27.2 140.1Q25.7 146.4 24.3 150.2M40.2 142.9Q41.2 145.7 37.2 150.4M49.7 143.6Q51.5 145.4 51.8 151.6M162.8 145.9Q162.6 147.8 164 153.9M172.5 142.2Q174.3 148.4 172.5 151.8M148.8 137.6Q150.4 131.9 151.6 130.5M158.5 130.1Q160 132.9 165.8 134M172 137.9Q175.7 137.1 177.3 141M162.9 142.1Q160.8 144.6 161.4 149.8M50.7 180.9Q53.5 179.4 55.8 177.6M77.7 184.7Q78.2 190.3 79.4 192.3M59.2 169Q60 165.2 64.7 165.7M68.3 174.3Q70.2 172.6 76.1 175.4M139.6 173.9Q146.3 173 150.8 174.8M141.8 176.2Q145.5 177.1 152 175.7M118.7 186.5Q118.3 187.6 114.2 191.9M135.4 175.8Q137.3 172.5 140 170M120.4 185.6Q123.6 180.9 126 180.4" fill="none" stroke="#EDC489" stroke-width="1.5" stroke-linecap="round"/><path d="M127.2 90.5Q129.1 91.7 131.8 95M53.9 65.8Q56.2 60.1 56.9 55.9M67.5 66.5Q68.6 60.2 67.3 58.1M77.8 80.8Q74.4 83.2 74.8 89.7M126.3 102.1Q127.9 102.4 134.3 106.5M100.1 122Q102 124.6 101.4 129.7M85.7 60.7Q89.7 58.2 91.2 55.8M137.1 62.1Q144 63.2 148 62.9M131.5 73.8Q133.8 76.8 136.6 80.4M92.4 67.3Q97.8 66.2 103.2 63.2M122.1 52.3Q127.5 49.6 132.1 49.3M81.3 43.8Q88.1 42.4 91.8 45M76.6 117.2Q72.9 117.7 71.7 123M126.2 83.6Q130.8 87.1 132.7 93.1M107.3 40.5Q112.5 40.4 113.9 44.7M59.1 59.2Q63 56.8 62.4 49.6M73.4 88.9Q71.4 91.5 67.7 94.5M77.8 62.3Q83.6 60.1 86.6 57.5M86.5 57.9Q91 57 95.7 52.9M78.4 47Q80 43 81.1 38.3M138.8 76.4Q147 74.4 150.4 77.3M113.3 66.4Q117.2 66.2 123 67.5M54.9 99.5Q52.8 105.8 50.8 107.9M93.6 36.8Q98.9 38.6 101 37.4M120.7 110.9Q122.3 114.7 120.9 121.8M141.6 60.3Q147.9 62 151.7 58.9M133.1 51.8Q138.9 54.2 142.7 56.4M127.4 54Q130.6 51.7 136.4 51.1M103.1 47.7Q104.5 48.5 109.4 48.8M58.3 72.3Q60.5 68.5 63.7 63.3M88.7 120.3Q90.9 125.2 91 130.7M127 58.8Q132.6 62.9 136.7 65.3M123.8 107.2Q122.7 113 124.1 116.7M91 43.1Q95.4 44.3 99.4 40.6M132.9 104.9Q137.5 105.2 140.1 110.2M68.9 92.4Q67.2 98 67.1 104.1M111.2 117.7Q111.3 120.8 116.3 121.9M138.8 76.8Q143.9 80.3 145.3 81.2M127.4 75.3Q133.6 79.4 136.1 78.6M63.4 76.3Q66.3 73.3 71.9 71M115.9 135.2Q121.6 135.7 124.7 140.6M69.8 136.8Q72.6 134.1 79.6 134.6M86.6 161Q88.7 163.4 86 167.1M96.3 191Q96.2 197.2 93.6 201.1M104.1 146Q107.8 142.5 111.5 140.2M75 138.1Q80.8 137.9 84.6 133.4M108.9 195.4Q106.3 202.1 102.2 204.2M72.5 145.1Q77 141.3 78 140.6M90.8 140.5Q94.9 137.6 96.5 135M137.6 175.6Q140.2 178.3 144 184.8M75.3 184.3Q70.1 187.7 69.9 191.3M100.7 187.2Q101.6 192.3 102.8 198.5M93.6 138.3Q96.4 132.2 102.1 130.9M117.6 155.1Q118.2 157.8 121.8 165M58.2 162.4Q51.4 162.6 47 162.1M137.9 157.6Q139.9 159.1 143.2 163.8M82.9 143.8Q89 144 93.3 140.7M71.5 182.9Q70.4 188.4 70.7 194.1M133.9 167.9Q138.7 167.1 142.6 168.1M103.5 149.7Q109.6 149.8 113.8 149.2M131.2 166.7Q133.4 168.9 135.3 174.1M129.7 188.5Q127 190.4 128 195.6M94.8 175.8Q93.2 177.5 90.9 182.7M33.3 136.4Q35.6 130.8 35 127.7M35 128.7Q35.1 125.9 36 122.5M39.5 138.9Q41 142.5 39.7 145.5M53.1 142Q54 146.6 59.4 151.5M39.1 141.3Q35.9 145.4 28.6 146.2M43.1 143.5Q43.3 150.4 46.9 152.6M153.5 129.3Q154.9 127.1 157.2 123M163 142.7Q161.9 145 162.2 152.3M154.6 148.3Q153.5 154.3 155.4 160.1M142.9 140.3Q136.9 145 134.6 145.1M167.6 138.9Q170.7 140.3 178.2 137.7M159.1 130.4Q163.2 128.7 168.7 124.3M56.5 171.8Q61 166.6 63.9 165.4M45.5 185.6Q44.1 182 40.8 175.4M82.4 184Q86.7 185.7 88 186.8M81.7 190.1Q82.1 192.7 87 198.3M52.2 179.4Q59.2 180.4 62.8 176.6M124.5 171.7Q125.7 167.1 126.8 165.7M150.7 182.9Q154.4 186.9 156.7 190.4M151.2 190.8Q156.8 192.6 161.3 196.7M154.4 190.4Q153.9 194.7 155.9 200.3" fill="none" stroke="#A06C33" stroke-width="1.2" stroke-linecap="round"/>
            <ellipse cx="100" cy="97" rx="22" ry="17" fill="#E3D5C2" stroke="#3A2626" stroke-width="2"/>
            <path d="M93 89 q7 -5 14 0 q-1 6 -7 9 q-6 -3 -7 -9z" fill="#2A1A14"/><path d="M100 97 v6 M88 102 q12 9 24 0" fill="none" stroke="#2A1A14" stroke-width="2.2" stroke-linecap="round"/>
            <circle cx="83" cy="74" r="4.3" fill="#141010"/><circle cx="117" cy="74" r="4.3" fill="#141010"/><circle cx="84.3" cy="72.6" r="1.2" fill="#fff"/><circle cx="118.3" cy="72.6" r="1.2" fill="#fff"/>
            <path d="M92 118 q8 6 16 0 l2 10 q-10 8 -20 0z" fill="#5A3A2A" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/><path d="M96 121 q4 3 8 0" fill="none" stroke="#7A5240" stroke-width="1.4"/>
            <ellipse cx="64" cy="194" rx="15" ry="18" transform="rotate(14 64 194)" fill="#DCCDB8" stroke="#3A2626" stroke-width="2.6"/>
            <ellipse cx="136" cy="194" rx="15" ry="18" transform="rotate(-14 136 194)" fill="#DCCDB8" stroke="#3A2626" stroke-width="2.6"/></svg>`,
        open: 'bear'
    },
    {
        id: 'todo', name: 'an overdue to-do list', zip: 'shades', l: 0, t: 0, w: 6.6, r: 8,
        art: `<svg viewBox="0 0 100 100"><path d="M22 30 L40 14 L62 18 L80 28 L86 50 L78 72 L58 86 L34 84 L16 66 L12 46Z" fill="#FFFDF6" ${S} stroke-width="2.2"/>
    <g stroke="#C9D6EE" stroke-width="1.2" fill="none"><path d="M18 44 L46 40 L84 48"/><path d="M16 58 L50 56 L80 64"/><path d="M28 74 L54 70 L72 78"/></g><path d="M30 20 L32 84" stroke="#F0A7B6" stroke-width="1.2"/>
    <g stroke="#B9B0A2" stroke-width="1.2" fill="none" stroke-linejoin="round"><path d="M40 14 L46 40 L22 30"/><path d="M62 18 L46 40 L80 28"/><path d="M86 50 L58 52 L46 40"/><path d="M58 52 L78 72"/><path d="M58 52 L58 86"/><path d="M58 52 L34 64 L16 66"/><path d="M34 64 L34 84"/><path d="M34 64 L12 46"/></g>
    <g fill="#E8E2D6" opacity=".6"><path d="M46 40 L62 18 L80 28Z"/><path d="M58 52 L78 72 L58 86Z"/><path d="M34 64 L16 66 L12 46Z"/></g>
    <path d="M52 30 q4 -2 8 0 M40 52 q5 -2 9 0" stroke="#2C3E7A" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M66 60 q3 2 6 0" stroke="#C0392B" stroke-width="1.6" fill="none"/></svg>`,
        flat: `<svg viewBox="0 0 110 120"><path d="M8 8 L60 4 L104 10 L100 60 L106 112 L52 116 L6 110 L12 62Z" fill="#FFFDF6" ${S} stroke-width="2"/>
    <g stroke="#C9D6EE" stroke-width="1">${[24,34,44,54,64,74,84,94,104].map(y => `<path d="M12 ${y} L100 ${y - 2}"/>`).join('')}</g><path d="M24 8 L22 114" stroke="#F0A7B6" stroke-width="1.2"/>
    <path d="M30 20 L70 30 M60 4 L52 40 M80 60 L104 62 M20 70 L44 96" stroke="#E8E2D6" stroke-width="1.2"/>
    <g fill="none" stroke="#2C3E7A" stroke-width="1.4" stroke-linecap="round"><path d="M30 31 q6 -3 12 0 t12 0 t12 0"/><path d="M30 41 q8 -3 16 0 t16 0"/><path d="M30 51 q6 -3 12 0 t12 0 t12 0 t10 0"/><path d="M30 61 q8 -3 16 0"/><path d="M30 71 q6 -3 12 0 t12 0 t12 0"/></g>
    <path d="M28 30 h44" stroke="#2C3E7A" stroke-width="1.2"/>
    <g transform="translate(70 92) rotate(-12)"><rect x="-26" y="-9" width="52" height="18" rx="3" fill="none" stroke="#C0392B" stroke-width="2"/><text x="0" y="4.4" text-anchor="middle" font-family="Instrument Sans" font-weight="800" font-size="10" letter-spacing="1.4" fill="#C0392B">OVERDUE</text></g></svg>`,
        open: 'todo'
    },
    {
        id: 'ticket', name: 'a speeding ticket', zip: 'shades', l: 0, t: 0, w: 10.3, r: -5,
        art: `<svg viewBox="0 0 120 92"><path d="M6 10 L112 4 L116 84 L10 90Z" fill="#FBF8EE" ${S} stroke-width="2"/><path d="M8 46 L114 42" stroke="#D9D2C2" stroke-width="1.4" stroke-dasharray="3 2"/>
    <rect x="12" y="12" width="96" height="12" fill="#3A5A9A" transform="rotate(-3 60 18)"/><text x="60" y="21.5" text-anchor="middle" font-family="Instrument Sans" font-weight="800" font-size="7" fill="#fff" letter-spacing="1.4" transform="rotate(-3 60 18)">CITATION · SPEEDING</text>
    <g font-family="Instrument Sans" font-size="4.6" fill="#3A2626" transform="rotate(-3 60 50)"><text x="14" y="34">NAME: SUHANI TIWARI</text><text x="14" y="40">SPEED: a little too excited</text><text x="14" y="56">OFFICER NOTES: “she was very polite.”</text><text x="14" y="63">STATUS: tucked in the front pocket</text></g>
    <path d="M70 70 q10 -6 20 0 q-6 6 -14 4" fill="none" stroke="#3A2626" stroke-width="1.2"/><path d="M24 78 l60 -3" stroke="#B9B2A6" stroke-width="1"/></svg>`,
        open: 'ticket'
    },
    {
        id: 'giftcards', name: 'some gift cards', zip: 'shades', l: 0, t: 0, w: 10.3, r: 3,
        art: `<svg viewBox="0 0 130 100"><defs><pattern id="gc-st" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="8" fill="#0B0B0C"/><rect x="4" width="4" height="8" fill="#FAFAFA"/></pattern></defs>
    <g transform="rotate(-10 40 50)"><rect x="6" y="24" width="76" height="48" rx="5" fill="#E8E0D3" stroke="#3A2626" stroke-width="1.6"/><text x="44" y="52" text-anchor="middle" font-family="Georgia, serif" font-size="9" letter-spacing="2.6" fill="#2A2426">ARITZIA</text></g>
    <g transform="rotate(4 70 50)"><rect x="30" y="18" width="76" height="48" rx="5" fill="#0D0D0F" stroke="#3A2626" stroke-width="1.6"/><text x="68" y="44" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="700" font-size="9" letter-spacing="3" fill="#F4F2EE">CHANEL</text><text x="68" y="53" text-anchor="middle" font-family="Helvetica Neue, Arial" font-size="3.6" letter-spacing="2.4" fill="#BDB8B0">BEAUTY</text></g>
    <g transform="rotate(14 82 64)"><rect x="44" y="40" width="76" height="48" rx="5" fill="url(#gc-st)" stroke="#3A2626" stroke-width="1.6"/><rect x="58" y="58" width="48" height="12" fill="#FAFAFA" stroke="#0B0B0C" stroke-width="1"/><text x="82" y="67" text-anchor="middle" font-family="Helvetica Neue, Arial" font-weight="700" font-size="6.4" letter-spacing="2.2" fill="#0B0B0C">SEPHORA</text></g></svg>`,
        open: 'giftcards'
    },
    {
        id: 'pads', name: 'pads', zip: 'front', l: 0, t: 0, w: 10, r: 0,
        art: `<svg viewBox="-4 0 112 100"><g transform="rotate(-8 45 45)"><path d="M14 18 h62 a6 6 0 0 1 6 6 v42 a6 6 0 0 1 -6 6 h-62 a6 6 0 0 1 -6 -6 v-42 a6 6 0 0 1 6 -6z" fill="#F4B6CA" ${S} stroke-width="2"/><path d="M8 30 h74 M8 60 h74" stroke="#E995AF" stroke-width="2" stroke-dasharray="2 2"/><circle cx="45" cy="45" r="9" fill="#FBE3EA"/><path d="M41 45 q4 -6 8 0 q-4 6 -8 0z" fill="#E995AF"/></g>
    <g transform="rotate(10 50 56) translate(10 14)"><path d="M14 18 h62 a6 6 0 0 1 6 6 v42 a6 6 0 0 1 -6 6 h-62 a6 6 0 0 1 -6 -6 v-42 a6 6 0 0 1 6 -6z" fill="#C9B6E8" ${S} stroke-width="2"/><path d="M8 30 h74 M8 60 h74" stroke="#A996D6" stroke-width="2" stroke-dasharray="2 2"/></g></svg>`,
        open: 'pads'
    },
    {
        id: 'cards', name: 'amaira’s cards', zip: 'devices', l: 0, t: 0, w: 9.8, r: -4,
        art: `<svg viewBox="0 0 120 100"><g transform="rotate(-12 50 55)"><rect x="10" y="20" width="70" height="60" fill="#F6C6D3" ${S} stroke-width="2"/><path d="M30 50 c-6 -8 4 -14 8 -6 c4 -8 14 -2 8 6 l-8 9z" fill="#E0457E"/></g>
    <g transform="rotate(6 70 55)"><rect x="34" y="16" width="72" height="62" fill="#FFFDF8" ${S} stroke-width="2"/><g font-family="Caveat, cursive" font-size="10" fill="#B13A6A"><text x="42" y="34">Happy</text><text x="42" y="46">Bithday</text><text x="42" y="58" fill="#3A5A9A">Didi!</text></g><path d="M86 40 l2 4 4 1 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -1z" fill="#F2C14E"/><path d="M84 62 c-4 -6 3 -10 6 -4 c3 -6 10 -2 6 4 l-6 7z" fill="#E0457E"/></g>
    <g transform="rotate(-3 60 70)"><rect x="18" y="52" width="66" height="40" fill="#FBF6EA" ${S} stroke-width="2"/><text x="24" y="66" font-family="Caveat, cursive" font-size="8" fill="#6A4FB0">xoxo,</text><text x="24" y="78" font-family="Caveat, cursive" font-size="9" fill="#6A4FB0">Amaira</text><path d="M64 60 q4 -6 8 0 q4 -6 8 0 q-8 10 -8 10 q-8 -10 -8 -10z" fill="#5BA7C4"/></g></svg>`,
        open: 'cards'
    },
    {
        id: 'backup-lip', name: 'my backup lipstick (westman glögg)', zip: 'shades', l: 0, t: 0, w: 3.9, r: 18,
        art: `<svg viewBox="0 0 70 150"><rect x="9" y="66" width="52" height="80" rx="6" fill="#F7F7F5" ${S}/><path d="M16 74 v64" stroke="#E2E2DF" stroke-width="4" stroke-linecap="round"/><rect x="13" y="58" width="44" height="11" rx="4" fill="#EEEEEB" ${S} stroke-width="2.5"/><rect x="19" y="36" width="32" height="24" rx="3" fill="#F7F7F5" ${S} stroke-width="2.5"/><path d="M22 37 V14 C22 5 31 3 35 8 L48 24 V37Z" fill="#8E2A24" ${S} stroke-width="2.5"/><path d="M26 16 q3 -6 7 -6" fill="none" stroke="#C45A4E" stroke-width="2.5" stroke-linecap="round"/><text x="35" y="118" text-anchor="middle" font-family="Instrument Sans" font-size="6" fill="#A9A9A6" transform="rotate(-90 35 106)" letter-spacing="1.4">WESTMAN ATELIER</text></svg>`,
        open: 'backuplip'
    },
    {
        id: 'chargers', name: 'my chargers (a tangled mess)', zip: 'main', l: 0, t: 0, w: 13, r: -8,
        get art() { return `<svg viewBox="40 20 320 260">${window.CHARGERS.list.map(c => window.CHARGERS.cable(c, 0)).join('')}</svg>`; },
        open: 'chargers'
    },
    {
        id: 'onward', name: 'onward, howard schultz', zip: 'main', l: 0, t: 0, w: 12.5, r: 5,
        art: `<svg viewBox="0 0 160 240"><rect x="3" y="3" width="154" height="234" rx="3" fill="#FBFAF6" ${S}/><path d="M10 6 v228" stroke="#E4E0D6" stroke-width="3"/>
            <text x="80" y="24" text-anchor="middle" font-family="Bodoni Moda" font-size="14" fill="#7A1F22">Howard Schultz</text><text x="80" y="34" text-anchor="middle" font-family="Instrument Sans" font-size="5" fill="#7A1F22">with Joanne Gordon</text>
            <circle cx="80" cy="106" r="54" fill="#00704A"/><circle cx="80" cy="106" r="42" fill="#FBFAF6"/><circle cx="80" cy="106" r="36" fill="#00704A"/>
            <path d="M80 80 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1z" fill="#FBFAF6"/><path d="M60 112 q6 16 20 18 q14 -2 20 -18 M64 124 q-8 6 -6 16 M96 124 q8 6 6 16" stroke="#FBFAF6" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="48" cy="66" r="11" fill="#00704A"/><text x="48" y="69" text-anchor="middle" font-family="Instrument Sans" font-size="4" fill="#fff">#1 NYT</text>
            <text x="80" y="198" text-anchor="middle" font-family="Bodoni Moda" font-weight="600" font-size="40" fill="#00704A">Onward</text>
            <text x="80" y="214" text-anchor="middle" font-family="Bodoni Moda" font-size="6.6" fill="#7A1F22">How Starbucks Fought for Its Life</text><text x="80" y="223" text-anchor="middle" font-family="Bodoni Moda" font-size="6.6" fill="#7A1F22">without Losing Its Soul</text></svg>`,
        open: 'onward'
    },
    {
        id: 'binder', name: 'my pink binder', zip: 'main', l: 13.6, t: 83.4, w: 24.4, r: -6,
        art: `<svg viewBox="0 0 170 200"><rect x="20" y="10" width="140" height="180" rx="6" fill="#FFFDF9" ${S} stroke-width="2"/><path d="M34 30 h110 M34 42 h96 M34 54 h104 M34 66 h80" stroke="#B9B2AE" stroke-width="3"/><rect x="8" y="4" width="152" height="192" rx="10" fill="#F4C9D2" fill-opacity=".82" ${S}/><rect x="8" y="4" width="30" height="192" rx="10" fill="#EDB6C2" fill-opacity=".9" ${S}/><path d="M14 20 q40 -6 60 30" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/></svg>`,
        open: 'binder'
    },
    {
        id: 'ipad', name: 'my ipad', zip: 'devices', l: 46.1, t: 8.5, w: 23.3, r: 3,
        art: `<svg viewBox="0 0 220 176"><g transform="translate(0 16)"><rect x="4" y="4" width="212" height="152" rx="16" fill="#2A2629" ${S}/><rect x="14" y="14" width="192" height="132" rx="8" fill="#F7E9EC"/><rect x="58" y="46" width="40" height="40" rx="10" fill="#E60023" ${S} stroke-width="2"/><path d="M78 56 c-10 0 -13 8 -11 13 c1 3 3 3 3 1 c-1 -4 1 -9 8 -9 c6 0 8 4 7 8 c-1 5 -4 7 -6 6 c-2 0 -2 -2 -1 -4 l1 -5 m0 0 l-4 14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><rect x="122" y="46" width="40" height="40" rx="10" fill="#1B1B1F" ${S} stroke-width="2"/><path d="M132 78 c6 -2 10 -10 18 -20 c2 -3 6 0 4 3 c-8 10 -12 16 -20 19z" fill="#F4A7B9"/><circle cx="133" cy="78" r="3" fill="#B9A3E8"/><text x="78" y="104" text-anchor="middle" font-family="Instrument Sans" font-size="9" fill="${INK}">Pinterest</text><text x="142" y="104" text-anchor="middle" font-family="Instrument Sans" font-size="9" fill="${INK}">Procreate</text></g><g data-part="pencil" class="kpart pencil-on" transform="translate(0 7)"><path d="M44 3 H192 a5 6 0 0 1 0 12 H44 L28 10 a2 2 0 0 1 0 -2 Z" fill="#F7F7F5" stroke="#3A2626" stroke-width="2"/><path d="M50 6 H184" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M50 13 H188" stroke="#D9D9D6" stroke-width="1.5" stroke-linecap="round"/></g></svg>`,
        open: 'ipad'
    },
    {
        id: 'pencil', name: 'my apple pencil pro', zip: 'attached', l: 41, t: 25, w: 15.5, r: -2,
        art: `<svg viewBox="0 0 330 26"><path d="M14 13 L2 13" stroke="#3A2626" stroke-width="2"/><path d="M30 4 H318 a7 9 0 0 1 0 18 H30 L6 15 a2 2 0 0 1 0 -4 Z" fill="#F7F7F5" ${S} stroke-width="2.5"/><path d="M40 8 H300" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M40 18 H312" stroke="#D9D9D6" stroke-width="2" stroke-linecap="round"/><text x="250" y="16" font-family="Instrument Sans" font-size="7" fill="#9A9A96">Pencil Pro</text></svg>`,
        open: 'pencil'
    },
    {
        id: 'phone', name: 'my iphone', zip: 'shades', l: 82.2, t: 15.7, w: 7.0, r: -3,
        art: `<svg viewBox="0 0 94 190"><defs><linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F5F6"/><stop offset=".55" stop-color="#E2E4E7"/><stop offset="1" stop-color="#CED1D5"/></linearGradient></defs>
            <rect x="3" y="3" width="88" height="184" rx="16" fill="#F2C6C8" ${S}/><rect x="5" y="6" width="84" height="54" rx="13" fill="#E9AFB4" stroke="#3A2626" stroke-width="1.2"/>
            <rect x="8" y="9" width="78" height="48" rx="10" fill="url(#silver)" stroke="#3A2626" stroke-width="1.6"/>
            <g stroke="#3A2626" stroke-width="1.6"><circle cx="22" cy="22" r="9" fill="#2A2C31"/><circle cx="22" cy="44" r="9" fill="#2A2C31"/><circle cx="40" cy="33" r="9" fill="#2A2C31"/></g>
            <g fill="#4B5263"><circle cx="22" cy="22" r="4"/><circle cx="22" cy="44" r="4"/><circle cx="40" cy="33" r="4"/></g>
            <circle cx="74" cy="20" r="4.5" fill="#F7F7F4" stroke="#3A2626" stroke-width="1.2"/><circle cx="74" cy="42" r="3.5" fill="#2A2C31"/><circle cx="62" cy="33" r="1.4" fill="#2A2C31"/>
            
            <path d="M12 68 v104" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>
        </svg>`,
        open: 'phone'
    },
    {
        id: 'passport', name: 'my passport', zip: 'devices', l: 91.2, t: 36.2, w: 9, r: 7,
        cover: `<svg viewBox="0 0 110 150"><rect x="6" y="4" width="98" height="142" rx="7" fill="#1E2A4A" ${S}/>
            <g fill="#D9B45A" font-family="Bodoni Moda" text-anchor="middle">
                <text x="55" y="26" font-size="13" font-weight="600" letter-spacing="1.2">PASSPORT</text>
                <text x="55" y="106" font-size="8.5" font-style="italic">United States</text>
                <text x="55" y="117" font-size="8.5" font-style="italic">of America</text>
            </g>
            <g fill="#D9B45A">
                <circle cx="55" cy="38" r="7.5" fill="none" stroke="#D9B45A" stroke-width=".9"/>
                <g>${[[55,33],[51,36],[59,36],[55,38],[52,41],[58,41],[49,39],[61,39],[55,42]].map(([x, y]) => `<path d="M${x} ${y - 1.4} l.45 1 1 .1 -.75 .7 .25 1 -.95 -.55 -.95 .55 .25 -1 -.75 -.7 1 -.1z"/>`).join('')}</g>
                <path d="M50 56 C44 52 36 44 29 36 C27 42 28 47 31 51 C28 51 26 53 25 56 C29 56 31 58 32 60 C30 61 29 63 29 66 C35 64 42 62 49 61Z"/>
                <path d="M60 56 C66 52 74 44 81 36 C83 42 82 47 79 51 C82 51 84 53 85 56 C81 56 79 58 78 60 C80 61 81 63 81 66 C75 64 68 62 61 61Z"/>
                <path d="M31 43 l8 7 M29 50 l11 5 M29 58 l13 1 M79 43 l-8 7 M81 50 l-11 5 M81 58 l-13 1" stroke="#1E2A4A" stroke-width=".7" fill="none"/>
                <path d="M52 47 c0 -3 2 -5 4 -5 c2 0 3 2 3 4 l-1 3 h-6z"/><path d="M52 46 l-3.5 1.2 3.3 1.2z"/><circle cx="54.6" cy="45" r=".55" fill="#1E2A4A"/>
                <path d="M38 50 q8 -4 17 0 q9 4 17 0" fill="none" stroke="#D9B45A" stroke-width="1.6"/>
                <path d="M47.5 55 h15 v12 q0 7 -7.5 11 q-7.5 -4 -7.5 -11z"/>
                <path d="M47.5 59 h15" stroke="#1E2A4A" stroke-width=".8"/><path d="M50 60 v12 M52.5 60 v14 M55 60 v15.5 M57.5 60 v14 M60 60 v12" stroke="#1E2A4A" stroke-width=".7"/>
                <path d="M51 77 l4 9 4 -9z"/>
                <path d="M47 73 C42 76 38 79 33 84" fill="none" stroke="#D9B45A" stroke-width="1.1"/>
                <g>${[[44,75,-30],[41,77.5,-30],[38,80,-30],[35.5,82.5,-30],[43,78,60],[40,80.5,60],[37,83,60]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry=".9" transform="rotate(${r} ${x} ${y})"/>`).join('')}</g>
                <path d="M63 73 L77 84 M64 75 L76 87 M62 76 L73 88" stroke="#D9B45A" stroke-width="1" fill="none"/><path d="M77 84 l-2.6 -.4 1 -1.8z M76 87 l-2.6 -.2 .9 -2z M73 88 l-2.4 0 .6 -2.1z"/>
            </g>
            <rect x="47" y="128" width="16" height="9" rx="1.5" fill="none" stroke="#D9B45A" stroke-width="1.4"/><path d="M50 132.5 h10 M55 128 v9" stroke="#D9B45A" stroke-width="1"/>
        </svg>`,
        get art() { return this.cover; },
        open: 'passport'
    },
    {
        id: 'laptop', name: 'my macbook pro', zip: 'devices', l: 16.0, t: 8.9, w: 29.4, r: -2,
        get art() { return window.LID(false); },
        open: 'laptop'
    }
];


/* the stickers on my laptop, where they actually are. Each one opens something. */
window.STICKERS = [
    { id: 'latte', label: '“love you a latte” → Saturday in Austin', x: 39, y: 33, r: 30, go: 'saturday',
      svg: `<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round"><ellipse cx="0" cy="18" rx="48" ry="20"/><ellipse cx="-1" cy="-8" rx="38" ry="21"/><path d="M34 -4 C52 -10 56 10 34 14Z"/><path d="M20 40 L44 -8"/></g><g fill="none" stroke="#C9CDD2" stroke-width="10.4" stroke-linejoin="round" opacity=".35"><ellipse cx="0" cy="18" rx="48" ry="20"/><ellipse cx="-1" cy="-8" rx="38" ry="21"/><path d="M34 -4 C52 -10 56 10 34 14Z"/><path d="M20 40 L44 -8"/></g><g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"><ellipse cx="0" cy="18" rx="48" ry="20"/><ellipse cx="-1" cy="-8" rx="38" ry="21"/><path d="M34 -4 C52 -10 56 10 34 14Z"/><path d="M20 40 L44 -8"/></g><ellipse cx="0" cy="18" rx="48" ry="20" fill="#FBF7F0" stroke="#2A2222" stroke-width="1.6"/>
<path d="M-38 -8 C-38 22 -18 32 0 32 C20 32 36 22 36 -8Z" fill="#FBF7F0" stroke="#2A2222" stroke-width="1.8"/><path d="M34 -4 C50 -10 54 10 33 13" fill="none" stroke="#2A2222" stroke-width="3"/>
<ellipse cx="-1" cy="-8" rx="37" ry="20" fill="#FBF7F0" stroke="#2A2222" stroke-width="1.8"/><ellipse cx="-1" cy="-8" rx="31" ry="15" fill="#C98A5C"/>
<path d="M-24 -6 q23 -18 46 0 M-18 -4 q17 -12 34 0" fill="none" stroke="#F6E7D3" stroke-width="2.2"/><path d="M-1 2 C-15 -6 -11 -17 -3 -15 C-1 -14 -1 -12 -1 -11 C-1 -12 0 -14 2 -15 C10 -17 13 -6 -1 2Z" fill="#F6E7D3"/>
<path d="M18 40 L42 -6" stroke="#A9A39C" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="44" cy="-10" rx="3" ry="6.5" fill="#B9B4AE" transform="rotate(28 44 -10)"/>
<text x="2" y="18" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="11" fill="#2A2222">Mozart’s</text><text x="2" y="23.5" text-anchor="middle" font-family="Georgia, serif" font-size="3" fill="#2A2222">COFFEE ROASTERS · Lake Austin, Texas</text>
<text font-family="Instrument Sans" font-weight="700" font-size="6.6" fill="#2A2222" letter-spacing=".4"><textPath href="#lattearc">LOVE YOU A LATTE</textPath></text><path id="lattearc" d="M-42 24 Q-14 40 22 36" fill="none"/>` },
    { id: 'flower', label: '“just as you are” → my sketchbook', x: 112, y: 37, r: 30, go: 'sketchbook',
      svg: `<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round"><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(8)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(53)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(98)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(143)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(188)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(233)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(278)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(323)"/></g><g fill="none" stroke="#C9CDD2" stroke-width="10.4" stroke-linejoin="round" opacity=".35"><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(8)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(53)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(98)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(143)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(188)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(233)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(278)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(323)"/></g><g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(8)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(53)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(98)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(143)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(188)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(233)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(278)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(323)"/></g><g fill="#A6B7A3"><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(8)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(53)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(98)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(143)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(188)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(233)"/><ellipse cx="0" cy="-26" rx="15" ry="23" transform="rotate(278)"/><ellipse cx="0" cy="-26" rx="14" ry="21" transform="rotate(323)"/></g><circle r="21" fill="#F2A866"/>
<g transform="rotate(-10)" font-family="Caveat, cursive" font-weight="700" fill="#C23F2C" text-anchor="middle"><text x="-2" y="-6" font-size="12">just</text><text x="1" y="4" font-size="12">as</text><text x="2" y="15" font-size="12">you are</text></g>
<g transform="translate(-24 -20)"><g fill="#E8689C"><ellipse cx="0" cy="-5" rx="2.4" ry="4.6" transform="rotate(0)"/><ellipse cx="0" cy="-5" rx="2.4" ry="4.6" transform="rotate(45)"/><ellipse cx="0" cy="-5" rx="2.4" ry="4.6" transform="rotate(90)"/><ellipse cx="0" cy="-5" rx="2.4" ry="4.6" transform="rotate(135)"/><ellipse cx="0" cy="-5" rx="2.4" ry="4.6" transform="rotate(180)"/><ellipse cx="0" cy="-5" rx="2.4" ry="4.6" transform="rotate(225)"/><ellipse cx="0" cy="-5" rx="2.4" ry="4.6" transform="rotate(270)"/><ellipse cx="0" cy="-5" rx="2.4" ry="4.6" transform="rotate(315)"/></g><circle r="2.6" fill="#B0432E"/></g>` },
    { id: 'texas', label: '“tradition starts here” → my coursework', x: 185, y: 38, r: 30, href: 'https://suhanitiwari.com/home/study#coursework',
      svg: `<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round"><path d="M-30 -48 H-10 V-14 L4 -10 L18 -7 L34 -6 L46 2 L46 16 L34 24 L22 34 L14 50 L4 44 L-2 30 L-14 20 L-22 8 L-30 4 L-38 -6 L-48 -12 L-48 -16 L-30 -16 Z"/></g><g fill="none" stroke="#C9CDD2" stroke-width="10.4" stroke-linejoin="round" opacity=".35"><path d="M-30 -48 H-10 V-14 L4 -10 L18 -7 L34 -6 L46 2 L46 16 L34 24 L22 34 L14 50 L4 44 L-2 30 L-14 20 L-22 8 L-30 4 L-38 -6 L-48 -12 L-48 -16 L-30 -16 Z"/></g><g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"><path d="M-30 -48 H-10 V-14 L4 -10 L18 -7 L34 -6 L46 2 L46 16 L34 24 L22 34 L14 50 L4 44 L-2 30 L-14 20 L-22 8 L-30 4 L-38 -6 L-48 -12 L-48 -16 L-30 -16 Z"/></g><path d="M-30 -48 H-10 V-14 L4 -10 L18 -7 L34 -6 L46 2 L46 16 L34 24 L22 34 L14 50 L4 44 L-2 30 L-14 20 L-22 8 L-30 4 L-38 -6 L-48 -12 L-48 -16 L-30 -16 Z" fill="#FBF8F4" stroke="#D2602A" stroke-width="2.6" stroke-linejoin="round" transform="scale(.9)"/>
<g font-family="Instrument Sans" font-weight="400" fill="#D2602A"><text transform="translate(-24 -38) rotate(62) scale(1 1.25)" font-size="11.5" letter-spacing=".3">TRADITION</text><text transform="translate(-40 -8) rotate(40) scale(1 1.25)" font-size="11" letter-spacing=".3">STARTS HERE</text></g>` },
    { id: 'music', label: 'the music heart → Listening History', x: 257, y: 43, r: 32, go: 'headphones',
      svg: `<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round"><path d="M0 46 C-50 14 -52 -30 -26 -40 C-12 -46 -2 -36 0 -28 C2 -36 12 -46 26 -40 C52 -30 50 14 0 46Z"/></g><g fill="none" stroke="#C9CDD2" stroke-width="10.4" stroke-linejoin="round" opacity=".35"><path d="M0 46 C-50 14 -52 -30 -26 -40 C-12 -46 -2 -36 0 -28 C2 -36 12 -46 26 -40 C52 -30 50 14 0 46Z"/></g><g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"><path d="M0 46 C-50 14 -52 -30 -26 -40 C-12 -46 -2 -36 0 -28 C2 -36 12 -46 26 -40 C52 -30 50 14 0 46Z"/></g><path d="M0 46 C-50 14 -52 -30 -26 -40 C-12 -46 -2 -36 0 -28 C2 -36 12 -46 26 -40 C52 -30 50 14 0 46Z" fill="#FBF9F4" stroke="#D8D2C8" stroke-width="1"/>
<g font-family="Instrument Sans" font-weight="800" fill="#33627E"><text x="-34" y="-2" font-size="13">13</text><text x="16" y="2" font-size="13">13</text></g>
<text x="-10" y="-22" font-family="Caveat, cursive" font-weight="700" font-size="9" fill="#2A2222" transform="rotate(-12 -10 -22)">Lover</text>
<g transform="translate(8 -26)"><circle r="6" fill="#F3E9D6" stroke="#2A2222" stroke-width="1"/><path d="M0 0 v-4 M0 0 h3" stroke="#2A2222" stroke-width=".8"/></g>
<g transform="translate(-2 8)"><path d="M-9 0 c-5 -5 -1 -9 3 -6 l1 1 1 -1 c4 -3 8 1 3 6 l-4 4z" fill="#D9302E"/><path d="M1 0 c-5 -5 -1 -9 3 -6 l1 1 1 -1 c4 -3 8 1 3 6 l-4 4z" fill="#D9302E"/></g>
<g transform="translate(-34 16) rotate(-30)"><ellipse rx="5" ry="6" fill="#E3B15A" stroke="#2A2222" stroke-width=".8"/><path d="M0 -6 v-12" stroke="#2A2222" stroke-width="1.4"/></g>
<g fill="#222"><circle cx="-14" cy="26" r="4.4"/><circle cx="12" cy="-12" r="4"/><circle cx="20" cy="16" r="4"/></g><g fill="#E9C46A"><circle cx="-14" cy="26" r="1.2"/><circle cx="12" cy="-12" r="1.1"/><circle cx="20" cy="16" r="1.1"/></g>
<rect x="-6" y="18" width="10" height="9" fill="#F3EFE7" stroke="#9AA" stroke-width=".6"/><text x="-1" y="24" text-anchor="middle" font-size="2.4" font-family="Instrument Sans">Junior Jewels</text>
<g fill="#33627E"><path d="M-20 -18 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z"/><path d="M30 -24 l1 2.5 2.5 1 -2.5 1 -1 2.5 -1 -2.5 -2.5 -1 2.5 -1z"/></g>
<path d="M26 -32 c-3 -4 -8 -1 -5 3 c-4 1 -3 6 1 5 c1 4 6 2 4 -2" fill="#5B8FB0"/><rect x="-36" y="20" width="3" height="9" fill="#9C2B2B"/><rect x="-6" y="34" width="9" height="5" fill="#F2D24B" transform="rotate(-12 -6 34)"/>
<path d="M14 26 l2 -5 2 5 M24 6 h6 M-22 36 q4 -3 8 0" fill="none" stroke="#2A2222" stroke-width=".8"/>` },
    { id: 'cupcake', label: 'the Mozart’s cupcake → Saturday in Austin', x: 194, y: 171, r: 32, go: 'saturday',
      svg: `<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round"><path d="M-32 -2 C-38 -22 -14 -34 4 -30 L8 -50 L15 -48 L13 -30 C30 -28 40 -14 36 2 L32 34 C30 44 22 48 14 48 L-20 48 C-28 48 -34 44 -34 36 Z"/></g><g fill="none" stroke="#C9CDD2" stroke-width="10.4" stroke-linejoin="round" opacity=".35"><path d="M-32 -2 C-38 -22 -14 -34 4 -30 L8 -50 L15 -48 L13 -30 C30 -28 40 -14 36 2 L32 34 C30 44 22 48 14 48 L-20 48 C-28 48 -34 44 -34 36 Z"/></g><g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"><path d="M-32 -2 C-38 -22 -14 -34 4 -30 L8 -50 L15 -48 L13 -30 C30 -28 40 -14 36 2 L32 34 C30 44 22 48 14 48 L-20 48 C-28 48 -34 44 -34 36 Z"/></g><path d="M-32 -2 C-38 -22 -14 -34 4 -30 L8 -50 L15 -48 L13 -30 C30 -28 40 -14 36 2 L32 34 C30 44 22 48 14 48 L-20 48 C-28 48 -34 44 -34 36 Z" fill="#EFA3BA"/>
<path d="M-30 2 H32 L26 30 H-24Z" fill="#B2A4DA"/><path d="M-24 3 L-19.7 29" stroke="#C9BFEA" stroke-width="1"/><path d="M-18 3 L-14.8 29" stroke="#C9BFEA" stroke-width="1"/><path d="M-12 3 L-9.8 29" stroke="#C9BFEA" stroke-width="1"/><path d="M-6 3 L-4.9 29" stroke="#C9BFEA" stroke-width="1"/><path d="M0 3 L0.0 29" stroke="#C9BFEA" stroke-width="1"/><path d="M6 3 L4.9 29" stroke="#C9BFEA" stroke-width="1"/><path d="M12 3 L9.8 29" stroke="#C9BFEA" stroke-width="1"/><path d="M18 3 L14.8 29" stroke="#C9BFEA" stroke-width="1"/><path d="M24 3 L19.7 29" stroke="#C9BFEA" stroke-width="1"/>
<path d="M-33 4 C-38 -8 -26 -18 -16 -16 C-14 -27 6 -30 12 -21 C26 -23 36 -12 32 4 C10 8 -12 8 -33 4Z" fill="#FBF3E2"/><path d="M-20 -6 q14 -10 30 -4 M-26 0 q22 -8 46 -2" fill="none" stroke="#EADFCB" stroke-width="1.4"/>
<path d="M-20 -10 l4 -1" stroke="#E07A3A" stroke-width="1.8" stroke-linecap="round"/><path d="M-10 -16 l1 4" stroke="#9B8CDB" stroke-width="1.8" stroke-linecap="round"/><path d="M0 -8 l4 2" stroke="#E07A3A" stroke-width="1.8" stroke-linecap="round"/><path d="M8 -16 l-2 4" stroke="#F2C14E" stroke-width="1.8" stroke-linecap="round"/><path d="M18 -8 l4 -2" stroke="#9B8CDB" stroke-width="1.8" stroke-linecap="round"/><path d="M-24 0 l3 2" stroke="#F2C14E" stroke-width="1.8" stroke-linecap="round"/><path d="M14 -2 l3 2" stroke="#E07A3A" stroke-width="1.8" stroke-linecap="round"/><path d="M-6 -2 l4 -1" stroke="#9B8CDB" stroke-width="1.8" stroke-linecap="round"/>
<circle cx="8" cy="-28" r="7" fill="#D4482E"/><circle cx="6" cy="-30" r="2" fill="#F08A70"/><path d="M9 -34 L12 -50" stroke="#B5402A" stroke-width="2.4" stroke-linecap="round"/>
<text x="0" y="42" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="11" fill="#FBF3E6">Mozart’s</text>` },
    { id: 'cowgirl', label: 'the cowgirl hat & boot → Owala Austin Marathon', x: 207, y: 102, r: 30, go: 'owala',
      svg: `<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round"><path d="M-34 -32 L-8 -36 L-4 6 L22 18 C32 22 30 32 20 32 L-38 32 C-44 32 -44 24 -38 22 L-34 8Z"/><path d="M-2 -40 C10 -46 40 -40 46 -26 C50 -10 40 10 30 14 C22 16 14 6 12 -8 C10 -20 4 -34 -2 -40Z"/><path d="M-14 32 L-12 44 H4 L6 32"/></g><g fill="none" stroke="#C9CDD2" stroke-width="10.4" stroke-linejoin="round" opacity=".35"><path d="M-34 -32 L-8 -36 L-4 6 L22 18 C32 22 30 32 20 32 L-38 32 C-44 32 -44 24 -38 22 L-34 8Z"/><path d="M-2 -40 C10 -46 40 -40 46 -26 C50 -10 40 10 30 14 C22 16 14 6 12 -8 C10 -20 4 -34 -2 -40Z"/><path d="M-14 32 L-12 44 H4 L6 32"/></g><g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"><path d="M-34 -32 L-8 -36 L-4 6 L22 18 C32 22 30 32 20 32 L-38 32 C-44 32 -44 24 -38 22 L-34 8Z"/><path d="M-2 -40 C10 -46 40 -40 46 -26 C50 -10 40 10 30 14 C22 16 14 6 12 -8 C10 -20 4 -34 -2 -40Z"/><path d="M-14 32 L-12 44 H4 L6 32"/></g><path d="M-34 -32 L-8 -36 L-4 6 L22 18 C32 22 30 32 20 32 L-38 32 C-44 32 -44 24 -38 22 L-34 8Z" fill="#F7E4D6"/><path d="M-14 32 L-12 44 H4 L6 32Z" fill="#A9452B"/><path d="M-38 30 H18" stroke="#A9452B" stroke-width="2"/>
<path d="M-26 -30 C-30 -18 -18 -16 -24 -6 C-30 4 -16 6 -20 14 M-16 -32 C-12 -20 -22 -16 -14 -6 C-8 2 -18 8 -12 14" fill="none" stroke="#5E80C6" stroke-width="2.6" stroke-linecap="round"/><path d="M-30 -24 l8 2 M-28 -10 l8 2" stroke="#5E80C6" stroke-width="1.6"/>
<path d="M-2 -40 C10 -46 40 -40 46 -26 C50 -10 40 10 30 14 C22 16 14 6 12 -8 C10 -20 4 -34 -2 -40Z" fill="#E07A4A"/><path d="M12 -30 C22 -36 36 -30 40 -18 C42 -8 36 4 30 6 C24 4 22 -6 20 -14 C18 -22 14 -28 12 -30Z" fill="#D2683C"/><path d="M14 -14 C24 -12 34 -16 40 -20" stroke="#F3E2D3" stroke-width="1.2" stroke-dasharray="1.6 1.6" fill="none"/>
<path d="M30 12 C28 22 32 30 28 40 M32 12 C36 22 34 30 38 38" stroke="#F5E2D4" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#E0A25A"><circle cx="29" cy="22" r=".9"/><circle cx="35" cy="28" r=".9"/><circle cx="29" cy="34" r=".9"/></g>` },
    { id: 'books', label: '“hot girls read” → my children’s book', x: 260, y: 168, r: 30, go: 'book',
      svg: `<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round"><rect x="-38" y="-14" width="74" height="60" rx="3"/><path d="M-30 -26 C-42 -40 -14 -42 -2 -18 C10 -42 40 -40 28 -24 Z"/></g><g fill="none" stroke="#C9CDD2" stroke-width="10.4" stroke-linejoin="round" opacity=".35"><rect x="-38" y="-14" width="74" height="60" rx="3"/><path d="M-30 -26 C-42 -40 -14 -42 -2 -18 C10 -42 40 -40 28 -24 Z"/></g><g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"><rect x="-38" y="-14" width="74" height="60" rx="3"/><path d="M-30 -26 C-42 -40 -14 -42 -2 -18 C10 -42 40 -40 28 -24 Z"/></g><rect x="-36" y="-12" width="72" height="12" rx="1.5" fill="#C93E5E" stroke="#8E2440" stroke-width=".8"/><rect x="24" y="-10.5" width="10" height="9" fill="#FBF3F0"/><path d="M25 -8 h8 M25 -5 h8" stroke="#E6CFD2" stroke-width=".6"/><rect x="-34" y="0" width="72" height="12" rx="1.5" fill="#F2A1B4" stroke="#8E2440" stroke-width=".8"/><rect x="26" y="1.5" width="10" height="9" fill="#FBF3F0"/><path d="M27 4 h8 M27 7 h8" stroke="#E6CFD2" stroke-width=".6"/><rect x="-38" y="12" width="72" height="12" rx="1.5" fill="#C93E5E" stroke="#8E2440" stroke-width=".8"/><rect x="22" y="13.5" width="10" height="9" fill="#FBF3F0"/><path d="M23 16 h8 M23 19 h8" stroke="#E6CFD2" stroke-width=".6"/><rect x="-34" y="24" width="72" height="12" rx="1.5" fill="#F2A1B4" stroke="#8E2440" stroke-width=".8"/><rect x="26" y="25.5" width="10" height="9" fill="#FBF3F0"/><path d="M27 28 h8 M27 31 h8" stroke="#E6CFD2" stroke-width=".6"/><rect x="-36" y="36" width="72" height="12" rx="1.5" fill="#C93E5E" stroke="#8E2440" stroke-width=".8"/><rect x="24" y="37.5" width="10" height="9" fill="#FBF3F0"/><path d="M25 40 h8 M25 43 h8" stroke="#E6CFD2" stroke-width=".6"/><g fill="#F2A1B4" stroke="#C93E5E" stroke-width="1"><path d="M-2 -18 C-14 -36 -40 -34 -32 -22 C-26 -14 -10 -16 -2 -18Z"/><path d="M-2 -18 C10 -36 36 -34 28 -22 C22 -14 6 -16 -2 -18Z"/></g>
<path d="M-4 -18 C-10 0 -14 20 -16 40 M0 -18 C6 0 4 20 8 38" stroke="#F2A1B4" stroke-width="3.4" fill="none" stroke-linecap="round"/><ellipse cx="-2" cy="-18" rx="4" ry="3.6" fill="#E58AA0" stroke="#C93E5E" stroke-width="1"/>
<g font-family="Caveat, cursive" font-weight="700" fill="#FBF3F0"><text x="-6" y="-3" font-size="8.5">hot</text><text x="-10" y="21" font-size="8.5">girls</text><text x="-6" y="45" font-size="8.5">read</text></g>
<path d="M-10 9 l2 -2 2 2 M18 -6 l2 2 M-28 30 l1 2" stroke="#FBF3F0" stroke-width=".8" fill="none"/>` }
];

window.LID = (big) => `<svg viewBox="0 0 300 214" ${big ? 'class="lid-big"' : ''} aria-hidden="${big ? 'false' : 'true'}">
    <defs><clipPath id="lidclip${big ? 'b' : ''}"><rect x="2" y="2" width="296" height="210" rx="12"/></clipPath></defs>
    <image href="assets/img/laptop-lid.jpg?v=1790826509" x="2" y="2" width="296" height="210" preserveAspectRatio="xMidYMid slice" clip-path="url(#lidclip${big ? 'b' : ''})"/>
    <rect x="2" y="2" width="296" height="210" rx="12" fill="none" ${S}/>
    ${big ? window.STICKERS.map(k => `<g class="stk" tabindex="0" role="button" aria-label="${k.label}" data-sticker="${k.id}"><circle class="stk-in" cx="${k.x}" cy="${k.y}" r="${k.r}" fill="#fff" fill-opacity="0"/></g>`).join('') : ''}
</svg>`;


/* my custom Erin Condren notebooks: four bands, NOTES on each */
window.EC = (bands, big) => `<svg viewBox="0 0 170 220" aria-hidden="true">
    <rect x="12" y="4" width="154" height="212" rx="8" fill="${bands[0]}" ${S}/>
    <clipPath id="ecc${bands.join('').replace(/[#,]/g, '')}"><rect x="12" y="4" width="154" height="212" rx="8"/></clipPath>
    <g clip-path="url(#ecc${bands.join('').replace(/[#,]/g, '')})">${bands.map((b, i) => { const c = Array.isArray(b) ? b[0] : b, t = Array.isArray(b) ? b[1] : null; return `<rect x="0" y="${4 + i * 53}" width="180" height="53" fill="${c}"/><text x="${96}" y="${44 + i * 53}" text-anchor="middle" font-family="Bodoni Moda" font-size="38" letter-spacing="1" fill="${t || (i % 2 ? '#F6D9E2' : '#FFFDF8')}" opacity=".95">NOTES</text>`; }).join('')}</g>
    <rect x="12" y="4" width="154" height="212" rx="8" fill="none" ${S}/>
    ${Array.from({ length: 13 }, (_, i) => `<ellipse cx="12" cy="${16 + i * 15.5}" rx="7" ry="3.2" fill="none" stroke="#9EA3AA" stroke-width="2.5"/>`).join('')}
</svg>`;


/* my keys: BMW key, my (navy) apartment fob and my mailbox keys, on one ring. Each one is its own tap. */
window.BMW_FOB = `<svg viewBox="0 -8 80 158"><rect x="33" y="-6" width="14" height="10" rx="3" fill="#1A1A1C" stroke="#3A2626" stroke-width="2"/>
            <path d="M22 3 H58 L72 22 L74 118 L60 146 H20 L6 118 L8 22Z" fill="#0F0F11" ${S}/>
            <path d="M42 4 C34 50 30 100 28 145" fill="none" stroke="#2A2A2E" stroke-width="1.6"/>
            <path d="M18 12 q8 -6 20 -6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".22"/>
            <path d="M8 25 L30 47" stroke="#D8432F" stroke-width="4.5"/><path d="M30 47 L63 82 Q70 90 70 102 V140" fill="none" stroke="#2F6BD8" stroke-width="4.5"/>
            <circle cx="40" cy="108" r="9.5" fill="#CDD1D6" stroke="#3A2626" stroke-width="1.5"/><circle cx="40" cy="108" r="6.5" fill="#1C1C20"/><circle cx="38" cy="106" r="1.6" fill="#fff" opacity=".6"/>
            <path d="M54 88 h7 v6 h-7z M55.5 88 v-2.5 a2 2 0 0 1 4 0" fill="none" stroke="#C9D3DD" stroke-width="1.3"/>
            <circle cx="58" cy="126" r="5.5" fill="none" stroke="#C9D3DD" stroke-width="1.2"/><text x="58" y="128.3" text-anchor="middle" font-family="Instrument Sans" font-size="5.5" fill="#C9D3DD">3x</text>
        </svg>`;
window.SALTO_FOB = `<svg viewBox="0 0 48 66"><path d="M15 3 h18 a7 7 0 0 1 7 7 v5 C45 19 46.5 26 46 34 a22 22 0 1 1 -44 0 C1.5 26 3 19 8 15 v-5 a7 7 0 0 1 7 -7Z" fill="#1F3A93" stroke="#3A2626" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="15" y="8" width="18" height="7.5" rx="3.75" fill="#FAF1EF" stroke="#16296B" stroke-width="1.5"/>
    <circle cx="24" cy="40" r="17" fill="#F7F5F0" stroke="#16296B" stroke-width="1.2"/>
    <path d="M12 37 h24" stroke="#2B2B2E" stroke-width="3.2" stroke-linecap="round"/><path d="M13 43.5 h22" stroke="#7A7A7E" stroke-width="2" stroke-linecap="round"/><path d="M19 50 h10" stroke="#B3B3B8" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M34 28 q4 4 3 12" fill="none" stroke="#E9E2D6" stroke-width="1.5" stroke-linecap="round"/><path d="M8 24 q3 -6 9 -8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".25"/></svg>`;
window.APT_FOB = `<svg viewBox="0 0 48 66"><path d="M24 3 C34 3 46 22 45 42 C44 64 4 64 3 42 C2 22 14 3 24 3Z" fill="#9EA49F" stroke="#3A2626" stroke-width="2.5"/><circle cx="24" cy="12" r="4.5" fill="#FAF1EF" stroke="#6F746F" stroke-width="1.5"/><rect x="11" y="30" width="26" height="9" rx="2" fill="none" stroke="#7D837E" stroke-width="1.4" transform="rotate(-8 24 34)"/><path d="M14 22 q4 -8 10 -10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".3"/></svg>`;
window.KEYRING = big => `<svg viewBox="0 0 200 252" class="keyring${big ? ' big' : ''}">
    <circle cx="86" cy="26" r="20" fill="none" stroke="#B9BCC2" stroke-width="6"/><circle cx="86" cy="26" r="20" fill="none" stroke="#3A2626" stroke-width="1.5"/>
    <g data-part="apartment" class="kpart"><circle cx="66" cy="50" r="9" fill="none" stroke="#B9BCC2" stroke-width="4"/><circle cx="66" cy="50" r="9" fill="none" stroke="#3A2626" stroke-width="1.2"/>
        <g transform="translate(38 50) rotate(6 24 33)">${window.SALTO_FOB.replace('<svg viewBox="0 0 48 66">', '<svg width="52" height="72" viewBox="0 0 48 66">')}</g></g>
    <g data-part="bmw" class="kpart"><circle cx="96" cy="50" r="9" fill="none" stroke="#B9BCC2" stroke-width="4"/><circle cx="96" cy="50" r="9" fill="none" stroke="#3A2626" stroke-width="1.2"/>
        <g transform="translate(66 58)">${window.BMW_FOB.replace('<svg viewBox="0 -8 80 158">', '<svg width="70" height="138" viewBox="0 -8 80 158" overflow="visible">')}</g></g>
    <g data-part="mailbox" class="kpart"><circle cx="128" cy="46" r="8" fill="none" stroke="#B9BCC2" stroke-width="4"/><circle cx="128" cy="46" r="8" fill="none" stroke="#3A2626" stroke-width="1.2"/>
        <g transform="translate(140 50) rotate(10)"><svg width="44" height="110" viewBox="0 0 40 100" overflow="visible">
            <path d="M6 2 h28 a5 5 0 0 1 5 5 v26 a14 14 0 0 1 -14 14 h-10 a14 14 0 0 1 -14 -14 v-26 a5 5 0 0 1 5 -5z" fill="#E3B754" stroke="#3A2626" stroke-width="2.2"/>
            <circle cx="20" cy="12" r="4.6" fill="#FAF1EF" stroke="#8A6A2A" stroke-width="1.4"/><path d="M8 20 q12 -4 24 0" fill="none" stroke="#F6DB94" stroke-width="2" stroke-linecap="round"/>
            <path d="M13 46 h14 v4 h-3 v42 l-4 7 -4 -7 v-4 h-4 v-6 h4 v-5 h-5 v-6 h5 v-6 h-4 v-6 h4 v-8 h-3z" fill="#E3B754" stroke="#3A2626" stroke-width="2" stroke-linejoin="round"/>
            <path d="M22 52 v38" stroke="#B8862F" stroke-width="1.6"/><path d="M15 52 v20" stroke="#F6DB94" stroke-width="1.4"/></svg></g></g>
</svg>`;

/* my wallet: student ID, driver license, and my cards. Cards pop out like file folders. */
window.CARDS = [
    { kind: 'id', title: 'UT Austin student ID', big: 'Suhani Tiwari', sub: 'Management Information Systems + Psychology', metric: 'McCombs School of Business · Class of 2027 · 3.5 GPA', body: 'BBA in MIS and a BA in Psychology, with minors in Marketing and Educational Psychology. Two McCombs scholarships this year.' },
    { kind: 'dl', title: 'Driver license', big: 'Suhani Tiwari', metric: 'Class: C (for cute)<br>Endorsements: none, yet', body: 'Height: 5′6″.<br>Weight: don’t ask.<br>Eyes: dreamy.<br>Hair: dark, long, and always done.<br>Address: wouldn’t you wanna knowwww.<br>DOB: a lady never tells.<br>Driving skill: see my car keys.' },
    { kind: 'bofa', title: 'Bank of America credit card', big: 'Recent transactions', metric: 'Coffee · coffee · Westman Atelier · coffee · Target · coffee', body: 'Mostly vanilla lattes. Also Glögg (obviously), Lash Idôle, and a 25-pack of Mildliners. But mostly vanilla lattes.' },
    { kind: 'bofadebit', title: 'Bank of America debit card', big: 'Balance', metric: 'Balance: none of your business', body: 'The red one. For when the credit cards need a break.' },
    { kind: 'amexgold', title: 'Amex Delta SkyMiles Gold', big: 'Where the miles went', metric: 'Thailand + Malaysia 2010 · Switzerland, France, Italy 2016 · Mexico 2020', body: 'The stamps are in my passport.', go: 'passport' },
    { kind: 'amexblue', title: 'Amex Blue Cash Everyday', big: 'The everyday card', metric: 'Sushi · tacos · pasta · ramen · brunch · repeat', body: 'My love language is good food, and this card has proof.' }
];

/* my pencil pouch: every pen is a tool I actually use */
/* my Mildliner pouch: the full 25-pack. Every highlighter is a class I took at UT Austin. */
window.PENS = [
    { name: 'MIS 304', full: 'Problem Solving & Programming', subject: 'MIS', c: '#F7E06B' },
    { name: 'MIS 325', full: 'Database Management', subject: 'MIS', c: '#F4A7B9' },
    { name: 'MIS 333K', full: 'Web Application Development', subject: 'MIS', c: '#B9A3E8' },
    { name: 'MIS 372T', full: 'Full-Stack Web App Development', subject: 'MIS', c: '#8FD19E' },
    { name: 'MIS 301', full: 'Intro to IT Management', subject: 'MIS', c: '#F6B48C' },
    { name: 'MIS 375', full: 'Strategic IT Management', subject: 'MIS', c: '#9CC9E8' },
    { name: 'Marketing', full: 'Principles of Marketing', subject: 'Marketing', c: '#E8A1C4' },
    { name: 'Consumer', full: 'Consumer Behavior', subject: 'Marketing', c: '#F2C572' },
    { name: 'Brand', full: 'Brand Management', subject: 'Marketing', c: '#C9B6E4' },
    { name: 'Product', full: 'Strategic Product Management', subject: 'Marketing', c: '#A9DCEB' },
    { name: 'Influence', full: 'Science of Influence', subject: 'Marketing', c: '#F29B6B' },
    { name: 'Psych', full: 'Intro to Psychology', subject: 'Psychology', c: '#A8D8A0' },
    { name: 'Cognitive', full: 'Cognitive Psychology', subject: 'Psychology', c: '#F5A3A3' },
    { name: 'Social', full: 'Social Psychology', subject: 'Psychology', c: '#B3A6E0' },
    { name: 'Personality', full: 'Personality', subject: 'Psychology', c: '#9ED3C3' },
    { name: 'Motivation', full: 'Neuroscience of Motivation', subject: 'Psychology', c: '#F0A58F' },
    { name: 'Learning', full: 'Cognition & Human Learning', subject: 'Educational Psychology', c: '#F3B6C9' },
    { name: 'Mindful', full: 'Mindfulness & Compassion', subject: 'Educational Psychology', c: '#A7C4E8' },
    { name: 'Ads', full: 'Psychology of Advertising', subject: 'Advertising', c: '#C7E3A1' },
    { name: 'Story', full: 'Brand Storytelling', subject: 'Advertising', c: '#F7D54A' },
    { name: 'Stats', full: 'Statistics for Business', subject: 'Analytics & Operations', c: '#86C5D8' },
    { name: 'Decisions', full: 'Intro to Decision Science', subject: 'Analytics & Operations', c: '#D9B38C' },
    { name: 'Finance', full: 'Corporate Finance', subject: 'Analytics & Operations', c: '#B5D99C' },
    { name: 'Org', full: 'Organizational Behavior', subject: 'Leadership & Communication', c: '#D7A6D9' },
    { name: 'Art', full: 'Studio Art Lab', subject: 'Creation & Analysis', c: '#F6B48C' }
];

/* my Paper Mate pouch: 20 InkJoy Gel pens, 0.7mm. Pick one and write anything. */
window.GELPENS = [
    { name: 'Berry', c: '#E63F7A' },
    { name: 'Violet', c: '#7B4FD1' },
    { name: 'Blue', c: '#1F6FD1' },
    { name: 'Teal', c: '#18A39A' },
    { name: 'Orange', c: '#F0592B' },
    { name: 'Raspberry', c: '#D6336C' },
    { name: 'Lilac', c: '#9B59D0' },
    { name: 'Sky', c: '#2E86DE' },
    { name: 'Green', c: '#27AE60' },
    { name: 'Pink', c: '#E84393' },
    { name: 'Indigo', c: '#6C5CE7' },
    { name: 'Ocean', c: '#0984E3' },
    { name: 'Mint', c: '#00B894' },
    { name: 'Coral', c: '#E17055' },
    { name: 'Magenta', c: '#B83280' },
    { name: 'Purple', c: '#8E44AD' },
    { name: 'Royal', c: '#3867D6' },
    { name: 'Lime', c: '#20BF6B' },
    { name: 'Tangerine', c: '#FA8231' },
    { name: 'Rose', c: '#C2185B' }
];

/* my laptop: projects as file folders */
window.PROJECTS = [
    { name: 'Listening History', tag: 'Live · data', c: '#F4A7B9', img: 'assets/img/listening.jpg', href: 'https://listening-history.onrender.com/' },
    { name: 'Saturday in Austin', tag: 'Live · Python', c: '#CDE6D0', img: 'assets/img/saturday.jpg', href: 'https://suhxnitiwari.github.io/saturday-in-austin/' },
    { name: 'Owala Marathon Series', tag: 'Brand strategy', c: '#F8E7A9', img: 'assets/img/owala.jpg', href: 'https://suhanitiwari.com/home/study#marketing' },
    { name: 'Girls Can Be Engineers, Too!', tag: '#1 New Release', c: '#F2C6C8', img: 'assets/img/book.jpg', href: 'https://suhanitiwari.com/home/beyondtheclassroom' }
];

/* my sketchbook */
window.ART = [
    ['Eye Study', 'Graphite on paper. One of my older drawings, and still one of my favorites.', 'eye-study'],
    ['Softly, I Belong', 'She blossoms as she holds the flower: embracing cultural identity empowers children.', 'embracing-cultural-identity'],
    ['Between Two Worlds', 'The Indian and American flags in a child’s hands.', 'navigating-indian-american-identity'],
    ['In Full Bloom', 'Both flags’ colors in one vase. Identity can blossom.', 'coexistence-of-both-my-worlds'],
    ['Inherited Light', 'A girl putting on her earrings, cherishing her heritage.', 'embracing-indian-heritage'],
    ['Old and New', 'The dance between tradition’s allure and its outdated norms.', 'traditionalism-versus-modernism'],
    ['What I Carry', '', 'packing-home'],
    ['Keeping the Light', '', 'diya-thali'],
    ['Woven Together', '', 'braid'],
    ['Getting Ready', '', 'vanity']
];
