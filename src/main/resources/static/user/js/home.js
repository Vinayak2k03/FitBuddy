document.addEventListener("DOMContentLoaded", () => {
    onLoaded();
    onHistory();
});

function onLoaded() {
    console.log("Page loaded.");
    showUserName();
}

function onLogout() {    
    window.location = "/logout";
}

function onExercises() {
    updateTabState('exercises-tab');
    hideDiv("History");
    hideDiv("Account");
    showDiv("Exercises");    
    showExercises();
}

function onHistory() {
    updateTabState('history-tab');
    hideDiv("Exercises");
    hideDiv("Account");
    showDiv("History");
    resetCalendar();    
    showHistory();
}

function onAccount() {
    updateTabState('account-tab');
    hideDiv("History");
    hideDiv("Exercises");
    showDiv("Account");
    showAccount();
}