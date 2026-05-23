/* global React, Icon, Button, IconButton, Avatar, Dropdown, ViewToggle */
// =====================================================================
// IG Studio · shell.jsx
// Page chrome: top bar, workspace pill, breadcrumbs, page header, filter bar.
// =====================================================================

function WorkspacePill({ name = "Maison Roma", onClick }) {
  return (
    <button className="ws-pill" onClick={onClick}>
      <span className="ws-mark">IG</span>
      <span className="ws-name">{name}</span>
      <span className="ws-chev">▼</span>
    </button>
  );
}

function Crumbs({ items, onNavigate }) {
  return (
    <div className="crumbs">
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {isLast
              ? <span className="here">{c.label}</span>
              : <a onClick={() => onNavigate && onNavigate(c.target)}>{c.label}</a>}
            {!isLast && <span className="sep">/</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TopBar({ crumbs, onNavigate, viewer = "founder" }) {
  return (
    <div className="topbar">
      <WorkspacePill />
      <span className="topbar-divider" />
      <Crumbs items={crumbs} onNavigate={onNavigate} />
      <input className="topbar-search" placeholder="Search styles, files, comments…" />
      <span className="topbar-spacer" />
      <IconButton icon="bell" title="Notifications" />
      <IconButton icon="help" title="Help" />
      <Avatar person={viewer} initial="YO" />
    </div>
  );
}

function PageHeader({ eyebrow, title, sub, actions, cover }) {
  return (
    <div className="page-header">
      {cover}
      <div style={{ minWidth: 0, flex: 1 }}>
        {eyebrow && <div className="ph-eyebrow"><span className="dot" />{eyebrow}</div>}
        <h1 className="ph-title">{title}</h1>
        {sub && <div className="ph-sub">{sub}</div>}
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
    </div>
  );
}

function FilterBar({ tabs, activeTab, onTab, right }) {
  return (
    <div className="filter-bar">
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => onTab(t.id)}>
            {t.label}
            {t.count != null && <span className="tab-count">{t.count}</span>}
          </button>
        ))}
      </div>
      <span className="filter-spacer" />
      {right}
    </div>
  );
}

Object.assign(window, { WorkspacePill, Crumbs, TopBar, PageHeader, FilterBar });
