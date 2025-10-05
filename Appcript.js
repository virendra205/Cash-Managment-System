

function doGet(e) {
  if (e.parameter.page === 'cashbook') {
    return HtmlService.createHtmlOutputFromFile('Cashbook').setTitle('Cashbook');
  } else {
    return HtmlService.createHtmlOutputFromFile('display').setTitle('CMS System');
  }
}

function getCashbookUrl() {
  return ScriptApp.getService().getUrl() + '?page=cashbook';
}

  
// Google Apps Script code (back-end)
function denomination(denodata) {
  try {
    let data = denodata.parameter; // Extract data passed from the client
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Deno'); // Specify the sheet name
    
    // Check if sheet exists
    if (!sheet) {
      return ContentService.createTextOutput("Sheet not found!").setMimeType(ContentService.MimeType.TEXT);
    }

    // Validation logic with an if condition
      // if (!data.customername) {
      //   Logger.log("Validation Error: Account and Customer Name are required.");
      //   return; // Exit the function early if validation fails
      // }

    // Define the row number you want to update
    let targetRow = 2; // Change this to the row number you want to update

    // List of cash denominations
    let denominations = [500, 200, 100, 50, 20, 10, 12, 11, 5, 2, 1]; 
    let values = []; // Array to hold the updated values for each denomination

    // Fetch existing values from the sheet (e.g., row 2)
    let existingValues = sheet.getRange(targetRow, 1, 1, denominations.length).getValues()[0];

    // Ensure that existing values are numbers, otherwise set to 0
    existingValues = existingValues.map(value => isNaN(Number(value)) ? 0 : Number(value));

    // Loop through each denomination and calculate the updated total
    for (let i = 0; i < denominations.length; i++) {
      let denomination = denominations[i];

      // Fetch data from parameters and ensure it's a number
      let addcash = Number(data[`addcash${denomination}`]) || 0;
      let cashin = Number(data[`cashin${denomination}`]) || 0;
      let cashout = Number(data[`cashout${denomination}`]) || 0;

      // Calculate the updated total for this denomination
      let total = existingValues[i] + addcash + cashin - cashout;
      values.push(total); // Store the updated value in the array

      // Log the computation for each denomination
      Logger.log('Denomination: ' + denomination + ', addcash: ' + addcash + ', cashin: ' + cashin + ', cashout: ' + cashout + ', total: ' + total);
    }

    // Update the specified row with the new values
    sheet.getRange(targetRow, 1, 1, values.length).setValues([values]);

    // Log final values to be updated
    Logger.log('Updated Values: ' + values);

    // Return success response
    return ContentService.createTextOutput("Data Updated Successfully :)").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    Logger.log("Error: " + error.message);
    return ContentService.createTextOutput("An error occurred: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
}






function submitData(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");


  // Calculate total cash in and total cash out
  const totalCashIn = 
    (data.cashin500 || 0) * 500 +
    (data.cashin200 || 0) * 200 +
    (data.cashin100 || 0) * 100 +
    (data.cashin50 || 0) * 50 +
    (data.cashin20 || 0) * 20 +
    (data.cashin12 || 0) * 20 +
    (data.cashin10 || 0) * 10 +
    (data.cashin11 || 0) * 10 +
    (data.cashin5 || 0) * 5 +
    (data.cashin2 || 0) * 2 +
    (data.cashin1 || 0) * 1;

  const totalCashOut = 
    (data.cashout500 || 0) * 500 +
    (data.cashout200 || 0) * 200 +
    (data.cashout100 || 0) * 100 +
    (data.cashout50 || 0) * 50 +
    (data.cashout20 || 0) * 20 +
    (data.cashout12 || 0) * 20 +
    (data.cashout10 || 0) * 10 +
    (data.cashout11 || 0) * 10 +
    (data.cashout5 || 0) * 5 +
    (data.cashout2 || 0) * 2 +
    (data.cashout1 || 0) * 1;

  // Calculate total transaction amount (difference between cash in and cash out)
  const totalTransactionAmount = totalCashIn - totalCashOut;

  // Prepare row data for sheet
  let rowData = [
    data.datanameanddate,        // Date/Name of Data
    data.account,
    data.customername,           // Customer Name
    totalTransactionAmount,      // Total Transaction Amount
    data.cashin500,              // Cash In 500
    data.cashin200,              // Cash In 200
    data.cashin100,              // Cash In 100
    data.cashin50,               // Cash In 50
    data.cashin20,               // Cash In 20
    data.cashin12,               // Cash In 12
    data.cashin10,               // Cash In 10
    data.cashin11,               // Cash In 11
    data.cashin5,                // Cash In 5
    data.cashin2,                // Cash In 2
    data.cashin1,                // Cash In 1
    data.cashout500,             // Cash Out 500
    data.cashout200,             // Cash Out 200
    data.cashout100,             // Cash Out 100
    data.cashout50,              // Cash Out 50
    data.cashout20,              // Cash Out 20
    data.cashout12,              // Cash Out 12
    data.cashout10,              // Cash Out 10
    data.cashout11,              // Cash Out 11
    data.cashout5,               // Cash Out 5
    data.cashout2,               // Cash Out 2
    data.cashout1,               // Cash Out 1
    totalCashIn,                 // Total Cash In
    totalCashOut                 // Total Cash Out
  ];

  // Insert a new row at the second position and set values
  sheet.insertRowBefore(2);
  sheet.getRange(2, 1, 1, rowData.length).setValues([rowData]);
}




// Function to save cash book data
function saveCashBookData(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("cashbook");
    if (!sheet) {
      throw new Error("Sheet named 'Sheet1' not found.");
    }

    // Format the current date
    const currentDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

    // Convert input sections into single-line strings for better readability
    const morningInputs = data.morning.map(item => `${item.label}: ₹${item.value}`).join(", ");
    const eveningInputs = data.evening.map(item => `${item.label}: ₹${item.value}`).join(", ");
    const accountInputs = data.account.map(item => `${item.label}: ₹${item.value}`).join(", ");

    // Append the data to the sheet
    sheet.appendRow([
      currentDate,               // Date
      data.morningTotal,         // Total Morning
      data.eveningTotal,         // Total Evening
      data.accountTotal,         // Total Account
      data.balance,              // Balance
      morningInputs,             // Morning Details
      eveningInputs,             // Evening Details
      accountInputs              // Account Details
    ]);

    // Success response
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Data saved successfully!" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error saving data: " + error.message);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Failed to save data. " + error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}




function getDenoData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Deno');
  const range = sheet.getRange(2, 1, 2, 12); // 3 rows, 12 columns
  const data = range.getValues(); // Get all data as a 2D array
  return data;
}

// This function fetches the first 100 rows from the active sheet
function getDataFromSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
  var data = sheet.getRange(2, 1, 100, sheet.getLastColumn()).getValues();
  
   // Format dates
  const formattedData = data.map(row => 
    row.map(cell => (cell instanceof Date) ? 
      Utilities.formatDate(cell, Session.getScriptTimeZone(), "MM/dd/yyyy HH:mm:ss") : 
      cell)
  );

  return formattedData;
}




 // Fetch data from Google Sheets by date
  function fetchFromSheet(date) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("cashbook");
  if (!sheet) {
    throw new Error("Sheet not found.");
  }

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) { // Start from row 2 to skip the header
    const sheetDate = Utilities.formatDate(new Date(data[i][0]), Session.getScriptTimeZone(), "yyyy-MM-dd");
    if (sheetDate === date) { // Compare normalized dates
      return {
         morning: [{ label: "Cash", value: data[i][1] }, { label: "Saving", value: data[i][2] }],
         evening: [{ label: "Cash", value: data[i][3] }, { label: "Saving", value: data[i][4] }],
         account: [{ label: "Account", value: data[i][5] }, { label: "KYC", value: data[i][6] }]

      };
    }
  }
  return null; // No data found for the given date
} 





