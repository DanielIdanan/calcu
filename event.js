let display = document.getElementById("display");
let expression = document.getElementById("expression");
let historyBox = document.getElementById("history");
let historyList = document.getElementById("historyList");
let sidemenu = document.getElementById("sidemenu");
let modeTitle = document.getElementById("modeTitle");
let standardButtons = document.getElementById("standardButtons");
let sciButtons = document.getElementById("sciButtons");
let sciToggles = document.getElementById("sciToggles");
let sciDropdowns = document.getElementById("sciDropdowns");
let current = "0";
let previous = null;
let operator = null;
let memory = 0;
let resetNext = false;
let history = [];
let mode = "standard";
let isRad = true;
let second = false;
let hyp = false;

function updateDisplay() {
    display.textContent = current;
}

function symbol(op) {
    if (op === "*") return "\u00D7";
    if (op === "/") return "\u00F7";
    if (op === "-") return "\u2212";
    if (op === "mod") return "mod";
    if (op === "pow") return "^";
    return "+";
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
    expression.textContent = previous + " " + symbol(op);
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
    else if (operator === "mod") result = a % b;
    else if (operator === "pow") result = Math.pow(a, b);

    const line = a + " " + symbol(operator) + " " + b + " =";
    expression.textContent = line;
    addHistory(line, String(result));

    current = String(result);
    operator = null;
    previous = null;
    resetNext = true;
    updateDisplay();
}

function addHistory(line, answer) {
    history.unshift({ line: line, answer: answer });
    drawHistory();
}

function drawHistory() {
    if (history.length === 0) {
        historyList.innerHTML = "<p class='empty'>There's no history yet.</p>";
        return;
    }
    historyList.innerHTML = "";
    for (let i = 0; i < history.length; i++) {
        let item = document.createElement("div");
        item.className = "hitem";
        item.innerHTML = "<span class='hline'>" + history[i].line + "</span><span class='hans'>" + history[i].answer + "</span>";
        item.onclick = (function (n) {
            return function () {
                current = history[n].answer;
                resetNext = true;
                expression.textContent = "";
                updateDisplay();
                toggleHistory();
            };
        })(i);
        historyList.appendChild(item);
    }
}

function toggleHistory() {
    historyBox.classList.toggle("hidden");
    sidemenu.classList.add("hidden");
}

function clearHistory() {
    history = [];
    drawHistory();
}

function toggleMenu() {
    sidemenu.classList.toggle("hidden");
    historyBox.classList.add("hidden");
}

function setMode(m) {
    mode = m;
    sidemenu.classList.add("hidden");
    if (m === "standard") {
        modeTitle.textContent = "Standard";
        standardButtons.classList.remove("hidden");
        sciButtons.classList.add("hidden");
        sciToggles.classList.add("hidden");
        sciDropdowns.classList.add("hidden");
    } else {
        modeTitle.textContent = "Scientific";
        standardButtons.classList.add("hidden");
        sciButtons.classList.remove("hidden");
        sciToggles.classList.remove("hidden");
        sciDropdowns.classList.remove("hidden");
    }
}

function toggleRad() {
    isRad = !isRad;
    document.getElementById("radBtn").textContent = isRad ? "RAD" : "DEG";
}

function toggleFE() {
    document.getElementById("feBtn").classList.toggle("active");
}

function toggleTrig() {
    document.getElementById("trigList").classList.toggle("hidden");
    document.getElementById("funcList").classList.add("hidden");
}

function toggleFunc() {
    document.getElementById("funcList").classList.toggle("hidden");
    document.getElementById("trigList").classList.add("hidden");
}

function sciSecond() {
    second = !second;
}

function angleVal(n) {
    return isRad ? n : n * Math.PI / 180;
}

function sciFunc(name) {
    const n = parseFloat(current);
    let result;
    if (name === "floor") result = Math.floor(n);
    else if (name === "ceil") result = Math.ceil(n);
    else if (name === "abs") result = Math.abs(n);
    expression.textContent = name + "(" + current + ")";
    current = String(result);
    resetNext = true;
    updateDisplay();
    document.getElementById("trigList").classList.add("hidden");
    document.getElementById("funcList").classList.add("hidden");
}

