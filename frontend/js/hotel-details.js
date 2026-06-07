// Hotel Details page JavaScript
let currentHotel = null;
let currentRoom = null;

document.addEventListener('DOMContentLoaded', function() {
    loadHotelDetails();
    setupModal();
});

async function loadHotelDetails() {
    const params = new URLSearchParams(window.location.search);
    const hotelId = params.get('id');

    if (!hotelId) {
        window.location.href = 'search.html';
        return;
    }

    try {
        // Load hotel details
        currentHotel = await HotelifyAPI.getHotelById(hotelId);
        displayHotelInfo();

        // Load rooms
        const rooms = await HotelifyAPI.getRoomsByHotel(hotelId);
        displayRooms(rooms);

        // Load reviews
        const reviews = await HotelifyAPI.getHotelReviews(hotelId);
        displayReviews(reviews);
    } catch (error) {
        console.error('Error loading hotel details:', error);
    }
}

function displayHotelInfo() {
    if (!currentHotel) return;

    document.getElementById('hotelImage').src = currentHotel.imageUrl || 'https://via.placeholder.com/1200x400';
    document.getElementById('hotelName').textContent = currentHotel.name;
    document.getElementById('rating').textContent = `★ ${currentHotel.rating || 0}`;
    document.getElementById('location').textContent = `📍 ${currentHotel.location}, ${currentHotel.city}`;
    document.getElementById('hotelDescription').textContent = currentHotel.description || 'A wonderful place to stay';

    // Display amenities
    const amenitiesList = document.getElementById('amenitiesList');
    const amenities = ['Free WiFi', 'Swimming Pool', 'Gym', 'Restaurant', 'Room Service', 'Air Conditioning'];
    amenitiesList.innerHTML = amenities.map(amenity => 
        `<div class="amenity-item">${amenity}</div>`
    ).join('');
}

function displayRooms(rooms) {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = rooms.map(room => `
        <div class="room-card">
            <div class="room-card-header">
                <h4>${room.roomType} Room</h4>
                <div class="room-type-info">Room #${room.roomNumber}</div>
            </div>
            <div class="room-card-body">
                <div class="room-details">
                    <div class="room-detail-item">👥 ${room.capacity} Guests</div>
                    <div class="room-detail-item">📏 Standard</div>
                </div>
                <div class="room-price">$${room.pricePerNight}/night</div>
                <div class="room-amenities">
                    <p><strong>Amenities:</strong> ${room.amenities || 'AC, WiFi, TV'}</p>
                </div>
                <button class="btn btn-primary btn-block" onclick="openBookingModal(${JSON.stringify(room).replace(/"/g, '&quot;')})">
                    Book Now
                </button>
            </div>
        </div>
    `).join('');
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet</p>';
        return;
    }

    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <div class="review-author">Guest Review</div>
                    <div class="review-rating">★ ${review.rating}</div>
                </div>
                <div class="review-date">${new Date(review.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="review-comment">${review.comment}</div>
        </div>
    `).join('');
}

function setupModal() {
    const modal = document.getElementById('roomModal');
    const closeBtn = document.getElementById('closeModal');
    const bookingForm = document.getElementById('bookingForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitBooking();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function openBookingModal(room) {
    currentRoom = room;
    document.getElementById('roomType').value = room.roomType;
    document.getElementById('roomPrice').value = `$${room.pricePerNight}`;
    document.getElementById('roomModal').style.display = 'block';
}

async function submitBooking() {
    if (!isLoggedIn()) {
        alert('Please login to book a room');
        window.location.href = 'login.html';
        return;
    }

    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const numberOfGuests = document.getElementById('guests').value;
    const specialRequests = document.getElementById('requests').value;

    if (!checkInDate || !checkOutDate) {
        alert('Please select check-in and check-out dates');
        return;
    }

    try {
        const totalPrice = currentRoom.pricePerNight * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
        
        const booking = await HotelifyAPI.createBooking({
            userId: parseInt(localStorage.getItem('userId')),
            roomId: currentRoom.id,
            checkInDate,
            checkOutDate,
            numberOfGuests: parseInt(numberOfGuests),
            totalPrice,
            specialRequests
        });

        alert('Booking created successfully!');
        window.location.href = `booking-confirmation.html?id=${booking.id}`;
    } catch (error) {
        console.error('Booking error:', error);
        alert('Failed to create booking. Please try again.');
    }
}