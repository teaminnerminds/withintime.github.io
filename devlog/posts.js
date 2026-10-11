/* ============================================================
   WITHIN TIME - Devlog Posts
   ============================================================

   HOW TO ADD A NEW POST
   ----------------------
   1. Copy one of the objects in the DEVLOG_POSTS array below.
   2. Give it a unique `slug` (lowercase, hyphen-separated, no spaces).
   3. Fill in title / date / tags / excerpt / cover / body.
      - `date` must be in "YYYY-MM-DD" format so posts sort correctly.
      - `cover` is optional, the path to an image relative to the site root.
      - `body` is plain HTML. Use <p>, <h3>, <img>, <ul> etc.
   4. Save this file, commit, and push to GitHub. That's it, there's
      no server, no login, no database. Whoever can push to this
      repository is the only person who can publish or edit a
      devlog post, which is exactly the access control needed here.
   5. New posts don't need to be added to the top or bottom, both
      index.html (teaser) and devlog.html (full list) sort by date
      automatically, newest first.

   ============================================================ */

const DEVLOG_POSTS = [
  {
    slug: 'welcome-to-the-chronicle',
    title: 'Welcome to the Chronicle',
    date: '2026-07-12',
    tags: ['Announcement'],
    cover: 'assets/screenshots/title-screen.png',
    excerpt: "This is where development updates for Within Time will live from now on: art, code, story, music, all of it.",
    body: `
      <p>Hey, this is the first entry in the Within Time devlog. From here on, this page is where I'll be posting real updates on development: new art, systems getting built out, story writing, music from Oxiqa, and the occasional detour when something breaks in an interesting way.</p>
      <p>The plan is to keep this updated regularly rather than let it go quiet for months at a time. If you want the short version of updates instead of the full write-up, the socials linked on the main site get shorter, more frequent posts. This is the place for the longer thoughts.</p>
      <p>Thanks for following along with Within Time so far. FATE CHANGES FOR NO ONE, but hopefully this devlog will make it feel a little less distant while you wait.</p>
    `
  },
  {
    slug: 'stance-system-deep-dive',
    title: 'A Deep Dive Into the STANCE System',
    date: '2026-07-05',
    tags: ['Combat', 'Design'],
    cover: 'assets/screenshots/combat-tutorial-toughness.png',
    excerpt: "Why turn-based combat needed a STANCE system, and how it changes the way you read every encounter.",
    body: `
      <p>One of the earliest design goals for Within Time's combat was to avoid the "select attack, watch numbers go down" loop that a lot of turn-based RPGs fall into. STANCE was built to make positioning and timing matter turn to turn, not just damage math.</p>
      <p>Each of the thirteen playable characters brings their own element into a fight, and STANCE is the layer that decides how those elements interact with whatever's standing across from you. Attack, Skill, and Guard aren't just menu options. Reading when to use each one is most of the challenge in harder encounters.</p>
      <p>More on the specific mechanics (and the numbers behind them) in a future post once the current combat balancing pass is further along.</p>
    `
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DEVLOG_POSTS;
}
