// ==============================
// BASE API URL for currency data
// ==============================
const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// ==============================
// SELECT HTML ELEMENTS
// ==============================
const dropdowns = document.querySelectorAll(".dropdown select"); // Both From and To dropdowns
const btn = document.querySelector("form button"); // Get Exchange Rate button
const fromCurr = document.querySelector(".from select"); // From currency dropdown
const toCurr = document.querySelector(".to select"); // To currency dropdown
const msg = document.querySelector(".msg"); // Element to display conversion result
const amountInput = document.querySelector(".amount input"); // Amount input field
const swapIcon = document.querySelector(".fa-arrow-right-arrow-left"); // Swap currencies icon

// ==============================
// POPULATE DROPDOWNS WITH CURRENCY CODES
// ==============================
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option"); // Create new option
    newOption.innerText = currCode; // Show code in dropdown
    newOption.value = currCode; // Set value

    // Set default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true; // Default "From" = USD
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true; // Default "To" = INR
    }

    select.append(newOption); // Add option to dropdown
  }

  // Event: When user changes dropdown
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target); // Update flag image
    updateExchangeRate();   // Update conversion result automatically
  });
}

// ==============================
// FUNCTION: FETCH & DISPLAY EXCHANGE RATE
// ==============================
const updateExchangeRate = async () => {
  let amtVal = amountInput.value; // Get user input amount

  // Input validation: empty, zero, negative, or not a number
  if (amtVal === "" || amtVal <= 0 || isNaN(amtVal)) {
    amtVal = 1;
    amountInput.value = "1"; // Reset to 1 if invalid
  }

  // Get selected currencies in lowercase for API
  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  // Build API URL for the "from" currency
  const URL = `${BASE_URL}/${from}.min.json`;

  try {
    // Fetch data from API
    let response = await fetch(URL);
    let data = await response.json();

    // Extract conversion rate
    let rate = data[from][to]; // Correct nested path

    // If rate not found, throw error
    if (!rate) throw new Error("Rate not found");

    // Calculate final amount and round to 2 decimals
    let finalAmount = (amtVal * rate).toFixed(2);

    // Display result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    // Handle errors (network/API)
    msg.innerText = "Error fetching exchange rate!";
    console.error(error);
  }
};

// ==============================
// FUNCTION: UPDATE FLAG IMAGE
// ==============================
const updateFlag = (element) => {
  let currCode = element.value; // Selected currency code
  let countryCode = countryList[currCode]; // Map currency to country
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`; // Build flag URL
  let img = element.parentElement.querySelector("img"); // Find the <img> in the same container
  img.src = newSrc; // Update flag image
};

// ==============================
// SWAP CURRENCIES FUNCTIONALITY
// ==============================
swapIcon.addEventListener("click", () => {
  // Swap the values of From and To dropdowns
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update flags and conversion
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// ==============================
// BUTTON CLICK: GET EXCHANGE RATE
// ==============================
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form from submitting / page reload
  updateExchangeRate(); // Run conversion
});

// ==============================
// RUN ON PAGE LOAD
// ==============================
window.addEventListener("load", () => {
  updateExchangeRate(); // Show initial conversion automatically
});
