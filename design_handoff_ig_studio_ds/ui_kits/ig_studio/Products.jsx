/* global React, Icon, Button, Avatar, AvatarStack, PillInline, CfChip,
   StatusChip, IconButton, TopBar, PageHeader, FilterBar, Dropdown,
   ViewToggle */
// =====================================================================
// IG Studio · Products.jsx — list of styles inside a collection
// Demonstrates: full product-row, returned-state banner, parallel stages
// =====================================================================

const STAGES = [
  { num: "01", label: "Brief" },
  { num: "02", label: "Design" },
  { num: "03", label: "Pattern" },
  { num: "04", label: "Sourcing", parallel: [
    { num: "04a", label: "Fabric" },
    { num: "04b", label: "Trims" },
  ]},
  { num: "05", label: "Sample" },
  { num: "06", label: "Review" },
  { num: "07", label: "Approval" },
  { num: "08", label: "Photo" },
  { num: "09", label: "Production" },
];

const STATUS_ICO = {
  passed: "✓", todo: "", active: "•", "in-review": "⌛", returned: "↩", canceled: "—",
};

function StepPill({ stage, status, compact }) {
  const cls = `pill ${status || "todo"}`;
  return (
    <span className={cls}>
      <span className="ico">{STATUS_ICO[status] || ""}</span>
      <span className="num">{stage.num}</span>
      <span>{stage.label}</span>
    </span>
  );
}

