/* ============================================================
   <bundle-header> · light-DOM web component
   Single source of truth for the bundle-page header.
   Used by:
     - components/header.html (playground)
     - 01-default-desktop.html
     - 02-preview-open.html
   Loads styles from components/header.css (linked by host page).
   ============================================================ */

(function () {
  const TEMPLATE = `
<header class="bundle-header">
  <div class="header-main">
    <a class="back-link" href="#" title="Back to Workspace" aria-label="Back to Workspace">
      <svg class="ico-14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3L5 7l3.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div class="header-divider"></div>
    <div class="cover" title="Open cover preview"></div>
    <div class="title-block">
      <h1>
        <span class="editable-field" tabindex="0" title="Click to rename bundle">Style 247</span>
        <span class="title-dash">—</span>
        <span class="editable-field subtle" tabindex="0" title="Click to edit description">Navy blazer</span>
      </h1>
      <div class="title-meta">
        <span>Collection: <b>SS26</b></span>
        <span class="dot"></span>
        <span class="tag-group">
          <span class="pill-inline slate">bundle / s247</span>
          <span class="pill-inline indigo">outerwear</span>
          <span class="pill-inline pink">hero piece</span>
          <span class="pill-inline amber">sample-ready</span>
          <span class="pill-inline teal">SS26</span>
          <button class="pill-inline pill-add" type="button" title="Add tag">
            <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M6 2.5v7M2.5 6h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Tag
          </button>
        </span>
        <span class="dot"></span>
        <span>Updated <b>1h ago</b> by Marta</span>
      </div>
      <div class="custom-fields">
        <span class="cf-chip"><span class="cf-key">SKU</span><span class="cf-val">DR-247-AW25</span></span>
        <span class="cf-chip"><span class="cf-key">Season</span><span class="cf-val">AW 25</span></span>
        <span class="cf-chip"><span class="cf-key">Collection</span><span class="cf-val">Capsule №3</span></span>
        <span class="cf-chip cf-add" title="Add custom field">
          <svg class="ico-12" viewBox="0 0 12 12" fill="none"><path d="M6 2.5v7M2.5 6h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Field
        </span>
      </div>
    </div>
    <div class="header-spacer"></div>
    <div class="header-actions">
      <button class="btn ghost btn-sm" title="Members">
        <svg class="ico-14" viewBox="0 0 16 16" fill="none">
          <circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.3"/>
          <circle cx="11" cy="7" r="2" stroke="currentColor" stroke-width="1.3"/>
          <path d="M2 13c0-2 2-3.5 4-3.5s4 1.5 4 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <span>3</span>
      </button>
      <button class="btn">
        <svg class="ico-14" viewBox="0 0 14 14" fill="none">
          <rect x="3.5" y="3.5" width="8" height="9" rx="1.2" stroke="currentColor" stroke-width="1.3"/>
          <path d="M5.5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.3"/>
        </svg>
        Copy link
      </button>
      <button class="btn primary">
        <svg class="ico-14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7l3 3 5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Approve
      </button>
    </div>
  </div>
</header>
`;

  class BundleHeader extends HTMLElement {
    connectedCallback() {
      // Light DOM so host page styles cascade in.
      // Only render once; allow re-render via .render() if needed.
      if (!this._rendered) {
        this.innerHTML = TEMPLATE;
        this._rendered = true;
      }
    }

    // Hook for future state variants:
    //   <bundle-header state="archived">
    static get observedAttributes() { return ["state"]; }
    attributeChangedCallback() {
      const root = this.querySelector(".bundle-header");
      if (!root) return;
      root.dataset.state = this.getAttribute("state") || "default";
    }
  }

  if (!customElements.get("bundle-header")) {
    customElements.define("bundle-header", BundleHeader);
  }
})();
