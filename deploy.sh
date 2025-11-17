#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/home/khnum/heretahelp"
PM2_NAME="heretahelp"

echo "==> Switching to project directory: $REPO_DIR"
cd "$REPO_DIR"

echo "==> Pulling latest code"
git fetch origin
git pull --ff-only origin main

echo "==> Installing dependencies"
npm install

echo "==> Building Next.js app"
npm run build

echo "==> Restarting PM2 process: $PM2_NAME"
pm2 restart "$PM2_NAME"

echo "Deployment complete."
