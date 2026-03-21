document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email && password) {
            // Simulate successful signup
            alert('Welcome to SeedSense! Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        } else {
            alert('Please fill in all fields');
        }
    });
});

// Google Sign-In callback function
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // In a real app, you would verify this token on your server
    alert('Google Sign-In successful! Redirecting to dashboard...');
    window.location.href = 'dashboard.html';
}