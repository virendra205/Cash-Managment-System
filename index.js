 //Denomation show and hide function
      
        const btn = document.querySelector(".button_des");
        const close = document.querySelector(".close_btn");
        const show_denomination = document.querySelector(".show_and_hin");

        // Show denomination box
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          show_denomination.style.display = "block";
        });

        // Close denomination box
        close.addEventListener("click", (e) => {
          e.preventDefault();
          show_denomination.style.display = "none";
        });
              



      // ==========Cashbook link function =================

      function openCashbook() {
      google.script.run.withSuccessHandler(function(url) {
        window.open(url, '_blank'); // Open Cashbook.html in a new tab
      }).getCashbookUrl();
    }


   // Fetch data from Apps Script denpo table



      // Function to fetch and display data
  function fetchAndDisplayData() {
    google.script.run.withSuccessHandler(displayData).getDenoData();
  }

  // Function to display data in the table
  function displayData(data) {
    const tableBody = document.getElementById('denoTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing data

    // Labels for rows
    const rowLabels = ['Quantity', 'Total'];

    let grandTotal = 0;

    data.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');

      // Add label for the row
      const labelCell = document.createElement('td');
      labelCell.textContent = rowLabels[rowIndex];
      tr.appendChild(labelCell);

      // Add data for the row
      row.forEach((cell, colIndex) => {
        const td = document.createElement('td');
        td.textContent = cell;

        // Calculate grand total if it's the "Total" row (last row)
        if (rowIndex === 2) grandTotal += cell;

        tr.appendChild(td);
      });

      tableBody.appendChild(tr);
    });

    // Update total amount
    document.getElementById('totalAmount').textContent = grandTotal;
  }

  // Fetch data immediately on load
  fetchAndDisplayData();

  // Set an interval to refresh data every 5 seconds
  setInterval(fetchAndDisplayData, 2000); // 5000 ms = 5 seconds

     
    //  //google sheet data fetching function 
    //    // This function fetches data from the Apps Script server and updates the table
      function fetchData() {
        google.script.run.withSuccessHandler(updateTable).getDataFromSheet();
      }

      // This function updates the HTML table with the fetched data
      function updateTable(data) {
        var table = document.getElementById('dataTable');
        var tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; // Clear the table body before adding new rows
        
        // Iterate over the data and add rows to the table
        data.forEach(function(row) {
          var tr = document.createElement('tr');
          row.forEach(function(cell) {
            var td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
      }

      // Call fetchData every 5 seconds to update the data
      window.onload = function() {
        fetchData();
        setInterval(fetchData, 5000); // Fetch data every 5 seconds
      };
        





      
            // data and time
document.addEventListener("DOMContentLoaded", () => {
  // Initialize DateTime in input field
  function update() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById("datetime").value = datetimeString;
  }

  setInterval(update, 1000);
});


//denomation submit function 
document.querySelector(".deno_form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  document.querySelector("#submit").innerHTML = "Submitting..."; // Change button text to indicate submission in progress

  const data = new FormData(e.target); // Collect form data
  const values = Object.fromEntries(data.entries()); // Convert FormData to an object

  // Call the Google Apps Script function with parameters
  google.script.run
    .withSuccessHandler(() => {
      document.querySelector("#submit").innerHTML = "Submitted"; // Change button text on successful submission
      alert("Cash Added Successfully"); // Notify user of success
    })
    .withFailureHandler((error) => {
      console.error("Error submitting data:", error); // Log any errors
      document.querySelector("#submit").innerHTML = "Submit"; // Revert button text on failure
      alert("Error submitting the form. Please try again."); // Notify user of failure
    })
    .denomination({ parameter: values }); // Call the 'denomination' function in Apps Script, passing form values
});


 //cashin and cashout send data on denomation sheets 
document.querySelector(".form_container").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  document.querySelector(".submit-button").innerHTML = "Submitting..."; // Change button text to indicate submission in progress

  const data = new FormData(e.target); // Collect form data
  const values = Object.fromEntries(data.entries()); // Convert FormData to an object

  // Call the Google Apps Script function with parameters
  google.script.run
    .withSuccessHandler(() => {
      document.querySelector(".submit-button").innerHTML = "Submitted"; // Change button text on successful submission
    })
    .withFailureHandler((error) => {
      console.error("Error submitting data:", error); // Log any errors
      document.querySelector("#submit").innerHTML = "Submit"; // Revert button text on failure
      alert("Error submitting the form. Please try again."); // Notify user of failure
    })
    .denomination({ parameter: values }); // Call the 'denomination' function in Apps Script, passing form values
});



