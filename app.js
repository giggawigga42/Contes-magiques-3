// Contes Magiques PWA v2 - Main App
// Features: Multi-language, Character+Location selection, Enhanced themes

class ContesMagiquesApp {
    constructor() {
        this.state = {
            childName: '',
            age: '5-7',
            length: 'moyenne',
            theme: 'magie',
            character: 'friend',
            location: 'forest',
            language: CONFIG.DEFAULT_LANGUAGE,
            currentStory: null,
            isGenerating: false
        };
        
        this.i18n = {};
        this.init();
    }
    
    init() {
        this.loadLanguage(this.state.language);
        this.renderLanguageSelector();
        this.renderThemeGrid();
        this.renderCharacterGrid();
        this.renderLocationGrid();
        this.renderLengthSelector();
        this.bindEvents();
        this.initTTS();
        this.checkInstallPrompt();
    }
    
    // Language management
    loadLanguage(lang) {
        this.state.language = lang;
        this.i18n = this.getTranslations(lang);
        this.updateUILanguage();
    }
    
    getTranslations(lang) {
        const translations = {
            'fr': {
                title: 'Contes Magiques',
                subtitle: 'Des histoires enchantées générées par IA',
                createStory: 'Crée ton histoire',
                nameLabel: 'Prénom de l\'enfant',
                ageLabel: 'Âge',
                lengthLabel: 'Longueur',
                themeLabel: 'Thème',
                characterLabel: 'Personnage clé',
                locationLabel: 'Lieu',
                generateBtn: 'Générer l\'histoire',
                generating: 'Génération en cours...',
                back: 'Retour',
                read: 'Lire',
                newStory: 'Nouvelle histoire',
                save: 'Sauvegarder',
                moral: 'Morale',
                lengths: {
                    'courte': { name: 'Courte', desc: '2-3 min' },
                    'moyenne': { name: 'Moyenne', desc: '5-7 min' },
                    'longue': { name: 'Longue', desc: '10-15 min' },
                    'epique': { name: 'Épique', desc: '20+ min' }
                }
            },
            'en': {
                title: 'Magic Stories',
                subtitle: 'AI-generated enchanted tales',
                createStory: 'Create your story',
                nameLabel: 'Child\'s name',
                ageLabel: 'Age',
                lengthLabel: 'Length',
                themeLabel: 'Theme',
                characterLabel: 'Key Character',
                locationLabel: 'Location',
                generateBtn: 'Generate Story',
                generating: 'Generating...',
                back: 'Back',
                read: 'Read',
                newStory: 'New Story',
                save: 'Save',
                moral: 'Moral',
                lengths: {
                    'courte': { name: 'Short', desc: '2-3 min' },
                    'moyenne': { name: 'Medium', desc: '5-7 min' },
                    'longue': { name: 'Long', desc: '10-15 min' },
                    'epique': { name: 'Epic', desc: '20+ min' }
                }
            },
            'es': {
                title: 'Cuentos Mágicos',
                subtitle: 'Cuentos encantados generados por IA',
                createStory: 'Crea tu historia',
                nameLabel: 'Nombre del niño',
                ageLabel: 'Edad',
                lengthLabel: 'Duración',
                themeLabel: 'Tema',
                characterLabel: 'Personaje',
                locationLabel: 'Lugar',
                generateBtn: 'Generar historia',
                generating: 'Generando...',
                back: 'Volver',
                read: 'Leer',
                newStory: 'Nueva historia',
                save: 'Guardar',
                moral: 'Moraleja',
                lengths: {
                    'courte': { name: 'Corta', desc: '2-3 min' },
                    'moyenne': { name: 'Media', desc: '5-7 min' },
                    'longue': { name: 'Larga', desc: '10-15 min' },
                    'epique': { name: 'Épica', desc: '20+ min' }
                }
            },
            'de': {
                title: 'Zauberhafte Geschichten',
                subtitle: 'KI-generierte Märchen',
                createStory: 'Erstelle deine Geschichte',
                nameLabel: 'Name des Kindes',
                ageLabel: 'Alter',
                lengthLabel: 'Länge',
                themeLabel: 'Thema',
                characterLabel: 'Hauptfigur',
                locationLabel: 'Ort',
                generateBtn: 'Geschichte erstellen',
                generating: 'Wird erstellt...',
                back: 'Zurück',
                read: 'Vorlesen',
                newStory: 'Neue Geschichte',
                save: 'Speichern',
                moral: 'Moral',
                lengths: {
                    'courte': { name: 'Kurz', desc: '2-3 min' },
                    'moyenne': { name: 'Mittel', desc: '5-7 min' },
                    'longue': { name: 'Lang', desc: '10-15 min' },
                    'epique': { name: 'Episch', desc: '20+ min' }
                }
            },
            'it': {
                title: 'Racconti Magici',
                subtitle: 'Storie incantate generate da IA',
                createStory: 'Crea la tua storia',
                nameLabel: 'Nome del bambino',
                ageLabel: 'Età',
                lengthLabel: 'Durata',
                themeLabel: 'Tema',
                characterLabel: 'Personaggio',
                locationLabel: 'Luogo',
                generateBtn: 'Genera storia',
                generating: 'Generazione...',
                back: 'Indietro',
                read: 'Leggi',
                newStory: 'Nuova storia',
                save: 'Salva',
                moral: 'Morale',
                lengths: {
                    'courte': { name: 'Corta', desc: '2-3 min' },
                    'moyenne': { name: 'Media', desc: '5-7 min' },
                    'longue': { name: 'Lunga', desc: '10-15 min' },
                    'epique': { name: 'Epica', desc: '20+ min' }
                }
            }
        };
        return translations[lang] || translations['fr'];
    }
    
