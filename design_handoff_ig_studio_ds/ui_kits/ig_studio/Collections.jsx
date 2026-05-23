/* global React, Icon, Button, Avatar, AvatarStack, PillInline, IconButton,
   TopBar, PageHeader, FilterBar, Dropdown, ViewToggle */
// =====================================================================
// IG Studio · Collections.jsx — workspace landing
// =====================================================================

const COLLECTIONS = [
  {
    id: "spring26",
    season: "FW25 · Collection 04",
    name: "Spring 2026 Launch",
    cover: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80",
    styles: 14,
    due: "Jun 12",
    owner: "marta",
    progress: 64,
    progressClass: "mid",
    stages: { brief: 0, design: 1, copy: 0, review: 4, approval: 3, production: 6 },
    atRisk: true,
  },
  {
    id: "resort25",
    season: "Resort 25 · Capsule",
    name: "Resort Capsule",
    cover: "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=400&q=80",
    styles: 8,
    due: "Jul 30",
    owner: "olena",
    progress: 28,
    progressClass: "low",
    stages: { brief: 2, design: 3, copy: 1, review: 2, approval: 0, production: 0 },
    atRisk: false,
  },
  {
    id: "knitwear",
    season: "FW25 · Knitwear",
    name: "Knitwear FW25",
    cover: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
    styles: 11,
    due: "May 24",
    owner: "lina",
    progress: 90,
    progressClass: "high",
    stages: { brief: 0, design: 0, copy: 0, review: 0, approval: 2, production: 9 },
    atRisk: false,
  },
  {
    id: "outerwear",
    season: "FW25 · Outerwear",
    name: "Outerwear FW25",
    cover: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=400&q=80",
    styles: 6,
    due: "Aug 18",
    owner: "pavlo",
    progress: 12,
    progressClass: "low",
    stages: { brief: 4, design: 2, copy: 0, review: 0, approval: 0, production: 0 },
    atRisk: false,
  },
];

const STAGE_KEYS = ["brief", "design", "copy", "review", "approval", "production"];

function StageBar({ stages, total }) {
  return (
    <div className="stage-bar">
      {STAGE_KEYS.flatMap(k => {
        const count = stages[k] || 0;
        return Array.from({ length: count }, (_, i) => (
          <div key={k + i} className="stage-seg" data-stage={k}
               style={{ flex: 1 }} />
        ));
      })}
    </div>
  );
}

function StageLegend({ stages }) {
  return (
    <div className="stage-legend">
      {STAGE_KEYS.map(k => (
        <div key={k} className={`stage-cell ${stages[k] ? "" : "zero"}`} data-stage={k}>
          <span className="swatch" />
          <span className="stage-count-big">{stages[k] || 0}</span>
          <span className="stage-name">{k}</span>
        </div>
      ))}
    </div>
  );
}

function CollectionCard({ c, onOpen }) {
  return (
    <div className="coll-card" onClick={onOpen}>
      <div className="coll-card-top">
        <div className="coll-cover">
          <img src={c.cover} alt="" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="coll-eyebrow">
            <span className="season">{c.season}</span>
          </div>
          <h2 className="coll-name">{c.name}</h2>
          <div className="coll-meta">
            <span><b>{c.styles}</b> styles</span>
            <span className="dotsep" />
            <span>Due <b>{c.due}</b></span>
            {c.atRisk && <>
              <span className="dotsep" />
              <span className="at-risk"><Icon name="alert" size={12} />At risk</span>
            </>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <Avatar person={c.owner} size="sm" />
        </div>
      </div>

      <div className="coll-section">
        <div className="progress-row">
          <span className="section-label">Progress</span>
          <div className="progress-track">
            <div className={`progress-fill ${c.progressClass}`} style={{ width: `${c.progress}%` }} />
          </div>
          <span className="progress-pct">{c.progress}%</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <StageBar stages={c.stages} />
        </div>
        <div style={{ marginTop: 10 }}>
          <StageLegend stages={c.stages} />
        </div>
      </div>
    </div>
  );
}

function Collections({ onNavigate }) {
  const [tab, setTab] = useState("active");
  const [view, setView] = useState("grid");

  return (
    <div className="app">
      <TopBar
        crumbs={[{ label: "Collections" }]}
        onNavigate={onNavigate}
      />
      <PageHeader
        eyebrow="Workspace"
        title="Collections"
        sub={<>
          <span><b>4</b> active</span>
          <span className="dotsep" />
          <span><b>2</b> wrapping up</span>
          <span className="dotsep" />
          <span>1 at risk</span>
        </>}
        actions={<>
          <Button variant="ghost">Filter</Button>
          <Button className="cta-primary">
            <Icon name="plus" size={13} />
            New collection
          </Button>
        </>}
      />
      <FilterBar
        tabs={[
          { id: "active", label: "Active", count: 4 },
          { id: "all",    label: "All", count: 11 },
          { id: "archive", label: "Archive", count: 7 },
        ]}
        activeTab={tab}
        onTab={setTab}
        right={<>
          <Dropdown label="Sort by" value="Due date" />
          <Dropdown label="Owner" value="Anyone" />
          <ViewToggle value={view} onChange={setView} />
        </>}
      />

      <div className="grid-wrap">
        <div className="collections-grid">
          {COLLECTIONS.map(c => (
            <CollectionCard
              key={c.id}
              c={c}
              onOpen={() => onNavigate({ screen: "products", collectionId: c.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Collections, COLLECTIONS, STAGE_KEYS });
