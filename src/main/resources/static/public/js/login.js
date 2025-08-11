document.addEventListener("DOMContentLoaded", () => {
    onLoaded();
});

function onLoaded() {
    clearLoginForm();
    console.log("Login page loaded.");
    
    // Add form validation
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Clear previous error state
    field.classList.remove('border-red-500');
    
    // Validate based on field
    if (field.name === 'name') {
        if (!value) {
            showFieldError(field, 'Username is required');
        } else if (value.length < 4) {
            showFieldError(field, 'Username must be at least 4 characters');
        } else if (value.length > 15) {
            showFieldError(field, 'Username must be less than 16 characters');
        }
    } else if (field.name === 'password') {
        if (!value) {
            showFieldError(field, 'Password is required');
        } else if (value.length < 4) {
            showFieldError(field, 'Password must be at least 4 characters');
        } else if (value.length > 15) {
            showFieldError(field, 'Password must be less than 16 characters');
        }
    }
}

function showFieldError(field, message) {
    field.classList.add('border-red-500');
    // You could add a small error message below the field here if desired
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('border-red-500');
}

function onLogin() {
    const name = document.forms["loginForm"]["name"].value.trim();
    const password = document.forms["loginForm"]["password"].value.trim();
    
    // Client-side validation
    if (!name || !password) {
        showToast("Please fill in all fields", 'warning');
        return;
    }
    
    if (name.length < 4 || name.length > 15) {
        showToast("Username must be between 4 and 15 characters", 'warning');
        return;
    }
    
    if (password.length < 4 || password.length > 15) {
        showToast("Password must be between 4 and 15 characters", 'warning');
        return;
    }
    
    const data = {
        "name": name,
        "password": password
    };
    
    // Use the enhanced API call function
    apiCall(
        'POST', 
        '/login/perform_login', 
        data,
        // Success callback
        (response) => {
            showToast("Login successful! Redirecting...", 'success');
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        },
        // Error callback
        (error) => {
            showToast(error, 'error');
            clearLoginForm();
        }
    );
}

function clearLoginForm() {
    clearFormValue("loginForm", "name");
    clearFormValue("loginForm", "password");
    
    // Clear any error states
    const inputs = document.querySelectorAll('#loginForm input');
    inputs.forEach(input => {
        input.classList.remove('border-red-500');
    });
}