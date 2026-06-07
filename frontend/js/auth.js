// Auth page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupAuthUI();
});

function setupAuthUI() {
    // Update nav links based on login status
    const isLoggedIn = isLoggedIn();
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');

    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        try {
            const response = await HotelifyAPI.login({ email, password });
            
            if (response.token) {
                setToken(response.token);
                localStorage.setItem('userId', response.id);
                localStorage.setItem('userEmail', response.email);
                localStorage.setItem('userName', `${response.firstName} ${response.lastName}`);
                
                if (remember) {
                    localStorage.setItem('rememberEmail', email);
                }
                
                showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                showError('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Login failed. Please check your credentials.');
        }
    });
    
    // Load remembered email
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match
        if (password !== confirmPassword) {
            showError('Passwords do not match!');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            showError('Password must be at least 6 characters!');
            return;
        }

        try {
            const response = await HotelifyAPI.register({
                firstName,
                lastName,
                email,
                phoneNumber: phone,
                password
            });
            
            if (response.message || response === 'User registered successfully') {
                showSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Register error:', error);
            showError('Registration failed. Please try again.');
        }
    });
}

// Utility Functions
function showSuccess(message) {
    alert(message); // You can replace with a better notification system
}

function showError(message) {
    alert(message); // You can replace with a better notification system
}