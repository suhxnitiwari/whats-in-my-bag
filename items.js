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
        { id: 'devices', label: 'devices', d: 'M52 104 C52 40 248 40 248 104' },
        { id: 'main', label: 'notebooks, pens & makeup', d: 'M66 124 C66 68 234 68 234 124' },
        { id: 'shades', label: 'sunglasses pocket', d: 'M96 148 C110 132 190 132 204 148' },
        { id: 'front', label: 'wallet, passport, makeup & hair', d: 'M220 196 C216 176 84 176 80 196' }
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
            <div class="eq" aria-hidden="true">${'<i></i>'.repeat(18)}</div>
            <div class="stats"><div><b>182K</b><span>plays cleaned</span></div><div><b>21</b><span>days in a row on one song</span></div><div><b>7</b><span>SQL views</span></div></div>
            <div class="shot"><img src="assets/img/listening.jpg" alt="Listening History, the app"></div>
            <div class="row"><a class="btn solid" href="https://listening-history.onrender.com/" target="_blank" rel="noopener">Open Listening History ↗</a><a class="btn" href="https://github.com/suhxnitiwari/listening-history" target="_blank" rel="noopener">Code ↗</a></div>`
    },
    {
        id: 'sketchbook', name: 'my sketchbook', zip: 'main', l: 60.2, t: 81.3, w: 20.3, r: 4,
        art: `<svg viewBox="0 0 180 220"><rect x="14" y="10" width="156" height="200" rx="10" fill="#8E9A6E" ${S}/><path d="M14 30 H4 M14 60 H4 M14 90 H4 M14 120 H4 M14 150 H4 M14 180 H4" ${S}/><rect x="132" y="10" width="12" height="200" fill="#F4A7B9" ${S}/><rect x="42" y="56" width="76" height="52" rx="4" fill="#FFFBF8" ${S} transform="rotate(-4 80 82)"/><text x="80" y="88" text-anchor="middle" font-family="Caveat" font-size="24" fill="${INK}" transform="rotate(-4 80 82)">sketches</text><path d="M60 150 q12 -18 24 0 t24 0" fill="none" ${S} stroke-width="2"/><circle cx="104" cy="170" r="6" fill="#F2C6C8" ${S} stroke-width="2"/></svg>`,
        open: 'sketchbook'
    },
    {
        id: 'lipstick', name: 'westman atelier, glögg', zip: 'makeup', l: 62.5, t: 86, w: 3.8, r: 16,
        art: `<svg viewBox="0 0 70 150"><rect x="9" y="66" width="52" height="80" rx="6" fill="#F7F7F5" ${S}/><path d="M16 74 v64" stroke="#E2E2DF" stroke-width="4" stroke-linecap="round"/><rect x="13" y="58" width="44" height="11" rx="4" fill="#EEEEEB" ${S} stroke-width="2.5"/><rect x="19" y="36" width="32" height="24" rx="3" fill="#F7F7F5" ${S} stroke-width="2.5"/><path d="M22 37 V14 C22 5 31 3 35 8 L48 24 V37Z" fill="#8E2A24" ${S} stroke-width="2.5"/><path d="M26 16 q3 -6 7 -6" fill="none" stroke="#C45A4E" stroke-width="2.5" stroke-linecap="round"/><text x="35" y="118" text-anchor="middle" font-family="Instrument Sans" font-size="6" fill="#A9A9A6" transform="rotate(-90 35 106)" letter-spacing="1.4">WESTMAN ATELIER</text></svg>`,
        open: 'makeup'
    },
    {
        id: 'blush', name: 'westman atelier baby cheeks, mimi', zip: 'makeup', l: 0, t: 0, w: 4, r: 0,
        art: `<svg viewBox="0 0 80 200"><rect x="12" y="84" width="56" height="110" rx="6" fill="#E3DFD8" ${S}/><text x="40" y="160" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#B9B3AA" transform="rotate(-90 40 140)" letter-spacing="1.6">WESTMAN ATELIER</text><rect x="14" y="76" width="52" height="9" fill="#D9A441" ${S} stroke-width="2"/><path d="M18 38 H62 V77 H18Z" fill="#C9CDD3" ${S}/><path d="M28 40 V75" stroke="#fff" stroke-width="5" opacity=".7"/><path d="M48 40 V75" stroke="#8A9099" stroke-width="2" opacity=".5"/><path d="M22 38 V22 C22 12 58 12 58 22 V38Z" fill="#C9908C" ${S}/><ellipse cx="40" cy="18" rx="15" ry="5" fill="#D7A3A0" opacity=".7"/></svg>`,
        open: 'makeup'
    },
    {
        id: 'concealer', name: 'hourglass vanish concealer', zip: 'makeup', l: 0, t: 0, w: 3, r: 0,
        art: `<svg viewBox="0 0 60 210"><rect x="14" y="4" width="32" height="62" rx="4" fill="#8A5650" ${S}/><path d="M20 10 V60" stroke="#B88078" stroke-width="4" opacity=".7"/><rect x="14" y="64" width="32" height="140" rx="5" fill="#F4F2F0" ${S}/><rect x="19" y="70" width="22" height="128" rx="3" fill="#E6C3A3"/><path d="M23 76 V192" stroke="#fff" stroke-width="3" opacity=".5"/><text x="30" y="180" text-anchor="middle" font-family="Instrument Sans" font-weight="600" font-size="8" fill="#B88A6A" transform="rotate(-90 30 160)" letter-spacing="1.5">HOURGLASS</text></svg>`,
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
        id: 'wallet', name: 'my wallet', zip: 'front', l: 79.0, t: 36.2, w: 9.7, r: -6,
        art: `<svg viewBox="0 0 100 160"><defs><pattern id="mono" width="44" height="44" patternTransform="scale(.5)" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#4E3424"/><g fill="#C29A5B"><text x="3" y="17" font-family="Georgia, serif" font-size="13" font-style="italic">L</text><text x="7.5" y="17" font-family="Georgia, serif" font-size="13">V</text><path d="M33 4 l2.2 4.4 4.4 2.2 -4.4 2.2 -2.2 4.4 -2.2 -4.4 -4.4 -2.2 4.4 -2.2z"/><circle cx="11" cy="33" r="6" fill="none" stroke="#C29A5B" stroke-width="1.2"/><path d="M11 29 a2 2 0 0 1 0 4 a2 2 0 0 1 0 -4z M7 33 a2 2 0 0 1 4 0 a2 2 0 0 1 -4 0z M11 37 a2 2 0 0 1 0 -4 a2 2 0 0 1 0 4z M15 33 a2 2 0 0 1 -4 0 a2 2 0 0 1 4 0z"/><path d="M33 26 c3 0 5 2 5 7 c-5 0 -5 0 -5 0 c0 0 0 0 0 -7z M33 26 c-3 0 -5 2 -5 7 c5 0 5 0 5 0z M33 40 c3 0 5 -2 5 -7 c-5 0 -5 0 -5 0z M33 40 c-3 0 -5 -2 -5 -7 c5 0 5 0 5 0z"/><circle cx="33" cy="33" r="1.2" fill="#4E3424"/></g></pattern></defs>
            <path d="M84 150 q2 6 -1 10" stroke="#B3263E" stroke-width="4" fill="none" stroke-linecap="round"/>
            <rect x="4" y="4" width="92" height="146" rx="5" fill="url(#mono)" ${S}/>
            <path d="M5 8 v138" stroke="#2E1E14" stroke-width="2" opacity=".5"/>
            <path d="M96 5 H54 L32 76 L56 149 H96 Z" fill="url(#mono)" ${S}/>
            <path d="M93 9 H56 L35 76 L58 145 H93" fill="none" stroke="#3A2626" stroke-width="1" opacity=".35" stroke-dasharray="2 2"/>
            <circle cx="41" cy="76" r="6" fill="#E3B754" ${S} stroke-width="2"/><circle cx="39.5" cy="74.5" r="1.8" fill="#FFF3C8"/></svg>`,
        open: 'wallet'
    },
    {
        id: 'pouch', name: 'my mildliner pouch', zip: 'main', l: 75.2, t: 62.9, w: 8.5, r: -8,
        art: `<svg viewBox="0 0 130 170"><g>${['#F7E06B', '#B9A3E8', '#F29B6B', '#F4A7B9', '#8FD19E', '#8CC4F0', '#E8A1C4', '#F2C572', '#9ED3C3'].map((c, i) => `<g transform="rotate(${(i - 4) * 6.5} 65 120)"><rect x="58" y="10" width="14" height="110" rx="4" fill="#FFFDF9" ${S} stroke-width="2"/><rect x="58" y="4" width="14" height="18" rx="4" fill="${c}" ${S} stroke-width="2"/></g>`).join('')}</g><path d="M14 74 C14 64 116 64 116 74 L110 158 C108 166 22 166 20 158Z" fill="#F7F4F1" ${S}/><path d="M14 74 C40 84 90 84 116 74" fill="none" stroke="#F4A7B9" stroke-width="5" stroke-linecap="round"/><path d="M14 74 C40 84 90 84 116 74" fill="none" ${S} stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="42" cy="122" r="11" fill="#8E2D6E" ${S} stroke-width="2"/><circle cx="38" cy="119" r="1.6" fill="#fff"/><circle cx="46" cy="119" r="1.6" fill="#fff"/><path d="M37 125 q5 5 10 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M112 78 l6 10" ${S} stroke-width="2"/><rect x="113" y="86" width="8" height="12" rx="3" fill="#F4A7B9" ${S} stroke-width="2"/></svg>`,
        open: 'mildliners'
    },
    {
        id: 'penpouch', name: 'my paper mate pouch', zip: 'main', l: 89.3, t: 61.5, w: 19.7, r: 4,
        art: `<svg viewBox="0 0 230 110"><g>${['#E63F7A', '#7B4FD1', '#1F6FD1', '#18A39A', '#F0592B', '#D6336C', '#9B59D0', '#2E86DE'].map((c, i) => `<rect x="${30 + i * 16}" y="${4 + (i % 3) * 5}" width="12" height="40" rx="5" fill="${c}" ${S} stroke-width="2"/>`).join('')}</g><g>${['#7FC6E8', '#F4A7B9', '#B9A3E8'].map((c, i) => `<g transform="rotate(${-14 + i * 7} ${170 + i * 12} 40)"><rect x="${166 + i * 12}" y="2" width="8" height="44" rx="3" fill="${c}" fill-opacity=".55" ${S} stroke-width="1.8"/><rect x="${166 + i * 12}" y="-4" width="8" height="8" rx="2" fill="#FFFDF9" ${S} stroke-width="1.8"/></g>`).join('')}</g><rect x="10" y="30" width="210" height="74" rx="18" fill="#F6CFD6" ${S}/><path d="M160 30 C190 30 214 40 220 60 L220 44 C220 36 214 30 206 30Z" fill="#F8E7A9" opacity=".9"/><path d="M150 32 q30 10 70 32" fill="none" stroke="#F8E7A9" stroke-width="10" stroke-linecap="round" opacity=".8"/><path d="M26 44 H204" ${S} stroke-dasharray="5 5"/><rect x="150" y="76" width="48" height="16" rx="2" fill="#FFFBF2" ${S} stroke-width="1.5"/><text x="174" y="87" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="${INK}" letter-spacing=".5">CICIMELON</text><circle cx="212" cy="46" r="5" fill="#C9CCD2" ${S} stroke-width="1.5"/></svg>`,
        open: 'gelpens'

    },
    {
        id: 'sunglasses', name: 'my sunglasses', zip: 'shades', l: 84.6, t: 3.8, w: 13.2, r: -6,
        art: `<svg viewBox="0 0 240 110"><defs><linearGradient id="lens" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2226"/><stop offset="1" stop-color="#9C979C"/></linearGradient></defs><path d="M8 26 L-2 12" ${S} stroke-width="6"/><path d="M232 26 L242 12" ${S} stroke-width="6"/><rect x="8" y="20" width="96" height="74" rx="16" fill="#1E1414" ${S}/><rect x="136" y="20" width="96" height="74" rx="16" fill="#1E1414" ${S}/><rect x="18" y="30" width="76" height="54" rx="10" fill="url(#lens)"/><rect x="146" y="30" width="76" height="54" rx="10" fill="url(#lens)"/><path d="M104 40 Q120 28 136 40" fill="none" ${S} stroke-width="8"/><path d="M104 40 Q120 28 136 40" fill="none" stroke="#1E1414" stroke-width="4"/><rect x="4" y="22" width="8" height="30" rx="2" fill="#D9A441" ${S} stroke-width="2"/><rect x="228" y="22" width="8" height="30" rx="2" fill="#D9A441" ${S} stroke-width="2"/><path d="M26 38 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="M154 38 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg>`,
        open: 'sunglasses'
    },
    {
        id: 'keys', name: 'my keys', zip: 'shades', l: 93.0, t: 14.4, w: 10.3, r: 4,
        get art() { return window.KEYRING(false); },
        open: 'keys'
    },
    {
        id: 'mirror', name: 'my chanel mirror (the blair waldorf one)', zip: 'front', l: 24.4, t: 55.4, w: 7.0, r: 0,
        art: `<svg viewBox="0 0 120 120"><rect x="8" y="8" width="104" height="104" rx="22" fill="#141011" ${S}/><rect x="16" y="16" width="88" height="88" rx="16" fill="none" stroke="#3A3033" stroke-width="2"/><circle cx="60" cy="60" r="15" fill="none" stroke="#E9E4DF" stroke-width="4"/><circle cx="60" cy="60" r="7" fill="#141011"/><path d="M26 30 q12 -10 30 -8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".3"/></svg>`,
        open: 'mirror'
    },
    {
        id: 'makeup-pouch', name: 'my victoria’s secret makeup pouch', zip: 'front', l: 86.5, t: 49.9, w: 20.7, r: -4,
        art: `<svg viewBox="0 0 200 130"><defs><pattern id="vs" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(0)"><rect width="16" height="16" fill="#F7C9D6"/><rect width="8" height="16" fill="#F29BB6"/></pattern></defs><path d="M14 40 C14 22 186 22 186 40 L178 116 C176 124 24 124 22 116Z" fill="url(#vs)" ${S}/><path d="M22 40 H178" ${S} stroke-dasharray="5 5"/><rect x="164" y="30" width="18" height="16" rx="4" fill="#D9A441" ${S} stroke-width="2.5"/><path d="M173 46 v16" ${S} stroke-width="2.5"/><circle cx="173" cy="66" r="5" fill="#fff" ${S} stroke-width="2"/><rect x="40" y="4" width="10" height="42" rx="3" fill="#E8EFF6" ${S} stroke-width="2" transform="rotate(-8 45 25)"/><path d="M68 44 V14 q8 -14 16 0 V44Z" fill="#3A2626" ${S} stroke-width="2"/><circle cx="76" cy="10" r="9" fill="#F2D7C8" ${S} stroke-width="2"/></svg>`,
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
            <rect x="8" y="98" width="48" height="136" rx="7" fill="url(#bowprint)" ${S}/>
            <path d="M24 46 h16 L56 100 H8 Z" fill="#F6D0DB" ${S} stroke-linejoin="round"/>
            <rect x="23" y="30" width="18" height="18" rx="3" fill="#F6D0DB" ${S}/>
            <rect x="22" y="24" width="20" height="7" fill="#D9A441" ${S} stroke-width="2"/>
            <rect x="21" y="6" width="22" height="19" rx="5" fill="#F6D0DB" ${S}/>
            <path d="M14 108 v110" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>
            <path d="M30 56 l-7 34" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
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
        id: 'notebooks', name: 'my erin condren notebooks', zip: 'main', l: 29.1, t: 86.8, w: 24.3, r: -6,
        get art() {
            const nb1 = window.EC([['#5B83C0', '#F4E6EE'], ['#FBEFF3', '#D64F8C'], ['#D44E8C', '#F4C9DA'], ['#FBEFF3', '#5B83C0']]);
            const nb2 = window.EC([['#E0568F', '#F7D5E2'], ['#FBE6EC', '#8DA0C2'], ['#8EA2C4', '#EEF1F8'], ['#FBE6EC', '#E0568F']]);
            const nest = (svg, x, y) => svg.replace('<svg viewBox="0 0 170 220" aria-hidden="true">', `<svg x="${x}" y="${y}" width="170" height="220" viewBox="0 0 170 220">`);
            return `<svg viewBox="0 0 262 262" aria-hidden="true"><g transform="rotate(-3 85 110)">${nest(nb1, 0, 6)}</g><g transform="rotate(4 170 150)">${nest(nb2, 84, 36)}</g></svg>`;
        },
        open: 'notebooks'
    },
    {
        id: 'romcom', name: 'you deserve each other (unread)', zip: 'main', l: 9.4, t: 58.8, w: 13.6, r: -7,
        art: `<svg viewBox="0 0 110 160"><rect x="3" y="3" width="104" height="154" rx="3" fill="#A51F52" ${S}/>
            <g font-family="Instrument Sans" fill="#FBE9EE"><text x="9" y="11" font-size="3.4">“The perfect dose of</text><text x="9" y="15.5" font-size="3.4">sweet, hilarious joy.”</text><text x="13" y="20" font-size="2.6" letter-spacing=".3">—CHRISTINA LAUREN</text></g>
            <rect x="60" y="5" width="9" height="28" fill="#FBF6F0" stroke="#3A2626" stroke-width="1"/><rect x="95" y="5" width="9" height="28" fill="#FBF6F0" stroke="#3A2626" stroke-width="1"/>
            <path d="M61 9 h7 M61 13 h7 M61 17 h7 M61 21 h7 M61 25 h7 M61 29 h7 M96 9 h7 M96 13 h7 M96 17 h7 M96 21 h7 M96 25 h7 M96 29 h7" stroke="#D9CFC4" stroke-width=".8"/>
            <rect x="69" y="5" width="26" height="28" fill="#F3DCCF" stroke="#3A2626" stroke-width="1.2"/>
            <path d="M75 30 C75 14 89 12 89 26 L89 31 Z" fill="#6B3A1E"/><circle cx="82" cy="17" r="4.2" fill="#EDBFA4"/><path d="M77.6 16 q4.4 -6 8.8 0" fill="#6B3A1E"/>
            <path d="M75 33 C75 24 89 24 89 33Z" fill="#3D47A0"/><path d="M76 27 C70 30 64 32 58 33" stroke="#3D47A0" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="57.5" cy="33.2" r="1.6" fill="#EDBFA4"/>
            <rect x="66" y="32" width="32" height="2.6" fill="#FBF6F0" stroke="#3A2626" stroke-width=".8"/>
            <g transform="translate(50 42) rotate(-20)"><path d="M0 0 l6 -10 M3 0 l7 -8 M-2 -1 l2 -11" stroke="#3E7D4C" stroke-width="1.1"/><circle cx="0" cy="-12" r="2.4" fill="#fff"/><circle cx="6" cy="-11" r="2.6" fill="#fff"/><circle cx="10" cy="-8" r="2.2" fill="#fff"/><circle cx="3" cy="-14" r="2" fill="#F7EDEF"/><path d="M4 -4 q3 -3 6 -1 M-1 -5 q-3 -2 -4 1" fill="#6FAF7C"/><path d="M-1 1 h6 l-1 3 h-4z" fill="#F7EDEF"/></g>
            <text x="12" y="62" font-family="Instrument Sans" font-size="5" fill="#FBE9EE">a novel</text>
            <g font-family="Kalam, Caveat, cursive" font-weight="700" text-anchor="middle" stroke="#BFE6D6" stroke-width=".6" paint-order="stroke">
                <text x="60" y="74" font-size="17" fill="#F7F2EA">YOU</text><text x="62" y="92" font-size="16.5" fill="#F7F2EA">DESERVE</text>
                <text x="67" y="110" font-size="17" fill="#BFE6D6" stroke="none">EACH</text><text x="67" y="128" font-size="17" fill="#F7F2EA">OTHER</text></g>
            <g><circle cx="20" cy="100" r="5" fill="#EDBFA4"/><path d="M14.8 99 q5.2 -8 10.4 0 q-2 -3 -5.2 -3 q-3 0 -5.2 3z" fill="#4A2A1A"/><circle cx="18" cy="100.5" r="1.6" fill="none" stroke="#3A2626" stroke-width=".6"/><circle cx="22.4" cy="100.5" r="1.6" fill="none" stroke="#3A2626" stroke-width=".6"/>
                <path d="M11 109 Q20 104 29 109 L31 132 H9Z" fill="#2E3466"/><path d="M17 107 L20 116 L23 107Z" fill="#F7F2EA"/><rect x="10" y="114" width="20" height="5" rx="2.5" fill="#262B58" stroke="#1C2048" stroke-width=".6"/><circle cx="11" cy="116.5" r="1.4" fill="#EDBFA4"/><circle cx="29" cy="116.5" r="1.4" fill="#EDBFA4"/>
                <path d="M11 132 h8.5 v18 h-7.5z M20.5 132 h8.5 l-1 18 h-7.5z" fill="#7A4A2E"/><path d="M11 150 h8 v2 h-9z M20.5 150 h8 l.5 2 h-9z" fill="#2A1C17"/></g>
            <text x="72" y="143" text-anchor="middle" font-family="Instrument Sans" font-weight="600" font-size="11" fill="#BFE6D6">Sarah Hogle</text>
            <text x="72" y="150" text-anchor="middle" font-family="Instrument Sans" font-size="3" letter-spacing=".4" fill="#FBE9EE">AUTHOR OF TWICE SHY</text></svg>`,
        open: 'romcom'
    },
    {
        id: 'scrunchies', name: 'my silk scrunchies', zip: 'front', l: 34.3, t: 21.2, w: 16.9, r: 0,
        get art() { return `<svg viewBox="0 0 150 90">${window.SCRUNCHIE(48, 46, 25, ...window.SCR_BROWN)}${window.SCRUNCHIE(102, 42, 25, ...window.SCR_PINK)}</svg>`; },
        open: 'hairpony'
    },
    {
        id: 'comb', name: 'my wide-tooth comb', zip: 'front', l: 54.5, t: 20.5, w: 16.9, r: -10,
        art: `<svg viewBox="0 0 210 80"><defs><linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A7450"/><stop offset=".5" stop-color="#6E5A3A"/><stop offset="1" stop-color="#5A4A30"/></linearGradient></defs>
            <g><path d="M16 28.1 q1 18 -2 29.9" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M24 28.6 q1 18 -2 29.5" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M32 29.1 q1 18 -2 29.1" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M40 29.6 q1 18 -2 28.7" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M48 30.0 q1 18 -2 28.3" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M56 30.5 q1 18 -2 27.9" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M64 31.0 q1 18 -2 27.5" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M72 31.5 q1 18 -2 27.1" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M80 32.0 q1 18 -2 26.7" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M88 32.4 q1 18 -2 26.3" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M96 32.9 q1 18 -2 25.9" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M104 33.4 q1 18 -2 25.5" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M112 33.9 q1 18 -2 25.1" stroke="#7A6440" stroke-width="5.5" stroke-linecap="round" fill="none"/></g>
            <path d="M6 30 C4 14 30 8 60 8 C100 8 128 14 150 24 C168 32 176 30 196 26 C206 24 208 38 198 42 C178 48 168 46 150 40 C132 34 120 36 112 40 L112 44 H14 C8 42 6 36 6 30Z" fill="url(#wood)" ${S} stroke-width="2.5"/>
            <path d="M20 18 C60 12 110 14 146 26 M124 36 C150 30 170 40 196 32" fill="none" stroke="#A48C64" stroke-width="1.4" opacity=".7"/>
            <path d="M30 13 q40 -5 80 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".18"/></svg>`,
        open: 'haircomb'
    },
    {
        id: 'cap', name: 'my pink ny cap', zip: 'main', l: 13.2, t: 25.3, w: 24.4, r: -6,
        art: `<svg viewBox="0 0 180 128"><defs><linearGradient id="capg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F7D3D4"/><stop offset=".6" stop-color="#F2C2C4"/><stop offset="1" stop-color="#E9AFB2"/></linearGradient></defs>
            <path d="M42 80 C34 42 64 14 104 15 C142 16 168 40 167 76 C150 71 122 67 94 67 C72 67 54 72 42 80Z" fill="url(#capg)" ${S}/>
            <path d="M104 16 C98 34 94 50 93 67 M104 16 C126 26 140 46 146 70 M104 16 C80 22 60 38 50 62" fill="none" stroke="#DFA2A6" stroke-width="1.8"/>
            <circle cx="104" cy="16" r="4" fill="#F2C2C4" stroke="#3A2626" stroke-width="2"/><circle cx="74" cy="34" r="1.4" fill="#C98E92"/><circle cx="128" cy="30" r="1.4" fill="#C98E92"/>
            <g transform="translate(76 56) rotate(-6)" font-family="Bodoni Moda, Georgia, serif" font-weight="700" font-style="italic" font-size="34"><g fill="#D99A9F" transform="translate(1.2 1.6)"><text x="0" y="0">N</text><text x="15" y="5">Y</text></g><g fill="#FFF8EE" stroke="#CDB39E" stroke-width=".9"><text x="0" y="0">N</text><text x="15" y="5">Y</text></g></g>
            <text x="156" y="66" font-family="Instrument Sans" font-weight="700" font-size="7" fill="#FBF3EA" transform="rotate(-8 156 66)">47</text>
            <path d="M42 80 C62 70 112 66 152 75 C146 96 112 112 74 115 C46 117 22 112 12 106 C18 96 30 86 42 80Z" fill="#F4C9CB" ${S}/>
            <path d="M24 102 C44 92 96 82 142 80 M30 107 C52 97 100 88 138 86 M36 111 C58 102 102 94 132 92" fill="none" stroke="#E2A9AD" stroke-width="1.1" stroke-dasharray="3 2.5"/>
            <path d="M56 26 q20 -12 46 -10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/></svg>`,
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
        id: 'boarding', name: 'my boarding pass', zip: 'front', l: 50.8, t: 28.7, w: 18.8, r: 4,
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
        id: 'binder', name: 'my pink binder', zip: 'main', l: 14.5, t: 83.4, w: 29.1, r: -6,
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
        id: 'phone', name: 'my iphone', zip: 'shades', l: 82.2, t: 15.7, w: 7.7, r: -8,
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
        id: 'passport', name: 'my passport', zip: 'front', l: 91.2, t: 36.2, w: 9.3, r: 7,
        art: `<svg viewBox="0 0 110 150"><rect x="6" y="4" width="98" height="142" rx="7" fill="#1E2A4A" ${S}/>
            <g fill="#D9B45A" font-family="Bodoni Moda" text-anchor="middle">
                <text x="55" y="26" font-size="13" font-weight="600" letter-spacing="1.2">PASSPORT</text>
                <text x="55" y="106" font-size="8.5" font-style="italic">United States</text>
                <text x="55" y="117" font-size="8.5" font-style="italic">of America</text>
            </g>
            <g fill="none" stroke="#D9B45A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="55" cy="44" r="6"/>
                <path d="M55 52 v32 M47 58 h16 v14 q-8 8 -16 0z"/>
                <path d="M47 60 C38 56 32 50 28 58 C34 60 38 64 46 66 M63 60 C72 56 78 50 82 58 C76 60 72 64 64 66"/>
                <path d="M36 82 q-6 -4 -8 -10 M74 82 q6 -4 8 -10"/>
            </g>
            <rect x="47" y="128" width="16" height="9" rx="1.5" fill="none" stroke="#D9B45A" stroke-width="1.4"/><path d="M50 132.5 h10 M55 128 v9" stroke="#D9B45A" stroke-width="1"/>
        </svg>`,
        open: 'passport'
    },
    {
        id: 'laptop', name: 'my macbook pro', zip: 'devices', l: 16.0, t: 8.9, w: 29.4, r: -3,
        get art() { return window.LID(false); },
        open: 'laptop'
    }
];


