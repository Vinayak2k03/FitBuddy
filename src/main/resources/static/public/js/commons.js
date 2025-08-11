let toastId = 0;

function hideStatus() {
    // Legacy compatibility - keeping for backward compatibility
    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
        toastContainer.innerHTML = '';
    }
}

function showStatus(message, type = 'info') {
    showToast(message, type);
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.warn('Toast container not found');
        return;
    }
    
    const id = `toast-${++toastId}`;
    
    const iconMap = {
        success: 'bi-check-circle-fill text-green-500',
        error: 'bi-exclamation-triangle-fill text-red-500',
        warning: 'bi-exclamation-circle-fill text-yellow-500',
        info: 'bi-info-circle-fill text-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.id = id;
    toast.className = `toast ${type} translate-x-full opacity-0`;
    toast.innerHTML = `
        <div class="flex items-start space-x-3">
            <i class="bi ${iconMap[type]} text-lg mt-0.5"></i>
            <div class="flex-1">
                <p class="text-gray-800 font-medium">${message}</p>
            </div>
            <button onclick="removeToast('${id}')" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <i class="bi bi-x text-lg"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        removeToast(id);
    }, 4000);
}

function removeToast(id) {
    const toast = document.getElementById(id);
    if (toast) {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }
}

function clearFormValue(formId, valueName) {
    const form = document.forms[formId];
    if (form && form[valueName]) {
        form[valueName].value = "";
    }
}

function hideDiv(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add("hidden");
        element.classList.remove("animate-slide-in");
    }
}

function showDiv(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove("hidden");
        element.classList.add("animate-slide-in");
    }
}

function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

function addLoadingState(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('loading', 'opacity-50', 'pointer-events-none');
    }
}

function removeLoadingState(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('loading', 'opacity-50', 'pointer-events-none');
    }
}

function updateTabState(activeTabId) {
    // Remove active state from all tabs
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active state to clicked tab
    const activeTab = document.getElementById(activeTabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

function showEmptyState(containerId, message, icon = 'bi-inbox') {
    const container = document.querySelector(`#${containerId} tbody`);
    if (container) {
        // Count the number of columns in the table header
        const thead = document.querySelector(`#${containerId} thead tr`);
        const columnCount = thead ? thead.children.length : 5;
        
        container.innerHTML = `
            <tr>
                <td colspan="${columnCount}" class="text-center py-12">
                    <div class="empty-state">
                        <i class="bi ${icon} text-4xl mb-4 opacity-50 block"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">No Data Found</h3>
                        <p class="text-gray-500">${message}</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

// User name functionality
function showUserName() {
    const loggedInNameElement = document.getElementById("logged-in-name");
    if (!loggedInNameElement) return;
    
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/user/name");
    xhr.send();
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (this.status == 200) {
                const data = JSON.parse(this.responseText);
                loggedInNameElement.textContent = `Welcome back, ${data.name}`;
            } else {
                console.log("ERROR getting user name: " + this.responseText);
                loggedInNameElement.textContent = "Welcome back";
            }
        }
    };
}

// Enhanced confirmation dialog
function confirmAction(message, callback) {
    if (confirm(message)) {
        if (typeof callback === 'function') {
            callback();
        }
        return true;
    }
    return false;
}

// Form validation helper
function validateForm(formId, rules = {}) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const errors = [];
    
    Object.keys(rules).forEach(fieldName => {
        const field = form[fieldName];
        const rule = rules[fieldName];
        
        if (field) {
            // Required field validation
            if (rule.required && !field.value.trim()) {
                isValid = false;
                errors.push(`${rule.label || fieldName} is required`);
                field.classList.add('border-red-500');
            } else {
                field.classList.remove('border-red-500');
            }
            
            // Minimum length validation
            if (rule.minLength && field.value.length < rule.minLength) {
                isValid = false;
                errors.push(`${rule.label || fieldName} must be at least ${rule.minLength} characters`);
                field.classList.add('border-red-500');
            }
            
            // Pattern validation
            if (rule.pattern && field.value && !rule.pattern.test(field.value)) {
                isValid = false;
                errors.push(rule.patternMessage || `${rule.label || fieldName} format is invalid`);
                field.classList.add('border-red-500');
            }
        }
    });
    
    if (!isValid) {
        showToast(errors[0], 'error');
    }
    
    return isValid;
}

// Debounce helper for API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// API call helper with error handling
function apiCall(method, url, data = null, successCallback = null, errorCallback = null) {
    showLoading();
    
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    
    if (data && (method === 'POST' || method === 'PUT')) {
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    }
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            hideLoading();
            
            if (this.status >= 200 && this.status < 300) {
                // Success
                let responseData = null;
                try {
                    responseData = this.responseText ? JSON.parse(this.responseText) : null;
                } catch (e) {
                    responseData = this.responseText;
                }
                
                if (successCallback) {
                    successCallback(responseData);
                }
            } else {
                // Error
                const errorMessage = this.responseText || `Request failed with status ${this.status}`;
                console.error("API Error:", errorMessage);
                
                if (errorCallback) {
                    errorCallback(errorMessage);
                } else {
                    showToast(errorMessage, 'error');
                }
            }
        }
    };
    
    xhr.onerror = function() {
        hideLoading();
        const errorMessage = "Network error occurred";
        console.error("Network Error:", errorMessage);
        
        if (errorCallback) {
            errorCallback(errorMessage);
        } else {
            showToast(errorMessage, 'error');
        }
    };
    
    xhr.send(data ? JSON.stringify(data) : null);
}

// Format date helper
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    return formatDate(new Date());
}

// Initialize tooltips (if you want to add tooltip functionality later)
function initializeTooltips() {
    // This can be expanded to add tooltip functionality
    document.querySelectorAll('[title]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Tooltip logic can be added here
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any global functionality
    initializeTooltips();
    
    // Set up global error handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        showToast('An unexpected error occurred', 'error');
    });
    
    // Set up unhandled promise rejection handling
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        showToast('An unexpected error occurred', 'error');
    });
});