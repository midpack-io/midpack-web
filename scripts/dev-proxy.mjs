// Dev reverse-proxy: one front door on :3000 that routes by Host header to the
// three Next dev servers (web 3001, app 3002, admin 3003). Started by the root
// `pnpm dev` (turbo run dev dev:proxy) alongside the apps.
//
//   *.localhost            → zero-config (the .localhost TLD resolves to 127.0.0.1)
//   *.local.midpack.io     → real-looking domains (needs scripts/setup-hosts.sh);
//                            required because Google OAuth rejects *.localhost redirect URIs
//
// PROXY_HOST controls the listen interface: 127.0.0.1 for native dev (default),
// 0.0.0.0 inside Docker so the published port reaches it. Set PROXY_NO_PORT80=1
// to skip the optional port-80 listener (e.g. in containers).
import http from "node:http";
import httpProxy from "http-proxy";

const HOST = process.env.PROXY_HOST ?? "127.0.0.1";

const routes = {
  "localhost": "http://127.0.0.1:3001", // web (landing)
  "app.localhost": "http://127.0.0.1:3002", // app (customer platform)
  "admin.localhost": "http://127.0.0.1:3003", // admin (internal SaaS mgmt)
  "local.midpack.io": "http://127.0.0.1:3001",
  "app.local.midpack.io": "http://127.0.0.1:3002",
  "admin.local.midpack.io": "http://127.0.0.1:3003",
};

const proxy = httpProxy.createProxyServer({});

proxy.on("error", (_err, _req, res) => {
  if (res.writeHead) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("App not ready yet — wait for Next.js to start");
  }
});

function handleRequest(req, res) {
  const host = req.headers.host?.split(":")[0];
  const target = routes[host];
  if (!target) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(`Unknown host: ${host}\nConfigured: ${Object.keys(routes).join(", ")}`);
    return;
  }
  proxy.web(req, res, { target });
}

function handleUpgrade(req, socket, head) {
  const host = req.headers.host?.split(":")[0];
  const target = routes[host];
  if (target) proxy.ws(req, socket, head, { target });
  else socket.destroy();
}

// Primary proxy on port 3000.
const server = http.createServer(handleRequest);
server.on("upgrade", handleUpgrade);
server.listen(3000, HOST, () => {
  console.log(`\n  Midpack dev proxy  (listening on ${HOST}:3000)\n`);
  console.log("  http://localhost:3000               → web   (3001)");
  console.log("  http://app.localhost:3000           → app   (3002)");
  console.log("  http://admin.localhost:3000         → admin (3003)");
  console.log("");
  console.log("  Google OAuth compatible (needs `sudo bash scripts/setup-hosts.sh`):");
  console.log("  http://local.midpack.io:3000        → web   (3001)");
  console.log("  http://app.local.midpack.io:3000    → app   (3002)");
  console.log("  http://admin.local.midpack.io:3000  → admin (3003)");
  console.log("");
});

// Optional portless access on port 80 (needs sudo / pfctl). Skipped in Docker.
if (process.env.PROXY_NO_PORT80 !== "1") {
  const server80 = http.createServer(handleRequest);
  server80.on("upgrade", handleUpgrade);
  server80.listen(80, HOST, () => {
    console.log("  Portless (port 80) enabled\n");
  });
  server80.on("error", (err) => {
    if (err.code === "EACCES") {
      console.log("  Port 80 unavailable (run with sudo for portless access)\n");
    }
  });
}
