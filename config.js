// API Configuration - Using Synthetic AI API (OpenClaw)
const CONFIG = {
    // Use Synthetic AI API - no separate API key needed!
    // This connects through your OpenClaw gateway
    
    // Model options:
    // - 'synthetic/hf:moonshotai/Kimi-K2.5' (Daily) - Best balance, great French
    // - 'synthetic/hf:MiniMaxAI/MiniMax-M2.1' (LongOutput) - Best for long stories
    // - 'synthetic/hf:deepseek-ai/DeepSeek-V3.2' (DeepThink) - Great reasoning
    
    // Using MiniMax for creative, longer stories
    AI_MODEL: 'synthetic/hf:MiniMaxAI/MiniMax-M2.1',
    
    // Alternative models for different story styles:
    // AI_MODEL: 'synthetic/hf:MiniMaxAI/MiniMax-M2.1', // For longer, creative stories
    // AI_MODEL: 'synthetic/hf:meta-llama/Llama-3.3-70B-Instruct', // Reliable, consistent
    
    // To use Synthetic AI, you need a backend proxy or serverless function
    // that calls the OpenClaw API with your gateway token
    // The PWA calls this proxy endpoint
    PROXY_ENDPOINT: '/api/generate-story', // Update this to your actual endpoint
    
    // Max tokens for story generation
    MAX_TOKENS: 1500,
    
    // Temperature (creativity): 0.7-0.9 for stories
    TEMPERATURE: 0.8
};

// For testing without backend, use template mode:
// Set USE_TEMPLATES: true to skip API calls
const DEV_MODE = {
    USE_TEMPLATES: false // Set to true for offline testing
};
