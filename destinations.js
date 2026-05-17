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
function displayDestinations(destinations) {
    const grid = document.getElementById('destinationsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    grid.innerHTML = '';
    
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

// Filter destinations
function filterDestinations() {
    const searchTerm = document.getElementById('destinationSearch').value.toLowerCase();
    const continent = document.getElementById('continentFilter').value;
    const category = document.getElementById('categoryFilter').value;
    
    filteredDestinations = allDestinations.filter(dest => {
        const matchesSearch = searchTerm === '' || 
            dest.name.toLowerCase().includes(searchTerm) ||
            dest.country.toLowerCase().includes(searchTerm) ||
            dest.description.toLowerCase().includes(searchTerm) ||
            dest.highlights.some(h => h.toLowerCase().includes(searchTerm));
        
        const matchesContinent = continent === 'all' || dest.continent === continent;
        const matchesCategory = category === 'all' || dest.category === category;
        
        return matchesSearch && matchesContinent && matchesCategory;
    });
    
    displayDestinations(filteredDestinations);
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
