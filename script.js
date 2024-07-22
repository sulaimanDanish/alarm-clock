let alarms = [];
let currentHr;
let currentMin;
let currentSec;
let currentMillisec;
const firstField = document.querySelector(".field");
const secondField = document.querySelector(".field + .field");
const firstInput = document.querySelector(".field > input");
const fields = Array.from(document.querySelectorAll('.field'));
const inputs = Array.from(document.querySelectorAll(".field > input"));
const setButton = document.getElementById('set-button');
const alarmHr = document.getElementById('hr');
const alarmMin = document.getElementById('min');
const alarmPeriod = document.getElementById('period');
const list = document.getElementById('list');
const heading = document.getElementById('heading'); 
const alarmSound = new Audio('./media/alarm.mp3');

function updateTime() {
    let currentDate = new Date();
    currentSec = currentDate.getSeconds();
    currentMillisec = currentDate.getMilliseconds();
    currentMin = currentDate.getMinutes();
    currentHr = currentDate.getHours();
    let period = "AM";

    if (currentHr == 0) {
        currentHr = 12;
    }
    else if (currentHr >= 13) {
        period = "PM";
        currentHr -= 12;
    }

    let realTime = currentHr + ':' + numPad0(currentMin) + ':' + numPad0(currentSec) + ' ' + period;
    
    document.getElementById('time').innerHTML = realTime;
    checkAlarms(currentHr,currentMin,period);
}

setInterval('updateTime()', 100);

function numPad0(str) {
    let cStr = str.toString();
    if (cStr.length < 2) {
        str = 0 + cStr;
    }
    return str;
}

function blurAll() {
    fields.forEach(function (f) {
        f.classList.remove('active', 'semi-active');
    })
}

function advanceFocus(event) {
    blurAll();
    const thisField = event.target.closest(".field");
    const nextField = thisField.nextElementSibling;
    const prevField = thisField.previousElementSibling;
    thisField.classList.add("active");
    if (nextField) nextField.classList.add("semi-active");
    if (prevField) prevField.classList.add("semi-active");
}

inputs.forEach(function (f) {
    f.addEventListener("focus", advanceFocus);
});

firstField.classList.add("active");
secondField.classList.add("semi-active");
firstInput.focus();

function isValidHour(hr) {
    const hour = parseInt(hr, 10);
    return hr.length <= 2 && hour >= 1 && hour <= 12;
   
}

function isValidMinute(min) {
    const minute = parseInt(min, 10);
    return min.length <= 2 && minute >= 0 && minute <= 59;
}

setButton.addEventListener('click', function addAlarms() {
    const hr = alarmHr.value;
    const min = alarmMin.value;
    const period = alarmPeriod.value;
    if (isValidHour(hr) && isValidMinute(min)) {
        alarms.push({ hour: hr, minute: min, period: period });
        list.textContent = '';
        displayList(alarms);
    } else {
        alert("Invalid input. Please enter a valid hour (1-12) and minute (0-59).");
    }
    alarmHr.value = '';
    alarmMin.value = '';
    alarmPeriod.value = '';
});

function displayList(alarms){
    list.innerHTML = '';
    heading.textContent = `Alarm List`;
    heading.classList.add('heading');
   alarms.forEach((element,index)=>{
       let alarmDetails = document.createElement('li');
       alarmDetails.innerHTML  = `${element.hour} : ${element.minute} : ${element.period} <button class="cancel-btn" data-index="${index}">X</button>`;
       alarmDetails.classList.add('alarmList');
       list.appendChild(alarmDetails);
   });

   document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', ()=>{
        const index = button.getAttribute('data-index');
        removeAlarm(index);
    });
});
}

function removeAlarm(index){
    alarms.splice(index,1);
    if(alarms.length==0){
    heading.textContent = '';
    list.innerHTML = '';
    }else{
    displayList(alarms);
    }
}

function checkAlarms(hour, minute, period) {
    alarms.forEach(alarm => {
        if (alarm.hour == hour && alarm.minute == minute && alarm.period == period) {
            playAlarmSound();
        }
    });
}   

function playAlarmSound() {
    alarmSound.play();
}