// Event listeners for the submit button
document.querySelector(".form_container").addEventListener("submit", (e) => {
  e.preventDefault();

  const submitButton = e.target.querySelector(".submit-button");
  submitButton.innerHTML = "Submitting...";

  const data = new FormData(e.target);
  const values = Object.fromEntries(data.entries());

  const accountNo = document.querySelector("#accountno").value.trim();
  const customerName = document.querySelector("#customer-name").value.trim();

  if (!accountNo && !customerName) {
    errorshowNotification() 
    submitButton.innerHTML = "Submit"; // Ensure button text resets even after validation failure
    return;
  }

  google.script.run
    .withSuccessHandler(() => {
      // alert("Data successfully submitted!");
      showNotification()
      submitButton.innerHTML = "Submit"; // Reset button text on success
      clearFields(); // Ensure this function is error-free
      resetDenomValues(); // Ensure this function is error-free
    })
    .withFailureHandler((error) => {
      console.error("Error submitting data:", error);
      alert("Error submitting the form. Please try again.");
      submitButton.innerHTML = "Submit"; // Reset button text on failure
    })
    .submitData(values);
});




document.querySelector(".reset-button").addEventListener("click", () => {
  // Your reset functionality here
  clearFields(); // Example function to clear fields
  resetDenomValues(); // Example function to reset calculations
  
});



        function errorshowNotification() {
            const notification = document.getElementById('notification_section');
            notification.style.display = 'flex';

            // Auto-close after 5 seconds
            setTimeout(() => {
                ercloseNotification();
            }, 5000);
        }

        function ercloseNotification() {
            const notification = document.getElementById('notification_section');
            notification.style.display = 'none';
        }


// Notification system
function showNotification() {
  const overlay = document.getElementById("overlay");
  const notification = document.getElementById("notification");
  const button = notification.querySelector(".btn");
  const submitButton = document.querySelector(".submit-button");

  if (!overlay || !notification || !button || !submitButton) {
    console.error("Required elements not found in the DOM.");
    return;
  }

  // Show the overlay and notification with a delay
  setTimeout(() => {
    overlay.classList.add("show");
    notification.classList.add("show");

    // Set focus to the button when the notification is displayed
    button.focus();
  }, 500);

  // Automatically hide the notification and overlay after 3.5 seconds
  const hideTimeout = setTimeout(() => {
    hideNotification(overlay, notification);
  }, 35000000000);

  // Button click event listener to hide notification
  button.addEventListener("click", () => {
    clearTimeout(hideTimeout); // Clear the auto-hide timeout if the button is clicked
    hideNotification(overlay, notification);
  });

  // Add keydown event listener for the Enter key
  const handleKeydown = (event) => {
    if (event.key === "Enter") {
      clearTimeout(hideTimeout); // Clear the auto-hide timeout
      hideNotification(overlay, notification);

      // Disable the submit button
      // if (!submitButton.disabled) {
      //   submitButton.disabled = true;
      // }

      // Remove the event listener after handling Enter key
      document.removeEventListener("keydown", handleKeydown);
    }
  };

  document.addEventListener("keydown", handleKeydown);

  // Re-enable the submit button after the notification duration
  setTimeout(() => {
    if (submitButton.disabled) {
      submitButton.disabled = false;
    }
  }, 3500); // Match the notification display duration

  // Add mouse focus functionality
  button.addEventListener("mouseover", () => {
    button.classList.add("hover-focus");
  });

  button.addEventListener("mouseout", () => {
    button.classList.remove("hover-focus");
  });
}

