export type AppId = "admin" | "app" | "web";

export function getCurrentApp(): AppId {
  if (typeof window === "undefined") return "web";
  const hostname = window.location.hostname;
  if (hostname.startsWith("admin.")) return "admin";
  if (hostname.startsWith("app.")) return "app";
  return "web";
}

// Build sibling-app URLs from the current location, preserving protocol + port,
// so cross-app links keep the shared SSO cookie. e.g. on app.localhost:3000:
//   { web: http://localhost:3000, app: http://app.localhost:3000, admin: http://admin.localhost:3000 }
export function getAppUrls(): Record<AppId, string> {
  if (typeof window === "undefined") {
    return { admin: "", app: "", web: "" };
  }

  const { protocol, hostname, port } = window.location;
  const portSuffix = port ? `:${port}` : "";

  let base = hostname;
  if (hostname.startsWith("admin.")) {
    base = hostname.slice("admin.".length);
  } else if (hostname.startsWith("app.")) {
    base = hostname.slice("app.".length);
  }

  return {
    admin: `${protocol}//admin.${base}${portSuffix}`,
    app: `${protocol}//app.${base}${portSuffix}`,
    web: `${protocol}//${base}${portSuffix}`,
  };
}