/* the stickers on my laptop, where they actually are. Each one opens something. */
window.STICKERS = [
    { id: 'music', label: 'the music heart → Listening History', x: 262, y: 44, go: 'headphones',
      svg: `<path d="M0 22 C-34 0 -30 -26 -12 -26 C-4 -26 0 -18 0 -14 C0 -18 4 -26 12 -26 C30 -26 34 0 0 22Z" fill="#F6F1E6" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M0 22 C-34 0 -30 -26 -12 -26 C-4 -26 0 -18 0 -14 C0 -18 4 -26 12 -26 C30 -26 34 0 0 22Z" fill="#F6F1E6" ${S} stroke-width="1.6"/><circle cx="-14" cy="-12" r="4" fill="none" ${S} stroke-width="1.4"/><circle cx="10" cy="-10" r="3" fill="${INK}"/><path d="M-6 2 l3 -8 3 8 M-18 2 h6 M6 4 l6 -4" ${S} stroke-width="1.4" fill="none"/><text x="2" y="12" font-size="6" font-family="JetBrains Mono" fill="${INK}">13</text>` },
    { id: 'books', label: 'the pink books → my children’s book', x: 262, y: 166, go: 'book',
      svg: `<g stroke="#fff" stroke-width="7" stroke-linejoin="round"><rect x="-26" y="-20" width="52" height="40" rx="3" fill="#E75D8A"/></g><rect x="-26" y="-20" width="16" height="40" rx="2" fill="#E75D8A" ${S} stroke-width="1.6"/><rect x="-10" y="-20" width="18" height="40" rx="2" fill="#F08DAA" ${S} stroke-width="1.6"/><rect x="8" y="-20" width="18" height="40" rx="2" fill="#D9486F" ${S} stroke-width="1.6"/><path d="M-30 -2 q-8 -10 0 -12 q6 0 8 8 q2 -8 8 -8 q8 2 0 12 z" fill="#F7B7C8" ${S} stroke-width="1.4"/>` },
    { id: 'cowgirl', label: 'the cowgirl hat & boot → Owala Austin Marathon', x: 212, y: 104, go: 'owala',
      svg: `<ellipse cx="-4" cy="-8" rx="30" ry="9" fill="#E07A5F" stroke="#fff" stroke-width="7"/><ellipse cx="-4" cy="-8" rx="30" ry="9" fill="#E07A5F" ${S} stroke-width="1.6"/><path d="M-18 -10 C-16 -30 10 -30 12 -10Z" fill="#E88B70" ${S} stroke-width="1.6"/><path d="M-2 0 v22 h24 q4 -8 -6 -10 v-12z" fill="#F7C9D0" ${S} stroke-width="1.6"/><path d="M2 6 q6 4 10 0 M2 12 q6 4 10 0" fill="none" stroke="#6C8BD6" stroke-width="1.6"/>` },
    { id: 'texas', label: '“tradition starts here” → my coursework', x: 188, y: 44, href: 'https://suhanitiwari.com/home/study#coursework',
      svg: `<path d="M-24 -26 h14 v14 h20 l6 6 h8 l4 10 -8 12 -8 4 -6 12 -8 -8 -4 -8 -10 -6 -8 -12z" fill="#FFF7F0" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M-24 -26 h14 v14 h20 l6 6 h8 l4 10 -8 12 -8 4 -6 12 -8 -8 -4 -8 -10 -6 -8 -12z" fill="#FFF7F0" stroke="#D9713A" stroke-width="2.2" stroke-linejoin="round"/><text x="-2" y="-2" text-anchor="middle" font-family="Caveat" font-size="8" fill="#D9713A">tradition</text><text x="-2" y="7" text-anchor="middle" font-family="Caveat" font-size="8" fill="#D9713A">starts here</text>` },
    { id: 'cupcake', label: 'the Mozart’s cupcake → Starbucks app', x: 196, y: 166, go: 'starbucks',
      svg: `<rect x="-28" y="-26" width="56" height="52" rx="12" fill="#E7C6F2" stroke="#fff" stroke-width="7"/><path d="M-12 4 h24 l-4 18 h-16z" fill="#B7A3E8" ${S} stroke-width="1.6"/><path d="M-16 4 C-18 -12 18 -12 16 4Z" fill="#FFF8EE" ${S} stroke-width="1.6"/><circle cx="0" cy="-14" r="4" fill="#D23B3B" ${S} stroke-width="1.4"/><g fill="#F4A7B9"><circle cx="-6" cy="-2" r="1.2"/><circle cx="6" cy="-4" r="1.2"/><circle cx="2" cy="0" r="1.2"/></g>` },
    { id: 'flower', label: '“just as you are” → my sketchbook', x: 118, y: 40, go: 'sketchbook',
      svg: `<g fill="#A9C3A0" stroke="#fff" stroke-width="7">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="0" cy="-15" rx="10" ry="13" transform="rotate(${a})"/>`).join('')}</g><g fill="#A9C3A0" ${S} stroke-width="1.4">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="0" cy="-15" rx="10" ry="13" transform="rotate(${a})"/>`).join('')}</g><circle r="11" fill="#F2B27A" ${S} stroke-width="1.4"/><text y="2" text-anchor="middle" font-family="Caveat" font-size="6" fill="${INK}">just as you are</text><circle cx="-10" cy="12" r="3.5" fill="#E75D8A"/>` },
    { id: 'latte', label: '“love you a latte” → Saturday in Austin', x: 44, y: 40, go: 'saturday',
      svg: `<circle r="26" fill="#FFFDF8" stroke="#fff" stroke-width="7"/><circle r="26" fill="#FFFDF8" ${S} stroke-width="1.6"/><circle r="17" fill="#D79B62" ${S} stroke-width="1.4"/><path d="M0 10 C-12 2 -10 -10 -3 -9 C0 -8 0 -5 0 -3 C0 -5 0 -8 3 -9 C10 -10 12 2 0 10Z" fill="#FFF3E2"/><path d="M22 -10 q10 0 10 8 q0 8 -10 8" fill="none" ${S} stroke-width="2"/><text y="34" text-anchor="middle" font-family="Caveat" font-size="7" fill="${INK}">love you a latte</text>` }
];

