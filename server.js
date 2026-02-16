// Simple proxy server for Contes Magiques PWA
// This server calls the Synthetic AI API with proper authentication

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Synthetic AI API configuration
const SYNTHETIC_API_URL = process.env.SYNTHETIC_API_URL || 'https://api.synthetic.ai/v1/chat/completions';
const SYNTHETIC_API_KEY = process.env.SYNTHETIC_API_KEY || '';

// Middleware
app.use(cors()); // Allow PWA to call this server
app.use(express.json());

// Serve static files (the PWA) - from root directory
app.use(express.static('.'));

// Fallback to index.html for any route (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

// API endpoint for story generation
app.post('/api/generate-story', async (req, res) => {
    try {
        const { model, messages, max_tokens, temperature } = req.body;
        
        console.log('Generating story with model:', model);
        console.log('Calling API URL:', SYNTHETIC_API_URL);
        
        // Call Synthetic AI API directly
        const response = await fetch(SYNTHETIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SYNTHETIC_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: max_tokens || 1500,
                temperature: temperature || 0.8
            })
        });
        
        const status = response.status;
        const responseText = await response.text();
        
        console.log('API response status:', status);
        console.log('API response body:', responseText);
        
        if (!response.ok) {
            console.error('Synthetic AI API error:', responseText);
            return res.status(status).json({ 
                error: 'AI generation failed',
                details: responseText,
                status: status
            });
        }
        
        const data = JSON.parse(responseText);
        res.json(data);
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug: List files (remove in production)
app.get('/api/debug', (req, res) => {
    const fs = require('fs');
    fs.readdir('.', (err, files) => {
        if (err) return res.json({ error: err.message });
        res.json({ files: files });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Contes Magiques server running on port ${PORT}`);
    console.log(`📱 PWA available at: http://localhost:${PORT}`);
    console.log(`🤖 AI proxy endpoint: http://localhost:${PORT}/api/generate-story`);
});
