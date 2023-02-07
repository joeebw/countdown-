const inputContainer = document.querySelector('#input-container');
const countdownForm = document.querySelector('#countdownForm');
const dateEl = document.querySelector('#date-picker');
const countdownEl = document.querySelector('#countdown')
const countdownEltitle = document.querySelector('#countdown-title');
const countdownBtn = document.querySelector('#countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.querySelector('#complete');
const completeElInfo = document.querySelector('#complete-info');
const completeBtn = document.querySelector('#complete-button');


let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date;
let countdownActive;
let saveCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//  Set Date input min with today's date
const today = new Date().toISOString().split('T')[0];
dateEl.min = today;

// Populate countdown / complete ui
function updateDOM(){

    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
    
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
    
        // Hide input
        inputContainer.hidden = true;

        // if the countdown has ended, show complete
        if(distance < 0){
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // Else, show the countdown in progress
            countdownEltitle.textContent = countdownTitle;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }

    }, second);

}

// Take values from form input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    saveCountdown = {
        title: countdownTitle,
        date: countdownDate
    };
    localStorage.setItem('countdown', JSON.stringify(saveCountdown));
    // Get number version of current date and updateDom
    countdownValue = new Date(`${countdownDate} 00:00:00`).getTime();
    updateDOM();
}   

// Reset all values
function reset(){
    // Hide countdown, show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown(){
    if(localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        saveCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = saveCountdown.title;
        countdownDate = saveCountdown.date;
        countdownValue = new Date(`${countdownDate} 00:00:00`).getTime();
        updateDOM();
    }
}

// Event listener
countdownForm.addEventListener('submit', updateCountdown)
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

//  On load and check localstorage
restorePreviousCountdown();