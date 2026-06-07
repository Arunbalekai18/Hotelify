// Search page JavaScript
let currentSearchParams = {};
let allHotels = [];

document.addEventListener('DOMContentLoaded', function() {
    setupUI();
    loadSearchParams();
    loadHotels();
});

function setupUI() {
    // Setup filter event listeners
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            document.getElementById('priceValue').textContent = e.target.value;
        });
    }

    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
        applyFilters.addEventListener('click', applyFilters);
    }

    const resetFilters = document.getElementById('resetFilters');
    if (resetFilters) {
        resetFilters.addEventListener('click', resetAllFilters);
    }

    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', (e) => sortHotels(e.target.value));
    }

    // Setup logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        const isLoggedIn = !!getToken();
        if (isLoggedIn) {
            logoutBtn.style.display = 'block';
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
}

function loadSearchParams() {
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city');
    const checkIn = params.get('checkIn');
    const checkOut = params.get('checkOut');

    if (city) {
        document.getElementById('filterCheckIn').value = checkIn || '';
        document.getElementById('filterCheckOut').value = checkOut || '';
        currentSearchParams = { city, checkIn, checkOut };
    }
}

async function loadHotels() {
    try {
        allHotels = await HotelifyAPI.getAllHotels();
        displayHotels(allHotels);
    } catch (error) {
        console.error('Error loading hotels:', error);
        showNoResults();
    }
}

function displayHotels(hotels) {
    const hotelsList = document.getElementById('hotelsList');
    const noResults = document.getElementById('noResults');

    if (!hotels || hotels.length === 0) {
        hotelsList.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    hotelsList.innerHTML = hotels.map(hotel => `
        <div class="hotel-result">
            <img src="${hotel.imageUrl || 'https://via.placeholder.com/250x200'}" alt="${hotel.name}" class="hotel-result-image">
            <div class="hotel-result-info">
                <h3>${hotel.name}</h3>
                <div class="hotel-result-rating">★ ${hotel.rating || 0}</div>
                <div class="hotel-result-location">📍 ${hotel.location}, ${hotel.city}</div>
                <p class="hotel-result-description">${hotel.description || 'A wonderful place to stay'}</p>
            </div>
            <div class="hotel-result-actions">
                <div class="price-info">
                    <div class="price-label">Starting from</div>
                    <div class="price">$120</div>
                </div>
                <a href="hotel-details.html?id=${hotel.id}" class="btn btn-primary">View Details</a>
            </div>
        </div>
    `).join('');
}

function applyFilters() {
    const priceMax = document.getElementById('priceRange').value;
    const ratings = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
        .map(el => parseInt(el.value));

    let filtered = allHotels.filter(hotel => {
        return hotel.rating >= (ratings.length > 0 ? Math.min(...ratings) : 0);
    });

    displayHotels(filtered);
}

function resetAllFilters() {
    document.getElementById('priceRange').value = 500;
    document.getElementById('priceValue').textContent = '500';
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(el => el.checked = false);
    displayHotels(allHotels);
}

function sortHotels(sortType) {
    let sorted = [...allHotels];

    switch(sortType) {
        case 'price-low':
            sorted.sort((a, b) => 120 - 150); // Mock pricing
            break;
        case 'price-high':
            sorted.sort((a, b) => 150 - 120);
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        default:
            sorted = allHotels;
    }

    displayHotels(sorted);
}

function showNoResults() {
    document.getElementById('hotelsList').innerHTML = '';
    document.getElementById('noResults').style.display = 'block';
}