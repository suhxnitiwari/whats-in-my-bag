# What's in my bag?

*Everything I carry around, and what each thing says about me.*

**Live:** [suhxnitiwari.github.io/whats-in-my-bag](https://suhxnitiwari.github.io/whats-in-my-bag/)

## What it is

An interactive portrait told through my backpack. Pull a zipper and that pocket's things fall out onto the table,
stop-motion style. Tap anything to pick it up and it opens into something about me: my Spotify data, my art, my
classes, my desktop, my little sister's cards. Every object is hand-drawn, and most of them do something.

## How it's built

- **Everything is drawn in code.** Each item is an SVG illustration defined in `items.js`, many drawn from photos of the
  real thing, so adding something to my bag is one entry.
- **A real-size table.** Items are laid out at true physical scale (1 cm = 0.94% of the table width, the 32 cm backpack
  is 30%), with rotated bounding boxes packed into centered rows around the bag. You can drag anything to rearrange it,
  and a tap still picks it up.
- **Sound with no audio files.** Every zipper, landing thud, spritz and sparkle is synthesized with the Web Audio API
  from oscillators and a noise buffer, run through one master chain (low-pass filter, compressor, and a convolution reverb
  built from a generated impulse response). The mute setting is remembered.
- **Canvas drawing tools.** The pen pouch opens to a notebook page where you write in any of 20 gel-pen colors. Ink and
  graphite live on separate canvas layers, so the eraser only ever erases pencil and the correction tape only covers ink.
  The Apple Pencil opens a blank canvas.
- **Live data.** The phone's lock screen shows Austin time and current weather from the Open-Meteo API (cached for 10
  minutes), and music buttons fetch official 30-second song previews from the iTunes Search API on demand.
- **Nested sheets.** Opening a sticker, app or link from inside another item stacks a new page on top and keeps the one
  underneath exactly as it was, so back lands you where you left off. Focus returns to whatever you tapped.
- **Accessible by default.** Hundreds of ARIA labels, live regions for toasts, keyboard support, focus management, and
  `prefers-reduced-motion` honored throughout.
- **No framework, no build step.** Plain HTML, CSS and JavaScript (~5,300 lines of JS, ~3,500 lines of CSS).

## What falls out

Tap anything that falls out and it opens:

| In my bag | What it opens |
|---|---|
| AirPods Max (Starlight) | My listening data: four years of Spotify in a SQL warehouse |
| Strathmore Mixed Media sketchbook (11×14, pink) | A flip-through of my digital art |
| Victoria's Secret makeup pouch | Unzip it: Westman Atelier lipstick (Glögg), Westman Baby Cheeks blush (Mimi), Hourglass Vanish concealer, Charlotte Tilbury Beautiful Skin foundation (6N), Lancôme Lash Idôle, Make Up For Ever Artist Color Pencil lip liner (600 Anywhere Caffeine) and my Morphe brushes (M241, M242, M132, Eye Want It All set) pop out. Then wave the wand: bibbidi bobbidi boo, before and after |
| Passport | Stamps: Thailand and Malaysia (2010), Switzerland, France and Italy (2016), Mexico (2020) |
| Wallet (LV Victorine) | Opens into the raspberry trifold: cards tucked in the slots (UT ID, a joke Texas license, BofA credit and debit, Delta Gold, Amex Blue Cash Everyday; no numbers, ever), and one $20 (emergencies only, it’s all Apple Pay) + one ₹500 behind the flap, a keepsake from a visit to India |
| Mildliner pouch | The full 25-pack: every color is a class I took at UT Austin, highlighted when you pick it |
| Paper Mate pouch | 20 InkJoy Gel pens: pick one and type in its color (switch mid-sentence), plus my BIC mechanical pencils: an erasable sketch pad |
| Phone (iPhone 18 Pro Max, pink case) | Photos, Instagram, LinkedIn, Spotify, YouTube, Netflix, Prime, Google Calendar and Duolingo |
| Sunglasses | How I see things (and they tint the whole page) |
| Reading glasses (black, gold bees) | A note that's a blur until you put them on |
| Car keys + apartment fob | The truth about my driving, and the way home |
| Chanel Double Facettes mirror (the Blair Waldorf one) | The real me |
| iPad | Pinterest (my board), Procreate (my art), and a folder of things I built |
| Apple Pencil Pro (clipped to the iPad) | A blank canvas: draw anything |
| MacBook Pro 14" (silver) | My real sticker layout (every sticker opens a project), and it opens to my desktop: one folder per project |
| Erin Condren notebooks | My classes |
| Pink Stanley | Slides out of the side pocket, the lid twists off; a water tracker, because I don't drink enough water |
| Medici regulars card (in the wallet's zip pocket) | A vanilla latte a day: stamp it, buy 10 & get 1 free |
| You Deserve Each Other, Sarah Hogle (paperback rom-com) | Three weeks in my backpack, still on chapter one |
| Brown NY cap | A cap is a must |
| iPhone: Contacts app | "do you wanna connect with me?" — add your name + number (sends to me by email), or save my contact card |
| philosophy amazing grace ballet rose (front pocket) | Spritz it |
| Boarding pass (front pocket) | Destination: wherever's next |
| Pink “her greatest power is believing in herself” journal (B6) | Leave an idea on the page |
| T.D., my teddy bear | The first gift I ever bought my little sister |
| Amaira’s cards | The cards my little sister makes me; I keep all of them |
| Backup lipstick (sunglasses pocket) | Dry lips, always. Lipstick is my favorite makeup product |
| McCombs padfolio | Résumés in the pocket (links to my résumé), a pen, a legal pad you can write on |
| Two silk scrunchies and a wide-tooth comb | Try each one on; drag the comb down through my hair, frizz to smooth |
| Pink Ralph Lauren cable knit sweater | Because I get cold easily |
| McCombs keychain | Why McCombs |
| Bath & Body Works caramel frappuccino PocketBac holder (Cozy Vanilla Almond inside) | Clipped to the outside: sanitize your hands before you touch my stuff |

## Personal branding 101, taught by my bag

Tap **✦ personal branding 101** under the title. Four zippers, four lessons, each with proof from my bag, a quick check and a "your turn":

1. **The work: proof beats claims.** My AirPods Max, MacBook and padfolio
2. **The mind: how you think is the brand.** My Mildliners, InkJoy pens and sketchbook
3. **The heart: people remember why, not what.** T.D., Amaira's cards and the pads
4. **The look: your color, your cart, your brand.** Color and buying habits: my palette, my Westman staples, the LV wallet with a Medici punch card, the pink Stanley and the gift cards

Then you pack your own bag: everything you wrote becomes one brand statement, in your color, that you can copy. Your answers stay in your browser.

## Tech stack

HTML · CSS · vanilla JavaScript · SVG · Canvas 2D · Web Audio API · Open-Meteo and iTunes Search APIs · GitHub Pages

## Run it

Open `index.html`, or serve the folder:

```
python3 -m http.server
```

## Ownership

© 2026 Suhani Tiwari. All rights reserved. The code is public so you can see how I build, not so you can reuse it. Brand names describe things I own; the drawings are my own illustrations and aren't affiliated with any brand.

Built by [Suhani Tiwari](https://suhanitiwari.com).
