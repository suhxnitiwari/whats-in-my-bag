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
        { id: 'front', label: 'wallet & passport', d: 'M80 196 C84 176 216 176 220 196' }
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

window.ITEMS = [
    {
        id: 'headphones', name: 'my airpods max', zip: 'devices', l: 67.7, t: 8.2, w: 16.0, r: -8,
        art: `<svg viewBox="0 0 220 200"><defs>
            <pattern id="mesh" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#EFE6D6"/><circle cx="2.5" cy="2.5" r=".9" fill="#DDD0B8"/></pattern>
            <linearGradient id="cup" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3EADB"/><stop offset=".55" stop-color="#E2D4BC"/><stop offset="1" stop-color="#CDBB9E"/></linearGradient></defs>
            <path d="M34 110 C34 20 186 20 186 110" fill="none" stroke="#C9CDD3" stroke-width="5" stroke-linecap="round"/>
            <path d="M34 110 C34 20 186 20 186 110" fill="none" stroke="#3A2626" stroke-width="1.4"/>
            <path d="M46 92 C52 40 168 40 174 92" fill="none" stroke="#3A2626" stroke-width="19" stroke-linecap="round"/>
            <path d="M46 92 C52 40 168 40 174 92" fill="none" stroke="url(#mesh)" stroke-width="15" stroke-linecap="round"/>
            <rect x="29" y="104" width="10" height="20" rx="2" fill="#D9DCE0" stroke="#3A2626" stroke-width="1.5"/>
            <rect x="181" y="104" width="10" height="20" rx="2" fill="#D9DCE0" stroke="#3A2626" stroke-width="1.5"/>
            <g transform="rotate(10 36 158)"><rect x="8" y="120" width="56" height="76" rx="22" fill="url(#cup)" ${S}/><rect x="14" y="126" width="44" height="64" rx="17" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/></g>
            <g transform="rotate(-10 184 158)"><rect x="156" y="120" width="56" height="76" rx="22" fill="url(#cup)" ${S}/><rect x="162" y="126" width="44" height="64" rx="17" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/><circle cx="200" cy="128" r="3" fill="#C9CDD3" stroke="#3A2626" stroke-width="1"/></g>
        </svg>`,
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
        art: `<svg viewBox="0 0 100 160"><defs><pattern id="mono" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#4E3424"/><g fill="#B98A4E"><path d="M6 3 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6z"/><path d="M19 16 l1.4 2.6 2.6 1.4 -2.6 1.4 -1.4 2.6 -1.4 -2.6 -2.6 -1.4 2.6 -1.4z"/><circle cx="19" cy="6" r="2.6" fill="none" stroke="#B98A4E" stroke-width="1.1"/><circle cx="6" cy="19" r="1.2"/></g></pattern></defs>
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
        id: 'keys', name: 'my keys', zip: 'shades', l: 94.0, t: 14.4, w: 7.5, r: 4,
        get art() { return window.KEYRING(false); },
        open: 'keys'
    },
    {
        id: 'mirror', name: 'my chanel mirror (the blair waldorf one)', zip: 'main', l: 24.4, t: 55.4, w: 7.0, r: 0,
        art: `<svg viewBox="0 0 120 120"><rect x="8" y="8" width="104" height="104" rx="22" fill="#141011" ${S}/><rect x="16" y="16" width="88" height="88" rx="16" fill="none" stroke="#3A3033" stroke-width="2"/><circle cx="60" cy="60" r="15" fill="none" stroke="#E9E4DF" stroke-width="4"/><circle cx="60" cy="60" r="7" fill="#141011"/><path d="M26 30 q12 -10 30 -8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".3"/></svg>`,
        open: 'mirror'
    },
    {
        id: 'makeup-pouch', name: 'my victoria’s secret makeup pouch', zip: 'main', l: 86.5, t: 49.9, w: 20.7, r: -4,
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
        id: 'notebooks', name: 'my erin condren notebooks', zip: 'main', l: 39.5, t: 80.0, w: 21.1, r: 5,
        get art() { return `<span style="display:grid"><span style="grid-area:1/1; transform:rotate(-9deg) translate(-8%, 2%)">${window.EC(['#C2407A', '#F4C6D2', '#8A9AA6', '#F3EDE3'])}</span><span style="grid-area:1/1; transform:rotate(4deg) translate(4%, -3%)">${window.EC(['#5E7486', '#F3EDE3', '#C2407A', '#F4C6D2'])}</span></span>`; },
        open: 'notebooks'
    },
    {
        id: 'romcom', name: 'you deserve each other (unread)', zip: 'main', l: 9.4, t: 58.8, w: 13.6, r: -7,
        art: `<svg viewBox="0 0 110 160"><rect x="4" y="4" width="102" height="152" rx="3" fill="#A51F52" ${S}/>
            <rect x="64" y="10" width="34" height="26" fill="#F7E4DC" stroke="#3A2626" stroke-width="1.5"/><rect x="58" y="10" width="7" height="26" fill="#FBF4EE" stroke="#3A2626" stroke-width="1.2"/><rect x="97" y="10" width="7" height="26" fill="#FBF4EE" stroke="#3A2626" stroke-width="1.2"/>
            <circle cx="80" cy="20" r="5" fill="#E9B79C"/><path d="M75 19 q5 -9 10 0 v6 h-10z" fill="#7A3B1E"/><path d="M73 36 q7 -8 14 0" fill="#3C3F8F"/><path d="M58 37 h46" stroke="#3A2626" stroke-width="2"/>
            <path d="M44 46 l4 -4 4 3 3 -4 3 5" fill="none" stroke="#F4F0E8" stroke-width="2.4" stroke-linecap="round"/><circle cx="48" cy="44" r="2" fill="#7BB98C"/><circle cx="55" cy="42" r="2" fill="#7BB98C"/>
            <g font-family="Kalam, Caveat, cursive" font-weight="700" text-anchor="middle">
                <text x="18" y="56" font-size="5" fill="#F4F0E8" text-anchor="start" font-family="Instrument Sans" font-weight="400">a novel</text>
                <text x="56" y="70" font-size="17" fill="#F4F0E8">YOU</text>
                <text x="58" y="88" font-size="16" fill="#F4F0E8">DESERVE</text>
                <text x="64" y="106" font-size="17" fill="#BFE6D6">EACH</text>
                <text x="64" y="124" font-size="17" fill="#F4F0E8">OTHER</text>
                <text x="68" y="143" font-size="11" fill="#BFE6D6" font-family="Instrument Sans" font-weight="600">Sarah Hogle</text></g>
            <circle cx="18" cy="104" r="5" fill="#E9B79C"/><path d="M13 103 q5 -7 10 0" fill="#3A2A20"/><path d="M10 112 h16 l1 22 h-18z" fill="#2E3466"/><path d="M12 116 h12" stroke="#F4F0E8" stroke-width="3"/><path d="M12 134 h6 v14 h-6z M19 134 h6 v14 h-6z" fill="#5A3A26"/></svg>`,
        open: 'romcom'
    },
    {
        id: 'scrunchies', name: 'my silk scrunchies', zip: 'main', l: 34.3, t: 21.2, w: 16.9, r: 0,
        art: `<svg viewBox="0 0 130 80">
            <g><circle cx="42" cy="44" r="26" fill="none" stroke="#3A2626" stroke-width="20"/><circle cx="42" cy="44" r="26" fill="none" stroke="#F2B8C6" stroke-width="15"/><circle cx="42" cy="44" r="26" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 9" opacity=".7"/><path d="M26 28 q8 -6 16 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></g>
            <g><circle cx="88" cy="38" r="26" fill="none" stroke="#3A2626" stroke-width="20"/><circle cx="88" cy="38" r="26" fill="none" stroke="#F1DEC2" stroke-width="15"/><circle cx="88" cy="38" r="26" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 9" opacity=".75"/><path d="M72 22 q8 -6 16 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/></g></svg>`,
        open: 'hairpony'
    },
    {
        id: 'clip', name: 'my wooden claw clip', zip: 'main', l: 31.0, t: 29.7, w: 8.5, r: 16,
        art: `<svg viewBox="0 0 90 80"><path d="M10 40 C10 14 80 14 80 40 L72 44 C70 26 20 26 18 44Z" fill="#B57B4B" ${S}/>
            <path d="M18 44 l4 26 M30 40 l2 30 M45 38 v32 M60 40 l-2 30 M72 44 l-4 26" stroke="#B57B4B" stroke-width="8" stroke-linecap="round"/><path d="M18 44 l4 26 M30 40 l2 30 M45 38 v32 M60 40 l-2 30 M72 44 l-4 26" stroke="#3A2626" stroke-width="1.5" stroke-linecap="round" opacity=".55"/>
            <path d="M22 30 q22 -10 46 0" stroke="#8A5530" stroke-width="1.6" fill="none"/><path d="M28 24 q16 -6 34 0" stroke="#D6A372" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="38" y="36" width="14" height="7" rx="3" fill="#C9CDD2" stroke="#3A2626" stroke-width="1.5"/></svg>`,
        open: 'hairclaw'
    },
    {
        id: 'comb', name: 'my wide-tooth comb', zip: 'main', l: 54.5, t: 20.5, w: 16.9, r: -10,
        art: `<svg viewBox="0 0 170 64"><path d="M8 12 h154 a6 6 0 0 1 0 12 H8 a6 6 0 0 1 0 -12z" fill="#C48A57" ${S}/>
            <g stroke="#C48A57" stroke-width="8" stroke-linecap="round">${[22,40,58,76,94,112,130,148].map(x => `<path d="M${x} 24 v32"/>`).join('')}</g>
            <g stroke="#3A2626" stroke-width="1.4" opacity=".5">${[22,40,58,76,94,112,130,148].map(x => `<path d="M${x-4} 26 v28 M${x+4} 26 v28"/>`).join('')}</g>
            <path d="M16 16 q50 -3 90 1" stroke="#E2B386" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
        open: 'haircomb'
    },
    {
        id: 'cap', name: 'my brown cap', zip: 'main', l: 13.2, t: 25.3, w: 24.4, r: -6,
        art: `<svg viewBox="0 0 160 110"><path d="M28 72 C26 26 70 8 104 18 C128 26 140 46 138 70Z" fill="#5C4535" ${S}/>
            <path d="M82 13 C84 34 84 54 82 72 M58 18 C52 36 50 54 52 72 M112 22 C120 38 124 54 124 70" fill="none" stroke="#4A3628" stroke-width="2"/>
            <circle cx="84" cy="13" r="4" fill="#5C4535" stroke="#3A2626" stroke-width="2"/><circle cx="66" cy="34" r="1.8" fill="#3A2A20"/><circle cx="104" cy="34" r="1.8" fill="#3A2A20"/>
            <path d="M70 40 l6 14 4 -12 4 12 6 -14" fill="none" stroke="#3E2D21" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
            <path d="M18 72 Q80 86 146 70 Q150 92 96 100 Q38 102 18 72Z" fill="#4E3A2C" ${S}/>
            <path d="M30 78 Q80 90 136 76 M38 84 Q82 95 128 82" fill="none" stroke="#6B5444" stroke-width="1.2" stroke-dasharray="3 3"/>
            <path d="M40 30 q16 -14 36 -16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".12"/></svg>`,
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
        id: 'binder', name: 'my pink binder', zip: 'main', l: 15.0, t: 82.7, w: 29.1, r: -4,
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
    <clipPath id="ecc${bands.join('').replace(/#/g, '')}"><rect x="12" y="4" width="154" height="212" rx="8"/></clipPath>
    <g clip-path="url(#ecc${bands.join('').replace(/#/g, '')})">${bands.map((c, i) => `<rect x="0" y="${4 + i * 53}" width="180" height="53" fill="${c}"/><text x="${96}" y="${44 + i * 53}" text-anchor="middle" font-family="Bodoni Moda" font-size="38" letter-spacing="1" fill="${i % 2 ? '#F6D9E2' : '#FFFDF8'}" opacity=".9">NOTES</text>`).join('')}</g>
    <rect x="12" y="4" width="154" height="212" rx="8" fill="none" ${S}/>
    ${Array.from({ length: 13 }, (_, i) => `<ellipse cx="12" cy="${16 + i * 15.5}" rx="7" ry="3.2" fill="none" stroke="#9EA3AA" stroke-width="2.5"/>`).join('')}
</svg>`;


/* my keys: BMW fob + apartment fob, close together on one ring. Each one is its own tap. */
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
window.KEYRING = big => `<svg viewBox="0 0 130 252" class="keyring${big ? ' big' : ''}">
    <circle cx="66" cy="26" r="20" fill="none" stroke="#B9BCC2" stroke-width="6"/><circle cx="66" cy="26" r="20" fill="none" stroke="#3A2626" stroke-width="1.5"/>
    <g data-part="apartment" class="kpart"><circle cx="50" cy="52" r="9" fill="none" stroke="#B9BCC2" stroke-width="4"/><circle cx="50" cy="52" r="9" fill="none" stroke="#3A2626" stroke-width="1.2"/>
        <g transform="translate(25 47) rotate(6 24 33)">${window.APT_FOB.replace('<svg viewBox="0 0 48 66">', '<svg width="50" height="69" viewBox="0 0 48 66">')}</g></g>
    <g data-part="bmw" class="kpart"><circle cx="78" cy="50" r="9" fill="none" stroke="#B9BCC2" stroke-width="4"/><circle cx="78" cy="50" r="9" fill="none" stroke="#3A2626" stroke-width="1.2"/>
        <g transform="translate(52 58)">${window.BMW_FOB.replace('<svg viewBox="0 -8 80 158">', '<svg width="70" height="138" viewBox="0 -8 80 158" overflow="visible">')}</g></g>
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
