const HISTORY_API_PATH = "/user/history";

function showHistory() {
    addLoadingState('history-table');
    
    let selectedDate = document.getElementById("calendar").value;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", HISTORY_API_PATH + "?date=" + selectedDate);
    xhr.send();
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            removeLoadingState('history-table');
            
            if (this.status == 200) {
                let data = JSON.parse(this.responseText);                
                let tbody = document.querySelector("#history-table tbody");                

                tbody.innerHTML = '';
                
                if (data.length === 0) {
                    showEmptyState('history-table', 'No workouts logged for this date. Start tracking your exercises!', 'bi-calendar-x');
                    return;
                }
                
                data.forEach((workout, index) => {
                    const row = document.createElement('tr');
                    row.className = 'table-row hover:bg-gray-50 transition-colors duration-150';
                    row.innerHTML = `
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${index + 1}</td>
                        <td class="px-6 py-4 text-sm text-gray-900 font-medium">${workout.exercise.name}</td>
                        <td class="px-6 py-4 text-sm text-center" id="history-weight-${workout.id}">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                ${workout.weight} kg
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-center" id="history-reps-${workout.id}">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ${workout.reps} reps
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-center" id="history-actions-${workout.id}">
                            <div class="flex justify-center space-x-2">
                                <button onclick="editHistory('${workout.id}')" 
                                        class="action-btn edit" title="Edit">
                                    <i class="bi bi-pencil-fill text-sm"></i>
                                </button>
                                <button onclick="deleteHistory('${workout.id}')" 
                                        class="action-btn delete" title="Delete">
                                    <i class="bi bi-trash-fill text-sm"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                console.log("ERROR: " + this.responseText);
                showToast(this.responseText, 'error');
            }
        }        
    };
}

function deleteHistory(historyId) {
    confirmAction('Are you sure you want to delete this workout entry?', () => {
        showLoading();
        
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", HISTORY_API_PATH + "/" + historyId);
        xhr.send();  
        
        xhr.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                hideLoading();
                
                if (this.status == 200) {
                    showToast("Workout deleted successfully!", 'success');
                } else {
                    showToast(this.responseText, 'error');
                }            
                showHistory();
            }        
        }
    });
}

function editHistory(historyId) {
    let weightElement = document.getElementById("history-weight-" + historyId);
    let repsElement = document.getElementById("history-reps-" + historyId);
    let actionsElement = document.getElementById("history-actions-" + historyId);
    
    // Extract current values from the badge elements
    let weightText = weightElement.querySelector('span').textContent;
    let repsText = repsElement.querySelector('span').textContent;
    
    let weight = weightText.match(/\d+/)[0]; // Extract number from "XX kg"
    let reps = repsText.match(/\d+/)[0]; // Extract number from "XX reps"
    
    // Replace with input fields
    weightElement.innerHTML = `
        <input type='number' 
               value='${weight}' 
               min='0'
               class='w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm'
               autofocus>
    `;
    
    repsElement.innerHTML = `
        <input type='number' 
               value='${reps}' 
               min='0'
               class='w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm'>
    `;
    
    // Update actions
    actionsElement.innerHTML = `
        <div class="flex justify-center space-x-2">
            <button onclick="saveHistory('${historyId}')" 
                    class="action-btn save" title="Save">
                <i class="bi bi-check-lg text-sm"></i>
            </button>
            <button onclick="showHistory()" 
                    class="action-btn cancel" title="Cancel">
                <i class="bi bi-x-lg text-sm"></i>
            </button>
        </div>
    `;
    
    // Focus on the weight input
    weightElement.querySelector('input').focus();
    weightElement.querySelector('input').select();
}

function saveHistory(historyId) {
    let weightElement = document.getElementById("history-weight-" + historyId);
    let repsElement = document.getElementById("history-reps-" + historyId);
    
    let weight = parseInt(weightElement.querySelector('input').value);
    let reps = parseInt(repsElement.querySelector('input').value);
    
    if (!weight || weight <= 0) {
        showToast("Please enter a valid weight", 'warning');
        return;
    }
    
    if (!reps || reps <= 0) {
        showToast("Please enter a valid number of reps", 'warning');
        return;
    }
    
    showLoading();
    
    let data = { 
        "weight": weight,
        "reps": reps 
    };
    
    let xhr = new XMLHttpRequest();    
    xhr.open("PUT", HISTORY_API_PATH + "/" + historyId);    
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(data));
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            hideLoading();
            
            if (this.status == 200) {
                showToast("Workout updated successfully!", 'success');
            } else {
                showToast(this.responseText, 'error');
            }
            showHistory();
        }        
    }
}

function onAddHistory() {
    let exerciseId = document.getElementById("exercise-select").value;
    let weight = parseInt(document.getElementById("weight").value);
    let reps = parseInt(document.getElementById("reps").value);
    let date = document.getElementById("calendar").value;
    
    if (!exerciseId) {
        showToast("Please select an exercise", 'warning');
        return;
    }
    
    if (!weight || weight <= 0) {
        showToast("Please enter a valid weight", 'warning');
        return;
    }
    
    if (!reps || reps <= 0) {
        showToast("Please enter a valid number of reps", 'warning');
        return;
    }
    
    showLoading();
    
    let data = { 
        "exerciseId": exerciseId,
        "weight": weight,
        "reps": reps,
        "date": date
    };
        
    let xhr = new XMLHttpRequest();        
    xhr.open("POST", HISTORY_API_PATH);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");        
    xhr.send(JSON.stringify(data));
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            hideLoading();
            
            if (this.status == 200) {
                showToast("Workout logged successfully!", 'success');
                // Clear form
                document.getElementById("weight").value = "";
                document.getElementById("reps").value = "";
            } else {
                showToast(this.responseText, 'error');
            }
            showHistory();
        }        
    }
}

function resetCalendar() {
    document.getElementById("calendar").value = getTodayDate();
}

function onCalendarChange() {
    showHistory();
}

function stepUpCalendar() {
    let calendar = document.getElementById("calendar");
    let currentDate = new Date(calendar.value);
    currentDate.setDate(currentDate.getDate() + 1);
    calendar.value = formatDate(currentDate);
    showHistory();
}

function stepDownCalendar() {
    let calendar = document.getElementById("calendar");
    let currentDate = new Date(calendar.value);
    currentDate.setDate(currentDate.getDate() - 1);
    calendar.value = formatDate(currentDate);
    showHistory();
}