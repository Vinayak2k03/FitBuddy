const EXERCISES_API_PATH = "/user/exercises";

function showExercises() {
    showLoading();
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", EXERCISES_API_PATH);
    xhr.send();
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            hideLoading();
            
            if (this.status == 200) {
                let data = JSON.parse(this.responseText);                
                let tbody = document.querySelector("#exercise-table tbody");                

                tbody.innerHTML = '';
                
                if (data.length === 0) {
                    showEmptyState('exercise-table', 'Add your first exercise above to get started!', 'bi-lightning-charge');
                    return;
                }
                
                data.forEach((exercise, index) => {
                    const row = document.createElement('tr');
                    row.className = 'table-row';
                    row.innerHTML = `
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${index + 1}</td>
                        <td class="px-6 py-4 text-sm text-gray-900" id="exercise-name-${exercise.id}">
                            <span class="font-medium">${exercise.name}</span>
                        </td>
                        <td class="px-6 py-4 text-sm text-center" id="exercise-actions-${exercise.id}">
                            <div class="flex justify-center space-x-2">
                                <button onclick="editExercise('${exercise.id}')" 
                                        class="action-btn edit" title="Edit">
                                    <i class="bi bi-pencil-fill text-sm"></i>
                                </button>
                                <button onclick="deleteExercise('${exercise.id}')" 
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

function deleteExercise(exerciseId) {
    if (!confirm('Are you sure you want to delete this exercise?')) {
        return;
    }
    
    showLoading();
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", EXERCISES_API_PATH + "/" + exerciseId);
    xhr.send();  
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            hideLoading();
            
            if (this.status == 200) {
                showToast("Exercise deleted successfully!", 'success');                
            } else {
                showToast(this.responseText, 'error');
            }            
            showExercises();
        }        
    }    
}

function onAddExercise() {
    let name = document.forms["new-exercise-form"]["name"].value.trim();    
    
    if (!name) {
        showToast("Please enter an exercise name", 'warning');
        return;
    }
    
    showLoading();
    let data = { "name" : name };
        
    let xhr = new XMLHttpRequest();        
    xhr.open("POST", EXERCISES_API_PATH);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");        
    xhr.send(JSON.stringify(data));
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            hideLoading();
            
            if (this.status == 200) {
                showToast("Exercise added successfully!", 'success');
                document.forms["new-exercise-form"]["name"].value = "";                 
            } else {
                showToast(this.responseText, 'error');
            }
            showExercises();
        }        
    }
}

function editExercise(exerciseId) {
    let exerciseNameElement = document.getElementById("exercise-name-" + exerciseId);
    let actionsElement = document.getElementById("exercise-actions-" + exerciseId);
    
    let exerciseName = exerciseNameElement.querySelector('span').textContent;    
    
    exerciseNameElement.innerHTML = `
        <input type='text' 
               value='${exerciseName}' 
               class='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
               autofocus required>
    `;
    
    actionsElement.innerHTML = `
        <div class="flex justify-center space-x-2">
            <button onclick="saveExercise('${exerciseId}')" 
                    class="action-btn save" title="Save">
                <i class="bi bi-check-lg text-sm"></i>
            </button>
            <button onclick="showExercises()" 
                    class="action-btn cancel" title="Cancel">
                <i class="bi bi-x-lg text-sm"></i>
            </button>
        </div>
    `;
    
    exerciseNameElement.querySelector('input').focus();
    exerciseNameElement.querySelector('input').select();
}

function saveExercise(exerciseId) {
    let exerciseNameElement = document.getElementById("exercise-name-" + exerciseId);
    let exerciseName = exerciseNameElement.querySelector('input').value.trim();
    
    if (!exerciseName) {
        showToast("Exercise name cannot be empty", 'warning');
        return;
    }
    
    showLoading();
    let data = { "name" : exerciseName };
    
    let xhr = new XMLHttpRequest();    
    xhr.open("PUT", EXERCISES_API_PATH + "/" + exerciseId);    
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(data));
    
    xhr.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            hideLoading();
            
            if (this.status == 200) {
                showToast("Exercise updated successfully!", 'success');                
            } else {
                showToast(this.responseText, 'error');
            }
            showExercises();
        }        
    }
}