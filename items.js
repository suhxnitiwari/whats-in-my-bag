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
    mccombs: `<svg viewBox="0 0 80 120" aria-hidden="true">
        <circle cx="40" cy="9" r="7" fill="none" stroke="#B9BCC2" stroke-width="4"/>
        <path d="M40 16 v10" stroke="#B9BCC2" stroke-width="4"/>
        <rect x="8" y="26" width="64" height="88" rx="12" fill="#BF5700" ${S} stroke-width="2.5"/>
        <rect x="14" y="32" width="52" height="76" rx="8" fill="none" stroke="#F3D3B8" stroke-width="1.5"/>
        <text x="40" y="66" text-anchor="middle" font-family="Bodoni Moda" font-weight="600" font-size="13" fill="#fff" letter-spacing=".5">McCOMBS</text>
        <text x="40" y="82" text-anchor="middle" font-family="JetBrains Mono" font-size="6.5" fill="#F3D3B8" letter-spacing="1">UT AUSTIN</text>
        <path d="M30 92 h20" stroke="#F3D3B8" stroke-width="1.5"/>
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
        id: 'headphones', name: 'my headphones', zip: 'devices', l: 24, t: 38, w: 11, r: -12,
        art: `<svg viewBox="0 0 220 190"><path d="M36 128 C20 30 200 30 184 128" fill="none" ${S} stroke-width="16"/><path d="M36 128 C20 30 200 30 184 128" fill="none" stroke="#F2C6C8" stroke-width="7" stroke-linecap="round"/><rect x="12" y="104" width="50" height="72" rx="24" fill="#F4A7B9" ${S}/><rect x="158" y="104" width="50" height="72" rx="24" fill="#F4A7B9" ${S}/><rect x="22" y="116" width="30" height="48" rx="14" fill="#FFFBF8" ${S} stroke-width="2"/><rect x="168" y="116" width="30" height="48" rx="14" fill="#FFFBF8" ${S} stroke-width="2"/><path d="M104 24 q10 -14 20 0" fill="none" ${S} stroke-width="2"/><circle cx="92" cy="10" r="4" fill="${INK}"/><path d="M96 10 V-6" ${S} stroke-width="2"/></svg>`,
        open: () => `
            <h2>What I’m <em>listening</em> to</h2>
            <p class="note">four years of my spotify, turned into a database i can ask anything</p>
            <div class="eq" aria-hidden="true">${'<i></i>'.repeat(18)}</div>
            <div class="stats"><div><b>182K</b><span>plays cleaned</span></div><div><b>21</b><span>days in a row on one song</span></div><div><b>7</b><span>SQL views</span></div></div>
            <div class="shot"><img src="assets/img/listening.jpg" alt="Listening History, the app"></div>
            <div class="row"><a class="btn solid" href="https://listening-history.onrender.com/" target="_blank" rel="noopener">Open Listening History ↗</a><a class="btn" href="https://github.com/suhxnitiwari/listening-history" target="_blank" rel="noopener">Code ↗</a></div>`
    },
    {
        id: 'sketchbook', name: 'my sketchbook', zip: 'main', l: 24, t: 63, w: 9, r: 9,
        art: `<svg viewBox="0 0 180 220"><rect x="14" y="10" width="156" height="200" rx="10" fill="#8E9A6E" ${S}/><path d="M14 30 H4 M14 60 H4 M14 90 H4 M14 120 H4 M14 150 H4 M14 180 H4" ${S}/><rect x="132" y="10" width="12" height="200" fill="#F4A7B9" ${S}/><rect x="42" y="56" width="76" height="52" rx="4" fill="#FFFBF8" ${S} transform="rotate(-4 80 82)"/><text x="80" y="88" text-anchor="middle" font-family="Caveat" font-size="24" fill="${INK}" transform="rotate(-4 80 82)">sketches</text><path d="M60 150 q12 -18 24 0 t24 0" fill="none" ${S} stroke-width="2"/><circle cx="104" cy="170" r="6" fill="#F2C6C8" ${S} stroke-width="2"/></svg>`,
        open: 'sketchbook'
    },
    {
        id: 'lipstick', name: 'westman atelier, glögg', zip: 'main', l: 62.5, t: 86, w: 3.8, r: 16,
        art: `<svg viewBox="0 0 70 200"><rect x="14" y="80" width="42" height="110" rx="10" fill="#E8EFF6" ${S}/><rect x="18" y="60" width="34" height="26" rx="4" fill="#DCE6F0" ${S}/><path d="M22 60 V24 C22 10 48 4 48 18 V60Z" fill="#7A1E2E" ${S}/><path d="M28 30 q6 -8 14 -12" fill="none" stroke="#B4475A" stroke-width="3" stroke-linecap="round"/><text x="35" y="160" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#9AA8B8" transform="rotate(-90 35 140)" letter-spacing="1.5">WESTMAN ATELIER</text></svg>`,
        open: 'makeup'
    },
    {
        id: 'mascara', name: 'lancôme lash idôle', zip: 'main', l: 68, t: 85, w: 3.4, r: -14,
        art: `<svg viewBox="0 0 50 230"><rect x="8" y="10" width="34" height="210" rx="6" fill="#E8C3B4" ${S}/><rect x="14" y="18" width="22" height="84" rx="3" fill="#1E1414"/><rect x="14" y="120" width="22" height="92" rx="3" fill="#1E1414"/><path d="M8 110 H42" ${S}/><text x="25" y="165" text-anchor="middle" font-family="Bodoni Moda" font-size="11" fill="#E8C3B4" transform="rotate(-90 25 165)" letter-spacing="1">IDÔLE</text><text x="25" y="60" text-anchor="middle" font-family="Bodoni Moda" font-size="7" fill="#E8C3B4" transform="rotate(-90 25 60)" letter-spacing="1">LANCÔME</text></svg>`,
        open: 'mascara'
    },
    {
        id: 'wallet', name: 'my wallet', zip: 'front', l: 77, t: 57, w: 11, r: -8,
        art: `<svg viewBox="0 0 200 140"><rect x="6" y="10" width="188" height="124" rx="12" fill="#5A3A26" ${S}/><path d="M6 20 C6 14 10 10 16 10 H184 C190 10 194 14 194 20 V74 L100 118 L6 74Z" fill="#6B4730" ${S}/><g fill="#C99A5B"><path d="M40 34 l4 8 8 4-8 4-4 8-4-8-8-4 8-4z"/><path d="M160 34 l4 8 8 4-8 4-4 8-4-8-8-4 8-4z"/><path d="M100 26 l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/><path d="M40 104 l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/><path d="M160 104 l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/></g><text x="100" y="66" text-anchor="middle" font-family="Bodoni Moda" font-weight="600" font-size="15" letter-spacing="4" fill="#E8C36A">SUHANI</text><circle cx="100" cy="104" r="9" fill="#E8C36A" ${S} stroke-width="2.5"/><path d="M4 30 h4 M4 60 h4 M4 90 h4" stroke="#B3263E" stroke-width="4"/></svg>`,
        open: 'wallet'
    },
    {
        id: 'pouch', name: 'my mildliner pouch', zip: 'main', l: 30, t: 87, w: 6.5, r: -10,
        art: `<svg viewBox="0 0 130 170"><g>${['#F7E06B', '#B9A3E8', '#F29B6B', '#F4A7B9', '#8FD19E', '#8CC4F0', '#E8A1C4', '#F2C572', '#9ED3C3'].map((c, i) => `<g transform="rotate(${(i - 4) * 6.5} 65 120)"><rect x="58" y="10" width="14" height="110" rx="4" fill="#FFFDF9" ${S} stroke-width="2"/><rect x="58" y="4" width="14" height="18" rx="4" fill="${c}" ${S} stroke-width="2"/></g>`).join('')}</g><path d="M14 74 C14 64 116 64 116 74 L110 158 C108 166 22 166 20 158Z" fill="#F7F4F1" ${S}/><path d="M14 74 C40 84 90 84 116 74" fill="none" stroke="#F4A7B9" stroke-width="5" stroke-linecap="round"/><path d="M14 74 C40 84 90 84 116 74" fill="none" ${S} stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="42" cy="122" r="11" fill="#8E2D6E" ${S} stroke-width="2"/><circle cx="38" cy="119" r="1.6" fill="#fff"/><circle cx="46" cy="119" r="1.6" fill="#fff"/><path d="M37 125 q5 5 10 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M112 78 l6 10" ${S} stroke-width="2"/><rect x="113" y="86" width="8" height="12" rx="3" fill="#F4A7B9" ${S} stroke-width="2"/></svg>`,
        open: 'mildliners'
    },
    {
        id: 'penpouch', name: 'my paper mate pouch', zip: 'main', l: 41, t: 90, w: 11, r: 5,
        art: `<svg viewBox="0 0 230 110"><g>${['#E63F7A', '#7B4FD1', '#1F6FD1', '#18A39A', '#F0592B', '#D6336C', '#9B59D0', '#2E86DE'].map((c, i) => `<rect x="${30 + i * 16}" y="${4 + (i % 3) * 5}" width="12" height="40" rx="5" fill="${c}" ${S} stroke-width="2"/>`).join('')}</g><g>${['#7FC6E8', '#F4A7B9', '#B9A3E8'].map((c, i) => `<g transform="rotate(${-14 + i * 7} ${170 + i * 12} 40)"><rect x="${166 + i * 12}" y="2" width="8" height="44" rx="3" fill="${c}" fill-opacity=".55" ${S} stroke-width="1.8"/><rect x="${166 + i * 12}" y="-4" width="8" height="8" rx="2" fill="#FFFDF9" ${S} stroke-width="1.8"/></g>`).join('')}</g><rect x="10" y="30" width="210" height="74" rx="18" fill="#F6CFD6" ${S}/><path d="M160 30 C190 30 214 40 220 60 L220 44 C220 36 214 30 206 30Z" fill="#F8E7A9" opacity=".9"/><path d="M150 32 q30 10 70 32" fill="none" stroke="#F8E7A9" stroke-width="10" stroke-linecap="round" opacity=".8"/><path d="M26 44 H204" ${S} stroke-dasharray="5 5"/><rect x="150" y="76" width="48" height="16" rx="2" fill="#FFFBF2" ${S} stroke-width="1.5"/><text x="174" y="87" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="${INK}" letter-spacing=".5">CICIMELON</text><circle cx="212" cy="46" r="5" fill="#C9CCD2" ${S} stroke-width="1.5"/></svg>`,
        open: 'gelpens'

    },
    {
        id: 'sunglasses', name: 'my sunglasses', zip: 'shades', l: 74, t: 12, w: 12, r: -6,
        art: `<svg viewBox="0 0 240 110"><defs><linearGradient id="lens" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2226"/><stop offset="1" stop-color="#9C979C"/></linearGradient></defs><path d="M8 26 L-2 12" ${S} stroke-width="6"/><path d="M232 26 L242 12" ${S} stroke-width="6"/><rect x="8" y="20" width="96" height="74" rx="16" fill="#1E1414" ${S}/><rect x="136" y="20" width="96" height="74" rx="16" fill="#1E1414" ${S}/><rect x="18" y="30" width="76" height="54" rx="10" fill="url(#lens)"/><rect x="146" y="30" width="76" height="54" rx="10" fill="url(#lens)"/><path d="M104 40 Q120 28 136 40" fill="none" ${S} stroke-width="8"/><path d="M104 40 Q120 28 136 40" fill="none" stroke="#1E1414" stroke-width="4"/><rect x="4" y="22" width="8" height="30" rx="2" fill="#D9A441" ${S} stroke-width="2"/><rect x="228" y="22" width="8" height="30" rx="2" fill="#D9A441" ${S} stroke-width="2"/><path d="M26 38 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="M154 38 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg>`,
        open: 'sunglasses'
    },
    {
        id: 'keys', name: 'my car keys', zip: 'shades', l: 88, t: 13, w: 10, r: 12,
        art: `<svg viewBox="0 0 240 130"><path d="M24 54 C40 54 46 74 44 94 C42 116 6 116 4 94 C2 74 8 54 24 54Z" fill="#2B2C30" ${S} stroke-width="2.5"/><rect x="16" y="60" width="16" height="7" rx="3.5" fill="#FAF1EF" ${S} stroke-width="1.5"/><path d="M14 74 q6 -5 14 -4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".18"/><circle cx="30" cy="38" r="20" fill="none" stroke="#B9BCC2" stroke-width="6"/><circle cx="30" cy="38" r="20" fill="none" ${S} stroke-width="1.5"/>
            <path d="M44 52 L78 22 H210 L228 42 V82 L212 106 H62 L40 84Z" fill="#141416" ${S}/>
            <clipPath id="fobclip"><path d="M44 52 L78 22 H210 L228 42 V82 L212 106 H62 L40 84Z"/></clipPath>
            <g clip-path="url(#fobclip)"><path d="M46 96 L84 28 H226" fill="none" stroke="#2A5BD7" stroke-width="7"/><path d="M52 100 L90 34 H226" fill="none" stroke="#8CC4F0" stroke-width="5" transform="translate(-8 -14)"/></g>
            <path d="M92 40 C120 34 170 32 206 40" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".12"/>
            <circle cx="168" cy="56" r="16" fill="#1F2933" stroke="#D8DCE1" stroke-width="4"/><circle cx="168" cy="56" r="9" fill="#2B3A47"/>
            <path d="M118 52 h10 v8 h-10z M120 52 v-3 a3 3 0 0 1 6 0 v3" fill="none" stroke="#C9D3DD" stroke-width="1.6"/>
            <g fill="#26272B" ${S} stroke-width="1.5"><rect x="92" y="84" width="34" height="16" rx="3"/><rect x="130" y="84" width="34" height="16" rx="3"/><rect x="168" y="84" width="34" height="16" rx="3"/></g>
            <path d="M101 92 h4 l5 -4 v8 l-5 -4 M113 89 q3 3 0 6" fill="none" stroke="#8CC4F0" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M136 96 h22 l-3 -5 h-6 l-3 -3 h-6 z" fill="none" stroke="#C9D3DD" stroke-width="1.4" stroke-linejoin="round"/>
            <path d="M180 90 h10 v7 h-10z M182 90 v-3 a3 3 0 0 1 6 0" fill="none" stroke="#C9D3DD" stroke-width="1.5"/>
        </svg>`,
        open: 'keys'
    },
    {
        id: 'mirror', name: 'my chanel mirror (the blair waldorf one)', zip: 'main', l: 73, t: 90, w: 5.5, r: 0,
        art: `<svg viewBox="0 0 120 120"><rect x="8" y="8" width="104" height="104" rx="22" fill="#141011" ${S}/><rect x="16" y="16" width="88" height="88" rx="16" fill="none" stroke="#3A3033" stroke-width="2"/><circle cx="60" cy="60" r="15" fill="none" stroke="#E9E4DF" stroke-width="4"/><circle cx="60" cy="60" r="7" fill="#141011"/><path d="M26 30 q12 -10 30 -8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".3"/></svg>`,
        open: 'mirror'
    },
    {
        id: 'makeup-pouch', name: 'my makeup pouch', zip: 'main', l: 55, t: 90, w: 10, r: -4,
        art: `<svg viewBox="0 0 200 130"><defs><pattern id="vs" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(0)"><rect width="16" height="16" fill="#F7C9D6"/><rect width="8" height="16" fill="#F29BB6"/></pattern></defs><path d="M14 40 C14 22 186 22 186 40 L178 116 C176 124 24 124 22 116Z" fill="url(#vs)" ${S}/><path d="M22 40 H178" ${S} stroke-dasharray="5 5"/><rect x="164" y="30" width="18" height="16" rx="4" fill="#D9A441" ${S} stroke-width="2.5"/><path d="M173 46 v16" ${S} stroke-width="2.5"/><circle cx="173" cy="66" r="5" fill="#fff" ${S} stroke-width="2"/><rect x="40" y="4" width="10" height="42" rx="3" fill="#E8EFF6" ${S} stroke-width="2" transform="rotate(-8 45 25)"/><path d="M68 44 V14 q8 -14 16 0 V44Z" fill="#3A2626" ${S} stroke-width="2"/><circle cx="76" cy="10" r="9" fill="#F2D7C8" ${S} stroke-width="2"/></svg>`,
        open: 'makeup'
    },
    {
        id: 'stanley', name: 'my pink stanley', zip: 'side', l: 68, t: 52, w: 3.6, r: 6,
        art: `<svg viewBox="0 0 60 220"><defs><pattern id="bows" width="30" height="34" patternUnits="userSpaceOnUse"><rect width="30" height="34" fill="#FFF7F2"/><path d="M15 10 q-8 -7 -10 0 q2 6 10 0 q8 -7 10 0 q-2 6 -10 0 l-4 10 M15 10 l4 10" fill="none" stroke="#F4A7B9" stroke-width="1.6" stroke-linecap="round"/><circle cx="4" cy="26" r="1.8" fill="#F4A7B9"/><circle cx="26" cy="28" r="1.5" fill="#F4A7B9"/></pattern></defs><rect x="10" y="44" width="40" height="170" rx="12" fill="url(#bows)" ${S}/><rect x="12" y="34" width="36" height="14" fill="#D9A441" ${S} stroke-width="2.5"/><rect x="14" y="8" width="32" height="28" rx="8" fill="#D9C8F0" ${S}/><path d="M22 10 C22 -4 38 -4 38 10" fill="none" ${S} stroke-width="4"/><rect x="24" y="12" width="12" height="8" rx="3" fill="#F7C9D6" ${S} stroke-width="2"/></svg>`,
        open: 'stanley'
    },
    {
        id: 'sweater', name: 'my cable knit', zip: 'main', l: 9, t: 57, w: 13, r: -5,
        art: `<svg viewBox="0 0 220 170"><defs><pattern id="knit" width="28" height="22" patternUnits="userSpaceOnUse"><rect width="28" height="22" fill="#8A5A3B"/><path d="M4 0 q6 11 0 22 M12 0 q-6 11 0 22" fill="none" stroke="#6E4428" stroke-width="3"/><path d="M18 0 q5 11 0 22 M24 0 q-5 11 0 22" fill="none" stroke="#A8744F" stroke-width="2.5"/></pattern></defs><rect x="14" y="20" width="192" height="138" rx="18" fill="url(#knit)" ${S}/><path d="M14 60 H206" ${S} stroke-width="2.5"/><rect x="14" y="136" width="192" height="22" rx="10" fill="#6E4428" ${S} stroke-width="2.5"/><path d="M28 136 v22 M44 136 v22 M60 136 v22 M76 136 v22 M92 136 v22 M108 136 v22 M124 136 v22 M140 136 v22 M156 136 v22 M172 136 v22 M188 136 v22" stroke="#5A3520" stroke-width="2"/><path d="M84 20 q26 22 52 0" fill="#6E4428" ${S} stroke-width="2.5"/></svg>`,
        open: 'sweater'
    },
    {
        id: 'notebooks', name: 'my erin condren notebooks', zip: 'main', l: 20, t: 87, w: 9, r: 8,
        get art() { return `<span style="display:grid"><span style="grid-area:1/1; transform:rotate(-9deg) translate(-8%, 2%)">${window.EC(['#C2407A', '#F4C6D2', '#8A9AA6', '#F3EDE3'])}</span><span style="grid-area:1/1; transform:rotate(4deg) translate(4%, -3%)">${window.EC(['#5E7486', '#F3EDE3', '#C2407A', '#F4C6D2'])}</span></span>`; },
        open: 'notebooks'
    },
    {
        id: 'binder', name: 'my pink binder', zip: 'main', l: 8, t: 87, w: 9, r: -6,
        art: `<svg viewBox="0 0 170 200"><rect x="20" y="10" width="140" height="180" rx="6" fill="#FFFDF9" ${S} stroke-width="2"/><path d="M34 30 h110 M34 42 h96 M34 54 h104 M34 66 h80" stroke="#B9B2AE" stroke-width="3"/><rect x="8" y="4" width="152" height="192" rx="10" fill="#F4C9D2" fill-opacity=".82" ${S}/><rect x="8" y="4" width="30" height="192" rx="10" fill="#EDB6C2" fill-opacity=".9" ${S}/><path d="M14 20 q40 -6 60 30" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/></svg>`,
        open: 'binder'
    },
    {
        id: 'ipad', name: 'my ipad', zip: 'devices', l: 21, t: 14, w: 11, r: 5,
        art: `<svg viewBox="0 0 220 160"><rect x="4" y="4" width="212" height="152" rx="16" fill="#2A2629" ${S}/><rect x="14" y="14" width="192" height="132" rx="8" fill="#F7E9EC"/>${[['#F4A7B9', 'LH'], ['#8FD19E', 'SA'], ['#B9A3E8', 'P'], ['#F7D54A', 'ST']].map(([c, t], i) => `<rect x="${34 + i * 42}" y="44" width="30" height="30" rx="8" fill="${c}" ${S} stroke-width="2"/><text x="${49 + i * 42}" y="64" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="${INK}">${t}</text>`).join('')}<rect x="60" y="104" width="100" height="18" rx="9" fill="#FFFDF9" ${S} stroke-width="2"/><text x="110" y="117" text-anchor="middle" font-family="Caveat" font-size="13" fill="${INK}">made by me</text></svg>`,
        open: 'ipad'
    },
    {
        id: 'phone', name: 'my phone', zip: 'shades', l: 82, t: 31, w: 5, r: -10,
        art: `<svg viewBox="0 0 90 180"><rect x="4" y="4" width="82" height="172" rx="16" fill="#F2C6C8" ${S}/><rect x="20" y="16" width="26" height="26" rx="8" fill="#E9A9B6" ${S} stroke-width="2"/><circle cx="33" cy="29" r="7" fill="#3A2626"/><circle cx="56" cy="22" r="3" fill="#3A2626"/><path d="M30 120 C10 104 12 86 24 86 C30 86 32 92 32 95 C32 92 34 86 40 86 C52 86 54 104 30 120Z" fill="#FFFBF8" ${S} stroke-width="2"/><text x="45" y="150" text-anchor="middle" font-family="Caveat" font-size="16" fill="${INK}">s.t.</text></svg>`,
        open: 'phone'
    },
    {
        id: 'passport', name: 'my passport', zip: 'front', l: 91, t: 53, w: 7, r: 10,
        art: `<svg viewBox="0 0 110 150"><rect x="6" y="6" width="98" height="138" rx="8" fill="#22325A" ${S}/><circle cx="55" cy="62" r="18" fill="none" stroke="#D9B45A" stroke-width="2.5"/><path d="M42 62 h26 M55 49 v26" stroke="#D9B45A" stroke-width="2"/><text x="55" y="30" text-anchor="middle" font-family="Bodoni Moda" font-size="11" letter-spacing="2" fill="#D9B45A">PASSPORT</text><rect x="38" y="104" width="34" height="14" rx="2" fill="none" stroke="#D9B45A" stroke-width="2"/><rect x="70" y="2" width="16" height="30" fill="#F4A7B9" ${S} stroke-width="2"/></svg>`,
        open: 'passport'
    },
    {
        id: 'laptop', name: 'my laptop', zip: 'devices', l: 8, t: 19, w: 9.5, r: -8,
        get art() { return window.LID(false); },
        open: 'laptop'
    }
];


