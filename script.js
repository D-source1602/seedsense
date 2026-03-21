// This function is called by the Google Identity Services library after a user signs in.
// It must be in the global scope to be accessible.
function handleCredentialResponse(response) {
  // For demonstration, we'll log the credential to the console.
  // In a real application, you would send this credential to your server
  // for verification and to create a user session.
  console.log("Encoded JWT ID token: " + response.credential);
  alert("Google Sign-In Successful! Check the console for the token.");
}

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    
    // Find the form element by its ID
    const form = document.getElementById('signup-form');
    
    // Add an event listener for the 'submit' event
    form.addEventListener('submit', function(event) {
        // Prevent the default form submission which reloads the page
        event.preventDefault();
        
        // For demonstration, show an alert
        alert('Sign Up button clicked!');
    });

});
// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationDisplay = document.getElementById('locationDisplay');

    getLocationBtn.addEventListener('click', () => {
        if ('geolocation' in navigator) {
            locationDisplay.textContent = 'Fetching location...';
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            locationDisplay.textContent = 'Geolocation is not supported by your browser.';
        }
    });

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        locationDisplay.innerHTML = `
            <strong>Latitude:</strong> ${latitude.toFixed(6)} <br>
            <strong>Longitude:</strong> ${longitude.toFixed(6)} <br><br>
            <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View on Google Maps</a>
        `;
    }

    function showError(error) {
        let message = 'An error occurred while fetching your location.';
        if (error.code === error.PERMISSION_DENIED) {
            message = 'Permission to access location was denied.';
        }
        locationDisplay.textContent = message;
    }
});
// script.js (Updated)

// Called by Google Sign-In on success
function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
  alert("Google Sign-In Successful! Redirecting...");
  
  // Redirect to the dashboard page
  window.location.href = 'dashboard.html';
}

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page reload
        alert('Sign Up Successful! Redirecting...');
        
        // Redirect to the dashboard page
        window.location.href = 'dashboard.html';
    });
});