// Utility function to hide notification and overlay
function hideNotification(overlay, notification) {
  overlay.classList.remove("show");
  notification.classList.remove("show");
}






// Clear all input fields
function clearFields() {
  const inputSelectors = [
    "#accountno",
    "#customer-name",
    "#add500",
    "#add200",
    "#add100",
    "#add50",
    "#add20",
    "#add12",
    "#add10",
    "#add11",
    "#add5",
    "#add2",
    "#add1",
    "#sub500",
    "#sub200",
    "#sub100",
    "#sub50",
    "#sub20",
    "#sub12c",
    "#sub10",
    "#sub11c",
    "#sub5",
    "#sub2",
    "#sub1"
  ];

  inputSelectors.forEach((selector) => {
    const input = document.querySelector(selector);
    if (input) input.value = ""; // Clear each input field
  });
}

// Reset calculated totals to 0
function resetDenomValues() {
  const totalSelectors = [
    ".alltotal500",
    ".alltotal200",
    ".alltotal100",
    ".alltotal50",
    ".alltotal20",
    ".allout12",
    ".alltotal10",
    ".allout11",
    ".alltotal5",
    ".alltotal2",
    ".alltotal1",
    ".allout500",
    ".allout200",
    ".allout100",
    ".allout50",
    ".allout20",
    ".allout12c",
    ".allout10",
    ".allout11c",
    ".allout5",
    ".allout2",
    ".allout1",
    ".alldenomation",
    ".alloutdenomanitaion",
    ".subaddtotal",
    ".cashin_total_container",
    ".cashout_total_container",
    ".Alltotal_container"
  ];

  totalSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = "0"; // Reset each total display element to 0
  });
}



//Multiplication data

function alltotal() {
  const add500 = parseInt(document.querySelector("#add500").value) || 0;
  const alltotal500 = add500 * 500;
  document.querySelector(".alltotal500").innerHTML = alltotal500;
  const add200 = parseInt(document.querySelector("#add200").value) || 0;
  const alltotal200 = add200 * 200;
  document.querySelector(".alltotal200").innerHTML = alltotal200;
  const add100 = parseInt(document.querySelector("#add100").value) || 0;
  const alltotal100 = add100 * 100;
  document.querySelector(".alltotal100").innerHTML = alltotal100;
  const add50 = parseInt(document.querySelector("#add50").value) || 0;
  const alltotal50 = add50 * 50;
  document.querySelector(".alltotal50").innerHTML = alltotal50;
  const add20 = parseInt(document.querySelector("#add20").value) || 0;
  const alltotal20 = add20 * 20;
  document.querySelector(".alltotal20").innerHTML = alltotal20;
  const add12 = parseInt(document.querySelector("#add12").value) || 0;
  const alltotal12 = add12 * 20;
  document.querySelector(".allout12").innerHTML = alltotal12;
  const add10 = parseInt(document.querySelector("#add10").value) || 0;
  const alltotal10 = add10 * 10;
  document.querySelector(".alltotal10").innerHTML = alltotal10;
  const add11 = parseInt(document.querySelector("#add11").value) || 0;
  const alltotal11 = add11 * 10;
  document.querySelector(".allout11").innerHTML = alltotal11;
  const add5 = parseInt(document.querySelector("#add5").value) || 0;
  const alltotal5 = add5 * 5;
  document.querySelector(".alltotal5").innerHTML = alltotal5;
  const add2 = parseInt(document.querySelector("#add2").value) || 0;
  const alltotal2 = add2 * 2;
  document.querySelector(".alltotal2").innerHTML = alltotal2;
  const add1 = parseInt(document.querySelector("#add1").value) || 0;
  const alltotal1 = add1 * 1;
  document.querySelector(".alltotal1").innerHTML = alltotal1;

  //Input box denomation total
  let total =
    alltotal500 +
    alltotal200 +
    alltotal100 +
    alltotal50 +
    alltotal20 +
    alltotal12 +
    alltotal10 +
    alltotal11 +
    alltotal5 +
    alltotal2 +
    alltotal1;

  document.querySelector(".alldenomation").innerHTML = total;
  document.querySelector(".cashin_total_container").innerHTML = total;
  updateTotal();
}

