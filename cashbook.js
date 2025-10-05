 // Add a row to a specific section
  function addRow(section) {
    const customLabel = prompt("Enter a label for the new row:");
    if (!customLabel) return alert("Label is required to add a new row.");

    const parent = document.getElementById(`${section}-entries`);
    const newEntry = document.createElement("div");
    newEntry.classList.add("entry");

    const label = document.createElement("label");
    label.innerText = customLabel;

    const input = document.createElement("input");
    input.type = "number";
    input.classList.add(`${section}-input`);
    input.placeholder = "₹0.00";
    input.oninput = () => calculateTotal(section);

    newEntry.appendChild(label);
    newEntry.appendChild(input);
    parent.appendChild(newEntry);
  }

  // Calculate total for a section
  function calculateTotal(section) {
    const inputs = document.querySelectorAll(`.${section}-input`);
    let total = Array.from(inputs).reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
    document.getElementById(`${section}-total`).innerText = `₹${total.toFixed(2)}`;
    calculateBalance();
  }

  // Calculate balance
  function calculateBalance() {
    const morningTotal = parseFloat(document.getElementById("morning-total").innerText.replace("₹", "")) || 0;
    const eveningTotal = parseFloat(document.getElementById("evening-total").innerText.replace("₹", "")) || 0;

    const balance = eveningTotal - morningTotal;
    const balanceElement = document.getElementById("balance-amount");
    balanceElement.innerText = `₹${balance.toFixed(2)}`;

    balanceElement.style.color = balance > 0 ? "green" : balance < 0 ? "red" : "black";
  }

  // Submit data to Google Apps Script
  function submitData() {
    const collectInputs = (section) =>
      Array.from(document.querySelectorAll(`.${section}-input`)).map((input) => ({
        label: input.previousElementSibling.innerText.trim(),
        value: parseFloat(input.value) || 0,
      }));

    const data = {
      morning: collectInputs("morning"),
      evening: collectInputs("evening"),
      account: collectInputs("account"),
      morningTotal: document.getElementById("morning-total").innerText,
      eveningTotal: document.getElementById("evening-total").innerText,
      accountTotal: document.getElementById("account-total").innerText,
      balance: document.getElementById("balance-amount").innerText,
    };

    google.script.run
      .withSuccessHandler(() => {
        alert("Data submitted successfully!");
      })
      .withFailureHandler((error) => {
        alert("Failed to submit data: " + error.message);
      })
      .saveCashBookData(data);
  }

  // Fetch data from Google Sheets by date
     // Function to fetch data by date
      function fetchData() {
        const dateInput = document.getElementById("date").value;
        if (!dateInput) {
          alert("Please select a date.");
          return;
        }

        // Call the Apps Script function
        google.script.run.withSuccessHandler(displayData).withFailureHandler(showError).fetchFromSheet(dateInput);
      }

      // Function to display the fetched data
       // Function to fetch data by date
      function fetchData() {
        const dateInput = document.getElementById("date").value;
        if (!dateInput) {
          alert("Please select a date.");
          return;
        }

        // Call the Apps Script function
        google.script.run.withSuccessHandler(displayData).withFailureHandler(showError).fetchFromSheet(dateInput);
      }

      // Function to display the fetched data
      function displayData(data) {
        if (!data) {
          document.getElementById("result").innerHTML = "No data found for the selected date.";
          return;
        }

        // Format and display the fetched data
        const morning = data.morning.map(item => `${item.label}: ${item.value}`).join("");
        const evening = data.evening.map(item => `${item.label}: ${item.value}`).join("");
        const account = data.account.map(item => `${item.label}: ${item.value}`).join("");

         const balance = data.balance.map(item => `${item.label}: ${item.value}`).join("");

        document.getElementById("result").innerHTML = `
          <h3>Data for the selected date:</h3>
          <h4>Morning</h4>
          <ul>${morning}</ul>
          <h4>Evening</h4>
          <ul>${evening}</ul>
          <h4>Account</h4>
          <ul>${account}</ul>
          <h4>Balance</h4>
          <ul>${balance}</ul>
        `;
         
         

         document.querySelector('#morning-cash').innerHTML = morning
        const categories = ['morning', 'evening', 'account'];

          let result = '';

          categories.forEach(category => {
            const formattedData = data[category]
              .map(item => `${item.label}: ${item.value}`)
              .join(", "); // Join with a separator for readability
              result += `${category.charAt(0).toUpperCase() + category.slice(1)}: ${formattedData}\n`;
          });

          console.log(result);
       
      }

      // Function to show error messages
      function showError(error) {
        document.getElementById("result").innerHTML = `Error: ${error.message}`;
      }

