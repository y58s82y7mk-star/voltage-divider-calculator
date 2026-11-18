
function calculateVoltage() {

    const vin = Number(document.getElementById("vin").value);
    const r1 = Number(document.getElementById("r1").value);
    const r2 = Number(document.getElementById("r2").value);

    const r1Unit = Number(document.getElementById("r1Unit").value);
    const r2Unit = Number(document.getElementById("r2Unit").value);

    const result = document.querySelector(".result");
    const status = document.getElementById("status");
    const voutDisplay = document.getElementById("vout");
    const powerDisplay = document.getElementById("power");

    function showError(message) {
        result.className = "result error";
        status.innerText = message;
        voutDisplay.innerText = "--";
        powerDisplay.innerText = "--";
    }

    if (
        document.getElementById("vin").value.trim() === "" ||
        document.getElementById("r1").value.trim() === "" ||
        document.getElementById("r2").value.trim() === "" ||
        !Number.isFinite(vin) ||
        !Number.isFinite(r1) ||
        !Number.isFinite(r2) ||
        vin < 0 || r1 <= 0 || r2 <= 0
    ) {
        showError("Please enter valid values");
        return;
    }

    const R1 = r1 * r1Unit;
    const R2 = r2 * r2Unit;

    const vout = vin * R2 / (R1 + R2);
    const current = vin / (R1 + R2);

    const powerR1 = current * current * R1;
    const powerR2 = current * current * R2;

    result.className = "result success";
    status.innerText = "✓ Calculation Ready!";

    voutDisplay.innerText = vout.toFixed(3) + " V";

    powerDisplay.innerText =
        "Current: " + (current * 1000).toFixed(3) + " mA" +
        " | R1: " + (powerR1 * 1000).toFixed(3) + " mW" +
        " | R2: " + (powerR2 * 1000).toFixed(3) + " mW";
}