function subtotal() {
  const sub500 = parseInt(document.querySelector("#sub500").value) || 0;
  const allsub500 = sub500 * 500;
  document.querySelector(".allout500").innerHTML = allsub500;

  const sub200 = parseInt(document.querySelector("#sub200").value) || 0;
  const allsub200 = sub200 * 200;
  document.querySelector(".allout200").innerHTML = allsub200;

  const sub100 = parseInt(document.querySelector("#sub100").value) || 0;
  const allsub100 = sub100 * 100;
  document.querySelector(".allout100").innerHTML = allsub100;

  const sub50 = parseInt(document.querySelector("#sub50").value) || 0;
  const allsub50 = sub50 * 50;
  document.querySelector(".allout50").innerHTML = allsub50;

  const sub20 = parseInt(document.querySelector("#sub20").value) || 0;
  const allsub20 = sub20 * 20;
  document.querySelector(".allout20").innerHTML = allsub20;

  const sub10 = parseInt(document.querySelector("#sub10").value) || 0;
  const allsub10 = sub10 * 10;
  document.querySelector(".allout10").innerHTML = allsub10;

  const sub12 = parseInt(document.querySelector("#sub12c").value) || 0;
  const allsub12 = sub12 * 20;
  document.querySelector(".allout12c").innerHTML = allsub12;

  const sub11 = parseInt(document.querySelector("#sub11c").value) || 0;
  const allsub11 = sub11 * 10;
  document.querySelector(".allout11c").innerHTML = allsub11;

  const sub5 = parseInt(document.querySelector("#sub5").value) || 0;
  const allsub5 = sub5 * 5;
  document.querySelector(".allout5").innerHTML = allsub5;

  const sub2 = parseInt(document.querySelector("#sub2").value) || 0;
  const allsub2 = sub2 * 2;
  document.querySelector(".allout2").innerHTML = allsub2;

  const sub1 = parseInt(document.querySelector("#sub1").value) || 0;
  const allsub1 = sub1 * 1;
  document.querySelector(".allout1").innerHTML = allsub1;

  //Input box denomation total
  let total =
    allsub500 +
    allsub200 +
    allsub100 +
    allsub50 +
    allsub20 +
    allsub10 +
    allsub12 +
    allsub11 +
    allsub5 +
    allsub2 +
    allsub1;

  document.querySelector(".alloutdenomanitaion").innerHTML = total;
  document.querySelector(".cashout_total_container").innerHTML = total;

  updateTotal();
}





// Optional: Update overall totals based on current state
function updateTotal() {
  const grandTotal =
    parseInt(document.querySelector(".alldenomation").innerHTML) || 0;
  const subAddTotal =
    parseInt(document.querySelector(".alloutdenomanitaion").innerHTML) || 0;
  const finalTotal = grandTotal - subAddTotal;

  document.querySelector(".Alltotal_container").innerHTML = finalTotal

  const totalDisplay = document.querySelector(".subaddtotal");
  totalDisplay.innerHTML = `₹ ${finalTotal}`;

  // Update text color based on value
  totalDisplay.style.color = finalTotal < 0 ? "Red" : "Green";

  return finalTotal;
}




let editingRow = null;