window.LID = (big) => `<svg viewBox="0 0 300 210" ${big ? 'class="lid-big"' : ''} aria-hidden="${big ? 'false' : 'true'}">
    <defs><linearGradient id="brushed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#9DA2A9" stop-opacity=".35"/></linearGradient></defs>
    <rect x="3" y="3" width="294" height="204" rx="14" fill="#D4D7DB" ${S}/>
    <rect x="3" y="3" width="294" height="204" rx="14" fill="url(#brushed)" opacity=".5"/>
    <path d="M128 92 c-8 0 -13 6 -12 14 c1 10 7 17 12 17 c3 0 4 -2 7 -2 c3 0 4 2 7 2 c5 0 11 -7 12 -17 c1 -8 -4 -14 -12 -14 c-3 0 -5 2 -7 2 c-2 0 -4 -2 -7 -2z M136 88 c1 -5 5 -8 9 -8 c-1 5 -5 8 -9 8z" fill="#1E1A1C"/>
    ${window.STICKERS.map(k => big
        ? `<g class="stk" tabindex="0" role="button" aria-label="${k.label}" data-sticker="${k.id}" transform="translate(${k.x} ${k.y}) scale(1.2)"><g class="stk-in">${k.svg}</g></g>`
        : `<g transform="translate(${k.x} ${k.y}) scale(1.2)">${k.svg}</g>`).join('')}
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
window.KEYRING = big => `<svg viewBox="0 0 176 252" class="keyring${big ? ' big' : ''}">
    <circle cx="86" cy="26" r="20" fill="none" stroke="#B9BCC2" stroke-width="6"/><circle cx="86" cy="26" r="20" fill="none" stroke="#3A2626" stroke-width="1.5"/>
    <g data-part="apartment" class="kpart"><circle cx="66" cy="50" r="9" fill="none" stroke="#B9BCC2" stroke-width="4"/><circle cx="66" cy="50" r="9" fill="none" stroke="#3A2626" stroke-width="1.2"/>
        <g transform="translate(38 50) rotate(6 24 33)">${window.SALTO_FOB.replace('<svg viewBox="0 0 48 66">', '<svg width="52" height="72" viewBox="0 0 48 66">')}</g></g>
    <g data-part="bmw" class="kpart"><circle cx="96" cy="50" r="9" fill="none" stroke="#B9BCC2" stroke-width="4"/><circle cx="96" cy="50" r="9" fill="none" stroke="#3A2626" stroke-width="1.2"/>
        <g transform="translate(66 58)">${window.BMW_FOB.replace('<svg viewBox="0 -8 80 158">', '<svg width="70" height="138" viewBox="0 -8 80 158" overflow="visible">')}</g></g>
    <g data-part="mailbox" class="kpart"><circle cx="118" cy="44" r="7" fill="none" stroke="#B9BCC2" stroke-width="3.5"/><circle cx="118" cy="44" r="7" fill="none" stroke="#3A2626" stroke-width="1"/>
        <g transform="translate(118 48) rotate(-14)"><svg width="20" height="52" viewBox="0 0 20 52"><path d="M3 3 h14 a2 2 0 0 1 2 2 v13 a8 8 0 0 1 -18 0 v-13 a2 2 0 0 1 2 -2z" fill="#D6D9DE" stroke="#3A2626" stroke-width="1.8"/><circle cx="10" cy="8" r="2.6" fill="#FAF1EF" stroke="#7C8189" stroke-width="1"/><path d="M7 24 h6 v22 l-3 4 -3 -4z" fill="#C9CDD3" stroke="#3A2626" stroke-width="1.6"/><path d="M13 30 h-3 M13 35 h-2 M13 40 h-3" stroke="#3A2626" stroke-width="1.4"/></svg></g><g transform="translate(130 44) rotate(12)"><svg width="20" height="52" viewBox="0 0 20 52"><path d="M3 3 h14 a2 2 0 0 1 2 2 v13 a8 8 0 0 1 -18 0 v-13 a2 2 0 0 1 2 -2z" fill="#D6D9DE" stroke="#3A2626" stroke-width="1.8"/><circle cx="10" cy="8" r="2.6" fill="#FAF1EF" stroke="#7C8189" stroke-width="1"/><path d="M7 24 h6 v22 l-3 4 -3 -4z" fill="#C9CDD3" stroke="#3A2626" stroke-width="1.6"/><path d="M13 30 h-3 M13 35 h-2 M13 40 h-3" stroke="#3A2626" stroke-width="1.4"/></svg></g></g>
