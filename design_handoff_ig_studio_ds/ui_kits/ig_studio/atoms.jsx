/* global React */
// =====================================================================
// IG Studio · atoms.jsx
// Small, reusable building blocks: icons, buttons, avatars, chips, pills.
// Every component reads from project-wide tokens in colors_and_type.css.
// =====================================================================

const { useState } = React;

// ---------- Icon ----------
// All icons are inline SVG drawn on a 14×14 viewBox by default.
// stroke-width 1.4, round caps + joins, fill: none, currentColor.
function Icon({ name, size = 14, className = "", strokeWidth = 1.4 }) {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      {paths}
    </svg>
  );
}

// Curated icon set — kept tiny on purpose. Use Lucide for extras.
const ICONS = {
  plus:        <><path d="M7 2v10M2 7h10" /></>,
  search:      <><circle cx="6" cy="6" r="3.5" /><path d="M9 9l3 3" /></>,
  bell:        <><path d="M3.5 11h7l-1-1.5V6a2.5 2.5 0 1 0-5 0v3.5L3.5 11Z" /><path d="M5.5 11.5a1.5 1.5 0 0 0 3 0" /></>,
  help:        <><circle cx="7" cy="7" r="5" /><path d="M6 5.5a1 1 0 1 1 1.6.8c-.5.3-.6.7-.6 1.2M7 9v.01" /></>,
  more:        <><circle cx="3" cy="7" r=".7" fill="currentColor" /><circle cx="7" cy="7" r=".7" fill="currentColor" /><circle cx="11" cy="7" r=".7" fill="currentColor" /></>,
  arrowLeft:   <><path d="M9 3 5 7l4 4M5 7h6" /></>,
  arrowRight:  <><path d="M5 3l4 4-4 4M9 7H3" /></>,
  chev:        <><path d="M4 5l3 3 3-3" /></>,
  grid:        <><rect x="2" y="2" width="4" height="4" rx="0.5" /><rect x="8" y="2" width="4" height="4" rx="0.5" /><rect x="2" y="8" width="4" height="4" rx="0.5" /><rect x="8" y="8" width="4" height="4" rx="0.5" /></>,
  list:        <><path d="M3 4h8M3 7h8M3 10h8" /></>,
  board:       <><rect x="2" y="2.5" width="3" height="9" rx="0.5" /><rect x="6" y="2.5" width="3" height="6" rx="0.5" /><rect x="10" y="2.5" width="2" height="4" rx="0.5" /></>,
  share:       <><circle cx="3.5" cy="7" r="1.3" /><circle cx="10.5" cy="3.5" r="1.3" /><circle cx="10.5" cy="10.5" r="1.3" /><path d="M4.5 6.3L9.5 4M4.5 7.7L9.5 10" /></>,
  download:    <><path d="M7 2v6M4 6l3 3 3-3M3 11h8" /></>,
  external:    <><path d="M5 3H3v8h8V9M7 3h4v4M11 3 6 8" /></>,
  flag:        <><path d="M3 12V2M3 2h6l-1 2 1 2H3" /></>,
  alert:       <><path d="M7 1.5 1 11.5h12L7 1.5z" /><path d="M7 5v3M7 9.5v.5" /></>,
  reply:       <><path d="M5 5 2 7.5 5 10M2 7.5h6a3 3 0 0 1 3 3" /></>,
  refresh:     <><path d="M2 5.5a5 5 0 0 1 9-1M12 8.5a5 5 0 0 1-9 1" /><path d="M9.5 1.5v3h-3M4.5 12.5v-3h3" /></>,
  trending:    <><path d="M1.5 10.5 5 7l2.5 2.5L12.5 4" /><path d="M9 4h3.5v3.5" /></>,
  check:       <><path d="M3 7.5 5.5 10 11 4" /></>,
  paper:       <><path d="M3 1.5h5l3 3v8H3z" /><path d="M8 1.5v3h3" /></>,
  comment:     <><path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6l-3 2v-2H4a2 2 0 0 1-2-2z" /></>,
  close:       <><path d="M3 3l8 8M11 3l-8 8" /></>,
};