/* the stickers on my laptop, where they actually are. Each one opens something. */
window.STICKERS = [
    { id: 'music', label: 'the music heart → Listening History', x: 40, y: 46, go: 'headphones',
      svg: `<path d="M0 22 C-34 0 -30 -26 -12 -26 C-4 -26 0 -18 0 -14 C0 -18 4 -26 12 -26 C30 -26 34 0 0 22Z" fill="#F6F1E6" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M0 22 C-34 0 -30 -26 -12 -26 C-4 -26 0 -18 0 -14 C0 -18 4 -26 12 -26 C30 -26 34 0 0 22Z" fill="#F6F1E6" ${S} stroke-width="1.6"/><circle cx="-14" cy="-12" r="4" fill="none" ${S} stroke-width="1.4"/><circle cx="10" cy="-10" r="3" fill="${INK}"/><path d="M-6 2 l3 -8 3 8 M-18 2 h6 M6 4 l6 -4" ${S} stroke-width="1.4" fill="none"/><text x="2" y="12" font-size="6" font-family="JetBrains Mono" fill="${INK}">13</text>` },
    { id: 'books', label: 'the pink books → my children’s book', x: 160, y: 38, go: 'book',
      svg: `<g stroke="#fff" stroke-width="7" stroke-linejoin="round"><rect x="-26" y="-20" width="52" height="40" rx="3" fill="#E75D8A"/></g><rect x="-26" y="-20" width="16" height="40" rx="2" fill="#E75D8A" ${S} stroke-width="1.6"/><rect x="-10" y="-20" width="18" height="40" rx="2" fill="#F08DAA" ${S} stroke-width="1.6"/><rect x="8" y="-20" width="18" height="40" rx="2" fill="#D9486F" ${S} stroke-width="1.6"/><path d="M-30 -2 q-8 -10 0 -12 q6 0 8 8 q2 -8 8 -8 q8 2 0 12 z" fill="#F7B7C8" ${S} stroke-width="1.4"/>` },
    { id: 'cowgirl', label: 'the cowgirl hat & boot → Owala Austin Marathon', x: 100, y: 92, go: 'owala',
      svg: `<ellipse cx="-4" cy="-8" rx="30" ry="9" fill="#E07A5F" stroke="#fff" stroke-width="7"/><ellipse cx="-4" cy="-8" rx="30" ry="9" fill="#E07A5F" ${S} stroke-width="1.6"/><path d="M-18 -10 C-16 -30 10 -30 12 -10Z" fill="#E88B70" ${S} stroke-width="1.6"/><path d="M-2 0 v22 h24 q4 -8 -6 -10 v-12z" fill="#F7C9D0" ${S} stroke-width="1.6"/><path d="M2 6 q6 4 10 0 M2 12 q6 4 10 0" fill="none" stroke="#6C8BD6" stroke-width="1.6"/>` },
    { id: 'texas', label: '“tradition starts here” → my coursework', x: 42, y: 116, href: 'https://suhanitiwari.com/home/study#coursework',
      svg: `<path d="M-24 -26 h14 v14 h20 l6 6 h8 l4 10 -8 12 -8 4 -6 12 -8 -8 -4 -8 -10 -6 -8 -12z" fill="#FFF7F0" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M-24 -26 h14 v14 h20 l6 6 h8 l4 10 -8 12 -8 4 -6 12 -8 -8 -4 -8 -10 -6 -8 -12z" fill="#FFF7F0" stroke="#D9713A" stroke-width="2.2" stroke-linejoin="round"/><text x="-2" y="-2" text-anchor="middle" font-family="Caveat" font-size="8" fill="#D9713A">tradition</text><text x="-2" y="7" text-anchor="middle" font-family="Caveat" font-size="8" fill="#D9713A">starts here</text>` },
    { id: 'cupcake', label: 'the Mozart’s cupcake → Starbucks app', x: 160, y: 100, go: 'starbucks',
      svg: `<rect x="-28" y="-26" width="56" height="52" rx="12" fill="#E7C6F2" stroke="#fff" stroke-width="7"/><path d="M-12 4 h24 l-4 18 h-16z" fill="#B7A3E8" ${S} stroke-width="1.6"/><path d="M-16 4 C-18 -12 18 -12 16 4Z" fill="#FFF8EE" ${S} stroke-width="1.6"/><circle cx="0" cy="-14" r="4" fill="#D23B3B" ${S} stroke-width="1.4"/><g fill="#F4A7B9"><circle cx="-6" cy="-2" r="1.2"/><circle cx="6" cy="-4" r="1.2"/><circle cx="2" cy="0" r="1.2"/></g>` },
    { id: 'flower', label: '“just as you are” → my sketchbook', x: 42, y: 184, go: 'sketchbook',
      svg: `<g fill="#A9C3A0" stroke="#fff" stroke-width="7">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="0" cy="-15" rx="10" ry="13" transform="rotate(${a})"/>`).join('')}</g><g fill="#A9C3A0" ${S} stroke-width="1.4">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="0" cy="-15" rx="10" ry="13" transform="rotate(${a})"/>`).join('')}</g><circle r="11" fill="#F2B27A" ${S} stroke-width="1.4"/><text y="2" text-anchor="middle" font-family="Caveat" font-size="6" fill="${INK}">just as you are</text><circle cx="-10" cy="12" r="3.5" fill="#E75D8A"/>` },
    { id: 'latte', label: '“love you a latte” → Saturday in Austin', x: 42, y: 256, go: 'saturday',
      svg: `<circle r="26" fill="#FFFDF8" stroke="#fff" stroke-width="7"/><circle r="26" fill="#FFFDF8" ${S} stroke-width="1.6"/><circle r="17" fill="#D79B62" ${S} stroke-width="1.4"/><path d="M0 10 C-12 2 -10 -10 -3 -9 C0 -8 0 -5 0 -3 C0 -5 0 -8 3 -9 C10 -10 12 2 0 10Z" fill="#FFF3E2"/><path d="M22 -10 q10 0 10 8 q0 8 -10 8" fill="none" ${S} stroke-width="2"/><text y="34" text-anchor="middle" font-family="Caveat" font-size="7" fill="${INK}">love you a latte</text>` }
];

