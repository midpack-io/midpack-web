/* global React, Icon, Button, Avatar, AvatarStack, PillInline, CfChip, CfAdd,
   StatusChip, IconButton, TopBar, STAGES, STYLES, STATUS_ICO */
// =====================================================================
// IG Studio · Bundle.jsx — single style detail with stage stepper,
// files area (or PDF preview), threaded comments, side panel.
// =====================================================================

const STATUS_ICONS = {
  passed: "✓", todo: "", active: "•", "in-review": "⌛", returned: "↩", canceled: "—",
};

function BundleHeader({ style, onBack }) {
  return (
    <div className="bundle-header">
      <button className="back-link" onClick={onBack} title="Back to list">
        <Icon name="arrowLeft" />
      </button>
      <div className="cover" style={{ backgroundImage: `url(${style.cover})` }} />
      <div className="title-block">
        <h1>
          <span style={{ color: "var(--ink-4)", fontWeight: 500 }}>Style {style.id}</span>
          <span className="dash">—</span>
          {style.name}
        </h1>
        <div className="title-meta">
          {style.tags.map((t, i) => <PillInline key={i} color={t.c}>{t.t}</PillInline>)}
          <span className="dot" />
          <span>Last edited 2h ago by Marta</span>
        </div>
        <div className="cf-row">
          {style.cf.map(([k,v]) => <CfChip key={k} k={k} v={v} />)}
          <CfAdd />
        </div>
      </div>
      <span className="header-spacer" />
      <div className="actions">
        <div className="role-stack">
          <Avatar person={style.performer} size="sm" />
          <Avatar person={style.approver} size="sm" approver />
        </div>
        <Button variant="ghost"><Icon name="share" size={13} />Share</Button>
        <Button variant="primary">Mark approved</Button>
      </div>
    </div>
  );
}

function BundleStepper({ states, activeStage }) {
  return (
    <>
      <div className="b-stepper">
        {STAGES.map((s, i) => (
          <React.Fragment key={s.num}>
            {i > 0 && <span className="connector" />}
            {s.parallel
              ? (
                <div style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>
                  {s.parallel.map(p => (
                    <span key={p.num} className={`pill ${states[p.num] || "todo"}`}>
                      <span className="ico">{STATUS_ICONS[states[p.num]] || ""}</span>
                      <span className="num">{p.num}</span>
                      <span>{p.label}</span>
                    </span>
                  ))}
                </div>
              )
              : (
                <span className={`pill ${states[s.num] || "todo"}`}>
                  <span className="ico">{STATUS_ICONS[states[s.num]] || ""}</span>
                  <span className="num">{s.num}</span>
                  <span>{s.label}</span>
                </span>
              )}
          </React.Fragment>
        ))}
      </div>
      <div className="active-detail">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="detail-label">Active stage:</span>
          <span className="detail-value">{activeStage.num} {activeStage.label}</span>
        </div>
        <div className="detail-divider" />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="detail-label">Performer:</span>
          <Avatar person="marta" size="sm" />
          <span className="detail-value">Marta</span>
        </div>
        <div className="detail-divider" />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="detail-label">Approver:</span>
          <Avatar person="olena" size="sm" approver />
          <span className="detail-value">Olena</span>
        </div>
        <div className="detail-divider" />
        <span className="deadline-line at-risk">
          <Icon name="alert" size={11} />Due Jun 12 · 2d left
        </span>
        <div className="detail-cta">
          <Button size="sm" variant="ghost"><Icon name="refresh" size={12} />Reopen</Button>
          <Button size="sm" variant="primary">Submit for review</Button>
        </div>
      </div>
    </>
  );
}

