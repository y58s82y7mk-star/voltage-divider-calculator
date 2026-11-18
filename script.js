
/* ======================================
   PLANET SPARK TECHNOLOGY
   VOLTAGE DIVIDER CALCULATOR
   VERSION 3
====================================== */

const fields = ["vin", "r1", "r2", "vout"];

let calculatedField = null;

const resultBox = document.querySelector(".result");
const statusText = document.getElementById("status");
const detailsText = document.getElementById("details");

const unitMultipliers = {
    r1: document.getElementById("r1Unit"),
    r2: document.getElementById("r2Unit")
};

// Remove previous calculated result when another known
// input is edited, allowing a fresh calculation.
fields.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {

        if (calculatedField && id !== calculatedField) {
            document.getElementById(calculatedField).value = "";
            clearHighlight();
        } else if (id === calculatedField) {
            clearHighlight();
        }

        resultBox.className = "result";
        statusText.innerText = "Ready to calculate";
        detailsText.innerText = "Enter any three known values to calculate the fourth.";
    });
});

// Also reset when resistor units change
["r1Unit", "r2Unit"].forEach(id => {
    document.getElementById(id).addEventListener("change", function () {

        if (calculatedField) {
            document.getElementById(calculatedField).value = "";
            clearHighlight();
        }

        resultBox.className = "result";
        statusText.innerText = "Ready to calculate";
        detailsText.innerText = "Enter any three known values to calculate the fourth.";
    });
});

// Clear calculated field highlighting
function clearHighlight() {
    fields.forEach(id => {
        document.getElementById(id + "Group").classList.remove("calculated");
    });

    calculatedField = null;
}

// Display errors
function showError(message) {
    resultBox.className = "result error";
    statusText.innerText = "Calculation Error";
    detailsText.innerText = message;
}

// Display successful calculation
function showSuccess(message) {
    resultBox.className = "result success";
    statusText.innerText = "✓ Calculation Successful";
    detailsText.innerText = message;
}

// Main calculation function
function calculate() {

    clearHighlight();

    const values = {};

    // Read all four fields
    fields.forEach(id => {
        const input = document.getElementById(id);
        values[id] = input.value.trim() === ""
            ? null
            : Number(input.value);
    });

    // Identify known and missing fields
    const knownFields = fields.filter(id => values[id] !== null);
    const missingFields = fields.filter(id => values[id] === null);

    // Exactly three values are required
    if (knownFields.length !== 3) {
        showError("Please enter exactly THREE known values.");
        return;
    }

    // Validate known values
    for (const id of knownFields) {
        if (!Number.isFinite(values[id]) || values[id] <= 0) {
            showError("All known values must be positive numbers.");
            return;
        }
    }

    // Convert resistor values into Ohms
    const R1 = values.r1 !== null
        ? values.r1 * Number(unitMultipliers.r1.value)
        : null;

    const R2 = values.r2 !== null
        ? values.r2 * Number(unitMultipliers.r2.value)
        : null;

    const Vin = values.vin;
    const Vout = values.vout;

    const missing = missingFields[0];

    let answer;

    // --------------------------------
    // Calculate Vin
    // --------------------------------

    if (missing === "vin") {

        if (Vout <= 0 || R1 <= 0 || R2 <= 0) {
            showError("Invalid resistor or output voltage.");
            return;
        }

        answer = Vout * (R1 + R2) / R2;
    }

    // --------------------------------
    // Calculate R1
    // --------------------------------

    else if (missing === "r1") {

        if (Vin <= Vout) {
            showError("Vin must be greater than Vout.");
            return;
        }

        answer = R2 * (Vin / Vout - 1);
    }

    // --------------------------------
    // Calculate R2
    // --------------------------------

    else if (missing === "r2") {

        if (Vin <= Vout) {
            showError("Vin must be greater than Vout.");
            return;
        }

        answer = (R1 * Vout) / (Vin - Vout);
    }

    // --------------------------------
    // Calculate Vout
    // --------------------------------

    else if (missing === "vout") {

        answer = Vin * R2 / (R1 + R2);
    }

    // Validate calculated result
    if (!Number.isFinite(answer) || answer <= 0) {
        showError("Unable to calculate a valid result. Check your inputs.");
        return;
    }

    // Convert answer into selected display unit
    let displayValue = answer;
    let displayUnit = "V";

    if (missing === "r1" || missing === "r2") {

        const multiplier = Number(
            document.getElementById(missing + "Unit").value
        );

        displayValue = answer / multiplier;

        displayUnit =
            multiplier === 1000000 ? "MΩ" :
            multiplier === 1000 ? "kΩ" : "Ω";
    }

    // Check display value
    if (!Number.isFinite(displayValue)) {
        showError("Calculated result is outside the supported range.");
        return;
    }

    // Insert answer into missing field
    const answerText = Number(displayValue.toPrecision(8)).toString();

    document.getElementById(missing).value = answerText;

    // Highlight calculated field
    document.getElementById(missing + "Group")
        .classList.add("calculated");

    calculatedField = missing;

    // Show status
    showSuccess(
        "Calculated " +
        missing.toUpperCase() +
        " = " +
        answerText +
        " " +
        displayUnit +
        ". The calculated field is highlighted in orange."
    );
}

// Connect Calculate button
document.getElementById("calculateBtn")
    .addEventListener("click", calculate);