window.LID = (big) => `<svg viewBox="0 0 210 300" ${big ? 'class="lid-big"' : ''} aria-hidden="${big ? 'false' : 'true'}">
    <rect x="3" y="3" width="204" height="294" rx="14" fill="#CDD0D5" ${S}/>
    <rect x="3" y="3" width="204" height="294" rx="14" fill="url(#brushed)" opacity=".5"/>
    <defs><linearGradient id="brushed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#9DA2A9" stop-opacity=".35"/></linearGradient></defs>
    ${window.STICKERS.map(k => big
        ? `<g class="stk" tabindex="0" role="button" aria-label="${k.label}" data-sticker="${k.id}" transform="translate(${k.x} ${k.y})"><g class="stk-in">${k.svg}</g></g>`
        : `<g transform="translate(${k.x} ${k.y})">${k.svg}</g>`).join('')}
</svg>`;


/* my custom Erin Condren notebooks: four bands, NOTES on each */
window.EC = (bands, big) => `<svg viewBox="0 0 170 220" aria-hidden="true">
    <rect x="12" y="4" width="154" height="212" rx="8" fill="${bands[0]}" ${S}/>
    <clipPath id="ecc${bands.join('').replace(/#/g, '')}"><rect x="12" y="4" width="154" height="212" rx="8"/></clipPath>
    <g clip-path="url(#ecc${bands.join('').replace(/#/g, '')})">${bands.map((c, i) => `<rect x="0" y="${4 + i * 53}" width="180" height="53" fill="${c}"/><text x="${96}" y="${44 + i * 53}" text-anchor="middle" font-family="Bodoni Moda" font-size="38" letter-spacing="1" fill="${i % 2 ? '#F6D9E2' : '#FFFDF8'}" opacity=".9">NOTES</text>`).join('')}</g>
    <rect x="12" y="4" width="154" height="212" rx="8" fill="none" ${S}/>
    ${Array.from({ length: 13 }, (_, i) => `<ellipse cx="12" cy="${16 + i * 15.5}" rx="7" ry="3.2" fill="none" stroke="#9EA3AA" stroke-width="2.5"/>`).join('')}
</svg>`;

