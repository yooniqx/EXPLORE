// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.whole');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.whole li a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Search Functionality
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `destinations.html?search=${encodeURIComponent(query)}`;
        }
    });
}

// Chatbot Functionality
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotModal = document.getElementById('chatbotModal');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

// Toggle chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotModal.classList.toggle('active');
        if (chatbotModal.classList.contains('active')) {
            chatbotInput.focus();
        }
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotModal.classList.remove('active');
    });
}

// Send message
function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Simulate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addMessage(response, 'bot');
    }, 500);
}

if (chatbotSend) {
    chatbotSend.addEventListener('click', sendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Suggestion buttons
document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        chatbotInput.value = query;
        sendMessage();
    });
});

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'user' ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Generate bot response (simple rule-based system)
function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Destination recommendations
    if (lowerMessage.includes('beach') || lowerMessage.includes('beaches')) {
        return '🏖️ For amazing beaches, I recommend:<br><br>• <strong>Maldives</strong> - Crystal clear waters and luxury resorts<br>• <strong>Bali</strong> - Beautiful beaches with vibrant culture<br>• <strong>Santorini</strong> - Stunning Greek island beaches<br>• <strong>Sydney</strong> - Iconic Bondi Beach<br><br>Would you like more details about any of these?';
    }

    if (lowerMessage.includes('historical') || lowerMessage.includes('history')) {
        return '🏛️ For history enthusiasts, check out:<br><br>• <strong>Rome</strong> - Ancient Colosseum and Roman Forum<br>• <strong>Cairo</strong> - Pyramids of Giza and Egyptian treasures<br>• <strong>Petra</strong> - Ancient city carved in stone<br>• <strong>Machu Picchu</strong> - Mysterious Incan ruins<br><br>Each offers incredible historical experiences!';
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        return '💰 Budget Travel Tips:<br><br>• Travel during off-peak seasons<br>• Book flights 2-3 months in advance<br>• Use local transportation<br>• Stay in hostels or guesthouses<br>• Eat at local restaurants<br>• Look for free walking tours<br>• Consider Southeast Asia, Eastern Europe, or South America for affordable destinations<br><br>What\'s your budget range?';
    }

    if (lowerMessage.includes('europe') || lowerMessage.includes('european')) {
        return '🇪🇺 Top European Destinations:<br><br>• <strong>Paris</strong> - Art, culture, and romance<br>• <strong>Rome</strong> - Ancient history and amazing food<br>• <strong>London</strong> - Museums, royalty, and culture<br>• <strong>Barcelona</strong> - Gaudí architecture and beaches<br>• <strong>Amsterdam</strong> - Canals and museums<br><br>Best time: April-June or September-October!';
    }

    if (lowerMessage.includes('asia') || lowerMessage.includes('asian')) {
        return '🌏 Amazing Asian Destinations:<br><br>• <strong>Tokyo</strong> - Modern tech meets ancient tradition<br>• <strong>Bali</strong> - Tropical paradise with rich culture<br>• <strong>Dubai</strong> - Luxury and futuristic architecture<br>• <strong>Maldives</strong> - Ultimate beach getaway<br>• <strong>Petra</strong> - Ancient wonder in Jordan<br><br>Each offers unique experiences!';
    }

    if (lowerMessage.includes('nature') || lowerMessage.includes('natural')) {
        return '🌿 Best Nature Destinations:<br><br>• <strong>Iceland</strong> - Glaciers, geysers, and Northern Lights<br>• <strong>Grand Canyon</strong> - Breathtaking natural wonder<br>• <strong>New Zealand</strong> - Stunning landscapes and adventure<br>• <strong>Cape Town</strong> - Table Mountain and wildlife<br><br>Perfect for outdoor enthusiasts!';
    }

    if (lowerMessage.includes('romantic') || lowerMessage.includes('honeymoon') || lowerMessage.includes('couple')) {
        return '💕 Romantic Destinations:<br><br>• <strong>Paris</strong> - The city of love<br>• <strong>Venice</strong> - Gondola rides and canals<br>• <strong>Santorini</strong> - Stunning sunsets<br>• <strong>Maldives</strong> - Private island luxury<br>• <strong>Bali</strong> - Tropical romance<br><br>Perfect for couples and honeymoons!';
    }

    if (lowerMessage.includes('when') || lowerMessage.includes('best time')) {
        return '📅 Best Travel Times:<br><br>• <strong>Europe</strong>: April-June, September-October<br>• <strong>Asia (Southeast)</strong>: November-March<br>• <strong>Caribbean</strong>: December-April<br>• <strong>South America</strong>: September-November<br>• <strong>Africa</strong>: May-October<br><br>Which destination are you interested in?';
    }

    if (lowerMessage.includes('plan') || lowerMessage.includes('planning')) {
        return '✈️ Trip Planning Checklist:<br><br>1. Choose your destination<br>2. Set your budget<br>3. Book flights early<br>4. Research visa requirements<br>5. Book accommodation<br>6. Plan activities and attractions<br>7. Get travel insurance<br>8. Pack appropriately<br><br>Need help with any specific step?';
    }

    if (lowerMessage.includes('visa') || lowerMessage.includes('passport')) {
        return '📋 Travel Documents:<br><br>• Check passport validity (6+ months)<br>• Research visa requirements for your destination<br>• Some countries offer visa-on-arrival<br>• EU Schengen visa covers 26 countries<br>• Keep digital copies of documents<br><br>Which country are you planning to visit?';
    }

    if (lowerMessage.includes('food') || lowerMessage.includes('cuisine')) {
        return '🍽️ Culinary Destinations:<br><br>• <strong>Paris</strong> - French haute cuisine<br>• <strong>Tokyo</strong> - Sushi and ramen<br>• <strong>Rome</strong> - Authentic Italian pasta<br>• <strong>Bangkok</strong> - Street food paradise<br>• <strong>Barcelona</strong> - Tapas and paella<br><br>Food is a great way to experience culture!';
    }

    if (lowerMessage.includes('adventure') || lowerMessage.includes('activities')) {
        return '🎯 Adventure Activities:<br><br>• <strong>Iceland</strong> - Glacier hiking, Northern Lights<br>• <strong>New Zealand</strong> - Bungee jumping, hiking<br>• <strong>Bali</strong> - Surfing, diving<br>• <strong>Grand Canyon</strong> - Hiking, rafting<br>• <strong>Dubai</strong> - Desert safari, skydiving<br><br>What type of adventure interests you?';
    }

    if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('children')) {
        return '👨‍👩‍👧‍👦 Family-Friendly Destinations:<br><br>• <strong>Orlando</strong> - Theme parks galore<br>• <strong>London</strong> - Museums and attractions<br>• <strong>Tokyo</strong> - Safe and fascinating<br>• <strong>Sydney</strong> - Beaches and wildlife<br>• <strong>Barcelona</strong> - Culture and beaches<br><br>All offer great experiences for families!';
    }

    if (lowerMessage.includes('solo') || lowerMessage.includes('alone')) {
        return '🎒 Solo Travel Destinations:<br><br>• <strong>Tokyo</strong> - Very safe and easy to navigate<br>• <strong>Iceland</strong> - Safe with stunning nature<br>• <strong>Amsterdam</strong> - Friendly and walkable<br>• <strong>Bali</strong> - Great solo traveler community<br>• <strong>New Zealand</strong> - Safe and adventurous<br><br>Solo travel is an amazing experience!';
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return '😊 You\'re welcome! Feel free to ask me anything else about travel. I\'m here to help you plan your perfect trip!';
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return '👋 Hello! I\'m your AI travel assistant. I can help you discover amazing destinations, plan trips, and provide travel tips. What would you like to know?';
    }

    // Default response
    return '🤔 I can help you with:<br><br>• Destination recommendations<br>• Travel planning tips<br>• Budget advice<br>• Best times to visit<br>• Activities and attractions<br>• Food and culture<br><br>Try asking about specific destinations, travel styles, or regions! For example: "Best beaches in Asia" or "Budget travel tips"';
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Made with Bob
