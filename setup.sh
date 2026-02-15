#!/bin/bash
# Setup script for Contes Magiques PWA + Synthetic AI API

echo "🎭 Contes Magiques - Setup"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the pwa/ directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create public folder for static files
echo "📁 Creating public folder..."
mkdir -p public
cp index.html styles.css app.js config.js manifest.json sw.js public/ 2>/dev/null || true

# Check for gateway token
if [ -z "$GATEWAY_TOKEN" ]; then
    echo ""
    echo "⚠️  WARNING: GATEWAY_TOKEN not set"
    echo "   Set it with: export GATEWAY_TOKEN='your-token-here'"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  export GATEWAY_TOKEN='your-token'"
echo "  npm start"
echo ""
echo "Then open: http://localhost:3000"
