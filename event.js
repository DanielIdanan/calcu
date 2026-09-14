let display = document.getElementById("display");

let current = "0";
let previous = null;
let operator = null;
let memory = 0;
let resetNext = false;

function updateDisplay() {
    display.textContent = current;
}

function appendNumber(digit) {
    if (current === "0" || resetNext) {
        current = digit;
        resetNext = false;
    } else {
        current += digit;
    }
    updateDisplay();
}

function appendDecimal() {
    if (resetNext) {
        current = "0";
        resetNext = false;
    }
    if (!current.includes(".")) {
        current += ".";
    }
    updateDisplay();
}

function chooseOperator(op) {
    if (operator && !resetNext) {
        calculate();
    }
    previous = parseFloat(current);
    operator = op;
    resetNext = true;
}

function calculate() {
    if (operator === null || previous === null) return;

    const a = previous;
    const b = parseFloat(current);
    let result;

    if (operator === "+") result = a + b;
    else if (operator === "-") result = a - b;
    else if (operator === "*") result = a * b;
    else if (operator === "/") result = b === 0 ? "Cannot divide by zero" : a / b;

    current = String(result);
    operator = null;
    previous = null;
    resetNext = true;
    updateDisplay();
}

function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;
    updateDisplay();
}

function clearEntry() {
    current = "0";
    resetNext = false;
    updateDisplay();
}

function backspace() {
    if (current.length > 1) {
        current = current.slice(0, -1);
    } else {
        current = "0";
    }
    updateDisplay();
}

function toggleSign() {
    current = String(parseFloat(current) * -1);
    updateDisplay();
}

function percent() {
    current = String(parseFloat(current) / 100);
    updateDisplay();
}

function reciprocal() {
    const n = parseFloat(current);
    current = n === 0 ? "Cannot divide by zero" : String(1 / n);
    resetNext = true;
    updateDisplay();
}

function square() {
    const n = parseFloat(current);
    current = String(n * n);
    resetNext = true;
    updateDisplay();
}

function squareRoot() {
    const n = parseFloat(current);
    current = n < 0 ? "Invalid input" : String(Math.sqrt(n));
    resetNext = true;
    updateDisplay();
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    current = String(memory);
    resetNext = true;
    updateDisplay();
}

function memoryAdd() {
    memory += parseFloat(current);
}

function memorySubtract() {
    memory -= parseFloat(current);
}

function memoryStore() {
    memory = parseFloat(current);
}
