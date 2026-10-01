/* Everything in my bag. Each thing has:
   id, name (the hover tag), where it lands once it falls out (l, t, w, r: left/top/width as % of the table, rotation),
   art (a doodle for now; swap in a photo of the real thing any time with  art: '<img src="assets/img/....png" alt="">'),
   and open(), what you see when you pick it up. */

const INK = '#3A2626';
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

window.BAG = {
    /* my real backpack: black Samsonite, red accents, red zipper pulls */
    closed: `<svg viewBox="0 0 300 340" aria-hidden="true">
        <path d="M112 50 C112 18 188 18 188 50" fill="none" ${S} stroke-width="14"/>
        <path d="M112 50 C112 18 188 18 188 50" fill="none" stroke="#35323A" stroke-width="7" stroke-linecap="round"/>
        <rect x="40" y="44" width="220" height="284" rx="56" fill="#222024" ${S}/>
        <path d="M58 118 C58 78 242 78 242 118 L242 150 L58 150Z" fill="#2B292E" ${S}/>
        <rect x="130" y="96" width="40" height="10" rx="3" fill="#B9BCC2" ${S} stroke-width="2"/>
        <path d="M84 104 l12 12 M216 104 l-12 12" stroke="#D23B3B" stroke-width="4" stroke-linecap="round"/>
        <rect x="70" y="150" width="160" height="162" rx="40" fill="#2B292E" ${S}/>
        <rect x="140" y="170" width="20" height="132" rx="8" fill="#3A373E" ${S} stroke-width="2.5"/>
        <path d="M140 208 h20 M140 284 h20" stroke="#D23B3B" stroke-width="4"/>
        <path d="M82 160 C120 150 180 150 218 160" fill="none" stroke="#4A474F" stroke-width="2" stroke-dasharray="3 5"/>
        <g ${S} stroke-width="2"><path d="M124 150 l-10 14" /><rect x="106" y="160" width="12" height="16" rx="3" fill="#C9CCD2"/><path d="M176 150 l10 14"/><rect x="182" y="160" width="12" height="16" rx="3" fill="#C9CCD2"/></g>
        <path d="M112 168 v6 M188 168 v6" stroke="#D23B3B" stroke-width="3"/>
    </svg>`,
    open: `<svg viewBox="0 0 300 340" aria-hidden="true">
        <path d="M112 50 C112 18 188 18 188 50" fill="none" ${S} stroke-width="14"/>
        <rect x="40" y="44" width="220" height="284" rx="56" fill="#222024" ${S}/>
        <ellipse cx="150" cy="96" rx="100" ry="40" fill="#141215" ${S}/>
        <path d="M60 30 C90 62 210 62 240 30 C236 6 64 6 60 30Z" fill="#2B292E" ${S} transform="rotate(-12 150 30)"/>
        <rect x="104" y="70" width="10" height="34" rx="3" fill="#F4A7B9" ${S} stroke-width="2" transform="rotate(-12 109 87)"/>
        <rect x="170" y="64" width="44" height="30" rx="4" fill="#F2C6C8" ${S} stroke-width="2" transform="rotate(10 192 79)"/>
        <rect x="70" y="150" width="160" height="162" rx="40" fill="#2B292E" ${S}/>
        <rect x="140" y="170" width="20" height="132" rx="8" fill="#3A373E" ${S} stroke-width="2.5"/>
        <path d="M140 208 h20 M140 284 h20" stroke="#D23B3B" stroke-width="4"/>
    </svg>`,
    /* my bag charm: a Bath & Body Works caramel frappuccino with whipped cream, and it smiles back */
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
        <rect x="20" y="96" width="48" height="16" rx="6" fill="#D8B48A" ${S} stroke-width="2.5"/>
    </svg>`
};

window.ITEMS = [
    {
        id: 'headphones', name: 'my headphones', l: 12, t: 16, w: 15, r: -12,
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
        id: 'sketchbook', name: 'my sketchbook', l: 70, t: 15, w: 12, r: 9,
        art: `<svg viewBox="0 0 180 220"><rect x="14" y="10" width="156" height="200" rx="10" fill="#8E9A6E" ${S}/><path d="M14 30 H4 M14 60 H4 M14 90 H4 M14 120 H4 M14 150 H4 M14 180 H4" ${S}/><rect x="132" y="10" width="12" height="200" fill="#F4A7B9" ${S}/><rect x="42" y="56" width="76" height="52" rx="4" fill="#FFFBF8" ${S} transform="rotate(-4 80 82)"/><text x="80" y="88" text-anchor="middle" font-family="Caveat" font-size="24" fill="${INK}" transform="rotate(-4 80 82)">sketches</text><path d="M60 150 q12 -18 24 0 t24 0" fill="none" ${S} stroke-width="2"/><circle cx="104" cy="170" r="6" fill="#F2C6C8" ${S} stroke-width="2"/></svg>`,
        open: 'sketchbook'
    },
    {
        id: 'lipstick', name: 'westman atelier, glögg', l: 29, t: 12, w: 5, r: 18,
        art: `<svg viewBox="0 0 70 200"><rect x="14" y="80" width="42" height="110" rx="10" fill="#E8EFF6" ${S}/><rect x="18" y="60" width="34" height="26" rx="4" fill="#DCE6F0" ${S}/><path d="M22 60 V24 C22 10 48 4 48 18 V60Z" fill="#7A1E2E" ${S}/><path d="M28 30 q6 -8 14 -12" fill="none" stroke="#B4475A" stroke-width="3" stroke-linecap="round"/><text x="35" y="160" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#9AA8B8" transform="rotate(-90 35 140)" letter-spacing="1.5">WESTMAN ATELIER</text></svg>`,
        open: 'makeup'
    },
    {
        id: 'mascara', name: 'lancôme lash idôle', l: 35, t: 12, w: 3.6, r: -22,
        art: `<svg viewBox="0 0 50 230"><rect x="8" y="10" width="34" height="210" rx="6" fill="#E8C3B4" ${S}/><rect x="14" y="18" width="22" height="84" rx="3" fill="#1E1414"/><rect x="14" y="120" width="22" height="92" rx="3" fill="#1E1414"/><path d="M8 110 H42" ${S}/><text x="25" y="165" text-anchor="middle" font-family="Bodoni Moda" font-size="11" fill="#E8C3B4" transform="rotate(-90 25 165)" letter-spacing="1">IDÔLE</text><text x="25" y="60" text-anchor="middle" font-family="Bodoni Moda" font-size="7" fill="#E8C3B4" transform="rotate(-90 25 60)" letter-spacing="1">LANCÔME</text></svg>`,
        open: 'makeup'
    },
    {
        id: 'wallet', name: 'my wallet', l: 89, t: 46, w: 11, r: -8,
        art: `<svg viewBox="0 0 200 140"><rect x="6" y="10" width="188" height="124" rx="12" fill="#5A3A26" ${S}/><path d="M6 20 C6 14 10 10 16 10 H184 C190 10 194 14 194 20 V74 L100 118 L6 74Z" fill="#6B4730" ${S}/><g fill="#C99A5B"><path d="M40 34 l4 8 8 4-8 4-4 8-4-8-8-4 8-4z"/><path d="M160 34 l4 8 8 4-8 4-4 8-4-8-8-4 8-4z"/><path d="M100 26 l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/><path d="M40 104 l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/><path d="M160 104 l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/></g><text x="100" y="66" text-anchor="middle" font-family="Bodoni Moda" font-weight="600" font-size="15" letter-spacing="4" fill="#E8C36A">SUHANI</text><circle cx="100" cy="104" r="9" fill="#E8C36A" ${S} stroke-width="2.5"/><path d="M4 30 h4 M4 60 h4 M4 90 h4" stroke="#B3263E" stroke-width="4"/></svg>`,
        open: 'wallet'
    },
    {
        id: 'pouch', name: 'my mildliner pouch', l: 10, t: 81, w: 9.5, r: -10,
        art: `<svg viewBox="0 0 130 170"><g>${['#F7D54A', '#B9A3E8', '#F29B6B', '#F4A7B9', '#8FD19E', '#8CC4F0'].map((c, i) => `<g transform="rotate(${(i - 2.5) * 9} 65 120)"><rect x="58" y="10" width="14" height="110" rx="4" fill="#FFFDF9" ${S} stroke-width="2"/><rect x="58" y="4" width="14" height="18" rx="4" fill="${c}" ${S} stroke-width="2"/></g>`).join('')}</g><path d="M14 74 C14 64 116 64 116 74 L110 158 C108 166 22 166 20 158Z" fill="#F7F4F1" ${S}/><path d="M14 74 C40 84 90 84 116 74" fill="none" stroke="#F4A7B9" stroke-width="5" stroke-linecap="round"/><path d="M14 74 C40 84 90 84 116 74" fill="none" ${S} stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="42" cy="122" r="11" fill="#8E2D6E" ${S} stroke-width="2"/><circle cx="38" cy="119" r="1.6" fill="#fff"/><circle cx="46" cy="119" r="1.6" fill="#fff"/><path d="M37 125 q5 5 10 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M112 78 l6 10" ${S} stroke-width="2"/><rect x="113" y="86" width="8" height="12" rx="3" fill="#F4A7B9" ${S} stroke-width="2"/></svg>`,
        open: 'mildliners'
    },
    {
        id: 'penpouch', name: 'my paper mate pouch', l: 23, t: 84, w: 14, r: 5,
        art: `<svg viewBox="0 0 230 110"><g>${['#2E4A7A', '#D9467A', '#B36FD1', '#E86CA5', '#7FC6E8', '#8E3BA8'].map((c, i) => `<rect x="${34 + i * 22}" y="${4 + (i % 3) * 5}" width="12" height="40" rx="5" fill="${c}" ${S} stroke-width="2"/>`).join('')}</g><rect x="10" y="30" width="210" height="74" rx="18" fill="#F6CFD6" ${S}/><path d="M160 30 C190 30 214 40 220 60 L220 44 C220 36 214 30 206 30Z" fill="#F8E7A9" opacity=".9"/><path d="M150 32 q30 10 70 32" fill="none" stroke="#F8E7A9" stroke-width="10" stroke-linecap="round" opacity=".8"/><path d="M26 44 H204" ${S} stroke-dasharray="5 5"/><rect x="150" y="76" width="48" height="16" rx="2" fill="#FFFBF2" ${S} stroke-width="1.5"/><text x="174" y="87" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="${INK}" letter-spacing=".5">CICIMELON</text><circle cx="212" cy="46" r="5" fill="#C9CCD2" ${S} stroke-width="1.5"/></svg>`,
        open: 'gelpens'

    },
    {
        id: 'sunglasses', name: 'my sunglasses', l: 38, t: 86, w: 13, r: -6,
        art: `<svg viewBox="0 0 240 110"><defs><linearGradient id="lens" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2226"/><stop offset="1" stop-color="#9C979C"/></linearGradient></defs><path d="M8 26 L-2 12" ${S} stroke-width="6"/><path d="M232 26 L242 12" ${S} stroke-width="6"/><rect x="8" y="20" width="96" height="74" rx="16" fill="#1E1414" ${S}/><rect x="136" y="20" width="96" height="74" rx="16" fill="#1E1414" ${S}/><rect x="18" y="30" width="76" height="54" rx="10" fill="url(#lens)"/><rect x="146" y="30" width="76" height="54" rx="10" fill="url(#lens)"/><path d="M104 40 Q120 28 136 40" fill="none" ${S} stroke-width="8"/><path d="M104 40 Q120 28 136 40" fill="none" stroke="#1E1414" stroke-width="4"/><rect x="4" y="22" width="8" height="30" rx="2" fill="#D9A441" ${S} stroke-width="2"/><rect x="228" y="22" width="8" height="30" rx="2" fill="#D9A441" ${S} stroke-width="2"/><path d="M26 38 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="M154 38 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg>`,
        open: 'sunglasses'
    },
    {
        id: 'keys', name: 'my car keys', l: 53, t: 87, w: 7.5, r: 14,
        art: `<svg viewBox="0 0 150 170"><circle cx="40" cy="30" r="24" fill="none" stroke="#D9A441" stroke-width="7"/><circle cx="40" cy="30" r="24" fill="none" ${S} stroke-width="2"/><rect x="40" y="56" width="70" height="104" rx="30" fill="#2A2226" ${S}/><circle cx="75" cy="84" r="13" fill="#C9CDD3" ${S} stroke-width="2.5"/><circle cx="75" cy="84" r="7" fill="#E8EDF2" ${S} stroke-width="1.5"/><rect x="60" y="108" width="30" height="10" rx="5" fill="#5E5559"/><rect x="60" y="124" width="30" height="10" rx="5" fill="#5E5559"/><rect x="60" y="140" width="30" height="10" rx="5" fill="#5E5559"/><path d="M10 50 q-6 20 10 30" fill="none" stroke="#F4A7B9" stroke-width="6" stroke-linecap="round"/><path d="M14 80 l6 -4 4 8z" fill="#F4A7B9" ${S} stroke-width="2"/></svg>`,
        open: 'keys'
    },
    {
        id: 'mirror', name: 'my chanel mirror', l: 88, t: 14, w: 7, r: 0,
        art: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#141011" ${S}/><circle cx="60" cy="60" r="46" fill="none" stroke="#3A3033" stroke-width="2"/><circle cx="60" cy="60" r="18" fill="none" stroke="#E9E4DF" stroke-width="4"/><circle cx="60" cy="60" r="10" fill="#141011"/><path d="M40 30 q10 -8 22 -6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/></svg>`,
        open: 'mirror'
    },
    {
        id: 'makeup-pouch', name: 'my makeup pouch', l: 50, t: 11, w: 12, r: -4,
        art: `<svg viewBox="0 0 200 130"><defs><pattern id="vs" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(0)"><rect width="16" height="16" fill="#F7C9D6"/><rect width="8" height="16" fill="#F29BB6"/></pattern></defs><path d="M14 40 C14 22 186 22 186 40 L178 116 C176 124 24 124 22 116Z" fill="url(#vs)" ${S}/><path d="M22 40 H178" ${S} stroke-dasharray="5 5"/><rect x="164" y="30" width="18" height="16" rx="4" fill="#D9A441" ${S} stroke-width="2.5"/><path d="M173 46 v16" ${S} stroke-width="2.5"/><circle cx="173" cy="66" r="5" fill="#fff" ${S} stroke-width="2"/><rect x="40" y="4" width="10" height="42" rx="3" fill="#E8EFF6" ${S} stroke-width="2" transform="rotate(-8 45 25)"/><path d="M68 44 V14 q8 -14 16 0 V44Z" fill="#3A2626" ${S} stroke-width="2"/><circle cx="76" cy="10" r="9" fill="#F2D7C8" ${S} stroke-width="2"/></svg>`,
        open: 'makeup'
    },
    {
        id: 'stanley', name: 'my pink stanley', l: 29, t: 46, w: 4.6, r: 6,
        art: `<svg viewBox="0 0 60 220"><defs><pattern id="bows" width="30" height="34" patternUnits="userSpaceOnUse"><rect width="30" height="34" fill="#FFF7F2"/><path d="M15 10 q-8 -7 -10 0 q2 6 10 0 q8 -7 10 0 q-2 6 -10 0 l-4 10 M15 10 l4 10" fill="none" stroke="#F4A7B9" stroke-width="1.6" stroke-linecap="round"/><circle cx="4" cy="26" r="1.8" fill="#F4A7B9"/><circle cx="26" cy="28" r="1.5" fill="#F4A7B9"/></pattern></defs><rect x="10" y="44" width="40" height="170" rx="12" fill="url(#bows)" ${S}/><rect x="12" y="34" width="36" height="14" fill="#D9A441" ${S} stroke-width="2.5"/><rect x="14" y="8" width="32" height="28" rx="8" fill="#D9C8F0" ${S}/><path d="M22 10 C22 -4 38 -4 38 10" fill="none" ${S} stroke-width="4"/><rect x="24" y="12" width="12" height="8" rx="3" fill="#F7C9D6" ${S} stroke-width="2"/></svg>`,
        open: 'stanley'
    },
    {
        id: 'sweater', name: 'my cable knit', l: 12, t: 48, w: 17, r: -5,
        art: `<svg viewBox="0 0 220 170"><defs><pattern id="knit" width="28" height="22" patternUnits="userSpaceOnUse"><rect width="28" height="22" fill="#8A5A3B"/><path d="M4 0 q6 11 0 22 M12 0 q-6 11 0 22" fill="none" stroke="#6E4428" stroke-width="3"/><path d="M18 0 q5 11 0 22 M24 0 q-5 11 0 22" fill="none" stroke="#A8744F" stroke-width="2.5"/></pattern></defs><rect x="14" y="20" width="192" height="138" rx="18" fill="url(#knit)" ${S}/><path d="M14 60 H206" ${S} stroke-width="2.5"/><rect x="14" y="136" width="192" height="22" rx="10" fill="#6E4428" ${S} stroke-width="2.5"/><path d="M28 136 v22 M44 136 v22 M60 136 v22 M76 136 v22 M92 136 v22 M108 136 v22 M124 136 v22 M140 136 v22 M156 136 v22 M172 136 v22 M188 136 v22" stroke="#5A3520" stroke-width="2"/><path d="M84 20 q26 22 52 0" fill="#6E4428" ${S} stroke-width="2.5"/></svg>`,
        open: 'sweater'
    },
    {
        id: 'notebooks', name: 'my erin condren notebooks', l: 70, t: 80, w: 11, r: 8,
        get art() { return `<span style="display:grid"><span style="grid-area:1/1; transform:rotate(-9deg) translate(-8%, 2%)">${window.EC(['#C2407A', '#F4C6D2', '#8A9AA6', '#F3EDE3'])}</span><span style="grid-area:1/1; transform:rotate(4deg) translate(4%, -3%)">${window.EC(['#5E7486', '#F3EDE3', '#C2407A', '#F4C6D2'])}</span></span>`; },
        open: 'notebooks'
    },
    {
        id: 'binder', name: 'my pink binder', l: 87, t: 83, w: 11, r: -6,
        art: `<svg viewBox="0 0 170 200"><rect x="20" y="10" width="140" height="180" rx="6" fill="#FFFDF9" ${S} stroke-width="2"/><path d="M34 30 h110 M34 42 h96 M34 54 h104 M34 66 h80" stroke="#B9B2AE" stroke-width="3"/><rect x="8" y="4" width="152" height="192" rx="10" fill="#F4C9D2" fill-opacity=".82" ${S}/><rect x="8" y="4" width="30" height="192" rx="10" fill="#EDB6C2" fill-opacity=".9" ${S}/><path d="M14 20 q40 -6 60 30" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/></svg>`,
        open: 'binder'
    },
    {
        id: 'laptop', name: 'my laptop', l: 73, t: 45, w: 10.5, r: -8,
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
window.PENS = [
    { name: 'Python', c: '#F7D54A', note: 'Listening History’s pipeline and the Saturday in Austin planner.' },
    { name: 'SQL', c: '#F4A7B9', note: 'CTEs, window functions, stored procedures. The streak finder. My favorite highlighter.' },
    { name: 'C#', c: '#B9A3E8', note: 'RideFlow, Bevo’s Tacos, and my whole portfolio site in ASP.NET Core.' },
    { name: 'JavaScript', c: '#8FD19E', note: 'Every interaction you’ve touched on this page.' },
    { name: 'Snowflake', c: '#8CC4F0', note: 'Where my ride-share database runs, rollbacks and all.' },
    { name: 'Tableau', c: '#F29B6B', note: 'For when a number needs to be a picture.' },
    { name: 'Power BI', c: '#F7D54A', note: 'Dashboards, the business-school way.' },
    { name: 'Excel', c: '#A7D8C9', note: 'Pivot tables and VLOOKUPs. Still undefeated.' }
];

/* my Paper Mate pouch: my top five CliftonStrengths, one gel pen each */
window.GELPENS = [
    { name: 'Relator', c: '#D9467A', note: 'I build close, genuine relationships and love working hard alongside people toward a shared goal.' },
    { name: 'Empathy', c: '#B36FD1', note: 'I sense what people are feeling by putting myself in their shoes, often before they say a word.' },
    { name: 'Individualization', c: '#2E4A7A', note: 'I notice what makes each person unique, and how different people can work together best.' },
    { name: 'Developer', c: '#E86CA5', note: 'I see the potential in people and get real satisfaction from helping them grow.' },
    { name: 'Communication', c: '#7FC6E8', note: 'I put thoughts into words easily, whether it’s a conversation or a presentation.' }
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