// ---------- Button ----------
// variant: primary | accent | ghost | cta-primary | (default)
// size:    default | sm
function Button({ children, variant = "default", size = "default", onClick, className = "", title, type = "button" }) {
  const cls = [
    "btn",
    variant !== "default" && variant,
    size === "sm" && "btn-sm",
    className,
  ].filter(Boolean).join(" ");
  return <button type={type} className={cls} onClick={onClick} title={title}>{children}</button>;
}

function IconButton({ icon, onClick, title, className = "" }) {
  return (
    <button className={`icon-btn ${className}`} onClick={onClick} title={title}>
      <Icon name={icon} />
    </button>
  );
}


// ---------- Avatar ----------
// Person classes: anna, olena, lina, pavlo, yuri, marta, roma, yulia, founder
// size: default 26 / sm 22 / xs 18
// approver: adds the green ✓ corner mark
function Avatar({ person = "anna", initial, size = "default", approver = false, className = "" }) {
  if (person === "none" || person == null) {
    return <span className={`avatar ${size !== "default" ? size : ""} av-none ${className}`}>?</span>;
  }
  const sizeCls = size === "default" ? "" : size;
  return (
    <span className={`avatar ${sizeCls} av-${person} ${approver ? "approver" : ""} ${className}`}>
      {initial || person.slice(0, 2).toUpperCase()}
    </span>
  );
}

function AvatarStack({ avatars }) {
  return (
    <span className="avatar-stack">
      {avatars.map((a, i) => <Avatar key={i} {...a} />)}
    </span>
  );
}


// ---------- Pill-inline (tag) ----------
// color: default | indigo | green | amber | pink | slate | teal
function PillInline({ children, color = "default", onClick }) {
  const cls = color === "default" ? "pill-inline" : `pill-inline ${color}`;
  return <span className={cls} onClick={onClick}>{children}</span>;
}


// ---------- CfChip (KEY · VALUE custom field) ----------
function CfChip({ k, v, onClick }) {
  return (
    <span className="cf-chip" onClick={onClick}>
      <span className="cf-key">{k}</span>
      <span className="cf-val">{v}</span>
    </span>
  );
}
function CfAdd({ onClick }) {
  return <span className="cf-chip add" onClick={onClick}>+ FIELD</span>;
}


// ---------- StatusChip ----------
// status: todo | in-progress | in-review | done | returned | canceled
const STATUS_LABEL = {
  "todo": "TODO",
  "in-progress": "IN PROGRESS",
  "in-review": "IN REVIEW",
  "done": "DONE",
  "returned": "RETURNED",
  "canceled": "CANCELED",
};
function StatusChip({ status, label, onClick }) {
  return (
    <button className={`status-chip ${status}`} onClick={onClick}>
      {(status === "in-progress" || status === "returned") &&
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />}
      <span>{label || STATUS_LABEL[status]}</span>
    </button>
  );
}


// ---------- Dropdown chip ----------
function Dropdown({ label, value, onClick }) {
  return (
    <button className="dd" onClick={onClick}>
      {label} <b>{value}</b><span className="chev">▼</span>
    </button>
  );
}


// ---------- View toggle (card / list / board) ----------
function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle">
      {["grid", "list", "board"].map(v => (
        <button key={v} className={value === v ? "active" : ""} onClick={() => onChange(v)} title={v}>
          <Icon name={v} />
        </button>
      ))}
    </div>
  );
}


// Expose to global so other Babel scripts can use them
Object.assign(window, {
  Icon, Button, IconButton, Avatar, AvatarStack,
  PillInline, CfChip, CfAdd, StatusChip, Dropdown, ViewToggle,
});
