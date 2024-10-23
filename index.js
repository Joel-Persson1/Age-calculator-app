// Age Calculator App
// This script handles the functionality of an age calculator form.
// It validates user inputs, calculates the age, and displays the result.

// DOM element selections
const day = document.querySelector("#day");
const month = document.querySelector("#month");
const year = document.querySelector("#year");
const btn = document.querySelector(".btn");
const form = document.querySelector(".form-section");

const dayResultBox = document.querySelector("#dayResult");
const monthResultBox = document.querySelector("#monthResult");
const yearResultBox = document.querySelector("#yearResult");

// Input field and label selections
// This object groups related DOM elements for each input field
const inputFields = {
  day: {
    input: day,
    label: document.querySelector(".labelDay"),
    field: document.querySelector(".classDay"),
  },
  month: {
    input: month,
    label: document.querySelector(".labelMonth"),
    field: document.querySelector(".classMonth"),
  },
  year: {
    input: year,
    label: document.querySelector(".labelYear"),
    field: document.querySelector(".classYear"),
  },
};

// Helper Functions

/**
 * Calculates the number of days in a given month and year
 * @param {number} year - The year
 * @param {number} month - The month (1-12)
 * @return {number} The number of days in the month
 */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Adds an error message to the specified input field
 * @param {HTMLElement} inputField - The input field container
 * @param {string} message - The error message to display
 */
function addErrorText(inputField, message) {
  if (!inputField.querySelector("p.error")) {
    const errorText = document.createElement("p");
    errorText.innerText = message;
    errorText.classList.add("error");
    inputField.appendChild(errorText);
  }
}

function setErrorState(field) {
  field.input.classList.add("error");
  field.label.classList.add("error");
  addErrorText(field.field, "This field is required");
}

function clearErrorState(field) {
  const errorText = field.field.querySelector("p");
  if (errorText) errorText.remove();
  field.input.classList.remove("error");
  field.label.classList.remove("error");
}

// Add this function for more robust input validation
function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return date && date.getMonth() === month - 1 && date.getDate() === day;
}

/**
 * Calculates the age in years, months, and days given a birth date
 * @param {number} birthYear - The birth year
 * @param {number} birthMonth - The birth month (1-12)
 * @param {number} birthDay - The birth day
 * @param {Date} now - The current date
 * @return {Object} An object containing years, months, and days
 */
function calculateAgeInDetail(birthYear, birthMonth, birthDay, now) {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
  const currentDay = now.getDate();

  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;
  let days = currentDay - birthDay;

  // Adjust months if the current month is before the birth month
  if (months < 0) {
    years--; // Take one year off
    months += 12; // Add 12 months to adjust
  }

  // Adjust days if the current day is before the birth day
  if (days < 0) {
    months--; // Take one month off
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const daysInPreviousMonth = new Date(
      currentYear,
      previousMonth,
      0
    ).getDate(); // Get days in previous month
    days += daysInPreviousMonth; // Borrow days from previous month
  }

  return { years, months, days };
}

// Create a new function for the age calculation logic
function calculateAge(e) {
  // Prevent default form submission
  e.preventDefault();

  // Parse input values
  const dayValue = parseInt(day.value);
  const monthValue = parseInt(month.value);
  const yearValue = parseInt(year.value);
  const now = new Date();
  const inputDate = new Date(yearValue, monthValue - 1, dayValue);

  let hasError = false;

  // Validate day
  if (!dayValue || !isValidDate(dayValue, monthValue, yearValue)) {
    setErrorState(inputFields.day);
    addErrorText(inputFields.day.field, "Must be a valid day");
    hasError = true;
  } else {
    clearErrorState(inputFields.day);
  }

  // Validate month
  if (!monthValue || monthValue < 1 || monthValue > 12) {
    setErrorState(inputFields.month);
    hasError = true;
  } else {
    clearErrorState(inputFields.month);
  }

  // Validate year
  if (!yearValue) {
    setErrorState(inputFields.year);
    hasError = true;
  } else {
    clearErrorState(inputFields.year);
  }

  // Check if date is in the future
  if (inputDate > now) {
    addErrorText(inputFields.year.field, "Must be in the past!");
    hasError = true;
  }

  // Check if day is valid for the given month
  if (dayValue > daysInMonth(yearValue, monthValue)) {
    addErrorText(inputFields.day.field, "Too many days for this month!");
    hasError = true;
  }

  // Calculate and display age if no errors
  if (!hasError) {
    const ageDetails = calculateAgeInDetail(
      yearValue,
      monthValue,
      dayValue,
      now
    );
    dayResultBox.innerHTML = ageDetails.days;
    monthResultBox.innerHTML = ageDetails.months;
    yearResultBox.innerHTML = ageDetails.years;
  } else {
    // Clear results if there are errors
    [dayResultBox, monthResultBox, yearResultBox].forEach(
      (box) => (box.innerHTML = "--")
    );
  }
}

// Update the button event listener to use the new function
btn.addEventListener("click", calculateAge);

// Add a new event listener for the Enter key
form.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    calculateAge(e);
  }
});