// Open modal to add or edit transaction
function openModal(row = null) {
  document.getElementById("transaction-modal").style.display = "flex";
  document.getElementById("modal-title").textContent = row
    ? "Edit Transaction"
    : "Add Transaction";

  if (row) {
    editingRow = row;
    document.getElementById("accountNumber").value = row.cells[0].innerText;
    document.getElementById("name").value = row.cells[1].innerText;
    document.getElementById("amount").value = row.cells[2].innerText;
    document.getElementById("status").value = row.cells[3].innerText;
    document.getElementById("remark").value = row.getAttribute("data-remark");
  } else {
    editingRow = null;
    document.getElementById("accountNumber").value = "";
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("status").value = "Pending";
    document.getElementById("remark").value = "";
  }
}

// Close the modal
function closeModal() {
  document.getElementById("transaction-modal").style.display = "none";
}

// Save transaction data from modal
function saveTransaction() {
  const accountNumber = document.getElementById("accountNumber").value;
  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const status = document.getElementById("status").value;
  const remark = document.getElementById("remark").value;

  const transaction = { accountNumber, name, amount, status, remark };

  if (editingRow) {
    // Update existing row
    editingRow.cells[0].innerText = accountNumber;
    editingRow.cells[1].innerText = name;
    editingRow.cells[2].innerText = amount;
    editingRow.cells[3].innerText = status;
    editingRow.setAttribute("data-remark", remark);
    updateLocalStorage();
  } else {
    // Add new row
    const table = document
      .getElementById("transaction-table")
      .getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).innerText = accountNumber;
    newRow.insertCell(1).innerText = name;
    newRow.insertCell(2).innerText = amount;
    newRow.insertCell(3).innerText = status;

    const actionCell = newRow.insertCell(4);
    actionCell.innerHTML = `<button class="btn btn-edit" onclick="openModal(this.parentNode.parentNode)">Edit</button>
                            <button class="btn btn-delete" onclick="deleteTransaction(this)">Delete</button>`;
    newRow.setAttribute("data-remark", remark);
    saveToLocalStorage(transaction);
  }
  closeModal();
}

// Delete transaction row
function deleteTransaction(button) {
  const row = button.parentNode.parentNode;
  row.remove();
  updateLocalStorage();
}

// Filter transactions by status
function filterTransactions() {
  const filter = document.getElementById("statusFilter").value;
  const rows = document
    .getElementById("transaction-table")
    .getElementsByTagName("tbody")[0].rows;
  for (const row of rows) {
    const status = row.cells[3].innerText;
    row.style.display = filter === "All" || status === filter ? "" : "none";
  }
}

// Save to Local Storage
function saveToLocalStorage(transaction) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update Local Storage
function updateLocalStorage() {
  const rows = document
    .getElementById("transaction-table")
    .getElementsByTagName("tbody")[0].rows;
  const transactions = Array.from(rows).map(row => ({
    accountNumber: row.cells[0].innerText,
    name: row.cells[1].innerText,
    amount: row.cells[2].innerText,
    status: row.cells[3].innerText,
    remark: row.getAttribute("data-remark"),
  }));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Load transactions from Local Storage
function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const table = document
    .getElementById("transaction-table")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = "";
  transactions.forEach(transaction => {
    const newRow = table.insertRow();
    newRow.insertCell(0).innerText = transaction.accountNumber;
    newRow.insertCell(1).innerText = transaction.name;
    newRow.insertCell(2).innerText = transaction.amount;
    newRow.insertCell(3).innerText = transaction.status;

    const actionCell = newRow.insertCell(4);
    actionCell.innerHTML = `<button class="btn btn-edit" onclick="openModal(this.parentNode.parentNode)">Edit</button>
                            <button class="btn btn-delete" onclick="deleteTransaction(this)">Delete</button>`;
    newRow.setAttribute("data-remark", transaction.remark);
  });
}


 loadTransactions()


 function openPopup() {
        document.getElementById("popup").classList.add("active");
        document.getElementById("overlay_js").classList.add("active");
      }

      function closePopup() {
        document.getElementById("popup").classList.remove("active");
        document.getElementById("overlay_js").classList.remove("active");
      }

    