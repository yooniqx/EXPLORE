// Load destinations data
let allDestinations = [];
let filteredDestinations = [];

// Load destinations from JSON
async function loadDestinations() {
    try {
        const response = await fetch('destinations.json');
        const data = await response.json();
        allDestinations = data.destinations;
        filteredDestinations = [...allDestinations];
        
        // Check for search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            document.getElementById('destinationSearch').value = searchQuery;
            filterDestinations();
        } else {
            displayDestinations(filteredDestinations);
        }
    } catch (error) {
        console.error('Error loading destinations:', error);
        document.getElementById('resultsCount').textContent = 'Error loading destinations. Please refresh the page.';
    }
}

// Display destinations
function displayDestinations(destinations, searchTerm = '') {
    const grid = document.getElementById('destinationsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    grid.innerHTML = '';
    
    if (destinations.length === 0 && searchTerm) {
        // Show fallback card for worldwide search
        noResults.style.display = 'none';
        resultsCount.textContent = 'Showing 1 result (worldwide search)';
        const fallbackCard = createFallbackCard(searchTerm);
        grid.appendChild(fallbackCard);
        return;
    }
    
    if (destinations.length === 0) {
        noResults.style.display = 'block';
        resultsCount.textContent = 'No destinations found';
        return;
    }
    
    noResults.style.display = 'none';
    resultsCount.textContent = `Showing ${destinations.length} destination${destinations.length !== 1 ? 's' : ''}`;
    
    destinations.forEach(dest => {
        const card = createDestinationCard(dest);
        grid.appendChild(card);
    });
}

// Create destination card
function createDestinationCard(dest) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    
    // Create highlights HTML
    const highlightsHTML = dest.highlights.slice(0, 3).map(h =>
        `<span class="highlight-tag">${h}</span>`
    ).join('');
    
    card.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}" onerror="this.src='gallerybg.jpg'">
        <div class="card-content">
            <div class="card-header">
                <div class="card-title">
                    <h3>${dest.name}</h3>
                    <p><i class="fa fa-map-marker"></i> ${dest.country}, ${dest.continent}</p>
                </div>
                <span class="category-badge">${dest.category}</span>
            </div>
            <p class="card-description">${dest.description}</p>
            <div class="card-highlights">
                <h4><i class="fa fa-star"></i> Top Highlights:</h4>
                <div class="highlights-list">
                    ${highlightsHTML}
                </div>
            </div>
            <div class="card-footer">
                <div class="best-time">
                    <i class="fa fa-calendar"></i>
                    <strong>Best Time:</strong><br>
                    <small>${dest.bestTime}</small>
                </div>
                <a href="${dest.wikiLink}" target="_blank" rel="noopener noreferrer" class="learn-more-btn">
                    Learn More <i class="fa fa-external-link"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Create fallback card for worldwide search
function createFallbackCard(searchTerm) {
    const card = document.createElement('div');
    card.className = 'destination-card fallback-card';
    
    // Capitalize search term
    const capitalizedTerm = searchTerm.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // Create Wikipedia Special:Search URL (as requested)
    const wikiSearchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(searchTerm)}`;
    
    card.innerHTML = `
        <div class="fallback-icon">
            <i class="fa fa-globe"></i>
        </div>
        <div class="card-content">
            <div class="card-header">
                <div class="card-title">
                    <h3>${capitalizedTerm}</h3>
                    <p><i class="fa fa-search"></i> Not in Database</p>
                </div>
                <span class="category-badge fallback-badge">External</span>
            </div>
            <p class="card-description">
                This destination is not currently in our local database. You can search for <strong>"${capitalizedTerm}"</strong> on Wikipedia for comprehensive information.
            </p>
            <div class="fallback-info">
                <p><i class="fa fa-info-circle"></i> This could be a city, town, landmark, region, or tourist spot anywhere in the world.</p>
            </div>
            <div class="card-footer fallback-footer">
                <a href="${wikiSearchUrl}" target="_blank" rel="noopener noreferrer" class="learn-more-btn primary-btn">
                    <i class="fa fa-wikipedia-w"></i> Search on Wikipedia
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Filter destinations with word-boundary matching and ranking
function filterDestinations() {
    const searchTerm = document.getElementById('destinationSearch').value.toLowerCase().trim();
    const continent = document.getElementById('continentFilter').value;
    const category = document.getElementById('categoryFilter').value;
    
    // If no search term and no filters, show all
    if (searchTerm === '' && continent === 'all' && category === 'all') {
        filteredDestinations = [...allDestinations];
        displayDestinations(filteredDestinations, '');
        return;
    }
    
    // Helper function to check word boundary match
    function wordBoundaryMatch(text, search) {
        // Create regex with word boundaries
        const regex = new RegExp('\\b' + search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        return regex.test(text);
    }
    
    // Filter with ranking system
    const matches = allDestinations.map(dest => {
        let score = 0;
        let matchesSearch = true;
        
        if (searchTerm !== '') {
            const name = dest.name.toLowerCase();
            const country = dest.country.toLowerCase();
            const description = dest.description.toLowerCase();
            const highlights = dest.highlights.map(h => h.toLowerCase()).join(' ');
            const continent = dest.continent.toLowerCase();
            
            // Exact match (highest priority)
            if (name === searchTerm || country === searchTerm) {
                score = 1000;
            }
            // Name starts with search term (word boundary)
            else if (name.startsWith(searchTerm)) {
                score = 500;
            }
            // Country starts with search term (word boundary)
            else if (country.startsWith(searchTerm)) {
                score = 400;
            }
            // Word boundary match in name
            else if (wordBoundaryMatch(name, searchTerm)) {
                score = 350;
            }
            // Word boundary match in country
            else if (wordBoundaryMatch(country, searchTerm)) {
                score = 250;
            }
            // Word boundary match in continent
            else if (wordBoundaryMatch(continent, searchTerm)) {
                score = 150;
            }
            // Word boundary match in highlights
            else if (wordBoundaryMatch(highlights, searchTerm)) {
                score = 100;
            }
            // Word boundary match in description
            else if (wordBoundaryMatch(description, searchTerm)) {
                score = 50;
            }
            // No match
            else {
                matchesSearch = false;
            }
        }
        
        // Apply continent filter
        const matchesContinent = continent === 'all' || dest.continent === continent;
        
        // Apply category filter
        const matchesCategory = category === 'all' || dest.category === category;
        
        return {
            destination: dest,
            score: score,
            matches: matchesSearch && matchesContinent && matchesCategory
        };
    });
    
    // Filter and sort by score
    filteredDestinations = matches
        .filter(m => m.matches)
        .sort((a, b) => b.score - a.score)
        .map(m => m.destination);
    
    // Only show fallback if search term exists and no matches found
    const shouldShowFallback = searchTerm !== '' && filteredDestinations.length === 0;
    
    displayDestinations(filteredDestinations, shouldShowFallback ? searchTerm : '');
}

// Reset filters
function resetFilters() {
    document.getElementById('destinationSearch').value = '';
    document.getElementById('continentFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    filteredDestinations = [...allDestinations];
    displayDestinations(filteredDestinations);
}

// Event listeners
document.getElementById('searchBtn').addEventListener('click', filterDestinations);
document.getElementById('destinationSearch').addEventListener('input', filterDestinations);
document.getElementById('continentFilter').addEventListener('change', filterDestinations);
document.getElementById('categoryFilter').addEventListener('change', filterDestinations);
document.getElementById('resetFilters').addEventListener('click', resetFilters);

// Search on Enter key
document.getElementById('destinationSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        filterDestinations();
    }
});

// Load destinations on page load
loadDestinations();

// Made with Bob
