/* =================================================================
   COMMENTS — mock data + renderer + thread navigation.
   Mounts into <aside class="side"> (replaces the previous tab body).
   ================================================================= */

(function () {
  const ME = "OL";           // current viewer — drives "Mentions me" filter
  const ACTIVE_STAGE = "Review"; // drives "Current stage" filter

  /* ============= People ============= */
  const PEOPLE = {
    OL: { name: "Olena Kravchuk",  role: "Designer" },
    MA: { name: "Marko Tkachenko", role: "Copywriter" },
    LI: { name: "Lina Hrytsenko",  role: "Art Director" },
    PA: { name: "Pavlo Shevchuk",  role: "Brand Manager" },
    YU: { name: "Yuri Bondarenko", role: "Producer" },
    AN: { name: "Anna Kovalenko",  role: "Project Lead" },
  };

  /* ============= File registry ============= */
  // type drives the icon. linked=true → purple-tinted chip (component file).
  const FILES = {
    "brief.pdf":          { type: "pdf",  stage: "Brief" },
    "hero-banner.psd":    { type: "psd",  stage: "Design" },
    "product-shot.jpg":   { type: "img",  stage: "Design" },
    "copy-draft.docx":    { type: "docx", stage: "Copy" },
    "brand-logo.svg":     { type: "svg",  stage: "Component", linked: true },
    "color-palette.pdf":  { type: "pdf",  stage: "Component", linked: true },
  };

  /* ============= Helper: token builders =================
     Use these to keep message bodies readable in the data block. */
  const m = (id) => ({ mention: id });
  const f = (name, version) => ({ file: name, version: version });
  const img = (label, variant) => ({ img: true, label, variant: variant || "a" });
  const br = "\n";

  /* ============= Main feed (18 entries) ============= */
  const FEED = [
    {
      id: 1, kind: "msg", author: "AN", stage: "Brief",
      date: "May 12", time: "09:14",
      body: [
        "Kicking this off. Brief is final — see ", f("brief.pdf"),
        ". Tagging owners: ", m("OL"), " on Design, ", m("MA"), " on Copy. ",
        "Deadline for the first design pass is May 15."
      ],
    },
    {
      id: 2, kind: "msg", author: "OL", stage: "Design",
      date: "May 12", time: "11:02",
      body: [
        "Started on the hero. First rough is up — ", f("hero-banner.psd", "v1"),
        ". Going with the warmer palette from ", f("color-palette.pdf", "v2"),
        ". Will iterate after lunch."
      ],
      thread: "t2",
    },
    {
      id: 3, kind: "sys", flavor: "linked",
      date: "May 12", time: "14:21",
      body: [
        "Component file ", f("brand-logo.svg"), " updated to ",
        { b: "v4" }, " in source library by ", m("PA"), ". Bundle now references v4."
      ],
    },
    {
      id: 4, kind: "msg", author: "OL", stage: "Design",
      date: "May 12", time: "14:38",
      body: [
        "Caught the logo bump — ", f("brand-logo.svg", "v4"),
        " is cleaner on dark, good call ", m("PA"), ". Refreshed the hero: ",
        f("hero-banner.psd", "v2"), ".", br,
        img("hero v2 · desktop crop · 480×220", "a")
      ],
    },
    {
      id: 5, kind: "msg", author: "MA", stage: "Copy",
      date: "May 12", time: "16:50",
      body: [
        "First draft of headline + sub: ", f("copy-draft.docx", "v1"),
        ". Leaned into the “fewer, sharper” direction from the brief. ",
        m("LI"), " — want a read before I send to Review?"
      ],
    },
    {
      id: 6, kind: "msg", author: "LI", stage: "Copy",
      date: "May 12", time: "17:22",
      quoteOf: 5,
      body: [
        "Headline works. Sub is doing two jobs — pick one. Also ",
        f("copy-draft.docx", "v1"), " line 4 contradicts the brief on pricing claims, double-check ",
        f("brief.pdf"), " page 3."
      ],
    },
    {
      id: 7, kind: "msg", author: "MA", stage: "Copy",
      date: "May 13", time: "09:08",
      body: [
        "Fixed both. New pass: ", f("copy-draft.docx", "v2"),
        ". Sub trimmed to one promise, pricing line removed."
      ],
    },
    {
      id: 8, kind: "msg", author: "OL", stage: "Design",
      date: "May 13", time: "10:44",
      body: [
        "Hero v3 is final from my side — ", f("hero-banner.psd", "v3"),
        ". Dropped ", f("product-shot.jpg"), " into the secondary slot. Moving stage to Review."
      ],
    },
    {
      id: 9, kind: "sys", flavor: "stage",
      date: "May 13", time: "10:44",
      body: [
        "Stage ", { b: "Design" }, " completed by ", m("OL"),
        ". ", { b: "Review" }, " is now active."
      ],
    },
    {
      id: 10, kind: "msg", author: "LI", stage: "Review",
      date: "May 13", time: "13:30",
      body: [
        "Walking through ", f("hero-banner.psd", "v3"), " and ",
        f("copy-draft.docx", "v2"), " together now. Quick notes incoming."
      ],
      thread: "t10",
    },
    {
      id: 11, kind: "msg", author: "LI", stage: "Review",
      date: "May 13", time: "13:41",
      body: [
        "The lockup on ", f("hero-banner.psd", "v3"),
        " looks tight against the right margin — see this crop:", br,
        img("margin crop · lockup vs right edge", "d"), br,
        "Compare to the spec in ", f("brief.pdf"),
        " (margin section). ", m("OL"), " can you nudge it 24px left?"
      ],
    },
    {
      id: 12, kind: "msg", author: "OL", stage: "Review",
      date: "May 13", time: "14:02",
      quoteOf: 11,
      body: [
        "On it. Will keep the same version number until Lina signs off — bumping to ",
        { b: "v3.1" }, " internally, then v4 on next post."
      ],
    },
    {
      id: 13, kind: "msg", author: "PA", stage: "Review",
      date: "May 13", time: "15:10",
      body: [
        "Skimmed the bundle. Brand-side I’m fine pending the margin fix. One nit: ",
        f("copy-draft.docx", "v2"), " uses “Spring ’26” once and “Spring 2026” once — pick one. ",
        m("MA"), "."
      ],
    },
    {
      id: 14, kind: "msg", author: "MA", stage: "Review",
      date: "May 13", time: "15:18",
      body: [
        "Consistency fix queued. Will push v3 once Olena’s hero is settled so we have one round of changes, not two."
      ],
    },
    {
      id: 15, kind: "msg", author: "AN", stage: "Approval",
      date: "May 14", time: "09:00",
      body: [
        "Heads up — Production needs final files by EOD May 16 to make the print slot. ",
        m("LI"), " ", m("PA"), " keep that in mind on approvals."
      ],
    },
    {
      id: 16, kind: "sys", flavor: "linked",
      date: "May 14", time: "11:47",
      body: [
        "Component file ", f("color-palette.pdf"), " updated to ", { b: "v3" },
        " in source library by ", m("PA"), ". Bundle still pinned to v2 — ",
        m("AN"), " review whether to bump."
      ],
    },
    {
      id: 17, kind: "msg", author: "AN", stage: "Bundle",
      date: "May 14", time: "12:05",
      body: [
        "Holding on the palette bump until after this launch — ",
        f("color-palette.pdf", "v2"), " stays. Pavlo, please apply v3 to the ",
        { b: "Summer" }, " collection bundles only."
      ],
    },
    {
      id: 18, kind: "msg", author: "YU", stage: "Production",
      date: "May 14", time: "16:20",
      body: [
        "Standing by. Will pick up the bundle the moment Approval flips. Reminder: I need ",
        f("hero-banner.psd"), " flattened + ", f("copy-draft.docx"),
        " as final-final, not “final v3.”"
      ],
    },
  ];

  /* ============= Threads ============= */
  const THREADS = {
    t10: {
      parentId: 10,
      replies: [
        {
          id: "T1", author: "LI", date: "May 13", time: "13:32",
          body: ["Note 1: type hierarchy on the hero. Subhead is competing with the headline — needs more contrast."],
        },
        {
          id: "T2", author: "OL", date: "May 13", time: "13:35",
          body: ["Weight or size?"],
        },
        {
          id: "T3", author: "LI", date: "May 13", time: "13:36", quoteOfTid: "T2",
          body: ["Size. Drop sub by 2px, keep the weight."],
        },
        {
          id: "T4", author: "OL", date: "May 13", time: "13:38",
          body: ["Got it. Also fixing the margin from your other note in the main feed."],
        },
        {
          id: "T5", author: "PA", date: "May 13", time: "13:55",
          body: [
            "Jumping in — make sure the ", f("brand-logo.svg", "v4"),
            " clear-space rule from the brand book still holds after the size change. ",
            "Easy to lose 4–8px of breathing room when you nudge type around.", br,
            img("brand book · logo clear-space rule", "b")
          ],
        },
        {
          id: "T6", author: "OL", date: "May 13", time: "14:10",
          body: [
            "Verified. Logo clear-space is unchanged. Sub is at -2px, hierarchy reads cleaner now.", br,
            img("before / after · hero type hierarchy", "c")
          ],
        },
        {
          id: "T7", author: "LI", date: "May 13", time: "14:14",
          body: ["👍 That’s the one. Once the margin fix lands I’ll move us to Approval."],
        },
      ],
    },
    t2: {
      parentId: 2,
      replies: [
        {
          id: "T1", author: "LI", date: "May 12", time: "11:20",
          body: ["Warmer is right for this product. Try the rougher swatch on the secondary."],
        },
        {
          id: "T2", author: "OL", date: "May 12", time: "11:25",
          body: ["Noted — will pull in fabric_swatches v3."],
        },
        {
          id: "T3", author: "LI", date: "May 12", time: "11:28",
          body: ["No rush. Want to see two options side-by-side before locking."],
        },
        {
          id: "T4", author: "OL", date: "May 12", time: "11:30",
          body: ["Will post both in the thread once they’re up."],
        },
      ],
    },
  };

  /* ============= SVG icons ============= */
  const SVG = {
    chev:    `<svg class="qq-chev" viewBox="0 0 10 10" fill="none"><path d="M2.5 4l2.5 2 2.5-2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    arrow:   `<svg viewBox="0 0 10 10" fill="none"><path d="M4 3l3 2-3 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    reply:   `<svg viewBox="0 0 14 14" fill="none"><path d="M9 4L5 8l4 4M5 8h5a2.5 2.5 0 0 0 0-5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    thread:  `<svg viewBox="0 0 14 14" fill="none"><path d="M3 4h8M3 7h6M3 10h4M11 8.5l2.5 2.5L11 13.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    more:    `<svg viewBox="0 0 14 14" fill="currentColor"><circle cx="3.5" cy="7" r="1"/><circle cx="7" cy="7" r="1"/><circle cx="10.5" cy="7" r="1"/></svg>`,
    back:    `<svg viewBox="0 0 14 14" fill="none"><path d="M9 3l-4 4 4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    close:   `<svg viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    sysLink: `<svg viewBox="0 0 12 12" fill="none"><path d="M5 4H3.5A2.5 2.5 0 0 0 3.5 9H5M7 9h1.5A2.5 2.5 0 0 0 8.5 4H7M4.5 6.5h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    sysOk:   `<svg viewBox="0 0 12 12" fill="none"><path d="M2.8 6l2.2 2.2 4.2-4.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    open:    `<svg viewBox="0 0 14 14" fill="none"><path d="M5 3H3.5A1.5 1.5 0 0 0 2 4.5v6A1.5 1.5 0 0 0 3.5 12h6A1.5 1.5 0 0 0 11 10.5V9M8.5 2.5H12M12 2.5V6M12 2.5L6.5 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    send:    `<svg viewBox="0 0 12 12" fill="none"><path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    fileIco: `<svg viewBox="0 0 12 12" fill="none"><path d="M3 1.5h4l2.5 2.5v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.1"/></svg>`,
    imgIco:  `<svg viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2"/><circle cx="5" cy="6" r="0.9" fill="currentColor"/><path d="M2.5 10.5l3-3 3 2.5 2-1.5 2.5 2" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  };

  const FILE_TYPE_CLASS = {
    pdf: "ft-pdf", xlsx: "ft-xlsx", docx: "ft-img",
    psd: "ft-figma", svg: "ft-dxf", img: "ft-img", jpg: "ft-img",
  };

  /* ============= Inline-entity renderer ============= */
  function renderTokens(tokens) {
    return tokens.map(t => {
      if (t === "\n") return "<br>";
      if (typeof t === "string") return escapeHtml(t);
      if (t.mention)  return renderMention(t.mention);
      if (t.file)     return renderFile(t.file, t.version);
      if (t.img)      return renderImg(t);
      if (t.b)        return `<b>${escapeHtml(t.b)}</b>`;
      return "";
    }).join("");
  }

  function renderMention(id) {
    const p = PEOPLE[id];
    if (!p) return `@${id}`;
    return `<span class="ent-mention" data-mention="${id}" title="${escapeHtml(p.role)}">
      <span class="avatar av-${id}">${id}</span>${escapeHtml(p.name)}
    </span>`;
  }

  function renderFile(name, version) {
    const info = FILES[name] || { type: "pdf" };
    const dot = name.lastIndexOf(".");
    const base = dot >= 0 ? name.slice(0, dot) : name;
    const ext = dot >= 0 ? name.slice(dot) : "";
    const iconCls = FILE_TYPE_CLASS[info.type] || "ft-img";
    const linkedCls = info.linked ? " is-linked" : "";
    return `<span class="ent-file${linkedCls}" data-file="${escapeHtml(name)}" data-ver="${escapeHtml(version || "")}" title="Open ${escapeHtml(name)}${version ? " " + version : ""}">
      <span class="file-ico ${iconCls}">${SVG.fileIco}</span>${escapeHtml(base)}<span class="ext">${escapeHtml(ext)}</span>${version ? `<span class="ver">${escapeHtml(version)}</span>` : ""}
    </span>`;
  }

  function renderImg(t) {
    return `<span class="ent-img var-${escapeHtml(t.variant || "a")}" data-img="${escapeHtml(t.label)}">
      <span class="img-ico">${SVG.imgIco}</span>
      <span class="img-label">${escapeHtml(t.label)}</span>
    </span>`;
  }

  /* ============= Message renderer ============= */
  function renderMessage(msg, opts) {
    opts = opts || {};
    if (msg.kind === "sys") return renderSystem(msg);

    const p = PEOPLE[msg.author] || { name: msg.author };
    const stageCls = "s-" + (msg.stage || "bundle").toLowerCase();
    const stageLabel = msg.stage || "Bundle";

    const quote = msg.quoteOf ? renderQuoteHeader(msg.quoteOf, opts.threadKey) : "";
    const threadAff = (!opts.inThread && msg.thread && THREADS[msg.thread])
      ? renderThreadAff(msg.thread)
      : "";

    return `
      <div class="cm-msg" data-msgid="${msg.id}" data-stage="${escapeHtml(stageLabel)}" data-author="${escapeHtml(msg.author)}">
        <div class="cm-msg-head">
          <span class="avatar av-${escapeHtml(msg.author)}">${escapeHtml(msg.author)}</span>
          <span class="author">${escapeHtml(p.name)}</span>
          <span class="ts">${escapeHtml(msg.time)}</span>
        </div>
        ${quote}
        <div class="cm-msg-body">${renderTokens(msg.body)}</div>
        ${threadAff}
        <div class="cm-actions">
          <button class="ab" title="Reply" data-action="reply" data-target="${msg.id}">${SVG.reply}</button>
          <button class="ab" title="Open thread" data-action="open-thread" data-thread="${msg.thread || ""}" data-target="${msg.id}">${SVG.thread}</button>
          <button class="ab" title="More">${SVG.more}</button>
        </div>
      </div>
    `;
  }

  function renderQuoteHeader(quoteOfId, threadKey) {
    // Find quoted message in main feed first, then in thread replies.
    let q = FEED.find(x => x.id === quoteOfId);
    let who = q ? PEOPLE[q.author].name : "";
    let snippet = q ? plainText(q.body) : "";
    if (!q && threadKey && THREADS[threadKey]) {
      const tq = THREADS[threadKey].replies.find(r => r.id === quoteOfId);
      if (tq) { who = PEOPLE[tq.author].name; snippet = plainText(tq.body); }
    }
    return `
      <div class="cm-quote" data-quote-of="${escapeHtml(String(quoteOfId))}">
        ${SVG.chev}
        <span class="qq-who">${escapeHtml(who)}</span>
        <span class="qq-text">${escapeHtml(snippet)}</span>
      </div>
    `;
  }

  function renderThreadAff(threadKey) {
    const t = THREADS[threadKey];
    if (!t) return "";
    const last = t.replies[t.replies.length - 1];
    // Unique participants (in order of first reply)
    const seen = new Set();
    const participants = [];
    t.replies.forEach(r => { if (!seen.has(r.author)) { seen.add(r.author); participants.push(r.author); } });
    const avStack = participants.slice(0, 3).map((a, i) =>
      `<span class="avatar av-${escapeHtml(a)}" style="z-index:${3 - i}">${escapeHtml(a)}</span>`
    ).join("");
    return `
      <button class="cm-thread-aff" data-action="open-thread" data-thread="${escapeHtml(threadKey)}">
        <span class="aff-avs">${avStack}</span>
        <span class="count">${t.replies.length} replies</span>
        <span class="last">· last reply ${escapeHtml(last.time)}</span>
      </button>
    `;
  }

  function renderSystem(msg) {
    const flavor = msg.flavor === "linked" ? "is-linked" : "is-stage";
    const icon = msg.flavor === "linked" ? SVG.sysLink : SVG.sysOk;
    return `
      <div class="cm-sys ${flavor}">
        <span class="sys-icon">${icon}</span>
        <span class="sys-body">${renderTokens(msg.body)}</span>
        <span class="sys-ts">${escapeHtml(msg.time)}</span>
      </div>
    `;
  }

  function renderThreadReply(reply, threadKey) {
    const p = PEOPLE[reply.author] || { name: reply.author };
    const quote = reply.quoteOfTid ? (() => {
      const tq = THREADS[threadKey].replies.find(r => r.id === reply.quoteOfTid);
      const who = tq ? PEOPLE[tq.author].name : "";
      const snippet = tq ? plainText(tq.body) : "";
      return `
        <div class="cm-quote">
          ${SVG.chev}
          <span class="qq-who">${escapeHtml(who)}</span>
          <span class="qq-text">${escapeHtml(snippet)}</span>
        </div>
      `;
    })() : "";
    return `
      <div class="cm-msg" data-msgid="${escapeHtml(reply.id)}">
        <div class="cm-msg-head">
          <span class="avatar av-${escapeHtml(reply.author)}">${escapeHtml(reply.author)}</span>
          <span class="author">${escapeHtml(p.name)}</span>
          <span class="ts">${escapeHtml(reply.time)}</span>
        </div>
        ${quote}
        <div class="cm-msg-body">${renderTokens(reply.body)}</div>
        <div class="cm-actions">
          <button class="ab" title="Quote-reply" data-action="quote-reply-thread" data-target="${escapeHtml(reply.id)}">${SVG.reply}</button>
          <button class="ab" title="More">${SVG.more}</button>
        </div>
      </div>
    `;
  }

  /* ============= Filtering ============= */
  function filterFeed(mode) {
    if (mode === "stage") {
      // Show: messages on active stage OR messages referencing a file in active stage.
      return FEED.filter(m => {
        if (m.stage === ACTIVE_STAGE) return true;
        if (m.kind === "msg" || m.kind === "sys") {
          for (const tok of m.body) {
            if (tok && tok.file && FILES[tok.file] && FILES[tok.file].stage === ACTIVE_STAGE) return true;
          }
        }
        return false;
      });
    }
    if (mode === "mentions") {
      return FEED.filter(m => {
        if (m.kind !== "msg" && m.kind !== "sys") return false;
        for (const tok of m.body) {
          if (tok && tok.mention === ME) return true;
        }
        return false;
      });
    }
    return FEED;
  }

  /* ============= Mount + render ============= */
  function mount() {
    const aside = document.querySelector("aside.side");
    if (!aside) return;

    // Replace tabs + body, keep tab strip with new wiring.
    aside.innerHTML = `
      <!-- ============== CONTROLS ROW (type switch + scope chips) ============== -->
      <div class="cm-controls-row">
        <button class="cm-type-switch" id="cmTypeBtn" type="button" aria-haspopup="listbox" aria-expanded="false">
          <span class="cm-type-label">Showing</span>
          <span class="cm-type-value" id="cmTypeValue">All</span>
          <span class="cm-type-count" id="cmTypeCount">${FEED.length}</span>
          <svg class="cm-type-chev" viewBox="0 0 10 10" fill="none" width="10" height="10"><path d="M2.5 4l2.5 2 2.5-2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="cm-chip-group" id="cmFilterRow">
          <span class="filter-chip" data-filter="stage">Current stage <span class="ct" id="cmCountStage">—</span></span>
          <span class="filter-chip" data-filter="mentions">@ Me <span class="ct" id="cmCountMentions">—</span></span>
        </div>
        <span class="feed-count" id="cmFeedCount"></span>

        <div class="cm-type-menu" id="cmTypeMenu" hidden role="listbox">
          <button class="cm-type-option" role="option" data-type="all">
            <span class="opt-name">All</span>
            <span class="opt-sub">Comments + activity</span>
            <span class="opt-count" id="cmOptAll">${FEED.length}</span>
          </button>
          <button class="cm-type-option" role="option" data-type="comments">
            <span class="opt-name">Comments</span>
            <span class="opt-sub">Human messages only</span>
            <span class="opt-count" id="cmOptComments">—</span>
          </button>
          <button class="cm-type-option" role="option" data-type="activity">
            <span class="opt-name">Activity</span>
            <span class="opt-sub">System events · file updates</span>
            <span class="opt-count" id="cmOptActivity">—</span>
          </button>
        </div>
      </div>

      <div class="comments-view" data-mode="feed" id="commentsView">

        <!-- ============== FEED ============== -->
        <div class="feed-mode">
          <div class="cm-scroll" id="cmScroll"></div>

          <div class="cm-composer">
            <div class="cm-composer-box">
              <div class="cm-composer-quote" id="feedComposerQuote" style="display:none;">
                <span class="qq-who"></span>
                <span class="qq-text"></span>
                <button class="qq-close" data-action="clear-feed-quote">✕</button>
              </div>
              <textarea class="cm-composer-input" rows="2" placeholder="Add a comment… use @ to mention, # to cite a file"></textarea>
              <div class="cm-composer-actions">
                <button class="tool" title="Mention">@</button>
                <button class="tool" title="Reference a file">#</button>
                <button class="tool" title="Attach image">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2"/><circle cx="5" cy="6" r="0.9" fill="currentColor"/><path d="M2.5 10.5l3-3 3 2.5 2-1.5 2.5 2" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
                </button>
                <button class="btn accent btn-sm submit">Send ${SVG.send}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ============== THREAD ============== -->
        <div class="thread-mode">
          <div class="thread-head">
            <button class="back" data-action="close-thread" title="Back to feed">${SVG.back}</button>
            <div>
              <div class="title">Thread</div>
              <div class="subtitle" id="threadSubtitle">—</div>
            </div>
            <button class="close" data-action="close-thread" title="Close">${SVG.close}</button>
          </div>

          <div class="thread-scroll" id="threadScroll"></div>

          <div class="cm-composer">
            <div class="cm-composer-anchor">
              <span class="at">Replying in thread</span>
            </div>
            <div class="cm-composer-box">
              <div class="cm-composer-quote" id="threadComposerQuote" style="display:none;">
                <span class="qq-who"></span>
                <span class="qq-text"></span>
                <button class="qq-close" data-action="clear-thread-quote">✕</button>
              </div>
              <textarea class="cm-composer-input" rows="2" placeholder="Reply…"></textarea>
              <div class="cm-composer-actions">
                <button class="tool" title="Mention">@</button>
                <button class="tool" title="Reference a file">#</button>
                <button class="tool" title="Attach image">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2"/><circle cx="5" cy="6" r="0.9" fill="currentColor"/><path d="M2.5 10.5l3-3 3 2.5 2-1.5 2.5 2" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
                </button>
                <button class="btn accent btn-sm submit">Reply ${SVG.send}</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    // Hide the old standalone .composer block if it survived elsewhere.
    document.querySelectorAll("aside.side .composer").forEach(c => c.remove());

    renderFilterCounts();
    setTypeFilter("all", { silent: true });
    setFilter("all");
    bind();
  }

  function renderFilterCounts() {
    const allList = filterByType(FEED, currentType);
    document.getElementById("cmCountStage").textContent = filterFeed("stage").length;
    document.getElementById("cmCountMentions").textContent = filterFeed("mentions").length;
    // Type-switch counts
    document.getElementById("cmOptAll").textContent = FEED.length;
    document.getElementById("cmOptComments").textContent = FEED.filter(m => m.kind === "msg").length;
    document.getElementById("cmOptActivity").textContent = FEED.filter(m => m.kind === "sys").length;
    document.getElementById("cmTypeCount").textContent = allList.length;
  }

  let currentType = "all";
  function filterByType(list, type) {
    if (type === "comments") return list.filter(m => m.kind === "msg");
    if (type === "activity") return list.filter(m => m.kind === "sys");
    return list;
  }
  function setTypeFilter(type, opts) {
    opts = opts || {};
    currentType = type;
    const labels = { all: "All", comments: "Comments", activity: "Activity" };
    document.getElementById("cmTypeValue").textContent = labels[type] || "All";
    document.querySelectorAll(".cm-type-option").forEach(o => {
      o.classList.toggle("active", o.dataset.type === type);
    });
    document.getElementById("cmTypeMenu").hidden = true;
    document.getElementById("cmTypeBtn").setAttribute("aria-expanded", "false");
    if (!opts.silent) {
      renderFilterCounts();
      setFilter(currentFilter);
    }
  }

  let currentFilter = "all";
  function setFilter(mode) {
    currentFilter = mode;
    document.querySelectorAll("#cmFilterRow .filter-chip").forEach(c => {
      c.classList.toggle("active", c.dataset.filter === mode);
    });
    let list = filterFeed(mode);
    list = filterByType(list, currentType);
    const scopeBits = [];
    if (currentType !== "all") scopeBits.push(currentType);
    if (mode === "stage") scopeBits.push(ACTIVE_STAGE);
    if (mode === "mentions") scopeBits.push("@" + ME);
    const scope = scopeBits.length ? scopeBits.join(" · ") : "all";
    document.getElementById("cmFeedCount").textContent = list.length + " · " + scope;

    // Group by date so the day separators stay accurate per filter.
    const html = [];
    let lastDate = null;
    list.forEach(msg => {
      if (msg.date !== lastDate) {
        html.push(`<div class="cm-day">${escapeHtml(msg.date)}</div>`);
        lastDate = msg.date;
      }
      html.push(renderMessage(msg));
    });
    if (!list.length) {
      html.push(`<div style="padding: 24px 16px; color: var(--ink-4); font-size: 12.5px; text-align: center;">No comments match this filter.</div>`);
    }
    document.getElementById("cmScroll").innerHTML = html.join("");
  }

  function openThread(threadKey) {
    const thread = THREADS[threadKey];
    if (!thread) return;
    const parent = FEED.find(x => x.id === thread.parentId);
    const target = document.getElementById("commentsView");
    target.dataset.mode = "thread";

    document.getElementById("threadSubtitle").textContent =
      `${thread.replies.length} replies · ${parent ? parent.stage : ""}`;

    let html = "";
    html += `<div class="thread-parent">${renderMessage(parent, { inThread: true })}</div>`;
    html += `<div class="thread-divider">${thread.replies.length} replies</div>`;
    thread.replies.forEach(r => {
      html += renderThreadReply(r, threadKey);
    });
    document.getElementById("threadScroll").innerHTML = html;
  }

  function closeThread() {
    document.getElementById("commentsView").dataset.mode = "feed";
  }

  /* ============= Event wiring ============= */
  function bind() {
    const aside = document.querySelector("aside.side");
    const root = document.getElementById("commentsView");
    if (!aside || !root) return;

    // Close type menu on outside click
    document.addEventListener("click", (e) => {
      const menu = document.getElementById("cmTypeMenu");
      const btn = document.getElementById("cmTypeBtn");
      if (!menu || menu.hidden) return;
      if (e.target.closest("#cmTypeMenu") || e.target.closest("#cmTypeBtn")) return;
      menu.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
    });

    aside.addEventListener("click", (e) => {
      // Type switch
      const tb = e.target.closest("#cmTypeBtn");
      if (tb) {
        const menu = document.getElementById("cmTypeMenu");
        const willOpen = menu.hidden;
        menu.hidden = !willOpen;
        tb.setAttribute("aria-expanded", String(willOpen));
        return;
      }
      const opt = e.target.closest(".cm-type-option");
      if (opt) {
        setTypeFilter(opt.dataset.type);
        return;
      }

      // Filter chips — toggleable (click active chip again to clear)
      const chip = e.target.closest("#cmFilterRow .filter-chip");
      if (chip) {
        const next = chip.classList.contains("active") ? "all" : chip.dataset.filter;
        setFilter(next);
        return;
      }

      // Open thread — from affordance OR from message action
      const opener = e.target.closest('[data-action="open-thread"]');
      if (opener) {
        const tk = opener.dataset.thread;
        if (tk) openThread(tk);
        return;
      }

      // Close thread (back arrow or X)
      if (e.target.closest('[data-action="close-thread"]')) {
        closeThread();
        return;
      }

      // Reply (main feed) → prefill composer quote header
      const replyBtn = e.target.closest('[data-action="reply"]');
      if (replyBtn) {
        const id = parseInt(replyBtn.dataset.target, 10);
        const q = FEED.find(x => x.id === id);
        if (q) {
          const box = document.getElementById("feedComposerQuote");
          box.querySelector(".qq-who").textContent = PEOPLE[q.author].name;
          box.querySelector(".qq-text").textContent = plainText(q.body);
          box.style.display = "flex";
          document.querySelector(".feed-mode .cm-composer-input").focus();
        }
        return;
      }

      if (e.target.closest('[data-action="clear-feed-quote"]')) {
        document.getElementById("feedComposerQuote").style.display = "none";
        return;
      }
      if (e.target.closest('[data-action="clear-thread-quote"]')) {
        document.getElementById("threadComposerQuote").style.display = "none";
        return;
      }

      // Thread quote-reply
      const qrt = e.target.closest('[data-action="quote-reply-thread"]');
      if (qrt) {
        const tid = qrt.dataset.target;
        const tk = root.querySelector("#threadSubtitle");
        // figure out which thread is open
        const openThreadKey = Object.keys(THREADS).find(k =>
          THREADS[k].replies.some(r => r.id === tid)
        );
        if (openThreadKey) {
          const tq = THREADS[openThreadKey].replies.find(r => r.id === tid);
          if (tq) {
            const box = document.getElementById("threadComposerQuote");
            box.querySelector(".qq-who").textContent = PEOPLE[tq.author].name;
            box.querySelector(".qq-text").textContent = plainText(tq.body);
            box.style.display = "flex";
            document.querySelector(".thread-mode .cm-composer-input").focus();
          }
        }
        return;
      }

      // Quote-header expand toggle
      const quote = e.target.closest(".cm-quote");
      if (quote) {
        quote.classList.toggle("expanded");
        return;
      }
    });
  }

  /* ============= Utilities ============= */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function plainText(tokens) {
    return tokens.map(t => {
      if (t === "\n") return " ";
      if (typeof t === "string") return t;
      if (t.mention) return "@" + (PEOPLE[t.mention] ? PEOPLE[t.mention].name : t.mention);
      if (t.file)    return "#" + t.file + (t.version ? " " + t.version : "");
      if (t.img)     return "[image]";
      if (t.b)       return t.b;
      return "";
    }).join("").replace(/\s+/g, " ").trim();
  }

  /* ============= Init ============= */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
