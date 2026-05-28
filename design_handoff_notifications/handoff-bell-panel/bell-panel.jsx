/* ============================================================
   Bell-panel — interactive
   • Infinite scroll: appends pages via window.makePage(cursor,filter)
     when the list nears the bottom (IntersectionObserver sentinel).
   • Tabs filter (All / Unread / Mentions) — refetches from page 0.
   • Mark-all-read + per-row mark read.
   • "Open inbox" button intentionally removed.
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;
const ICONS = window.ICONS;

function Ico({ name, style }) {
  return <span style={{ display: "inline-flex", ...style }} dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }} />;
}

function Avatar({ n }) {
  return (
    <span className="av-wrap">
      <span className={`av av-30 ${n.actor.av}`}>
        {n.actor.system ? <Ico name="system" style={{ width: 13, height: 13 }} /> : n.actor.initials}
      </span>
      {n.badge && <span className={`av-badge b-${n.badge}`}><Ico name={n.badge} /></span>}
    </span>
  );
}

function Row({ n, onRead }) {
  return (
    <div className={`row ${n.read ? "" : "unread"} ${n.urgent ? "urgent" : ""}`}
      onClick={() => onRead(n.id)}>
      <Avatar n={n} />
      <div className="row-body">
        <div className="row-copy" dangerouslySetInnerHTML={{ __html: n.body }} />
        {n.quote && <div className="row-quote">{"\u201c" + n.quote + "\u201d"}</div>}
        <div className="row-meta">
          <span className="row-ago">{n.ago} ago</span>
          {n.pill && <span className={`pill ${n.pill.cls}`}>{n.pill.label}</span>}
          {n.action && (
            <button className="btn xs row-action"
              onClick={(e) => { e.stopPropagation(); onRead(n.id); }}>{n.action}</button>
          )}
        </div>
      </div>
      <span className="dot" />
    </div>
  );
}

const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "mentions", label: "Mentions" }
];

function Panel({ open }) {
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(5);
  const listRef = useRef(null);
  const cursorRef = useRef(0);
  const loadingRef = useRef(false);
  const doneRef = useRef(false);

  // (re)load from page 0 whenever the tab changes
  const reset = useCallback((nextTab) => {
    const first = window.makePage(0, nextTab);
    setItems(first.items);
    setCursor(first.nextCursor);
    cursorRef.current = first.nextCursor;
    setDone(first.nextCursor == null);
    doneRef.current = first.nextCursor == null;
    if (listRef.current) listRef.current.scrollTop = 0;
  }, []);

  useEffect(() => { reset(tab); }, [tab, reset]);

  // append the next page (simulated latency so the loader is visible)
  const loadMore = useCallback(() => {
    if (loadingRef.current || doneRef.current || cursorRef.current == null) return;
    loadingRef.current = true;
    setLoading(true);
    const c = cursorRef.current;
    setTimeout(() => {
      const pg = window.makePage(c, tab);
      setItems((prev) => prev.concat(pg.items));
      setCursor(pg.nextCursor);
      cursorRef.current = pg.nextCursor;
      if (pg.nextCursor == null) { setDone(true); doneRef.current = true; }
      setLoading(false);
      loadingRef.current = false;
    }, 550);
  }, [tab]);

  // scroll handler drives the infinite scroll (robust across browsers)
  const onScroll = useCallback((e) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 140) loadMore();
  }, [loadMore]);

  const markAll = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadTotal(0);
  };
  const markRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id && !n.read ? (setUnreadTotal((u) => Math.max(0, u - 1)), { ...n, read: true }) : n)));
  };

  // group consecutive items by their time bucket
  const groups = [];
  items.forEach((n) => {
    const last = groups[groups.length - 1];
    if (last && last.label === n.group) last.rows.push(n);
    else groups.push({ label: n.group, rows: [n] });
  });

  return (
    <div className={`panel ${open ? "" : "hidden"}`}>
      <div className="panel-caret" />
      <div className="panel-head">
        <div className="panel-title-row">
          <span className="panel-title">Notifications</span>
          {unreadTotal > 0 && <span className="pill coral">{unreadTotal} NEW</span>}
          <span className="spacer" />
          <button className="btn ghost xs" onClick={markAll} style={{ gap: 5 }}>
            <Ico name="check" style={{ width: 12, height: 12 }} /> Mark all read
          </button>
        </div>
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
              {t.id === "unread" && unreadTotal > 0 && <span className="cnt">{unreadTotal}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="list" ref={listRef} onScroll={onScroll}>
        {items.length === 0 && !loading && (
          <div className="empty">
            <Ico name="check" />
            <div className="t">You’re all caught up</div>
            <div className="s">No {tab === "mentions" ? "mentions" : "unread notifications"} right now.</div>
          </div>
        )}

        {groups.map((g, gi) => (
          <div key={gi}>
            <div className="grp">{g.label}</div>
            {g.rows.map((n) => <Row key={n.id} n={n} onRead={markRead} />)}
          </div>
        ))}

        {/* loader / end-of-feed */}
        {loading && (
          <div className="loader"><span className="spin" /> Loading earlier…</div>
        )}
        {done && items.length > 0 && (
          <div className="end-cap">That’s everything from the last 30 days</div>
        )}
      </div>

      <div className="panel-foot">
        <a className="foot-link" href="#"><Ico name="settings" /> Notification preferences</a>
      </div>
    </div>
  );
}

function PageGhost() {
  return (
    <div className="page-ghost">
      <div style={{ width: 180, height: 22, borderRadius: 6, background: "var(--surface-3)" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: 200, background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 10, padding: 12, height: 340 }}>
            <div style={{ width: 90, height: 12, background: "var(--surface-3)", borderRadius: 4 }} />
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {[0, 1, 2, 3].map((j) => (
                <div key={j} style={{ height: 54, background: "var(--surface-2)",
                  border: "1px solid var(--border)", borderRadius: 8 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header className="topbar">
        <div className="crumbs">
          <a href="#">CHER&#39;17</a><span className="sep">/</span>
          <a href="#">Resort &#39;25</a><span className="sep">/</span><span>Worklist</span>
        </div>
        <span className="spacer" />
        <input className="tb-search" placeholder="Search…" />
        <button className={`tb-iconbtn ${open ? "on" : ""}`} title="Notifications"
          onClick={() => setOpen((o) => !o)}>
          <Ico name="bell" />
          <span className="notif-count" style={{ opacity: open ? 0 : 1 }}>5</span>
        </button>
        <button className="tb-iconbtn" style={{ padding: 0 }}><span className="av av-26 av-anna">AK</span></button>
      </header>

      <div className="stage">
        <PageGhost />
        <div className={`scrim ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
        <Panel open={open} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
