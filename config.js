// API Configuration - Using Synthetic AI API (OpenClaw)
const CONFIG = {
    // Model options
    AI_MODEL: 'synthetic/hf:MiniMaxAI/MiniMax-M2.1',
    
    PROXY_ENDPOINT: '/api/generate-story',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.8,
    
    // Supported languages
    LANGUAGES: {
        'fr': { name: 'Français', flag: '🇫🇷', default: true },
        'en': { name: 'English', flag: '🇬🇧' },
        'es': { name: 'Español', flag: '🇪🇸' },
        'de': { name: 'Deutsch', flag: '🇩🇪' },
        'it': { name: 'Italiano', flag: '🇮🇹' }
    },
    
    DEFAULT_LANGUAGE: 'fr',
    
    // Themes
    THEMES: {
        'magie': { icon: '✨', name: 'Magie', nameEn: 'Magic' },
        'aventure': { icon: '⚔️', name: 'Aventure', nameEn: 'Adventure' },
        'animaux': { icon: '🦁', name: 'Animaux', nameEn: 'Animals' },
        'espace': { icon: '🚀', name: 'Espace', nameEn: 'Space' },
        'princesses': { icon: '👸', name: 'Princesses', nameEn: 'Princesses' },
        'dragons': { icon: '🐉', name: 'Dragons', nameEn: 'Dragons' },
        'pirates': { icon: '⚓', name: 'Pirates', nameEn: 'Pirates' },
        'dinosaures': { icon: '🦕', name: 'Dinosaures', nameEn: 'Dinosaurs' },
        'superheros': { icon: '🦸', name: 'Super-héros', nameEn: 'Superheroes' },
        'robots': { icon: '🤖', name: 'Robots', nameEn: 'Robots' },
        'sous-marin': { icon: '🐠', name: 'Sous-marin', nameEn: 'Underwater' },
        'foret': { icon: '🌲', name: 'Forêt enchantée', nameEn: 'Enchanted Forest' },
        'chateau': { icon: '🏰', name: 'Château', nameEn: 'Castle' },
        'sport': { icon: '⚽', name: 'Sport', nameEn: 'Sports' },
        'musique': { icon: '🎵', name: 'Musique', nameEn: 'Music' }
    },
    
    // Key characters
    CHARACTERS: {
        'friend': { icon: '🤝', name: 'Un ami', nameEn: 'A friend' },
        'animal': { icon: '🐕', name: 'Un animal', nameEn: 'An animal' },
        'magical': { icon: '🧚', name: 'Une créature magique', nameEn: 'A magical creature' },
        'family': { icon: '👨‍👩‍👧', name: 'Un membre de la famille', nameEn: 'A family member' },
        'solo': { icon: '🌟', name: 'Solo (pas de compagnon)', nameEn: 'Solo adventure' }
    },
    
    // Locations
    LOCATIONS: {
        'forest': { icon: '🌲', name: 'Forêt', nameEn: 'Forest' },
        'mountain': { icon: '⛰️', name: 'Montagne', nameEn: 'Mountain' },
        'ocean': { icon: '🌊', name: 'Océan', nameEn: 'Ocean' },
        'sky': { icon: '☁️', name: 'Ciel', nameEn: 'Sky' },
        'cave': { icon: '🕳️', name: 'Cave', nameEn: 'Cave' },
        'city': { icon: '🏙️', name: 'Ville', nameEn: 'City' },
        'home': { icon: '🏠', name: 'Maison/Village', nameEn: 'Home/Village' }
    },
    
    // Length configuration (paragraphs and tokens)
    LENGTHS: {
        'courte': { 
            paragraphs: '3-4', 
            tokens: 600, 
            name: 'Courte',
            nameEn: 'Short',
            minutes: '2-3 min'
        },
        'moyenne': { 
            paragraphs: '7-8', 
            tokens: 1200, 
            name: 'Moyenne',
            nameEn: 'Medium',
            minutes: '5-7 min'
        },
        'longue': { 
            paragraphs: '12-15', 
            tokens: 2000, 
            name: 'Longue',
            nameEn: 'Long',
            minutes: '10-15 min'
        },
        'epique': { 
            paragraphs: '20-25', 
            tokens: 3500, 
            name: 'Épique',
            nameEn: 'Epic',
            minutes: '20+ min'
        }
    }
};

// Dev mode
const DEV_MODE = {
    USE_TEMPLATES: false
};
