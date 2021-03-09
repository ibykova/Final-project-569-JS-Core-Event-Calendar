// Navigation starts with 0 for current mobth (as you open the app). Therefore 1 - is next month
//when you click the button, and -1 is the previous month
let navigation = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const editEventModal = document.getElementById('editEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];



function openModal(date) {
  //If we want to "Save" by pressing Enter while typing
  clicked = date;
  eventTitleInput.addEventListener('keyup', function (event) {
    if (event.code === 'Enter') {
      saveEvent();
    }
  });

  //If we want to "Cancel" by pressing Esc while typing
  editEventModal.addEventListener('keydown', function (event) {
    console.log('event', event);
    if (event.code === 'Escape') {
      console.log('Esc');
      closeModal();
    }
  });

  //Here we listen if the dayCell was clicked. 
  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    //If true --> then we open the event as an input, but with previous value.
    //Also if the event was previously created - we add a "Delete" button
    eventTitleInput.value = eventForDay.title;
    if (!document.getElementById('deleteButton')) {
      const delBtn = document.createElement('button');
      delBtn.innerText = 'Delete';
      delBtn.id = 'deleteButton';
      delBtn.addEventListener('click', deleteEvent);
      editEventModal.appendChild(delBtn);
    }
  }

  editEventModal.style.display = 'block';

  backDrop.style.display = 'block';
}

// Here we have to create a function which will download the data of current Date
function load() {
  const date = new Date();

  if (navigation !== 0) {
    date.setMonth(new Date().getMonth() + navigation);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1/* to increment month*/, 0/*it's the last day of previous month*/).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-UA'/*for USA en-US*/, {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  /*to separate the "extra" day of previous month from the Date itself*/
  const emptyDayCell = days.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText =
    `${date.toLocaleDateString('en-UA', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  //This we do to be able to get the correct amount of days in a month and to get the needed data
  for (let i = 1; i <= emptyDayCell + daysInMonth; i++) {
    const calDayCell = document.createElement('div');
    calDayCell.classList.add('day');

    const dayString = `${month + 1}/${i - emptyDayCell}/${year}`;

    if (i > emptyDayCell) {
      calDayCell.innerText = i - emptyDayCell;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - emptyDayCell === day && navigation === 0) {
        calDayCell.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        calDayCell.appendChild(eventDiv);
      }
      //We want to run the function every time user clicks on the DayCell
      calDayCell.addEventListener('click', () => openModal(dayString));
    } else {
      calDayCell.classList.add('emptyDay');
    }

    calendar.appendChild(calDayCell);
  }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  editEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  //Here we want to remove "delete btn" for no plural
  document.getElementById('deleteButton')?.remove();

  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    console.log(eventTitleInput.value);
    eventTitleInput.classList.remove('error');

    const eventForDay = events.find(e => e.date === clicked);
    if (eventForDay) {
      console.log('edit');
      eventForDay.title = eventTitleInput.value;
    } else {
      console.log('push');
      events.push({
        date: clicked,
        title: eventTitleInput.value,
      });
    }


    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}


function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

//This func initializes all btns on the page
function headButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    navigation++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    navigation--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
}

headButtons();
load();