/* my wallet: cards pop out like file folders. The first one is my student ID. */
window.CARDS = [
    { kind: 'id', title: 'UT Austin student ID', big: 'Suhani Tiwari', sub: 'Management Information Systems + Psychology', metric: 'McCombs School of Business · Class of 2027 · 3.5 GPA', body: 'BBA in MIS and a BA in Psychology, with minors in Marketing and Educational Psychology. Two McCombs scholarships this year.' },
    { color: '#C74634', text: '#fff', title: 'Oracle', big: 'ERP Consultant Intern', tag: 'MEMBER SINCE 2026', metric: '$20M–$200M companies · 12-week Enterprise Sales Development program', body: 'Prospected enterprises, led discovery calls, and matched what they actually needed to Oracle NetSuite.' },
    { color: '#E8D5B0', text: INK, title: 'Acacia Advisors', big: '+20% traffic', tag: 'MEMBER SINCE 2025', metric: '+20% website traffic · +27% LinkedIn visits · $1M Azure AI go-to-market', body: 'Rewrote the messaging for their AI and cloud services, and built the go-to-market for a manufacturing AI product.' },
    { color: '#2B2B33', text: '#F2C6C8', title: 'Outlier', big: '1,000+ AI answers', tag: 'MEMBER SINCE 2024', metric: '1,000+ responses graded · Tier 3 → Tier 1 in four months', body: 'Graded AI answers for accuracy, safety and reasoning, and ranked outputs to train frontier models.' },
    { color: '#F4A7B9', text: INK, title: 'Girls Who Code', big: '240+ girls', tag: 'FOUNDER 2022', metric: '2 chapters · 16-week sessions · 10 coding projects', body: 'Started chapters at two middle schools and wrote the curriculum myself. 100% of mentees who tested passed AP CS.' }
];

