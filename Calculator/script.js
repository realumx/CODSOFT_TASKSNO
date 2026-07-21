const display = document.getElementById('display');
let expression = '';
let justCalculated = false;

function updateDisplay() {
    display.textContent = expression === '' ? '0' : expression;
}

function appendNumber(num) {
    if (justCalculated) {
        expression = '';
        justCalculated = false;
    }
    expression += num;
    updateDisplay();
}

function appendOperator(op) {
    if (expression === '' && op !== '-') return;
    justCalculated = false;
    const lastChar = expression.slice(-1);
    if ('+-*/%'.includes(lastChar)) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }
    updateDisplay();
}

function clearAll() {
    expression = '';
    justCalculated = false;
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        let result = Function('"use strict"; return (' + expression.replace(/%/g, '/100*') + ')')();
        if (result === undefined || isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid');
        }
        expression = String(result);
        justCalculated = true;
        updateDisplay();
    } catch (e) {
        display.textContent = 'Error';
        expression = '';
        justCalculated = true;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if (e.key === '.') appendNumber('.');
    else if (['+', '-', '*', '/'].includes(e.key)) appendOperator(e.key);
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
    else if (e.key === 'Backspace') deleteLast();
    else if (e.key === 'Escape') clearAll();
});