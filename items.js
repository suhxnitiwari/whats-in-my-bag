/* Everything in my bag. Each thing has:
   id, name (the hover tag), where it lands once it falls out (l, t, w, r: left/top/width as % of the table, rotation),
   art (a doodle for now; swap in a photo of the real thing any time with  art: '<img src="assets/img/....png" alt="">'),
   and open(), what you see when you pick it up. */

const INK = '#3A2626';
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

window.BAG = {
    closed: `<svg viewBox="0 0 300 330" aria-hidden="true">
        <path d="M104 64 C104 20 196 20 196 64" fill="none" ${S} stroke-width="10"/>
        <path d="M104 64 C104 20 196 20 196 64" fill="none" stroke="#F2C6C8" stroke-width="4" stroke-linecap="round"/>
        <rect x="40" y="60" width="220" height="250" rx="60" fill="#E9A9B6" ${S}/>
        <path d="M40 150 C40 96 260 96 260 150 L260 176 C200 196 100 196 40 176Z" fill="#F2C6C8" ${S}/>
        <path d="M72 160 C120 172 180 172 228 160" fill="none" ${S} stroke-dasharray="2 8"/>
        <rect x="136" y="170" width="28" height="30" rx="6" fill="#D9A441" ${S}/>
        <rect x="80" y="218" width="140" height="70" rx="22" fill="#F2C6C8" ${S}/>
        <path d="M80 238 H220" ${S} fill="none"/>
        <path d="M144 238 v6" ${S}/>
        <circle cx="96" cy="258" r="9" fill="#FFF" ${S}/><path d="M92 258 l3 3 6-6" fill="none" ${S} stroke-width="2"/>
        <path d="M200 252 l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" fill="#F8E7A9" ${S} stroke-width="2"/>
    </svg>`,
    open: `<svg viewBox="0 0 300 330" aria-hidden="true">
        <path d="M104 64 C104 20 196 20 196 64" fill="none" ${S} stroke-width="10"/>
        <rect x="40" y="60" width="220" height="250" rx="60" fill="#E9A9B6" ${S}/>
        <ellipse cx="150" cy="104" rx="96" ry="34" fill="#3B1524" ${S}/>
        <path d="M44 120 C60 170 240 170 256 120" fill="#F2C6C8" ${S}/>
        <path d="M60 40 C90 70 210 70 240 40 C236 16 64 16 60 40Z" fill="#F2C6C8" ${S} transform="rotate(-14 150 40)"/>
        <rect x="80" y="218" width="140" height="70" rx="22" fill="#F2C6C8" ${S}/>
        <path d="M80 238 H220" ${S} fill="none"/>
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
        id: 'pouch', name: 'my pencil pouch', l: 14, t: 82, w: 16, r: 7,
        art: `<svg viewBox="0 0 240 130"><rect x="16" y="26" width="208" height="96" rx="40" fill="#D9C8F0" ${S}/><path d="M34 40 H206" ${S} stroke-dasharray="6 6"/><rect x="198" y="30" width="22" height="16" rx="4" fill="#D9A441" ${S}/><path d="M209 46 v18" ${S}/><circle cx="209" cy="68" r="5" fill="#F4A7B9" ${S} stroke-width="2"/><rect x="60" y="4" width="10" height="44" rx="3" fill="#F8E7A9" ${S} stroke-width="2" transform="rotate(-10 65 26)"/><rect x="84" y="0" width="10" height="48" rx="3" fill="#F4A7B9" ${S} stroke-width="2" transform="rotate(6 89 24)"/><rect x="108" y="6" width="10" height="42" rx="3" fill="#CDE6D0" ${S} stroke-width="2" transform="rotate(-4 113 27)"/><path d="M70 92 q10 -12 20 0 q10 12 20 0" fill="none" ${S} stroke-width="2"/><text x="150" y="98" font-family="Caveat" font-size="22" fill="${INK}">s.t.</text></svg>`,
        open: 'pouch'
    },
    {
        id: 'sunglasses', name: 'my sunglasses', l: 34, t: 85, w: 14, r: -6,
        art: `<svg viewBox="0 0 240 110"><defs><linearGradient id="lens" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2226"/><stop offset="1" stop-color="#9C979C"/></linearGradient></defs><path d="M8 26 L-2 12" ${S} stroke-width="6"/><path d="M232 26 L242 12" ${S} stroke-width="6"/><rect x="8" y="20" width="96" height="74" rx="16" fill="#1E1414" ${S}/><rect x="136" y="20" width="96" height="74" rx="16" fill="#1E1414" ${S}/><rect x="18" y="30" width="76" height="54" rx="10" fill="url(#lens)"/><rect x="146" y="30" width="76" height="54" rx="10" fill="url(#lens)"/><path d="M104 40 Q120 28 136 40" fill="none" ${S} stroke-width="8"/><path d="M104 40 Q120 28 136 40" fill="none" stroke="#1E1414" stroke-width="4"/><rect x="4" y="22" width="8" height="30" rx="2" fill="#D9A441" ${S} stroke-width="2"/><rect x="228" y="22" width="8" height="30" rx="2" fill="#D9A441" ${S} stroke-width="2"/><path d="M26 38 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="M154 38 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg>`,
        open: 'sunglasses'
    },
    {
        id: 'keys', name: 'my car keys', l: 52, t: 87, w: 8, r: 14,
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
        id: 'notebooks', name: 'my notebooks', l: 70, t: 80, w: 13, r: 8,
        art: `<svg viewBox="0 0 180 170"><rect x="30" y="14" width="130" height="150" rx="8" fill="#CDE6D0" ${S} transform="rotate(8 95 89)"/><rect x="22" y="12" width="130" height="150" rx="8" fill="#CFE3F3" ${S} transform="rotate(-5 87 87)"/><rect x="18" y="10" width="130" height="150" rx="8" fill="#F2C6C8" ${S}/><path d="M36 10 V160" ${S} stroke-width="2.5"/><rect x="54" y="40" width="74" height="36" rx="4" fill="#FFFBF8" ${S} stroke-width="2.5"/><text x="91" y="64" text-anchor="middle" font-family="Caveat" font-size="20" fill="${INK}">MIS 301</text><path d="M148 30 h10 v16 h-10" fill="#F8E7A9" ${S} stroke-width="2"/></svg>`,
        open: 'notebooks'
    },
    {
        id: 'laptop', name: 'my laptop', l: 72, t: 44, w: 14, r: 4,
        art: `<svg viewBox="0 0 240 170"><rect x="10" y="8" width="220" height="150" rx="14" fill="#C9CDD3" ${S}/><circle cx="120" cy="80" r="14" fill="#E8EDF2" ${S} stroke-width="2"/><circle cx="46" cy="40" r="18" fill="#F4A7B9" ${S} stroke-width="2.5"/><path d="M40 40 l4 4 8-8" fill="none" ${S} stroke-width="2.5"/><rect x="160" y="26" width="48" height="26" rx="8" fill="#F8E7A9" ${S} stroke-width="2.5" transform="rotate(8 184 39)"/><text x="184" y="44" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="${INK}" transform="rotate(8 184 39)">SQL</text><path d="M170 120 l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z" fill="#CDE6D0" ${S} stroke-width="2.5"/><rect x="34" y="112" width="60" height="22" rx="11" fill="#D9C8F0" ${S} stroke-width="2.5"/><text x="64" y="127" text-anchor="middle" font-family="Caveat" font-size="15" fill="${INK}">hook 'em</text></svg>`,
        open: 'laptop'
    }
];

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
    { name: 'Python', c: '#F8E7A9', note: 'Listening History’s pipeline and the Saturday in Austin planner.' },
    { name: 'SQL', c: '#F4A7B9', note: 'CTEs, window functions, stored procedures. The streak finder. My favorite pen.' },
    { name: 'C#', c: '#D9C8F0', note: 'RideFlow, Bevo’s Tacos, and my whole portfolio site in ASP.NET Core.' },
    { name: 'JavaScript', c: '#CDE6D0', note: 'Every interaction you’ve touched on this page.' },
    { name: 'Snowflake', c: '#CFE3F3', note: 'Where my ride-share database runs, rollbacks and all.' },
    { name: 'Tableau', c: '#F2C6C8', note: 'For when a number needs to be a picture.' },
    { name: 'Power BI', c: '#F8E7A9', note: 'Dashboards, the business-school way.' },
    { name: 'Excel', c: '#DDE2CF', note: 'Pivot tables and VLOOKUPs. Still undefeated.' }
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