/* my pencil pouch: every pen is a tool I actually use */
/* my Mildliner pouch: the full 25-pack, one highlighter for every tool on my résumé */
window.PENS = [
    { name: 'Python', c: '#F7E06B', note: 'Listening History’s pipeline and the Saturday in Austin planner.' },
    { name: 'SQL', c: '#F4A7B9', note: 'CTEs, window functions, stored procedures. The streak finder. My favorite highlighter.' },
    { name: 'C#', c: '#B9A3E8', note: 'RideFlow, Bevo’s Tacos, and my whole portfolio site.' },
    { name: 'JavaScript', c: '#8FD19E', note: 'Every interaction you’ve touched on this page.' },
    { name: 'HTML/CSS', c: '#F6B48C', note: 'This page is hand-written HTML and CSS. No framework.' },
    { name: 'R', c: '#9CC9E8', note: 'Statistics, the R way.' },
    { name: 'ASP.NET Core', c: '#D7A6D9', note: 'What suhanitiwari.com runs on.' },
    { name: 'Azure', c: '#7FB3E0', note: 'The $1M Azure AI go-to-market I built at Acacia.' },
    { name: 'Snowflake', c: '#A9DCEB', note: 'Where my ride-share database runs, rollbacks and all.' },
    { name: 'MongoDB', c: '#A8D8A0', note: 'Documents instead of tables, for data that won’t sit still.' },
    { name: 'ETL', c: '#F2C572', note: 'Extract, clean, load: 182K Spotify plays.' },
    { name: 'Power BI', c: '#F7D54A', note: 'Dashboards, the business-school way.' },
    { name: 'Tableau', c: '#F29B6B', note: 'For when a number needs to be a picture.' },
    { name: 'Excel', c: '#B5D99C', note: 'Still undefeated.' },
    { name: 'Pivot Tables', c: '#E8A1C4', note: 'The fastest answer in any spreadsheet.' },
    { name: 'VLOOKUP', c: '#C9B6E4', note: 'Yes, I know about XLOOKUP. I still love her.' },
    { name: 'Docker', c: '#86C5D8', note: 'My portfolio ships in a container to Render.' },
    { name: 'Git/GitHub', c: '#D9B38C', note: 'Including this repo.' },
    { name: 'LLM Evaluation', c: '#F5A3A3', note: '1,000+ AI responses graded at Outlier.' },
    { name: 'Prompt Engineering', c: '#B3A6E0', note: 'I wrote Sitara’s guardrails.' },
    { name: 'AI Strategy', c: '#9ED3C3', note: 'Repositioning Acacia’s AI and cloud services.' },
    { name: 'Oracle NetSuite', c: '#F0A58F', note: 'What I matched $20M–$200M companies to at Oracle.' },
    { name: 'PowerPoint', c: '#F3B6C9', note: 'Strategy decks that lead with the answer.' },
    { name: 'Word', c: '#A7C4E8', note: 'Essays, reports and first drafts.' },
    { name: 'Canva', c: '#C7E3A1', note: 'Posters, decks and social graphics.' }
];

/* my Paper Mate pouch: the InkJoy Gel 30-pack, 0.7mm. Just pens. */
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
    { name: 'Rose', c: '#C2185B' },
    { name: 'Grape', c: '#5F27CD' },
    { name: 'Cerulean', c: '#2D98DA' },
    { name: 'Aqua', c: '#0FB9B1' },
    { name: 'Red', c: '#EB3B5A' },
    { name: 'Lavender', c: '#A55EEA' },
    { name: 'Cornflower', c: '#4B7BEC' },
    { name: 'Spring', c: '#26DE81' },
    { name: 'Apricot', c: '#FD9644' },
    { name: 'Cherry', c: '#D63031' },
    { name: 'Navy', c: '#341F97' }
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
