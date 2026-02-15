# Contes Magiques AI - PWA + Synthetic AI API

Histoires magiques générées par IA pour enfants (2-10 ans), utilisant Synthetic AI API.

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   PWA (Browser) │ ───► │  Node.js Proxy   │ ───► │ Synthetic AI    │
│   (Static files)│      │  (This server)   │      │  (OpenClaw)     │
└─────────────────┘      └──────────────────┘      └─────────────────┘
       │                          │
       │ 1. User selects          │ 2. Proxy calls AI
       │    story params          │    with auth token
       │                          │
       │◄─────────────────────────│ 3. AI story
       │    4. Display story      │    returned
```

**Why a proxy?** The Synthetic AI API requires authentication tokens that shouldn't be exposed in client-side browser code. The proxy keeps your credentials secure.

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd /home/Ubuntu/clawd/Tasks/contes-magiques/pwa

# Install dependencies
npm install

# Set environment variables
export GATEWAY_TOKEN="your-openclaw-gateway-token"
export OPENCLAW_GATEWAY="http://localhost:8080"  # Your OpenClaw gateway URL

# Start server
npm start
```

### 2. Setup PWA

The server automatically serves static files from `public/` folder:

```bash
# Create public folder and move PWA files
mkdir -p public
cp index.html styles.css app.js config.js public/
```

### 3. Access the App

- **PWA:** http://localhost:3000
- **API Health:** http://localhost:3000/api/health

## 📱 Install as PWA

1. Open http://localhost:3000 on your phone
2. Tap "Add to Home Screen"
3. Enjoy!

## ⚙️ Configuration

### `config.js` (PWA-side)

```javascript
// Choose your AI model:
AI_MODEL: 'synthetic/hf:moonshotai/Kimi-K2.5',  // Best French, balanced
// AI_MODEL: 'synthetic/hf:MiniMaxAI/MiniMax-M2.1',  // Creative, longer output
// AI_MODEL: 'synthetic/hf:meta-llama/Llama-3.3-70B-Instruct',  // Reliable

// Dev mode (no API calls, uses templates):
DEV_MODE.USE_TEMPLATES: false
```

### Environment Variables (Server-side)

```bash
# Required
export GATEWAY_TOKEN="your-openclaw-gateway-token"

# Optional (defaults shown)
export OPENCLAW_GATEWAY="http://localhost:8080"
export PORT="3000"
```

## ✨ Features

- 🤖 **AI Story Generation** via Synthetic AI API
- 🎭 **6 thèmes** : Magie, Aventure, Animaux, Espace, Princesses, Dragons
- 📏 **3 longueurs** adaptées à l'âge
- 🔊 **Lecture audio** (Web Speech API)
- 💾 **Sauvegarde locale**
- 📴 **Mode hors-ligne** (Service Worker)

## 🔧 Alternative: Template Mode (No Backend)

For testing without AI:

```javascript
// config.js
DEV_MODE.USE_TEMPLATES: true
```

Stories will use built-in templates instead of AI generation.

## 🎯 Next Steps

1. **Get your gateway token** from OpenClaw
2. **Start the backend:** `npm start`
3. **Test the PWA** on your phone
4. **Optional:** Add DALL-E for illustrations

---

*Powered by Synthetic AI API*
