/* ============================================================
   Bell-panel feed data + paginator (for infinite scroll demo)
   In production, replace makePage() with a real cursor-paged API
   call: GET /notifications?cursor=<c>&filter=<tab> -> { items, nextCursor }
   ============================================================ */
window.ICONS = {
  mention:'<svg viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2.3" stroke="currentColor" stroke-width="1.2"/><path d="M9.3 7v.8a1.6 1.6 0 0 0 3.2 0V7A5.5 5.5 0 1 0 9 11.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  review:'<svg viewBox="0 0 14 14" fill="none"><path d="M2.5 3.2h6M2.5 6h6M2.5 8.8h3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M8.6 9.4l1.4 1.4 2.4-2.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  approve:'<svg viewBox="0 0 14 14" fill="none"><path d="M3 7.3l2.5 2.5L11 4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  stage:'<svg viewBox="0 0 14 14" fill="none"><path d="M2 7h7m0 0L6.6 4.6M9 7l-2.4 2.4M12 3.5v7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  deadline:'<svg viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7.5" r="4.5" stroke="currentColor" stroke-width="1.3"/><path d="M7 5.2V7.5l1.6 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 1.8h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  system:'<svg viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="1.7" stroke="currentColor" stroke-width="1.2"/><path d="M7 2v1.6M7 10.4V12M2 7h1.6M10.4 7H12M3.6 3.6l1.1 1.1M9.3 9.3l1.1 1.1M10.4 3.6L9.3 4.7M4.7 9.3l-1.1 1.1" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
  bell:'<svg viewBox="0 0 14 14" fill="none"><path d="M3 10.5h8M4 10.5V7a3 3 0 0 1 6 0v3.5M5.5 11.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg viewBox="0 0 14 14" fill="none"><path d="M3 7.3l2.5 2.5L11 4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  settings:'<svg viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="1.8" stroke="currentColor" stroke-width="1.3"/><path d="M7 1.5v1.6M7 10.9v1.6M2.5 7H1M13 7h-1.5M3.7 3.7l-1-1M11.3 11.3l-1-1M3.7 10.3l-1 1M11.3 2.7l-1 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
};

/* canonical "recent" notifications (page 0) */
var BASE = [
  { kind:"mention", badge:"mention", actor:{name:"Olena",initials:"OD",av:"av-olena"}, read:false,
    body:'<span class="actor">Olena</span> mentioned you on <a class="ref" href="#">Linen wrap dress</a> in <a class="ref linkedref" href="#">Resort \u201925</a>',
    quote:"@anna can you confirm the hem length before retouch?", pill:{cls:"linked",label:"RESORT \u201925"}, action:"Reply" },
  { kind:"review", badge:"review", actor:{name:"Yuri",initials:"YB",av:"av-yuri"}, read:false,
    body:'<span class="actor">Yuri</span> requested your review on <a class="ref" href="#">SS24 Lookbook \u2014 Press kit</a>',
    pill:{cls:"amber",label:"DUE TODAY"}, action:"Review" },
  { kind:"stage", badge:"stage", actor:{name:"Lina",initials:"LK",av:"av-lina"}, read:false,
    body:'<span class="actor">Lina</span> moved <b>6 products</b> to Retouching in <a class="ref linkedref" href="#">Resort \u201925</a>',
    action:"Open" },
  { kind:"deadline", badge:"deadline", actor:{name:"System",av:"av-sys",system:true}, read:false, urgent:true,
    body:'<a class="ref linkedref" href="#">Resort \u201925</a> ships in <b>2 days</b> \u2014 6 products still in QA',
    pill:{cls:"coral",label:"AT RISK"}, action:"Open" },
  { kind:"approve", badge:"approve", actor:{name:"Marta",initials:"MV",av:"av-marta"}, read:true,
    body:'<span class="actor">Marta</span> approved your edits on <a class="ref" href="#">Silk slip \u2014 Noir</a>',
    pill:{cls:"green",label:"APPROVED"}, action:"View" },
  { kind:"mention", badge:"mention", actor:{name:"Pavlo",initials:"PR",av:"av-pavlo"}, read:false,
    body:'<span class="actor">Pavlo</span> assigned you <b>5 products</b> in <a class="ref linkedref" href="#">Resort \u201925</a>',
    action:"View queue" },
  { kind:"mention", badge:"mention", actor:{name:"Roma",initials:"RT",av:"av-roma"}, read:true,
    body:'<span class="actor">Roma</span> replied on <a class="ref" href="#">Wide-leg trouser \u2014 Sand</a>',
    quote:"Good catch \u2014 reshot the cuff this morning.", action:"View" },
  { kind:"system", badge:"system", actor:{name:"System",av:"av-sys",system:true}, read:true,
    body:'Export <a class="ref" href="#">Resort25_web.zip</a> finished \u2014 transit to Shopify complete',
    pill:{cls:"green",label:"DONE"}, action:"Download" },
  { kind:"system", badge:"system", actor:{name:"Lina",initials:"LK",av:"av-lina"}, read:true,
    body:'<span class="actor">Lina</span> shared <a class="ref" href="#">Resort \u201925 \u2014 on-figure</a> with you',
    action:"Open" },
  { kind:"review", badge:"review", actor:{name:"Yuri",initials:"YB",av:"av-yuri"}, read:true,
    body:'<span class="actor">Yuri</span> bumped a stale review \u2014 <a class="ref" href="#">SS24 Lookbook</a>',
    pill:{cls:"amber",label:"WAITING"}, action:"Review" },
  { kind:"system", badge:"system", actor:{name:"Roma",initials:"RT",av:"av-roma"}, read:true,
    body:'<span class="actor">Roma Tkachuk</span> joined the workspace as <b>Retoucher</b>', action:"View" },
  { kind:"approve", badge:"approve", actor:{name:"Marta",initials:"MV",av:"av-marta"}, read:true,
    body:'<span class="actor">Marta</span> approved <b>3 products</b> in <a class="ref linkedref" href="#">Resort \u201925</a>',
    pill:{cls:"green",label:"APPROVED"}, action:"View" }
];

/* time buckets each page falls into, oldest pages get older labels */
var BUCKETS = ["Today","Today","Yesterday","Yesterday","Earlier this week","Earlier this week","Last week","Last week"];
var AGOS = [["18m","42m","1h","2h","3h","5h"], ["8h","11h","1d","1d","1d","1d"],
            ["2d","2d","3d","3d","4d","4d"], ["6d","1w","1w","1w","2w","2w"]];

/* deterministic paginator — returns { items, nextCursor } for a given filter+cursor */
window.makePage = function (cursor, filter) {
  var page = cursor || 0;
  var agoSet = AGOS[Math.min(page, AGOS.length - 1)];
  var bucketA = BUCKETS[Math.min(page * 2, BUCKETS.length - 1)];
  var bucketB = BUCKETS[Math.min(page * 2 + 1, BUCKETS.length - 1)];
  var items = BASE.map(function (n, i) {
    var read = page === 0 ? n.read : true; // only the first page carries unread
    return Object.assign({}, n, {
      id: "p" + page + "-" + i,
      read: read,
      ago: agoSet[i % agoSet.length],
      group: i < 6 ? bucketA : bucketB
    });
  });
  if (filter === "unread") items = items.filter(function (n) { return !n.read; });
  if (filter === "mentions") items = items.filter(function (n) { return n.kind === "mention"; });
  // simulate a finite-but-deep history
  var hasMore = page < 6;
  return { items: items, nextCursor: hasMore ? page + 1 : null };
};