function randFunc() {
    current = String(Math.random());
    resetNext = true;
    expression.textContent = "rand()";
    updateDisplay();
    document.getElementById("funcList").classList.add("hidden");
}

function toggleTrigSecond() {
    second = !second;
    document.getElementById("trig2nd").classList.toggle("active");
}

function toggleHyp() {
    hyp = !hyp;
    document.getElementById("trigHyp").classList.toggle("active");
}

function trigCompute(base) {
    const n = parseFloat(current);
    let result;
    if (!second && !hyp) {
        if (base === "sin") result = Math.sin(angleVal(n));
        else if (base === "cos") result = Math.cos(angleVal(n));
        else if (base === "tan") result = Math.tan(angleVal(n));
        else if (base === "sec") result = 1 / Math.cos(angleVal(n));
        else if (base === "csc") result = 1 / Math.sin(angleVal(n));
        else if (base === "cot") result = 1 / Math.tan(angleVal(n));
    } else if (second && !hyp) {
        if (base === "sin") result = Math.asin(n);
        else if (base === "cos") result = Math.acos(n);
        else if (base === "tan") result = Math.atan(n);
        else if (base === "sec") result = Math.acos(1 / n);
        else if (base === "csc") result = Math.asin(1 / n);
        else if (base === "cot") result = Math.atan(1 / n);
    } else if (!second && hyp) {
        if (base === "sin") result = Math.sinh(n);
        else if (base === "cos") result = Math.cosh(n);
        else if (base === "tan") result = Math.tanh(n);
        else if (base === "sec") result = 1 / Math.cosh(n);
        else if (base === "csc") result = 1 / Math.sinh(n);
        else if (base === "cot") result = 1 / Math.tanh(n);
    } else {
        if (base === "sin") result = Math.asinh(n);
        else if (base === "cos") result = Math.acosh(n);
        else if (base === "tan") result = Math.atanh(n);
        else if (base === "sec") result = Math.acosh(1 / n);
        else if (base === "csc") result = Math.asinh(1 / n);
        else if (base === "cot") result = Math.atanh(1 / n);
    }
    let label = (second ? "a" : "") + base + (hyp ? "h" : "");
    expression.textContent = label + "(" + current + ")";
    current = String(result);
    resetNext = true;
    updateDisplay();
    document.getElementById("trigList").classList.add("hidden");
    document.getElementById("funcList").classList.add("hidden");
}

function insertConst(name) {
    current = name === "pi" ? String(Math.PI) : String(Math.E);
    resetNext = true;
    updateDisplay();
}

function absVal() {
    current = String(Math.abs(parseFloat(current)));
    updateDisplay();
}

function expFunc() {
    current = String(Math.exp(parseFloat(current)));
    resetNext = true;
    updateDisplay();
}

function cubeRoot() {
    current = String(Math.cbrt(parseFloat(current)));
    resetNext = true;
    updateDisplay();
}

function appendOpen() {
    current += "(";
    updateDisplay();
}

function appendClose() {
    current += ")";
    updateDisplay();
}

function factorial() {
    let n = parseFloat(current);
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    current = String(result);
    resetNext = true;
    updateDisplay();
}

function power() {
    chooseOperator("pow");
}

function powerOf10() {
    current = String(Math.pow(10, parseFloat(current)));
    resetNext = true;
    updateDisplay();
}

function logFunc() {
    current = String(Math.log10(parseFloat(current)));
    resetNext = true;
    updateDisplay();
}

function lnFunc() {
    current = String(Math.log(parseFloat(current)));
    resetNext = true;
    updateDisplay();
}

function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;
    expression.textContent = "";
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
    expression.textContent = "1/(" + current + ")";
    current = n === 0 ? "Cannot divide by zero" : String(1 / n);
    resetNext = true;
    updateDisplay();
}

function square() {
    const n = parseFloat(current);
    expression.textContent = "sqr(" + current + ")";
    current = String(n * n);
    resetNext = true;
    updateDisplay();
}

function squareRoot() {
    const n = parseFloat(current);
    expression.textContent = "\u221A(" + current + ")";
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
