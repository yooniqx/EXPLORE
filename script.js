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

// Chatbot Functionality with Session Storage
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotModal = document.getElementById('chatbotModal');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

// Storage key for chat history
const CHAT_STORAGE_KEY = 'exploreChatHistory';

// Initialize chatbot - restore previous messages
function initializeChatbot() {
    if (chatbotMessages) {
        // Clear existing messages first
        chatbotMessages.innerHTML = '';
        
        // Load chat history from sessionStorage
        const chatHistory = loadChatHistory();
        
        if (chatHistory && chatHistory.length > 0) {
            // Restore previous messages
            chatHistory.forEach(msg => {
                addMessageToDOM(msg.text, msg.type, false); // false = don't save to storage
            });
        } else {
            // Show welcome message only if no history
            const welcomeMsg = '👋 Hello! I\'m your professional AI travel guide. I can help you with:<br><br>• 🗺️ Destination recommendations<br>• ✈️ Trip planning advice<br>• 💰 Budget tips<br>• 🏛️ Local attractions<br>• 📅 Best times to visit<br>• 🛡️ Travel safety tips<br><br>What would you like to know?';
            addMessageToDOM(welcomeMsg, 'bot', true);
        }
    }
}

// Load chat history from sessionStorage
function loadChatHistory() {
    try {
        const history = sessionStorage.getItem(CHAT_STORAGE_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error('Error loading chat history:', e);
        return [];
    }
}

// Save chat history to sessionStorage
function saveChatHistory(messages) {
    try {
        sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
        console.error('Error saving chat history:', e);
    }
}

// Add message to chat history
function addToChatHistory(text, type) {
    const history = loadChatHistory();
    history.push({ text, type, timestamp: Date.now() });
    saveChatHistory(history);
}

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

    // Simulate bot response with slight delay for realism
    setTimeout(() => {
        const response = generateBotResponse(message);
        addMessage(response, 'bot');
    }, 600);
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

// Add message to chat (wrapper that saves to storage)
function addMessage(text, type) {
    addMessageToDOM(text, type, true);
}

// Add message to DOM
function addMessageToDOM(text, type, saveToStorage = true) {
    if (!chatbotMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'user' ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Save to storage if needed
    if (saveToStorage) {
        addToChatHistory(text, type);
    }
}

// Enhanced bot response system - Professional travel guide
function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Beach destinations
    if (lowerMessage.includes('beach') || lowerMessage.includes('beaches')) {
        return '🏖️ <strong>Top Beach Destinations for 2024:</strong><br><br>' +
               '• <strong>Maldives</strong> - Crystal-clear turquoise waters, overwater bungalows, and world-class diving. Best time: November-April. Budget: $200-500/day for luxury resorts.<br><br>' +
               '• <strong>Bali, Indonesia</strong> - Stunning beaches like Seminyak and Nusa Dua, vibrant culture, and affordable luxury. Best time: April-October. Budget: $50-150/day.<br><br>' +
               '• <strong>Santorini, Greece</strong> - Unique volcanic beaches with red and black sand, iconic white-washed buildings. Best time: May-October. Budget: $150-300/day.<br><br>' +
               '• <strong>Bondi Beach, Sydney</strong> - Iconic Australian beach with great surf, coastal walks, and vibrant cafe culture. Best time: December-February. Budget: $100-250/day.<br><br>' +
               '<em>💡 Pro tip: Book accommodations 3-4 months in advance for better rates, especially during peak season!</em>';
    }

    // Historical sites
    if (lowerMessage.includes('historical') || lowerMessage.includes('history')) {
        return '🏛️ <strong>Must-Visit Historical Destinations:</strong><br><br>' +
               '• <strong>Rome, Italy</strong> - Explore the Colosseum (80 AD), Roman Forum, and Vatican City. Skip-the-line tickets recommended. Best time: April-June, September-October. Budget: $100-200/day.<br><br>' +
               '• <strong>Cairo, Egypt</strong> - Pyramids of Giza (2560 BC), Egyptian Museum, and Sphinx. Hire a licensed guide for authentic insights. Best time: October-April. Budget: $50-100/day.<br><br>' +
               '• <strong>Petra, Jordan</strong> - Ancient Nabataean city carved into rose-red cliffs. Allocate 2-3 days to explore fully. Best time: March-May, September-November. Budget: $80-150/day.<br><br>' +
               '• <strong>Machu Picchu, Peru</strong> - 15th-century Incan citadel. Book permits 3-6 months ahead. Best time: April-October. Budget: $100-200/day including trek.<br><br>' +
               '<em>💡 Pro tip: Consider hiring local guides - they provide invaluable historical context and support local communities!</em>';
    }

    // Budget travel
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        return '💰 <strong>Comprehensive Budget Travel Guide:</strong><br><br>' +
               '<strong>Timing Strategies:</strong><br>' +
               '• Travel during shoulder seasons (April-May, September-October) for 30-50% savings<br>' +
               '• Book flights on Tuesdays/Wednesdays, 6-8 weeks in advance<br>' +
               '• Use flight comparison tools and set price alerts<br><br>' +
               '<strong>Accommodation Tips:</strong><br>' +
               '• Hostels: $10-30/night with social atmosphere<br>' +
               '• Guesthouses: $20-50/night, more privacy<br>' +
               '• Airbnb: Often cheaper for groups, includes kitchen<br>' +
               '• Consider house-sitting or work exchanges<br><br>' +
               '<strong>Daily Expenses:</strong><br>' +
               '• Eat where locals eat - authentic and affordable<br>' +
               '• Use public transportation or walk<br>' +
               '• Free walking tours (tip-based)<br>' +
               '• Visit free museums on designated days<br><br>' +
               '<strong>Budget-Friendly Destinations:</strong><br>' +
               '• <strong>Southeast Asia</strong>: Thailand, Vietnam, Cambodia ($30-50/day)<br>' +
               '• <strong>Eastern Europe</strong>: Poland, Hungary, Czech Republic ($40-70/day)<br>' +
               '• <strong>Central America</strong>: Guatemala, Nicaragua ($35-60/day)<br>' +
               '• <strong>South Asia</strong>: India, Nepal ($25-45/day)<br><br>' +
               '<em>💡 Pro tip: Get a travel credit card with no foreign transaction fees and travel insurance included!</em>';
    }

    // Europe
    if (lowerMessage.includes('europe') || lowerMessage.includes('european')) {
        return '🇪🇺 <strong>Essential European Destinations:</strong><br><br>' +
               '• <strong>Paris, France</strong> - Eiffel Tower, Louvre Museum, Notre-Dame. Use Paris Museum Pass for savings. Best time: April-June, September-October. Budget: $150-300/day.<br><br>' +
               '• <strong>Rome, Italy</strong> - Ancient ruins, Vatican, Trevi Fountain. Book Colosseum tickets online to skip 2-hour queues. Best time: April-June, September-October. Budget: $100-200/day.<br><br>' +
               '• <strong>London, UK</strong> - British Museum (free!), Tower of London, West End shows. Get an Oyster card for transport. Best time: May-September. Budget: $150-300/day.<br><br>' +
               '• <strong>Barcelona, Spain</strong> - Sagrada Familia, Park Güell, Gothic Quarter. Book Gaudí sites in advance. Best time: May-June, September-October. Budget: $100-180/day.<br><br>' +
               '• <strong>Amsterdam, Netherlands</strong> - Canal tours, Anne Frank House, Van Gogh Museum. Rent a bike like locals. Best time: April-May, September-October. Budget: $120-220/day.<br><br>' +
               '<em>💡 Pro tip: Consider a Eurail pass if visiting multiple countries - it offers great flexibility and value!</em>';
    }

    // Asia
    if (lowerMessage.includes('asia') || lowerMessage.includes('asian')) {
        return '🌏 <strong>Incredible Asian Destinations:</strong><br><br>' +
               '• <strong>Tokyo, Japan</strong> - Blend of ultra-modern and traditional. Visit Senso-ji Temple, Shibuya Crossing, teamLab Borderless. Get a JR Pass for trains. Best time: March-May, September-November. Budget: $100-200/day.<br><br>' +
               '• <strong>Bali, Indonesia</strong> - Ubud rice terraces, beach clubs, temples. Rent a scooter for flexibility. Best time: April-October. Budget: $50-120/day.<br><br>' +
               '• <strong>Dubai, UAE</strong> - Burj Khalifa, desert safaris, luxury shopping. Book activities online for discounts. Best time: November-March. Budget: $150-400/day.<br><br>' +
               '• <strong>Bangkok, Thailand</strong> - Grand Palace, floating markets, street food paradise. Use BTS Skytrain to avoid traffic. Best time: November-February. Budget: $40-100/day.<br><br>' +
               '• <strong>Seoul, South Korea</strong> - Palaces, K-pop culture, amazing food. Get a T-money card for transport. Best time: March-May, September-November. Budget: $70-150/day.<br><br>' +
               '<em>💡 Pro tip: Learn basic local phrases - it enhances your experience and locals appreciate the effort!</em>';
    }

    // Nature destinations
    if (lowerMessage.includes('nature') || lowerMessage.includes('natural') || lowerMessage.includes('outdoor')) {
        return '🌿 <strong>Breathtaking Nature Destinations:</strong><br><br>' +
               '• <strong>Iceland</strong> - Golden Circle, Blue Lagoon, Northern Lights (September-April), midnight sun (June-July). Rent a 4x4 for Ring Road adventure. Best time: June-August for hiking, September-March for Northern Lights. Budget: $150-300/day.<br><br>' +
               '• <strong>Grand Canyon, USA</strong> - South Rim most accessible, North Rim more remote. Hike Bright Angel Trail, watch sunrise at Mather Point. Best time: March-May, September-November. Budget: $100-200/day.<br><br>' +
               '• <strong>New Zealand</strong> - Milford Sound, Tongariro Crossing, Franz Josef Glacier. Perfect for Lord of the Rings fans. Best time: December-February. Budget: $100-200/day.<br><br>' +
               '• <strong>Patagonia, Chile/Argentina</strong> - Torres del Paine, Perito Moreno Glacier. Book refugios early for W Trek. Best time: December-February. Budget: $80-180/day.<br><br>' +
               '<em>💡 Pro tip: Respect Leave No Trace principles - pack out all trash and stay on marked trails!</em>';
    }

    // Romantic/honeymoon
    if (lowerMessage.includes('romantic') || lowerMessage.includes('honeymoon') || lowerMessage.includes('couple')) {
        return '💕 <strong>Most Romantic Destinations:</strong><br><br>' +
               '• <strong>Paris, France</strong> - Seine river cruises, Eiffel Tower at sunset, intimate bistros in Montmartre. Book a room with Eiffel Tower view. Best time: April-June, September-October. Budget: $200-400/day.<br><br>' +
               '• <strong>Venice, Italy</strong> - Private gondola rides, St. Mark\'s Square, hidden canals. Stay in Dorsoduro for fewer crowds. Best time: April-June, September-October. Budget: $180-350/day.<br><br>' +
               '• <strong>Santorini, Greece</strong> - Sunset in Oia, wine tasting, caldera views. Book cave hotels in Imerovigli. Best time: May-October. Budget: $200-400/day.<br><br>' +
               '• <strong>Maldives</strong> - Overwater villas, private beaches, couples spa treatments. All-inclusive resorts recommended. Best time: November-April. Budget: $300-800/day.<br><br>' +
               '<em>💡 Pro tip: Book a couples photography session - professional photos make priceless honeymoon memories!</em>';
    }

    // Best time to visit
    if (lowerMessage.includes('when') || lowerMessage.includes('best time')) {
        return '📅 <strong>Optimal Travel Times by Region:</strong><br><br>' +
               '<strong>Europe:</strong> April-June, September-October (pleasant weather, fewer crowds)<br>' +
               '<strong>Southeast Asia:</strong> November-March (dry season)<br>' +
               '<strong>Caribbean:</strong> December-April (avoid hurricane season)<br>' +
               '<strong>South America:</strong> September-November (spring)<br>' +
               '<strong>Africa (Safari):</strong> June-October (dry season)<br>' +
               '<strong>Japan:</strong> Late March-April (cherry blossoms), October-November (fall foliage)<br><br>' +
               '<em>💡 Pro tip: Shoulder seasons offer the best balance of weather, crowds, and prices!</em>';
    }

    // Trip planning
    if (lowerMessage.includes('plan') || lowerMessage.includes('planning')) {
        return '✈️ <strong>Complete Trip Planning Guide:</strong><br><br>' +
               '<strong>3-6 Months Before:</strong><br>' +
               '• Research destinations and set budget<br>' +
               '• Check passport validity (6+ months required)<br>' +
               '• Research visa requirements<br>' +
               '• Book flights and accommodations<br><br>' +
               '<strong>1-3 Months Before:</strong><br>' +
               '• Get travel insurance<br>' +
               '• Book major activities and tours<br>' +
               '• Notify bank of travel dates<br>' +
               '• Get required vaccinations<br><br>' +
               '<strong>2-4 Weeks Before:</strong><br>' +
               '• Download offline maps<br>' +
               '• Learn basic local phrases<br>' +
               '• Pack smart (check weather)<br>' +
               '• Make document copies<br><br>' +
               '<em>💡 Pro tip: Don\'t over-plan! Leave room for spontaneous discoveries and local recommendations.</em>';
    }

    // Visa and passport
    if (lowerMessage.includes('visa') || lowerMessage.includes('passport')) {
        return '📋 <strong>Travel Documents Guide:</strong><br><br>' +
               '<strong>Passport Requirements:</strong><br>' +
               '• Must be valid for 6+ months beyond return date<br>' +
               '• Need blank pages for stamps (2-4 recommended)<br>' +
               '• Keep digital copies in cloud storage<br><br>' +
               '<strong>Visa Information:</strong><br>' +
               '• <strong>Visa-free</strong>: Many countries offer 30-90 days for tourists<br>' +
               '• <strong>Visa-on-arrival</strong>: Pay fee at airport<br>' +
               '• <strong>E-visa</strong>: Apply online 1-4 weeks before<br>' +
               '• <strong>Schengen Area</strong>: Single visa covers 26 European countries<br><br>' +
               '<em>💡 Pro tip: Check requirements on official embassy websites and apply early!</em>';
    }

    // Food and cuisine
    if (lowerMessage.includes('food') || lowerMessage.includes('cuisine') || lowerMessage.includes('eat')) {
        return '🍽️ <strong>World\'s Best Culinary Destinations:</strong><br><br>' +
               '• <strong>Tokyo, Japan</strong> - Most Michelin stars globally. Try sushi at Tsukiji Market, ramen in Shinjuku. Budget: $30-200/meal.<br><br>' +
               '• <strong>Paris, France</strong> - Haute cuisine capital. Must-try: croissants, escargot, coq au vin. Budget: $40-300/meal.<br><br>' +
               '• <strong>Bangkok, Thailand</strong> - Street food paradise. Try pad thai, tom yum, mango sticky rice. Budget: $2-30/meal.<br><br>' +
               '• <strong>Rome, Italy</strong> - Authentic Italian cuisine. Must-eat: carbonara, cacio e pepe, gelato. Budget: $15-80/meal.<br><br>' +
               '<em>💡 Pro tip: Eat where locals eat - if you see a line of locals, join it!</em>';
    }

    // Adventure activities
    if (lowerMessage.includes('adventure') || lowerMessage.includes('activities') || lowerMessage.includes('extreme')) {
        return '🎯 <strong>Top Adventure Destinations:</strong><br><br>' +
               '• <strong>Queenstown, New Zealand</strong> - Bungee jumping, skydiving, jet boating. Best time: December-February. Budget: $100-300/day + activities.<br><br>' +
               '• <strong>Iceland</strong> - Glacier hiking, ice cave exploration, Northern Lights hunting. Best time: June-August for hiking. Budget: $150-300/day.<br><br>' +
               '• <strong>Costa Rica</strong> - Zip-lining, white-water rafting, surfing, volcano hiking. Best time: December-April. Budget: $70-150/day.<br><br>' +
               '• <strong>Nepal</strong> - Everest Base Camp trek, Annapurna Circuit, paragliding. Best time: March-May, September-November. Budget: $30-80/day.<br><br>' +
               '<em>💡 Pro tip: Always use certified operators and ensure your travel insurance covers extreme sports!</em>';
    }

    // Family travel
    if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('children')) {
        return '👨‍👩‍👧‍👦 <strong>Best Family-Friendly Destinations:</strong><br><br>' +
               '• <strong>Orlando, Florida</strong> - Disney World, Universal Studios. Stay on-site for early park access. Best time: September-November. Budget: $200-500/day for family of 4.<br><br>' +
               '• <strong>Tokyo, Japan</strong> - DisneySea, teamLab Borderless, Pokemon Center. Very safe and clean. Best time: March-May. Budget: $150-300/day for family of 4.<br><br>' +
               '• <strong>London, UK</strong> - Free museums (Natural History, Science Museum), Harry Potter Studio Tour. Best time: May-September. Budget: $200-400/day for family of 4.<br><br>' +
               '• <strong>Gold Coast, Australia</strong> - Beautiful beaches, theme parks, wildlife sanctuaries. Best time: September-November. Budget: $150-300/day for family of 4.<br><br>' +
               '<em>💡 Pro tip: Many museums offer family passes - calculate if it\'s cheaper than individual tickets!</em>';
    }

    // Solo travel
    if (lowerMessage.includes('solo') || lowerMessage.includes('alone') || lowerMessage.includes('single')) {
        return '🎒 <strong>Best Solo Travel Destinations:</strong><br><br>' +
               '• <strong>Tokyo, Japan</strong> - Extremely safe, efficient transport, solo dining culture. Best time: March-May, September-November. Budget: $80-150/day.<br><br>' +
               '• <strong>Iceland</strong> - Very safe, easy to navigate, stunning nature. Join group tours to meet people. Best time: June-August. Budget: $100-200/day.<br><br>' +
               '• <strong>Portugal</strong> - Friendly locals, affordable, great hostel scene. Lisbon and Porto perfect for solo travelers. Best time: April-June. Budget: $50-100/day.<br><br>' +
               '• <strong>New Zealand</strong> - Safe, English-speaking, adventure-focused. Great for meeting travelers. Best time: December-February. Budget: $80-150/day.<br><br>' +
               '<em>💡 Pro tip: Stay in social hostels and join group tours to meet fellow travelers!</em>';
    }

    // Safety
    if (lowerMessage.includes('safe') || lowerMessage.includes('safety') || lowerMessage.includes('dangerous')) {
        return '🛡️ <strong>Essential Travel Safety Guide:</strong><br><br>' +
               '<strong>Before You Go:</strong><br>' +
               '• Register with your embassy<br>' +
               '• Get comprehensive travel insurance<br>' +
               '• Research local scams and safety concerns<br>' +
               '• Share itinerary with trusted contacts<br><br>' +
               '<strong>Money Safety:</strong><br>' +
               '• Use ATMs inside banks during business hours<br>' +
               '• Carry backup credit card separately<br>' +
               '• Use money belt or hidden pocket<br>' +
               '• Don\'t flash expensive items<br><br>' +
               '<strong>Personal Safety:</strong><br>' +
               '• Stay aware of surroundings<br>' +
               '• Avoid walking alone late at night<br>' +
               '• Use official taxis or ride-sharing apps<br>' +
               '• Trust your instincts<br><br>' +
               '<strong>Safest Destinations:</strong><br>' +
               '• Iceland, New Zealand, Japan, Switzerland, Singapore, Norway, Denmark, Canada<br><br>' +
               '<em>💡 Pro tip: Download offline maps and save emergency numbers before you go!</em>';
    }

    // Site navigation help
    if (lowerMessage.includes('site') || lowerMessage.includes('website') || lowerMessage.includes('navigate') || lowerMessage.includes('page')) {
        return '🧭 <strong>EXPLORE Website Guide:</strong><br><br>' +
               '<strong>Main Sections:</strong><br>' +
               '• <strong>Home</strong> - Welcome page with overview<br>' +
               '• <strong>Destinations</strong> - Browse and search destinations with filters<br>' +
               '• <strong>Gallery</strong> - Visual inspiration from worldwide locations<br>' +
               '• <strong>Contact Us</strong> - Get in touch or use AI assistant<br>' +
               '• <strong>Feedback</strong> - Share your experience<br><br>' +
               '<strong>Features:</strong><br>' +
               '• Search destinations quickly<br>' +
               '• Filter by continent, category, or interests<br>' +
               '• AI Travel Assistant available on every page<br><br>' +
               '<em>💡 Pro tip: Your chat history persists across all pages during your session!</em>';
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return '👋 <strong>Hello! Welcome to EXPLORE!</strong><br><br>' +
               'I\'m your professional AI travel guide. I can assist with:<br><br>' +
               '• 🗺️ Personalized destination recommendations<br>' +
               '• ✈️ Detailed trip planning and itineraries<br>' +
               '• 💰 Budget optimization and money-saving tips<br>' +
               '• 🏛️ Local attractions and hidden gems<br>' +
               '• 📅 Best times to visit and seasonal advice<br>' +
               '• 🛡️ Travel safety and health information<br>' +
               '• 🍽️ Food and culinary experiences<br>' +
               '• 🎯 Adventure activities<br><br>' +
               'What would you like to explore today?';
    }

    // Thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return '😊 <strong>You\'re very welcome!</strong><br><br>' +
               'I\'m here whenever you need travel advice or inspiration. Feel free to ask about destinations, planning, budgets, safety, or local experiences.<br><br>' +
               'Happy travels! 🌍✈️';
    }

    // Default response with helpful suggestions
    return '🤔 <strong>I\'m here to help with your travel planning!</strong><br><br>' +
           'I can provide detailed information about:<br><br>' +
           '• <strong>Destinations</strong> - "Best beaches in Asia" or "Historical sites in Europe"<br>' +
           '• <strong>Planning</strong> - "How to plan a trip" or "Best time to visit Japan"<br>' +
           '• <strong>Budget</strong> - "Budget travel tips" or "Affordable destinations"<br>' +
           '• <strong>Activities</strong> - "Adventure activities" or "Family-friendly destinations"<br>' +
           '• <strong>Safety</strong> - "Travel safety tips" or "Safe solo destinations"<br>' +
           '• <strong>Food</strong> - "Best food destinations" or "Street food in Asia"<br><br>' +
           'Try asking about specific destinations, travel styles, or regions!';
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', initializeChatbot);

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