    renderLanguageSelector() {
        const container = document.getElementById('languageSelector');
        if (!container) return;
        
        container.innerHTML = Object.entries(CONFIG.LANGUAGES).map(([code, lang]) => `
            <button class="lang-btn ${code === this.state.language ? 'selected' : ''}" 
                    data-lang="${code}" title="${lang.name}">
                ${lang.flag}
            </button>
        `).join('');
        
        container.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.loadLanguage(lang);
                this.renderLanguageSelector();
            });
        });
    }
    
    renderThemeGrid() {
        const container = document.getElementById('themeGrid');
        if (!container) return;
        
        const isFrench = this.state.language === 'fr';
        
        container.innerHTML = Object.entries(CONFIG.THEMES).map(([key, theme]) => `
            <button class="theme-card ${key === this.state.theme ? 'selected' : ''}" 
                    data-theme="${key}">
                <span class="theme-icon">${theme.icon}</span>
                <span class="theme-name">${isFrench ? theme.name : theme.nameEn}</span>
            </button>
        `).join('');
        
        container.querySelectorAll('.theme-card').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.theme-card').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.theme = btn.dataset.theme;
            });
        });
    }
    
    renderCharacterGrid() {
        const container = document.getElementById('characterGrid');
        if (!container) return;
        
        const isFrench = this.state.language === 'fr';
        
        container.innerHTML = Object.entries(CONFIG.CHARACTERS).map(([key, char]) => `
            <button class="character-card ${key === this.state.character ? 'selected' : ''}" 
                    data-character="${key}">
                <span class="character-icon">${char.icon}</span>
                <span class="character-name">${isFrench ? char.name : char.nameEn}</span>
            </button>
        `).join('');
        
        container.querySelectorAll('.character-card').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.character-card').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.character = btn.dataset.character;
            });
        });
    }
    
    renderLocationGrid() {
        const container = document.getElementById('locationGrid');
        if (!container) return;
        
        const isFrench = this.state.language === 'fr';
        
        container.innerHTML = Object.entries(CONFIG.LOCATIONS).map(([key, loc]) => `
            <button class="location-card ${key === this.state.location ? 'selected' : ''}" 
                    data-location="${key}">
                <span class="location-icon">${loc.icon}</span>
                <span class="location-name">${isFrench ? loc.name : loc.nameEn}</span>
            </button>
        `).join('');
        
        container.querySelectorAll('.location-card').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.location-card').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.location = btn.dataset.location;
            });
        });
    }
    
    renderLengthSelector() {
        const container = document.getElementById('lengthSelector');
        if (!container) return;
        
        const isFrench = this.state.language === 'fr';
        
        container.innerHTML = Object.entries(CONFIG.LENGTHS).map(([key, length]) => `
            <button class="length-btn ${key === this.state.length ? 'selected' : ''}" 
                    data-length="${key}">
                <span class="length-name">${isFrench ? length.name : length.nameEn}</span>
                <span class="length-desc">${length.minutes}</span>
            </button>
        `).join('');
        
        container.querySelectorAll('.length-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.length-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.length = btn.dataset.length;
            });
        });
    }
    
    updateUILanguage() {
        // Update static text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.i18n[key]) {
                el.textContent = this.i18n[key];
            }
        });
        
        // Re-render grids with new language
        this.renderThemeGrid();
        this.renderCharacterGrid();
        this.renderLocationGrid();
        this.renderLengthSelector();
    }
    
    bindEvents() {
        // Name input
        const nameInput = document.getElementById('childName');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.state.childName = e.target.value.trim();
            });
        }
        
        // Age selector
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.age = btn.dataset.age;
            });
        });
        
        // Generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateStory());
        }
    }
    
    initTTS() {
        this.tts = window.speechSynthesis;
        this.voices = [];
        
        const loadVoices = () => {
            this.voices = this.tts.getVoices();
        };
        
        loadVoices();
        if (this.tts.onvoiceschanged !== undefined) {
            this.tts.onvoiceschanged = loadVoices;
        }
    }
    
    async generateStory() {
        const name = document.getElementById('childName')?.value.trim();
        if (!name) {
            alert(this.i18n.nameLabel + ' required!');
            return;
        }
        
        this.state.childName = name;
        this.showScreen('loadingScreen');
        this.state.isGenerating = true;
        
        try {
            const story = await this.callAIAPI();
            this.state.currentStory = story;
            this.displayStory(story);
        } catch (error) {
            console.error('Error:', error);
            this.state.currentStory = this.generateStoryFromTemplate();
            this.displayStory(this.state.currentStory);
        } finally {
            this.state.isGenerating = false;
        }
    }
    
    async callAIAPI() {
        if (DEV_MODE.USE_TEMPLATES || !CONFIG.PROXY_ENDPOINT) {
            await new Promise(r => setTimeout(r, 1500));
            return this.generateStoryFromTemplate();
        }
        
        const response = await fetch(CONFIG.PROXY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: CONFIG.AI_MODEL,
                messages: [{ role: 'user', content: this.buildPrompt() }],
                max_tokens: CONFIG.LENGTHS[this.state.length].tokens,
                temperature: CONFIG.TEMPERATURE
            })
        });
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return this.parseAIResponse(data);
    }
    
    buildPrompt() {
        const { childName, age, length, theme, character, location, language } = this.state;
        const lengthConfig = CONFIG.LENGTHS[length];
        const themeConfig = CONFIG.THEMES[theme];
        const charConfig = CONFIG.CHARACTERS[character];
        const locConfig = CONFIG.LOCATIONS[location];
        
        const prompts = {
            'fr': `Génère une histoire pour enfant en français.

**Personnage:** ${childName}
**Âge:** ${age} ans
**Thème:** ${themeConfig.name}
**Personnage clé:** ${charConfig.name}
**Lieu:** ${locConfig.name}
**Longueur:** ${lengthConfig.paragraphs} paragraphes

Instructions:
- Commence par un titre accrocheur
- ${childName} est le héros de l'histoire
- Inclus ${charConfig.name.toLowerCase()} comme personnage important
- L'action se déroule ${locConfig.name === 'Maison/Village' ? 'à la maison' : locConfig.name.toLowerCase()}
- ${lengthConfig.paragraphs} paragraphes environ
- Vocabulaire adapté à ${age} ans
- Morale positive à la fin
- Pas de violence ni de peur

Format JSON:
{
  "title": "Titre",
  "content": "Contenu avec\\n\\n entre paragraphes",
  "moral": "Morale"
}`,
            'en': `Generate a children's story in English.

**Character:** ${childName}
**Age:** ${age}
**Theme:** ${themeConfig.nameEn}
**Key Character:** ${charConfig.nameEn}
**Location:** ${locConfig.nameEn}
**Length:** ${lengthConfig.paragraphs} paragraphs

Instructions:
- Start with a catchy title
- ${childName} is the hero
- Include ${charConfig.nameEn.toLowerCase()} as an important character
- Setting: ${locConfig.nameEn}
- ${lengthConfig.paragraphs} paragraphs
- Age-appropriate vocabulary
- Positive moral at the end
- No violence or fear

Format JSON:
{
  "title": "Title",
  "content": "Content with\\n\\n between paragraphs",
  "moral": "Moral"
}`,
            'es': `Genera un cuento infantil en español.

**Personaje:** ${childName}
**Edad:** ${age}
**Tema:** ${themeConfig.nameEn}
**Personaje clave:** ${charConfig.nameEn}
**Lugar:** ${locConfig.nameEn}
**Duración:** ${lengthConfig.paragraphs} párrafos

Instrucciones similares al inglés...`,
            'de': `Erstelle eine Kindergeschichte auf Deutsch...`,
            'it': `Crea una storia per bambini in italiano...`
        };
        
        return prompts[language] || prompts['fr'];
    }
    
    generateStoryFromTemplate() {
        // Template generation based on config
        const { childName, theme, character, location } = this.state;
        const themeConfig = CONFIG.THEMES[theme];
        
        return {
            title: `${childName} et l'Aventure ${themeConfig.name}`,
            content: `Il était une fois ${childName}, qui partit pour une grande aventure ${themeConfig.name.toLowerCase()}...`,
            moral: 'Le courage et l\'amitié triomphent toujours.'
        };
    }
    
    parseAIResponse(data) {
        try {
            const content = data.choices?.[0]?.message?.content || data.content?.[0]?.text;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
            
            return {
                title: `L'Aventure de ${this.state.childName}`,
                content: content,
                moral: 'La gentillesse ouvre toutes les portes.'
            };
        } catch (e) {
            return this.generateStoryFromTemplate();
        }
    }
    
    displayStory(story) {
        document.getElementById('storyTitle').textContent = story.title;
        document.getElementById('storyContent').innerHTML = story.content.replace(/\n\n/g, '<br><br>');
        document.getElementById('storyMoral').textContent = '✨ ' + story.moral;
        this.showScreen('storyScreen');
    }
    
    speakStory() {
        if (!this.state.currentStory) return;
        this.tts.cancel();
        
        const text = `${this.state.currentStory.title}. ${this.state.currentStory.content}. ${this.i18n.moral}: ${this.state.currentStory.moral}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.state.language === 'fr' ? 'fr-FR' : 
                         this.state.language === 'en' ? 'en-US' :
                         this.state.language === 'es' ? 'es-ES' :
                         this.state.language === 'de' ? 'de-DE' :
                         this.state.language === 'it' ? 'it-IT' : 'fr-FR';
        utterance.rate = 0.9;
        this.tts.speak(utterance);
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('active');
    }
    
    backToSetup() {
        this.tts.cancel();
        this.showScreen('setupScreen');
    }
    
    checkInstallPrompt() {
        setTimeout(() => {
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                const prompt = document.getElementById('installPrompt');
                if (prompt) prompt.classList.remove('hidden');
            }
        }, 3000);
    }
    
    saveStory() {
        if (!this.state.currentStory) return;
        const stories = JSON.parse(localStorage.getItem('contesMagiques') || '[]');
        stories.push({
            ...this.state.currentStory,
            childName: this.state.childName,
            language: this.state.language,
            date: new Date().toISOString()
        });
        localStorage.setItem('contesMagiques', JSON.stringify(stories));
        alert(this.i18n.save + ' !');
    }
}

// Initialize
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ContesMagiquesApp();
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
});

// Global functions
function generateStory() { app.generateStory(); }
function backToSetup() { app.backToSetup(); }
function speakStory() { app.speakStory(); }
function saveStory() { app.saveStory(); }
function installPWA() { window.deferredPrompt?.prompt(); }
function dismissInstall() { document.getElementById('installPrompt')?.classList.add('hidden'); }
