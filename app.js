// Contes Magiques PWA - Main App
class ContesMagiquesApp {
    constructor() {
        this.state = {
            childName: '',
            age: '5-7',
            length: 'moyenne',
            theme: 'magie',
            currentStory: null,
            isGenerating: false
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.initTTS();
        this.checkInstallPrompt();
    }

    bindEvents() {
        // Age selector
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.age = btn.dataset.age;
            });
        });

        // Length selector
        document.querySelectorAll('.length-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.length-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.length = btn.dataset.length;
            });
        });

        // Theme selector
        document.querySelectorAll('.theme-card').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.theme-card').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.theme = btn.dataset.theme;
            });
        });

        // Name input
        document.getElementById('childName').addEventListener('input', (e) => {
            this.state.childName = e.target.value.trim();
        });
    }

    initTTS() {
        this.tts = window.speechSynthesis;
        this.voices = [];

        // Load voices
        const loadVoices = () => {
            this.voices = this.tts.getVoices();
        };

        loadVoices();
        if (this.tts.onvoiceschanged !== undefined) {
            this.tts.onvoiceschanged = loadVoices;
        }
    }

    async generateStory() {
        const name = document.getElementById('childName').value.trim();
        if (!name) {
            alert('Veuillez entrer un prénom !');
            return;
        }

        this.state.childName = name;
        this.showScreen('loadingScreen');
        this.state.isGenerating = true;

        try {
            const story = await this.callClaudeAPI();
            this.state.currentStory = story;
            this.displayStory(story);
        } catch (error) {
            console.error('Error generating story:', error);
            // Fallback to template story
            this.state.currentStory = this.getFallbackStory();
            this.displayStory(this.state.currentStory);
        } finally {
            this.state.isGenerating = false;
        }
    }

    async callClaudeAPI() {
        // Check if in dev/template mode
        if (DEV_MODE.USE_TEMPLATES || !CONFIG.PROXY_ENDPOINT) {
            console.log('Using template mode (no proxy configured)');
            await new Promise(resolve => setTimeout(resolve, 1500));
            return this.generateStoryFromTemplate();
        }
        
        try {
            const response = await fetch(CONFIG.PROXY_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: CONFIG.AI_MODEL,
                    messages: [{
                        role: 'user',
                        content: this.buildPrompt()
                    }],
                    max_tokens: CONFIG.MAX_TOKENS,
                    temperature: CONFIG.TEMPERATURE
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return this.parseAIResponse(data);
            
        } catch (error) {
            console.error('AI API error:', error);
            // Fallback to template on error
            return this.generateStoryFromTemplate();
        }
    }
    
    buildPrompt() {
        const { childName, age, length, theme } = this.state;
        
        const lengthMap = {
            'courte': '4-5 phrases',
            'moyenne': '6-8 phrases',
            'longue': '9-12 phrases'
        };
        
        const ageGuidance = {
            '2-4': 'Très simple, phrases courtes, vocabulaire basique, beaucoup de répétitions',
            '5-7': 'Simple mais avec un peu de description, messages positifs clairs',
            '8-10': 'Plus de détails, dialogues, intrigue légèrement plus complexe'
        };
        
        return `Génère une histoire pour enfant en français avec les paramètres suivants:

**Personnage principal:** ${childName}
**Âge de l'enfant:** ${age} ans (${ageGuidance[age]})
**Thème:** ${theme}
**Longueur:** ${lengthMap[length]}

**Instructions:**
- Crée un titre accrocheur
- L'histoire doit être adaptée à un enfant de ${age} ans
- Utilise le prénom "${childName}" comme personnage principal
- Le thème doit être: ${theme}
- Longueur: ${lengthMap[length]}
- Inclut une morale positive à la fin
- Pas de violence, pas de peur
- Langage simple et encourageant

**Format de réponse (JSON):**
{
  "title": "Titre de l'histoire",
  "content": "Contenu de l'histoire avec paragraphes séparés par des sauts de ligne",
  "moral": "La morale de l'histoire"
}`;
    }
    
    parseAIResponse(data) {
        try {
            // Handle Synthetic AI API response format
            const content = data.choices?.[0]?.message?.content || 
                           data.content?.[0]?.text || 
                           data.response ||
                           data.text;
            
            if (!content) {
                throw new Error('Empty response from AI');
            }
            
            // Try to parse JSON response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // Fallback: treat as plain text and structure it
            const lines = content.trim().split('\n');
            const title = lines[0].replace(/^#\s*/, '').replace(/^Title:\s*/i, '');
            const moral = lines[lines.length - 1].replace(/^Moral:\s*/i, '').replace(/^Morale:\s*/i, '');
            const storyContent = lines.slice(1, -1).join('\n').trim();
            
            return {
                title: title || `L'Aventure de ${this.state.childName}`,
                content: storyContent || content,
                moral: moral || 'La gentillesse et le courage mènent à de belles aventures.'
            };
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.generateStoryFromTemplate();
        }
    }

    generateStoryFromTemplate() {
        const { childName, age, length, theme } = this.state;

        const lengthMap = {
            'courte': 4,
            'moyenne': 6,
            'longue': 8
        };

        const paragraphs = lengthMap[length] || 4;

        // Generate story based on theme
        const stories = {
            'magie': {
                title: `La Baguette Magique de ${childName}`,
                content: this.generateMagicStory(childName, paragraphs),
                moral: 'La vraie magie vient du coeur.'
            },
            'aventure': {
                title: `${childName} et le Trésor Oublié`,
                content: this.generateAdventureStory(childName, paragraphs),
                moral: 'Le plus beau trésor est l\'amitié partagée.'
            },
            'animaux': {
                title: `${childName} et les Animaux Parleurs`,
                content: this.generateAnimalStory(childName, paragraphs),
                moral: 'La gentillesse envers les animaux récompense toujours.'
            },
            'espace': {
                title: `${childName} sur la Planète des Étoiles`,
                content: this.generateSpaceStory(childName, paragraphs),
                moral: 'L\'univers est plein de merveilles à découvrir.'
            },
            'princesses': {
                title: `${childName} et le Royaume Enchanté`,
                content: this.generatePrincessStory(childName, paragraphs),
                moral: 'La courtoisie et le courage ouvrent toutes les portes.'
            },
            'dragons': {
                title: `${childName} et le Dragon Gentil`,
                content: this.generateDragonStory(childName, paragraphs),
                moral: 'Ne juge pas un livre à sa couverture, ni un dragon à ses écailles.'
            }
        };

        return stories[theme] || stories['magie'];
    }

    generateMagicStory(name, paragraphs) {
        const parts = [
            `Un soir, alors que ${name} lisait un livre ancien, une lueur dorée s'échappa des pages. Une petite fée apparut et offrit une baguette magique.`,
            `${name} agita la baguette et des étincilles colorées dansèrent dans l'air. Les fleurs du jardin se mirent à chanter une douce mélodie.`,
            `Un chat errant approcha. ${name} pointa la baguette vers lui et il se transforma en majestueux lion doré, doux comme un agneau.`,
            `La fée sourit : "Tu as un coeur pur, ${name}. La vraie magie ne vient pas de la baguette, mais de ta gentillesse."`,
            `${name} décida d'utiliser la magie pour aider les autres. Les jardins voisins fleurirent, les oiseaux blessés guérirent.`,
            `Le lion doré devint le gardien du village. Chaque nuit, ${name} et lui veillaient sur les rêves des enfants.`,
            `Un jour, la baguette perdit son éclat. ${name} comprit que le temps de la magie était passé, mais pas celui des souvenirs.`,
            `Et ${name} vécut heureux, sachant que la magie la plus puissante est celle qu'on partage avec amour.`
        ];
        return parts.slice(0, paragraphs).join('\n\n');
    }

    generateAdventureStory(name, paragraphs) {
        const parts = [
            `${name} découvrit une vieille carte au trésor dans le grenier de grand-mère. Une croix rouge marquait l'emplacement d'un secret.`,
            `Accompagné de son fidèle chien Pipo, ${name} partit à l'aventure à travers la forêt des Murmures.`,
            `Ils traversèrent la Rivière des Étoiles sur un pont de lianes et escaladèrent la Colline aux Vents.`,
            `Un dragon aux écailles vertes bloqua le passage. Mais ${name} lui offrit du miel sauvage, et le dragon les laissa passer.`,
            `Dans une grotte scintillante, ils trouvèrent non pas de l'or, mais un livre contenant tous les contes du monde.`,
            `${name} et Pipo ramenèrent le trésor au village. Chaque soir, tous les enfants se rassemblaient pour écouter les histoires.`,
            `Et ainsi, ${name} comprit que partager des histoires est le plus beau trésor de tous.`
        ];
        return parts.slice(0, paragraphs).join('\n\n');
    }

    generateAnimalStory(name, paragraphs) {
        const parts = [
            `${name} aidait un oisillon tombé du nid quand soudain, l'oiseau parla ! "Merci de ton aide, gentil enfant."`,
            `Émerveillé, ${name} découvrit qu'il comprenait désormais le langage de tous les animaux de la forêt.`,
            `L'écureuil lui raconta où trouver les meilleures noisettes. Le hérisson montra le chemin des champignons dorés.`,
            `Les lapins invitèrent ${name} à leur festin souterrain, où ils partagèrent carottes sucrées et histoires drôles.`,
            `Un soir, le hibou sage révéla à ${name} que ce don était un cadeau pour sa gentillesse envers tous les vivants.`,
            `${name} devint l'ami de tous les animaux. Chaque jour apportait de nouvelles conversations et aventures.`,
            `Et ${name} vécut heureux, sachant que la forêt regorgeait de secrets pour ceux qui savent écouter.`
        ];
        return parts.slice(0, paragraphs).join('\n\n');
    }

    generateSpaceStory(name, paragraphs) {
        const parts = [
            `${name} construisit une fusée dans le jardin avec des boîtes de carton et beaucoup d'imagination.`,
            `Cette nuit-là, la fusée s'illumina ! ${name} monta à bord et s'envola vers les étoiles.`,
            `Sur la Lune, ${name} rencontra des aliens aux trois yeux qui adoraient la musique terrestre.`,
            `Ils visitèrent Saturne et glissèrent sur ses anneaux de glace scintillante.`,
            `Sur Mars, ${name} planta une graine de tournesol qui poussa instantanément en géant.`,
            `Les extraterrestres offrirent à ${name} une étoile filante personnelle pour rentrer chez soi.`,
            `De retour sur Terre, ${name} regarda le ciel différemment, sachant que des amis l'attendaient parmi les étoiles.`
        ];
        return parts.slice(0, paragraphs).join('\n\n');
    }

    generatePrincessStory(name, paragraphs) {
        const parts = [
            `Dans un royaume lointain, ${name} découvrit qu'elle était la princesse oubliée d'une terre magique.`,
            `Le château avait besoin d'elle : les jardins étaient tristes et les sujets avaient perdu espoir.`,
            `${name} n'avait pas besoin de robe de bal. Avec son intelligence et sa compassion, elle ralluma les lanternes du palais.`,
            `Elle organisa un grand festin où chacun partageait ses talents : chants, danses, et histoires.`,
            `Un dragon menaçant approcha, mais ${name} l'invita à participer au festin. Il devint le gardien du royaume.`,
            `Sous le règne de ${name}, le royaume fleurit. On se souvenait de cette princesse qui avait choisi la gentillesse.`,
            `Et ${name} vécut heureuse, sachant qu'une vraie princesse est celle qui prend soin des autres.`
        ];
        return parts.slice(0, paragraphs).join('\n\n');
    }

    generateDragonStory(name, paragraphs) {
        const parts = [
            `Tous les villageois avaient peur du dragon qui vivait dans la montagne. Sauf ${name}, curieux et sans peur.`,
            `Un jour, ${name} gravit la montagne et trouva le dragon en larmes. Une épine l'empêchait de voler.`,
            `${name} s'approcha doucement et retira l'épine. Le dragon soupira de soulagement et sourit.`,
            `Le dragon s'appelait Écaille-d'Argent. Il était seul et voulait juste un ami.`,
            `${name} et Écaille-d'Argent devinrent inséparables. Le dragon transportait gentiment les villageois malades chez le médecin.`,
            `Les villageois comprirent que le dragon n'était pas méchant. Il suffisait de lui donner une chance.`,
            `Et ainsi, grâce au courage de ${name}, le dragon devint le héros du village, aimé de tous.`
        ];
        return parts.slice(0, paragraphs).join('\n\n');
    }

    getFallbackStory() {
        return {
            title: `${this.state.childName} et l'Aventure Magique`,
            content: `Il était une fois ${this.state.childName}, un enfant curieux et brave.\n\nUn jour, alors qu'il explorait le jardin, ${this.state.childName} découvrit une porte secrète dans le vieux chêne.`,
            moral: 'La curiosité et la gentillesse ouvrent les portes du merveilleux.'
        };
    }

    displayStory(story) {
        document.getElementById('storyTitle').textContent = story.title;
        document.getElementById('storyContent').textContent = story.content;
        document.getElementById('storyMoral').textContent = '✨ ' + story.moral;
        document.getElementById('illustration').textContent = '🎨 Illustration en cours...';

        this.showScreen('storyScreen');
    }

    speakStory() {
        if (!this.state.currentStory) return;

        // Cancel any ongoing speech
        this.tts.cancel();

        const text = `${this.state.currentStory.title}. ${this.state.currentStory.content}. Morale de l'histoire: ${this.state.currentStory.moral}`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;

        // Try to find a French voice
        const frenchVoice = this.voices.find(v => v.lang.includes('fr'));
        if (frenchVoice) {
            utterance.voice = frenchVoice;
        }

        document.getElementById('ttsIcon').textContent = '⏸️';

        utterance.onend = () => {
            document.getElementById('ttsIcon').textContent = '🔊';
        };

        this.tts.speak(utterance);
    }

    async generateIllustration() {
        // Placeholder for DALL-E integration
        document.getElementById('illustration').textContent = '🎨 Génération DALL-E à implémenter...';
    }

    saveStory() {
        if (!this.state.currentStory) return;

        const stories = JSON.parse(localStorage.getItem('contesMagiques') || '[]');
        stories.push({
            ...this.state.currentStory,
            childName: this.state.childName,
            date: new Date().toISOString()
        });
        localStorage.setItem('contesMagiques', JSON.stringify(stories));

        alert('Histoire sauvegardée !');
    }

    backToSetup() {
        this.tts.cancel();
        this.showScreen('setupScreen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    checkInstallPrompt() {
        // Show install prompt after 3 seconds if not installed
        setTimeout(() => {
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                document.getElementById('installPrompt').classList.remove('hidden');
            }
        }, 3000);
    }
}

// Global functions for onclick handlers
let app;

function generateStory() {
    app.generateStory();
}

function backToSetup() {
    app.backToSetup();
}

function speakStory() {
    app.speakStory();
}

function generateIllustration() {
    app.generateIllustration();
}

function saveStory() {
    app.saveStory();
}

function installPWA() {
    // Trigger PWA install
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
    }
}

function dismissInstall() {
    document.getElementById('installPrompt').classList.add('hidden');
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app = new ContesMagiquesApp();

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then((reg) => console.log('Service Worker registered'))
            .catch((err) => console.log('Service Worker registration failed'));
    }

    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
    });
});