#!/usr/bin/env bash
# Configures the local dev environment for the *.local.midpack.io subdomains:
#   1. Adds local.midpack.io domains to /etc/hosts (→ 127.0.0.1)
#   2. (macOS) Redirects port 80 → 3000 so sites work without :3000 in the URL
#
# The *.localhost subdomains (localhost / app.localhost / admin.localhost) need
# NO setup — the .localhost TLD already resolves to 127.0.0.1. Run this only when
# you want the OAuth-compatible *.local.midpack.io front door.
#
# Run once: sudo bash scripts/setup-hosts.sh

set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "This script needs sudo."
  echo "Run: sudo bash $0"
  exit 1
fi

# --- /etc/hosts ---

MARKER="# midpack.io local dev"
HOSTS_FILE="/etc/hosts"

ENTRIES=(
  "127.0.0.1  local.midpack.io"
  "127.0.0.1  app.local.midpack.io"
  "127.0.0.1  admin.local.midpack.io"
  "127.0.0.1  api.local.midpack.io"
)

if grep -q "$MARKER" "$HOSTS_FILE"; then
  echo "/etc/hosts: already configured"
else
  {
    echo ""
    echo "$MARKER"
    for entry in "${ENTRIES[@]}"; do
      echo "$entry"
    done
  } >> "$HOSTS_FILE"

  echo "/etc/hosts: added entries"
  for entry in "${ENTRIES[@]}"; do
    echo "  $entry"
  done
fi

# --- Port forwarding (80 → 3000), macOS pf ---

PF_ANCHOR_FILE="/etc/pf.anchors/midpack-io"
PF_RULE="rdr pass on lo0 inet proto tcp from any to 127.0.0.1 port 80 -> 127.0.0.1 port 3000"

if [[ -f "$PF_ANCHOR_FILE" ]]; then
  echo "Port forwarding: already configured"
else
  echo "$PF_RULE" > "$PF_ANCHOR_FILE"

  PF_ANCHOR_LINE="rdr-anchor \"midpack-io\""
  PF_LOAD_LINE="load anchor \"midpack-io\" from \"/etc/pf.anchors/midpack-io\""

  if ! grep -q "midpack-io" /etc/pf.conf; then
    cp /etc/pf.conf /etc/pf.conf.bak
    {
      cat /etc/pf.conf
      echo ""
      echo "# midpack.io local dev"
      echo "$PF_ANCHOR_LINE"
      echo "$PF_LOAD_LINE"
    } > /etc/pf.conf.tmp
    mv /etc/pf.conf.tmp /etc/pf.conf
  fi

  pfctl -ef /etc/pf.conf 2>/dev/null || pfctl -F all -f /etc/pf.conf 2>/dev/null

  echo "Port forwarding: enabled (port 80 → 3000)"
fi

echo ""
echo "Done. Access your apps at:"
echo "  http://local.midpack.io        → web"
echo "  http://app.local.midpack.io    → app"
echo "  http://admin.local.midpack.io  → admin"