function FilesArea({ onPreview }) {
  const files = [
    { type: "PDF", name: "TP_001_dress.pdf", v: "v3", meta: "12 pages · 4.2 MB · Marta" },
    { type: "AI",  name: "Pattern_245.ai", v: "v1", meta: "2.1 MB · Pavlo" },
    { type: "PNG", name: "Front_render.png", v: "v2", meta: "1.4 MB · Marta" },
  ];
  return (
    <div className="files-area">
      <div className="files-head">
        <h2>Files <span style={{ color: "var(--ink-4)", fontWeight: 500, fontFamily: "var(--font-mono)", fontSize: 11.5, marginLeft: 6 }}>3</span></h2>
        <div style={{ display: "inline-flex", gap: 6 }}>
          <Button size="sm" variant="ghost"><Icon name="download" size={12} />Download all</Button>
          <Button size="sm"><Icon name="plus" size={12} />Add file</Button>
        </div>
      </div>
      <div className="files-list">
        {files.map((f, i) => (
          <div key={f.name} className={`file-row ${i === 0 ? "preview-open" : ""}`}
               onClick={() => onPreview(f)}>
            <div className="ftype">{f.type}</div>
            <div>
              <div className="fname">{f.name}</div>
              <div className="fmeta">{f.meta}</div>
            </div>
            <div className="fver">{f.v}</div>
            <IconButton icon="more" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewPane({ file, onClose }) {
  const [ver, setVer] = useState("v3");
  return (
    <div className="preview-pane">
      <div className="preview-head">
        <button className="close" onClick={onClose} title="Close">
          <Icon name="close" />
        </button>
        <div>
          <div className="fname">{file.name}</div>
          <div className="fbreadcrumb">Spring 2026 Launch / Style 247 / Files</div>
        </div>
        <div className="versions">
          {["v1","v2","v3"].map(v => (
            <button key={v} className={v === ver ? "active" : ""} onClick={() => setVer(v)}>{v}</button>
          ))}
        </div>
        <div style={{ display: "inline-flex", gap: 4 }}>
          <button className="close" title="Open in new"><Icon name="external" /></button>
          <button className="close" title="Download"><Icon name="download" /></button>
          <button className="close" title="More"><Icon name="more" /></button>
        </div>
      </div>
      <div className="preview-body">
        <div className="preview-page">
          <h3>Tech Pack · Style 247</h3>
          <div className="line" />
          <div className="line short" />
          <div className="line shorter" />
          <div className="sketch">[ sketch · front view ]</div>
        </div>
        <div className="preview-caption">Page 1 of 12 · TP_001_dress.pdf · {ver}</div>
      </div>
    </div>
  );
}

function Comments() {
  return (
    <div className="comments">
      <h2>Comments</h2>
      <div className="comment">
        <Avatar person="olena" size="sm" />
        <div>
          <div className="body">
            <span className="who">Olena</span>
            <span className="when">2h ago</span>
            <p>Looking good. Pinging Marta on the buttons in <span className="ref">@TP_001_dress.pdf v3</span> page 4 — let's go up to 14mm.</p>
          </div>
          <div className="replies">
            <div className="comment">
              <Avatar person="marta" size="sm" />
              <div className="body">
                <span className="who">Marta</span>
                <span className="when">1h ago</span>
                <p>Updating now — will re-submit by EOD.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="comment">
        <Avatar person="founder" size="sm" />
        <div className="body">
          <span className="who">Yuri</span>
          <span className="when">5h ago</span>
          <p>Reminder: linked to <span className="ref">Style 244</span> base block.</p>
        </div>
      </div>
    </div>
  );
}

function SidePanel({ style }) {
  return (
    <div className="bundle-col-side">
      <div className="side-section">
        <h3>Activity</h3>
        <div className="activity-item">
          <Avatar person="marta" size="sm" />
          <div>
            <span className="who">Marta</span> uploaded <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink-1)" }}>TP_001_dress.pdf v3</span>
            <div className="when">2h ago</div>
          </div>
        </div>
        <div className="activity-item">
          <Avatar person="olena" size="sm" approver />
          <div>
            <span className="who">Olena</span> moved stage <b>03 Pattern</b> to <b>active</b>
            <div className="when">3h ago</div>
          </div>
        </div>
        <div className="activity-item">
          <Avatar person="founder" size="sm" />
          <div>
            <span className="who">Yuri</span> linked <b>Style 244</b>
            <div className="when">Yesterday</div>
          </div>
        </div>
      </div>

      <div className="side-section">
        <h3>Linked styles</h3>
        <div className="linked-card">
          <div className="linked-eye">BASE BLOCK · STYLE 244</div>
          <div className="linked-name">Camel coat — base pattern</div>
        </div>
        <div className="linked-card">
          <div className="linked-eye">VARIANT · STYLE 249</div>
          <div className="linked-name">Camel coat — collar variant</div>
        </div>
      </div>

      <div className="side-section">
        <h3>Key dates</h3>
        <div className="key-date"><span className="lbl">Created</span><span className="val">Apr 12</span></div>
        <div className="key-date"><span className="lbl">Pattern due</span><span className="val">Jun 12</span></div>
        <div className="key-date"><span className="lbl">Sample due</span><span className="val">Jun 28</span></div>
        <div className="key-date"><span className="lbl">Ship</span><span className="val">Sep 10</span></div>
      </div>
    </div>
  );
}

function Bundle({ onNavigate, styleId, preview }) {
  const style = (window.STYLES || []).find(s => s.id === styleId) || window.STYLES[0];
  const [previewFile, setPreviewFile] = useState(preview ? { name: "TP_001_dress.pdf" } : null);
  // Sync when route prop changes (component instance stays mounted across navigations)
  React.useEffect(() => {
    setPreviewFile(preview ? { name: "TP_001_dress.pdf" } : null);
  }, [preview]);
  const activeStage = STAGES.find(s => style.states[s.num] === "active")
    || STAGES.find(s => s.parallel && s.parallel.some(p => style.states[p.num] === "active"))
    || STAGES[2];
  return (
    <div className="app">
      <TopBar
        crumbs={[
          { label: "Collections", target: { screen: "collections" } },
          { label: "Spring 2026 Launch", target: { screen: "products", collectionId: "spring26" } },
          { label: `Style ${style.id}` },
        ]}
        onNavigate={onNavigate}
      />
      <BundleHeader style={style} onBack={() => onNavigate({ screen: "products", collectionId: "spring26" })} />
      <BundleStepper states={style.states} activeStage={activeStage} />
      <div className="bundle-main">
        <div className="bundle-col-main">
          {previewFile
            ? <PreviewPane file={previewFile} onClose={() => setPreviewFile(null)} />
            : <FilesArea onPreview={setPreviewFile} />}
          {!previewFile && <Comments />}
        </div>
        <SidePanel style={style} />
      </div>
    </div>
  );
}

Object.assign(window, { Bundle });