</svg>`;

/* my wallet: student ID, driver license, and my cards. Cards pop out like file folders. */
window.CARDS = [
    { kind: 'id', title: 'UT Austin student ID', big: 'Suhani Tiwari', sub: 'Management Information Systems + Psychology', metric: 'McCombs School of Business · Class of 2027 · 3.5 GPA', body: 'BBA in MIS and a BA in Psychology, with minors in Marketing and Educational Psychology. Two McCombs scholarships this year.' },
    { kind: 'dl', title: 'Driver license', big: 'Suhani Tiwari', metric: 'Class: C (for cute)<br>Endorsements: none, yet', body: 'Height: 5′6″.<br>Weight: don’t ask.<br>Eyes: dreamy.<br>Hair: dark, long, and always done.<br>Address: wouldn’t you wanna knowwww.<br>DOB: a lady never tells.<br>Driving skill: see my car keys.' },
    { kind: 'bofa', title: 'Bank of America credit card', big: 'Recent transactions', metric: 'Westman Atelier · Lancôme · Staples · Target · Bath & Body Works', body: 'Glögg (obviously). Lash Idôle. A 25-pack of Mildliners. InkJoy gel pens. One more Cozy Vanilla Almond PocketBac. Everything in this bag, basically.' },
    { kind: 'bofadebit', title: 'Bank of America debit card', big: 'Balance', metric: 'Balance: none of your business', body: 'The red one. For when the credit cards need a break.' },
    { kind: 'amexgold', title: 'Amex Delta SkyMiles Gold', big: 'Where the miles went', metric: 'Thailand + Malaysia 2010 · Switzerland, France, Italy 2016 · Mexico 2020', body: 'The stamps are in my passport.', go: 'passport' },
    { kind: 'amexblue', title: 'Amex Blue Cash Everyday', big: 'The everyday card', metric: 'Coffee runs · Target trips · gas for the car the curb keeps attacking', body: 'Not pictured: the receipts.' }
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
    { name: 'Starbucks app', tag: 'Product strategy', c: '#D9C8F0', img: 'assets/img/starbucks.jpg', href: 'https://suhanitiwari.com/home/study#marketing' },
    { name: 'Girls Can Be Engineers, Too!', tag: '#1 New Release', c: '#F2C6C8', img: 'assets/img/book.jpg', href: 'https://suhanitiwari.com/home/beyondtheclassroom' }
];

/* my sketchbook */
window.ART = [
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
