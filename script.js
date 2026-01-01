class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.currentOperandElement = document.querySelector('.current-operand');
        this.previousOperandElement = document.querySelector('.previous-operand');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
                this.updateDisplay();
            });
        });
        
        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.dataset.operator);
                this.updateDisplay();
            });
        });
        
        // Action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                this.handleAction(button.dataset.action);
                this.updateDisplay();
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
                this.updateDisplay();
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                this.chooseOperation(e.key);
                this.updateDisplay();
            } else if (e.key === 'Enter' || e.key === '=') {
                this.handleAction('equals');
                this.updateDisplay();
            } else if (e.key === 'Escape') {
                this.handleAction('clear');
                this.updateDisplay();
            } else if (e.key === 'Backspace') {
                this.handleAction('delete');
                this.updateDisplay();
            }
        });
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }
    
    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.operation = undefined;
                    this.previousOperand = '';
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }
    
    formatNumber(number) {
        // Handle very large or small numbers
        if (Math.abs(number) > 999999999) {
            return number.toExponential(6);
        }
        
        // Round to avoid floating point precision issues
        const roundedNumber = Math.round(number * 100000000) / 100000000;
        
        // Convert to string and remove trailing zeros
        let stringNumber = roundedNumber.toString();
        if (stringNumber.includes('.')) {
            stringNumber = stringNumber.replace(/\.?0+$/, '');
        }
        
        return stringNumber;
    }
    
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'equals':
                this.compute();
                break;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            const operatorSymbol = this.getOperatorSymbol(this.operation);
            this.previousOperandElement.textContent = `${this.formatNumberForDisplay(this.previousOperand)} ${operatorSymbol}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
        
        // Add animation effect
        this.currentOperandElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.currentOperandElement.style.transform = 'scale(1)';
        }, 100);
    }
    
    getOperatorSymbol(operation) {
        switch (operation) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return operation;
        }
    }
    
    formatNumberForDisplay(number) {
        if (number === '') return '';
        const num = parseFloat(number);
        if (isNaN(num)) return number;
        return this.formatNumber(num);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Add some visual feedback for button clicks
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
        
        // Touch feedback for mobile
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            button.style.transform = '';
        });
    });
});