function ProductRowStepper({ states }) {
  // states: keyed by stage num — value is status string
  return (
    <div className="row-stepper">
      {STAGES.map((s, i) => {
        const isParallel = !!s.parallel;
        const node = isParallel
          ? <div key={s.num} className="parallel">
              {s.parallel.map(p => (
                <StepPill key={p.num} stage={p} status={states[p.num] || "todo"} />
              ))}
            </div>
          : <StepPill key={s.num} stage={s} status={states[s.num] || "todo"} />;
        return (
          <React.Fragment key={s.num}>
            {i > 0 && <span className="connector" />}
            {node}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const STYLES = [
  {
    id: 247,
    name: "Camel cardigan",
    cover: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=240&q=80",
    tags: [{ c: "default", t: "Cardigan" }, { c: "indigo", t: "FW25" }, { c: "green", t: "Camel" }],
    cf: [["SKU","A047-CRM"], ["FABRIC","Wool-cashmere"], ["MOQ","120"], ["COST","€82"]],
    performer: "marta", approver: "olena",
    status: "in-progress",
    states: { "01": "passed", "02": "passed", "03": "active", "04a": "todo", "04b": "todo" },
    activity: "Edited 2h ago by Marta",
  },
  {
    id: 248,
    name: "Wool-cashmere coat",
    cover: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=240&q=80",
    tags: [{ c: "default", t: "Outerwear" }, { c: "amber", t: "Hero" }, { c: "indigo", t: "FW25" }],
    cf: [["SKU","A048-CML"], ["FABRIC","Wool 70/30"], ["MOQ","60"]],
    performer: "olena", approver: "founder",
    status: "in-review",
    states: { "01":"passed","02":"passed","03":"passed","04a":"passed","04b":"passed","05":"passed","06":"in-review" },
    activity: "Submitted 4h ago by Olena",
  },
  {
    id: 251,
    name: "Linen midi dress",
    cover: "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=240&q=80",
    tags: [{ c: "default", t: "Dress" }, { c: "teal", t: "SS26" }, { c: "pink", t: "Capsule" }],
    cf: [["SKU","A051-LIN"], ["FABRIC","Linen"], ["MOQ","40"], ["SHIP","Sep 10"]],
    performer: "lina", approver: "olena",
    status: "in-progress",
    states: { "01":"passed","02":"passed","03":"active","04a":"active","04b":"active" },
    activity: "Two parallel branches in flight",
    parallelHint: true,
  },
  {
    id: 250,
    name: "Striped tee — base block",
    cover: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=240&q=80",
    tags: [{ c: "default", t: "Knit" }, { c: "slate", t: "Block" }],
    cf: [["SKU","A050-STR"]],
    performer: null, approver: null,
    status: "todo",
    states: { "01":"passed" },
    activity: "Ready · unassigned",
  },
  {
    id: 249,
    name: "Camel coat — collar variant",
    cover: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=240&q=80",
    tags: [{ c: "default", t: "Outerwear" }, { c: "indigo", t: "FW25" }],
    cf: [["SKU","A049-CML-V"], ["FABRIC","Wool"], ["MOQ","40"]],
    performer: "pavlo", approver: "olena",
    status: "returned",
    states: { "01":"passed","02":"passed","03":"passed","04a":"passed","04b":"passed","05":"returned" },
    activity: "Returned 2h ago by Olena",
    reason: "Buttons too small, needs the larger horn variant. Re-sample with 14mm.",
  },
];

function ProductRow({ s, onOpen }) {
  return (
    <div className="product-row" onClick={onOpen}>
      <div className="row-head">
        <div className="row-cover" style={{ backgroundImage: `url(${s.cover})` }} />
        <div className="row-title-block">
          <div className="row-title">
            <span className="num">Style {s.id}</span>
            <span className="dash">—</span>
            {s.name}
          </div>
          <div className="row-meta">
            {s.tags.map((t, i) => (
              <PillInline key={i} color={t.c}>{t.t}</PillInline>
            ))}
            <span className="dot" />
            <span>{s.activity}</span>
          </div>
          {s.cf.length > 0 &&
            <div className="row-cf">
              {s.cf.map(([k, v]) => <CfChip key={k} k={k} v={v} />)}
            </div>}
        </div>
        <div className="row-status">
          <div className="role-stack">
            <Avatar person={s.performer} size="sm" />
            <Avatar person={s.approver} size="sm" approver />
          </div>
          <StatusChip status={s.status} />
        </div>
        <div className="row-hover-actions">
          <IconButton icon="comment" title="Comments" />
          <IconButton icon="share" title="Share" />
          <IconButton icon="more" title="More" />
        </div>
      </div>
      {s.reason && (
        <div className="row-reason">
          <Icon name="alert" size={14} style={{ color: "var(--coral)", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div className="head">RETURNED BY OLENA · 2H AGO</div>
            <div className="body">{s.reason}</div>
          </div>
          <Button size="sm" variant="ghost" className="reply">
            <Icon name="reply" size={12} />Reply
          </Button>
        </div>
      )}
      <ProductRowStepper states={s.states} />
    </div>
  );
}

function Products({ onNavigate, collectionId }) {
  const coll = (window.COLLECTIONS || []).find(c => c.id === collectionId) || window.COLLECTIONS[0];
  const [tab, setTab] = useState("all");
  const [view, setView] = useState("list");
  return (
    <div className="app">
      <TopBar
        crumbs={[
          { label: "Collections", target: { screen: "collections" } },
          { label: coll.name },
        ]}
        onNavigate={onNavigate}
      />
      <PageHeader
        cover={<div style={{
          width: 56, height: 56, borderRadius: 8,
          background: `url(${coll.cover}) center/cover`,
          border: "1px solid var(--border)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
        }} />}
        eyebrow={coll.season}
        title={coll.name}
        sub={<>
          <span><b>{coll.styles}</b> styles</span>
          <span className="dotsep" />
          <span>Due <b>{coll.due}</b></span>
          <span className="dotsep" />
          <span>Owner <b>Marta</b></span>
        </>}
        actions={<>
          <Button variant="ghost"><Icon name="share" size={13} />Share</Button>
          <Button className="cta-primary">
            <Icon name="plus" size={13} />
            New style
          </Button>
        </>}
      />
      <FilterBar
        tabs={[
          { id: "all", label: "All", count: 14 },
          { id: "needs-you", label: "Needs you", count: 3 },
          { id: "in-review", label: "In review", count: 4 },
          { id: "returned", label: "Returned", count: 1 },
          { id: "in-prod", label: "In production", count: 0 },
          { id: "done", label: "Done", count: 6 },
        ]}
        activeTab={tab}
        onTab={setTab}
        right={<>
          <Dropdown label="Sort by" value="Last activity" />
          <Dropdown label="Owner" value="Anyone" />
          <ViewToggle value={view} onChange={setView} />
        </>}
      />

      <div className="products-wrap">
        {STYLES.map(s => (
          <ProductRow
            key={s.id}
            s={s}
            onOpen={() => onNavigate({ screen: "bundle", styleId: s.id })}
          />
        ))}
        <div className="new-row">
          <Icon name="plus" size={14} /> Add a style
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Products, STYLES, STAGES });
