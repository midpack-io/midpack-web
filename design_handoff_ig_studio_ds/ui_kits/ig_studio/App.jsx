/* global React, ReactDOM, Collections, Products, Bundle */
// =====================================================================
// IG Studio · App.jsx — tiny screen router for the demo
// History pattern: state-only, three screens.
// =====================================================================

const { useState, useEffect, useCallback } = React;

function App() {
  const [route, setRoute] = useState(() => {
    // initial route from hash for deep links
    try {
      const h = window.location.hash.replace(/^#/, "");
      if (h) return JSON.parse(decodeURIComponent(h));
    } catch {}
    return { screen: "collections" };
  });

  const onNavigate = useCallback((next) => {
    setRoute(next);
    window.location.hash = encodeURIComponent(JSON.stringify(next));
  }, []);

  useEffect(() => {
    const onHash = () => {
      try {
        const h = window.location.hash.replace(/^#/, "");
        if (h) setRoute(JSON.parse(decodeURIComponent(h)));
      } catch {}
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  switch (route.screen) {
    case "products":
      return <Products onNavigate={onNavigate} collectionId={route.collectionId} />;
    case "bundle":
      return <Bundle onNavigate={onNavigate} styleId={route.styleId} preview={route.preview} />;
    case "collections":
    default:
      return <Collections onNavigate={onNavigate} />;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
