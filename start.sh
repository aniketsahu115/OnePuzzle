#!/bin/bash

# Production server startup script for Render
set -e

echo "🚀 Starting OnePuzzle production server..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if the build exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found. Please run 'pnpm build' first."
    exit 1
fi

if [ ! -f "dist/server/prod.js" ]; then
    echo "❌ Error: Production server file not found. Please run 'pnpm build' first."
    exit 1
fi

# Set environment variables
export NODE_ENV=production

# Get the port from environment or use default
PORT=${PORT:-4001}
echo "📡 Server will bind to port: $PORT"

# Start the production server
echo "🎯 Starting server..."
exec node dist/server/prod.js 