#!/usr/bin/env bash
set -e

# Detect if .env exists
if [ ! -f .env ] && [ ! -f ~/.openclaw/.env ]; then
  echo "WARNING: No .env file found in current directory or ~/.openclaw/.env"
  echo "You might need to set OPENCLAW_GATEWAY_TOKEN manually or create a .env file."
fi

echo "Starting OpenClaw Gateway in DEV mode..."
echo "Debug Auth: ENABLED (OPENCLAW_DEBUG_AUTH=1)"
echo "Command: npx tsx src/index.ts gateway --bind lan --port 18789"

export OPENCLAW_DEBUG_AUTH=1
# Run the gateway
npx tsx src/index.ts gateway --bind lan --port 18789
