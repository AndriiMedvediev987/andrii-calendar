// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  const workinghours = 8;
  let currentDay = $('#currentDay');
  let container = $(".container-lg");
  let currentTime = dayjs();
  let today = dayjs().startOf('day').add(9, 'hour');

  // display the current date in the header of the page
  currentDay.text(today.format('dddd, MMMM DD[th]'));
  const calendarAppointments = 'calendarAppointments';

  let updateTimeClass = function (hourEl) {
    if (today.isBefore(currentTime, 'hour')) {
      hourEl.addClass('past');
      hourEl.removeClass('present');
      hourEl.removeClass('future');
    }
    else
      if (today.isAfter(currentTime, 'hour')) {
        hourEl.addClass('future');
        hourEl.removeClass('present');
        hourEl.removeClass('past');
      }
      else {
        hourEl.addClass('present');
        hourEl.removeClass('past');
        hourEl.removeClass('future');
      }
  }

  let addHour = function () {
    let hour = today.format('HH');
    let hourEl = $('<div>');
    hourEl.attr('id', `hour-${hour}`);
    hourEl.addClass('row');
    hourEl.addClass('time-block');
    updateTimeClass(hourEl);
    let timeCol = $('<div>');
    timeCol.addClass('col-2 col-md-1 hour text-center py-3');
    timeCol.text(today.format('hA'));
    hourEl.append(timeCol);

    let textArea = $('<textArea>');
    textArea.addClass('col-8 col-md-10 description');
    textArea.attr('rows', 3);
    hourEl.append(textArea);

    let buttonSave = $('<button>');
    buttonSave.addClass('btn saveBtn col-2 col-md-1');
    buttonSave.attr('aria-label', 'save');

    let imageSave = $('<i>');
    imageSave.addClass('fas fa-save');
    imageSave.attr('aria-hidden', true);
    buttonSave.append(imageSave);
    hourEl.append(buttonSave);

    container.append(hourEl);
  }

  let handlerSaveEvent = function (event) {
    let hourEl = $(this).parent('div');
    let hourText = hourEl.attr('id');
    let hourSave = hourText.split('-')[1];
    let eventEl = hourEl.find('.description');
    let eventName = eventEl.val().trim();
    updateAppointments(eventName, hourSave);
  }

  let loadAppointments = function () {
    let appointments = JSON.parse(localStorage.getItem(calendarAppointments)) || [];

    for (let i = 0; i < appointments.length; i++) {
      let appointment = appointments[i];
      let hourID = `hour-${appointment.time}`;
      let hourEl = $(`#${hourID}`);
      if (hourEl !== null) {
        let eventEl = hourEl.find('.description');
        eventEl.text(appointment.name);
      }
    }
  }

  let updateAppointments = function (eventName, hourSave) {
    let appointments = JSON.parse(localStorage.getItem(calendarAppointments)) || [];
    let existEvent = appointments.find(x => x.time === hourSave);
    let newEvent = {
      name: eventName,
      time: hourSave
    };
    if (existEvent) {
      let index = appointments.indexOf(existEvent);
      appointments[index] = newEvent;
    }
    else {
      appointments.push(newEvent);

    }

    localStorage.setItem(calendarAppointments, JSON.stringify(appointments));
  }

  // add listener for click events on the save button
  container.on('click', '.saveBtn', handlerSaveEvent);

  // fill calendar hours and apply the past, present, or future class
  for (let i = 0; i <= 8; i++) {
    addHour();
    today = today.add(1, 'hour');
  }

  // load previously stored appointments
  loadAppointments();

  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});
