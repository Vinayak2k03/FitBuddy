document.addEventListener("DOMContentLoaded", () => {
    onLoaded();
});

function onLoaded() {
    clearRegisterForm();
    console.log("Register page loaded.");
    
    // Add form validation
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Add real-time password confirmation
    const passwordConfirm = document.getElementById('passwordConfirm');
    const password = document.getElementById('password');
    
    passwordConfirm.addEventListener('input', () => {
        validatePasswordMatch();
    });
    
    password.addEventListener('input', () => {
        if (passwordConfirm.value) {
            validatePasswordMatch();
        }
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

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm');
    
    if (passwordConfirm.value && password !== passwordConfirm.value) {
        showFieldError(passwordConfirm, 'Passwords do not match');
        return false;
    } else {
        clearFieldError({ target: passwordConfirm });
        return true;
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

function onRegister() {
    const name = document.forms["registerForm"]["name"].value.trim();
    const password = document.forms["registerForm"]["password"].value.trim();
    const passwordConfirm = document.forms["registerForm"]["passwordConfirm"].value.trim();
    
    // Client-side validation
    if (!name || !password || !passwordConfirm) {
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
    
    if (password !== passwordConfirm) {
        showToast("Password and confirm password don't match", 'warning');
        return;
    }
    
    const data = {
        "name": name,
        "password": password
    };
    
    // Use the enhanced API call function
    apiCall(
        'POST', 
        '/register', 
        data,
        // Success callback
        (response) => {
            showToast("Account created successfully! You can now log in.", 'success');
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        },
        // Error callback
        (error) => {
            showToast(error, 'error');
            clearRegisterForm();
        }
    );
}

function clearRegisterForm() {
    clearFormValue("registerForm", "name");
    clearFormValue("registerForm", "password");
    clearFormValue("registerForm", "passwordConfirm");
    
    // Clear any error states
    const inputs = document.querySelectorAll('#registerForm input');
    inputs.forEach(input => {
        input.classList.remove('border-red-500');
    });
}