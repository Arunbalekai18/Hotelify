# Hotelify - Hotel Reservation System

A complete hotel reservation platform built with Java Spring Boot backend and HTML/CSS/JavaScript frontend.

## Features

- User Registration & Login
- Hotel Search & Filtering
- Room Booking & Reservation
- Payment Processing
- User Reviews & Ratings
- Booking Management (View, Cancel, Modify)
- Admin Dashboard

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Java
- Spring Boot
- Spring Security (JWT Authentication)
- Spring Data JPA

### Database
- MySQL 8.0+

## Project Structure

```
hotelify/
├── frontend/              # HTML, CSS, JS files
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── pages/
├── backend/               # Java Spring Boot project
│   ├── src/
│   ├── pom.xml
│   └── application.yml
├── database/              # MySQL schema
│   └── schema.sql
└── docs/                  # Documentation
```

## Installation & Setup

### Prerequisites
- Java 11 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js (optional, for frontend development server)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure MySQL connection in `application.yml`

3. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Open `index.html` in a web browser or use a local server:
```bash
python -m http.server 8000
```

3. Access at `http://localhost:8000`

### Database Setup

1. Create MySQL database:
```bash
mysql -u root -p
CREATE DATABASE hotelify;
USE hotelify;
SOURCE database/schema.sql;
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/{id}` - Get hotel details
- `GET /api/hotels/search` - Search hotels
- `POST /api/hotels` - Create hotel (Admin)
- `PUT /api/hotels/{id}` - Update hotel (Admin)
- `DELETE /api/hotels/{id}` - Delete hotel (Admin)

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/{id}` - Get room details
- `GET /api/rooms/hotel/{hotelId}` - Get rooms by hotel
- `POST /api/rooms` - Create room (Admin)
- `PUT /api/rooms/{id}` - Update room (Admin)
- `DELETE /api/rooms/{id}` - Delete room (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/{id}` - Get booking details
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Reviews
- `GET /api/reviews/hotel/{hotelId}` - Get hotel reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/{id}` - Delete review

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/{id}` - Get payment details

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
