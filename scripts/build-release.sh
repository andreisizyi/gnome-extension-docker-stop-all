#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${1:-$ROOT_DIR/dist}"
STAGE_DIR="$(mktemp -d)"

cleanup() {
    rm -rf "$STAGE_DIR"
}
trap cleanup EXIT

UUID="$(sed -n 's/^[[:space:]]*"uuid":[[:space:]]*"\([^"]*\)".*/\1/p' "$ROOT_DIR/metadata.json")"
if [[ -z "$UUID" ]]; then
    echo "Failed to read uuid from metadata.json" >&2
    exit 1
fi

mkdir -p "$OUT_DIR"
mkdir -p "$STAGE_DIR/actions" "$STAGE_DIR/menu" "$STAGE_DIR/ui" "$STAGE_DIR/schemas"

cp "$ROOT_DIR/extension.js" "$STAGE_DIR/"
cp "$ROOT_DIR/metadata.json" "$STAGE_DIR/"
cp "$ROOT_DIR/prefs.js" "$STAGE_DIR/"
cp "$ROOT_DIR/stylesheet.css" "$STAGE_DIR/"
cp "$ROOT_DIR/LICENSE" "$STAGE_DIR/"

cp "$ROOT_DIR/actions/"*.js "$STAGE_DIR/actions/"
cp "$ROOT_DIR/menu/"*.js "$STAGE_DIR/menu/"
cp "$ROOT_DIR/ui/"*.js "$STAGE_DIR/ui/"
cp "$ROOT_DIR/schemas/"*.xml "$STAGE_DIR/schemas/"

glib-compile-schemas "$STAGE_DIR/schemas"

(
    cd "$STAGE_DIR"
    zip -qr "$OUT_DIR/$UUID.shell-extension.zip" .
)
